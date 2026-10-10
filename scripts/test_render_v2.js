
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const templates = [
    'views/pages/home.ejs',
    'views/pages/blog-single.ejs',
    'views/partials/header.ejs',
    'views/partials/footer.ejs'
];

const mockData = {
    publishedReviews: [],
    ratingLabel: null,
    packages: [],
    currentYear: '2026',
    user: null,
    content: 'test',
    article: { title: 'test' },
    title: 'test'
};

templates.forEach(t => {
    try {
        const content = fs.readFileSync(path.join('C:/Gitub-Projects/UKLtdRegistration', t), 'utf8');
        ejs.render(content, mockData);
        console.log('Render OK: ' + t);
    } catch (e) {
        console.error('Render ERROR in ' + t + ': ' + e.message);
    }
});
