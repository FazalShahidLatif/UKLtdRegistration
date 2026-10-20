require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const SafepayGateway = require('./payment/safepay');
const g = new SafepayGateway();
console.log('env:', g.environment, '| configured:', !!(g.apiKey && g.apiToken));
(async () => {
  try {
    const res = await g.createCheckoutSession({
      amount: 189.99,
      currency: 'GBP',
      packageName: 'Standard Plus UK LTD Formation Package',
      customerName: 'Test Founder',
      customerEmail: 'founder@example.com',
    });
    console.log('PAYMENT INTEGRATION WORKS');
    console.log('environment:', res.environment);
    console.log('trackerToken:', res.trackerToken ? res.trackerToken.slice(0, 12) + '...' : null);
    console.log('checkoutUrl:', res.checkoutUrl);
    console.log('purchaseReference:', res.purchaseReference);
  } catch (e) {
    console.log('FAILED:', e.message);
    if (e.details) console.log('details:', JSON.stringify(e.details).slice(0, 300));
  }
})();
