const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Login | Secure Access',
        metaDescription: 'Login to your UK Ltd Registration account.'
    });
});

// Register page
router.get('/register', (req, res) => {
    res.render('pages/register', {
        title: 'Register | Start Your Journey',
        metaDescription: 'Create an account to begin your UK company formation.'
    });
});

module.exports = router;
