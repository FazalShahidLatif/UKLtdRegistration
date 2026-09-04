const express = require('express');
const router = express.Router();

// Pricing page
router.get(['/pricing', '/packages'], (req, res) => {
    res.render('pages/pricing', {
        title: 'Cheapest Company Formation UK from £119.99 | All-In 2026',
        metaDescription: 'Cheapest company formation UK from £119.99 — Companies House fee included, zero hidden charges. Compare all-inclusive packages with registered office, banking, and ACSP verification.',
        metaKeywords: 'cheapest company formation UK, affordable UK company registration, UK limited company formation cost, Companies House fee included'
    });
});

// Services Main Page
router.get('/services', (req, res) => {
    res.render('pages/services', {
        title: 'Our Services | Professional Company Formation',
        metaDescription: 'Explore our full range of UK company formation and maintenance services.'
    });
});

// Specific Service Pages
router.get('/services/virtual-office', (req, res) => {
    res.render('pages/services/virtual-office', {
        title: 'Ltd Company Formation London | Virtual Office & Address',
        metaDescription: 'Ltd company formation London with a prestigious virtual office from £99/year. Registered office, mail handling, and director service address — compliant and trusted by 1,000+ founders.',
        metaKeywords: 'ltd company formation london, virtual office UK London, London business address, virtual office address UK, registered office London'
    });
});

router.get('/services/meeting-rooms', (req, res) => {
    res.render('pages/services/meeting-rooms', {
        title: 'Meeting Rooms | UK Ltd Registration',
        metaDescription: 'Book professional meeting rooms and boardrooms in Central London.'
    });
});

router.get('/services/accounting', (req, res) => {
    res.render('pages/services/accounting', {
        title: 'Accounting & Tax Services | UK Ltd Registration',
        metaDescription: 'Expert tax planning, VAT registration, and accounting packages tailored for digital nomads and startups.'
    });
});

router.get('/services/banking', (req, res) => {
    res.render('pages/services/banking', {
        title: 'Business Banking Assistance | UK Ltd Registration',
        metaDescription: 'Accelerate your UK business bank account application for residents and non-residents.'
    });
});

// UK Residents page
router.get('/uk-residents', (req, res) => {
    res.render('pages/uk-residents', {
        title: 'UK Residents Formation | Register Your Company',
        metaDescription: 'Specialized UK company formation services for UK residents.'
    });
});

// US Citizens page
router.get('/us-citizens', (req, res) => {
    res.render('pages/us-citizens', {
        title: 'Register UK Company from USA | Non-Resident Formation 2026',
        metaDescription: 'Register a UK company from the USA or any country. UK company registration for non residents includes ACSP verification, London registered office, and Wise banking — from £119.99.'
    });
});

// Forex Trading / Non-Resident Formation Help Page (P1 SEO Priority)
router.get('/get-help-forming-a-uk-ltd', (req, res) => {
    res.render('pages/forex-uk-ltd', {
        title: 'UK Ltd Forex Trading Review 2026',
        metaDescription: 'Comprehensive UK Ltd for non resident review for forex trading in 2026, including Tide eligibility, non-resident banking rules, and the best alternatives for traders.'
    });
});

// Non-Residents SEO Page
router.get('/uk-ltd-formation-for-non-residents', (req, res) => {
    res.render('pages/non-residents', {
        title: 'UK LTD Formation for Non-Residents 2026',
        metaDescription: 'Form a UK LTD company as a non-resident from anywhere worldwide. Same-day registration, London address, Wise banking setup, and full ACSP verification. From £189.99.'
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About Us | UK Ltd Registration',
        metaDescription: 'Learn about our mission to help entrepreneurs launch their UK businesses.'
    });
});

// FAQ page
router.get('/faq', (req, res) => {
    res.render('pages/faq', {
        title: 'Ltd Company UK Registration FAQ | New Ltd Company Questions Answered',
        metaDescription: 'Answers to every question about ltd company UK registration, new ltd company registration, checking company name availability, and ltd company names. Free expert guidance.'
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contact Us | Get in Touch',
        metaDescription: 'Contact our support team for help with your UK company registration.'
    });
});

// Affiliate Portal
router.get('/partners', (req, res) => {
    res.render('pages/affiliates', {
        title: 'Partner Program | Build Your Formation Portfolio',
        metaDescription: 'Earn high commissions by partnering with the UK\'s leading 2026-ready formation brand.'
    });
});


// Success Stories page
router.get('/success-stories', (req, res) => {
    res.render('pages/success-stories', {
        title: 'Form UK Ltd Company from Pakistan for E-commerce | Global Success Stories',
        metaDescription: 'Discover how founders from Pakistan, India, Bangladesh, and Sri Lanka formed UK Ltd companies for e-commerce, Amazon FBA, and global trade. Real success stories and a step-by-step guide to form a UK Ltd company from Pakistan for e-commerce.'
    });
});


