const fs = require('fs');
const path = require('path');

const articlesPath = 'content/blog/blog-articles.json';
const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const articles = data.articles;

console.log('Total articles:', articles.length);

// 1. Update stale dates
const STALE_IDS = {
    1: true, 7: true, 14: true, 24: true, 25: true, 32: true, 33: true,
    34: true, 35: true, 36: true, 37: true, 38: true, 50: true, 53: true,
    65: true, 66: true, 67: true, 68: true, 69: true, 70: true, 71: true,
    72: true, 73: true, 74: true, 75: true, 76: true, 77: true, 78: true,
    79: true, 80: true, 81: true, 82: true, 83: true, 84: true
};
const TARGET = '2026-09-14';
let updated = 0;
articles.forEach(a => {
    if (STALE_IDS[a.id] && a.updatedDate !== TARGET) {
        a.updatedDate = TARGET;
        updated++;
        console.log('Updated date:', a.id, a.slug, '->', TARGET);
    }
});
console.log('Date updates:', updated);

// 2. Add images for articles missing them
const IMAGE_MAP = {
    'uk-company-formation-complete-guide-2026': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK Company Formation complete guide 2026' },
    'uk-ltd-vs-us-llc': { img: '/images/blog_ukltd_vs_usllc_comparison.png', alt: 'UK Ltd vs US LLC comparison 2026' },
    'uk-company-vs-delaware-c-corp': { img: '/images/blog_ukltd_vs_usllc_comparison.png', alt: 'UK Company vs Delaware C-Corp comparison' },
    'wise-vs-uk-banks-non-residents': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Wise vs Traditional UK Banks for non-residents' },
    'uk-ltd-vs-offshore-company': { img: '/images/blog_ukltd_vs_usllc_comparison.png', alt: 'UK Ltd vs Offshore Company comparison' },
    'business-banking-uk-ltd-non-residents': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'UK business banking for non-resident directors' },
    'uk-company-formation-cost-breakdown-2026': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK company formation cost breakdown 2026' },
    'cheapest-way-register-uk-company-2026': { img: '/images/hero-pricing.jpg', alt: 'Cheapest way to register UK company 2026' },
    'director-service-address-uk-what-is-it': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Director service address explained' },
    'same-day-company-formation-uk-2026': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Same day company formation UK 2026' },
    'uk-ltd-company-annual-costs-2026': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK Ltd company annual costs 2026' },
    'acsp-identity-verification-2026': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'ACSP identity verification 2026' },
    'closing-uk-company-guide': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Closing a UK company guide' },
    'revolut-business-vs-wise-business-uk-ltd-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Revolut vs Wise Business UK Ltd comparison' },
    'payoneer-business-account-uk-ltd-setup-guide-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Payoneer business account setup for UK LTD' },
    'tide-business-account-uk-ltd-non-resident-review-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Tide business account review for non-residents' },
    'airwallex-business-account-uk-ltd-guide-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Airwallex business account for UK Ltd' },
    'traditional-uk-corporate-bank-accounts-barclays-hsbc-lloyds-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Traditional UK corporate bank accounts' },
    'uk-ltd-high-risk-gemstones-precious-metals-jewelry-export-guide-2026': { img: '/images/hero-uk.jpg', alt: 'UK company registration for gemstone business' },
    'uk-bank-accounts-high-risk-industries-gemstones-crypto-precious-metals-2026': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'UK bank accounts for high-risk industries' },
    'exporting-pakistani-gemstones-europe-uk-ltd-compliance-2026': { img: '/images/hero-home.jpg', alt: 'Pakistani gemstone export to Europe via UK' },
    'aml-red-flags-uk-ltd-avoid-account-freezes-high-risk': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'AML red flags and account freeze prevention' },
    'bangalore-fintech-startups-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Bangalore fintech startup expansion via UK' },
    'dhaka-garment-exporters-uk-ltd-guide-2026': { img: '/images/blog/pakistan-leather-textile-pillar.png', alt: 'Dhaka garment exporters via UK company' },
    'colombo-call-centers-bpo-uk-company': { img: '/images/hero-home.jpg', alt: 'Sri Lankan BPO with UK presence' },
    'nepal-it-freelancers-uk-ltd-payment-gateways': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Nepali IT freelancer global payment gateways' },
    'global-exporters-hub-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Global exporters hub via UK Ltd' },
    'ltd-company-vs-sole-trader': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'LTD company vs sole trader 2026' },
    'what-happens-after-you-register-a-company': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Post-formation checklist' },
    'uk-company-directors-rights-duties-responsibilities': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK company director duties guide' },
    'what-is-a-confirmation-statement-companies-house-guide': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Companies House confirmation statement guide' },
    'can-i-register-a-uk-company-as-a-non-uk-resident': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Register UK company as non-resident guide' },
    'best-company-formation-services-uk-2026-comparison': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Best company formation services comparison' },
    'bangladesh-exporter-guide-spices-garments-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Bangladesh spice and garment exporters via UK' },
    'uk-bank-account-south-asian-exporters-currency-management': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'Multi-currency UK bank account from South Asia' },
    'global-food-export-guide-coffee-meat-seafood-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Global food export via UK hub' },
    'global-tendering-guide-uk-ltd-high-ticket-export': { img: '/images/hero-uk.jpg', alt: 'Global tendering playbook via UK hub' },
    'register-uk-ltd-online-india-pakistan-2026': { img: '/images/blog/pakistan-leather-textile-pillar.png', alt: 'UK company registration from Pakistan and India' },
    'export-indian-fashion-apparel-london-office': { img: '/images/hero-us.jpg', alt: 'Indian fashion export via London office' },
    'indian-brands-usa-market-uk-logistics-entity': { img: '/images/hero-home.jpg', alt: 'Indian brands USA market via UK entity' },
    'exporting-industrial-lubricants-gases-tendering-guide': { img: '/images/blog/pakistan-leather-textile-pillar.png', alt: 'Industrial lubricants and gases export via UK' },
    'gps-gprs-tech-exports-military-tenders-uk-ltd': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'GPS GPRS tech exports for military tenders' },
    'refurbished-construction-machinery-export-uk-ltd': { img: '/images/hero-home.jpg', alt: 'Refurbished construction machinery export' },
    'damaged-cars-export-dubai-hub-uk-ltd-guide': { img: '/images/blog_ukltd_vs_usllc_comparison.png', alt: 'Dubai-UK car export corridor' },
    'uk-company-tax-efficiency-non-residents': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK company tax efficiency for non-residents' },
    'required-documents-uk-ltd-ireland': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'UK company formation documents checklist' },
    'why-irish-entrepreneurs-choose-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Why Irish entrepreneurs choose UK LTD' },
    'india-manufacturer-roadmap-usa-europe-uk-ltd': { img: '/images/hero-uk.jpg', alt: 'Indian manufacturers global expansion via UK' },
    'sic-codes-india-exporters-wholesale-manufacturing': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'SIC codes for Indian exporters' },
    'uk-banking-cross-border-payments-india-businesses': { img: '/images/blog_wise_vs_ukbanks_guide.png', alt: 'UK banking for Indian businesses' },
    'bangladesh-rmg-sector-export-uk-strategic-hub': { img: '/images/blog/sialkot-safety-wear.png', alt: 'Bangladesh RMG export via UK hub' },
    'globalize-spice-exports-bangladesh-india-uk-market': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Spice exports from Bangladesh and India to UK market' },
    'sic-codes-agricultural-food-exports-eu-guide': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'SIC codes for agricultural food exports to EU' },
    'exporting-premium-coffee-to-uk-usa-market-guide': { img: '/images/hero-home.jpg', alt: 'Premium coffee export to UK and USA' },
    'meat-and-poultry-export-regulations-uk-eu-guide': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'Meat and poultry export regulations UK and EU' },
    'seafood-export-strategies-global-markets-uk-ltd': { img: '/images/blog/sialkot-safety-wear.png', alt: 'Seafood export strategies for global markets via UK' },
    'sic-codes-food-beverage-exporters-compliance-guide': { img: '/images/blog_uk_formation_guide_2026.png', alt: 'SIC codes for food and beverage exporters' },
    'exporting-pakistani-gemstones-europe-uk-ltd-compliance-2026': { img: '/images/hero-home.jpg', alt: 'Pakistani gemstone export to Europe via UK' },
    'sialkot-export-leather-wear-uk-company': { img: '/images/blog/sialkot-safety-wear.png', alt: 'Sialkot safety wear export via UK company' },
    'faisalabad-textile-mills-europe-expansion-uk-ltd': { img: '/images/hero-home.jpg', alt: 'Faisalabad textile mills Europe expansion via UK' },
    'exporting-damaged-cars-uk-dubai-hub-guide': { img: '/images/blog_ukltd_vs_usllc_comparison.png', alt: 'Damaged car export via UK Dubai hub' }
};

let imgAdded = 0;
articles.forEach(a => {
    if (!a.image && IMAGE_MAP[a.slug]) {
        a.image = IMAGE_MAP[a.slug].img;
        a.imageAlt = IMAGE_MAP[a.slug].alt;
        imgAdded++;
        console.log('Added image:', a.id, a.slug);
    }
});
console.log('Image additions:', imgAdded);

// 3. Fix long meta titles (over 60 chars)
let titleFixed = 0;
articles.forEach(a => {
    if (a.metaTitle && a.metaTitle.length > 60) {
        let parts = a.metaTitle.split('|');
        let newTitle = parts[0].trim();
        if (newTitle.length > 60) newTitle = newTitle.substring(0, 57) + '...';
        a.metaTitle = newTitle;
        titleFixed++;
        console.log('Fixed title:', a.id, a.slug, 'was', a.metaTitle.length, 'chars');
    }
});
console.log('Title fixes:', titleFixed);

// Write back
fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
console.log('\n=== DONE ===');
console.log('Articles:', articles.length, '| Dates:', updated, '| Images:', imgAdded, '| Titles:', titleFixed);
