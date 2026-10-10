
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const templates = [
    'views/pages/home.ejs',
    'views/pages/blog-single.ejs',
    'views/partials/header.ejs',
    'views/partials/footer.ejs'
];

templates.forEach(t => {
    try {
        const content = fs.readFileSync(path.join('C:/Gitub-Projects/UKLtdRegistration', t), 'utf8');
        ejs.compile(content, { filename: t });
        console.log('OK: ' + t);
    } catch (e) {
        console.error('ERROR in ' + t + ': ' + e.message);
    }
});