// Legal Pages
router.get('/legal/privacy', (req, res) => {
    res.render('pages/legal/privacy', {
        title: 'Privacy Policy | UK Ltd Registration',
        metaDescription: 'How UK Ltd Registration collects, uses, and protects your personal information in compliance with UK GDPR.'
    });
});

router.get('/legal/terms', (req, res) => {
    res.render('pages/legal/terms', {
        title: 'Terms of Service | UK Ltd Registration',
        metaDescription: 'The terms and conditions governing the use of UK Ltd Registration services.'
    });
});

router.get('/legal/cookies', (req, res) => {
    res.render('pages/legal/cookies', {
        title: 'Cookie Policy | UK Ltd Registration',
        metaDescription: 'How UK Ltd Registration uses cookies and how you can manage your preferences.'
    });
});

router.get('/legal/refund', (req, res) => {
    res.render('pages/legal/refund', {
        title: 'Refund Policy | UK Ltd Registration',
        metaDescription: 'Our transparent refund policy, including non-refundable HMRC fees and cancellation timeframes.'
    });
});

router.get('/legal/compliance', (req, res) => {
    res.render('pages/legal/compliance', {
        title: 'GDPR & Compliance | UK Ltd Registration',
        metaDescription: 'Our commitment to UK GDPR and Anti-Money Laundering (AML) regulatory compliance.'
    });
});

router.get('/strategic-research-hub', (req, res) => {
    res.render('pages/research-hub', {
        title: 'Company Names Search | Check Company Name Availability UK — Free Tool',
        metaDescription: 'Free company names search tool. Check company name availability UK instantly against the official Companies House register. Search ltd company names and verify trademarks before you register.'
    });
});

// LTD Company Formation Page (Core Conversion Page)
router.get('/register-a-limited-company-uk', (req, res) => {
    res.render('pages/ltd-formation', {
        title: 'Ltd Company UK Registration | Same-Day Online',
        metaDescription: 'Start your new ltd company registration today from £119.99. Fast UK limited (United Kingdom private limited) company registration via Companies House — same-day filing, ACSP-verified agents, Wise banking setup included.'
    });
});

// Regional Landing Pages
router.get('/register-company-england', (req, res) => {
    res.render('pages/regions/england', {
        title: 'Register a Company in England Online | £119.99 Same-Day Formation',
        metaDescription: 'Form an England limited company online today. Includes the £100 state fee, official London registered office options, and active 2026 ACSP verification from £119.99.'
    });
});

router.get('/register-company-scotland', (req, res) => {
    res.render('pages/regions/scotland', {
        title: 'Register a Company in Scotland | Scottish LTD Company Formation',
        metaDescription: 'Register your limited company in Scotland online. Fast same-day formation with Companies House, catering to unique Scottish jurisdiction legal requirements.'
    });
});

router.get('/register-company-wales', (req, res) => {
    res.render('pages/regions/wales', {
        title: 'Register a Company in Wales | Welsh Limited Company Registration',
        metaDescription: 'Form a limited company in Wales online. Companies House approved same-day registration with bilingual Welsh certificate options.'
    });
});

router.get('/register-company-london', (req, res) => {
    res.render('pages/regions/london', {
        title: 'Register a Company London | London Limited Company Formation',
        metaDescription: 'Set up your limited company in London with a prestigious Central London registered office address. Same-day registration and banking support.'
    });
});

router.get('/register-company-manchester', (req, res) => {
    res.render('pages/regions/manchester', {
        title: 'Manchester Company Formation Agents | Same-Day Online Setup',
        metaDescription: 'Register a Manchester limited company online with same-day filing, £100 state fee included, and a London registered office option for your North West business.'
    });
});

router.get('/register-company-birmingham', (req, res) => {
    res.render('pages/regions/birmingham', {
        title: 'Register a Company in Birmingham | Online Formation from £119.99',
        metaDescription: 'Form a Birmingham limited company online today with same-day Companies House filing, £100 state fee included, and registered office and banking support.'
    });
});

router.get('/register-company-leeds', (req, res) => {
    res.render('pages/regions/leeds', {
        title: 'Same-Day Company Registration Leeds | Online Formation',
        metaDescription: 'Register a Leeds limited company online with same-day filing, £100 state fee included, and a professional London registered office for your Yorkshire business.'
    });
});

router.get('/register-company-edinburgh', (req, res) => {
    res.render('pages/regions/edinburgh', {
        title: 'Incorporate a Business in Edinburgh | Online Scottish Formation',
        metaDescription: 'Incorporate an Edinburgh limited company online with same-day Companies House filing, £100 state fee included, and remote Scottish formation support.'
    });
});

