const express = require('express');
const router = express.Router();

// Pricing page
router.get(['/pricing', '/packages'], (req, res) => {
    res.render('pages/pricing', {
        title: 'Cheapest UK Company Formation from £119.99 | All-Incl.',
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
        title: 'Virtual Office London — UK Address from £49.99/yr',
        metaDescription: 'Get a prestigious virtual office address in London for your UK Ltd company. Registered office, mail handling, and director service address — from £49.99/year. Protect your privacy and comply with Companies House.',
        metaKeywords: 'virtual office London, London business address, registered office UK, virtual office address, Companies House address, prestige London address'
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
        title: 'Register UK Company from USA 2026 — Same-Day from $229',
        metaDescription: 'US citizens: register a UK LTD from the USA in 2026. Same-day Companies House filing from $229 (£119.99). LLC vs UK LTD comparison, Mercury/Wise banking for Americans, ACSP verification, London registered office. No US LLC Form 5472 headaches.',
        metaKeywords: 'register UK company from USA, US citizens UK LTD, UK Ltd vs US LLC, form UK company American, Mercury banking UK, non-resident UK company USA, ACSP verification USA'
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
        title: 'Ltd Company UK Registration FAQ',
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
        title: 'UK LTD Success Stories — Pakistan, India & Bangladesh',
        metaDescription: 'Real success stories of founders from Pakistan, India, Bangladesh, and Sri Lanka who formed UK Ltd companies for e-commerce, Amazon FBA, and global trade. See how they did it — and how you can too. Step-by-step guides included.',
        metaKeywords: 'UK LTD success stories, form UK company from Pakistan, Amazon FBA UK LTD, e-commerce UK company success, non-resident business success stories'
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
        title: 'Company Names Search',
        metaDescription: 'Free company names search tool. Check company name availability UK instantly against the official Companies House register. Search ltd company names and verify trademarks before you register.'
    });
});

// LTD Company Formation Page (Core Conversion Page)
router.get('/register-a-limited-company-uk', (req, res) => {
    res.render('pages/ltd-formation', {
        title: 'Register a Limited Company UK — Same-Day from £119.99',
        metaDescription: 'Register a limited company in the UK online today. Same-day Companies House filing, ACSP-verified agents, free registered office for 3 months, and Wise business banking setup. From £119.99. Trusted by 10,000+ founders.',
        metaKeywords: 'register a limited company UK, UK company registration, form a limited company, register ltd company online, Companies House registration, non-resident UK company'
    });
});

// Regional Landing Pages
router.get('/register-company-england', (req, res) => {
    res.render('pages/regions/england', {
        title: 'Register a Company in England Online',
        metaDescription: 'Form an England limited company online today. Includes the £100 state fee, official London registered office options, and active 2026 ACSP verification from £119.99.'
    });
});

router.get('/register-company-scotland', (req, res) => {
    res.render('pages/regions/scotland', {
        title: 'Register a Company in Scotland',
        metaDescription: 'Register your limited company in Scotland online. Fast same-day formation with Companies House, catering to unique Scottish jurisdiction legal requirements.'
    });
});

router.get('/register-company-wales', (req, res) => {
    res.render('pages/regions/wales', {
        title: 'Register a Company in Wales',
        metaDescription: 'Form a limited company in Wales online. Companies House approved same-day registration with bilingual Welsh certificate options.'
    });
});

router.get('/register-company-london', (req, res) => {
    res.render('pages/regions/london', {
        title: 'Register a Company in London — UK LTD from £119.99',
        metaDescription: 'Set up your limited company in London with a prestigious Central London registered office address. Same-day registration and banking support.'
    });
});

router.get('/register-company-manchester', (req, res) => {
    res.render('pages/regions/manchester', {
        title: 'Manchester Company Formation — Same-Day from £119.99',
        metaDescription: 'Register a Manchester limited company online with same-day filing, £100 state fee included, and a London registered office option for your North West business.'
    });
});

router.get('/register-company-birmingham', (req, res) => {
    res.render('pages/regions/birmingham', {
        title: 'Register a Company in Birmingham',
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
        title: 'Incorporate a Business in Edinburgh',
        metaDescription: 'Incorporate an Edinburgh limited company online with same-day Companies House filing, £100 state fee included, and remote Scottish formation support.'
    });
});

