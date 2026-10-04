/**
 * Comprehensive SEO fix: titles, content, schema, .txt files
 * 
 * Issues:
 * 1. Title tags too long (31 pages flagged by Semrush)
 * 2. Low text-HTML ratio (31 pages flagged)  
 * 3. SEO schema markup update
 * 4. .txt files update
 */
const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. TITLE TAG FIXES
// ============================================================================
console.log('=== 1. TITLE TAG FIXES ===\n');

// Blog articles: buildPageTitle truncates to 55 chars, so any metaTitle is fine
// The 4 articles fixed earlier are OK
// Route titles: already fixed to ≤55 chars in previous step

// Verify blog articles
const articles = JSON.parse(fs.readFileSync('content/blog/blog-articles.json', 'utf8')).articles || [];
let articleFixes = 0;

articles.forEach(a => {
    const mt = (a.metaTitle || '').trim();
    if (mt.length === 0) {
        // Set a short metaTitle based on title
        const words = a.title.split(' ');
        if (words.length > 8) {
            a.metaTitle = words.slice(0, 8).join(' ') + '...';
        } else {
            a.metaTitle = a.title;
        }
        articleFixes++;
        console.log('  Set metaTitle for: ' + a.slug + ' -> "' + a.metaTitle + '"');
    }
});

if (articleFixes > 0) {
    fs.writeFileSync('content/blog/blog-articles.json', JSON.stringify({ articles }, null, 2) + '\n');
    console.log('\nUpdated blog-articles.json: ' + articleFixes + ' articles given metaTitles\n');
}

// ============================================================================
// 2. ADD CONTENT TO THIN STATIC PAGES (low text-HTML ratio)
// ============================================================================
console.log('=== 2. ADDING CONTENT TO THIN STATIC PAGES ===\n');

function addContentParagraph(templatePath, paragraphs) {
    if (!fs.existsSync(templatePath)) {
        console.log('  SKIP (not found): ' + templatePath);
        return;
    }
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Find the last </main> before footer include and insert before it
    const mainEnd = content.lastIndexOf('</main>');
    if (mainEnd === -1) {
        console.log('  SKIP (no </main>): ' + templatePath);
        return;
    }
    
    let insertHtml = '';
    paragraphs.forEach(p => {
        insertHtml += '\n        <div class="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm max-w-4xl mx-auto mt-8">\n';
        insertHtml += '            <h2 class="text-2xl font-black text-gray-900 mb-4">' + p.heading + '</h2>\n';
        insertHtml += '            <p class="text-gray-600 leading-relaxed mb-6">' + p.body + '</p>\n';
        if (p.bullets) {
            insertHtml += '            <ul class="list-disc list-inside space-y-2 text-gray-600 text-sm">\n';
            p.bullets.forEach(b => {
                insertHtml += '                <li>' + b + '</li>\n';
            });
            insertHtml += '            </ul>\n';
        }
        insertHtml += '        </div>\n';
    });
    
    content = content.substring(0, mainEnd) + insertHtml + content.substring(mainEnd);
    fs.writeFileSync(templatePath, content);
    console.log('  Updated: ' + path.basename(templatePath) + ' (+' + paragraphs.length + ' content sections)');
}

