require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const s = sdk(process.env.SAFEPAY_API_TOKEN, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
const all = [];
(function walk(prefix, obj) {
  for (const k of Object.keys(obj || {})) {
    if (k === 'auth' || k === 'checkout' || k === 'client' || k === 'guest' || k === 'invoice' || k === 'order' || k === 'payments') {
      all.push(prefix ? prefix + '.' + k : k);
      walk(prefix ? prefix + '.' + k : k, obj[k]);
    } else if (typeof obj[k] === 'function' || (obj[k] && obj[k].basePath)) {
      all.push(prefix ? prefix + '.' + k : k);
    }
  }
})(null, s);
console.log('=== SDK resource paths ===');
console.log(all.filter(a => !a.startsWith('_')))
  .sort()
  .map(p => p.replace(/^s\./, 's.'))
  .join(', '));
console.log('\n=== Instance check: s.payments.session.setup type ===');
console.log(typeof s.payments.session.setup);
console.log('s.payments.session keys:', Object.keys(s.payments.session).join(', '));
console.log('s.payments.session.setup.length:', s.payments.session.setup.length);
console.log('s.payments.session.setup.toString():', s.payments.session.setup.toString().slice(0, 200));
