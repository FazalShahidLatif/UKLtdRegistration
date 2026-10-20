require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const s = sdk(process.env.SAFEPAY_API_TOKEN, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
(async () => {
  // 1. create checkout session
  console.log('=== STEP 1: create checkout session ===');
  const session = await s.payments.session.setup({
    merchant_api_key: process.env.SAFEPAY_MERCHANT_API_KEY,
    intent: 'CYBERSOURCE', mode: 'payment', currency: 'GBP', amount: 18999,
    purchase: { reference: 'flow-test-1', order_id: 'flow-test-1', package_name: 'Standard', customer_name: 'Test', customer_email: 't@example.com', customer_phone: '', currency: 'GBP', amount: 18999, purchase_totals: { package: 18999, tax: 0, shipping: 0, discount: 0, total: 18999 }, shipping_address: { line1: '', town_city: '', county: '', country: 'GB' }, billing_address: { line1: '', town_city: '', county: '', country: 'GB' }, scheduled_date: '2026-10-20', custom_text: 'flow test' }
  });
  console.log('session created. keys:', Object.keys(session || {}).join(', '));
  const tracker = session.data?.tracker || {};
  console.log('tracker.token:', tracker.token);
  const trackerId = tracker.id;
  const checkoutUrl = tracker.checkout_url || tracker.url || null;
  console.log('checkout_url:', checkoutUrl);

  // 2. verify tracker (sdk.payments.order.tracker.action)
  console.log('\n=== STEP 2: verify tracker ===');
  if (trackerId) {
    // The SDK exposes order.tracker as a resource; try an action (POST)
    try {
      const TrackerRes = s.payments.order?.tracker;
      if (TrackerRes && TrackerRes.action && typeof TrackerRes.action === 'function') {
        const v = await TrackerRes.action({ tracker: trackerId });
        console.log('tracker verified via action. keys:', Object.keys(v || {}).join(', '));
        console.log('data:', JSON.stringify(v?.data || v).slice(0, 400));
      } else {
        console.log('tracker action not callable; keys:', Object.keys(s.payments.order?.tracker || {}));
      }
    } catch (e) {
      console.log('action error:', e.message);
      if (e.response) console.log('status:', e.response.status, 'body:', JSON.stringify(e.response.data).slice(0, 400));
    }
  }
  // fallback: use the checkout/session resource directly to see what's available
  console.log('\n=== STEP 3: available session methods ===');
  console.log('session.keys:', Object.keys(s.payments.session).join(', '));
  console.log('session.setup type:', typeof s.payments.session.setup);
})();
