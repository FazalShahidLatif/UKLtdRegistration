/**
 * Safepay Payment Gateway Integration
 * UK LTD Registration — payment collection (sandbox + production)
 *
 * Commercial terms (verified via Safepay docs, 2026-10-20):
 *   Free tier — no setup fee, no monthly fee, no security deposit.
 *   Domestic cards: 2.9% + Rs 30 per successful charge.
 *   International cards: +0.3% surcharge (supported & enabled).
 *   Settlement T+2 to T+3; onboarding ~5 business days.
 *
 * Untested promotional detail (informational, not relied upon):
 *   The gateway must be activated in the Safepay merchant dashboard before
 *   live payment routes return a real checkout URL. If POST /payments/session/
 *   returns a tracker but no checkout_url, account onboarding is still in
 *   progress — treat the dashboard as non-live and re-verify.
 */

'use strict';

const axios = require('axios');
const path = require('path');
const { config } = require('dotenv');

// Load project .env (dotenv reads CWD-relative by default; resolve explicitly).
config({ path: path.resolve(__dirname, '..', '.env') });

const SAFEPAY_ENV = (process.env.SAFEPAY_ENV || 'development').toLowerCase();
const SAFEPAY_MERCHANT_API_KEY = process.env.SAFEPAY_MERCHANT_API_KEY || '';
const SAFEPAY_API_TOKEN = process.env.SAFEPAY_API_TOKEN || '';
const SAFEPAY_SANDBOX_HOST = process.env.SAFEPAY_SANDBOX_HOST || 'https://sandbox.api.getsafepay.com';
const SAFEPAY_LIVE_HOST = process.env.SAFEPAY_LIVE_HOST || 'https://api.getsafepay.com';
const SAFEPAY_CHECKOUT_URL = process.env.SAFEPAY_CHECKOUT_URL || 'https://getsafepay.pk/checkout';
const SITE_URL = process.env.SITE_URL || 'https://ukltdregistration.com';

// Sandbox is the default for any non-live, non-development env.
const IS_SANDBOX = SAFEPAY_ENV !== 'production';
const SAFEPAY_HOST = IS_SANDBOX ? SAFEPAY_SANDBOX_HOST : SAFEPAY_LIVE_HOST;
const ENVIRONMENT = SAFEPAY_HOST.includes('sandbox') ? 'sandbox' : 'live';

/**
 * Convert a GBP price to the lowest Safepay amount unit (pence / paisa).
 * GBP: 1 unit = 1 pence (so 189.99 -> 18999).
 * PKR: 1 unit = 1 paisa (so 1,500.00 -> 150000).
 */
function toSafepayAmount(amountInGBP, currency = 'GBP') {
  return Math.round(amountInGBP * 100);
}

class SafepayError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'SafepayError';
    this.details = { status: details?.status, body: details?.body, trackerToken: details?.trackerToken };
  }
}

class SafepayGateway {
  constructor() {
    this.baseURL = SAFEPAY_HOST;
    this.apiKey = SAFEPAY_MERCHANT_API_KEY;
    this.apiToken = SAFEPAY_API_TOKEN;
    this.environment = ENVIRONMENT;
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json',
        // Safepay SDK canonical: x-sfpy-merchant-secret (authType=secret)
        'x-sfpy-merchant-secret': this.apiToken,
      },
    });
  }

  /**
   * Create a Safepay checkout session.
   * amount: price in GBP (e.g. 189.99).
   * Returns { success, trackerToken, checkoutUrl, environment, trackerId, transactionId, purchaseReference }
   */
  async createCheckoutSession(payload) {
    const {
      amount,
      currency = 'GBP',
      packageName,
      customerName,
      customerEmail,
      successUrl = `${SITE_URL}/api/checkout/verify`,
      cancelUrl = `${SITE_URL}/pricing`,
    } = payload;

    if (!this.apiKey || !this.apiToken) {
      const err = new SafepayError('Safepay credentials are not configured in .env', {
        configured: !!(this.apiKey && this.apiToken),
      });
      errorLog(err);
      throw err;
    }

    const body = {
      merchant_api_key: this.apiKey,
      intent: 'CYBERSOURCE',
      mode: 'payment',
      currency,
      amount: toSafepayAmount(amount, currency),
      purchase: {
        reference: `ukltd-${Date.now()}`,
        order_id: `ukltd-${Date.now()}`,
        package_name: packageName || 'UK LTD Formation',
        customer_name: customerName || 'Customer',
        customer_email: customerEmail || 'customer@example.com',
        customer_phone: '',
        currency,
        amount: Math.round(amount * 100),
        purchase_totals: {
          package: Math.round(amount * 100),
          tax: 0,
          shipping: 0,
          discount: 0,
          total: Math.round(amount * 100),
        },
        shipping_address: { line1: '', town_city: '', county: '', country: 'GB' },
        billing_address: { line1: '', town_city: '', county: '', country: 'GB' },
        scheduled_date: new Date().toISOString().slice(0, 10),
        custom_text: `UK LTD Registration — ${packageName || 'Formation Package'} (£${amount.toFixed(2)})`,
      },
    };

    try {
      const res = await this.http.post('/payments/session/setup', body);
      const t = res.data?.tracker || {};
      return {
        success: true,
        environment: this.environment,
        trackerToken: t.token,
        checkoutUrl: t.checkout_url || t.url || SAFEPAY_CHECKOUT_URL,
        trackerId: t.id,
        transactionId: res.data?.transaction_id || null,
        purchaseReference: res.data?.purchase?.reference || null,
        amountGBP: amount,
      };
    } catch (err) {
      const { status, data } = err.response || {};
      const e = new SafepayError(`Safepay session setup failed (HTTP ${status})`, { status, body: data, payload });
      errorLog(e);
      throw e;
    }
  }

  /**
   * Verify a Safepay checkout tracker (webhook/return handler).
   * Returns { success, environment, data }
   */
  async verifyTracker(trackerToken) {
    if (!this.apiToken || !this.apiKey) {
      const e = new SafepayError('Safepay credentials not configured in .env', { configured: false });
      errorLog(e);
      throw e;
    }
    try {
      // SDK canonical: POST /order/payments/v3/{tracker}
      const res = await this.http.post(`/order/payments/v3/${trackerToken}`, {}, { timeout: 25000 });
      return { success: true, environment: this.environment, data: res.data };
    } catch (err) {
      const { status, data } = err.response || {};
      const e = new SafepayError(`Safepay tracker verify failed (HTTP ${status})`, { status, body: data, trackerToken });
      errorLog(e);
      throw e;
    }
  }

  /**
   * Determine if a Safepay response indicates a successful capture.
   */
  static isCaptured(data) {
    const t = data?.tracker || {};
    const payments = t?.next_actions || {};
    const statuses = ['completed', 'authorized', 'paid', 'authorized', 'successful', 'success'];
    return statuses.includes(t.state || '') || !!payments.payment_completed;
  }
}

// ---------------------------------------------------------------------------
// Logging helper — never prints secrets
// ---------------------------------------------------------------------------
function errorLog(err) {
  if (process.env.NODE_ENV === 'development') {
    console.error('[Safepay] ERROR:', err.message, err.details);
  } else {
    console.error('[Safepay] ERROR:', err.message);
  }
}

module.exports = SafepayGateway;
module.exports.SafepayError = SafepayError;
module.exports.toSafepayAmount = toSafepayAmount;
