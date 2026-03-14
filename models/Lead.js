const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    dateOfCreation: Date,
    incorporationDate: Date,
    accountsDueDate: Date,
    accountsOverdue: {
        type: Boolean,
        default: false
    },
    confirmationStatementDueDate: Date,
    confirmationStatementOverdue: {
        type: Boolean,
        default: false
    },
    opportunityType: {
        type: [String], // ['Late Filing', 'New Incorporation', 'Tax Due']
        default: []
    },
    opportunityScore: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    capturedAt: {
        type: Date,
        default: Date.now
    },
    contactEmail: String,
    sicCodes: [String],
    source: {
        type: String,
        default: 'Companies House'
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
