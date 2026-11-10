const { google } = require('googleapis');
const fs = require('fs');
const SITE = 'https://ukltdregistration.com/';
const DAYS = parseInt(process.argv[2] || '28', 10);

function iso(d) { return d.toISOString().slice(0, 10); }

(async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'C:/Users/accts/workspace/ukltdregistration-sa.json',
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const wm = google.webmasters({ version: 'v3', auth });

  const end = new Date(); end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - (DAYS - 1));

  const r = await wm.searchanalytics.query({
    siteUrl: SITE,
    requestBody: {
      startDate: iso(start), endDate: iso(end),
      dimensions: ['page'], rowLimit: 25000,
    },
  });
  const rows = (r.data.rows || []).sort((a, b) => b.impressions - a.impressions);
  console.log('Pages with impressions, last ' + DAYS + ' days: ' + rows.length);
  console.log('Total impressions: ' + rows.reduce((a, x) => a + x.impressions, 0));
  console.log('');
  console.log('IMP'.padStart(7) + '  CLK'.padStart(5) + '  CTR'.padStart(7) + '  POS'.padStart(6) + '  PAGE');
  for (const x of rows.slice(0, 45)) {
    console.log(
      String(x.impressions).padStart(7) + '  ' +
      String(x.clicks).padStart(5) + '  ' +
      (x.ctr * 100).toFixed(2).padStart(6) + '%  ' +
      x.position.toFixed(1).padStart(6) + '  ' +
      x.keys[0].replace('https://ukltdregistration.com', '')
    );
  }
  fs.writeFileSync(require('path').join(__dirname, 'gsc-all-pages-' + iso(start) + '_' + iso(end) + '.json'), JSON.stringify(rows, null, 2));
})().catch((e) => { console.error('ERROR: ' + e.message); process.exit(1); });
