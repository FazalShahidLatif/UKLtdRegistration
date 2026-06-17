const axios = require('axios');
const Lead = require('../models/Lead');

class LeadGenService {
    constructor() {
        this.apiKey = process.env.COMPANIES_HOUSE_API_KEY;
        this.baseUrl = 'https://api.company-information.service.gov.uk';
        this.auth = Buffer.from(this.apiKey + ':').toString('base64');
    }

    async fetchNewLeads(options = {}) {
        try {
            const { 
                from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
                to = new Date().toISOString().split('T')[0]
            } = options;

            const response = await axios.get(`${this.baseUrl}/advanced-search/companies`, {
                params: {
                    incorporated_from: from,
                    incorporated_to: to,
                    company_status: 'active',
                    size: 50
                },
                headers: {
                    'Authorization': `Basic ${this.auth}`
                }
            });

            const items = response.data.items || [];
            const results = {
                processed: 0,
                new: 0,
                errors: 0
            };

            for (const item of items) {
                try {
                    const profile = await this.getCompanyProfile(item.company_number);
                    const leadData = this.mapProfileToLead(profile);
                    
                    const existingLead = await Lead.findOneAndUpdate(
                        { companyNumber: leadData.companyNumber },
                        leadData,
                        { upsert: true, new: true }
                    );

                    results.processed++;
                    if (existingLead.createdAt === existingLead.updatedAt) {
                        results.new++;
                    }
                } catch (err) {
                    console.error(`Error processing company ${item.company_number}:`, err.message);
                    results.errors++;
                }
            }

            return results;
        } catch (error) {
            console.error('LeadGenService fetchNewLeads error:', error.message);
            throw error;
        }
    }

    async getCompanyProfile(companyNumber) {
        const response = await axios.get(`${this.baseUrl}/company/${companyNumber}`, {
            headers: {
                'Authorization': `Basic ${this.auth}`
            }
        });
        return response.data;
    }

    mapProfileToLead(profile) {
        const opportunities = [];
        let score = 0;

        if (profile.accounts?.overdue) {
            opportunities.push('Late Filing (Accounts)');
            score += 50;
        }
        if (profile.confirmation_statement?.overdue) {
            opportunities.push('Late Filing (Confirmation Statement)');
            score += 30;
        }

        const creationDate = new Date(profile.date_of_creation);
        const isNew = (Date.now() - creationDate.getTime()) < (30 * 24 * 60 * 60 * 1000); // Created in last 30 days
        if (isNew) {
            opportunities.push('New Incorporation');
            score += 20;
        }

        return {
            companyName: profile.company_name,
            companyNumber: profile.company_number,
            status: profile.company_status,
            dateOfCreation: profile.date_of_creation,
            incorporationDate: profile.date_of_creation,
            accountsDueDate: profile.accounts?.next_accounts?.due_on,
            accountsOverdue: profile.accounts?.overdue || false,
            confirmationStatementDueDate: profile.confirmation_statement?.next_due,
            confirmationStatementOverdue: profile.confirmation_statement?.overdue || false,
            opportunityType: opportunities,
            opportunityScore: score,
            sicCodes: profile.sic_codes || [],
            lastUpdated: new Date()
        };
    }
}

module.exports = new LeadGenService();
