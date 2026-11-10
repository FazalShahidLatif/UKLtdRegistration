/**
 * GSC trend + query comparison
 * - Weekly impressions/clicks for the last N weeks
 * - Top queries, recent vs previous equal-length period, sorted by impression change
 *
 * Usage: node scripts/gsc-trend.js [days]
 */

const { google } = require('googleapis');
const fs = require('fs');

const SITE = 'https://ukltdregistration.com/';
const DEFAULT_KEY = 'C:/Users/accts/workspace/ukltdregistration-sa.json';
const DAYS = parseInt(process.argv[2] || '90', 10);

function iso(d) { return d.toISOString().slice(0, 10); }

function weekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return iso(d);
}

(async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.INDEXING_SA_KEY || DEFAULT_KEY,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const wm = google.webmasters({ version: 'v3', auth });

  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (DAYS - 1));
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - (DAYS - 1));

  const range = { start: iso(start), end: iso(end) };
  const prevRange = { start: iso(prevStart), end: iso(prevEnd) };
  console.log('Recent:  ' + range.start + ' to ' + range.end);
  console.log('Previous: ' + prevRange.start + ' to ' + prevRange.end);
  console.log('');

  // --- daily trend ---
  const daily = await wm.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate: range.start, endDate: range.end, dimensions: ['date'], rowLimit: 25000 },
  });
  const weeks = {};
  for (const r of (daily.data.rows || [])) {
    const w = weekKey(r.keys[0]);
    if (!weeks[w]) weeks[w] = { impressions: 0, clicks: 0 };
    weeks[w].impressions += r.impressions;
    weeks[w].clicks += r.clicks;
  }
  console.log('=== WEEKLY TREND ===');
  console.log('WEEK START'.padEnd(12) + 'IMP'.padStart(8) + 'CLICK'.padStart(7));
  Object.keys(weeks).sort().forEach((w) => {
    console.log(w.padEnd(12) + String(weeks[w].impressions).padStart(8) + String(weeks[w].clicks).padStart(7));
  });
  console.log('');

  // --- query comparison ---
  const q = async (r) => {
    const res = await wm.searchanalytics.query({
      siteUrl: SITE,
      requestBody: { startDate: r.start, endDate: r.end, dimensions: ['query'], rowLimit: 25000 },
    });
    return res.data.rows || [];
  };
  const recentQ = await q(range);
  const prevQ = await q(prevRange);

  const prevMap = new Map(prevQ.map((r) => [r.keys[0], r]));
  const rows = recentQ.map((r) => {
    const p = prevMap.get(r.keys[0]) || { impressions: 0, clicks: 0, position: 0 };
    return {
      query: r.keys[0],
      impressions: r.impressions,
      clicks: r.clicks,
      position: r.position,
      prevImpressions: p.impressions,
      prevClicks: p.clicks,
      delta: r.impressions - p.impressions,
    };
  });

  const gained = rows.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 15);
  const lost = rows.filter((r) => r.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 20);

  console.log('=== QUERIES THAT GAINED IMPRESSIONS (top 15) ===');
  console.log('IMP'.padStart(7) + '  PREV'.padStart(7) + '  DELTA'.padStart(7) + '  POS'.padStart(6) + '  QUERY');
  for (const r of gained) {
    console.log(String(r.impressions).padStart(7) + String(r.prevImpressions).padStart(8) + ('+' + r.delta).padStart(7) + r.position.toFixed(1).padStart(7) + '  ' + r.query);
  }
  console.log('');

  console.log('=== QUERIES THAT LOST IMPRESSIONS (top 20) ===');
  console.log('IMP'.padStart(7) + '  PREV'.padStart(7) + '  DELTA'.padStart(7) + '  POS'.padStart(6) + '  QUERY');
  for (const r of lost) {
    console.log(String(r.impressions).padStart(7) + String(r.prevImpressions).padStart(8) + String(r.delta).padStart(7) + r.position.toFixed(1).padStart(7) + '  ' + r.query);
  }

  fs.writeFileSync(
    require('path').join(__dirname, 'gsc-trend-' + range.start + '_' + range.end + '.json'),
    JSON.stringify({ range, prevRange, weeks, gained, lost }, null, 2)
  );
})().catch((e) => { console.error('ERROR: ' + e.message); process.exit(1); });
