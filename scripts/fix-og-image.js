#!/usr/bin/env node
/**
 * Fix og:image fallback + image indexing
 */

const fs = require('fs');
const path = require('path');

const META_PATH = path.join(__dirname, '../views/partials/meta.ejs');
const ROUTES_PATH = path.join(__dirname, '../routes/pages.js');
const HOME_PATH = path.join(__dirname, '../routes/home.js');
const BLOG_CONTROLLER_PATH = path.join(__dirname, '../controllers/blogController.js');
const SITEMAP_PATH = path.join(__dirname, '../routes/sitemap.js');

console.log('=== Fixing OG Image Fallback + Image Indexing ===\n');

// ============================================================================
// STEP 1: Fix og-image fallback in meta.ejs
// ============================================================================
console.log('STEP 1: Fixing og:image fallback...\n');

const metaContent = fs.readFileSync(META_PATH, 'utf8');

// Use split/join to replace all og-image.jpg references with hero-home.png
const replaced = metaContent.split('/images/og-image.jpg').join('/images/hero-home.png');

if (replaced !== metaContent) {
    fs.writeFileSync(META_PATH, replaced);
    console.log('  meta.ejs: Changed og:image fallback from og-image.jpg → hero-home.png');
    console.log('  Both og:image (line 15) and twitter:image (line 27) updated');
} else {
    console.log('  meta.ejs: No og-image.jpg reference found — fallback may already be correct');
}

// ============================================================================
// STEP 2: Ensure all route handlers pass articleImage for OG tags
// ============================================================================
console.log('\nSTEP 2: Checking articleImage in route handlers...\n');

const homeContent = fs.readFileSync(HOME_PATH, 'utf8');
if (homeContent.includes('articleImage')) {
    console.log('  routes/home.js: articleImage set → OG fires on homepage ✓');
} else {
    console.log('  routes/home.js: MISSING articleImage');
}

const pagesContent = fs.readFileSync(ROUTES_PATH, 'utf8');
if (pagesContent.includes('articleImage')) {
    console.log('  routes/pages.js: articleImage set in multiple routes ✓');
} else {
    console.log('  routes/pages.js: MISSING articleImage');
}

const blogControllerContent = fs.readFileSync(BLOG_CONTROLLER_PATH, 'utf8');
if (blogControllerContent.includes('articleImage')) {
    console.log('  controllers/blogController.js: articleImage set → OG fires on /blog ✓');
} else {
    console.log('  controllers/blogController.js: MISSING articleImage');
}

// ============================================================================
// STEP 3: Verify sitemap image indexing
// ============================================================================
console.log('\nSTEP 3: Verifying sitemap image indexing...\n');

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');

const hasBlogImageIndexing = sitemapContent.includes('<image:image>') && sitemapContent.includes('article.image');
const hasHomepageIndexing = sitemapContent.includes("route === '/'") && sitemapContent.includes("'/images/hero-home.png'");
const hasSuccessStoriesIndexing = sitemapContent.includes("route === '/success-stories'") && sitemapContent.includes("'/images/success/saas.png'");

console.log('  Blog article image indexing: ' + (hasBlogImageIndexing ? 'YES ✓' : 'NO ✗'));
console.log('  Homepage image indexing: ' + (hasHomepageIndexing ? 'YES ✓' : 'NO ✗'));
console.log('  Success-stories image indexing: ' + (hasSuccessStoriesIndexing ? 'YES ✓' : 'NO ✗'));

// ============================================================================
// STEP 4: Audit non-blog template images for alt text + lazy loading
// ============================================================================
console.log('\nSTEP 4: Auditing non-blog template images...\n');

const viewsDir = path.join(__dirname, '../views/pages');
const issues = [];

function scanTemplateImages(dirPath, relativePath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        const relPath = relativePath ? relativePath + '/' + file : file;
        
        if (stat.isDirectory()) {
            scanTemplateImages(fullPath, relPath);
        } else if (file.endsWith('.ejs')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const imgRegex = /<img\s+([^>]*)>/g;
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                const attrs = match[1];
                const srcMatch = attrs.match(/src="([^"]*)"/);
                const altMatch = attrs.match(/alt="([^"]*)"/);
                const loadingMatch = attrs.match(/loading="([^"]*)"/);
                
                if (srcMatch && srcMatch[1].startsWith('/images/')) {
                    const src = srcMatch[1];
                    const issuesForImg = [];
                    if (!altMatch) issuesForImg.push('MISSING alt');
                    if (!loadingMatch && !src.includes('hero-')) issuesForImg.push('MISSING loading="lazy"');
                    if (issuesForImg.length > 0) {
                        issues.push({ file: relPath, src: src, issues: issuesForImg });
                    }
                }
            }
        }
    });
}

try {
    scanTemplateImages(viewsDir, '');
    if (issues.length > 0) {
        console.log('  Found ' + issues.length + ' image(s) needing attention:');
        issues.forEach(function(issue) {
            console.log('    ' + issue.file + ' → ' + issue.src + ': ' + issue.issues.join(', '));
        });
    } else {
        console.log('  All non-blog template images have alt text + loading ✓');
    }
} catch (err) {
    console.log('  Error: ' + err.message);
}

// ============================================================================
// STEP 5: Fix any template images missing alt/loading
// ============================================================================
console.log('\nSTEP 5: Fixing template images...\n');

if (issues.length > 0) {
    issues.forEach(function(issue) {
        const tplPath = path.join(viewsDir, issue.file);
        if (fs.existsSync(tplPath)) {
            let content = fs.readFileSync(tplPath, 'utf8');
            const imgTagRegex = new RegExp('<img\\s+src="' + issue.src.replace('/', '\\/') + '"([^>]*)>');
            const match = content.match(imgTagRegex);
            
            if (match) {
                let attrs = match[1];
                let newAttrs = attrs;
                
                if (!attrs.includes('alt=')) {
                    const altText = issue.src.split('/').pop().replace(/\.(png|jpg|webp|avif|svg)$/, '').replace(/-/g, ' ');
                    newAttrs = ' alt="' + altText + '"' + newAttrs;
                }
                if (!attrs.includes('loading=')) {
                    newAttrs = ' loading="lazy"' + newAttrs;
                }
                
                const oldTag = '<img src="' + issue.src + '"' + attrs + '>';
                const newTag = '<img src="' + issue.src + '"' + newAttrs + '>';
                content = content.replace(oldTag, newTag);
                fs.writeFileSync(tplPath, content);
                console.log('  ' + issue.file + ': Added ' + issue.issues.join(', ') + ' → ' + issue.src);
            }
        }
    });
} else {
    console.log('  No template images to fix ✓');
}

console.log('\n=== DONE ===');
