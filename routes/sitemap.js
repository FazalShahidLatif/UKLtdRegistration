const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/sitemap.xml', (req, res) => {
    try {
        const rootUrl = 'https://ukltdregistration.com';
        
        // Hardcoded static routes
        const staticRoutes = [
            '/',
            '/uk-residents',
            '/us-citizens',
            '/pricing',
            '/uk-ltd-formation-for-non-residents',
            '/services',
            '/services/virtual-office',
            '/services/meeting-rooms',
            '/services/accounting',
            '/services/banking',
            '/about',
            '/faq',
            '/contact',
            '/knowledge-hub',
            '/blog',
            '/blog/southeast-asia-founders',
            '/strategic-research-hub',
            '/success-stories',
            '/partners',
            '/legal/privacy',
            '/legal/terms',
            '/legal/cookies',
            '/legal/refund',
            '/legal/compliance'
        ];

        // Gather all blog articles from the source of truth (JSON)
        let articles = [];
        try {
            const blogArticlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
            if (fs.existsSync(blogArticlesPath)) {
                const blogData = JSON.parse(fs.readFileSync(blogArticlesPath, 'utf8'));
                const combinedArticles = [...(blogData.articles || []), ...(blogData.newArticles || [])];
                if (combinedArticles.length > 0) {
                    articles = combinedArticles.map(article => `/blog/${article.slug}`);
                }
            }
        } catch (e) {
            console.error('Error reading blog articles for sitemap:', e);
        }

        const allRoutes = [...staticRoutes, ...articles];
        const today = new Date().toISOString().split('T')[0];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

        // Helper to find article metadata
        const getArticleData = (slug) => {
            try {
                const blogArticlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
                const blogData = JSON.parse(fs.readFileSync(blogArticlesPath, 'utf8'));
                const combinedArticles = [...(blogData.articles || []), ...(blogData.newArticles || [])];
                return combinedArticles.find(a => `/blog/${a.slug}` === slug);
            } catch (e) { return null; }
        };

        allRoutes.forEach(route => {
            const priority = route === '/' ? '1.0' : (route.includes('/blog/') ? '0.7' : '0.8');
            const changefreq = route === '/' ? 'daily' : 'weekly';
            
            xml += '  <url>\n';
            xml += `    <loc>${rootUrl}${route}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${changefreq}</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;

            // Add image metadata for blog articles
            if (route.startsWith('/blog/')) {
                const article = getArticleData(route);
                if (article && article.image) {
                    xml += '    <image:image>\n';
                    xml += `      <image:loc>${rootUrl}${article.image}</image:loc>\n`;
                    if (article.imageAlt) {
                        xml += `      <image:caption>${article.imageAlt}</image:caption>\n`;
                    }
                    xml += '    </image:image>\n';
                }
            }

            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;
