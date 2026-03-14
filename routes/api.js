const express = require('express');
const router = express.Router();

const chatbot = require('../chatbot/ai-chatbot');

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

module.exports = router;
