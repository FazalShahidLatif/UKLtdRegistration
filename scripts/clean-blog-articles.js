const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../content/blog');
const blogJsonPath = path.join(blogDir, 'blog-articles.json');

if (!fs.existsSync(blogJsonPath)) {
  console.error('blog-articles.json not found');
  process.exit(1);
}

const mdFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
const jsonRaw = fs.readFileSync(blogJsonPath, 'utf8');
let blogData;
try {
  blogData = JSON.parse(jsonRaw);
} catch (e) {
  console.error('Failed to parse JSON:', e.message);
  process.exit(1);
}

const combined = [...(blogData.articles || []), ...(blogData.newArticles || [])];
const existing = combined.filter(a => mdFiles.includes(a.slug));
const removed = combined.filter(a => !mdFiles.includes(a.slug)).map(a => a.slug);

const out = { articles: existing };
fs.writeFileSync(blogJsonPath, JSON.stringify(out, null, 2), 'utf8');

console.log('Removed slugs count:', removed.length);
if (removed.length > 0) {
  console.log('Removed slugs:');
  removed.forEach(s => console.log(' -', s));
}
console.log('blog-articles.json updated.');