// 6 New Service Pages
router.get('/registered-office-address', (req, res) => {
    res.render('pages/services/registered-office-address', {
        title: 'Registered Office Address UK',
        metaDescription: 'Get a prestigious London registered office address for your UK company from just £49.99/year. Keep your home address private and comply with Companies House.'
    });
});

router.get('/company-secretary', (req, res) => {
    res.render('pages/services/company-secretary', {
        title: 'Company Secretary Service UK — Managed Compliance',
        metaDescription: 'Outsource your corporate compliance with our professional company secretary service in the UK. Comprehensive filing, share management, and legal compliance support.'
    });
});

router.get('/vat-registration', (req, res) => {
    res.render('pages/services/vat-registration', {
        title: 'UK VAT Registration 2026 — £90K Threshold | HMRC £149',
        metaDescription: 'UK VAT registration threshold 2026 is £90,000. Register your UK Ltd for VAT with HMRC — mandatory or voluntary. Non-resident friendly. Full HMRC filing support from £149. Same-day service available.',
        metaKeywords: 'UK VAT registration 2026, VAT threshold £90,000, register for VAT UK, HMRC VAT registration, non-resident VAT registration UK, VAT registration service'
    });
});

router.get('/confirmation-statement', (req, res) => {
    res.render('pages/services/confirmation-statement', {
        title: 'Companies House Confirmation Statement — CS01 from £149',
        metaDescription: 'File your mandatory annual Companies House Confirmation Statement (CS01) easily. Fast processing, statutory fee included, and 100% compliant and secure.'
    });
});

router.get('/company-name-check', (req, res) => {
    res.render('pages/services/company-name-check', {
        title: 'Check Company Name Availability UK',
        metaDescription: 'Check company name availability UK for free. Search ltd company names against the live Companies House register, sensitive word lists, and trademark databases. Find your perfect ltd company name and register today.'
    });
});

router.get('/non-uk-resident-company', (req, res) => {
    res.render('pages/services/non-uk-resident-company', {
        title: 'Register UK Company as Non-Resident',
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
        title: 'Close UK Company Online — DS01 Strike-Off Service',
        metaDescription: 'Dissolve and strike off your UK Limited Company safely online. Managed DS01 Companies House filing service to avoid late penalties and close HMRC accounts.'
    });
});

// High-Intent Landing Pages for SEO

// Same-Day Fast Formation Landing Page
router.get('/fastest-uk-company-registration', (req, res) => {
    res.render('pages/fast-formation', {
        title: 'Fastest UK LTD Registration',
        metaDescription: 'Same-day UK company registration from £189.99. Companies House approval in 3-6 working hours. Fastest LTD formation guaranteed before 3 PM UK time. Start trading within 24 hours.'
    });
});

// Cheap/Budget Formation Landing Page
router.get('/cheapest-uk-company-registration', (req, res) => {
    res.render('pages/budget-formation', {
        title: 'Cheapest UK Company Registration',
        metaDescription: 'Cheapest UK LTD registration at £119.99. Companies House fee included, no hidden charges. Transparent pricing, zero upsells. Form your company now.'
    });
});

// Enhanced UK Residents Page
router.get('/uk-company-formation-for-residents', (req, res) => {
    res.render('pages/uk-residents', {
        title: 'UK Company Formation for Residents — Same-Day £119.99',
        metaDescription: 'UK residents: form a limited company in 2026 from £119.99. Same-day Companies House filing, ACSP-verified agents, biometric ID verification, and full post-incorporation support. Register your UK LTD today — price includes the £100 statutory fee.'
    });
});

// Enhanced Non-Residents Page with better keywords
router.get('/uk-company-registration-for-foreigners', (req, res) => {
    res.render('pages/non-residents', {
        title: 'UK Company Registration for Foreigners',
        metaDescription: 'Register a UK company as a foreigner from anywhere. International founders welcome. Same-day formation, London registered office, Wise banking assistance, and ACSP-verified. From £189.99.'
    });
});

module.exports = router;
