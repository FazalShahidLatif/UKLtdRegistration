# 01 — Revenue Model & Gate Status

Property: **UK LTD Registration** (`https://ukltdregistration.com`)
Repo: `C:/Gitub-Projects/UKLtdRegistration` (branch `main`)
Last reviewed: 2026-10-20

---

## Gate Status: BUILD → EARN → INVEST

| Stage | Rule | Current |
|---|---|---|
| **BUILD** | 100% free-tier infrastructure, organic discovery, free affiliate networks | ✅ Active |
| **EARN** | First $1 earned → payment gateway may be built | ❌ **No earnings yet** |
| **INVEST** | Two consecutive months of revenue → premium tools unlocked | ⛔ Blocked |

**Gate decision:** No paid plan, subscription, or credit-card gate may be
configured, recommended, or implemented until earnings are realised. This
includes payment-gateway signups that carry upfront costs.

---

## Revenue Streams (identified, ranked by potential)

### 1. Core service sales — UK company formation
**Model:** Flat-rate packages sold directly.
| Package | Price | Notes |
|---|---|---|
| Starter | £119.99 + VAT | £100 Companies House fee included |
| Standard Plus | £189.99 + VAT | London address, service address, banking intro |
| Enterprise Elite | £299.99 + VAT | Virtual number, KYC, account manager |

**Status:** Pricing page live. **Checkout is NOT wired** — every CTA routes to
`/contact?package=<tier>`, i.e. an email enquiry. No self-serve conversion path.
**This is the primary revenue blocker.**

### 2. Add-on services
Registered office address, company secretary, VAT registration, confirmation
statement, apostille, dissolution. Status: informational pages live; no
self-serve purchase path.

### 3. Affiliate / partner revenue
Affiliate application endpoint (`/api/affiliate-apply`) exists and
`views/pages/affiliates.ejs` is live. **No affiliate IDs integrated** into pages
beyond the generic application form — a placeholder, not integration.

### 4. Display advertising
**Inactive.** AdSense was removed (commit `426188e`); Adstera was added then
fully reverted (commit `64bc9a7`). No ad network is currently live.
Re-entry requires a decision on which network and must respect the
zero-cost-until-earning rule.

### 5. Banking introductions
Wise / Tide / Revolut / Monzo referral introductions mentioned in copy.
**No referral links implemented.**

---

## Zero-Cost Enforcement

- No paid hosting plan, no paid SEO tool, no paid MoR account.
- Vercel Hobby tier, free DNS/CDN, free-tier APIs only.
- Any cost-incurring step is **gate blocked** and must be logged here as
  "gate blocked" with the reason.

## Gate Block Log

| Date | Item | Reason |
|---|---|---|
| 2026-10-20 | Premier PayFast merchant account | PKR 20,000 non-refundable setup fee — violates zero-cost rule |
| 2026-10-20 | Any paid ad-network tier | No earnings; gate blocked |

## Target

Once earnings begin, the order of work is: **core service checkout first**
(highest monetary value per conversion), then add-on services, then affiliate
and display revenue. Do not spend on anything else before checkout converts.
