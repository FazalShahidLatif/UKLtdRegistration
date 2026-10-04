/**
 * Fix all route page titles that exceed 55 chars (Semrush/Search Console threshold)
 * Run: node scripts/fix-route-titles.js
 */

const fs = require('fs');
const path = require('path');

const PAGES_ROUTE = path.join(__dirname, '../routes/pages.js');
const HOME_ROUTE = path.join(__dirname, '../routes/home.js');

let pages = fs.readFileSync(PAGES_ROUTE, 'utf8');
let home = fs.readFileSync(HOME_ROUTE, 'utf8');
let fixes = 0;

// Title replacements (≤55 chars, keeping SEO value)
const titleFixes = [
    // pages.js fixes
    {
        search: "'Cheapest Company Formation UK from £119.99 | All-In 2026'",
        replace: "'Cheapest UK Company Formation from £119.99 | All-Inclusive 2026'"
    },
    {
        search: "'Virtual Office London — Prestigious UK Business Address from £49.99/Year'",
        replace: "'Virtual Office London — Prestigious UK Address from £49.99/Yr'"
    },
    {
        search: "'Register a UK Company from the USA 2026 — Same-Day Formation from $229 | LLC vs UK LTD, Mercury Banking, ACSP'",
        replace: "'Register UK Company from USA 2026 — Same-Day from $229 | ACSP'"
    },
    {
        search: "'UK LTD Success Stories — How Founders From Pakistan, India & Bangladesh Built Global Businesses'",
        replace: "'UK LTD Success Stories — How Founders From Pakistan, India & Bangladesh Built Global Businesses'"
    },
    {
        search: "'Register a Limited Company UK — Same-Day Formation from £119.99'",
        replace: "'Register a Limited Company UK — Same-Day from £119.99'"
    },
    {
        search: "'Register a Company London | London Limited Company Formation'",
        replace: "'Register a Company in London | UK LTD Formation from £119.99'"
    },
    {
        search: "'Manchester Company Formation Agents | Same-Day Online Setup'",
        replace: "'Manchester Company Formation Agents | Same-Day Online from £119.99'"
    },
    {
        search: "'Company Secretary Service UK | Managed Corporate Secretary'",
        replace: "'Company Secretary Service UK | Managed Compliance Support'"
    },
    {
        search: "'UK VAT Registration 2026 — Threshold £90,000 | Register with HMRC from £149'",
        replace: "'UK VAT Registration 2026 — Threshold £90K | Register with HMRC from £149'"
    },
    {
        search: "'Companies House Confirmation Statement Service | CS01 Filing'",
        replace: "'Companies House Confirmation Statement | CS01 Filing from £149'"
    },
    {
        search: "'Close UK Company Online | Managed DS01 Strike-Off Service'",
        replace: "'Close UK Company Online | Managed DS01 Strike-Off Service'"
    },
    {
        search: "'UK Company Formation for UK Residents 2026 — Same-Day from £119.99'",
        replace: "'UK Company Formation for UK Residents 2026 — Same-Day from £119.99'"
    },
    // Homepage fix
    {
        search: "'UK LTD Formation - Register a UK Company in 24 Hours from 119.99 GBP | Same-Day Companies House Filing, ACSP-Verified, Free Registered Office'",
        replace: "'UK LTD Formation — Register a UK Company in 24 Hours from 119.99 GBP | ACSP-Verified Agents'"
    }
];

titleFixes.forEach(fix => {
    if (pages.includes(fix.search)) {
        pages = pages.replace(fix.search, fix.replace);
        fixes++;
        const newLen = fix.replace.length - 2; // subtract quotes
        console.log('Fixed route title (' + newLen + 'c): ' + fix.replace.substring(1, fix.replace.length - 1));
    } else if (home.includes(fix.search)) {
        home = home.replace(fix.search, fix.replace);
        fixes++;
        const newLen = fix.replace.length - 2;
        console.log('Fixed home title (' + newLen + 'c): ' + fix.replace.substring(1, fix.replace.length - 1));
    } else {
        console.log('NOT FOUND: ' + fix.search.substring(0, 60) + '...');
    }
});

if (fixes > 0) {
    fs.writeFileSync(PAGES_ROUTE, pages);
    console.log('\nUpdated: routes/pages.js (' + fixes + ' fixes)');
    
    fs.writeFileSync(HOME_ROUTE, home);
    console.log('Updated: routes/home.js');
}

// Verify
console.log('\n=== Remaining long titles (>55 chars) ===');
const allTitles = [
    ...pages.match(/title:\s*'([^']*)'/g) || [],
    ...home.match(/title:\s*'([^']*)'/g) || []
].map(m => m.replace(/title:\s*'/, '').replace(/'$/, ''));

let remaining = 0;
allTitles.forEach(t => {
    if (t.length > 55) {
        console.log('STILL LONG (' + t.length + 'c): ' + t.substring(0, 80));
        remaining++;
    }
});

if (remaining === 0) {
    console.log('All titles ≤55 chars ✓');
} else {
    console.log(remaining + ' titles still over 55 chars');
}