// accounting.ejs — 54 lines, needs more content
addContentParagraph('views/pages/services/accounting.ejs', [
    {
        heading: 'Why UK Accounting Matters for International Founders',
        body: 'If you are forming a UK Limited Company as a non-resident, understanding UK accounting obligations is essential. Even if your business operates primarily abroad, Companies House and HMRC require annual filings, and failing to meet deadlines can result in penalties. Our accounting service is designed specifically for international founders who need UK-compliant accounts without navigating complex domestic tax law alone.'
    },
    {
        heading: 'What Is Included in Each Accounting Package',
        body: 'Our three-tiered accounting service covers the full spectrum of UK business financial compliance. The Freelancer tier is ideal for solo founders earning under £5,000 per month through their UK LTD. The Small Business tier adds VAT returns and payroll for teams of up to five. The Growing tier is for companies with turnover up to £100,000 per month that need multi-currency support through Xero and a dedicated accountant for tax strategy.',
        bullets: [
            'Freelancer (£79/mo): Annual accounts, expense categorization, up to £5k/mo turnover',
            'Small Business (£149/mo): VAT returns, payroll for up to 5 staff, unlimited transactions',
            'Growing (£299/mo): Multi-currency & Xero integration, dedicated accountant, tax strategy calls'
        ]
    },
    {
        heading: 'Common Questions About UK Company Accounting',
        body: 'Many non-resident founders ask whether they need a UK accountant if their company does not trade in the UK. The answer depends on your corporation tax position. If your company is registered in the UK but all its operations and income are outside the UK, you may not owe UK corporation tax, but you still must file annual accounts with Companies House and a nil-return CT600 with HMRC. Our accountants can advise on your specific position.',
        bullets: [
            'Do I need a UK accountant if my company is non-resident? Yes — Companies House requires annual filings regardless of where you live.',
            'What is the corporation tax rate for UK LTDs in 2026? The main rate is 25% for profits over £250,000; marginal relief applies between £50,000 and £250,000.',
            'Can I use Xero for my UK LTD? Yes, Xero is fully compatible with UK HMRC Making Tax Digital (MTD) requirements and our Growing plan includes it.'
        ]
    }
]);

// cookies.ejs — 43 lines
addContentParagraph('views/pages/legal/cookies.ejs', [
    {
        heading: 'How We Use Cookies to Improve Your Experience',
        body: 'At UK Ltd Registration, we use cookies to make our website work properly, understand how visitors interact with our content, and deliver relevant marketing. Cookies are small text files stored on your device when you visit our site. They help us remember your preferences, keep you logged in, and analyze which pages are most useful. We do not use cookies to identify you personally without your consent.',
        bullets: [
            'Essential cookies enable core functionality such as form submissions, session management, and secure checkout.',
            'Analytics cookies help us understand which pages are most popular and where visitors come from, using anonymized data.',
            'Marketing cookies track the effectiveness of our advertising campaigns so we can show you more relevant offers.'
        ]
    }
]);

// dissolution.ejs — 69 lines
addContentParagraph('views/pages/services/dissolution.ejs', [
    {
        heading: 'When Should You Close Your UK Company?',
        body: 'Closing a UK Limited Company is a significant decision that should be handled carefully. Common reasons for closure include the business no longer trading, the directors wishing to retire or relocate, or the company having served its purpose (for example, a project-based venture that has completed its work). Whatever the reason, striking off your company through a DS01 submission is the most cost-effective and straightforward method — provided the company meets the eligibility criteria.'
    },
    {
        heading: 'Eligibility Requirements for Voluntary Strike-Off',
        body: 'To apply for voluntary strike-off, your company must not have traded or sold any stock in the last three months, must not have changed its name in the same period, and must not be subject to any insolvency proceedings or legal actions. If your company does not meet these conditions, you may need to go through a members\' voluntary liquidation (MVL) instead. Our managed service will assess your eligibility before filing.',
        bullets: [
            'The company must have ceased trading for at least 3 months.',
            'No assets or liabilities may remain (all bank accounts must be closed).',
            'All directors must consent to the strike-off application.',
            'If ineligible, our Elite Close package includes HMRC tax deregistration and full closure support.'
        ]
    }
]);

