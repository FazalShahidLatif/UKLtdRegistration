
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const viewsPath = path.join('C:/Gitub-Projects/UKLtdRegistration', 'views');

try {
    const content = fs.readFileSync(path.join(viewsPath, 'pages/home.ejs'), 'utf8');
    
    // In Express, the 'views' option tells EJS where the root is.
    // We can simulate this by providing the options object.
    const html = ejs.render(content, {
        publishedReviews: [],
        ratingLabel: null,
        packages: [],
        currentYear: '2026',
        user: null
    }, { 
        filename: path.join(viewsPath, 'pages/home.ejs'),
        // This is the crucial part: where does EJS look for includes?
    });
    console.log("RENDER SUCCESSFUL");
} catch (e) {
    console.error("RENDER FAILED: " + e.message);
}
