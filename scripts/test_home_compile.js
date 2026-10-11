
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

try {
    const content = fs.readFileSync('C:/Gitub-Projects/UKLtdRegistration/views/pages/home.ejs', 'utf8');
    ejs.compile(content);
    console.log('home.ejs compiles OK');
} catch (e) {
    console.error('COMPILE ERROR: ' + e.message);
}
