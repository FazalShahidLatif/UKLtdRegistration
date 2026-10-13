/**
 * mailer.js — sends transactional notifications through the Mailgun HTTP API.
 *
 * WHY HTTP AND NOT SMTP
 * ---------------------
 * This runs on Vercel serverless. Opening an SMTP connection per invocation is
 * slow and can be blocked on some runtimes; a single HTTPS POST is faster and
 * more reliable. It also needs no extra dependency — Node 18+ has global fetch.
 *
 * WHY IT NEVER THROWS
 * -------------------
 * A failed notification must never cost us the lead. Every caller logs the
 * submission first and treats email as best-effort. If Mailgun is down or
 * unconfigured, the submission is still captured in the server log and the
 * visitor still sees a success state.
 *
 * SANDBOX NOTE
 * ------------
 * Mailgun sandbox domains only deliver to addresses added as Authorized
 * Recipients in the Mailgun dashboard. Until a custom domain is set up,
 * notifications only reach the configured notify address.
 */

const MAILGUN_BASE = process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net';

function config() {
    const key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const to = process.env.LEAD_NOTIFY_EMAIL;
    if (!key || !domain || !to) return null;
    return { key: key, domain: domain, to: to };
}

function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function rows(obj) {
    return Object.keys(obj)
        .filter(function (k) { return obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== ''; })
        .map(function (k) {
            return '<tr><td style="padding:6px 12px;font-weight:600;color:#374151">' + esc(k) +
                   '</td><td style="padding:6px 12px;color:#111827">' + esc(obj[k]) + '</td></tr>';
        }).join('');
}

/**
 * Send a notification. Resolves to { sent: boolean, reason?: string }.
 * Never rejects.
 */
async function notify(subject, data, replyTo) {
    const cfg = config();
    if (!cfg) {
        console.warn('[mailer] not configured (MAILGUN_API_KEY / MAILGUN_DOMAIN / LEAD_NOTIFY_EMAIL) — email skipped');
        return { sent: false, reason: 'not_configured' };
    }

    const html =
        '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px">' +
        '<h2 style="font-size:18px;color:#111827;margin:0 0 4px">' + esc(subject) + '</h2>' +
        '<p style="font-size:12px;color:#6b7280;margin:0 0 16px">' +
        new Date().toISOString() + ' · ukltdregistration.com</p>' +
        '<table style="border-collapse:collapse;font-size:14px;width:100%">' + rows(data) + '</table>' +
        '</div>';

    const form = new URLSearchParams();
    form.set('from', 'UK LTD Registration <postmaster@' + cfg.domain + '>');
    form.set('to', cfg.to);
    form.set('subject', subject);
    form.set('html', html);
    if (replyTo) form.set('h:Reply-To', replyTo);

    try {
        const res = await fetch(MAILGUN_BASE + '/v3/' + cfg.domain + '/messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('api:' + cfg.key).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form.toString()
        });
        if (!res.ok) {
            const text = await res.text().catch(function () { return ''; });
            console.warn('[mailer] Mailgun returned ' + res.status + ' — ' + text.slice(0, 200));
            return { sent: false, reason: 'http_' + res.status };
        }
        return { sent: true };
    } catch (err) {
        console.warn('[mailer] send failed — ' + err.message);
        return { sent: false, reason: err.message };
    }
}

module.exports = { notify };
