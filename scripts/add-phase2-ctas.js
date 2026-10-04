/**
 * Add banking affiliate CTAs + /pricing formation CTA to Phase 2 articles
 * that are missing them.
 * 
 * Run: node scripts/add-phase2-ctas.js
 */

const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8')).articles || [];

// Phase 2 articles (IDs 85-116) that need CTAs added
const phase2Ids = [85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116];

// Known: ID 88 (gemstones) and 93 (media) and 114 (wise-vs-uk-banks) already have Wise+Revolut CTAs
const alreadyHasBanking = { 88: true, 93: true, 114: true };

// Known: IDs 107-113 don't have /pricing in content (compliance/strategy articles)
// These need a formation CTA added too
const needsPricingCta = [107,108,109,110,111,112,113];

let updated = 0;
let errors = 0;

phase2Ids.forEach(function(id) {
    const article = articles.find(a => a.id === id);
    if (!article) {
        console.log('ID ' + id + ': NOT FOUND in JSON');
        errors++;
        return;
    }

    const slug = article.slug;
    const mdPath = path.join(__dirname, '../content/blog/' + slug + '.md');

    if (!fs.existsSync(mdPath)) {
        console.log('ID ' + id + ' (' + slug + '): FILE MISSING — will create');
        // Create a minimal stub article
        const stub = createStubArticle(article);
        fs.writeFileSync(mdPath, stub, 'utf8');
        console.log('  Created stub for ' + slug);
        updated++;
        return;
    }

    const content = fs.readFileSync(mdPath, 'utf8');
    let modified = false;
    const actions = [];

    // Step 1: Add banking affiliate CTAs (Wise + Revolut + Mercury) if missing
    if (!alreadyHasBanking[id]) {
        if (!content.includes('## Recommended Business Banking for Your UK LTD')) {
            // Find where to insert — before the final disclosure paragraph
            const disclosureMarker = '**Disclosure:** UK LTD Registration may receive a commission';
            
            if (content.includes(disclosureMarker)) {
                const insertText = `
---

## Recommended Business Banking for Your UK LTD

Setting up the right business bank account is one of the most important steps after forming your UK LTD. Here are our recommended providers:

### Wise Business
- **Best for:** Non-resident founders receiving and converting multiple currencies
- **Key benefit:** Hold 40+ currencies, get local account details (GBP, USD, EUR), low conversion fees
- [Open a Wise Business Account →](https://wise.com/acd/accept?utm_source=ukltdregistration&utm_medium=affiliate&utm_campaign=UKLTDBankingHub)

### Revolut Business
- **Best for:** Startups needing multi-currency accounts with integrated expense management
- **Key benefit:** 25+ currencies, virtual IBAN, corporate card, accounting integrations
- [Open a Revolut Business Account →](https://revolut.com/bs/gb/business/invite?utm_source=ukltdregistration)

### Mercury
- **Best for:** US/UK tech startups with dual currency needs
- **Key benefit:** USD + GBP accounts, startup-focused banking, no monthly fees
- [Open a Mercury Account →](https://mercury.com/apply?utm_source=ukltdregistration&utm_medium=affiliate&utm_campaign=UKLTDBankingHub)

**Disclosure:** UK LTD Registration may receive a commission if you sign up through our links. This helps us keep our guides free and up to date — at no extra cost to you.
`;
                const idx = content.indexOf(disclosureMarker);
                const newContent = content.substring(0, idx) + insertText + '\n' + content.substring(idx);
                fs.writeFileSync(mdPath, newContent, 'utf8');
                actions.push('Added Wise + Revolut + Mercury CTAs');
                modified = true;
            } else {
                // Fallback: append at end of file
                const insertText = `
---

## Recommended Business Banking for Your UK LTD

Setting up the right business bank account is one of the most important steps after forming your UK LTD. Here are our recommended providers:

### Wise Business
- **Best for:** Non-resident founders receiving and converting multiple currencies
- **Key benefit:** Hold 40+ currencies, get local account details (GBP, USD, EUR), low conversion fees
- [Open a Wise Business Account →](https://wise.com/acd/accept?utm_source=ukltdregistration&utm_medium=affiliate&utm_campaign=UKLTDBankingHub)

### Revolut Business
- **Best for:** Startups needing multi-currency accounts with integrated expense management
- **Key benefit:** 25+ currencies, virtual IBAN, corporate card, accounting integrations
- [Open a Revolut Business Account →](https://revolut.com/bs/gb/business/invite?utm_source=ukltdregistration)

### Mercury
- **Best for:** US/UK tech startups with dual currency needs
- **Key benefit:** USD + GBP accounts, startup-focused banking, no monthly fees
- [Open a Mercury Account →](https://mercury.com/apply?utm_source=ukltdregistration&utm_medium=affiliate&utm_campaign=UKLTDBankingHub)

**Disclosure:** UK LTD Registration may receive a commission if you sign up through our links. This helps us keep our guides free and up to date — at no extra cost to you.
`;
                const newContent = content.replace(/\n+$/, '') + '\n' + insertText;
                fs.writeFileSync(mdPath, newContent, 'utf8');
                actions.push('Added Wise + Revolut + Mercury CTAs (end of file)');
                modified = true;
            }
        } else {
            actions.push('Banking CTAs already present');
        }
    } else {
        actions.push('Already has banking CTAs (Wise + Revolut)');
    }

    // Step 2: Add /pricing CTA if missing
    if (!content.includes('## Ready to Form Your UK LTD')) {
        // Only add if the article doesn't already link to /pricing
        if (!content.includes('[/pricing]') && !content.includes('(/pricing)')) {
            // Add formation CTA before the banking CTAs section or at the end
            const pricingCta = `
---

## Ready to Form Your UK LTD?

Before you can open a business bank account, you need a UK LTD. Formation is the first step — and it's quick.

**[Start Your UK LTD Formation — From £119.99](/pricing)**
- Same-day Companies House filing
- ACSP-verified agents
- Free London registered office for 3 months (Standard Plus + Enterprise Elite)
- Wise banking setup assistance included
- Trusted by 10,000+ founders in 188 countries

`;
            
            // Insert before banking CTAs if they exist, or at end
            if (content.includes('## Recommended Business Banking for Your UK LTD')) {
                const newContent = content.replace(
                    '## Recommended Business Banking for Your UK LTD',
                    pricingCta + '## Recommended Business Banking for Your UK LTD'
                );
                fs.writeFileSync(mdPath, newContent, 'utf8');
                actions.push('Added /pricing CTA before banking section');
                modified = true;
            } else {
                const newContent = content.replace(/\n+$/, '') + '\n' + pricingCta + '\n';
                fs.writeFileSync(mdPath, newContent, 'utf8');
                actions.push('Added /pricing CTA at end');
                modified = true;
            }
        } else {
            actions.push('/pricing link already present in content');
        }
    } else {
        actions.push('/pricing CTA already present');
    }

    if (modified) {
        updated++;
        console.log('ID ' + id + ' (' + slug + '): ' + actions.join('; '));
    } else {
        console.log('ID ' + id + ' (' + slug + '): ' + actions.join('; ') + ' — no changes');
    }
});

function createStubArticle(article) {
    return `---
title: "${article.title || 'New Article'}"
metaTitle: "${article.metaTitle || article.title || 'New Article'}"
metaDescription: "${article.metaDescription || 'Comprehensive guide to this topic.'}"
slug: ${article.slug}
author: UK LTD Registration
publishedDate: "2026-09-14"
updatedDate: "2026-09-14"
category: "${article.category || 'Business'}"
tags: []
focusKeyword: "${article.focusKeyword || 'UK LTD'}"
excerpt: "${article.excerpt || 'A comprehensive guide covering all aspects of this topic for UK LTD founders.'}"
readTime: 8
---

# ${article.title || 'New Article'}

TBD — content coming soon.
`;
}

console.log('\n=== SUMMARY ===');
console.log('Files updated: ' + updated);
console.log('Errors: ' + errors);
console.log('Total processed: ' + phase2Ids.length);
