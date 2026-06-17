/**
 * Auth Controller
 * Handles user login, registration, and sessions
 */
const User = require('../models/User');

exports.loginPage = (req, res) => {
    res.render('pages/login', {
        title: 'Login | Secure Access',
        metaDescription: 'Login to your UK Ltd Registration account.'
    });
};

exports.registerPage = (req, res) => {
    res.render('pages/register', {
        title: 'Register | Start Your Journey',
        metaDescription: 'Create a new account for UK company formation.'
    });
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};

exports.dashboard = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    res.render('pages/dashboard', {
        title: 'User Dashboard',
        user: req.user,
        metaDescription: 'Manage your UK company formation and use research tools.'
    });
};
