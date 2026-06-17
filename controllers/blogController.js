/**
 * Blog Controller
 * Handles blog listing and single article views
 */
const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Use a simple JSON database for articles
const articlesPath = path.join(__dirname, '../content/blog/blog-articles.json');

exports.index = (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
        const allArticles = [...(data.articles || []), ...(data.newArticles || [])];
        
        res.render('pages/blog-list', {
            title: 'Blog - UK Company Formation Insights',
            metaDescription: 'Latest news and guides about UK company formation.',
            articles: allArticles
        });
    } catch (error) {
        console.error('Blog index error:', error);
        res.render('pages/blog-list', {
            title: 'Blog',
            articles: [],
            metaDescription: 'Latest news and guides about UK company formation.'
        });
    }
};

exports.show = (req, res) => {
    try {
        const { slug } = req.params;
        const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
        const allArticles = [...(data.articles || []), ...(data.newArticles || [])];
        const article = allArticles.find(a => a.slug === slug);

        if (!article) {
            return res.status(404).render('pages/404', { title: 'Article Not Found' });
        }

        // Define Pillar Mapping for Breadcrumbs
        const pillarMap = {
            'Export Hub': { name: 'Exporters Hub', url: '/blog/global-exporters-hub-uk-ltd' },
            'Banking': { name: 'Banking Guide', url: '/blog/business-banking-uk-ltd-non-residents' },
            'Regional': { name: 'Regional Guides', url: '/blog/regional-guides' },
            'Formation': { name: 'Formation Complete Guide', url: '/blog/uk-company-formation-complete-guide-2026' }
        };

        // Determine Pillar based on article category or tags
        let pillar = null;
        if (article.category === 'Export Hub' || (article.tags && article.tags.includes('export'))) {
            pillar = pillarMap['Export Hub'];
        } else if (article.category === 'Banking' || (article.tags && article.tags.includes('banking'))) {
            pillar = pillarMap['Banking'];
        } else if (article.category === 'Regional' || (article.tags && article.tags.includes('USA')) || (article.tags && article.tags.includes('Pakistan'))) {
            pillar = pillarMap['Regional'];
        } else if (article.category === 'Company Formation') {
            pillar = pillarMap['Formation'];
        }

        // Read markdown content if file exists
        const mdPath = path.join(__dirname, `../content/blog/${slug}.md`);
        let content = article.excerpt;
        
        if (fs.existsSync(mdPath)) {
            let rawMd = fs.readFileSync(mdPath, 'utf8');
            
            // Strip YAML frontmatter (between --- delimiters)
            rawMd = rawMd.replace(/^---[\s\S]*?---\s*\n?/, '');
            
            // Strip the first H1 heading to avoid duplicate H1 (template already renders article.title as H1)
            rawMd = rawMd.replace(/^\s*#\s+.+\n?\n?/, '');
            
            content = marked.parse(rawMd);
        }

        // Find related articles (same pillar/category, different slug)
        const relatedArticles = allArticles
            .filter(a => (a.category === article.category || (pillar && a.tags && a.tags.some(t => article.tags && article.tags.includes(t)))) && a.slug !== slug)
            .sort(() => 0.5 - Math.random()) // Randomize for variety
            .slice(0, 3);

        res.render('pages/blog-single', {
            title: article.title,
            metaDescription: article.metaDescription || article.excerpt,
            article: article,
            content: content,
            relatedArticles: relatedArticles,
            pillar: pillar,
            displayDate: (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        });
    } catch (error) {
        console.error('Blog show error:', error);
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};

exports.seaCollection = (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
        const allArticles = [...(data.articles || []), ...(data.newArticles || [])];
        
        const seaArticles = allArticles.filter(a => 
            a.tags && (a.tags.includes('SEA') || a.tags.includes('Singapore') || a.tags.includes('Malaysia') || a.tags.includes('Vietnam') || a.tags.includes('Indonesia') || a.tags.includes('Thailand') || a.tags.includes('Philippines') || a.tags.includes('India') || a.tags.includes('Pakistan') || a.tags.includes('Bangladesh') || a.tags.includes('Sri Lanka') || a.tags.includes('Nepal'))
        );

        res.render('pages/blog-sea', {
            title: 'Southeast Asia Founders Hub - UK Company Formation',
            metaDescription: 'Complete guide for founders in Singapore, Malaysia, Vietnam, and Indonesia using UK companies to go global.',
            articles: seaArticles
        });
    } catch (error) {
        console.error('SEA Collection error:', error);
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};

exports.exportCollection = (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
        const allArticles = [...(data.articles || []), ...(data.newArticles || [])];
        
        // Filter for export-related articles
        const exportArticles = allArticles.filter(a => 
            (a.tags && (a.tags.includes('Export') || a.tags.includes('Textile') || a.tags.includes('Leather') || a.tags.includes('Food') || a.tags.includes('Seafood') || a.tags.includes('Machinery') || a.tags.includes('Tenders'))) ||
            a.title.toLowerCase().includes('export')
        );

        res.render('pages/blog-list', {
            title: 'Exporters Hub - Global Trade via UK Ltd',
            metaDescription: 'Industry playbooks for global exporters: Leather, Textiles, Food, and High-Ticket Tendering.',
            articles: exportArticles
        });
    } catch (error) {
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};

exports.regionalCollection = (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
        const allArticles = [...(data.articles || []), ...(data.newArticles || [])];
        
        // Filter for regional expansion guides
        const regionalArticles = allArticles.filter(a => 
            a.tags && (a.tags.includes('USA') || a.tags.includes('Ireland') || a.tags.includes('UAE') || a.tags.includes('International') || a.tags.includes('Pakistan') || a.tags.includes('India') || a.tags.includes('Bangladesh') || a.tags.includes('Sri Lanka') || a.tags.includes('Nepal'))
        );

        res.render('pages/blog-list', {
            title: 'Regional Expansion Guides - UK Ltd for Global Founders',
            metaDescription: 'Step-by-step guides for registering a UK company from the USA, Pakistan, India, Ireland, and the UAE.',
            articles: regionalArticles
        });
    } catch (error) {
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};
