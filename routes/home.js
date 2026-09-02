/**
 * Home Routes
 * Main landing page routes
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'UK LTD | Form a UK Company in 24 Hours from £119.99 | Online Registration',
        metaDescription: 'Register your UK LTD company online today. Official Companies House e-filing, same-day approval, free support, and no hidden fees. Set up your business in minutes. Trusted by 10,000+ founders.',
        packages: [
            {
                id: 'starter',
                name: 'Starter',
                price: '119.99',
                description: 'Essential formation for UK residents with full transparency.',
                features: [
                    'Companies House Fee (£100) Included',
                    'Digital Incorporation Set',
                    'Companies House ID Check',
                    'Portal Access & Support'
                ],
                cta: 'Choose Starter'
            },
            {
                id: 'standard',
                name: 'Standard Plus',
                price: '189.99',
                popular: true,
                description: 'Professional "Privacy-First" Presence for UK businesses.',
                features: [
                    'Everything in Starter',
                    'Prestigious London Address',
                    'Director Service Address',
                    'Banking Fast-Track'
                ],
                cta: 'Go Standard Plus'
            },
            {
                id: 'premium',
                name: 'Enterprise Elite',
                price: '299.99',
                description: 'Final "Business-in-a-Box" for global founders.',
                features: [
                    'Everything in Standard',
                    'London 020 Virtual Number',
                    'Enhanced Non-Resident KYC',
                    'Assisted Banking introduction',
                    'Trading Address & Mail Forwarding',
                    'Dedicated Account Manager'
                ],
                cta: 'Choose Elite',
                popular: false
            }
        ]
    });
});

module.exports = router;
