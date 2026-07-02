const cron = require('node-cron');
const seoOptimizer = require('../utils/seo-optimizer');

/**
 * SEO Scheduler
 * Runs daily at 2:00 AM
 */
function initSEOScheduler() {
    try {
        console.log('[SEO Scheduler] Initializing...');

        // Run once on startup to have initial data (non-blocking)
        Promise.resolve()
            .then(() => seoOptimizer.runAnalysis())
            .catch(err => {
                console.error('[SEO Scheduler] Initial run failed:', err.message);
                // Don't crash - just log the error
            });

        // Schedule: Daily at 2:00 AM
        // Seconds Minutes Hours DayOfMonth Month DayOfWeek
        cron.schedule('0 2 * * *', async () => {
            console.log('[SEO Scheduler] Running daily SEO analysis...');
            try {
                await seoOptimizer.runAnalysis();
            } catch (err) {
                console.error('[SEO Scheduler] Daily run failed:', err.message);
            }
        });

        console.log('[SEO Scheduler] Scheduled to run every 24 hours at 2:00 AM');
    } catch (err) {
        console.error('[SEO Scheduler] Failed to initialize:', err.message);
        // Don't throw - just log
    }
}

module.exports = { initSEOScheduler };
