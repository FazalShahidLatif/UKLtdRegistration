const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true
    },
    planId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String, // 'active', 'past_due', 'paused', 'deleted'
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    nextBillDate: Date,
    cancellationDate: Date,
    updateUrl: String,
    cancelUrl: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
