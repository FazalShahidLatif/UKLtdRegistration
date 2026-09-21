/**
 * Home Routes
 * Main landing page routes
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'UK LTD Formation - Register a UK Company in 24 Hours from 119.99 GBP | Same-Day Companies House Filing, ACSP-Verified, Free Registered Office',
        metaDescription: 'Form your UK LTD company online in 24 hours from 119.99 GBP. Same-day Companies House filing, ACSP-verified agents, free London registered office for 3 months, Wise business banking setup. Trusted by 10,000+ founders in 188 countries. No hidden fees. Pakistani, Indian, Bangladeshi, USA, and UAE founders welcome.',
        metaKeywords: 'UK LTD formation, register UK company online, form UK Ltd company 24 hours, UK company registration 2026, non-resident UK company formation, ACSP verified formation agent, UK LTD from Pakistan India Bangladesh USA UAE'
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
