const express = require('express');
const router = express.Router();

// Pricing page
router.get('/pricing', (req, res) => {
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
        'standard': { name: 'Standard Plus', price: '199.99' },
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

// Services page
router.get('/services', (req, res) => {
    res.render('pages/services', {
        title: 'Our Services | Professional Company Formation',
        metaDescription: 'Explore our full range of UK company formation and maintenance services.'
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

module.exports = router;
