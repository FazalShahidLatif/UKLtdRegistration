const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * SEO Optimizer Service
 * Analyzes GSC data and generates prioritized tasks
 */
class SEOOptimizer {
    constructor() {
        this.tasksPath = path.join(__dirname, '../content/seo-tasks.json');
        this.credentialsPath = process.env.GSC_CREDENTIALS_PATH;
        this.siteUrl = process.env.SITE_URL || 'https://ukltdregistration.com';
    }

    /**
     * Main analysis funnel
     */
    async runAnalysis() {
        console.log('[SEO Optimizer] Starting daily analysis...');
        
        let gscData = [];
        if (this.credentialsPath && fs.existsSync(this.credentialsPath)) {
            gscData = await this.fetchGSCData();
        } else {
            console.log('[SEO Optimizer] No GSC credentials found. Using mock data for demo.');
            gscData = this.getMockGSCData();
        }

        const opportunities = this.analyzeOpportunities(gscData);
        const tasks = this.generateTasks(opportunities);
        
        this.saveTasks(tasks);
        console.log(`[SEO Optimizer] Analysis complete. Generated ${tasks.length} tasks.`);
        return tasks;
    }

    /**
     * Fetch data from Google Search Console API
     */
    async fetchGSCData() {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: this.credentialsPath,
                scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
            });

            const searchconsole = google.searchconsole({ version: 'v1', auth });
            
            // Fetch last 30 days
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            const endDate = new Date();
            
            const response = await searchconsole.searchanalytics.query({
                siteUrl: this.siteUrl,
                requestBody: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    dimensions: ['query', 'page'],
                    rowLimit: 1000
                },
            });

            return response.data.rows || [];
        } catch (error) {
            console.error('[SEO Optimizer] Error fetching GSC data:', error);
            return [];
        }
    }

    /**
     * Identify opportunities based on user criteria:
     * 1. High impressions + low CTR
     * 2. Keywords ranking 8–20
     */
    analyzeOpportunities(data) {
        return data.map(row => {
            const query = row.keys[0];
            const page = row.keys[1];
            const { impressions, ctr, position } = row;
            
            let opportunityType = null;
            let priority = 0;

            // Criteria 1: High impressions (>1000) and Low CTR (<2%)
            if (impressions > 1000 && ctr < 0.02) {
                opportunityType = 'Low CTR';
                priority = 2; // High priority
            }
            
            // Criteria 2: Keywords ranking 8–20 (Striking distance)
            if (position >= 8 && position <= 20) {
                opportunityType = opportunityType ? 'Mixed' : 'Striking Distance';
                priority = Math.max(priority, 1); // Medium priority
            }

            if (opportunityType) {
                return { query, page, impressions, ctr: (ctr * 100).toFixed(2) + '%', position: position.toFixed(1), type: opportunityType, priority };
            }
            return null;
        }).filter(Boolean).sort((a, b) => b.priority - a.priority || b.impressions - a.impressions);
    }

    /**
     * Recommend actions based on opportunity type
     */
    generateTasks(opportunities) {
        return opportunities.map(opp => {
            let recommendation = '';
            let actionItem = '';

            if (opp.type === 'Low CTR' || opp.type === 'Mixed') {
                recommendation = 'Rewrite title tag and meta description to improve click-through rate.';
                actionItem = `Optimize Metadata for "${opp.query}"`;
            } else if (opp.type === 'Striking Distance') {
                recommendation = 'Add internal links from high-authority pages and expand content to push for page 1.';
                actionItem = `Boost Ranking for "${opp.query}"`;
            }

            return {
                id: Buffer.from(opp.query + opp.page).toString('base64').slice(0, 10),
                task: actionItem,
                details: recommendation,
                impact: opp.type,
                metrics: `Pos: ${opp.position} | Imps: ${opp.impressions} | CTR: ${opp.ctr}`,
                page: opp.page,
                query: opp.query,
                priority: opp.priority === 2 ? 'High' : 'Medium',
                status: 'Pending',
                createdAt: new Date().toISOString()
            };
        });
    }

    saveTasks(tasks) {
        try {
            const dir = path.dirname(this.tasksPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            
            // Merge with existing tasks if needed, or just overwrite for the daily "fresh" look
            // For this implementation, we'll overwrite to show the latest snapshot
            fs.writeFileSync(this.tasksPath, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.error('[SEO Optimizer] Error saving tasks:', error);
        }
    }

    getMockGSCData() {
        return [
            { keys: ['register uk company from usa', '/us-citizens'], impressions: 5400, ctr: 0.012, position: 12.5 },
            { keys: ['cheapest company formation uk', '/pricing'], impressions: 8200, ctr: 0.008, position: 15.2 },
            { keys: ['uk company registration for non residents', '/us-citizens'], impressions: 3100, ctr: 0.018, position: 9.1 },
            { keys: ['ltd company formation london', '/services/virtual-office'], impressions: 1200, ctr: 0.045, position: 8.5 },
            { keys: ['how to register a company in uk', '/blog'], impressions: 15000, ctr: 0.005, position: 19.8 }
        ];
    }
}

module.exports = new SEOOptimizer();
