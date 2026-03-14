const express = require('express');
const router = express.Router();

// About page
router.get('/about', (req, res) => {
    res.send('<h1>About Us</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

// FAQ page
router.get('/faq', (req, res) => {
    res.send('<h1>FAQ</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

// Contact page
router.get('/contact', (req, res) => {
    res.send('<h1>Contact Us</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

module.exports = router;
