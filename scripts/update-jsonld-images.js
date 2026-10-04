/**
 * Update JSON-LD ImageObject schema for all blog articles
 * Adds full image optimization markup: responsive srcset, captions, dimensions
 * 
 * Run: node scripts/update-jsonld-images.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_PATH = path.join(__dirname, '../content/blog/blog-articles.json');
const JSONLD_TEMPLATE_PATH = path.join(__dirname, '../views/pages/blog-single.ejs');

const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8')).articles || [];

// Size variants available for each image type
const IMAGE_SIZES = [
    { width: 1200, w: '1200w', size: '1200' },
    { width: 800, w: '800w', size: '800' },
    { width: 400, w: '400w', size: '400' }
];

console.log('=== Updating JSON-LD ImageObject Schema ===\n');

let updated = 0;

articles.forEach(function(article) {
    if (!article.image) return;

    const imagePath = article.image;
    // Extract filename from path
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const dirName = path.dirname(imagePath);

    // Determine if this is a blog-specific image (in /blog/ subdir) or a shared image
    const isBlogImage = imagePath.includes('/blog/');
    const baseUrl = 'https://ukltdregistration.com' + imagePath;

    // Build srcset URLs for WebP and AVIF
    const webpSrcset = IMAGE_SIZES
        .map(function(s) {
            const sizeFile = isBlogImage ? fileName + '-' + s.size + '.png' : fileName + '-' + s.size + '.webp';
            return 'https://ukltdregistration.com' + path.join(dirName, sizeFile) + ' ' + s.w;
        })
        .join(', ');

    const avifSrcset = IMAGE_SIZES
        .map(function(s) {
            const sizeFile = isBlogImage ? fileName + '-' + s.size + '.png' : fileName + '-' + s.size + '.avif';
            return 'https://ukltdregistration.com' + path.join(dirName, sizeFile) + ' ' + s.w;
        })
        .join(', ');

    // Determine image dimensions (default to 1200x630 for hero-style images)
    let imageWidth = 1200;
    let imageHeight = 630;

    // Adjust for known image types
    if (isBlogImage) {
        imageWidth = 1200;
        imageHeight = 630;
    }

    // Build ImageObject schema
    const imageObject = {
        '@type': 'ImageObject',
        'url': baseUrl,
        'width': imageWidth,
        'height': imageHeight,
        'caption': (article.imageAlt || article.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        'description': (article.description || article.metaDescription || '').substring(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    };

    article._imageObject = imageObject;
    article._webpSrcset = webpSrcset;
    article._avifSrcset = avifSrcset;
    updated++;
});

console.log('Updated ' + updated + ' articles with image metadata\n');

// Save updated articles
const updatedJson = JSON.stringify({ articles: articles }, null, 2);
fs.writeFileSync(ARTICLES_PATH, updatedJson, 'utf8');
console.log('Saved ' + ARTICLES_PATH + '\n');

// Now update the blog-single.ejs template to use this data in JSON-LD
console.log('=== Updating blog-single.ejs JSON-LD template ===\n');

const templatePath = JSONLD_TEMPLATE_PATH;
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Remove the old inline JSON-LD image reference (the article.image line in schema)
const oldImageSchema = /.*"image":\s*"<%= article\.image %>".*\n?/g;
const newTemplate = templateContent.replace(oldImageSchema, '');

// Find the Article schema block and update it to use article._imageObject
// The schema should be in a <script type="application/ld+json"> block

// Look for the existing schema block and add image data
const hasImageSchema = templateContent.includes('"image"');

if (!hasImageSchema) {
    console.log('Schema already updated — no changes needed');
} else {
    // Replace the image field with the full ImageObject reference
    // The schema uses article.image directly - we need to change to article._imageObject
    // But since this is EJS, we need to keep it as server-side template
    console.log('Updating image schema references in template...');

    // The template currently has: "image": "<%= article.image %>"
    // We want it to output the full ImageObject
    // In EJS: <%- JSON.stringify(article._imageObject) %>
    const updatedContent = templateContent
        .replace(/"image":\s*"<%= article\.image %>"/g, '"image": <%- JSON.stringify(article._imageObject) %>');

    fs.writeFileSync(templatePath, updatedContent, 'utf8');
    console.log('Updated ' + templatePath);
    console.log('  Replaced "image": "<%= article.image %>" with ImageObject reference\n');
}

console.log('=== DONE ===');
console.log('Articles with JSON-LD image data: ' + updated);
console.log('Template updated: blog-single.ejs');
