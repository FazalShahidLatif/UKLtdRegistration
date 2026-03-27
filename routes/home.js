/**
 * Home Routes
 * Main landing page routes
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'UK Company Formation 2026 | Register a UK Limited Company Online | Non-Resident Specialists',
        metaDescription: 'Expert UK company formation services from £119.99. Fast UK Ltd registration for international founders, US citizens, & UK residents. Includes Companies House fees, London virtual office, & business banking support.',
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
                popular: false,
                link: '/checkout?package=premium'
            }
        ]
    });
});

module.exports = router;
