/**
 * Add internal links FROM Phase 2 articles TO related articles
 * Including the new banking hub page, formation pages, and related Phase 2 articles.
 * 
 * Run: node scripts/add-phase2-internal-links.js
 */

const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8')).articles || [];

// Phase 2 articles to process
const phase2Ids = [85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116];

// Define internal linking rules per category/topic
// Map: article ID → array of { url, anchorText } links to add to "Related" section
const linkRules = {
    // Insurance business → related financial services
    91: [
        { url: '/blog/wise-vs-uk-banks-non-residents', anchor: 'Wise vs Traditional UK Banks for Non-Residents' },
        { url: '/blog/business-banking-uk-ltd-non-residents', anchor: 'UK Business Banking for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Legal recruitment → related business services
    92: [
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company — Which is Safer?' },
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why Sea Founders Use UK Ltd Companies' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Media/film production → related creative industries
    93: [
        { url: '/blog/uk-ltd-video-production-photography-business-2026', anchor: 'UK LTD for Video Production & Photography' },
        { url: '/blog/uk-ltd-media-film-production-2026', anchor: 'UK LTD for Media, Film & Content Production' },
        { url: '/blog/wise-vs-uk-banks-non-residents', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Pet training → related service businesses
    94: [
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/blog/uk-ltd-waste-management-recycling-business-2026', anchor: 'UK LTD for Waste Management & Recycling' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Recruitment/HR → related service industries
    95: [
        { url: '/blog/uk-ltd-legal-recruitment-agency-2026', anchor: 'UK LTD for Legal Recruitment' },
        { url: '/blog/uk-ltd-security-companies-2026', anchor: 'UK LTD for Security Companies' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Security companies → related regulated industries
    96: [
        { url: '/blog/uk-ltd-import-export-international-trade-2026', anchor: 'UK LTD for Import/Export & International Trade' },
        { url: '/blog/uk-ltd-high-risk-gemstones-precious-metals-jewelry-export-guide-2026', anchor: 'UK LTD for High-Risk Industries: Gemstones & Jewelry' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Social impact employment → related impact/ESG
    97: [
        { url: '/blog/uk-ltd-volunteering-community-services-business-2026', anchor: 'UK LTD for Volunteering & Community Services' },
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Study visa consultancy → related education/travel
    98: [
        { url: '/blog/uk-ltd-university-affiliation-partnership-2026', anchor: 'UK LTD for University Affiliation & Partnership' },
        { url: '/blog/uk-ltd-study-visa-consultancy-2026', anchor: 'UK LTD for Study Visa Consultancy' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Tax basics SEA → tax/compliance
    99: [
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/blog/uk-tax-compliance-non-resident-ireland', anchor: 'UK Tax Compliance for Irish Founders' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Transport/logistics → import/export
    100: [
        { url: '/blog/uk-ltd-import-export-international-trade-2026', anchor: 'UK LTD for Import/Export & International Trade' },
        { url: '/blog/uk-ltd-transport-logistics-business-2026', anchor: 'UK LTD for Transport & Logistics Business' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // University affiliation → study visa
    101: [
        { url: '/blog/uk-ltd-study-visa-consultancy-2026', anchor: 'UK LTD for Study Visa Consultancy' },
        { url: '/blog/uk-ltd-university-affiliation-partnership-2026', anchor: 'UK LTD for University Affiliation & Partnership' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // SEA vs local company → business strategy
    102: [
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company' },
        { url: '/blog/uk-ltd-vs-us-llc', anchor: 'UK Ltd vs US LLC' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Offshore vs UK → business strategy
    103: [
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company: When an SEA Startup Should Incorporate in the UK' },
        { url: '/blog/uk-ltd-vs-us-llc', anchor: 'UK Ltd vs US LLC' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // US LLC vs UK LTD → business strategy
    104: [
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Waste management → recycling/environmental
    105: [
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/blog/uk-ltd-construction-trades-business-2026', anchor: 'UK LTD for Construction & Trades' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Wedding planning → hospitality/events
    106: [
        { url: '/blog/uk-ltd-hospitality-tourism-business-2026', anchor: 'UK LTD for Hospitality & Tourism Business' },
        { url: '/blog/uk-ltd-food-beverage-restaurant-business-2026', anchor: 'UK LTD for Food, Beverage & Restaurant Business' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Registered office address → compliance
    107: [
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Tax compliance Ireland → tax/compliance
    108: [
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/blog/uk-tax-compliance-non-resident-ireland', anchor: 'UK Tax Compliance for Irish Founders' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // VAT threshold → tax/compliance
    109: [
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Post-formation checklist → compliance
    110: [
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Confirmation statement → compliance
    111: [
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Why Irish entrepreneurs → business strategy
    112: [
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Why SEA founders → business strategy
    113: [
        { url: '/blog/why-irish-entrepreneurs-choose-uk-ltd', anchor: 'Why Irish Entrepreneurs Choose UK LTDs' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Food/beverage → hospitality/restaurant
    85: [
        { url: '/blog/uk-ltd-wedding-planning-event-design-business-2026', anchor: 'UK LTD for Wedding Planning & Event Design' },
        { url: '/blog/uk-ltd-hospitality-tourism-business-2026', anchor: 'UK LTD for Hospitality & Tourism Business' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Franchise/licensing → business strategy
    86: [
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company' },
        { url: '/blog/uk-ltd-vs-us-llc', anchor: 'UK Ltd vs US LLC' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Health/beauty/wellness → regulated industry
    87: [
        { url: '/blog/uk-ltd-high-risk-gemstones-precious-metals-jewelry-export-guide-2026', anchor: 'UK LTD for High-Risk Industries' },
        { url: '/blog/uk-ltd-insurance-business-2026', anchor: 'UK LTD for Insurance Business' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // High-risk gemstones → regulated industry
    88: [
        { url: '/blog/uk-bank-accounts-high-risk-industries-gemstones-crypto-precious-metals-2026', anchor: 'UK Bank Accounts for High-Risk Industries' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Hospitality/tourism → events/wedding
    89: [
        { url: '/blog/uk-ltd-wedding-planning-event-design-business-2026', anchor: 'UK LTD for Wedding Planning & Event Design' },
        { url: '/blog/uk-ltd-food-beverage-restaurant-business-2026', anchor: 'UK LTD for Food, Beverage & Restaurant Business' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Import/export → global trade
    90: [
        { url: '/blog/uk-ltd-transport-logistics-business-2026', anchor: 'UK LTD for Transport & Logistics Business' },
        { url: '/blog/global-exporters-hub-uk-ltd', anchor: 'The UK Hub for Global Exporters' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Legal recruitment → recruitment/HR
    92: [
        { url: '/blog/uk-ltd-recruitment-hr-support-business-2026', anchor: 'UK LTD for Recruitment & HR Support' },
        { url: '/blog/uk-ltd-legal-recruitment-agency-2026', anchor: 'UK LTD for Legal Recruitment' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Pet training → service businesses
    94: [
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/blog/uk-ltd-volunteering-community-services-business-2026', anchor: 'UK LTD for Volunteering & Community Services' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Recruitment/HR → legal recruitment
    95: [
        { url: '/blog/uk-ltd-legal-recruitment-agency-2026', anchor: 'UK LTD for Legal Recruitment' },
        { url: '/blog/uk-ltd-recruitment-hr-support-business-2026', anchor: 'UK LTD for Recruitment & HR Support' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Security companies → SIA licensing
    96: [
        { url: '/blog/uk-ltd-security-companies-2026', anchor: 'UK LTD for Security Companies' },
        { url: '/blog/uk-ltd-import-export-international-trade-2026', anchor: 'UK LTD for Import/Export & International Trade' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Social impact → volunteering
    97: [
        { url: '/blog/uk-ltd-volunteering-community-services-business-2026', anchor: 'UK LTD for Volunteering & Community Services' },
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Study visa → university affiliation
    98: [
        { url: '/blog/uk-ltd-university-affiliation-partnership-2026', anchor: 'UK LTD for University Affiliation & Partnership' },
        { url: '/blog/uk-ltd-study-visa-consultancy-2026', anchor: 'UK LTD for Study Visa Consultancy' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Tax basics SEA → SEA content
    99: [
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/blog/uk-ltd-tax-basics-sea-founders', anchor: 'Do SEA Founders Pay Tax Twice with a UK Company?' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Transport/logistics → import/export
    100: [
        { url: '/blog/uk-ltd-import-export-international-trade-2026', anchor: 'UK LTD for Import/Export & International Trade' },
        { url: '/blog/uk-ltd-transport-logistics-business-2026', anchor: 'UK LTD for Transport & Logistics Business' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // University affiliation → study visa
    101: [
        { url: '/blog/uk-ltd-study-visa-consultancy-2026', anchor: 'UK LTD for Study Visa Consultancy' },
        { url: '/blog/uk-ltd-university-affiliation-partnership-2026', anchor: 'UK LTD for University Affiliation & Partnership' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // SEA vs local → SEA strategy
    102: [
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company: When an SEA Startup Should Incorporate in the UK' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Offshore vs UK → business strategy
    103: [
        { url: '/blog/uk-ltd-vs-us-llc', anchor: 'UK Ltd vs US LLC' },
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // US LLC vs UK → business strategy
    104: [
        { url: '/blog/uk-ltd-vs-us-llc', anchor: 'UK Ltd vs US LLC' },
        { url: '/blog/uk-ltd-vs-offshore-company', anchor: 'UK Ltd vs Offshore Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Waste management → recycling/environmental
    105: [
        { url: '/blog/uk-ltd-waste-management-recycling-business-2026', anchor: 'UK LTD for Waste Management & Recycling Business' },
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Wedding planning → hospitality/events
    106: [
        { url: '/blog/uk-ltd-wedding-planning-event-design-business-2026', anchor: 'UK LTD for Wedding Planning & Event Design' },
        { url: '/blog/uk-ltd-hospitality-tourism-business-2026', anchor: 'UK LTD for Hospitality & Tourism Business' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Registered office address → compliance
    107: [
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Tax compliance Ireland → compliance
    108: [
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/blog/uk-tax-compliance-non-resident-ireland', anchor: 'UK Tax Compliance for Irish Founders' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // VAT threshold → tax
    109: [
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Post-formation checklist → compliance
    110: [
        { url: '/blog/what-is-a-confirmation-statement-companies-house-guide', anchor: 'What is a Confirmation Statement?' },
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Confirmation statement → compliance
    111: [
        { url: '/blog/what-happens-after-you-register-a-company', anchor: 'What Happens After You Register a Company?' },
        { url: '/blog/vat-registration-threshold-uk-2026', anchor: 'UK VAT Registration Threshold 2026' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Why Irish entrepreneurs → business strategy
    112: [
        { url: '/blog/why-sea-founders-use-uk-ltd-global-2026', anchor: 'Why SEA Founders Use UK Ltd Companies' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Why SEA founders → business strategy
    113: [
        { url: '/blog/why-irish-entrepreneurs-choose-uk-ltd', anchor: 'Why Irish Entrepreneurs Choose UK LTDs' },
        { url: '/blog/uk-ltd-vs-local-company-sea-startups', anchor: 'UK Ltd vs Local Company' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Video production → media/film
    115: [
        { url: '/blog/uk-ltd-media-film-production-2026', anchor: 'UK LTD for Media, Film & Content Production' },
        { url: '/blog/uk-ltd-video-production-photography-business-2026', anchor: 'UK LTD for Video Production & Photography' },
        { url: '/blog/best-uk-business-bank-accounts-non-residents-2026', anchor: 'Best UK Business Bank Accounts for Non-Residents' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ],
    // Volunteering → community services
    116: [
        { url: '/blog/uk-ltd-volunteering-community-services-business-2026', anchor: 'UK LTD for Volunteering & Community Services' },
        { url: '/blog/uk-ltd-social-impact-employment-2026', anchor: 'UK LTD for Social Impact Employment' },
        { url: '/pricing', anchor: 'Start Your UK LTD Formation' }
    ]
};

// Articles that already have a "Related" or "Deep Dive" section — skip those
const alreadyHasRelated = { 99: true, 104: true, 114: true };

const updated = 0;
const skipped = 0;
const errors = 0;

console.log('=== Adding internal links to Phase 2 articles ===\n');

phase2Ids.forEach(function(id) {
    const article = articles.find(a => a.id === id);
    if (!article) {
        console.log('ID ' + id + ': NOT FOUND in JSON');
        return;
    }

    const slug = article.slug;
    const mdPath = path.join(__dirname, '../content/blog/' + slug + '.md');

    if (!fs.existsSync(mdPath)) {
        console.log('ID ' + id + ' (' + slug + '): FILE MISSING');
        return;
    }

    const content = fs.readFileSync(mdPath, 'utf8');
    const links = linkRules[id];

    if (!links) {
        console.log('ID ' + id + ' (' + slug + '): No link rules defined for this article');
        return;
    }

    if (alreadyHasRelated[id]) {
        console.log('ID ' + id + ' (' + slug + '): Already has related links section — skipping');
        return;
    }

    // Build the related links section
    let relatedSection = '\n---\n\n## Related Guides\n\n';
    links.forEach(function(link, index) {
        relatedSection += '- **[' + link.anchor + '](' + link.url + ')**';
        if (index < links.length - 1) relatedSection += '\n';
    });
    relatedSection += '\n';

    // Check if article already has a "Related" or "Deep Dive" section
    if (content.includes('## Related Guides') || content.includes('### Deep Dive')) {
        // Insert after the last related/deep dive heading
        const lastH3Match = content.match(/(### Deep Dive[\s\S]*)$/);
        if (lastH3Match) {
            const insertPoint = content.lastIndexOf(lastH3Match[0]);
            const newContent = content.substring(0, insertPoint) + relatedSection + '\n' + content.substring(insertPoint);
            fs.writeFileSync(mdPath, newContent, 'utf8');
            console.log('ID ' + id + ' (' + slug + '): Added internal links after Deep Dive section');
        } else {
            // Add at end of file before disclosure
            const disclosureIdx = content.lastIndexOf('**Disclosure:**');
            if (disclosureIdx > 0) {
                const newContent = content.substring(0, disclosureIdx) + relatedSection + '\n' + content.substring(disclosureIdx);
                fs.writeFileSync(mdPath, newContent, 'utf8');
                console.log('ID ' + id + ' (' + slug + '): Added internal links before disclosure');
            } else {
                const newContent = content.trim() + '\n' + relatedSection + '\n';
                fs.writeFileSync(mdPath, newContent, 'utf8');
                console.log('ID ' + id + ' (' + slug + '): Added internal links at end of file');
            }
        }
    } else {
        // No existing related section — add before final disclosure
        const disclosureIdx = content.lastIndexOf('**Disclosure:**');
        if (disclosureIdx > 0) {
            const newContent = content.substring(0, disclosureIdx) + relatedSection + '\n' + content.substring(disclosureIdx);
            fs.writeFileSync(mdPath, newContent, 'utf8');
            console.log('ID ' + id + ' (' + slug + '): Added "Related Guides" section before disclosure');
        } else {
            const newContent = content.trim() + '\n' + relatedSection + '\n';
            fs.writeFileSync(mdPath, newContent, 'utf8');
            console.log('ID ' + id + ' (' + slug + '): Added "Related Guides" section at end');
        }
    }
});

console.log('\n=== DONE ===');
