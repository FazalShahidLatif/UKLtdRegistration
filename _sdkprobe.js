require('dotenv').config({ path: 'C:/Gitub-Projects/UKLtdRegistration/.env' });
const sdk = require('@sfpy/node-core');
const s = sdk(process.env.SAFEPAY_API_TOKEN, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
// inspect the SDK's exposed keys
const keys = Object.keys(s).sort();
console.log('top-level keys:', keys.join(', '));
// check payments
if (s.payments) {
  const pk = Object.keys(s.payments).sort();
  console.log('payments keys:', pk.join(', '));
  for (const k of pk) { if (typeof s.payments[k] === 'object' && s.payments[k]) { console.log('  payments.' + k + ' ->', Object.keys(s.payments[k]).join(', ')); } }
}
