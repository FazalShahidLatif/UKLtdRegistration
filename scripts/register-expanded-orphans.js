#!/usr/bin/env node
/**
 * Register the 6 expanded orphan articles in blog-articles.json.
 * The JSON is the gatekeeper: /blog listing, sitemap and blog rendering all read
 * from it. Without an entry the .md file is invisible to the site.
 *
 * Also adds 301 redirects for the 5 merged orphans so any existing inbound
 * links or bookmarks point at the live article that absorbed the content.
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const REDIRECTS_PATH = path.join(__dirname, '../content/redirects.json');

const data = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
const articles = data.articles;
const existing = new Set(articles.map(a => a.slug));

// --- 1. Register the 6 expanded articles -------------------------------------
const toRegister = [
    {
        slug: 'uk-corporate-tax-guide-2026',
        title: 'UK Corporation Tax 2026: Rates, Deadlines and How to Pay Less',
        metaTitle: 'UK Corporation Tax 2026 | Rates, Deadlines, CT600',
        metaDescription: 'UK corporation tax rates for 2026 including small profits and marginal relief, accounting period rules, CT600 filing deadlines, payment on account, and penalties for late filing.',
        category: 'Tax & Finance',
        tags: ['corporate tax', 'CT600', 'HMRC', 'marginal relief', 'R&D', '2026', 'non-resident', 'UK Ltd', 'tax planning'],
        focusKeyword: 'uk corporation tax 2026',
        secondaryKeywords: ['corporation tax rates uk 2026', 'ct600 filing deadline', 'uk company tax payment on account', 'small profits relief corporation tax', 'marginal relief fraction uk', 'when must a uk ltd file corporation tax return'],
        searchIntent: 'informational',
        commercialIntent: 'medium',
        featured: false,
        readTime: 11,
        image: '/images/blog_wise_vs_ukbanks_guide.png'
    },
    {
        slug: 'dormant-company-compliance',
        title: 'Dormant UK Companies: Annual Compliance and Filing Rules 2026',
        metaTitle: 'Dormant Company UK 2026 | Compliance & Filing Rules',
        metaDescription: 'Keeping a UK Ltd dormant still carries filing duties. What you must file each year, dormant accounts rules, Corporation Tax and CT600 deadlines, and the penalties for missing them.',
        category: 'Tax & Finance',
        tags: ['dormant company', 'compliance', 'CS01', 'dormant accounts', 'strike-off', '2026', 'non-resident', 'UK Ltd', 'annual filing'],
        focusKeyword: 'dormant company uk compliance',
        secondaryKeywords: ['dormant ltd company filing requirements', 'uk dormant accounts rules', 'dormant company corporation tax', 'how to keep a uk company dormant', 'uk company strike off risk', 'dormant company annual cost'],
        searchIntent: 'informational',
        commercialIntent: 'medium',
        featured: false,
        readTime: 10,
        image: '/images/blog_uk_formation_guide_2026.png'
    },
    {
        slug: 'hidden-costs-uk-formation',
        title: 'The Real Cost of Setting Up a UK Ltd: What Low-Price Formation Offers Hide',
        metaTitle: 'UK Ltd Formation Costs 2026 | Full Breakdown + Hidden Fees',
        metaDescription: 'Beyond the formation fee: first-year accounts, corporation tax registration, registered office, confirmation statement and director service address. What a UK Ltd really costs from £119.99.',
        category: 'Company Formation',
        tags: ['formation cost', 'hidden costs', 'total cost of ownership', 'registered office', 'accounting', '2026', 'non-resident', 'UK Ltd', 'pricing'],
        focusKeyword: 'uk ltd formation cost breakdown',
        secondaryKeywords: ['cost of setting up a uk limited company', 'uk company formation hidden fees', 'first year costs uk ltd', 'how much does a uk ltd cost', 'cheapest vs cheapest uk company formation', 'uk company formation total cost of ownership'],
        searchIntent: 'commercial',
        commercialIntent: 'high',
        featured: false,
        readTime: 10,
        image: '/images/hero-pricing.jpg'
    },
    {
        slug: 'solopreneur-uk-ltd-benefits',
        title: 'Solopreneur UK Ltd: Benefits for Founders Working Alone',
        metaTitle: 'Solopreneur UK Ltd 2026 | Benefits of Going Limited',
        metaDescription: 'Why a one-person business benefits from forming a UK Ltd — limited liability, tax efficiency, credibility with UK clients, and easy share issuance when you bring in a partner later.',
        category: 'Business Strategy',
        tags: ['solopreneur', 'sole trader', 'freelance', 'limited liability', 'one person business', '2026', 'non-resident', 'UK Ltd', 'structure'],
        focusKeyword: 'solopreneur uk ltd benefits',
        secondaryKeywords: ['sole trader vs limited company', 'one person business uk company', 'freelancer should form a uk ltd', 'benefits of ltd company for solo founder', 'uk ltd for contractors and consultants', 'should a freelancer incorporate uk'],
        searchIntent: 'commercial',
        commercialIntent: 'high',
        featured: false,
        readTime: 9,
        image: '/images/hero-home.png'
    },
    {
        slug: 'uk-startup-ip-protection',
        title: 'Protecting Your Brand After Incorporation: UK Trademarks and IP',
        metaTitle: 'UK Trademark Guide 2026 | Protect Your Brand Post-Incorporation',
        metaDescription: 'Registering a company name does not give you trademark rights. How to file a UK trademark for your brand, what copyright and design rights cover, and when to do it relative to formation.',
        category: 'Business Strategy',
        tags: ['trademark', 'IP', 'intellectual property', 'copyright', 'design rights', '2026', 'non-resident', 'UK Ltd', 'branding'],
        focusKeyword: 'uk trademark for company name',
        secondaryKeywords: ['do i need a trademark uk', 'company name vs trademark uk', 'how to register a uk trademark', 'protecting brand after ltd formation', 'can i trademark a company name', 'uk intellectual property protection for startups'],
        searchIntent: 'informational',
        commercialIntent: 'medium',
        featured: false,
        readTime: 10,
        image: '/images/hero-home.png'
    },
    {
        slug: 'digital-nomad-uk-business-hub',
        title: 'Digital Nomads and the UK Ltd: Why Founders Are Registering Companies From Abroad',
        metaTitle: 'Digital Nomad UK Ltd 2026 | Form a Company From Abroad',
        metaDescription: 'Why digital nomads register a UK Ltd — separate legal personality, multi-currency banking, Stripe and Wise access, and no UK residency requirement. Where to register and what it costs in 2026.',
        category: 'Business Strategy',
        tags: ['digital nomad', 'remote work', 'location independent', 'expat founder', '2026', 'non-resident', 'UK Ltd', 'global business'],
        focusKeyword: 'digital nomad uk company',
        secondaryKeywords: ['register uk company as digital nomad', 'uk ltd for remote workers', 'form uk company while travelling', 'digital nomad business structure uk', 'can i form a uk company from abroad', 'uk company for expat entrepreneurs'],
        searchIntent: 'informational',
        commercialIntent: 'medium',
        featured: false,
        readTime: 10,
        image: '/images/hero-uk.jpg'
    }
];

let nextId = Math.max(...articles.map(a => a.id)) + 1;
let added = 0;
let skipped = 0;

console.log('=== REGISTERING EXPANDED ORPHANS ===\n');

toRegister.forEach(item => {
    if (existing.has(item.slug)) {
        console.log('SKIP (already registered): ' + item.slug);
        skipped++;
        return;
    }

    // Verify the markdown file actually exists and is substantial
    const mdPath = path.join(__dirname, '../content/blog/' + item.slug + '.md');
    if (!fs.existsSync(mdPath)) {
        console.log('ERROR — markdown missing: ' + item.slug);
        return;
    }
    const words = fs.readFileSync(mdPath, 'utf8').split(/\s+/).length;
    if (words < 800) {
        console.log('ERROR — too thin (' + words + ' words): ' + item.slug);
        return;
    }

    articles.push({
        id: nextId,
        slug: item.slug,
        title: item.title,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        category: item.category,
        tags: item.tags,
        publishedDate: '2026-10-04',
        updatedDate: '2026-10-04',
        focusKeyword: item.focusKeyword,
        secondaryKeywords: item.secondaryKeywords,
        searchIntent: item.searchIntent,
        commercialIntent: item.commercialIntent,
        featured: item.featured,
        readTime: item.readTime,
        image: item.image,
        imageAlt: item.title,
        excerpt: item.metaDescription.substring(0, 180)
    });

    console.log('ADDED  ID ' + nextId + '  ' + item.slug + '  (' + words + ' words, ' + item.category + ')');
    nextId++;
    added++;
});

fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles }, null, 2) + '\n', 'utf8');
console.log('\nRegistered: ' + added + ', skipped: ' + skipped);
console.log('Total articles now: ' + articles.length);

// --- 2. Add redirects for merged orphans -------------------------------------
console.log('\n=== ADDING REDIRECTS FOR MERGED ORPHANS ===\n');

const redirects = JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'));
const existingFrom = new Set(redirects.map(r => r.from));

const newRedirects = [
    { from: '/blog/vat-registration-guide-2026', to: '/blog/vat-registration-threshold-uk-2026' },
    { from: '/blog/directors-service-address-privacy', to: '/blog/director-service-address-uk-what-is-it' },
    { from: '/blog/registered-office-privacy-guide', to: '/blog/uk-registered-office-address-requirements-2026' },
    { from: '/blog/uk-registered-office-guide', to: '/blog/uk-registered-office-address-requirements-2026' },
    { from: '/blog/sic-codes-classification-guide', to: '/blog/sic-codes-pakistan-textile-manufacturing-trade' }
];

let addedRedirects = 0;
newRedirects.forEach(r => {
    if (existingFrom.has(r.from)) {
        console.log('SKIP (exists): ' + r.from);
        return;
    }
    redirects.push(r);
    console.log('ADDED  ' + r.from + ' -> ' + r.to);
    addedRedirects++;
});

fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(redirects, null, 2) + '\n', 'utf8');
console.log('\nRedirects added: ' + addedRedirects + ' (total ' + redirects.length + ')');
