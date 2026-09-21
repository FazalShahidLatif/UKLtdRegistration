const fs = require('fs');
const data = JSON.parse(fs.readFileSync('content/blog/blog-articles.json', 'utf8'));
const articles = data.articles;

console.log('=== BEFORE ===');
console.log('Total entries:', articles.length);
const idCount = {};
articles.forEach(a => { idCount[a.id] = (idCount[a.id] || 0) + 1; });
const dupIds = Object.entries(idCount).filter(([id,c]) => c > 1).map(([id]) => Number(id));
console.log('Duplicate IDs:', dupIds);
dupIds.forEach(id => {
    console.log('  ID', id, ':', articles.filter(a => a.id === id).map(a => a.slug).join(', '));
});

// Fix: ensure unique sequential IDs 1..N
// Strategy: sort by slug alphabetically within same ID groups, keep first, reassign others
const slugGroups = {};
articles.forEach(a => {
    if (!slugGroups[a.id]) slugGroups[a.id] = [];
    slugGroups[a.id].push(a);
});

const fixed = [];
const usedIds = new Set();
let nextId = 1;

// Sort IDs ascending
const allIds = Object.keys(slugGroups).map(Number).sort((a,b) => a-b);
for (const id of allIds) {
    const group = slugGroups[id];
    // Sort group by slug alphabetically for determinism
    group.sort((a,b) => a.slug.localeCompare(b.slug));
    group.forEach(a => {
        while (usedIds.has(nextId)) nextId++;
        a.id = nextId;
        usedIds.add(nextId);
        fixed.push(a);
        nextId++;
    });
}

fixed.sort((a,b) => a.id - b.id);
console.log('');
console.log('=== AFTER ===');
console.log('Total entries:', fixed.length);
const newIdCount = {};
fixed.forEach(a => { newIdCount[a.id] = (newIdCount[a.id] || 0) + 1; });
const newDupIds = Object.entries(newIdCount).filter(([id,c]) => c > 1).map(([id]) => Number(id));
console.log('Duplicate IDs:', newDupIds.length > 0 ? newDupIds : 'None');
console.log('Max ID:', Math.max(...fixed.map(a => a.id)));
console.log('');
console.log('Articles ID 109-116:');
for (let i = 109; i <= 116; i++) {
    const found = fixed.find(a => a.id === i);
    console.log('  ID ' + i + ':', found ? found.slug : 'MISSING');
}

fs.writeFileSync('content/blog/blog-articles.json', JSON.stringify({articles: fixed}, null, 2));
console.log('');
console.log('JSON saved with', fixed.length, 'unique articles.');
