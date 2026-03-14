/**
 * Auth Controller
 * Handles user login, registration, and sessions
 */
const bcrypt = require('bcryptjs');

exports.loginPage = (req, res) => {
    res.render('pages/login', {
        title: 'Login',
        metaDescription: 'Login to your UK Ltd Registration account.'
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Simple mock authentication for now, should use User model
        if (email === 'admin@ukltdregistration.com' && password === 'admin123') {
            req.session.user = { email, role: 'admin' };
            return res.redirect('/');
        }
        res.render('pages/login', {
            title: 'Login',
            error: 'Invalid credentials',
            metaDescription: 'Login to your account.'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};

exports.registerPage = (req, res) => {
    res.render('pages/register', {
        title: 'Register',
        metaDescription: 'Create a new account for UK company formation.'
    });
};

exports.register = async (req, res) => {
    // Logic for registration
    res.redirect('/auth/login');
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

exports.dashboard = (req, res) => {
    res.render('pages/dashboard', {
        title: 'User Dashboard',
        user: req.session.user,
        metaDescription: 'Manage your UK company formation and use research tools.'
    });
};
