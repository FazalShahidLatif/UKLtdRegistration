const fs = require('fs');
const path = require('path');

const articlesPath = 'content/blog/blog-articles.json';
const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const articles = data.articles;

console.log('Current articles in JSON:', articles.length);

// ─── PHASE 1a: Add 5 country guides to blog-articles.json ───────────────────
// These .md files already exist on disk — just need JSON entries to publish them

const existingIds = articles.map(a => a.id);
const maxId = Math.max(...existingIds);

const countryGuides = [
    {
        id: maxId + 1,
        slug: 'register-uk-ltd-online-canada-2026',
        title: 'Register a UK LTD from Canada: The 2026 Complete Guide',
        metaTitle: 'Register UK LTD from Canada 2026 | Full Step-by-Step',
        metaDescription: 'Complete 2026 guide for Canadian founders registering a UK LTD. Covers ACSP verification from Canada, Wise banking, UK-Canada tax treaty, and remote formation steps.',
        category: 'Regional',
        tags: ['Canada', 'non-resident', 'Canadian founders', 'remote formation', 'banking', 'tax treaty'],
        focusKeyword: 'register UK LTD from Canada',
        excerpt: 'The definitive 2026 roadmap for Canadian founders looking to form a UK Limited company remotely. ACSP verification, banking setup, tax considerations, and step-by-step formation.',
        image: '/images/blog/uk-company-canada-pillar.png',
        imageAlt: 'Canadian flag with UK company registration documents on a desk',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 14
    },
    {
        id: maxId + 2,
        slug: 'register-uk-ltd-online-australia-2026',
        title: 'Register a UK LTD from Australia: The 2026 Complete Guide',
        metaTitle: 'Register UK LTD from Australia 2026 | Full Step-by-Step',
        metaDescription: 'Complete 2026 guide for Australian founders registering a UK LTD. Covers ACSP verification from Australia, Wise/Revolut banking, UK-Australia tax considerations, and remote formation.',
        category: 'Regional',
        tags: ['Australia', 'non-resident', 'Australian founders', 'remote formation', 'banking', 'tax'],
        focusKeyword: 'register UK LTD from Australia',
        excerpt: 'The definitive 2026 roadmap for Australian founders looking to form a UK Limited company remotely. ACSP verification, banking setup, tax considerations, and step-by-step formation.',
        image: '/images/blog/uk-company-australia-pillar.png',
        imageAlt: 'Australian flag with UK company registration documents on a desk',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 14
    },
    {
        id: maxId + 3,
        slug: 'register-uk-ltd-online-germany-2026',
        title: 'Register a UK LTD from Germany: The 2026 Complete Guide',
        metaTitle: 'Register UK LTD from Germany 2026 | Full Step-by-Step',
        metaDescription: 'Complete 2026 guide for German founders registering a UK LTD. Covers ACSP verification from Germany, EU-UK business setup, Wise/Revolut banking, and cross-border tax considerations.',
        category: 'Regional',
        tags: ['Germany', 'non-resident', 'German founders', 'EU', 'remote formation', 'banking', 'cross-border'],
        focusKeyword: 'register UK LTD from Germany',
        excerpt: 'The definitive 2026 roadmap for German founders looking to form a UK Limited company remotely. ACSP verification, EU-UK business setup, banking, and cross-border tax considerations.',
        image: '/images/blog/uk-company-germany-pillar.png',
        imageAlt: 'German flag with UK company registration documents on a desk',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 14
    },
    {
        id: maxId + 4,
        slug: 'register-uk-ltd-online-france-2026',
        title: 'Register a UK LTD from France: The 2026 Complete Guide',
        metaTitle: 'Register UK LTD from France 2026 | Full Step-by-Step',
        metaDescription: 'Complete 2026 guide for French founders registering a UK LTD. Covers ACSP verification from France, EU-UK business setup, Wise/Revolut banking, and cross-border tax considerations.',
        category: 'Regional',
        tags: ['France', 'non-resident', 'French founders', 'EU', 'remote formation', 'banking', 'cross-border'],
        focusKeyword: 'register UK LTD from France',
        excerpt: 'The definitive 2026 roadmap for French founders looking to form a UK Limited company remotely. ACSP verification, EU-UK business setup, banking, and cross-border tax considerations.',
        image: '/images/blog/uk-company-france-pillar.png',
        imageAlt: 'French flag with UK company registration documents on a desk',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 14
    },
    {
        id: maxId + 5,
        slug: 'eu-founders-uk-ltd-registration-guide-2026',
        title: 'EU Founders Guide: Register a UK LTD from Any EU Country in 2026',
        metaTitle: 'EU Founders UK LTD Registration 2026 | From Any EU Country',
        metaDescription: 'Complete 2026 guide for EU founders registering a UK LTD. Covers post-Brexit setup from Germany, France, Italy, Spain, Netherlands, and all EU member states. ACSP verification, banking, tax.',
        category: 'Regional',
        tags: ['EU', 'European founders', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'post-Brexit', 'remote formation', 'banking'],
        focusKeyword: 'EU founders register UK LTD',
        excerpt: 'The definitive 2026 roadmap for EU founders looking to form a UK Limited company. Covers post-Brexit setup from any EU member state, ACSP verification, banking, and cross-border tax considerations.',
        image: '/images/blog/uk-company-eu-pillar.png',
        imageAlt: 'EU flag with UK company registration documents on a desk',
        publishedDate: '2026-09-14',
        updatedDate: '2026-09-14',
        readTime: 16
    }
];

