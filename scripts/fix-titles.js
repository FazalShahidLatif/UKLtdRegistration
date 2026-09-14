const fs = require('fs');
const path = 'c:/Gitub-Projects/UKLtdRegistration/routes/pages.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/title:\s*'([^']+)'/g, (match, p1) => {
    if (p1.length > 60) {
        let parts = p1.split('|');
        let newTitle = parts[0].trim();
        if (newTitle.length > 60) {
            newTitle = newTitle.substring(0, 57) + '...';
        }
        return `title: '${newTitle}'`;
    }
    return match;
});

fs.writeFileSync(path, content);
console.log('Fixed pages.js titles');
