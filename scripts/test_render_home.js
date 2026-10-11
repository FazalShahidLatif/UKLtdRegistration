
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const reviews = require('C:/Gitub-Projects/UKLtdRegistration/utils/reviews.js');

const publishedReviews = reviews.getPublishedReviews(3);
const ratingLabel = reviews.getRatingLabel();

const packages = [
    { id: 'starter', name: 'Starter', price: '119.99', description: 'Test', features: ['A','B'], cta: 'Choose' },
    { id: 'standard', name: 'Standard Plus', price: '189.99', popular: true, description: 'Test', features: ['A','B','C'], cta: 'Go' },
    { id: 'premium', name: 'Enterprise Elite', price: '299.99', description: 'Test', features: ['A','B','C','D'], cta: 'Elite' }
];

try {
    const content = fs.readFileSync('C:/Gitub-Projects/UKLtdRegistration/views/pages/home.ejs', 'utf8');
    const html = ejs.render(content, {
        title: 'Test',
        metaDescription: 'Test',
        metaKeywords: 'test',
        packages: packages,
        articleImage: '/images/hero-home.png',
        publishedReviews: publishedReviews,
        ratingLabel: ratingLabel,
        currentPath: '/',
        currentYear: '2026'
    }, {
        filename: 'C:/Gitub-Projects/UKLtdRegistration/views/pages/home.ejs'
    });
    console.log('RENDER OK, length:', html.length);
    console.log('First 200:', html.substring(0, 200));
} catch (e) {
    console.error('RENDER ERROR:', e.message);
    console.error(e.stack);
}
