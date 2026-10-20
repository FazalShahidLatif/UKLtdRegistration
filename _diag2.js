require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const axios = require('axios');
(async () => {
  const token = process.env.SAFEPAY_API_TOKEN; // NEW key
  const body = {
    merchant_api_key: 'sec_dfb7286d-67a4-4ee5-85c6-963d141ab23a',
    intent: 'CYBERSOURCE', mode: 'payment', currency: 'GBP', amount: 18999,
    purchase: { reference: 'diag', order_id: 'diag', package_name: 'Test', customer_name: 'Test', customer_email: 't@example.com', customer_phone: '', currency: 'GBP', amount: 18999, purchase_totals: { package: 18999, tax: 0, shipping: 0, discount: 0, total: 18999 }, shipping_address: { line1: '', town_city: '', county: '', country: 'GB' }, billing_address: { line1: '', town_city: '', county: '', country: 'GB' }, scheduled_date: '2026-10-20', custom_text: 'diag' }
  };
  try {
    const res = await axios.post('https://sandbox.api.getsafepay.com/payments/session/setup', body, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    console.log('=== HTTP 200, header content-type:', res.headers['content-type']);
    console.log('RAW:', JSON.stringify(res.data).slice(0, 500));
  } catch (e) {
    console.log('=== HTTP ERROR ===');
    console.log('status:', e.response?.status);
    console.log('headers:', JSON.stringify(e.response?.headers).slice(0, 200));
    console.log('body:', e.response?.data ? (typeof e.response.data === 'string' ? e.response.data.slice(0, 400) : JSON.stringify(e.response.data).slice(0, 300)) : e.message);
  }
})();
