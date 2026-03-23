const express = require('express');
const router = express.Router();

const chatbot = require('../chatbot/ai-chatbot');
const paddlePayment = require('../payment/paddle');

// Paddle Webhook Endpoint
router.post('/paddle/webhook', async (req, res) => {
    const postData = req.body;
    if (!postData || !postData.p_signature) {
        return res.status(400).send('Missing signature');
    }
    
    // In production, signature verification is essential
    if (process.env.PADDLE_PUBLIC_KEY) {
        const isValid = paddlePayment.verifyWebhook(postData, postData.p_signature);
        if (!isValid) {
            console.error('Paddle webhook signature verification failed');
            return res.status(403).send('Invalid signature');
        }
    }
    
    try {
        await paddlePayment.handleWebhook(postData.alert_name, postData);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Paddle webhook handling error:', error);
        res.status(500).send('Error');
    }
});

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

// Mock SIC Finder
router.get('/sic-finder', (req, res) => {
    const { q } = req.query;
    res.json({
        results: [
            { code: '62012', description: 'Business and domestic software development' },
            { code: '70229', description: 'Management consultancy activities other than financial management' },
            { code: '82990', description: 'Other business support service activities n.e.c.' }
        ]
    });
});

// Contact form submission
router.post('/contact', (req, res) => {
    const { firstName, lastName, email, topic, message } = req.body;
    console.log(`[Contact] ${firstName} ${lastName} <${email}> [${topic}]: ${message}`);
    // TODO: connect to email provider (SendGrid, Mailgun, etc.)
    res.json({ success: true, message: 'Message received. We will be in touch shortly.' });
});

// Affiliate / partner application
router.post('/affiliate-apply', (req, res) => {
    const { fullName, email, website, partnerType } = req.body;
    console.log(`[Affiliate Application] ${fullName} <${email}> | ${partnerType} | ${website}`);
    // TODO: store to DB and send notification email
    res.json({ success: true, message: 'Application received. We review all applications within 2 business days.' });
});

module.exports = router;

