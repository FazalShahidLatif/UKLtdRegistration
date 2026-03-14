const express = require('express');
const router = express.Router();

// Knowledge Hub Home
router.get('/', (req, res) => {
    res.render('pages/hub', {
        title: 'Knowledge Hub | UK Company Formation Insights',
        metaDescription: 'Expert guides on UK company formation, non-resident compliance, and business growth strategies.',
        articles: [
            {
                id: 'non-resident-guide',
                title: 'Registering a UK LTD as a Non-Resident (2026)',
                summary: 'A complete step-by-step guide on KYC, banking, and address requirements for global founders.',
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
                title: 'Can I use a virtual office for UK VAT?',
                summary: 'Exploring the 2026 rules on "Principal Place of Business" for international sellers.',
                category: 'Address Services',
                readTime: '5 min read'
            }
        ]
    });
});

// Specific Guide Route
router.get('/:articleId', (req, res) => {
    const { articleId } = req.params;
    // For now, render a generic article template or handle specific ones
    res.render(`pages/articles/${articleId}`, {
        title: 'Guide | UK Ltd Registration',
        metaDescription: 'Expert insight and strategy.'
    }, (err, html) => {
        if (err) {
            return res.status(404).render('pages/404');
        }
        res.send(html);
    });
});

module.exports = router;