// 6 New Service Pages
router.get('/registered-office-address', (req, res) => {
    res.render('pages/services/registered-office-address', {
        title: 'Registered Office Address UK | Prestigious London Business Address',
        metaDescription: 'Get a prestigious London registered office address for your UK company from just £49.99/year. Keep your home address private and comply with Companies House.'
    });
});

router.get('/company-secretary', (req, res) => {
    res.render('pages/services/company-secretary', {
        title: 'Company Secretary Service UK | Managed Corporate Secretary',
        metaDescription: 'Outsource your corporate compliance with our professional company secretary service in the UK. Comprehensive filing, share management, and legal compliance support.'
    });
});

router.get('/vat-registration', (req, res) => {
    res.render('pages/services/vat-registration', {
        title: 'VAT Registration UK 2026 | HMRC Filing for Residents and Non-Residents',
        metaDescription: 'Need VAT registration in the UK? Get HMRC filing support for mandatory or voluntary registration, the £90,000 2026 threshold, EORI setup, and non-resident UK Ltd compliance.'
    });
});

router.get('/confirmation-statement', (req, res) => {
    res.render('pages/services/confirmation-statement', {
        title: 'Companies House Confirmation Statement Service | CS01 Filing',
        metaDescription: 'File your mandatory annual Companies House Confirmation Statement (CS01) easily. Fast processing, statutory fee included, and 100% compliant and secure.'
    });
});

router.get('/company-name-check', (req, res) => {
    res.render('pages/services/company-name-check', {
        title: 'Check Company Name Availability UK | Ltd Company Names Search — Free',
        metaDescription: 'Check company name availability UK for free. Search ltd company names against the live Companies House register, sensitive word lists, and trademark databases. Find your perfect ltd company name and register today.'
    });
});

router.get('/non-uk-resident-company', (req, res) => {
    res.render('pages/services/non-uk-resident-company', {
        title: 'Register UK Company as Non-Resident | Remote International Formation',
        metaDescription: 'Register a limited company in the UK as a non-resident remotely. Fully digital process, prestigious London address, Wise business banking setup, and ECCTA compliant.'
    });
});

router.get('/services/apostille', (req, res) => {
    res.render('pages/services/apostille', {
        title: 'UK Company Document Apostille & Legalisation Service',
        metaDescription: 'Official UK FCDO document apostille and legalisation service for Certificate of Incorporation, Memorandum, and Articles. Fast-track options with DHL delivery.'
    });
});

router.get('/services/dissolution', (req, res) => {
    res.render('pages/services/dissolution', {
        title: 'Close UK Company Online | Managed DS01 Strike-Off Service',
        metaDescription: 'Dissolve and strike off your UK Limited Company safely online. Managed DS01 Companies House filing service to avoid late penalties and close HMRC accounts.'
    });
});

// High-Intent Landing Pages for SEO

// Same-Day Fast Formation Landing Page
router.get('/fastest-uk-company-registration', (req, res) => {
    res.render('pages/fast-formation', {
        title: 'Fastest UK LTD Registration | Same-Day Company Formation in 3-6 Hours',
        metaDescription: 'Same-day UK company registration from £189.99. Companies House approval in 3-6 working hours. Fastest LTD formation guaranteed before 3 PM UK time. Start trading within 24 hours.'
    });
});

// Cheap/Budget Formation Landing Page
router.get('/cheapest-uk-company-registration', (req, res) => {
    res.render('pages/budget-formation', {
        title: 'Cheapest UK Company Registration | £119.99 All-Inclusive Formation',
        metaDescription: 'Cheapest UK LTD registration at £119.99. Companies House fee included, no hidden charges. Transparent pricing, zero upsells. Form your company now.'
    });
});

// Enhanced UK Residents Page
router.get('/uk-company-formation-for-residents', (req, res) => {
    res.render('pages/uk-residents', {
        title: 'UK Company Registration for UK Residents | £119.99 Formation',
        metaDescription: 'Register a UK Limited Company as a resident from £119.99. Same-day formation, Companies House filing included, ACSP-verified with full compliance support.'
    });
});

// Enhanced Non-Residents Page with better keywords
router.get('/uk-company-registration-for-foreigners', (req, res) => {
    res.render('pages/non-residents', {
        title: 'UK Company Registration for Foreigners | Non-Residents Formation Guide',
        metaDescription: 'Register a UK company as a foreigner from anywhere. International founders welcome. Same-day formation, London registered office, Wise banking assistance, and ACSP-verified. From £189.99.'
    });
});

module.exports = router;
