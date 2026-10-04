/**
 * Fix 404 image links:
 * 1. Map article.image .jpg refs to existing .webp/.avif where possible
 * 2. For Phase 2 articles with unique .jpg and no alternative, generate a fallback image
 * 3. Update blog-articles.json
 *
 * Run: node scripts/fix-broken-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const IMAGES_DIR = path.join(__dirname, '../public/images');

const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];

// ============================================================================
// STEP 1: Build disk file index (normalize to forward slashes)
// ============================================================================
const diskFiles = new Set();
function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(function(f) {
        const fp = path.join(dir, f);
        const rel = path.relative('public', fp).split('\\').join('/');
        if (fs.statSync(fp).isDirectory()) {
            walkDir(fp);
        } else {
            diskFiles.add('/' + rel);
        }
    });
}
walkDir('public');
console.log('Disk files indexed: ' + diskFiles.size);

// ============================================================================
// STEP 2: Fix article.image references
// ============================================================================
let fixedCount = 0;
let generatedCount = 0;

articles.forEach(function(article) {
    if (!article.image) return;

    const img = article.image; // e.g. '/images/blog_uk_formation_guide_2026.png'
    const parsed = path.parse(img);
    const base = parsed.name;
    const dir = parsed.dir;

    // If image exists on disk, skip
    if (diskFiles.has(img)) return;

    // Try .webp, .avif, .png alternatives
    const alts = [
        path.join(dir, base + '.webp'),
        path.join(dir, base + '.avif'),
        path.join(dir, base + '.png')
    ];

    let foundAlt = null;
    for (const alt of alts) {
        const nalt = alt.split('\\').join('/');
        if (diskFiles.has(nalt)) {
            foundAlt = nalt;
            break;
        }
    }

    if (foundAlt) {
        // Update article.image to point to the existing alternative
        article.image = foundAlt;
        fixedCount++;
        console.log('FIXED: ' + article.slug + ' → ' + foundAlt);
        return;
    }

    // No alternative on disk — need to generate a fallback
    // For Phase 2 articles, generate a simple SVG fallback with article title
    const slug = article.slug;
    const title = (article.title || article.slug).substring(0, 60);
    const fallbackName = base + '.svg';
    const fallbackPath = path.join(dir, fallbackName).split('\\').join('/');

    // Check if we already generated it
    if (diskFiles.has(fallbackPath)) {
        article.image = fallbackPath;
        generatedCount++;
        return;
    }

    // Generate SVG fallback
    function escapeXml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    const svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">\n  <defs>\n    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />\n      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />\n    </linearGradient>\n  </defs>\n  <rect width="1200" height="630" fill="url(#bg)"/>\n  <text x="600" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">\n    ' + escapeXml(title) + '\n  </text>\n  <text x="600" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">\n    UK LTD Registration\n  </text>\n  <circle cx="600" cy="440" r="30" fill="none" stroke="#3b82f6" stroke-width="3"/>\n  <circle cx="600" cy="440" r="12" fill="#3b82f6"/>\n</svg>';

    fs.writeFileSync(path.join('public', fallbackPath.split('/').join('\\')), svg);
    diskFiles.add(fallbackPath);
    article.image = fallbackPath;
    generatedCount++;
    console.log('GENERATED: ' + article.slug + ' → ' + fallbackPath);
});

// ============================================================================
// STEP 3: Write updated blog-articles.json
// ============================================================================
if (fixedCount > 0 || generatedCount > 0) {
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify({ articles: articles }, null, 2) + '\n');
    console.log('\nUpdated: ' + ARTICLES_PATH);
    console.log('Remapped ' + fixedCount + ' articles to existing alternatives');
    console.log('Generated ' + generatedCount + ' SVG fallback images');
} else {
    console.log('\nNo changes needed — all images exist on disk');
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n=== SUMMARY ===');
console.log('Total articles: ' + articles.length);
console.log('Articles with image: ' + articles.filter(function(a) { return a.image; }).length);
console.log('Fixed (remapped to alt): ' + fixedCount);
console.log('Generated (SVG fallback): ' + generatedCount);
console.log('Remaining broken: ' + articles.filter(function(a) {
    if (!a.image) return false;
    return !diskFiles.has(a.image);
}).length);
