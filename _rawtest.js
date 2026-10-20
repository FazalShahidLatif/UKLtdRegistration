require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const axios = require('axios');
(async () => {
  const token = process.env.SAFEPAY_API_TOKEN;
  const key = process.env.SAFEPAY_MERCHANT_API_KEY;
  const host = process.env.SAFEPAY_SANDBOX_HOST || 'https://sandbox.api.getsafepay.com';
  const url = `${host}/payments/session/setup`;
  try {
    const res = await axios.post(url, {
      merchant_api_key: key,
      intent: 'CYBERSOURCE',
      mode: 'payment',
      currency: 'GBP',
      amount: 18999,
      purchase: {
        reference: 'test-' + Date.now(),
        order_id: 'test-' + Date.now(),
        package_name: 'Test Package',
        customer_name: 'Test',
        customer_email: 't@example.com',
        customer_phone: '',
        currency: 'GBP',
        amount: 18999,
        purchase_totals: { package: 18999, tax: 0, shipping: 0, discount: 0, total: 18999 },
        shipping_address: { line1: '', town_city: '', county: '', country: 'GB' },
        billing_address: { line1: '', town_city: '', county: '', country: 'GB' },
        scheduled_date: new Date().toISOString().slice(0, 10),
        custom_text: 'Test',
      }
    }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    console.log('RAW RESPONSE:');
    console.log(JSON.stringify(res.data, null, 2).slice(0, 1200));
  } catch (e) {
    console.log('ERROR:', e.message);
    if (e.response) console.log('status:', e.response.status, 'body:', JSON.stringify(e.response.data).slice(0, 600));
  }
})();
