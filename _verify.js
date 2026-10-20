require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const s = sdk(process.env.SAFEPAY_API_TOKEN, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });

(async () => {
  // 1. create session
  const session = await s.payments.session.setup({
    merchant_api_key: process.env.SAFEPAY_MERCHANT_API_KEY,
    intent: 'CYBERSOURCE', mode: 'payment', currency: 'GBP', amount: 18999,
    purchase: { reference: 'verify-test', order_id: 'verify-test', package_name: 'Starter', customer_name: 'Test', customer_email: 't@example.com', customer_phone: '', currency: 'GBP', amount: 18999, purchase_totals: { package: 18999, tax: 0, shipping: 0, discount: 0, total: 18999 }, shipping_address: { line1: '', town_city: '', county: '', country: 'GB' }, billing_address: { line1: '', town_city: '', county: '', country: 'GB' }, scheduled_date: '2026-10-20', custom_text: 'verify test' }
  });
  const trackerToken = session.data?.tracker?.token;
  console.log('tracker token:', trackerToken);

  // 2. inspect s.order structure
  const orderKeys = Object.keys(s.order || {}).join(', ');
  const trackerRes = s.order?.tracker;
  console.log('=== s.order keys ===', Object.keys(s.order || {}).join(', '));
  console.log('=== s.order.tracker ===', trackerRes ? 'exists, keys: ' + Object.keys(trackerRes).join(', ') : 'MISSING');

  // 3. try to verify tracker via order.tracker.action
  if (trackerToken) {
    try {
      const v = await s.order.tracker.action({ tracker: trackerToken });
      console.log('=== VERIFY SUCCESS ===');
      console.log('response keys:', Object.keys(v || {}).join(', '));
      console.log('data:', JSON.stringify(v?.data || v).slice(0, 600));
    } catch (e) {
      console.log('=== VERIFY FAILED ===');
      console.log('error:', e.message);
      if (e.response) {
        console.log('status:', e.response.status);
        console.log('body:', JSON.stringify(e.response.data).slice(0, 400));
      }
    }
  }
})();
