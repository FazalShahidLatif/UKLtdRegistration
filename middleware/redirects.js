const fs = require('fs');
const path = require('path');

/**
 * 301 Redirects Middleware
 * Handles trailing slash normalization and custom redirects from redirects.json
 */
module.exports = (req, res, next) => {
    const { path: urlPath, query } = req;
    
    // 1. Handle Trailing Slashes (normalize to non-trailing)
    if (urlPath.length > 1 && urlPath.endsWith('/') && !urlPath.includes('.')) {
        const newPath = urlPath.slice(0, -1);
        const queryString = Object.keys(query).length > 0 ? '?' + new URLSearchParams(query).toString() : '';
        return res.redirect(301, newPath + queryString);
    }

    // 2. Custom Redirects from content/redirects.json
    try {
        const redirectsPath = path.join(__dirname, '../content/redirects.json');
        if (fs.existsSync(redirectsPath)) {
            const redirectsData = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
            const customRedirect = redirectsData.find(r => r.from === urlPath);
            
            if (customRedirect) {
                const queryString = Object.keys(query).length > 0 ? '?' + new URLSearchParams(query).toString() : '';
                return res.redirect(301, customRedirect.to + queryString);
            }
        }
    } catch (error) {
        console.error('Error in redirects middleware:', error);
    }

    next();
};
