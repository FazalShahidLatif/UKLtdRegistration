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


        // Read markdown content if file exists
        const mdPath = path.join(__dirname, `../content/blog/${slug}.md`);
        let content = article.excerpt;
        
        if (fs.existsSync(mdPath)) {
            const rawMd = fs.readFileSync(mdPath, 'utf8');
            content = marked.parse(rawMd);
        }

        res.render('pages/blog-single', {
            title: article.title,
            metaDescription: article.description,
            article: article,
            content: content
        });
    } catch (error) {
        console.error('Blog show error:', error);
        res.status(500).render('pages/error', { title: 'Error', error });
    }
};
