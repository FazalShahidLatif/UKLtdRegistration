/**
 * View Helpers
 * Collection of utility functions for EJS templates
 */

/**
 * Robust date display function
 * Fixes 'Invalid Date' issues and provides a consistent fallback
 */
exports.displayDate = (date) => {
    if (!date) return "March 2026";
    const d = new Date(date);
    return (!isNaN(d.getTime())) ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "March 2026";
};

/**
 * Helper to generate srcset for responsive images
 * Assumes optimized images exist at specific widths
 */
exports.getResponsiveSrcset = (imagePath) => {
    if (!imagePath) return '';
    const name = imagePath.split('.').slice(0, -1).join('.');
    return `${name}-400.webp 400w, ${name}-800.webp 800w, ${name}-1200.webp 1200w`;
};
