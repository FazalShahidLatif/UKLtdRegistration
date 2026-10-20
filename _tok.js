require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const axios = require('axios');
(async () => {
  const tok = process.env.SAFEPAY_API_TOKEN;     // 2700b499... (secret key)
  const mkey = process.env.SAFEPAY_MERCHANT_API_KEY; // sec_dfb7286d... (merchant key)
  const TRACKER = 'track_9bce402b-dde1-4283-b737-b58480b53751'; // from earlier test
  console.log('testing tracker:', TRACKER.slice(0,12)+'...');
  // Test 1: x-sfpy-merchant-secret = merchant_api_key (sec_ UUID)
  try {
    const r1 = await axios.post('https://sandbox.api.getsafepay.com/order/payments/v3/'+TRACKER, {},
      { headers: { 'x-sfpy-merchant-secret': mkey, 'Content-Type': 'application/json' } });
    console.log('[TEST 1] header=x-sfpy-merchant-secret=merchant_key ->', JSON.stringify(r1.status, null, 0), JSON.stringify((r1.data||{}).tracker||{}).slice(0,120));
  } catch(e) { console.log('[TEST 1] ERR:', JSON.stringify(e.response?.data).slice(0,200)); }

  // Test 2: x-sfpy-merchant-secret = secret token (2700b499...)
  try {
    const r2 = await axios.post('https://sandbox.api.getsafepay.com/order/payments/v3/'+TRACKER, {},
      { headers: { 'x-sfpy-merchant-secret': tok, 'Content-Type': 'application/json' } });
    console.log('[TEST 2] header=x-sfpy-merchant-secret=secretToken ->', JSON.stringify(r2.data).slice(0,200));
  } catch(e) { console.log('[TEST 2] ERR:', JSON.stringify(e.response?.data).slice(0,200)); }
})();
