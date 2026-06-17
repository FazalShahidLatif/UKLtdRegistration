const { google } = require('googleapis');
const fs = require('fs');
const https = require('https');

// Path to your Google Service Account key file
const KEY_PATH = './credentials.json';

// Ensure credentials exist
if (!fs.existsSync(KEY_PATH)) {
    console.error('❌ Error: credentials.json not found in the root directory.');
    console.error('Please create a Google Cloud Service Account, download the JSON key, and save it as credentials.json.');
    console.error('Also, remember to add the service account email as an Owner in your Google Search Console property.');
    process.exit(1);
}

// Initialize the Google Auth client
const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({
    version: 'v3',
    auth: auth,
});

async function fetchSitemapUrls() {
    return new Promise((resolve, reject) => {
        // Fetch the priority sitemap from production
        const sitemapUrl = 'https://ukltdregistration.com/priority-sitemap.xml';
        
        console.log(`📡 Fetching sitemap from: ${sitemapUrl}`);
        
        https.get(sitemapUrl, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                // Extremely simple XML parsing for <loc> tags
                const urls = [];
                const regex = /<loc>(.*?)<\/loc>/g;
                let match;
                
                while ((match = regex.exec(data)) !== null) {
                    urls.push(match[1]);
                }
                
                resolve(urls);
            });
            
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function requestIndexing() {
    try {
        console.log('🔄 Authenticating with Google Indexing API...');
        const client = await auth.getClient();
        
        const urls = await fetchSitemapUrls();
        
        if (urls.length === 0) {
            console.log('⚠️ No URLs found in the sitemap.');
            return;
        }

        console.log(`✅ Found ${urls.length} priority URLs. Submitting to Google Indexing API...`);

        // We should send requests in small batches or with slight delays to avoid rate limits,
        // but for < 100 priority URLs, sequential requests are fine.
        let successCount = 0;
        let errorCount = 0;

        for (const url of urls) {
            try {
                const response = await indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED',
                    },
                });
                
                console.log(`✅ Indexed: ${url}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed: ${url}`);
                console.error(`   Reason: ${error.message}`);
                errorCount++;
            }
            
            // Add a small 200ms delay between requests to be safe
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log('\n=============================================');
        console.log(`🎉 Indexing API Submission Complete!`);
        console.log(`✅ Successfully submitted: ${successCount}`);
        if (errorCount > 0) console.log(`❌ Failed submissions: ${errorCount}`);
        console.log('=============================================');

    } catch (error) {
        console.error('❌ Critical Error during indexing process:', error);
    }
}

// Run the script
requestIndexing();
