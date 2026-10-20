require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const sdkToken = process.env.SAFEPAY_API_TOKEN;
const sdkKey = process.env.SAFEPAY_MERCHANT_API_KEY;
const safepay = sdk(sdkToken, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
(async () => {
  try {
    const p = await safepay.payments.session.setup({
      merchant_api_key: sdkKey, intent: 'CYBERSOURCE', mode: 'payment', currency: 'GBP', amount: 18999
    });
    console.log('SDK SUCCESS -> tracker:', p.data?.tracker?.token ? p.data.tracker.token.slice(0,12)+'...' : 'NO TOKEN');
    console.log('tracker state:', p.data?.tracker?.state, '| checkoutUrl:', p.data?.tracker?.checkout_url || p.data?.data?.checkout_url || 'none');
    console.log('raw:', JSON.stringify(p.data).slice(0, 400));
  } catch (e) {
    console.log('SDK FAILED:', e.message);
    if (e.response) console.log('status:', e.response.status, 'body:', JSON.stringify(e.response.data).slice(0,300));
  }
})();
