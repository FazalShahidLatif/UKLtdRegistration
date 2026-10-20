/**
 * Lead Store
 * Durable lead capture for every enquiry path on the site.
 *
 * Mandate: every lead must be appended to the central Google Sheet immediately,
 * with Timestamp, Property/Website, Visitor Name, Email, Intent, Source URL and
 * Status.
 *
 * Design:
 *   1. ALWAYS append to data/leads.jsonl — durable, works with zero external
 *      dependencies, and survives email delivery failures. This is the
 *      fallback that guarantees no enquiry is silently lost.
 *   2. If LEAD_SHEET_ID is configured and the service account is readable,
 *      append the same row to Google Sheets via the Sheets API.
 *   3. Never throw — a persistence failure must not break the visitor's
 *      conversion response.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LEADS_FILE = path.join(__dirname, '..', 'data', 'leads.jsonl');
const SERVICE_ACCOUNT_PATH = process.env.LEAD_SERVICE_ACCOUNT ||
    path.join(require('os').homedir(), 'Downloads', 'saasskul-xyz-9acb3da4db85.json');

const SHEET_COLUMNS = [
    'Timestamp', 'Property / Website', 'Visitor Name / Alias', 'Email / Contact',
    'Intent / Service Requested', 'Source URL', 'Status'
];

/** Normalise any lead shape into the standard row. */
function normalise(input = {}) {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        timestamp: now.toISOString(),
        property: 'UK LTD Registration',
        name: String(input.name || input.fullName || input.visitorName || '').trim(),
        email: String(input.email || '').trim(),
        intent: String(input.intent || input.topic || input.subject || input.service ||
            input.partnerType || input.source || 'General enquiry').trim(),
        source: String(input.sourceUrl || input.sourceURL || input.referrer || input.source || '').trim(),
        status: 'New',
        phone: String(input.phone || '').trim(),
        message: String(input.message || '').trim(),
        website: String(input.website || '').trim(),
        raw: input
    };
}

/** Append one row to the durable local store. */
function appendLocal(row) {
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    fs.appendFileSync(LEADS_FILE, JSON.stringify(row) + '\n', 'utf8');
    return true;
}

/** Append one row to Google Sheets. Returns true when written. */
async function appendSheet(row) {
    const sheetId = process.env.LEAD_SHEET_ID;
    if (!sheetId) return false;

    let auth;
    try {
        const { google } = require('googleapis');
        if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) return false;

        auth = new google.auth.GoogleAuth({
            keyFile: SERVICE_ACCOUNT_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const values = [[
            row.timestamp,
            row.property,
            row.name,
            row.email,
            row.intent,
            row.source,
            row.status
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Leads!A:G',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values }
        });
        return true;
    } catch (error) {
        console.error('[LeadStore] Sheets append failed:', error.message);
        return false;
    }
}

/**
 * Append one row to a Google Apps Script webhook.
 * This is the mandate's allowed alternative to the Sheets API and needs no
 * GCP API enablement — only a deployed Apps Script web app URL.
 */
async function appendWebhook(row) {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) return false;

    try {
        const axios = require('axios');
        await axios.post(url, {
            timestamp: row.timestamp,
            property: row.property,
            name: row.name,
            email: row.email,
            intent: row.intent,
            source: row.source,
            status: row.status
        }, { timeout: 5000 });
        return true;
    } catch (error) {
        console.error('[LeadStore] Webhook append failed:', error.message);
        return false;
    }
}


/**
 * Record a lead.
 *
 * Writes to every configured store. A Vercel serverless function has a
 * read-only filesystem, so the local file append is expected to fail there —
 * the Google Sheets and Apps Script webhook paths are the production stores.
 * When nothing is configured the failure is logged loudly rather than
 * swallowed, so a silent lead loss is always visible in the logs.
 *
 * @returns {{ id: string, persisted: boolean, sheet: boolean, webhook: boolean, stores: string[] }}
 */
async function recordLead(input) {
    const row = normalise(input);
    const stores = [];

    let persisted = false;
    try {
        persisted = appendLocal(row);
        if (persisted) stores.push('file');
    } catch (error) {
        console.error('[LeadStore] Local append failed:', error.message);
    }

    let sheet = false;
    try {
        sheet = await appendSheet(row);
        if (sheet) stores.push('sheets');
    } catch (error) {
        console.error('[LeadStore] Sheet append threw:', error.message);
    }

    let webhook = false;
    try {
        webhook = await appendWebhook(row);
        if (webhook) stores.push('webhook');
    } catch (error) {
        console.error('[LeadStore] Webhook append threw:', error.message);
    }

    if (stores.length === 0) {
        console.error(
            '[LeadStore] NO STORE AVAILABLE for lead ' + row.id +
            ' — set LEAD_SHEET_ID or LEAD_WEBHOOK_URL in the deployment environment.'
        );
    }

    return {
        id: row.id,
        persisted: stores.length > 0,
        sheet,
        webhook,
        stores
    };
}

/** Read back the most recent leads (used by admin and verification). */
function readLeads(limit = 100) {
    try {
        if (!fs.existsSync(LEADS_FILE)) return [];
        const lines = fs.readFileSync(LEADS_FILE, 'utf8')
            .split('\n').filter(Boolean);
        return lines.slice(-limit).map(l => {
            try { return JSON.parse(l); } catch { return null; }
        }).filter(Boolean).reverse();
    } catch {
        return [];
    }
}

/** Count of persisted leads. */
function countLeads() {
    try {
        if (!fs.existsSync(LEADS_FILE)) return 0;
        return fs.readFileSync(LEADS_FILE, 'utf8').split('\n').filter(Boolean).length;
    } catch {
        return 0;
    }
}

module.exports = { recordLead, readLeads, countLeads, SHEET_COLUMNS };
