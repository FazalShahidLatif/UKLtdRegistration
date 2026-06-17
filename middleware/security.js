/**
 * Security Middleware Configuration
 * Rate limiting, CSRF protection, input validation
 * 
 * @author BlueOceanHub
 * @license MIT
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csrf = require('csurf');
const sanitizeHtml = require('sanitize-html');

/**
 * Global rate limiter - applies to all routes
 * 100 requests per 15 minutes per IP
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'You have exceeded the rate limit. Please try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

/**
 * Strict rate limiter for authentication routes
 * 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register attempts per windowMs
    skipSuccessfulRequests: true, // Don't count successful requests
    message: 'Too many authentication attempts, please try again later.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many login attempts',
            message: 'Account temporarily locked. Please try again in 15 minutes.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

/**
 * API rate limiter
 * 30 requests per minute per IP
 */
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 API requests per windowMs
    message: 'API rate limit exceeded',
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Contact form rate limiter
 * 3 submissions per hour per IP
 */
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many contact form submissions, please try again later.'
});

/**
 * Company name checker rate limiter
 * 20 requests per minute per IP
 */
const nameLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: 'Too many name check requests, please slow down.'
});

/**
 * Helmet security configuration
 */
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.tailwindcss.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.paddle.com", "js.paddle.com"],
            imgSrc: ["'self'", "data:", "https:", "*.paddle.com"],
            connectSrc: ["'self'", "api.paddle.com", "sandbox-api.paddle.com"],
            frameSrc: ["'self'", "*.paddle.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false, // Required for Paddle
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

/**
 * CSRF protection middleware
 */
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

/**
 * Sanitize HTML input
 * @param {string} dirty - Unsanitized HTML
 * @returns {string} Clean HTML
 */
const sanitizeInput = (dirty) => {
    return sanitizeHtml(dirty, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        allowedAttributes: {
            'a': ['href', 'target']
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
};

/**
 * Sanitize all request body fields
 */
const sanitizeBody = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        });
    }
    next();
};

/**
 * Trust proxy - required for rate limiting behind reverse proxy
 */
const trustProxy = (app) => {
    app.set('trust proxy', 1); // Trust first proxy (Nginx, Cloudflare, etc.)
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
    // Additional security headers not covered by Helmet
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};

/**
 * Remove sensitive headers
 */
const removeHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
};

module.exports = {
    globalLimiter,
    authLimiter,
    apiLimiter,
    contactLimiter,
    nameLimiter,
    helmetConfig,
    csrfProtection,
    sanitizeInput,
    sanitizeBody,
    trustProxy,
    securityHeaders,
    removeHeaders
};
