const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function readFiles(dir, exts) {
  let results = [];
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(readFiles(full, exts));
    else if (exts.includes(path.extname(f))) results.push(full);
  });
  return results;
}

// Build valid routes from content files
const contentDir = path.join(root, 'content');
const contentFiles = readFiles(contentDir, ['.md']);
const validRoutes = new Set(['/', '/pricing']);
contentFiles.forEach(f => {
  const rel = path.relative(contentDir, f).replace(/\\/g, '/');
  if (rel.startsWith('blog/')) {
    const slug = path.basename(f, '.md');
    validRoutes.add(`/blog/${slug}`);
  } else {
    const slug = path.basename(f, '.md');
    validRoutes.add(`/${slug}`);
  }
});

// Extract static routes from routes/sitemap.js
const sitemapPath = path.join(root, 'routes', 'sitemap.js');
if (fs.existsSync(sitemapPath)) {
  const s = fs.readFileSync(sitemapPath, 'utf8');
  const m = s.match(/const staticRoutes = \[([\s\S]*?)\];/);
  if (m) {
    const arr = m[1].split(/,\s*/).map(x => x.replace(/["'\s]/g, '').trim()).filter(Boolean);
    arr.forEach(r => validRoutes.add(r));
  }
}

// Scan files for href="/...
const filesToScan = [].concat(
  readFiles(path.join(root, 'content'), ['.md']),
  readFiles(path.join(root, 'views'), ['.ejs']),
  readFiles(path.join(root, 'routes'), ['.js'])
);

const internalLinks = new Set();
filesToScan.forEach(f => {
  const txt = fs.readFileSync(f, 'utf8');
  const re = /href=\"(\/[^\"#\s>]+)\"/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    internalLinks.add(m[1]);
  }
});

const missing = [];
internalLinks.forEach(link => {
  if (!validRoutes.has(link)) missing.push(link);
});

console.log('Valid routes count:', validRoutes.size);
console.log('Internal links found:', internalLinks.size);
if (missing.length === 0) console.log('No missing internal links found.');
else {
  console.log('Missing internal links (not present in content or static routes):');
  missing.forEach(m => console.log(' -', m));
}

// Exit with non-zero if missing
process.exit(missing.length > 0 ? 2 : 0);
