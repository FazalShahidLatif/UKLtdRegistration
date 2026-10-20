/**
 * Safepay & Currency routes for UK LTD Registration
 *
 *   POST /api/payment/checkout     - create a Safepay checkout session
 *   GET  /api/payment/verify/:tracker - verify the tracker after checkout
 *   GET  /api/currency-rates        - live foreign-exchange rates (GBP base)
 *   GET  /api/currency-convert      - convert a GBP amount to a target currency
 *
 * Free FX source: frankfurter.app (ECB, no API key required).
 */

'use strict';

const express = require('express');
const router = express.Router();
const axios = require('axios');
const SafepayGateway = require('../payment/safepay');
const gateway = new SafepayGateway();

// Package price map (GBP) — UK LTD Registration formation packages
const PACKAGE_PRICES = {
  starter: 119.99,
  standard: 189.99,
  enterprise: 299.99,
};
const PACKAGE_NAMES = {
  starter: 'Starter UK LTD Formation Package',
  standard: 'Standard Plus UK LTD Formation Package',
  enterprise: 'Enterprise Elite UK LTD Formation Package',
};

// ---------------------------------------------------------------------------
// Payment routes
// ---------------------------------------------------------------------------
// POST /api/payment/checkout
// Body: { package, customerName?, customerEmail?, currency? }
router.post('/checkout', [
  body('package').isIn(['starter', 'standard', 'enterprise']).withMessage('Invalid package — choose starter, standard, or enterprise'),
  body('customerEmail').optional().isEmail().withMessage('Valid email required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { package: pkg, customerName, customerEmail } = req.body;
    const priceGBP = PACKAGE_PRICES[pkg];
    const result = await gateway.createCheckoutSession({
      amount: priceGBP,
      currency: 'GBP',
      packageName: PACKAGE_NAMES[pkg],
      customerName,
      customerEmail,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, details: err.details });
  }
});

// GET /api/payment/verify/:tracker
router.get('/verify/:tracker', async (req, res) => {
  const { tracker } = req.params;
  if (!tracker) {
    return res.status(400).json({ success: false, error: 'Missing tracker token' });
  }
  try {
    const data = await gateway.verifyTracker(tracker);
    // Safepay tracker.state values: e.g., 'TRACKER_STARTED', 'PAYMENT_SUCCESS', etc.
    const captured = SafepayGateway.isCaptured(data);
    res.json({ success: true, ...data, captured });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, details: err.details });
  }
});

// ---------------------------------------------------------------------------
// Currency converter routes (free FX API — frankfurter.app / ECB)
// ---------------------------------------------------------------------------

// GET /api/currency-rates
// Query: ?base=GBP (context) — returns live rates for GBP→PKR, USD, EUR, etc.
router.get('/currency-rates', async (req, res) => {
  const base = (req.query.base || 'GBP').toUpperCase().slice(0, 3);
  // Safe list of currencies we display on the website
  const WANTED = ['PKR', 'USD', 'EUR', 'AUD', 'CAD', 'INR', 'AED', 'SAR', 'GBP'];
  try {
    const res = await axios.get(`https://frankfurter.app/latest?base=${base}`, { timeout: 10000 });
    const data = res.data || {};
    const rates = data?.rates || {};
    const response = {
      success: true,
      base,
      date: data?.date,
      rates: {},
      note: 'Free FX data from frankfurter.app (ECB). Convert: amount × rate.',
    };
    for (const code of WANTED) {
      const val = rates[code];
      response.rates[code] = val === undefined || val == null ? null : Number.parseFloat(val.toFixed(4));
    }
    // also return raw rates map for the frontend
    response.raw = rates;
    return res.json(response);
  } catch (err) {
    console.error('[currency-rates] fx fetch failed:', err.message);
    // Fail-open with a fallback based on a static reference; never return 500 for a currency widget.
    return res.json({
      success: true,
      base,
      date: new Date().toISOString().slice(0, 10),
      note: 'FX service temporarily unavailable — using reference rates.',
      rates: {
        PKR: 278.00,
        USD: 1.27,
        EUR: 1.17,
        AUD: 1.94,
        CAD: 1.67,
        INR: 189.00,
        AED: 4.09,
        SAR: 3.75,
        GBP: 1.00,
      },
      fallback: true,
    });
  }
});

// GET /api/currency-convert
// Query: ?amount=119.99&to=PKR
router.get('/currency-convert', async (req, res) => {
  const amount = parseFloat(req.query.amount);
  const to = (req.query.to || 'PKR').toUpperCase().slice(0, 3);
  if (!amount || isNaN(amount) || amount < 0) {
    return res.status(400).json({ success: false, error: 'Valid amount required' });
  }
  try {
    const ratesRes = await axios.get('https://frankfurter.app/latest?base=GBP', { timeout: 10000 });
    const rate = (ratesRes.data?.rates || {})[to];
    if (rate === undefined || rate == null) {
      return res.status(400).json({ success: false, error: `Unsupported currency ${to}` });
    }
    const converted = amount * rate;
    res.json({
      success: true,
      from: 'GBP',
      to,
      amount,
      rate: Number.parseFloat(rate.toFixed(6)),
      converted: converted.toFixed(2),
      at: ratesRes.data?.date,
    });
  } catch (err) {
    console.error('[currency-convert] fetch failed:', err.message);
    // Fail-open with a reference rate so the widget still renders
    const fallback = { PKR: 278.00, USD: 1.27, EUR: 1.17, AUD: 1.94, CAD: 1.67, INR: 189.00, AED: 4.09, SAR: 3.75 };
    const r = fallback[to] || 1.0;
    res.json({
      success: true,
      from: 'GBP',
      to,
      amount,
      rate: Number.parseFloat(r.toFixed(6)),
      converted: (amount * r).toFixed(2),
      note: 'Reference rate (FX service unavailable)',
    });
  }
});

module.exports = router;
