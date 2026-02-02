// Simple build script - just validates JSON files
const fs = require('fs');
const path = require('path');

console.log('Validating JSON files...');

const dataDir = path.join(__dirname, 'data');
const files = ['config.json', 'home.json', 'publications.json', 'projects.json', 'blog.json'];

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        console.log(`✓ ${file} is valid JSON`);
    } catch (error) {
        console.error(`✗ ${file} has errors:`, error.message);
        process.exit(1);
    }
});

console.log('Build complete! All JSON files are valid.');

