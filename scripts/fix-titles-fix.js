const fs = require('fs');

const articlesPath = 'content/blog/blog-articles.json';
const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// Fix over-aggressive title truncations — restore valuable keywords
// The previous script dropped everything after | which lost important keywords
// Correct: truncate WHOLE string to 57 + "..." if over 60 chars

const TITLE_RESTORES = {
    1: "Register UK Company from USA 2026 | UK Ltd for US Entrepreneurs",
    16: "ACSP Identity Verification 2026 | UK Director Compliance Guide",
    24: "SEA Founder's UK Playbook 2026 | Singapore, Malaysia, Vietnam Hub",
    39: "UK Company Tax Efficiency for Non-Residents 2026 | Legal Tips",
    73: "Payoneer Business Account for UK LTD | Non-Resident Setup Guide",
};

// Restore the originals that were wrongly truncated
Object.keys(TITLE_RESTORES).forEach(function(key) {
    var id = parseInt(key);
    var original = TITLE_RESTORES[key];
    var a = data.articles.find(function(x) { return x.id === id; });
    if (a) {
        if (a.metaTitle.length < original.length - 5) {
            a.metaTitle = original;
            console.log('Restored id=' + id + ':', a.slug);
            console.log('  Before:', a.metaTitle);
            console.log('  After:', original);
        }
    }
});

// Now properly truncate ONLY titles genuinely over 60 chars
// Use whole-string truncation to 57 + "..."
var properlyFixed = 0;
data.articles.forEach(function(a) {
    if (a.metaTitle && a.metaTitle.length > 60) {
        var oldLen = a.metaTitle.length;
        a.metaTitle = a.metaTitle.substring(0, 57) + '...';
        properlyFixed++;
        console.log('Properly truncated id=' + a.id + ':', a.slug, '(' + oldLen + ' chars)');
    }
});

fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
console.log('\n=== DONE ===');
console.log('Restored:', Object.keys(TITLE_RESTORES).length);
console.log('Properly truncated:', properlyFixed);
console.log('Total articles with images:', data.articles.filter(function(a) { return a.image; }).length, '/', data.articles.length);
console.log('Total with updatedDate=2026-09-14:', data.articles.filter(function(a) { return a.updatedDate === '2026-09-14'; }).length);
