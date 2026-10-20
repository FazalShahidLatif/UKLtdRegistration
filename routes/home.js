/**
 * Home Routes
 * Main landing page routes
 */

const express = require('express');
const router = express.Router();
const reviews = require('../utils/reviews');

router.get('/', (req, res) => {
    // Load review data for the dynamic review system
    const publishedReviews = reviews.getPublishedReviews(3);
    const ratingLabel = reviews.getRatingLabel();

    res.render('pages/home', {
        title: 'Form UK LTD Company in 24 Hours — Same-Day from £119.99 (2026)',
        metaDescription: 'Form a UK LTD company in 24 hours from £119.99. Same-day Companies House filing, ACSP-verified agents, and a free London registered office. Complete guide for UK residents and non-residents.',
        metaKeywords: 'form UK LTD company, register UK company online 24 hours, UK company formation £119.99, Companies House same day filing, UK LTD formation 2026, non-resident UK company, UK LTD from Pakistan India USA',
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
        ],
        articleImage: '/images/hero-home.png',
        // Review system variables
        publishedReviews: publishedReviews,
        ratingLabel: ratingLabel,
        // Ad system variables
        currentPath: req.path
    });
});

module.exports = router;
