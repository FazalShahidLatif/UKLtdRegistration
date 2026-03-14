/**
 * Authentication Middleware
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    
    // Check for AJAX/API requests
    if (req.xhr || req.path.startsWith('/api/') || req.path.startsWith('/admin/leads/fetch')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('pages/error', {
        title: 'Access Denied',
        metaDescription: 'You do not have permission to access this area.',
        error: { status: 403, message: 'Administrator privileges required.' }
    });
};
