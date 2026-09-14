const fs = require('fs');
const path = require('path');

const blogDir = 'content/blog';

// CTA block to insert
const CTA = `
---

## Recommended Business Banking for Your UK LTD

Setting up the right business bank account is one of the most important steps after forming your UK LTD. Here are our recommended providers:

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

**Disclosure:** UK LTD Registration may receive a commission if you sign up through our links. This helps us keep our guides free and up to date — at no extra cost to you.
`;

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
    'get-paid-gbp-usd-eur-sea-founders',
    'export-indian-fashion-apparel-london-office',
    'india-manufacturer-roadmap-usa-europe-uk-ltd',
    'gps-gprs-tech-exports-military-tenders-uk-ltd'
];

let added = 0;
let skipped = 0;
let missing = 0;

bankingArticles.forEach(slug => {
    const filePath = path.join(blogDir, slug + '.md');
    if (!fs.existsSync(filePath)) {
        missing++;
        console.log('MISSING FILE:', slug);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if CTA already present
    if (content.includes('Recommended Business Banking for Your UK LTD')) {
        skipped++;
        console.log('ALREADY HAS CTA:', slug);
        return;
    }

    // Insert CTA before the last "---" separator, or at end if none
    const lastDashLine = content.lastIndexOf('\n---\n');
    if (lastDashLine > 0) {
        content = content.slice(0, lastDashLine) + CTA + content.slice(lastDashLine);
    } else {
        content += CTA;
    }

    fs.writeFileSync(filePath, content);
    added++;
    console.log('ADDED CTA:', slug);
});

console.log('\n=== RESULTS ===');
console.log('CTAs added:', added);
console.log('Already had CTA (skipped):', skipped);
console.log('Files missing:', missing);
console.log('Total processed:', bankingArticles.length);
