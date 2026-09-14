const fs = require('fs');
const path = require('path');

const blogDir = 'content/blog';

// Affiliate CTA block template
const AFFILIATE_BLOCKS = {
    'wise': `
---

## Open a Wise Business Account for Your UK LTD

[Wise Business](https://wise.com/uk/business) gives your UK Limited Company a local GBP account with a sort code and account number — no UK residency required. Receive payments in 40+ currencies and pay suppliers in their local currency at the mid-market rate.

**Why non-resident founders choose Wise:**
- **GBP, USD, EUR account details** under your UK LTD name
- **Borderless debit card** for spending in 150+ countries
- **Integration with Stripe, Shopify, and PayPal** for e-commerce
- **Setup in under 3 days** with remote biometric verification

[**Open a Wise Business Account →**](https://wise.com/uk/business)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`,

    'revolut': `
---

## Open a Revolut Business Account for Your UK LTD

[Revolut Business](https://business.revolut.com/) offers multi-currency accounts, corporate cards, and built-in accounting tools — ideal for UK LTDs that need to hold and exchange multiple currencies.

**Key features for UK LTD owners:**
- **GBP, USD, EUR, and 20+ currency accounts** in one dashboard
- **Unlimited corporate cards** for team expenses and ad spend
- **Built-in accounting and expense management**
- **Fast setup** — many UK LTDs approved within 48 hours

[**Open a Revolut Business Account →**](https://business.revolut.com/)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`,

    'payoneer': `
---

## Set Up a Payoneer Account for Your UK LTD

[Payoneer](https://www.payoneer.com/) is a global payment platform trusted by millions of businesses. It gives your UK LTD the ability to receive payments from marketplaces, clients, and partners worldwide — with local receiving accounts in USD, EUR, GBP, and more.

**Why UK LTD owners use Payoneer:**
- **Receive payments from 200+ countries** in multiple currencies
- **Local bank details** for USD, EUR, GBP, AUD, and CAD
- **Integration with Amazon, eBay, Fiverr, Upwork, and Stripe**
- **Low, transparent fees** with no hidden charges

[**Sign Up for Payoneer →**](https://www.payoneer.com/)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`,

    'tide': `
---

## Open a Tide Business Account for Your UK LTD

[Tide](https://tide.co/) is a UK-based business current account built for modern companies. It offers invoice management, tax pots, and integrations with accounting software — ideal for UK LTDs that want a streamlined digital banking experience.

**Why Tide works for UK LTDs:**
- **Instant setup** — fully digital, no branch visits required
- **GBP account with sort code and account number**
- **Tax-saving tools** — set aside money for Corporation Tax and VAT automatically
- **Integrates with Xero, QuickBooks, and FreeAgent**

> **Note:** Tide requires at least one director to be a UK resident. If you are a non-resident founder, we recommend Wise or Revolut as alternatives.

[**Open a Tide Business Account →**](https://tide.co/)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`,

    'airwallex': `
---

## Open an Airwallex Business Account for Your UK LTD

[Airwallex](https://www.airwallex.com/) is a global fintech platform built for businesses that need multi-currency accounts, corporate cards, and payment gateways. It's especially popular with e-commerce brands, SaaS companies, and agencies that operate across borders.

**Why UK LTDs choose Airwallex:**
- **Local account details in 11+ currencies** — receive like a local
- **Unlimited virtual corporate cards** for ad spend and subscriptions
- **Integrated payment gateways** — collect payments directly via API or checkout links
- **Competitive FX rates** — often better than traditional banks

[**Open an Airwallex Business Account →**](https://www.airwallex.com/)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`,

    'mercury': `
---

## Open a Mercury Account for Your UK LTD (US-Friendly)

[Mercury](https://mercury.com/) is a modern business banking platform designed for startups. It offers USD-denominated accounts with full wire capabilities, making it a strong choice for UK LTDs with US clients or investors.

**Why Mercury fits UK LTDs:**
- **Full US banking capabilities** — ACH, wires, and check deposit
- **No monthly fees** and no minimum balance
- **Built-in fundraising tools** — connect with investors directly
- **FDIC insurance** through partner banks

> **Note:** Mercury primarily serves US-based businesses. If your UK LTD has significant US operations, Mercury can complement your Wise/Revolut accounts.

[**Open a Mercury Account →**](https://mercury.com/)

*UK LTD Registration may receive a commission if you sign up through our links. This supports our free guides at no extra cost to you.*
`
};

