/**
 * UK LTD Registration - Node.js Server
 * 
 * Modern, production-ready Node.js application
 * Replaces WordPress implementation
 * 
 * @author BlueOceanHub
 * @website https://blueoceanhub.info
 * @license MIT
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Import routes
const homeRoutes = require('./routes/home');
const blogRoutes = require('./routes/blog');
const pagesRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const hubRoutes = require('./routes/hub');
const adminRoutes = require('./routes/admin');
const sitemapRoute = require('./routes/sitemap');
const redirectsMiddleware = require('./middleware/redirects');
const { initSEOScheduler } = require('./cron/seo-scheduler');
const { displayDate } = require('./utils/view-helpers');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1y',
    etag: true,
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGODB_URI ? MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // Lazy session update
    }) : undefined,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make environment variables available to views
app.use((req, res, next) => {
    res.locals.siteName = 'UK Ltd Registration';
    res.locals.siteUrl = process.env.SITE_URL || 'https://ukltdregistration.com';
    res.locals.currentYear = new Date().getFullYear();
    res.locals.user = req.session.user || null;
    res.locals.currentPath = req.path;
    res.locals.displayDate = displayDate;
    next();
});

// 301 Redirects Middleware
app.use(redirectsMiddleware);

// Search Engine Sitemap Route
app.use('/', sitemapRoute);

// Routes
app.use('/', homeRoutes);
app.use('/blog', blogRoutes); // Kept original order for blogRoutes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/knowledge-hub', hubRoutes);
app.use('/admin', adminRoutes); // New route
app.use('/', pagesRoutes); // Must be last to catch all page routes

// 404 Handler
app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: 'Page Not Found',
        metaDescription: 'The page you are looking for could not be found.',
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('pages/error', {
        title: 'Error',
        metaDescription: 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
});

// Database connection (if using MongoDB)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✓ MongoDB connected'))
        .catch(err => console.error('✗ MongoDB connection error:', err));
}

// Start server
const server = app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  UK LTD Registration - Node.js Server');
    console.log('  Created by BlueOceanHub');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ✓ Server running on port ${PORT}`);
    console.log(`  ✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  ✓ URL: http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Initialize SEO Scheduler
    initSEOScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        if (process.env.MONGODB_URI) {
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
});

module.exports = app;
