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
            // Note: canonical service pages are under top-level paths (see routes/pages.js)
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

        // Load redirect sources and avoid listing redirecting URLs in the sitemap
        let redirectSources = new Set();
        try {
            const redirectsPath = path.join(__dirname, '../content/redirects.json');
            if (fs.existsSync(redirectsPath)) {
                const redirectsData = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
                redirectsData.forEach(r => redirectSources.add(r.from));
            }
        } catch (e) {
            console.error('Error reading redirects for sitemap filtering:', e);
        }

        // Filter out any routes that are redirect sources and deduplicate while preserving order
        const filteredStatic = staticRoutes.filter(r => !redirectSources.has(r));
        const filteredArticles = articles.filter(r => !redirectSources.has(r));
        const allRoutes = [];
        const seen = new Set();
        (filteredStatic.concat(filteredArticles)).forEach(route => {
            if (!seen.has(route)) {
                seen.add(route);
                allRoutes.push(route);
            }
        });
        const today = new Date().toISOString().split('T')[0];
        const xmlEscape = value => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

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
            
            xml += '  <url>\n';
            xml += `    <loc>${xmlEscape(rootUrl + route)}</loc>\n`;
            const article = isBlog ? getArticleData(route) : null;
            xml += `    <lastmod>${xmlEscape((article && (article.updatedDate || article.publishedDate)) || today)}</lastmod>\n`;

            // Add image metadata for blog articles
            if (route.startsWith('/blog/')) {
                if (article && article.image) {
                    xml += '    <image:image>\n';
                    xml += `      <image:loc>${xmlEscape(rootUrl + article.image)}</image:loc>\n`;
                    if (article.imageAlt) {
                        xml += `      <image:caption>${xmlEscape(article.imageAlt)}</image:caption>\n`;
                    }
                    xml += '    </image:image>\n';
                }
            }

            // Add video metadata for pages with embedded videos
            if (videoPages[route]) {
                const video = videoPages[route];
                xml += '    <video:video>\n';
                xml += `      <video:thumbnail_loc>${video.thumbnailLoc}</video:thumbnail_loc>\n`;
                xml += `      <video:title>${xmlEscape(video.title)}</video:title>\n`;
                xml += `      <video:description>${xmlEscape(video.description)}</video:description>\n`;
                xml += `      <video:content_loc>${xmlEscape(video.contentLoc)}</video:content_loc>\n`;
                xml += `      <video:player_loc>${xmlEscape(video.playerLoc)}</video:player_loc>\n`;
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
        let redirectSources = new Set();
        try {
            const redirectsPath = path.join(__dirname, '../content/redirects.json');
            if (fs.existsSync(redirectsPath)) {
                const redirectsData = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
                redirectsData.forEach(r => redirectSources.add(r.from));
            }
        } catch (e) {
            console.error('Error reading redirects for priority sitemap filtering:', e);
        }

        // Build priority pages list dynamically from top articles
        let priorityBlogRoutes = [];
        try {
            const blogArticlesPath = path.join(__dirname, '../content/blog/blog-articles.json');
            if (fs.existsSync(blogArticlesPath)) {
                const blogData = JSON.parse(fs.readFileSync(blogArticlesPath, 'utf8'));
                const articles = blogData.articles || [];
                // Take first 40 articles from the source of truth as priority
                priorityBlogRoutes = articles.slice(0, 40).map(a => `/blog/${a.slug}`);
            }
        } catch (e) {
            console.error('Error building priority blog routes:', e);
        }

        const priorityPages = [
            '/',
            '/services',
            '/about',
            '/get-help-forming-a-uk-ltd',
            '/uk-ltd-formation-for-non-residents',
            '/register-a-limited-company-uk',
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
            '/non-uk-resident-company'
        ].concat(priorityBlogRoutes)
            .filter(route => !redirectSources.has(route))
            .filter((route, index, routes) => routes.indexOf(route) === index);

        const today = new Date().toISOString().split('T')[0];
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        priorityPages.forEach(route => {
            xml += '  <url>\n';
            xml += `    <loc>${rootUrl}${route}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
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
