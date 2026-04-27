/**
 * Page Controller
 * Handles static pages and contact form
 */

exports.ukResidents = (req, res) => {
    res.render('pages/uk-residents', {
        title: 'UK Residents - Company Formation',
        metaDescription: 'Complete guide for UK residents to register a limited company.'
    });
};

exports.usCitizens = (req, res) => {
    res.render('pages/us-citizens', {
        title: 'US Citizens - UK Company Formation',
        metaDescription: 'How US citizens can register a UK limited company easily.'
    });
};

exports.faq = (req, res) => {
    res.render('pages/faq', {
        title: 'Frequently Asked Questions',
        metaDescription: 'Find answers to common questions about UK company formation.'
    });
};

exports.contact = (req, res) => {
    res.render('pages/contact', {
        title: 'Contact Us',
        metaDescription: 'Get in touch with our formation experts.'
    });
};

exports.handleContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Logic to save to DB or send email
        console.log(`Contact form submission from ${name} (${email}): ${message}`);
        res.render('pages/contact', {
            title: 'Contact Us',
            success: 'Thank you for your message. We will get back to you soon!',
            metaDescription: 'Get in touch with our formation experts.'
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};
exports.researchHub = (req, res) => {
    res.render('pages/research-hub', {
        title: 'Strategic Research Hub | UK SIC & Name Checker',
        metaDescription: 'Verify your company name and find the correct SIC codes with our strategic research tools.'
    });
};
