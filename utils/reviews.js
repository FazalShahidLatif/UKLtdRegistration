/**
 * reviews.js — single source of truth for every rating shown on the site.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site previously hardcoded rating claims in templates: "4.9/5 from 128
 * verified reviews" on one page, "312 verified readers" on another, and
 * aggregateRating schema asserting a 4.9/128 average with no reviews on the
 * page to back it. Schema.org aggregateRating is a claim to Google that real
 * customer reviews exist. Emitting it unsupported is fabricated structured data
 * and risks a manual action on the domain.
 *
 * THE RULE ENFORCED HERE
 * ----------------------
 * No rating is displayed and no AggregateRating is emitted unless it is computed
 * from data/reviews.json, and only from entries that are real, moderated and
 * marked published. With zero published reviews this module returns null, the
 * templates render nothing, and the schema is omitted entirely.
 *
 * The count can never drift from the average because both are derived from the
 * same array on every request.
 */

const fs = require('fs');
const path = require('path');

const REVIEWS_PATH = path.join(__dirname, '../data/reviews.json');

function loadReviews() {
    try {
        if (!fs.existsSync(REVIEWS_PATH)) return [];
        const raw = JSON.parse(fs.readFileSync(REVIEWS_PATH, 'utf8'));
        if (!Array.isArray(raw.reviews)) return [];
        return raw.reviews.filter(function (r) {
            return r && r.published === true &&
                typeof r.rating === 'number' &&
                r.rating >= 1 && r.rating <= 5 &&
                typeof r.body === 'string' && r.body.trim().length > 0 &&
                typeof r.name === 'string' && r.name.trim().length > 0;
        });
    } catch (e) {
        console.error('reviews.js: could not read reviews.json —', e.message);
        return [];
    }
}

/**
 * Returns the aggregate, or null when there is nothing genuine to show.
 * @returns {{ratingValue:string, reviewCount:number, bestRating:string, worstRating:string, verifiedCount:number}|null}
 */
function getAggregateRating() {
    const reviews = loadReviews();
    if (reviews.length === 0) return null;

    const sum = reviews.reduce(function (acc, r) { return acc + r.rating; }, 0);
    const avg = sum / reviews.length;
    // Round to one decimal, matching how the figure is displayed.
    const ratingValue = (Math.round(avg * 10) / 10).toFixed(1);

    return {
        ratingValue: ratingValue,
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
        verifiedCount: reviews.filter(function (r) { return r.verified === true; }).length
    };
}

/**
 * Short label for UI use, e.g. "4.9 out of 5 from 128 customer reviews".
 * Returns null when nothing genuine is available.
 */
function getRatingLabel(options) {
    const opts = options || {};
    const agg = getAggregateRating();
    if (!agg) return null;

    const subject = opts.subject || 'customer reviews';
    if (agg.verifiedCount === agg.reviewCount) {
        return agg.ratingValue + ' out of 5 from ' + agg.reviewCount + ' ' + subject;
    }
    return agg.ratingValue + ' out of 5 from ' + agg.reviewCount + ' ' + subject +
        ' (' + agg.verifiedCount + ' verified)';
}

/**
 * Reviews for display, newest first.
 */
function getPublishedReviews(limit) {
    const reviews = loadReviews().slice().sort(function (a, b) {
        return new Date(b.date || 0) - new Date(a.date || 0);
    });
    return limit ? reviews.slice(0, limit) : reviews;
}

/**
 * AggregateRating JSON-LD object, or null. Return null deliberately — callers
 * must omit the property rather than emit an empty or placeholder value.
 */
function getAggregateRatingSchema() {
    const agg = getAggregateRating();
    if (!agg) return null;
    return {
        '@type': 'AggregateRating',
        ratingValue: agg.ratingValue,
        reviewCount: agg.reviewCount,
        bestRating: agg.bestRating,
        worstRating: agg.worstRating
    };
}

module.exports = {
    getAggregateRating,
    getAggregateRatingSchema,
    getRatingLabel,
    getPublishedReviews,
    loadReviews
};
