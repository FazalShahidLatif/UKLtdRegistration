const express = require('express');
const router = express.Router();

// Knowledge Hub Home
router.get('/', (req, res) => {
    res.render('pages/hub', {
        title: 'Knowledge Hub | UK Company Formation Insights',
        metaDescription: 'Expert guides on UK company formation, non-resident compliance, banking, and business growth strategies.',
        articles: [
            {
                id: 'non-resident-guide',
                title: 'Registering a UK LTD as a Non-Resident (2026)',
                summary: 'A complete step-by-step guide on KYC, banking, and address requirements for global founders looking to register in the UK.',
                category: 'Compliance',
                readTime: '8 min read'
            },
            {
                id: 'tax-obligations',
                title: 'Tax Obligations for Foreign Directors',
                summary: 'Understanding Corporation Tax, VAT, and personal tax liabilities when running a UK company from abroad.',
                category: 'Tax & Finance',
                readTime: '12 min read'
            },
            {
                id: 'virtual-office-benefits',
                title: 'Can I use a Virtual Office for UK VAT?',
                summary: 'Exploring the 2026 rules on "Principal Place of Business" for international sellers registering for VAT.',
                category: 'Address Services',
                readTime: '5 min read'
            },
            {
                id: 'non-resident-banking',
                title: 'Best UK Business Banking for Non-Residents (2026)',
                summary: 'Wise, Revolut, Tide — which bank is right for your UK company if you live outside the UK? A full comparison.',
                category: 'Banking',
                readTime: '10 min read'
            },
            {
                id: 'confirmation-statement',
                title: 'How to File Your Confirmation Statement in 2026',
                summary: 'A step-by-step walkthrough for directors on filing the mandatory annual Confirmation Statement with Companies House.',
                category: 'Compliance',
                readTime: '6 min read'
            },
            {
                id: 'psc-register',
                title: 'Understanding the PSC Register & 2026 ID Verification',
                summary: 'The Economic Crime Act makes PSC identity verification mandatory. Here\'s what it means for your company and directors.',
                category: 'Compliance',
                readTime: '7 min read'
            },
            {
                id: 'corporation-tax-guide',
                title: 'UK Corporation Tax: A Complete Guide for Foreign Directors',
                summary: 'Everything a non-resident director needs to know about UK Corporation Tax rates, deadlines, deductions, and filing.',
                category: 'Tax & Finance',
                readTime: '15 min read'
            },
            {
                id: 'vat-guide',
                title: 'When & How to Register for UK VAT as a Foreign Business',
                summary: 'VAT threshold, schemes (Flat Rate, Standard, Cash Accounting), and how to submit returns — explained simply.',
                category: 'Tax & Finance',
                readTime: '9 min read'
            },
            {
                id: 'registered-office-rules',
                title: 'Registered Office Requirements: 2026 Rule Changes Explained',
                summary: 'New rules require your registered office to be capable of receiving AND acknowledging correspondence. What this means for you.',
                category: 'Address Services',
                readTime: '5 min read'
            }
        ]
    });
});

// Specific Guide Route
router.get('/:articleId', (req, res) => {
    const { articleId } = req.params;
    res.render(`pages/articles/${articleId}`, {
        title: 'Guide | UK Ltd Registration',
        metaDescription: 'Expert insight and strategy.'
    }, (err, html) => {
        if (err) {
            return res.status(404).render('pages/404', {
                title: 'Guide Not Found',
                metaDescription: 'This guide could not be found.'
            });
        }
        res.send(html);
    });
});

module.exports = router;
