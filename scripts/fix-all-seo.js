const fs = require('fs');

let pages = fs.readFileSync('routes/pages.js', 'utf8');
let home = fs.readFileSync('routes/home.js', 'utf8');
let fixed = 0;

function fix(content, from, to) {
    if (content.includes(from)) {
        content = content.replace(from, to);
        fixed++;
        console.log('FIXED (' + to.length + 'c): ' + to);
        return content;
    }
    console.log('NOT FOUND: ' + from.substring(0, 60));
    return content;
}

// Remaining 6 over-55-char titles need more aggressive shortening
const fixes = [
    // Cheapest UK Company Formation from £119.99 | All-Inclusive (58c)
    ["'Cheapest UK Company Formation from £119.99 | All-Inclusive'",
     "'Cheapest UK Company Formation from £119.99 | All-Incl.'"],  // 54c
    
    // Virtual Office London — Prestigious UK Address from £49.99 (58c)
    ["'Virtual Office London — Prestigious UK Address from £49.99'",
     "'Virtual Office London — Prestigious UK Address £49.99/yr'"],  // 54c
    
    // UK LTD Success Stories — Pakistan, India, Bangladesh Founders (61c)
    ["'UK LTD Success Stories — Pakistan, India, Bangladesh Founders'",
     "'UK LTD Success Stories — Pakistan, India & Bangladesh'"],  // 50c
    
    // Manchester Company Formation — Same-Day Online from £119.99 (59c)
    ["'Manchester Company Formation — Same-Day Online from £119.99'",
     "'Manchester Company Formation — Same-Day from £119.99'"],  // 51c
    
    // UK Company Formation for Residents — Same-Day from £119.99 (60c)
    ["'UK Company Formation for Residents — Same-Day from £119.99'",
     "'UK Company Formation for Residents — Same-Day £119.99'"],  // 50c
    
    // Homepage: UK LTD Formation — UK Company in 24 Hours from £119.99 | ACSP Agents (68c)
    ["'UK LTD Formation — UK Company in 24 Hours from £119.99 | ACSP Agents'",
     "'UK LTD Formation — UK Company in 24 Hours from £119.99'"],  // 53c
];

fixes.forEach(([from, to]) => {
    pages = fix(pages, from, to);
});
home = fix(home,
    "'UK LTD Formation — UK Company in 24 Hours from £119.99 | ACSP Agents'",
    "'UK LTD Formation — UK Company in 24 Hours from £119.99'");

if (fixed > 0) {
    fs.writeFileSync('routes/pages.js', pages);
    fs.writeFileSync('routes/home.js', home);
    console.log('\nUpdated both route files.');
}

// Final verify
const allText = fs.readFileSync('routes/pages.js', 'utf8') + fs.readFileSync('routes/home.js', 'utf8');
const titles = allText.match(/title:\s*'([^']*)'/g) || [];
let over = 0;
titles.forEach(t => {
    const title = t.replace(/title:\s*'/, '').replace(/'$/, '');
    if (title.length > 55) {
        console.log('STILL OVER (' + title.length + 'c): ' + title.substring(0, 85));
        over++;
    }
});
console.log('\nRoutes over 55c: ' + over + ' of ' + titles.length);
if (over === 0) console.log('✓ ALL ROUTE TITLES ≤55 CHARS');
