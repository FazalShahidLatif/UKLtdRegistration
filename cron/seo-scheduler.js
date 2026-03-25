const cron = require('node-cron');
const seoOptimizer = require('../utils/seo-optimizer');

/**
 * SEO Scheduler
 * Runs daily at 2:00 AM
 */
function initSEOScheduler() {
    console.log('[SEO Scheduler] Initializing...');

    // Run once on startup to have initial data
    seoOptimizer.runAnalysis().catch(err => {
        console.error('[SEO Scheduler] Initial run failed:', err);
    });

    // Schedule: Daily at 2:00 AM
    // Seconds Minutes Hours DayOfMonth Month DayOfWeek
    cron.schedule('0 2 * * *', async () => {
        console.log('[SEO Scheduler] Running daily SEO analysis...');
        await seoOptimizer.runAnalysis();
    });

    console.log('[SEO Scheduler] Scheduled to run every 24 hours at 2:00 AM');
}

module.exports = { initSEOScheduler };
