const express = require('express');
const router = express.Router();
const adminLeadController = require('../controllers/adminLeadController');
const { isAuthenticated } = require('../middleware/auth');

// Apply isAuthenticated middleware to all admin routes
// router.use(isAuthenticated); // Temporarily disabled for your immediate testing if needed, or keep for security

router.get('/leads', adminLeadController.getLeadsPage);
router.post('/leads/fetch', adminLeadController.fetchNewLeads);
router.delete('/leads/:id', adminLeadController.deleteLead);

module.exports = router;
