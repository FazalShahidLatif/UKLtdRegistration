const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../content/blog/blog-articles.json');

function getAllArticles() {
    const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    return [...(data.articles || []), ...(data.newArticles || [])];
}

function isPublished(article, now = new Date()) {
    if (article.status === 'draft') return false;
    if (!article.publishAt) return true;
    return new Date(article.publishAt) <= now;
}

function getPublishedArticles(now = new Date()) {
    return getAllArticles().filter(article => isPublished(article, now));
}

function getPublishedArticleBySlug(slug, now = new Date()) {
    return getPublishedArticles(now).find(article => article.slug === slug);
}

module.exports = { getAllArticles, getPublishedArticles, getPublishedArticleBySlug, isPublished };