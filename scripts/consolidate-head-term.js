#!/usr/bin/env node
/**
 * Consolidate the "register a limited company UK" head term.
 *
 * Current problem: /register-a-limited-company-uk and
 * /blog/uk-company-formation-complete-guide-2026 both target the generic
 * "UK company formation" / "register a limited company" head terms, so Google
 * splits authority and ranks neither (observed: 60+ queries at position 55-92,
 * zero clicks).
 *
 * Resolution:
 *   /register-a-limited-company-uk          -> TRANSACTIONAL
 *     owns "register a limited company uk", "set up a limited company online",
 *     "register ltd company", "limited company registration"
 *
 *   /blog/uk-company-formation-complete-guide-2026 -> INFORMATIONAL
 *     narrowed to the non-resident research intent it already serves well:
 *     "uk company formation for non-residents", "how to form a uk company from
 *     abroad", with a 301-free content differentiation via title/H1/meta only.
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const data = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
const articles = data.articles;

const BLOG_SLUG = 'uk-company-formation-complete-guide-2026';
const article = articles.find(a => a.slug === BLOG_SLUG);

if (!article) {
    console.error('ERROR: could not find ' + BLOG_SLUG + ' in blog-articles.json');
    process.exit(1);
}

console.log('=== BEFORE ===');
console.log('title:     ' + article.title);
console.log('metaTitle: ' + article.metaTitle);
console.log('metaDesc:  ' + article.metaDescription);

// Differentiate: make this the informational non-resident guide, drop the
// generic "master guide" framing that competes with the transactional page.
article.title = 'UK Company Formation for Non-Residents: How to Form a UK Ltd From Abroad (2026)';
article.metaTitle = 'Form a UK Company From Abroad 2026 | Non-Resident Guide';
article.metaDescription = 'A step-by-step 2026 guide for non-residents forming a UK Ltd from abroad — director and PSC rules, ECCTA identity checks, registered office, banking and VAT.';
article.focusKeyword = 'form a uk company from abroad non resident';
article.secondaryKeywords = [
    'uk company formation for non-residents',
    'form a uk ltd from abroad',
    'register uk company without uk address',
    'uk company formation for overseas founders',
    'eccta identity verification non resident director'
];
article.updatedDate = '2026-10-02';

console.log('\n=== AFTER ===');
console.log('title:     ' + article.title);
console.log('metaTitle: ' + article.metaTitle);
console.log('metaDesc:  ' + article.metaDescription);
console.log('focusKw:   ' + article.focusKeyword);
console.log('metaTitle length: ' + article.metaTitle.length + ' chars' +
            (article.metaTitle.length <= 60 ? ' OK' : ' TOO LONG'));
console.log('metaDesc length:  ' + article.metaDescription.length + ' chars' +
            (article.metaDescription.length <= 160 ? ' OK' : ' TOO LONG'));

fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles }, null, 2) + '\n', 'utf8');
console.log('\nSaved ' + ARTICLES_PATH);
