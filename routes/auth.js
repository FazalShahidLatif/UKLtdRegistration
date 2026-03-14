const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.send('<h1>Login</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

// Register page
router.get('/register', (req, res) => {
    res.send('<h1>Register</h1><p>Coming soon...</p><a href="/">Back to Home</a>');
});

module.exports = router;