function getCTAsForSlug(slug) {
    const ctas = [];
    
    if (slug.includes('wise')) ctas.push('wise');
    if (slug.includes('revolut')) ctas.push('revolut');
    if (slug.includes('payoneer')) ctas.push('payoneer');
    if (slug.includes('tide')) ctas.push('tide');
    if (slug.includes('airwallex')) ctas.push('airwallex');
    if (slug.includes('mercury') || slug.includes('sea')) ctas.push('mercury');
    
    // Broader banking match — catches "bank-accounts", "corporate-bank", etc.
    if (ctas.length === 0 && (slug.includes('bank') || slug.includes('account'))) {
        ctas.push('wise', 'revolut', 'payoneer');
    }
    
    // High-risk / gemstone / AML / crypto articles — these readers need banking solutions
    if (ctas.length === 0 && (slug.includes('high-risk') || slug.includes('gemstone') || slug.includes('aml') || slug.includes('crypto') || slug.includes('forex') || slug.includes('precious'))) {
        ctas.push('wise', 'revolut');
    }
    
    // Traditional bank comparison articles
    if (ctas.length === 0 && (slug.includes('barclays') || slug.includes('hsbc') || slug.includes('lloyds') || slug.includes('traditional'))) {
        ctas.push('wise', 'revolut');
    }
    
    // Export articles — exporters need payment reception
    if (ctas.length === 0 && (slug.includes('export') || slug.includes('pakistan') || slug.includes('india') || slug.includes('bangladesh'))) {
        ctas.push('wise', 'payoneer');
    }
    
    // Fashion/apparel — e-commerce payment needs
    if (ctas.length === 0 && (slug.includes('fashion') || slug.includes('apparel') || slug.includes('garment'))) {
        ctas.push('wise', 'payoneer');
    }
    
    // Industrial/tendering articles
    if (ctas.length === 0 && (slug.includes('tender') || slug.includes('industrial') || slug.includes('gps') || slug.includes('gprs'))) {
        ctas.push('wise', 'mercury');
    }
    
    if (ctas.length === 0) return [];
    return ctas;
}

// Process each article
let added = 0;

fs.readdirSync(blogDir).forEach(function(filename) {
    if (!filename.endsWith('.md')) return;
    
    const slug = filename.replace('.md', '');
    
    // Only process the 9 remaining articles
    const targetSlugs = [
        'uk-bank-accounts-high-risk-industries-gemstones-crypto-precious-metals-2026',
        'uk-ltd-high-risk-gemstones-precious-metals-jewelry-export-guide-2026',
        'aml-red-flags-uk-ltd-avoid-account-freezes-high-risk',
        'uk-business-bank-account-pakistan-exporters-payments',
        'uk-bank-account-south-asian-exporters-currency-management',
        'traditional-uk-corporate-bank-accounts-barclays-hsbc-lloyds-2026',
        'export-indian-fashion-apparel-london-office',
        'india-manufacturer-roadmap-usa-europe-uk-ltd',
        'gps-gprs-tech-exports-military-tenders-uk-ltd'
    ];
    
    if (!targetSlugs.includes(slug)) return;
    
    const mdPath = path.join(blogDir, filename);
    let content = fs.readFileSync(mdPath, 'utf8');
    
    // Skip if already has CTAs
    if (content.includes('Open a Wise Business Account') || content.includes('Open a Revolut Business Account')) {
        console.log('SKIP (already has CTAs):', slug);
        return;
    }
    
    const ctaNames = getCTAsForSlug(slug);
    if (ctaNames.length === 0) {
        console.log('SKIP (no matching CTA):', slug);
        return;
    }
    
    // Build the block
    let block = '';
    ctaNames.forEach(function(name) {
        block += AFFILIATE_BLOCKS[name];
    });
    
    // Find insertion point
    const existingCtaMatch = content.match(/\[Examine Banking-Integrated Packages\]\(\/pricing\)/);
    const lastHR = content.lastIndexOf('\n---');
    
    let insertPoint;
    if (existingCtaMatch) {
        insertPoint = content.indexOf('[Examine Banking-Integrated Packages');
        if (insertPoint === -1) insertPoint = content.lastIndexOf('\n\n');
    } else if (lastHR > 0) {
        insertPoint = lastHR;
    } else {
        const paragraphs = content.split('\n\n');
        insertPoint = content.length - paragraphs[paragraphs.length - 1].length - 2;
    }
    
    const insertText = '\n\n' + block + '\n\n';
    const newContent = content.slice(0, insertPoint) + insertText + content.slice(insertPoint);
    
    fs.writeFileSync(mdPath, newContent, 'utf8');
    console.log('ADDED:', slug, '->', ctaNames.join(', '));
    added++;
});

console.log('\n=== DONE ===');
console.log('Articles updated:', added);
