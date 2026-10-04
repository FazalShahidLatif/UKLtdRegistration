const express = require('express');
const path = require('path');

const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const { displayDate } = require('./utils/view-helpers');

const app = express();
process.env.NODE_ENV = 'production';
process.env.SITE_URL = 'https://ukltdregistration.com';
process.env.SESSION_SECRET = 'test-secret';

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://*.googletagmanager.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            connectSrc: ["'self'", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com", "https://*.doubleclick.net"],
            imgSrc: ["'self'", "data:", "https:"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://*.youtube.com", "https://*.youtube-nocookie.com"],
            childSrc: ["'self'", "https://www.youtube.com", "https://*.youtube.com", "https://*.youtube-nocookie.com"]
        }
    }
}));
app.use(compression());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1y', etag: true }));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: undefined, cookie: { secure: false, httpOnly: true, maxAge: 1000*60*60*24*7 } }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.siteName = 'UK Ltd Registration';
    res.locals.siteUrl = process.env.SITE_URL;
    res.locals.currentYear = new Date().getFullYear();
    res.locals.user = null;
    res.locals.currentPath = req.path;
    res.locals.displayDate = displayDate;
    next();
});

const homeRoutes = require('./routes/home');
const blogRoutes = require('./routes/blog');
const pagesRoutes = require('./routes/pages');

app.use('/', homeRoutes);
app.use('/blog', blogRoutes);
app.use('/', pagesRoutes);
app.use((err, req, res, next) => {
    console.error('ERR:', err.message.substring(0, 100));
    res.status(500).send('ERR: ' + err.message.substring(0, 100));
});

const http = require('http');
const server = app.listen(0, async () => {
    const port = server.address().port;
    const results = [];
    const urls = ['/', '/pricing', '/uk-residents', '/uk-company-formation-for-residents', '/blog/how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026', '/contact', '/services/vat-registration', '/non-residents'];
    for (const u of urls) {
        try {
            const r = await new Promise((resolve, reject) => {
                http.get('http://127.0.0.1:' + port + u, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve({s:res.statusCode,l:d.length})); }).on('error', reject);
            });
            results.push(u + ' → ' + r.s + ' (' + r.l + ' bytes)');
        } catch(e) {
            results.push(u + ' → ERROR: ' + e.message.substring(0, 80));
        }
    }
    console.log(results.join('\n'));
    server.close();
});
