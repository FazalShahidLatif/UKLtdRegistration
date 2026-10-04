/**
 * Fix 8 articles with metaTitle >55 chars (Semrush flags HTML title >55 chars)
 * All metaTitles must be ≤55 chars AND different from article.title (to avoid duplicate H1)
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];

const fixes = [
    { slug: 'best-banking-payments-setup-sea-founders', newTitle: "Best Banking Setup for SEA Founders with UK LTD" },
    { slug: 'business-banking-uk-ltd-non-residents', newTitle: "UK Business Banking for Non-Residents 2026 — Guide" },
    { slug: 'cheapest-way-register-uk-company-2026', newTitle: "Cheapest UK Company Registration 2026 — From £119.99" },
    { slug: 'director-service-address-uk-what-is-it', newTitle: "Director's Service Address UK: What It Is & Why" },
    { slug: 'same-day-company-formation-uk-2026', newTitle: "Same-Day Company Formation UK 2026 — 24-Hour Setup" },
    { slug: 'sea-founders-uk-playbook-2026', newTitle: "2026 SEA Founder's Playbook — UK Company Global Growth" },
    { slug: 'uk-company-vs-delaware-c-corp', newTitle: "UK Company or Delaware C-Corp: Best Startup Choice 2026?" },
    { slug: 'uk-ltd-vs-local-company-sea-startups', newTitle: "UK LTD vs Local Co: When SEA Startups Go UK" }
];

var fixed = 0;
fixes.forEach(function(fix) {
    var article = articles.find(function(a) { return a.slug === fix.slug; });
    if (!article) { console.log('MISSING: ' + fix.slug); return; }
    var old = (article.metaTitle || '').trim();
    if (old === fix.newTitle) { console.log('Already: ' + fix.slug); return; }
    var title = (article.title || '').trim();
    var isDup = fix.newTitle === title;
    article.metaTitle = fix.newTitle;
    fixed++;
    console.log((isDup ? 'DUP-REMAINS ' : 'FIXED      ') + fix.slug);
    console.log('  ' + old.length + 'c -> ' + fix.newTitle.length + 'c | H1==HTML? ' + isDup);
    console.log('  "' + fix.newTitle + '"');
});

if (fixed > 0) {
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles: articles }, null, 2) + '\n');
    console.log('\nUpdated: ' + fixed + ' articles');
}

// Final check on the 24 flagged
console.log('\n=== 24 flagged articles check ===');
var problems = 0;
[
    'acsp-identity-verification-2026','banking-for-uk-ltd-owners-ireland',
    'best-banking-payments-setup-sea-founders','business-banking-uk-ltd-non-residents',
    'cheapest-way-register-uk-company-2026','closing-uk-company-guide',
    'director-service-address-uk-what-is-it','how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026',
    'remote-uk-company-registration-ireland','required-documents-uk-ltd-ireland',
    'same-day-company-formation-uk-2026','sea-founders-uk-playbook-2026',
    'uk-company-formation-complete-guide-2026','uk-company-name-rules-2026',
    'uk-company-vs-delaware-c-corp','uk-ltd-company-annual-costs-2026',
    'uk-ltd-vs-local-company-sea-startups','uk-ltd-vs-offshore-company',
    'uk-ltd-vs-us-llc','uk-registered-office-address-requirements-2026',
    'uk-tax-compliance-non-resident-ireland','vat-registration-threshold-uk-2026',
    'why-sea-founders-use-uk-ltd-global-2026','wise-vs-uk-banks-non-residents'
].forEach(function(slug) {
    var a = articles.find(function(x) { return x.slug === slug; });
    if (!a) return;
    var title = (a.title || '').trim();
    var mt = (a.metaTitle || '').trim();
    var htmlTitle = mt || title;
    var isDup = title === htmlTitle && title.length > 0;
    var lenOk = htmlTitle.length <= 55;
    var status = isDup ? 'DUPLICATE ' : (!lenOk ? 'LONG ' : 'OK ');
    if (isDup || !lenOk) problems++;
    console.log(status + slug + ' | ' + htmlTitle.length + 'c' + (isDup ? ' DUP' : '') + (isDup && !lenOk ? ' | ' : '') + (isDup ? '' : (lenOk ? '' : ' LONG')));
});
console.log('\nProblems: ' + problems + ' of 24');
