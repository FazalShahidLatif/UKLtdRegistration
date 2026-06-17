const Lead = require('../models/Lead');
const leadGenService = require('../utils/leadGenService');

exports.getLeadsPage = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ opportunityScore: -1, capturedAt: -1 }).limit(100);
        res.render('pages/admin/leads', { 
            title: 'Lead Generation Center',
            leads: leads,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.fetchNewLeads = async (req, res) => {
    try {
        const results = await leadGenService.fetchNewLeads();
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error fetching new leads:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
