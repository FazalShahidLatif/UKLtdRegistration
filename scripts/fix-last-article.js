/**
 * Fix 1 remaining article: uk-company-vs-delaware-c-corp (56c -> ≤55c)
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];

var article = articles.find(function(a) { return a.slug === 'uk-company-vs-delaware-c-corp'; });
if (article) {
    var title = (article.title || '').trim();
    var old = (article.metaTitle || '').trim();
    var newTitle = "UK Company or Delaware C-Corp: Best for Startups 2026?";
    if (old !== newTitle) {
        article.metaTitle = newTitle;
        fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles: articles }, null, 2) + '\n');
        console.log('Fixed: ' + article.slug);
        console.log('  ' + old.length + 'c -> ' + newTitle.length + 'c');
        console.log('  "' + old + '" -> "' + newTitle + '"');
        console.log('  H1 vs HTML title: ' + (newTitle === title ? 'DUP!' : 'OK'));
    } else {
        console.log('Already correct');
    }
}
