const express = require('express');
const router = express.Router();

// Blog listing page
router.get('/', (req, res) => {
    res.render('pages/blog-list', {
        title: 'Business Insights & Formation Guides',
        metaDescription: 'Expert advice on UK company formation, SIC codes, banking, and business growth.'
    });
});

// Single blog post
router.get('/:slug', (req, res) => {
    res.render('pages/blog-single', {
        title: 'Blog Post', // This would normally come from a DB
        slug: req.params.slug,
        metaDescription: 'Read our latest insights'
    });
});

module.exports = router;
