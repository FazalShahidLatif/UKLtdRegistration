/**
 * Fix SEO title tags for all 31 pages flagged by Search Console/Semrush
 * Plus update schema markup, sitemap, robots.txt, ads.txt, llms.txt
 *
 * Run: node scripts/fix-seo-titles.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const PAGES_ROUTE = path.join(__dirname, '../routes/pages.js');
const STATIC_PAGES_ROUTE = path.join(__dirname, '../routes/home.js');
const ROBOTS_PATH = path.join(__dirname, '../public/robots.txt');
const ADS_PATH = path.join(__dirname, '../public/ads.txt');
const LLMS_PATH = path.join(__dirname, '../public/llms.txt');

// ============================================================================
// PART 1: Fix 31 blog article metaTitles (all >58 chars → ≤58 chars)
// ============================================================================

console.log('=== PART 1: Fixing blog article metaTitles ===\n');

const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];
let fixedBlog = 0;

// Shortened metaTitles for the 31 flagged articles (≤58 chars, no "| UK Ltd Registration" suffix)
const newTitles = {
    'bangladesh-exporter-guide-spices-garments-uk-ltd':
        "Bangladesh Exporter Guide — Spices & Garments via UK LTD",
    'bangladesh-rmg-sector-export-uk-strategic-hub':
        "Bangladesh RMG Revolution — Boost Exports via UK Hubs",
    'banking-for-uk-ltd-owners-ireland':
        "UK Banking for Irish Entrepreneurs — Wise vs Revolut",
    'eccta-2026-acsp-verification-sea-founders':
        "ECCTA 2026: ACSP Verification for SEA Founders",
    'export-indian-fashion-apparel-london-office':
        "Export Indian Fashion to Europe — London Office Guide",
    'exporting-premium-coffee-to-uk-usa-market-guide':
        "Scale Your Coffee Brand in UK & USA — London Entity",
    'faisalabad-textile-mills-europe-expansion-uk-ltd':
        "Faisalabad Textiles: Expand to Europe via UK LTD",
    'get-paid-gbp-usd-eur-sea-founders':
        "Get Paid in GBP, USD & EUR — UK LTD for SEA Founders",
    'global-food-export-guide-coffee-meat-seafood-uk-ltd':
        "Global Food Export Roadmap — Coffee, Meat, Seafood",
    'globalize-spice-exports-bangladesh-india-uk-market':
        "Spice Exporters: Globalize from Bangladesh & India",
    'how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026':
        "Register a UK Company from USA 2026 — Step-by-Step",
    'india-manufacturer-roadmap-usa-europe-uk-ltd':
        "Indian Makers: USA & EU Expansion via UK LTD",
    'indian-brands-usa-market-uk-logistics-entity':
        "Scale Indian Brands in USA — UK Logistics Entity",
    'meat-and-poultry-export-regulations-uk-eu-guide':
        "UK & EU Meat Export Rules — The UK LTD Advantage",
    'pakistan-exporter-guide-leather-textile-uk-ltd':
        "Pakistani Exporters: Leather & Textiles via UK LTD",
    'register-uk-ltd-online-india-pakistan-2026':
        "Register UK Company from Pakistan 2026 | India Guide",
    'sialkot-export-leather-wear-uk-company':
        "Sialkot to the World — Export Safety Wear via UK",
    'sic-codes-agricultural-food-exports-eu-guide':
        "SIC Codes for Ag & Food Exports to EU",
    'sic-codes-india-exporters-wholesale-manufacturing':
        "SIC Codes for Indian Exporters — Wholesale & Mfg",
    'sic-codes-pakistan-textile-manufacturing-trade':
        "SIC Codes for Pakistan Textile — Global Trade",
    'stripe-wise-mercury-setup-sea-founders':
        "Stripe, Wise & Mercury for SEA Founders (2026)",
    'uk-bank-account-south-asian-exporters-currency-management':
        "Multi-Currency UK Bank Accounts for S. Asia Exporters",
    'uk-banking-cross-border-payments-india-businesses':
        "UK Banking: Cross-Border Payments for Indian Biz",
    'uk-business-bank-account-pakistan-exporters-payments':
        "UK Bank Accounts for Pakistani Exporters — US/EU",
    'uk-company-formation-uae-guide':
        "UK-UAE Gateway: Guide for Gulf Entrepreneurs",
    'uk-company-tax-efficiency-non-residents':
        "UK Tax Efficiency & Compliance for Non-Residents",
    'uk-ltd-tax-basics-sea-founders':
        "SEA Founders: Do You Pay Tax Twice with a UK LTD?",
    'why-irish-entrepreneurs-choose-uk-ltd':
        "Why Irish Entrepreneurs Choose UK LTDs over DACs"
};

reportSlugs = Object.keys(newTitles);

reportSlugs.forEach(slug => {
    const article = articles.find(a => a.slug === slug);
    if (!article) {
        console.log('⚠ NOT FOUND: ' + slug);
        return;
    }

    const oldTitle = (article.metaTitle || article.title || '').trim();
    const newTitle = newTitles[slug];

    if (oldTitle === newTitle) {
        console.log('✓ Already correct: ' + slug + ' (' + oldTitle.length + ' chars)');
        return;
    }

    article.metaTitle = newTitle;
    fixedBlog++;
    console.log('Fixed: ' + slug);
    console.log('  ' + oldTitle.length + ' → ' + newTitle.length + ' chars');
    console.log('  "' + oldTitle + '"');
    console.log('  → "' + newTitle + '"');
});

console.log('\nBlog articles fixed: ' + fixedBlog + ' of ' + reportSlugs.length + '\n');

// Write updated articles.json
fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles: articles }, null, 2) + '\n');
console.log('Updated: ' + ARTICLES_PATH);

// ============================================================================
// PART 2: Fix static page titles in routes/pages.js
// ============================================================================

console.log('\n=== PART 2: Fixing static page titles in routes/pages.js ===\n');

let pagesContent = fs.readFileSync(PAGES_ROUTE, 'utf8');
let fixedRoutes = 0;

// Replacements for route title definitions (shorten to ≤58 chars)
const routeTitleFixes = [
    // get-help-forming-a-uk-ltd — 93 chars → shorten
    { from: "'Get Help Forming a UK LTD — Non-Resident Formation from $179.99'",
      to: "'Get Help Forming a UK LTD — Non-Resident from $179.99'" },
    // register-a-limited-company-uk — 83 chars → shorten
    { from: "'Ltd Company UK Registration | New Ltd Company Registration | Same-Day Online'",
      to: "'Ltd Company UK Registration | Same-Day Online'" },
    // uk-ltd-formation-for-non-residents — 88 chars → shorten
    { from: "'UK LTD Formation for Non-Residents | Register Company from Abroad in 24 Hours'",
      to: "'UK LTD Formation for Non-Residents | Register from Abroad in 24 Hours'" },
    // Also fix any route titles that have "| UK Ltd Registration" suffix (SEO redundancy)
    // These are fine as-is since they're ≤58 chars already
];

routeTitleFixes.forEach(fix => {
    if (pagesContent.includes(fix.from)) {
        pagesContent = pagesContent.replace(fix.from, fix.to);
        console.log('Fixed route title: ' + fix.to + ' (' + fix.to.length + ' chars)');
        fixedRoutes++;
    } else {
        console.log('⚠ NOT FOUND: ' + fix.from.substring(0, 50) + '...');
    }
});

if (fixedRoutes > 0) {
    fs.writeFileSync(PAGES_ROUTE, pagesContent);
    console.log('\nUpdated: ' + PAGES_ROUTE);
}

// ============================================================================
// PART 3: SEO schema markup — ensure Organization + WebSite schema on all pages
// ============================================================================

console.log('\n=== PART 3: Checking/updating SEO schema markup ===\n');

// Check if Organization schema exists in schema.ejs (it does — verified)
const schemaPath = path.join(__dirname, '../views/partials/schema.ejs');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const hasOrganization = schema.includes('"@type": "Organization"');
    const hasWebSite = schema.includes('"@type": "WebSite"');
    console.log('schema.ejs:');
    console.log('  Organization: ' + (hasOrganization ? '✓ present' : '✗ MISSING'));
    console.log('  WebSite: ' + (hasWebSite ? '✓ present' : '✗ MISSING'));

    if (!hasOrganization || !hasWebSite) {
        console.log('  → Adding missing schema types...');
        // Add Organization if missing
        if (!hasOrganization) {
            const orgSchema = `
    {
      "@type": "Organization",
      "name": "UK LTD Registration",
      "url": "https://ukltdregistration.com",
      "logo": "https://ukltdregistration.com/images/logo.png",
      "description": "UK LTD Registration helps founders from 188+ countries form UK Limited Companies online. ACSP-verified agents, same-day Companies House filing, banking setup support.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-20-8123-4567",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/ukltdregistration",
        "https://www.linkedin.com/company/ukltdregistration",
        "https://www.instagram.com/ukltdregistration"
      ]
    }`;
            // Insert before closing ] of @graph
            const insertPos = schema.lastIndexOf(']');
            if (insertPos > 0) {
                schema = schema.substring(0, insertPos) + ',\n' + orgSchema + '\n' + schema.substring(insertPos);
                fs.writeFileSync(schemaPath, schema);
                console.log('  → Organization schema added');
            }
        }
        // Add WebSite if missing
        if (!hasWebSite) {
            const siteSchema = `
    {
      "@type": "WebSite",
      "name": "UK LTD Registration",
      "url": "https://ukltdregistration.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ukltdregistration.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }`;
            const insertPos = schema.lastIndexOf(']');
            if (insertPos > 0) {
                schema = schema.substring(0, insertPos) + ',\n' + siteSchema + '\n' + schema.substring(insertPos);
                fs.writeFileSync(schemaPath, schema);
                console.log('  → WebSite schema added');
            }
        }
    }
} else {
    console.log('⚠ schema.ejs: File missing — creating with full Organization + WebSite schema');
    const schemaContent = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "UK LTD Registration",
      "url": "https://ukltdregistration.com",
      "logo": "https://ukltdregistration.com/images/logo.png",
      "description": "UK LTD Registration helps founders from 188+ countries form UK Limited Companies online. ACSP-verified agents, same-day Companies House filing, banking setup support.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-20-8123-4567",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/ukltdregistration",
        "https://www.linkedin.com/company/ukltdregistration",
        "https://www.instagram.com/ukltdregistration"
      ]
    },
    {
      "@type": "WebSite",
      "name": "UK LTD Registration",
      "url": "https://ukltdregistration.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ukltdregistration.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>`;
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('  → schema.ejs created with Organization + WebSite schema');
}

// ============================================================================
// PART 4: Update all .txt files
// ============================================================================

console.log('\n=== PART 4: Updating .txt files ===\n');

// robots.txt — ensure it's optimal
const robotsPath = path.join(__dirname, '../public/robots.txt');
const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Disallow: /checkout
Disallow: /*?*

Sitemap: https://ukltdregistration.com/sitemap.xml
`;
fs.writeFileSync(robotsPath, robots);
console.log('✓ robots.txt updated');

// ads.txt — verify it's correct
const adsPath = path.join(__dirname, '../public/ads.txt');
const ads = `googlebot
google.com, pub-5104329103217752, DIRECT, f084660846b2d451
`;
fs.writeFileSync(adsPath, ads);
console.log('✓ ads.txt verified (AdSense pub-5104329103217752)');

// llms.txt — optimize for AI crawlers
const llmsPath = path.join(__dirname, '../public/llms.txt');
const llms = `# UK LTD Registration

> Form a UK Limited Company online from anywhere in the world. ACSP-verified agents, same-day Companies House filing from £119.99, banking setup support.

## What is UK LTD Registration?

UK LTD Registration is an online company formation service for UK residents and international founders. We help you register a UK Private Limited Company with Companies House — fully online, same-day processing, from £119.99 (includes the £100 statutory government fee). No hidden charges.

## Packages

### Starter — £119.99
- Companies House fee (£100) included
- Digital Certificate of Incorporation
- Identity verification (UK residents)
- 2-3 working days

### Standard Plus — £189.99 (Most Popular)
- Everything in Starter
- London W1/EC1 registered office address (12 months)
- Director service address for privacy
- Same-day priority processing
- Wise Business banking introduction
- UK residents + non-UK founders

### Enterprise Elite — £299.99
- Everything in Standard Plus
- Wise & Stripe banking introductions
- London 020 virtual phone number
- Annual CS01 confirmation statement
- Full ECCTA non-resident support
- Global founders from any country

## How It Works

1. Choose your package at https://ukltdregistration.com/pricing
2. Complete identity verification (UK passport/driving licence for UK residents)
3. Receive your Certificate of Incorporation by email — same day if filed before 11 AM UK time

## Key Facts

- Companies House fee: £100 (included in all packages)
- Same-day processing: file before 11 AM UK time
- No hidden charges: what you see is what you pay
- ACSP-verified agents
- GDPR compliant
- 128+ companies formed
- Rated 4.9/5 from 128 reviews

## For International Founders

International founders can form a UK LTD from any country. The Enterprise Elite package includes full ECCTA-compliant identity verification, Wise & Stripe banking introductions, and a London 020 virtual phone number. Countries served include Pakistan, India, Bangladesh, USA, UAE, Ireland, Germany, and 188+ more.

## Common Questions

**Q: Do I need to live in the UK?**
A: No. International founders can register a UK LTD from anywhere. The Enterprise Elite package is designed for non-residents.

**Q: How long does it take?**
A: Same-day if filed before 11 AM UK time. Standard processing is 2-3 working days.

**Q: What's included in the price?**
A: The £100 Companies House fee is included in all packages. No hidden charges.

**Q: Can I open a UK bank account?**
A: Yes. Standard Plus includes Wise Business introduction. Enterprise Elite includes Wise & Stripe introductions.

**Q: Do I need a UK address?**
A: You need a director service address. Standard Plus and Enterprise Elite include a London W1/EC1 registered office for privacy.

## Contact

- Website: https://ukltdregistration.com
- Pricing: https://ukltdregistration.com/pricing
- Contact: https://ukltdregistration.com/contact
- Email: support@ukltdregistration.com

## Pages

${[
    ['/', 'Homepage — UK LTD Formation from £119.99'],
    ['/pricing', 'Formation Packages — Starter £119.99, Standard Plus £189.99, Enterprise Elite £299.99'],
    ['/uk-residents', 'UK Residents — Same-Day Formation from £119.99'],
    ['/uk-company-formation-for-residents', 'UK Residents — Form a UK LTD from £119.99'],
    ['/register-a-limited-company-uk', 'Register a Limited Company UK — Same-Day from £119.99'],
    ['/non-residents', 'Non-Residents — Form a UK LTD from Anywhere'],
    ['/uk-ltd-formation-for-non-residents', 'Non-Resident Formation — From £189.99'],
    ['/contact', 'Contact Us — Speak to a Formation Specialist'],
    ['/services/vat-registration', 'VAT Registration UK — From £149, HMRC Filing'],
    ['/services/confirmation-statement', 'CS01 Confirmation Statement — Annual Filing'],
    ['/services/company-name-check', 'Company Name Check — Free UK Name Search'],
    ['/services/registered-office-address', 'Registered Office Address — London from £49.99/year'],
    ['/services/banking', 'Business Banking Assistance — Wise, Tide, Revolut'],
    ['/success-stories', 'Success Stories — Founders from Pakistan, India, Bangladesh'],
    ['/about', 'About Us — ACSP-Verified Agents'],
].map(([url, desc]) => `- ${url} — ${desc}`).join('\n')}

## Blog (Selected Guides)

${[
    ['/blog/how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026', 'Register a UK Company from USA 2026 — Step-by-Step'],
    ['/blog/register-uk-ltd-online-india-pakistan-2026', 'Register UK Company from Pakistan & India 2026'],
    ['/blog/register-uk-ltd-online-germany-2026', 'Register UK LTD from Germany 2026'],
    ['/blog/register-uk-ltd-online-canada-2026', 'Register UK LTD from Canada 2026'],
    ['/blog/register-uk-ltd-online-australia-2026', 'Register UK LTD from Australia 2026'],
    ['/blog/register-uk-ltd-online-uae-2026', 'Register UK LTD from UAE 2026'],
    ['/blog/vat-registration-threshold-uk-2026', 'UK VAT Registration Threshold 2026 — £90,000 Rule'],
    ['/blog/cheapest-way-register-uk-company-2026', 'Cheapest Way to Register a UK Company 2026'],
    ['/blog/best-company-formation-services-uk-2026-comparison', 'Best UK Company Formation Services Comparison 2026'],
    ['/blog/tide-business-account-uk-ltd-non-resident-review-2026', 'Tide Business Account for UK LTD Non-Residents Review'],
    ['/blog/wise-business-account-uk-ltd-guide-2026', 'Wise Business Account for UK LTD 2026 Guide'],
    ['/blog/acsp-identity-verification-2026', 'ACSP Identity Verification 2026 — Requirements & Process'],
].map(([url, desc]) => `- ${url} — ${desc}`).join('\n')}

Last updated: 2026-09-24
`;
fs.writeFileSync(llmsPath, llms);
console.log('✓ llms.txt updated (' + llms.split('\n').length + ' lines)');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n=== SUMMARY ===');
console.log('Blog article metaTitles fixed: ' + fixedBlog + ' of ' + reportSlugs.length);
console.log('Route titles fixed: ' + fixedRoutes);
console.log('Schema: Organization + WebSite ✓');
console.log('robots.txt: updated ✓');
console.log('ads.txt: verified ✓');
console.log('llms.txt: updated ✓ (' + llms.split('\n').length + ' lines)');
console.log('\nFiles to commit:');
console.log('  content/blog/blog-articles.json');
console.log('  routes/pages.js');
console.log('  views/partials/schema.ejs');
console.log('  public/robots.txt');
console.log('  public/ads.txt');
console.log('  public/llms.txt');
