const express = require('express');
const router = express.Router();

// Pricing page
router.get(['/pricing', '/packages'], (req, res) => {
    res.render('pages/pricing', {
        title: 'Pricing Packages | Simple & Transparent',
        metaDescription: 'Choose the best UK company formation package for your business. All prices include Companies House filing fees.'
    });
});

// Checkout page
router.get('/checkout', (req, res) => {
    const packageId = req.query.package || 'starter';
    const packages = {
        'starter': { name: 'Starter', price: '119.99' },
        'basic': { name: 'Starter', price: '119.99' },
        'standard': { name: 'Standard Plus', price: '189.99' },
        'premium': { name: 'Enterprise Elite', price: '299.99' }
    };
    
    const pkg = packages[packageId] || packages['starter'];
    
    res.render('pages/checkout', {
        title: 'Complete Your Order',
        metaDescription: 'Complete your UK company formation registration securely.',
        packageId: packageId,
        packageName: pkg.name,
        packagePrice: pkg.price
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
        title: 'Virtual Office Services | UK Ltd Registration',
        metaDescription: 'Prestigious Central London virtual office addresses for UK and international business founders.'
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
        title: 'US Citizens & Non-Residents | UK Company Formation',
        metaDescription: 'Register a UK company from the US or anywhere in the world. Non-resident specialists.'
    });
});

// Non-Residents SEO Page
router.get('/uk-ltd-formation-for-non-residents', (req, res) => {
    res.render('pages/non-residents', {
        title: 'Open Company in UK for Non-Residents | 2026 Registration Guide',
        metaDescription: 'Learn how to open a company in the UK as a non-resident. Our 2026 guide covers how to form a UK company, register with Companies House, and open a UK business bank account remotely.'
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

module.exports = router;
