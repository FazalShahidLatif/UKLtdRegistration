const express = require('express');
const router = express.Router();

// Pricing page
router.get(['/pricing', '/packages'], (req, res) => {
    res.render('pages/pricing', {
        title: 'Pricing Packages | Simple & Transparent',
        metaDescription: 'Choose the best UK company formation package for your business. All prices include Companies House filing fees.'
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
        title: 'Virtual Office UK London | UK Ltd Registration',
        metaDescription: 'Get a prestigious virtual office UK London address for your business. Perfect for international founders.'
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
        title: 'UK Ltd for Non Residents & US Citizens | Formation Guide 2026',
        metaDescription: 'Set up a UK Ltd for non residents and US citizens. ACSP-verified formation, Wise banking setup, London registered office, and full compliance support from £119.99.'
    });
});

// Forex Trading / Non-Resident Formation Help Page (P1 SEO Priority)
router.get('/get-help-forming-a-uk-ltd', (req, res) => {
    res.render('pages/forex-uk-ltd', {
        title: 'UK Ltd for Non Resident Review for Forex Trading 2026 | Tide Business Account Review',
        metaDescription: 'Comprehensive UK Ltd for non resident review for forex trading in 2026, including Tide eligibility, non-resident banking rules, and the best alternatives for traders.'
    });
});

// Non-Residents SEO Page
router.get('/uk-ltd-formation-for-non-residents', (req, res) => {
    res.render('pages/non-residents', {
        title: 'open company in uk non resident',
        metaDescription: 'Learn how to open company in UK non resident. Our 2026 guide covers how to form a UK company, register with Companies House, and open a bank account.'
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
        title: 'Frequently Asked Questions',
        metaDescription: 'Find answers to common questions about UK company formation.'
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
        title: 'Global Success Stories | Pakistani Founders Going Global',
        metaDescription: 'Read how Pakistani entrepreneurs, freelancers, and traders are using UK Limited companies to overcome local limitations and reach global markets.'
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
        title: 'Strategic Research Hub | UK SIC & Name Checker',
        metaDescription: 'Verify your company name and find the correct SIC codes with our strategic research tools.'
    });
});

// LTD Company Formation Page (Core Conversion Page)
router.get('/register-a-limited-company-uk', (req, res) => {
    res.render('pages/ltd-formation', {
        title: 'Register a Limited Company UK | Same-Day Online Formation',
        metaDescription: 'Register a limited company in the UK online with our same-day formation service. 100% online, Companies House approved, with Wise banking setup.'
    });
});

// Regional Landing Pages
router.get('/register-company-england', (req, res) => {
    res.render('pages/regions/england', {
        title: 'Register a Company in England | England Limited Company Formation',
        metaDescription: 'Set up your limited company in England. Fast, reliable same-day online formation. Approved Companies House agent, complete with registered office address options.'
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
        title: 'Company Registration Manchester | Manchester LTD Company Setup',
        metaDescription: 'Form a limited company in Manchester. Perfect setup for digital, creative, and tech startups in the North. Companies House approved and same-day setup.'
    });
});

router.get('/register-company-birmingham', (req, res) => {
    res.render('pages/regions/birmingham', {
        title: 'Company Registration Birmingham | Birmingham Company Formation Agent',
        metaDescription: 'Register a limited company in Birmingham. Fast, professional same-day online setup with active regional support.'
    });
});

router.get('/register-company-leeds', (req, res) => {
    res.render('pages/regions/leeds', {
        title: 'Company Registration Leeds | Leeds LTD Company Formation',
        metaDescription: 'Set up your limited company in Leeds. Fast-track online company registration with full banking and VAT support.'
    });
});

router.get('/register-company-edinburgh', (req, res) => {
    res.render('pages/regions/edinburgh', {
        title: 'Company Registration Edinburgh | Edinburgh Limited Company',
        metaDescription: 'Register a limited company in Edinburgh. Comprehensive Scottish company formation service, fully remote and online.'
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
        title: 'VAT Registration UK | Professional Online Filing Service',
        metaDescription: 'Fast and secure VAT registration service in the UK. Voluntary and mandatory filings for residents and non-residents. Simplify your business tax compliance today.'
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
        title: 'Check Company Name Availability UK | Free Search & Trademark Tool',
        metaDescription: 'Verify if your UK company name is available instantly. Check against Companies House registry, sensitive word lists, and trademark databases for free.'
    });
});

router.get('/non-uk-resident-company', (req, res) => {
    res.render('pages/services/non-uk-resident-company', {
        title: 'Register UK Company as Non-Resident | Remote International Formation',
        metaDescription: 'Register a limited company in the UK as a non-resident remotely. Fully digital process, prestigious London address, Wise business banking setup, and ECCTA compliant.'
    });
});

module.exports = router;
