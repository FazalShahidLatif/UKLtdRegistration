const express = require('express');
const router = express.Router();

// Blog listing page
router.get('/', (req, res) => {
    res.send('<h1>Blog</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

// Single blog post
router.get('/:slug', (req, res) => {
    res.send(`<h1>Blog Post: ${req.params.slug}</h1><p>Coming soon...</p><a href="/blog">Back to Blog</a>`);
});

module.exports = router;
