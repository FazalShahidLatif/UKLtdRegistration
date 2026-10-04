#!/usr/bin/env node
/**
 * Audit the 11 orphan articles and classify them:
 *   REGISTER  — unique intent, no live equivalent  → expand + register
 *   MERGE     — subset of a live article           → fold content in, delete file
 *   REDIRECT  — superseded by a live article       → 301 to the live slug
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const BLOG_DIR = path.join(__dirname, '../content/blog');
const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];
const liveSlugs = new Set(articles.map(a => a.slug));

const orphans = [
    'digital-nomad-uk-business-hub',
    'directors-service-address-privacy',
    'dormant-company-compliance',
    'hidden-costs-uk-formation',
    'registered-office-privacy-guide',
    'sic-codes-classification-guide',
    'solopreneur-uk-ltd-benefits',
    'uk-corporate-tax-guide-2026',
    'uk-registered-office-guide',
    'uk-startup-ip-protection',
    'vat-registration-guide-2026'
];

// Classification with reasoning based on the overlap audit
const verdicts = {
    'digital-nomad-uk-business-hub': {
        decision: 'REGISTER',
        category: 'Business Strategy',
        reason: 'No live article targets the digital-nomad / location-independent founder angle. Closest is uk-ltd-ecommerce-online-business (vertical-specific) and non-resident-uk-company-setup-checklist (process-only). Unique intent.',
        title: 'Digital Nomads and the UK Ltd: Why Founders Are Registering Companies From Abroad',
        metaTitle: 'Digital Nomad UK Ltd 2026 | Form a Company From Abroad',
        metaDescription: 'Why digital nomads register a UK Ltd — separate legal personality, multi-currency banking, Stripe and Wise access, and no UK residency requirement. Where to register and what it costs in 2026.',
        focusKeyword: 'digital nomad uk company',
        secondaryKeywords: [
            'register uk company as digital nomad',
            'uk ltd for remote workers',
            'form uk company while travelling',
            'digital nomad business structure uk'
        ]
    },
    'directors-service-address-privacy': {
        decision: 'MERGE',
        into: 'director-service-address-uk-what-is-it',
        reason: 'Both answer "what is a director service address and why do I need one". The orphan adds nothing the live article lacks. Same intent, would cannibalise.',
    },
    'dormant-company-compliance': {
        decision: 'REGISTER',
        category: 'Tax & Finance',
        reason: 'NO live article covers dormant companies at all. Confirmed by search — zero existing articles matched "dormant". This is annual compliance, so it attracts recurring search traffic, which was quick-win #7 (compliance content).',
        title: 'Dormant UK Companies: Annual Compliance and Filing Rules 2026',
        metaTitle: 'Dormant Company UK 2026 | Compliance & Filing Rules',
        metaDescription: 'Keeping a UK Ltd dormant still carries filing duties. What you must file each year, dormant accounts rules, Corporation Tax and CT600 deadlines, and the penalties for missing them.',
        focusKeyword: 'dormant company uk compliance',
        secondaryKeywords: [
            'dormant ltd company filing requirements',
            'uk dormant accounts rules',
            'dormant company corporation tax',
            'how to keep a uk company dormant'
        ]
    },
    'hidden-costs-uk-formation': {
        decision: 'REGISTER',
        category: 'Company Formation',
        reason: 'No live article covers total cost of ownership beyond the one price-comparison article. Cost transparency is high commercial intent and links directly to /pricing.',
        title: 'The Real Cost of Setting Up a UK Ltd: What £12.99 Formation Offers Hide',
        metaTitle: 'UK Ltd Formation Costs 2026 | Full Breakdown + Hidden Fees',
        metaDescription: 'Beyond the formation fee: first-year accounts, corporation tax registration, registered office, confirmation statement and director service address. What a UK Ltd really costs from £119.99.',
        focusKeyword: 'uk ltd formation cost breakdown',
        secondaryKeywords: [
            'cost of setting up a uk limited company',
            'uk company formation hidden fees',
            'first year costs uk ltd',
            'how much does a uk ltd cost'
        ]
    },
    'registered-office-privacy-guide': {
        decision: 'MERGE',
        into: 'uk-registered-office-address-requirements-2026',
        reason: 'uk-registered-office-guide already covers registered office vs service address, and uk-registered-office-address-requirements-2026 is live with the same intent. Three overlapping articles on one topic would be the exact cannibalisation just fixed on the formation page.',
    },
    'sic-codes-classification-guide': {
        decision: 'MERGE',
        into: 'sic-codes-pakistan-textile-manufacturing-trade',
        reason: 'Four live SIC-code articles already exist (agricultural, food and beverage, India exporters, Pakistan textiles). A fifth generic SIC explainer would fragment the cluster rather than strengthen it.',
    },
    'solopreneur-uk-ltd-benefits': {
        decision: 'REGISTER',
        category: 'Business Strategy',
        reason: 'No live article targets the solopreneur / "company of one" audience. Distinct from ltd-company-vs-sole-trader which compares structures but is written as a decision guide, not a solopreneur-benefit piece. GSC shows "sole trader or limited company uk" ranking at position 41.98.',
        title: 'Solopreneur UK Ltd: Benefits for Founders Working Alone',
        metaTitle: 'Solopreneur UK Ltd 2026 | Benefits of Going Limited',
        metaDescription: 'Why a one-person business benefits from forming a UK Ltd — limited liability, tax efficiency, credibility with UK clients, and easy share issuance when you bring in a partner later.',
        focusKeyword: 'solopreneur uk ltd benefits',
        secondaryKeywords: [
            'sole trader vs limited company',
            'one person business uk company',
            'freelancer should form a uk ltd',
            'benefits of ltd company for solo founder'
        ]
    },
    'uk-corporate-tax-guide-2026': {
        decision: 'REGISTER',
        category: 'Tax & Finance',
        reason: 'No live article covers Corporation Tax itself. vat-registration-threshold-uk-2026 covers VAT; uk-ltd-tax-efficiency-non-residents covers non-resident tax strategy; uk-tax-compliance-non-resident-ireland covers Irish tax filing. The core UK Corporation Tax guide is a genuine gap and is quick-win #7.',
        title: 'UK Corporation Tax 2026: Rates, Deadlines and How to Pay Less',
        metaTitle: 'UK Corporation Tax 2026 | Rates, Deadlines, CT600',
        metaDescription: 'UK corporation tax rates for 2026 including small profits and marginal relief, accounting period rules, CT600 filing deadlines, payment on account, and penalties for late filing.',
        focusKeyword: 'uk corporation tax 2026',
        secondaryKeywords: [
            'corporation tax rates uk 2026',
            'ct600 filing deadline',
            'uk company tax payment on account',
            'small profits relief corporation tax'
        ]
    },
    'uk-registered-office-guide': {
        decision: 'MERGE',
        into: 'uk-registered-office-address-requirements-2026',
        reason: 'Duplicate of the orphan registered-office-privacy-guide AND overlaps the live uk-registered-office-address-requirements-2026. Content should be folded into that one article.',
    },
    'uk-startup-ip-protection': {
        decision: 'REGISTER',
        category: 'Business Strategy',
        reason: 'No live article covers trademarks or IP. Distinct from franchise-licensing (which covers franchising specifically). This is a common founder misconception and answers a genuine question.',
        title: 'Protecting Your Brand After Incorporation: UK Trademarks and IP',
        metaTitle: 'UK Trademark Guide 2026 | Protect Your Brand Post-Incorporation',
        metaDescription: 'Registering a company name does not give you trademark rights. How to file a UK trademark for your brand, what copyright and design rights cover, and when to do it relative to formation.',
        focusKeyword: 'uk trademark for company name',
        secondaryKeywords: [
            'do i need a trademark uk',
            'company name vs trademark uk',
            'how to register a uk trademark',
            'protecting brand after ltd formation'
        ]
    },
    'vat-registration-guide-2026': {
        decision: 'MERGE',
        into: 'vat-registration-threshold-uk-2026',
        reason: 'The live article is 2,399 words and already covers the £90,000 threshold, mandatory vs voluntary registration and non-resident rules. The orphan is a 266-word subset of it. No new intent.',
    }
};

console.log('=== ORPHAN ARTICLE AUDIT ===\n');
console.log('Live articles: ' + articles.length + '\n');

const register = [];
const merge = [];

orphans.forEach(slug => {
    const mdPath = path.join(BLOG_DIR, slug + '.md');
    const exists = fs.existsSync(mdPath);
    let words = 0;
    if (exists) words = fs.readFileSync(mdPath, 'utf8').split(/\s+/).length;

    const v = verdicts[slug];
    if (v.decision === 'REGISTER') {
        register.push(slug);
        console.log('REGISTER  ' + slug + '  (' + words + ' words)');
        console.log('          → ' + v.title);
        console.log('          category: ' + v.category);
        console.log('          why: ' + v.reason.split('.')[0] + '.\n');
    } else {
        merge.push({ slug, into: v.into, reason: v.reason });
        console.log('MERGE     ' + slug + '  (' + words + ' words)');
        console.log('          → into: ' + v.into);
        console.log('          why: ' + v.reason.split('.')[0] + '.\n');
    }
});

console.log('=== SUMMARY ===');
console.log('REGISTER (expand + publish): ' + register.length + ' — ' + register.join(', '));
console.log('MERGE (fold into live, delete): ' + merge.length + ' — ' + merge.map(m => m.slug).join(', '));

fs.writeFileSync(path.join(__dirname, 'orphan-verdicts.json'), JSON.stringify({ register, merge }, null, 2));
console.log('\nWrote scripts/orphan-verdicts.json');
