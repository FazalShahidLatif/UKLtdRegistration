/**
 * Fix SEO title tags for all pages flagged by Semrush/Search Console
 * 
 * Run: node scripts/fix-seo-titles-v2.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');

// ========================================================================
// Fix 4 articles that have metaTitle === title (trigger 'Guide:' prefix)
// These articles need unique metaTitles so buildPageTitle() doesn't add "Guide: "
// ========================================================================

console.log('=== Fixing 4 articles with metaTitle === title ===\n');

let articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];

const fixes = [
    { slug: 'best-banking-payments-setup-sea-founders',
      newTitle: 'Best Banking & Payment Setup for SEA Founders with UK LTD' },
    { slug: 'closing-uk-company-guide',
      newTitle: 'Close a UK Company Online - Strike-Off vs. Liquidation Guide' },
    { slug: 'uk-ltd-vs-local-company-sea-startups',
      newTitle: 'UK LTD vs Local Company: When SEA Startups Should Incorporate' },
    { slug: 'why-sea-founders-use-uk-ltd-global-2026',
      newTitle: 'SEA Founders: Why Use a UK LTD Company to Go Global in 2026' }
];

let fixedCount = 0;
fixes.forEach(function(fix) {
    const article = articles.find(function(a) { return a.slug === fix.slug; });
    if (!article) { console.log('NOT FOUND: ' + fix.slug); return; }
    const old = (article.metaTitle || article.title).trim();
    if (old === fix.newTitle) { console.log('Already correct: ' + fix.slug); return; }
    article.metaTitle = fix.newTitle;
    fixedCount++;
    console.log('Fixed: ' + fix.slug);
    console.log('  ' + old.length + ' -> ' + fix.newTitle.length + ' chars');
    console.log('  "' + old + '"');
    console.log('  => "' + fix.newTitle + '"');
});

if (fixedCount > 0) {
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles: articles }, null, 2) + '\n');
    console.log('\nUpdated: ' + ARTICLES_PATH);
    console.log('Blog articles fixed: ' + fixedCount);
}

// ========================================================================
console.log('\nDone. Fixed ' + fixedCount + ' articles.');