countryGuides.forEach(guide => {
    articles.push(guide);
    console.log('Added to JSON:', guide.id, guide.slug);
});

// ─── PHASE 1b: Re-add banking affiliate CTAs ─────────────────────────────────
// These were written in earlier commits but got rolled back. Re-add them.

const bankingCTA = `
---

## Recommended Business Banking for Your UK LTD

Setting up the right business bank account is one of the most important steps after forming your UK LTD. Here are our recommended providers:

${process.argv[2] === 'full' ? `
### Wise Business
- **Best for:** Non-resident founders receiving and converting multiple currencies
- **Key benefit:** Hold 50+ currencies, get local account details (GBP, USD, EUR), low conversion fees
- [Open a Wise Business Account →](https://wise.com/acd/accept?utm_source=ukltdregistration&utm_medium=affiliate&utm_campaign=UKLTDBanking)

### Revolut Business
- **Best for:** Startups needing multi-currency accounts with integrated expense management
- **Key benefit:** 100+ currencies, virtual IBAN, corporate card, accounting integrations
- [Open a Revolut Business Account →](https://revolut.com/bs/gb/business/invite?utm_source=ukltdregistration)

### Payoneer
- **Best for:** Freelancers and exporters receiving payments from global platforms
- **Key benefit:** Get paid from marketplaces, clients worldwide, competitive FX rates
- [Open a Payoneer Account →](https://www.payoneer.com/signup?utm_source=ukltdregistration)
` : ''}

**Disclosure:** UK LTD Registration may receive a commission if you sign up through our links. This helps us keep our guides free and up to date — at no extra cost to you.
`;

// Articles that need CTAs (banking-related articles that had CTAs before rollback)
const bankingArticles = [
    'business-banking-uk-ltd-non-residents',
    'wise-vs-uk-banks-non-residents',
    'revolut-business-vs-wise-business-uk-ltd-2026',
    'payoneer-business-account-uk-ltd-setup-guide-2026',
    'tide-business-account-uk-ltd-non-resident-review-2026',
    'airwallex-business-account-uk-ltd-guide-2026',
    'uk-bank-accounts-high-risk-industries-gemstones-crypto-precious-metals-2026',
    'uk-ltd-high-risk-gemstones-precious-metals-jewelry-export-guide-2026',
    'aml-red-flags-uk-ltd-avoid-account-freezes-high-risk',
    'uk-business-bank-account-pakistan-exporters-payments',
    'uk-bank-account-south-asian-exporters-currency-management',
    'traditional-uk-corporate-bank-accounts-barclays-hsbc-lloyds-2026',
    'banking-for-uk-ltd-owners-ireland',
    'uk-banking-cross-border-payments-india-businesses',
    'stripe-wise-mercury-setup-sea-founders',
    'best-banking-payments-setup-sea-founders',
    'get-paid-gbp-usd-eur-sea-founders'
];

const useFullCTA = process.argv[2] === 'full';

let ctaAdded = 0;
bankingArticles.forEach(slug => {
    const article = articles.find(a => a.slug === slug);
    if (!article) {
        console.log('WARNING: Article not in JSON, skipping CTA:', slug);
        return;
    }
    // Add CTA before the last "---" or at end of content if no separator
    if (article.content) {
        // Check if CTA already exists
        if (article.content.includes('Recommended Business Banking for Your UK LTD')) {
            console.log('CTA already present, skipping:', slug);
            return;
        }
        // Insert CTA before closing ---
        const parts = article.content.split(/\n---\n$/);
        if (parts.length > 1) {
            parts[parts.length - 1] = bankingCTA + parts[parts.length - 1];
            article.content = parts.join('\n---\n');
        } else {
            article.content += bankingCTA;
        }
        ctaAdded++;
        console.log('Added CTA:', slug);
    } else {
        console.log('WARNING: No content field for:', slug);
    }
});

// ─── Write back ──────────────────────────────────────────────────────────────
fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));

console.log('\n=== PHASE 1 COMPLETE ===');
console.log('Articles in JSON now:', articles.length);
console.log('Country guides added:', countryGuides.length);
console.log('Banking CTAs added:', ctaAdded);
console.log('Total banking articles processed:', bankingArticles.length);
