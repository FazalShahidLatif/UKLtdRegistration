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
            '/get-help-forming-a-uk-ltd',
            '/pricing',
            '/uk-ltd-formation-for-non-residents',
            '/register-a-limited-company-uk',
            '/register-company-england',
            '/register-company-scotland',
            '/register-company-wales',
            '/register-company-london',
            '/register-company-manchester',
            '/register-company-birmingham',
            '/register-company-leeds',
            '/register-company-edinburgh',
            '/services',
            '/services/virtual-office',
            '/services/meeting-rooms',
            '/services/accounting',
            '/services/banking',
            '/services/apostille',
            '/services/dissolution',
            '/registered-office-address',
            '/company-secretary',
            '/vat-registration',
            '/confirmation-statement',
            '/company-name-check',
            '/non-uk-resident-company',
            '/about',
            '/faq',
            '/contact',
            '/knowledge-hub',
            '/blog',
            '/blog/southeast-asia-founders',
            '/blog/export-hub',
            '/blog/regional-guides',
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
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

        // Helper to find article metadata
        const getArticleData = (slug) => {
            try {
                const blogArticlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
                const blogData = JSON.parse(fs.readFileSync(blogArticlesPath, 'utf8'));
                const combinedArticles = [...(blogData.articles || []), ...(blogData.newArticles || [])];
                return combinedArticles.find(a => `/blog/${a.slug}` === slug);
            } catch (e) { return null; }
        };

        // Define high-priority blog slugs for main sitemap
        const highPrioritySlugs = [
            'uk-company-formation-complete-guide-2026',
            'how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026',
            'sea-founders-uk-playbook-2026',
            'register-uk-ltd-online-india-pakistan-2026',
            'pakistan-exporter-guide-leather-textile-uk-ltd',
            'india-manufacturer-roadmap-usa-europe-uk-ltd',
            'global-food-export-guide-coffee-meat-seafood-uk-ltd',
            'global-tendering-guide-uk-ltd-high-ticket-export',
            'wise-vs-uk-banks-non-residents',
            'revolut-business-vs-wise-business-uk-ltd-2026',
            'payoneer-business-account-uk-ltd-setup-guide-2026',
            'business-banking-uk-ltd-non-residents',
            'bangalore-fintech-startups-uk-ltd',
            'dhaka-garment-exporters-uk-ltd-guide-2026',
            'colombo-call-centers-bpo-uk-company',
            'nepal-it-freelancers-uk-ltd-payment-gateways'
        ];

        // Pages with embedded video content
        const videoPages = {
            '/services/banking': {
                title: 'UK Business Bank Account for Non-Residents Guide',
                description: 'Step-by-step walkthrough on setting up your UK business bank account remotely as a non-resident director.',
                contentLoc: 'https://www.youtube.com/watch?v=ogC25JcpSwY',
                thumbnailLoc: 'https://img.youtube.com/vi/ogC25JcpSwY/maxresdefault.jpg',
                playerLoc: 'https://www.youtube.com/embed/ogC25JcpSwY'
            },
            '/blog/business-banking-uk-ltd-non-residents': {
                title: 'UK Business Bank Account for Non-Residents Guide',
                description: 'Complete guide to opening a UK business bank account as a non-resident. Covers Wise, Revolut, Mercury and more.',
                contentLoc: 'https://www.youtube.com/watch?v=ogC25JcpSwY',
                thumbnailLoc: 'https://img.youtube.com/vi/ogC25JcpSwY/maxresdefault.jpg',
                playerLoc: 'https://www.youtube.com/embed/ogC25JcpSwY'
            }
        };

        allRoutes.forEach(route => {
            const isBlog = route.includes('/blog/');
            const slug = isBlog ? route.replace('/blog/', '') : null;
            const isHighPriority = slug && highPrioritySlugs.includes(slug);
            
            const priority = route === '/' ? '1.0' : (isHighPriority ? '0.9' : (isBlog ? '0.7' : '0.8'));
            const changefreq = (route === '/' || isHighPriority) ? 'daily' : 'weekly';
            
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

            // Add video metadata for pages with embedded videos
            if (videoPages[route]) {
                const video = videoPages[route];
                xml += '    <video:video>\n';
                xml += `      <video:thumbnail_loc>${video.thumbnailLoc}</video:thumbnail_loc>\n`;
                xml += `      <video:title>${video.title}</video:title>\n`;
                xml += `      <video:description>${video.description}</video:description>\n`;
                xml += `      <video:content_loc>${video.contentLoc}</video:content_loc>\n`;
                xml += `      <video:player_loc>${video.playerLoc}</video:player_loc>\n`;
                xml += '    </video:video>\n';
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

// Priority Sitemap for Top 20 Pages
router.get('/priority-sitemap.xml', (req, res) => {
    try {
        const rootUrl = 'https://ukltdregistration.com';
        const priorityPages = [
            '/',
            '/services',
            '/about',
            '/blog/southeast-asia-founders',
            '/blog/export-hub',
            '/blog/regional-guides',
            '/get-help-forming-a-uk-ltd',
            '/uk-ltd-formation-for-non-residents',
            '/register-a-limited-company-uk',
            '/register-company-england',
            '/register-company-scotland',
            '/register-company-wales',
            '/register-company-london',
            '/register-company-manchester',
            '/register-company-birmingham',
            '/register-company-leeds',
            '/register-company-edinburgh',
            '/services/banking',
            '/services/apostille',
            '/services/dissolution',
            '/services/accounting',
            '/services/virtual-office',
            '/registered-office-address',
            '/company-secretary',
            '/vat-registration',
            '/confirmation-statement',
            '/company-name-check',
            '/non-uk-resident-company',
            '/blog/can-i-register-a-uk-company-as-a-non-uk-resident',
            '/blog/how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026',
            '/blog/sea-founders-uk-playbook-2026',
            '/blog/register-uk-ltd-online-india-pakistan-2026',
            '/blog/pakistan-exporter-guide-leather-textile-uk-ltd',
            '/blog/india-manufacturer-roadmap-usa-europe-uk-ltd',
            '/blog/global-food-export-guide-coffee-meat-seafood-uk-ltd',
            '/blog/global-tendering-guide-uk-ltd-high-ticket-export',
            '/blog/acsp-identity-verification-2026',
            '/blog/vat-registration-threshold-uk-2026',
            '/blog/uk-company-formation-complete-guide-2026',
            '/blog/wise-vs-uk-banks-non-residents',
            '/blog/uk-ltd-vs-us-llc',
            '/blog/uk-company-vs-delaware-c-corp',
            '/blog/uk-registered-office-address-requirements-2026',
            '/blog/uk-company-tax-efficiency-non-residents',
            '/blog/revolut-business-vs-wise-business-uk-ltd-2026',
            '/blog/payoneer-business-account-uk-ltd-setup-guide-2026',
            '/blog/bangalore-fintech-startups-uk-ltd',
            '/blog/dhaka-garment-exporters-uk-ltd-guide-2026',
            '/blog/colombo-call-centers-bpo-uk-company',
            '/blog/nepal-it-freelancers-uk-ltd-payment-gateways'
        ];

        const today = new Date().toISOString().split('T')[0];
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        priorityPages.forEach(route => {
            xml += '  <url>\n';
            xml += `    <loc>${rootUrl}${route}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += '    <changefreq>daily</changefreq>\n';
            xml += '    <priority>1.0</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).send('Error generating priority sitemap');
    }
});

module.exports = router;