// meeting-rooms.ejs — 88 lines  
addContentParagraph('views/pages/services/meeting-rooms.ejs', [
    {
        heading: 'Why Choose Our London Meeting Rooms?',
        body: 'Our boardroom facilities in central London offer a professional setting for client meetings, investor presentations, team strategy sessions, and interviews. Located in a prestigious Covent Garden address, our meeting rooms project credibility and professionalism that will impress any visitor — whether you are hosting a potential investor, closing a key client deal, or conducting a team offsite. All rooms come with high-speed Wi-Fi, 4K displays, and refreshments included.'
    },
    {
        heading: 'Room Options and What Is Included',
        body: 'We offer three booking options to suit different needs and budgets. The hourly rate is ideal for quick one-on-one meetings or interviews. The half-day option gives you four consecutive hours, perfect for strategy sessions or workshops. The full-day rate covers eight hours and is the best value for all-day events. Every booking includes unlimited tea, coffee, and soft drinks, professional reception staff to greet your guests, and access to our exclusive client lounge.',
        bullets: [
            'Hourly (£30/hr): Minimum 1 hour, up to 6 people, refreshments included, Wi-Fi & AV.',
            'Half Day (£110/4hrs): Up to 12 people, complimentary lunch available, whiteboard & flip chart, video conferencing setup.',
            'Full Day (£199/day): Up to 20 people, morning & afternoon refreshments, dedicated AV technician, branded welcome screen.'
        ]
    }
]);

// banking.ejs — 104 lines, already decent
addContentParagraph('views/pages/services/banking.ejs', [
    {
        heading: 'How to Choose the Right UK Bank Account for Your LTD',
        body: 'Choosing a business bank account for your UK Limited Company depends on where you live, what currencies you need to handle, and how quickly you need the account open. For UK residents, Tide and Monzo offer the fastest approval — often within minutes of incorporation — with no monthly fees on basic accounts. For non-residents, Wise Business and Revolut Business are the industry standard because they support multi-currency accounts, low FX fees, and can be opened remotely without visiting the UK.',
        bullets: [
            'UK residents: Tide or Monzo Business — instant sort code & account number, Open Banking integrations, no monthly fees.',
            'Non-residents: Wise Business or Revolut Business — multi-currency support, remote application, low FX fees, widely accepted by marketplaces.',
            'Traditional banks: NatWest and Barclays offer branch access and prestige but require in-person verification and have slower approval times.',
            'Our banking assistance service (£49 for UK residents, £149 for non-residents) includes pre-application review and KYC document preparation.'
        ]
    }
]);

// services/index.ejs (services.ejs) — 213 lines, already substantial
addContentParagraph('views/pages/services.ejs', [
    {
        heading: 'Why UK Ltd Registration Is Your One-Stop Business Hub',
        body: 'Setting up a UK Limited Company is just the first step. To operate compliantly and professionally, you will need a registered office address, ongoing company secretarial support, VAT registration if your turnover exceeds the threshold, and potentially an apostille for your documents if you plan to use them internationally. Rather than juggling multiple service providers, UK Ltd Registration offers every service your UK company needs under one roof — from formation to compliance to banking support.',
        bullets: [
            'Company formation from £49 — the legal foundation for your UK business.',
            'Virtual office and registered office addresses from £49.99/year — prestige and legal compliance.',
            'Accounting and tax services from £79/month — VAT returns, annual accounts, and corporation tax filings.',
            'Banking assistance — priority introductions to Tide, Monzo, Wise, and Revolut.',
            'Company secretarial services from £149/year — CS01 filings, officer changes, and share transfers.',
            'Document apostille from £99/doc — FCDO legalisation for international use of your UK documents.'
        ]
    }
]);

// contact.ejs — 171 lines, thin contact section — add a "before you contact" section
addContentParagraph('views/pages/contact.ejs', [
    {
        heading: 'Before You Contact Us — Quick Answers',
        body: 'To help you get the fastest possible response, here are answers to the questions we hear most often. If your question is not covered here, our team is ready to help through the form below or by phone during UK business hours.',
        bullets: [
            'How long does company formation take? Same-day if filed before 11 AM UK time; standard processing is 2-3 working days.',
            'Can I form a UK LTD as a non-resident? Yes — our Enterprise Elite package is designed specifically for international founders.',
            'What is the cheapest formation package? Starter at £119.99 includes the £100 Companies House fee and digital Certificate of Incorporation.',
            'Do you offer VAT registration? Yes — from £149, handled by our compliance team.',
            'How do I open a UK bank account? Our Standard Plus and Enterprise Elite packages include banking introductions to Wise and Stripe.'
        ]
    }
]);

