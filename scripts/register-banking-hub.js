#!/usr/bin/env node
/**
 * Register the new banking affiliate hub page in blog-articles.json
 * (the gatekeeper for /blog listing + sitemap + blog rendering)
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const data = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
const articles = data.articles;

const SLUG = 'best-uk-business-bank-accounts-non-residents-2026';

if (articles.some(a => a.slug === SLUG)) {
    console.log('Already in JSON — no changes needed');
    process.exit(0);
}

// Find the highest ID to assign the next sequential one
const maxId = Math.max(...articles.map(a => a.id));
const newId = maxId + 1;

const entry = {
    id: newId,
    slug: SLUG,
    title: 'Best UK Business Bank Accounts for Non-Residents 2026 — The Ultimate Comparison',
    metaTitle: 'Best UK Business Bank Accounts 2026 | Non-Resident Guide',
    metaDescription: 'Compare the best UK business bank accounts for non-residents in 2026. Wise, Revolut, Tide, Airwallex, Payoneer and Mercury compared on fees, eligibility, approval speed and multi-currency support.',
    category: 'Banking',
    tags: [
        'banking',
        'non-resident',
        'Wise',
        'Revolut',
        'Tide',
        'Airwallex',
        'Payoneer',
        'Mercury',
        'comparison'
    ],
    publishedDate: '2026-09-30',
    updatedDate: '2026-09-30',
    focusKeyword: 'best uk business bank account for non residents 2026',
    secondaryKeywords: [
        'uk business bank account for non residents',
        'open uk bank account from overseas',
        'wise vs revolut vs airwallex',
        'best business banking uk ltd non resident',
        'uk bank account for international founders'
    ],
    excerpt: 'Wise, Revolut, Tide, Airwallex, Payoneer and Mercury compared side by side — fees, eligibility, approval speed and which account suits which founder.',
    readTime: 14,
    image: '/images/blog_wise_vs_ukbanks_guide.png',
    imageAlt: 'Best UK business bank accounts for non-residents 2026 — Wise vs Revolut vs Tide vs Airwallex vs Payoneer vs Mercury',
    featured: true
};

articles.push(entry);
fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles }, null, 2) + '\n', 'utf8');

console.log('Added "' + SLUG + '" to blog-articles.json with ID ' + newId);
console.log('Total articles now: ' + articles.length);
console.log('Max ID: ' + newId);
