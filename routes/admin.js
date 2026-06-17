const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');

// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

// Admin Dashboard - Master Control Room
router.get('/', (req, res) => {
    // Mock data for metrics
    const stats = {
        totalRevenue: '£12,450.00',
        activeAffiliates: 24,
        conversionRate: '3.2%',
        pendingOrders: 8,
        recentLeads: 156
    };

    res.render('pages/admin/dashboard', {
        title: 'Master Control Room | Admin Dashboard',
        metaDescription: 'Manage UK Ltd Registration operations, orders, and strategic growth.',
        stats: stats
    });
});

// Order Management
router.get('/orders', (req, res) => {
    res.render('pages/admin/orders', {
        title: 'Order Management | Master Control Room',
        metaDescription: 'Review and manage company formation orders.',
        orders: [] // In a real app, fetch from DB
    });
});

// Partner/Affiliate Management
router.get('/partners', (req, res) => {
    res.render('pages/admin/partners', {
        title: 'Partner Management | Master Control Room',
        metaDescription: 'Manage affiliate partners and referral performance.',
        partners: [] // In a real app, fetch from DB
    });
});

// Lead Management (Existing)
router.get('/leads', (req, res) => {
    res.render('pages/admin/leads', {
        title: 'Lead Management | Master Control Room',
        metaDescription: 'Track and manage potential formation leads.'
    });
});

// SEO Insights & Automation
router.get('/seo', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const tasksPath = path.join(__dirname, '../content/seo-tasks.json');
    
    let seoTasks = [];
    if (fs.existsSync(tasksPath)) {
        try {
            seoTasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
        } catch (e) {
            console.error('Error parsing SEO tasks:', e);
        }
    }

    res.render('pages/admin/seo', {
        title: 'SEO Intelligence | Master Control Room',
        metaDescription: 'Automated SEO optimization roadmap and task management.',
        tasks: seoTasks
    });
});

module.exports = router;