// strategic-research-hub.ejs — 340 lines, already good content
// Already has substantial content, skip

// uk-residents.ejs — was rewritten in earlier turn, check if it has enough
addContentParagraph('views/pages/uk-residents.ejs', [
    {
        heading: 'What UK Residents Need to Know Before Forming a Company',
        body: 'If you live in the UK and are forming a Limited Company, the process is straightforward and fully digital. You will need to verify your identity using a valid UK passport or driving licence as part of the ACSP-compliant identity verification process. The statutory £100 Companies House fee is included in all our packages. Once your company is incorporated, you will receive a digital Certificate of Incorporation by email, and you can begin trading immediately.',
        bullets: [
            'UK residents must complete identity verification with a valid passport or driving licence.',
            'The £100 Companies House filing fee is included in all packages — no hidden charges.',
            'Same-day processing is available if you submit your application before 11 AM UK time.',
            'After incorporation, you will need to register for corporation tax within 3 months of starting business activities.',
            'If your turnover exceeds £90,000, you must register for VAT with HMRC.'
        ]
    }
]);

// knowledge-hub (hub.ejs) — 174 lines, already substantial with article grid
addContentParagraph('views/pages/hub.ejs', [
    {
        heading: 'What Is the Knowledge Hub?',
        body: 'The UK Ltd Registration Knowledge Hub is a free resource for founders and business owners who want to understand UK company law, compliance requirements, and business growth strategies. Whether you are a non-resident planning to form a UK LTD, a UK resident setting up your first company, or an established business owner looking to expand, our guides cover everything from incorporation to tax compliance to banking setup. All articles are written and reviewed by our in-house compliance team.',
        bullets: [
            'Guides on UK company formation for residents and non-residents.',
            'Tax and compliance articles covering VAT, corporation tax, and confirmation statements.',
            'Banking guides for UK residents and international founders.',
            'Business growth strategies for e-commerce, export, and global expansion.',
            'New articles added regularly — check back for the latest updates.'
        ]
    }
]);

// ============================================================================
// 3. SEO SCHEMA MARKUP
// ============================================================================
console.log('\n=== 3. SEO SCHEMA MARKUP ===\n');

// Schema already exists in schema.ejs with Organization, LocalBusiness, WebSite, WebPage, BreadcrumbList
// Add Article schema to the blog single template if not already there
const blogSinglePath = 'views/pages/blog-single.ejs';
if (fs.existsSync(blogSinglePath)) {
    let blogContent = fs.readFileSync(blogSinglePath, 'utf8');
    
    // Check if Article schema is already present
    if (!blogContent.includes('"@type": "Article"') && !blogContent.includes('"@type": "BlogPosting"')) {
        // Add Article schema before the closing </main>
        const articleSchema = `
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "<%= article.metaTitle || article.title %>",
          "description": "<%= metaDescription %>",
          "image": "<%= (typeof articleImage !== 'undefined' && articleImage) ? (typeof siteUrl !== 'undefined' && siteUrl ? siteUrl : 'https://ukltdregistration.com') + articleImage : (typeof siteUrl !== 'undefined' && siteUrl ? siteUrl : 'https://ukltdregistration.com') + '/images/og-image.jpg' %>",
          "datePublished": "<%= article.datePublished || article.createdAt || '2026-01-01' %>",
          "dateModified": "<%= article.dateModified || article.updatedAt || '2026-01-01' %>",
          "author": {
            "@type": "Organization",
            "name": "UK LTD Registration"
          },
          "publisher": {
            "@type": "Organization",
            "name": "UK LTD Registration",
            "logo": {
              "@type": "ImageObject",
              "url": "<%= (typeof siteUrl !== 'undefined' && siteUrl) ? siteUrl + '/images/logo.png' : 'https://ukltdregistration.com/images/logo.png' %>"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "<%= (typeof siteUrl !== 'undefined' && siteUrl) ? siteUrl + currentPath : 'https://ukltdregistration.com' + currentPath %>"
          }
        }
        </script>`;
        
        const mainEnd = blogContent.lastIndexOf('</main>');
        if (mainEnd !== -1) {
            blogContent = blogContent.substring(0, mainEnd) + articleSchema + blogContent.substring(mainEnd);
            fs.writeFileSync(blogSinglePath, blogContent);
            console.log('  Added Article JSON-LD schema to blog-single.ejs');
        }
    } else {
        console.log('  Article schema already present in blog-single.ejs');
    }
}

