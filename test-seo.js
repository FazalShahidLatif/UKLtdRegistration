const seoOptimizer = require('./utils/seo-optimizer');

async function test() {
    console.log('Testing SEO Optimizer...');
    const tasks = await seoOptimizer.runAnalysis();
    console.log('Tasks generated:', JSON.stringify(tasks, null, 2));
}

test();
