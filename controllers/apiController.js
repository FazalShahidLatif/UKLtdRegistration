/**
 * API Controller
 * Handles SIC Finder, Company Search, and Webhooks
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');
const aiService = require('../utils/aiService');

// Load SIC codes database
const sicCodesPath = path.join(__dirname, '../content/sic-codes.json');

exports.sicFinder = (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.json({ success: true, results: [] });
        }

        const sicCodes = JSON.parse(fs.readFileSync(sicCodesPath, 'utf8'));
        const results = sicCodes.filter(s => 
            s.description.toLowerCase().includes(query.toLowerCase()) || 
            s.code.includes(query)
        ).slice(0, 50); // Limit results for performance

        res.json({ results });
    } catch (error) {
        console.error('SIC Finder error:', error);
        res.status(500).json({ error: 'SIC Finder failed' });
    }
};

exports.chat = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }
        const response = await aiService.getChatResponse(messages);
        res.json(response);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Chat service unavailable' });
    }
};

/**
 * Functional Company Search using Companies House API
 * Requires COMPANIES_HOUSE_API_KEY in .env
 */
exports.companySearch = (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 3) {
        return res.json({ success: true, items: [] });
    }

    const apiKey = process.env.COMPANIES_HOUSE_API_KEY;

    if (!apiKey) {
        console.warn('COMPANIES_HOUSE_API_KEY is missing. Falling back to detailed mock results.');
        const mockItems = [
            { 
                title: q.toUpperCase() + ' LIMITED', 
                company_number: 'NI' + Math.floor(Math.random() * 900000 + 100000), 
                company_status: 'active', 
                date_of_creation: '2022-04-12',
                address_snippet: '2nd Floor, 123 Business Lane, London, EC1A 1BB',
                description: 'NI' + Math.floor(Math.random() * 900000 + 100000) + ' - Incorporated on 12 April 2022'
            },
            { 
                title: q.toUpperCase() + ' SOLUTIONS LTD', 
                company_number: '0' + Math.floor(Math.random() * 90000000 + 10000000), 
                company_status: 'dissolved', 
                date_of_creation: '2015-06-15',
                address_snippet: 'Tech Park, Suite 4, Manchester, M1 1AA',
                description: '0' + Math.floor(Math.random() * 90000000 + 10000000) + ' - Dissolved on 20 January 2024'
            },
            { 
                title: q.toUpperCase() + ' GROUP HOLDINGS', 
                company_number: 'SC' + Math.floor(Math.random() * 900000 + 100000), 
                company_status: 'active', 
                date_of_creation: '2026-02-01',
                address_snippet: 'High Street Office, Edinburgh, EH1 1YZ',
                description: 'SC' + Math.floor(Math.random() * 900000 + 100000) + ' - Incorporated on 1 February 2026'
            }
        ];
        return res.json({
            success: true,
            isMock: true,
            items: mockItems
        });
    }

    const auth = Buffer.from(apiKey + ':').toString('base64');
    const options = {
        hostname: 'api.company-information.service.gov.uk',
        path: `/search/companies?q=${encodeURIComponent(q)}`,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`
        }
    };

    const request = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => { data += chunk; });
        apiRes.on('end', () => {
            try {
                if (apiRes.statusCode === 200) {
                    const parsedData = JSON.parse(data);
                    res.json({
                        success: true,
                        items: parsedData.items || []
                    });
                } else {
                    console.error(`Companies House API error: ${apiRes.statusCode}`, data);
                    res.status(apiRes.statusCode).json({ success: false, error: 'API Error' });
                }
            } catch (error) {
                console.error('Error parsing Companies House API response:', error);
                res.status(500).json({ success: false, error: 'Parse Error' });
            }
        });
    });

    request.on('error', (error) => {
        console.error('Companies House API request error:', error);
        res.status(500).json({ success: false, error: 'Connection Error' });
    });

    request.end();
};

exports.paddleWebhook = (req, res) => {
    console.log('Paddle Webhook received:', req.body);
    // Add validation and processing logic here
    res.status(200).send('OK');
};
