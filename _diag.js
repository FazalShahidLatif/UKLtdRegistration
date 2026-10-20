require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const axios = require('axios');
const OLD = '4e39af671fcac015e786aa600cfd1673a6ceddeffc2cd21a87394e177f5696f1';
const NEW = '2700b4991fcac015e786aa600cfd1673a6ceddeffc2cd21a87394e177f5696f1';
(async () => {
  for (const [label, token] of [
    ['OLD  4e39af...', OLD],
    ['NEW  2700b499...', NEW],
  ].map(([l, s]) => [l, s])) {
    console.log('\n=== Testing ' + label + ' as auth token ===');
    try {
      const res = await axios.post('https://sandbox.api.getsafepay.com/payments/session/setup', {
        merchant_api_key: 'sec_dfb7286d-67a4-4ee5-85c6-963d141ab23a',
        intent: 'CYBERSOURCE', mode: 'payment', currency: 'PKR', amount: 150000,
        purchase: { reference: 'diag', order_id: 'diag', package_name: 'T', customer_name: 'T', customer_email: 't@example.com', customer_phone: '', currency: 'PKR', amount: 150000, purchase_totals: { package: 150000, tax: 0, shipping: 0, discount: 0, total: 150000 }, shipping_address: { line1: '', town_city: '', county: '', country: 'GB' }, billing_address: { line1: '', town_city: '', county: '', country: 'GB' }, scheduled_date: '2026-10-20', custom_text: 'diag' }
      }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
      const d = res.data;
      console.log('OK -> tracker:', d?.tracker?.token ? d.tracker.token.slice(0,12) : 'NO TOKEN', '| state:', d?.tracker?.state, '| checkoutUrl:', d?.tracker?.checkout_url || d?.data?.checkout_url || 'none');
    } catch (e) {
      const b = e.response?.data;
      console.log('ERR:', e.response?.status, '| body:', (typeof b === 'string' ? b.slice(0,200) : (b && JSON.stringify(b)).slice(0,200)));
    }
  }
})();
