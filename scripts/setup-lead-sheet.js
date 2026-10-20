/**
 * Setup — create the central Google Sheet for lead capture.
 *
 * Creates the spreadsheet, writes the standard header row, and shares it with
 * the owner's personal Gmail so it can be opened in the browser.
 *
 * Run:  node scripts/setup-lead-sheet.js
 * Then set LEAD_SHEET_ID in the deployment environment.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { google } = require('googleapis');

const SERVICE_ACCOUNT_PATH = process.env.LEAD_SERVICE_ACCOUNT ||
    path.join(os.homedir(), 'Downloads', 'saasskul-xyz-9acb3da4db85.json');
const OWNER_EMAIL = process.env.LEAD_OWNER_EMAIL || 'accts.pak@gmail.com';
const SHEET_TITLE = process.env.LEAD_SHEET_TITLE || 'UK LTD Registration — Leads';

const HEADER = [
    'Timestamp', 'Property / Website', 'Visitor Name / Alias', 'Email / Contact',
    'Intent / Service Requested', 'Source URL', 'Status'
];

async function main() {
    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    // 1. Create the spreadsheet
    const created = await sheets.spreadsheets.create({
        requestBody: {
            properties: { title: SHEET_TITLE },
            sheets: [{ properties: { title: 'Leads', gridProperties: { frozenRowCount: 1 } } }]
        },
        fields: 'spreadsheetId,spreadsheetUrl,properties.title'
    });

    const spreadsheetId = created.data.spreadsheetId;
    console.log('Created spreadsheet:', created.data.properties.title);
    console.log('spreadsheetId     :', spreadsheetId);
    console.log('spreadsheetUrl    :', created.data.spreadsheetUrl);

    // 2. Write the header row and freeze it
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Leads!A1:G1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [HEADER] }
    });
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{
                updateSheetProperties: {
                    properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } },
                    fields: 'gridProperties.frozenRowCount'
                }
            }]
        }
    });
    console.log('Header row written and frozen.');

    // 3. Share with the owner's personal Gmail so it opens in a browser
    await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: { role: 'writer', type: 'user', emailAddress: OWNER_EMAIL },
        sendNotificationEmail: true
    });
    console.log('Shared with:', OWNER_EMAIL);

    console.log('\nSet this in the deployment environment:');
    console.log('LEAD_SHEET_ID=' + spreadsheetId);
}

main().catch(err => {
    console.error('FAILED:', err.message);
    if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
    process.exit(1);
});