// ============================================================================
// 4. .TXT FILES
// ============================================================================
console.log('\n=== 4. UPDATING .TXT FILES ===\n');

// robots.txt - already good, verify
const robotsPath = 'public/robots.txt';
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
console.log('  ✓ robots.txt updated');

// ads.txt 
const adsPath = 'public/ads.txt';
const ads = `google.com, pub-5104329103217752, DIRECT, f084660846b2d451
`;
fs.writeFileSync(adsPath, ads);
console.log('  ✓ ads.txt verified (AdSense pub-5104329103217752)');

// ============================================================================
// 5. VERIFY ALL CHANGES
// ============================================================================
console.log('\n=== 5. VERIFICATION SUMMARY ===\n');

// Check route titles
const pagesContent = fs.readFileSync('routes/pages.js', 'utf8');
const homeContent = fs.readFileSync('routes/home.js', 'utf8');
const allTitles = (pagesContent + homeContent).match(/title:\s*'([^']*)'/g) || [];
let longTitles = 0;
allTitles.forEach(t => {
    const title = t.replace(/title:\s*'/, '').replace(/'$/, '');
    if (title.length > 55) {
        console.log('  LONG TITLE (' + title.length + 'c): ' + title.substring(0, 80));
        longTitles++;
    }
});
console.log('  Route titles >55 chars: ' + longTitles + ' of ' + allTitles.length);

// Check articles
let longArticles = 0;
articles.forEach(a => {
    const mt = (a.metaTitle || '').trim();
    if (mt.length > 55) longArticles++;
});
console.log('  Articles with metaTitle >55 chars: ' + longArticles + ' (will be truncated by buildPageTitle to ≤55)');

// Check static pages content
const staticPages = [
    'views/pages/services.ejs',
    'views/pages/services/accounting.ejs', 
    'views/pages/services/cookies.ejs',
    'views/pages/services/dissolution.ejs',
    'views/pages/services/meeting-rooms.ejs',
    'views/pages/services/banking.ejs',
    'views/pages/contact.ejs',
    'views/pages/hub.ejs',
    'views/pages/uk-residents.ejs'
];
console.log('\n  Static page content check:');
staticPages.forEach(p => {
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const text = content.replace(/<%[^%>]*%>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('    ' + path.basename(p) + ': ' + text.length + ' visible chars');
    } else {
        console.log('    ' + p + ': FILE NOT FOUND');
    }
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n=== FILES TO COMMIT ===');
console.log('  routes/pages.js (title fixes + content)');
console.log('  routes/home.js (title fix)');
console.log('  content/blog/blog-articles.json (metaTitle fixes)');
console.log('  views/pages/blog-single.ejs (Article schema)');
console.log('  views/pages/services.ejs (added content)');
console.log('  views/pages/services/accounting.ejs (added content)');
console.log('  views/pages/services/cookies.ejs (added content)');
console.log('  views/pages/services/dissolution.ejs (added content)');
console.log('  views/pages/services/meeting-rooms.ejs (added content)');
console.log('  views/pages/services/banking.ejs (added content)');
console.log('  views/pages/contact.ejs (added content)');
console.log('  views/pages/hub.ejs (added content)');
console.log('  views/pages/uk-residents.ejs (added content)');
console.log('  public/robots.txt (updated)');
console.log('  public/ads.txt (verified)');
