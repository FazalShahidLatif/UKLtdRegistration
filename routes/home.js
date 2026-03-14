/**
 * Home Routes
 * Main landing page routes
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'UK Company Formation 2026 | Register UK Ltd from £104.99 | Updated Fees',
        metaDescription: 'Professional UK Limited Company Formation from £104.99. Register your UK Ltd company in 24-48 hours. Updated 2026 fees (£100 Companies House). Non-resident friendly.',
        packages: [
            {
                name: 'Starter',
                price: '£119.99',
                description: 'Essential formation with Companies House fee included.',
                features: [
                    'Companies House £100 fee',
                    '24-48 hour formation',
                    'Digital Incorporation Docs',
                    'Web Portal Access',
                    'Email support'
                ],
                cta: 'Choose Starter',
                popular: false,
                link: '/checkout?package=starter'
            },
            {
                name: 'Standard Plus',
                price: '£199.99',
                description: 'Professional setup with full privacy protection.',
                features: [
                    'Everything in Starter',
                    'Registered Office (1 year)',
                    'Director Service Address',
                    'Business Banking Setup',
                    'Priority support'
                ],
                cta: 'Choose Standard',
                popular: true,
                link: '/checkout?package=standard'
            },
            {
                name: 'Enterprise Elite',
                price: '£299.99',
                description: 'Ultimate scaling package for global founders.',
                features: [
                    'Everything in Standard',
                    'Full non-resident support',
                    'VAT Registration Scan',
                    'Virtual Phone Number',
                    'Dedicated account manager'
                ],
                cta: 'Choose Elite',
                popular: false,
                link: '/checkout?package=premium'
            }
        ]
    });
});

module.exports = router;
