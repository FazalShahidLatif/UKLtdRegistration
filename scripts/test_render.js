
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

function renderTemplate(templatePath, data) {
    const content = fs.readFileSync(path.join('C:/Gitub-Projects/UKLtdRegistration', templatePath), 'utf8');
    return ejs.render(content, data);
}

try {
    console.log("Testing Blog-Single render...");
    renderTemplate('views/pages/blog-single.ejs', {
        publishedReviews: [],
        ratingLabel: null,
        content: 'Test content'
    });
    console.log("Blog-Single OK");

    console.log("Testing Home render...");
    renderTemplate('views/pages/home.ejs', {
        packages: [],
        publishedReviews: [],
        ratingLabel: null,
        currentYear: '2026'
    });
    console.log("Home OK");
} catch (e) {
    console.error("RENDER ERROR: " + e.message);
    console.error(e.stack);
}
