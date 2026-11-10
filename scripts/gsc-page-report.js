/**
 * GSC per-page performance report
 *
 * Pulls Search Analytics by page for a given date range and prints a table
 * filtered to a list of target URLs, plus a comparison against the previous
 * equal-length period.
 *
 * Usage:
 *   node scripts/gsc-page-report.js [days]        (default 28)
 *
 * Reads the service account key from INDEXING_SA_KEY or the workspace default.
 * Writes the raw JSON to scripts/gsc-report-<range>.json.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SITE = 'https://ukltdregistration.com/';
const DEFAULT_KEY = 'C:/Users/accts/workspace/ukltdregistration-sa.json';
const DAYS = parseInt(process.argv[2] || '28', 10);

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function range(offsetDays, lengthDays) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - offsetDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (lengthDays - 1));
  return { start: iso(start), end: iso(end) };
}

async function query(auth, body) {
  const webmasters = google.webmasters({ version: 'v3', auth });
  const res = await webmasters.searchanalytics.query({ siteUrl: SITE, requestBody: body });
  return res.data.rows || [];
}

(async () => {
  const keyPath = process.env.INDEXING_SA_KEY || DEFAULT_KEY;
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const recent = range(3, DAYS);      // latest complete data (GSC lags ~3 days)
  const previous = range(3 + DAYS, DAYS);

  console.log('Site: ' + SITE);
  console.log('Recent:  ' + recent.start + ' to ' + recent.end + ' (' + DAYS + ' days)');
  console.log('Previous: ' + previous.start + ' to ' + previous.end + ' (' + DAYS + ' days)');
  console.log('');

  const recentRows = await query(auth, {
    startDate: recent.start,
    endDate: recent.end,
    dimensions: ['page'],
    rowLimit: 25000,
  });
  const prevRows = await query(auth, {
    startDate: previous.start,
    endDate: previous.end,
    dimensions: ['page'],
    rowLimit: 25000,
  });

  const targets = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls-batch1-4.json'), 'utf8'));

  const norm = (u) => u.replace(/\/$/, '').toLowerCase();
  const targetSet = new Set(targets.map(norm));

  const prevMap = new Map();
  for (const r of prevRows) prevMap.set(norm(r.keys[0]), r);

  const rows = recentRows
    .filter((r) => targetSet.has(norm(r.keys[0])))
    .map((r) => {
      const p = prevMap.get(norm(r.keys[0])) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      return {
        page: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: r.ctr,
        position: r.position,
        prevImpressions: p.impressions,
        prevClicks: p.clicks,
        prevPosition: p.position,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const totals = rows.reduce(
    (acc, r) => {
      acc.impressions += r.impressions;
      acc.clicks += r.clicks;
      acc.prevImpressions += r.prevImpressions;
      acc.prevClicks += r.prevClicks;
      return acc;
    },
    { impressions: 0, clicks: 0, prevImpressions: 0, prevClicks: 0 }
  );

  console.log('=== TARGET PAGES — last ' + DAYS + ' days ===');
  console.log(
    'IMP'.padStart(7) + '  ' + 'CLK'.padStart(5) + '  ' + 'CTR'.padStart(6) + '  ' + 'POS'.padStart(6) +
    '  | ' + 'PREV IMP'.padStart(8) + '  ' + 'DELTA'.padStart(7) + '  PAGE'
  );
  for (const r of rows) {
    const delta = r.impressions - r.prevImpressions;
    const sign = delta > 0 ? '+' : '';
    console.log(
      String(r.impressions).padStart(7) + '  ' +
      String(r.clicks).padStart(5) + '  ' +
      (r.ctr * 100).toFixed(2).padStart(5) + '%  ' +
      r.position.toFixed(1).padStart(6) +
      '  | ' + String(r.prevImpressions).padStart(8) + '  ' +
      (sign + delta).padStart(7) + '  ' + r.page.replace('https://ukltdregistration.com', '')
    );
  }

  console.log('');
  console.log('Target pages with impressions: ' + rows.length + ' of ' + targets.length);
  console.log('Target totals  recent: ' + totals.impressions + ' impressions, ' + totals.clicks + ' clicks');
  console.log('Target totals previous: ' + totals.prevImpressions + ' impressions, ' + totals.prevClicks + ' clicks');
  const tDelta = totals.impressions - totals.prevImpressions;
  console.log(
    'Change: ' + (tDelta > 0 ? '+' : '') + tDelta + ' impressions (' +
    (totals.prevImpressions ? ((tDelta / totals.prevImpressions) * 100).toFixed(1) : 'n/a') + '%)'
  );

  // Whole-site totals for context.
  const siteRecent = recentRows.reduce((a, r) => { a.impressions += r.impressions; a.clicks += r.clicks; return a; }, { impressions: 0, clicks: 0 });
  const sitePrev = prevRows.reduce((a, r) => { a.impressions += r.impressions; a.clicks += r.clicks; return a; }, { impressions: 0, clicks: 0 });
  console.log('');
  console.log('Whole site recent:  ' + siteRecent.impressions + ' impressions, ' + siteRecent.clicks + ' clicks');
  console.log('Whole site previous: ' + sitePrev.impressions + ' impressions, ' + sitePrev.clicks + ' clicks');

  const out = path.join(__dirname, 'gsc-report-' + recent.start + '_' + recent.end + '.json');
  fs.writeFileSync(out, JSON.stringify({ recent, previous, rows, siteRecent, sitePrev }, null, 2));
  console.log('');
  console.log('Raw data written to ' + out);
})().catch((e) => {
  console.error('ERROR: ' + e.message);
  process.exit(1);
});
