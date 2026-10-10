
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const files = [
    'views/pages/home.ejs',
    'views/pages/blog-single.ejs',
    'views/partials/header.ejs',
    'views/partials/footer.ejs'
];

files.forEach(f => {
    try {
        const content = fs.readFileSync(path.join('C:/Gitub-Projects/UKLtdRegistration', f), 'utf8');
        ejs.compile(content);
        console.log(f + ' compiled OK');
    } catch (e) {
        console.error(f + ' failed: ' + e.message);
    }
});
