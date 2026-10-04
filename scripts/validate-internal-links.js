#!/usr/bin/env node
/**
 * Validate that every internal link added to Phase 2 articles resolves
 * to either a real blog slug in blog-articles.json or a known static route.
 * Run: node scripts/validate-internal-links.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const BLOG_DIR = path.join(__dirname, '../content/blog');

const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];
const validSlugs = new Set(articles.map(a => a.slug));

// Static routes that exist (from routes/pages.js + home.js)
const staticRoutes = new Set([
    '/', '/pricing', '/packages', '/services', '/blog', '/partners', '/about', '/faq',
    '/contact', '/uk-residents', '/us-citizens', '/strategic-research-hub',
    '/success-stories', '/registered-office-address', '/company-secretary',
    '/vat-registration', '/confirmation-statement', '/company-name-check',
    '/non-uk-resident-company', '/services/apostille', '/services/dissolution',
    '/services/virtual-office', '/services/meeting-rooms', '/services/accounting',
    '/services/banking', '/register-a-limited-company-uk', '/legal/terms',
    '/legal/privacy', '/legal/cookies', '/legal/refund', '/legal/compliance'
]);

// Load view files that define static routes
const routesDir = path.join(__dirname, '../routes');
fs.readdirSync(routesDir).filter(f => f.endsWith('.js')).forEach(f => {
    const content = fs.readFileSync(path.join(routesDir, f), 'utf8');
    const re = /router\.get\(\s*(?:\[\s*)?'([^']+)'/g;
    let m;
    while ((m = re.exec(content)) !== null) staticRoutes.add(m[1]);
    const re2 = /'(\/[^']*)'/g;
    while ((m = re2.exec(content)) !== null) {
        const p = m[1];
        if (p.startsWith('/') && !p.includes('.') && p.split('/').length <= 3) staticRoutes.add(p);
    }
});

console.log('=== Internal Link Validation ===\n');
console.log('Known blog slugs: ' + validSlugs.size);
console.log('Known static routes: ' + staticRoutes.size + '\n');

let checked = 0;
let broken = [];
const perArticle = {};

fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md')).forEach(file => {
    const slug = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const linkRe = /\]\((\/[^)\s]+)\)/g;
    let m;
    const internal = [];
    while ((m = linkRe.exec(content)) !== null) {
        const url = m[1];
        checked++;
        let ok = false;
        if (url.startsWith('/blog/')) {
            const target = url.replace('/blog/', '').replace(/\/$/, '');
            ok = validSlugs.has(target);
        } else {
            ok = staticRoutes.has(url);
        }
        internal.push({ url, ok });
        if (!ok) broken.push({ from: slug, url });
    }
    const brokenCount = internal.filter(l => !l.ok).length;
    perArticle[slug] = { total: internal.length, broken: brokenCount };
});

const totalBroken = broken.length;
const brokenUnique = [...new Set(broken.map(b => b.url))];

console.log('=== RESULT ===');
console.log('Total internal links checked: ' + checked);
console.log('Broken links: ' + totalBroken + ' (' + brokenUnique.length + ' unique targets)\n');

if (brokenUnique.length) {
    console.log('=== BROKEN TARGETS ===');
    brokenUnique.forEach(u => {
        const sources = broken.filter(b => b.url === u).map(b => b.from);
        console.log('  ' + u);
        console.log('     linked from (' + sources.length + '): ' + sources.slice(0, 6).join(', ') + (sources.length > 6 ? ', ...' : ''));
    });
    console.log('');
} else {
    console.log('ALL INTERNAL LINKS VALID ✓');
}

// Report Phase 2 coverage
console.log('=== PHASE 2 INTERNAL LINK COUNTS (selected) ===');
const phase2 = articles.filter(a => a.id >= 85).map(a => a.slug);
phase2.forEach(slug => {
    if (perArticle[slug]) {
        const s = perArticle[slug];
        console.log('  ' + slug.substring(0, 55).padEnd(55) + ' links: ' + s.total + ', broken: ' + s.broken);
    }
});
