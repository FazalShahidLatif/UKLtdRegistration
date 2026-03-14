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
                name: 'Basic',
                price: '£104.99',
                description: 'Essential formation for UK residents.',
                features: [
                    'Companies House £100 fee',
                    '24-48 hour formation',
                    'Certificate of Incorporation',
                    'Document templates',
                    'Email support'
                ],
                cta: 'Choose Basic',
                popular: false,
                link: '/checkout?package=basic'
            },
            {
                name: 'Standard',
                price: '£119.99',
                description: 'Our most popular all-inclusive package.',
                features: [
                    'Everything in Basic',
                    'Registered Office (1 year)',
                    'Banking introduction',
                    'Priority support',
                    'Free company name check'
                ],
                cta: 'Choose Standard',
                popular: true,
                link: '/checkout?package=standard'
            },
            {
                name: 'Premium',
                price: '£149.99',
                description: 'Full enterprise-level support.',
                features: [
                    'Everything in Standard',
                    "Director's Service Address",
                    'Premium registered office',
                    'Same-day formation option',
                    'Dedicated account manager'
                ],
                cta: 'Choose Premium',
                popular: false,
                link: '/checkout?package=premium'
            }
        ]
    });
});

module.exports = router;
