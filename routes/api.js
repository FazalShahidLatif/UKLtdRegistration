const express = require('express');
const router = express.Router();

const chatbot = require('../chatbot/ai-chatbot');
const mailer = require('../utils/mailer');

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Chatbot endpoint
router.post('/chat', async (req, res) => {
    const { message } = req.body;
    const userId = req.sessionID || 'anonymous';
    
    const result = await chatbot.chat(userId, message);
    res.json(result);
});

// Redirect GET chat requests (from search engines/direct visits) to homepage
router.get('/chat', (req, res) => {
    res.redirect(301, '/');
});

// Mock Company Search
router.get('/company-search', (req, res) => {
    const { q } = req.query;
    // For demonstration, suggest the name is available
    res.json({
        available: true,
        name: q,
        suggestions: [
            `${q} Solutions Ltd`,
            `${q} International Ltd`,
            `${q} UK Ltd`
        ]
    });
});

const fs = require('fs');
const path = require('path');

// Load and parse SIC Codes
let sicCodesCache = [];
try {
    const sicDataPath = path.join(__dirname, '../data/sic_codes.txt');
    const rawData = fs.readFileSync(sicDataPath, 'utf8');
    const lines = rawData.split('\n');
    let currentItem = null;
    
    for (let line of lines) {
        line = line.trim();
        if (!line || line === 'List of SIC codes' || line === 'SIC CODE DESCRIPTION') continue;
        
        const match = line.match(/^([0-9]{4,5})\s+(.+)$/);
        if (match) {
            if (currentItem) sicCodesCache.push(currentItem);
            currentItem = { code: match[1], description: match[2].trim() };
        } else if (currentItem) {
            currentItem.description += ' ' + line;
        }
    }
    if (currentItem) sicCodesCache.push(currentItem);
    console.log(`Loaded ${sicCodesCache.length} SIC Codes.`);
} catch (err) {
    console.error('Failed to load SIC Codes:', err);
}

// SIC Finder Endpoint
router.get('/sic-finder', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    
    let results = sicCodesCache;
    if (q) {
        results = sicCodesCache.filter(item => 
            item.code.includes(q) || item.description.toLowerCase().includes(q)
        );
    }
    
    // Return max 50 results
    res.json({
        results: results.slice(0, 50)
    });
});

// Contact form submission — the primary sales enquiry path.
// Logged first so the lead survives even if notification fails.
router.post('/contact', async (req, res) => {
    const b = req.body || {};
    const name = (b.name || b.fullName || ((b.firstName || '') + ' ' + (b.lastName || '')).trim() || '').trim();
    const email = (b.email || '').trim();
    const topic = (b.topic || b.subject || b.package || 'General enquiry').trim();
    const message = (b.message || '').trim();
    const phone = (b.phone || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    console.log('[Contact] ' + JSON.stringify({ name: name, email: email, topic: topic, phone: phone, message: message }));

    const result = await mailer.notify('New enquiry — ' + topic, {
        Name: name, Email: email, Phone: phone, Topic: topic, Message: message
    }, email);

    res.json({
        success: true,
        notified: result.sent,
        message: 'Message received. We will be in touch shortly.'
    });
});

// Lead capture — the founder checklist funnel.
router.post('/lead-capture', async (req, res) => {
    const b = req.body || {};
    const email = (b.email || '').trim();
    const source = (b.source || 'unknown').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    console.log('[Lead] ' + JSON.stringify({ email: email, source: source }));

    const result = await mailer.notify('New lead — ' + source, {
        Email: email, Source: source
    }, email);

    res.json({ success: true, notified: result.sent });
});

// Affiliate / partner application
router.post('/affiliate-apply', async (req, res) => {
    const b = req.body || {};
    const fullName = (b.fullName || '').trim();
    const email = (b.email || '').trim();
    const website = (b.website || '').trim();
    const partnerType = (b.partnerType || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    console.log('[Affiliate Application] ' + JSON.stringify({ fullName: fullName, email: email, website: website, partnerType: partnerType }));

    await mailer.notify('New partner application', {
        Name: fullName, Email: email, Website: website, Type: partnerType
    }, email);

    res.json({ success: true, message: 'Application received. We review all applications within 2 business days.' });
});

// Review submission
// Accepts a genuine customer review, validates it, and queues it for moderation.
// A submission is NEVER published automatically — it lands in
// data/review-submissions.json with published:false and must be promoted into
// data/reviews.json by a human after checking it is real and consented to.
// Email is retained only so we can follow up; it is never rendered anywhere.
router.post('/review', (req, res) => {
    const { name, email, rating, body, service, orderNumber } = req.body || {};

    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('name');
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('email');
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) errors.push('rating');
    if (!body || typeof body !== 'string' || body.trim().length < 20) errors.push('body');

    if (errors.length) {
        return res.status(400).json({
            success: false,
            message: 'Please check the highlighted fields.',
            fields: errors
        });
    }

    // Basic abuse guards
    const text = (body + ' ' + name).toLowerCase();
    const banned = ['http://', 'https://', 'buy now', 'seo service', 'backlink', 'casino', 'viagra'];
    if (banned.some(w => text.includes(w))) {
        return res.status(400).json({ success: false, message: 'Submission rejected.' });
    }

    const submission = {
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
        name: name.trim().slice(0, 60),
        email: email.trim().slice(0, 120),
        rating: score,
        body: body.trim().slice(0, 2000),
        service: (typeof service === 'string' ? service : '').trim().slice(0, 80),
        orderNumber: (typeof orderNumber === 'string' ? orderNumber : '').trim().slice(0, 60),
        receivedAt: new Date().toISOString(),
        published: false
    };

    try {
        const fs = require('fs');
        const path = require('path');
        const file = path.join(__dirname, '../data/review-submissions.json');
        const queue = fs.existsSync(file)
            ? JSON.parse(fs.readFileSync(file, 'utf8'))
            : { submissions: [] };
        if (!Array.isArray(queue.submissions)) queue.submissions = [];
        queue.submissions.push(submission);
        fs.writeFileSync(file, JSON.stringify(queue, null, 2) + '\n', 'utf8');
    } catch (err) {
        console.error('[Review] could not queue submission:', err.message);
    }

    console.log(`[Review] queued ${submission.id} — ${submission.rating}★ from ${submission.name} (pending moderation)`);

    res.json({
        success: true,
        message: 'Thank you. Your review has been received and will be published once we have checked it.'
    });
});


module.exports = router;

