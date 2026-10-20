require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const s = sdk(process.env.SAFEPAY_API_TOKEN, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
(async () => {
  // 1. create session
  const session = await s.payments.session.setup({
    merchant_api_key: process.env.SAFEPAY_MERCHANT_API_KEY,
    intent: 'CYBERSOURCE', mode: 'payment', currency: 'GBP', amount: 18999,
    purchase: { reference: 'flow2', order_id: 'flow2', package_name: 'Starter', customer_name: 'Test', customer_email: 't@example.com', customer_phone: '', currency: 'GBP', amount: 18999, purchase_totals: { package: 18999, tax: 0, shipping: 0, discount: 0, total: 18999 }, shipping_address: { line1: '', town_city: '', county: '', country: 'GB' }, billing_address: { line1: '', town_city: '', county: '', country: 'GB' }, scheduled_date: '2026-10-20', custom_text: 'verify test' }
  });
  const trackerToken = session.data?.tracker?.token;
  console.log('tracker token:', trackerToken);

  // 2. verify tracker: s.order.tracker.action(trackerToken)
  console.log('=== verifying tracker ===');
  try {
    const v = await s.order.tracker.action(trackerToken);
    console.log('VERIFY SUCCESS');
    console.log('response keys:', Object.keys(v || {}).join(', '));
    // Safepay API response
    const body = v.data || v;
    console.log('tracker state:', body?.tracker?.state || body?.state || 'unknown');
    console.log('captured:', body?.tracker?.payment_completed || body?.payment_completed || 'unknown');
  } catch (e) {
    console.log('VERIFY FAILED:', e.message);
    if (e.response) {
      console.log('status:', e.response.status);
      console.log('body:', JSON.stringify(e.response.data).slice(0, 500));
    }
  }
  // 3. also print the available s.order methods
  console.log('=== s.order methods ===');
  console.log('s.order.tracker:', s.order?.tracker ? 'exists' : 'MISSING');
  console.log('s.payments keys:', Object.keys(s.payments).join(', '));
})();
