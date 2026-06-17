const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../public/images');
const formats = ['webp', 'avif'];
const sizes = [400, 800, 1200];

async function optimizeImages() {
    console.log('🚀 Starting Image Optimization...');
    
    if (!fs.existsSync(directory)) {
        console.error(`Error: Directory ${directory} not found`);
        return;
    }

    const files = fs.readdirSync(directory);
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));

    for (const file of imageFiles) {
        const inputPath = path.join(directory, file);
        const name = path.parse(file).name;

        console.log(`\nProcessing: ${file}`);

        for (const format of formats) {
            // 1. Generate standard version
            const outputPath = path.join(directory, `${name}.${format}`);
            await sharp(inputPath)
                .toFormat(format, { quality: 80 })
                .toFile(outputPath);
            console.log(`  ✓ Created: ${name}.${format}`);

            // 2. Generate responsive sizes
            for (const size of sizes) {
                const sizePath = path.join(directory, `${name}-${size}.${format}`);
                await sharp(inputPath)
                    .resize(size)
                    .toFormat(format, { quality: 75 })
                    .toFile(sizePath);
                console.log(`  ✓ Created: ${name}-${size}.${format}`);
            }
        }
    }

    console.log('\n✅ Image Optimization Complete!');
}

optimizeImages().catch(err => {
    console.error('❌ Optimization failed:', err);
});
