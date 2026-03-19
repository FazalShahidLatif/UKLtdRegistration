const fs = require('fs');
const file = 'views/pages/pricing.ejs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Â£/g, '&pound;');
content = content.replace(/â€”/g, '&mdash;');
fs.writeFileSync(file, content);
console.log('Fixed pricing.ejs');
