/**
 * Google Indexing API submission
 *
 * Submits a list of URLs to the Indexing API with type URL_UPDATED so Google
 * re-crawls them quickly after content changes.
 *
 * Usage:
 *   node scripts/index-urls.js <urls-json-file>
 *
 * The JSON file must be an array of absolute URLs:
 *   ["https://ukltdregistration.com/foo", "https://ukltdregistration.com/bar"]
 *
 * The service account key is read from:
 *   - the INDEXING_SA_KEY environment variable, or
 *   - C:/Users/accts/workspace/ukltdregistration-sa.json
 *
 * The service account email must be added as an Owner in Google Search Console
 * for the property, otherwise every submission returns 403.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const DEFAULT_KEY_PATH = 'C:/Users/accts/workspace/ukltdregistration-sa.json';

function readKey() {
  const p = process.env.INDEXING_SA_KEY || DEFAULT_KEY_PATH;
  if (!fs.existsSync(p)) {
    console.error('Service account key not found at: ' + p);
    console.error('Set INDEXING_SA_KEY or place the key at the default path.');
    process.exit(1);
  }
  return p;
}

function readUrls() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/index-urls.js <urls-json-file>');
    process.exit(1);
  }
  const resolved = path.resolve(file);
  if (!fs.existsSync(resolved)) {
    console.error('URL file not found: ' + resolved);
    process.exit(1);
  }
  const urls = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  if (!Array.isArray(urls) || urls.length === 0) {
    console.error('URL file must contain a non-empty JSON array of URLs.');
    process.exit(1);
  }
  return urls;
}

(async () => {
  const keyPath = readKey();
  const urls = readUrls();

  const sa = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  console.log('Service account: ' + sa.client_email);
  console.log('Project: ' + sa.project_id);
  console.log('URLs to submit: ' + urls.length);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  let ok = 0;
  const failures = [];

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      console.log('  OK   ' + url);
      ok++;
    } catch (err) {
      const code = err.response && err.response.status;
      const msg = (err.response && err.response.data && err.response.data.error && err.response.data.error.message) || err.message;
      console.log('  FAIL ' + url + ' [' + code + '] ' + msg);
      failures.push({ url, code, msg });
    }
    // Small delay to stay clear of rate limits.
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('');
  console.log('Submitted: ' + ok + '/' + urls.length);
  if (failures.length) {
    console.log('Failures:');
    for (const f of failures) console.log('  ' + f.url + ' [' + f.code + '] ' + f.msg);
    process.exit(1);
  }
})().catch((e) => {
  console.error('Fatal error: ' + e.message);
  process.exit(1);
});
