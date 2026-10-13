/**
 * pinterest.js — server-side Pinterest API v5 client.
 *
 * WHY SERVER-SIDE ONLY
 * --------------------
 * The Pinterest access token grants read/write access to the whole account.
 * If it were rendered into page HTML or fetched from the browser, anyone
 * viewing source could lift it. So the token lives only in the server
 * environment, and the browser talks to /api/pinterest/pins instead.
 *
 * CACHING
 * -------
 * Pinterest's API is rate limited (200 req/hour on the free tier). The public
 * site is far busier than that, so results are cached in memory for 6 hours.
 * A failed fetch returns the last good cache rather than emptying the page,
 * so a Pinterest outage never degrades the site.
 */

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const FETCH_TIMEOUT_MS = 6000;

let cache = { at: 0, pins: [] };

function credentials() {
    const token = process.env.PINTEREST_ACCESS_TOKEN;
    const board = process.env.PINTEREST_BOARD;
    if (!token || !board) return null;
    return { token: token, board: board };
}

/** Pick the best available image for a pin. */
function imageFor(pin) {
    const imgs = (pin.media && pin.media.images) || {};
    return (imgs['600x'] && imgs['600x'].url)
        || (imgs.originals && imgs.originals.url)
        || (imgs['400x'] && imgs['400x'].url)
        || null;
}

/** Escape for safe insertion into HTML by the browser. */
function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Fetch up to `limit` pins from the configured board.
 * Returns an array (possibly empty) — never throws.
 */
async function getPins(limit) {
    const max = limit || 8;

    if (cache.pins.length && (Date.now() - cache.at) < CACHE_TTL_MS) {
        return cache.pins.slice(0, max);
    }

    const creds = credentials();
    if (!creds) return cache.pins.slice(0, max); // not configured yet — stay silent

    const url = 'https://api.pinterest.com/v5/boards/' + encodeURIComponent(creds.board) +
                '/pins?page_size=' + max;

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + creds.token,
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        clearTimeout(timer);

        if (!res.ok) {
            console.warn('[Pinterest] API returned ' + res.status + ' — serving cached pins');
            return cache.pins.slice(0, max);
        }

        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];

        const pins = items.map(function (p) {
            const img = imageFor(p);
            if (!img) return null;
            const desc = p.description || p.title || 'UK company formation guide';
            return {
                id: p.id,
                image: esc(img),
                alt: esc(desc.slice(0, 125)),
                title: esc(p.title || desc).slice(0, 120),
                link: esc(p.link || ('https://www.pinterest.com/pin/' + p.id + '/'))
            };
        }).filter(Boolean);

        if (pins.length) cache = { at: Date.now(), pins: pins };
        return pins.slice(0, max);

    } catch (err) {
        clearTimeout(timer);
        console.warn('[Pinterest] fetch failed (' + err.message + ') — serving cached pins');
        return cache.pins.slice(0, max);
    }
}

module.exports = { getPins };
