
try {
    const homeRoutes = require('C:/Gitub-Projects/UKLtdRegistration/routes/home.js');
    console.log('routes/home.js loaded OK');
    console.log('Type:', typeof homeRoutes);
    console.log('Stack:', homeRoutes.stack ? homeRoutes.stack.map(r => r.route?.path || 'unknown') : 'no stack');
} catch (e) {
    console.error('LOAD ERROR:', e.message);
    console.error(e.stack);
}
