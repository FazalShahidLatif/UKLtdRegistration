# 03 — Status & Compliance

Property: **UK LTD Registration** (`https://ukltdregistration.com`)
Baseline recorded: 2026-10-20

---

## Baseline Metrics

| Metric | Value | Source |
|---|---|---|
| Sitemap URLs | 160 | `curl /sitemap.xml` |
| Routes returning 200 | 158 / 158 | route probe |
| Blog articles | 120 | `content/blog/*.md` |
| Total article words | 240,924 | word count |
| Average article length | 2,007 words | word count |
| Thin articles (<800 words) | 49 | word count |
| Published reviews | 0 | `data/reviews.json` |
| Review submissions | 0 | `data/review-submissions.json` |
| Revenue | £0 | no checkout path |
| GA4 property | `G-2C4WERJC1D` | `views/partials/header.ejs` |

---

## Compliance Checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Favicon at root | ✅ | `/favicon.ico` → 200 (7,105 b) |
| 2 | Apple touch icon | ✅ | `/images/apple-touch-icon.png` |
| 3 | robots.txt | ✅ | 200, crawler groups declared |
| 4 | XML sitemap | ✅ | 200, 160 URLs |
| 5 | llms.txt | ✅ | 200 |
| 6 | ARD manifest | ✅ | `/.well-known/ard.json` → 200 |
| 7 | JSON-LD `@graph` | ✅ | Organization, WebSite, LocalBusiness, Service, Offer, FAQPage, VideoObject, BreadcrumbList |
| 8 | Affiliate disclosure | ✅ | `views/partials/affiliate-disclosure.ejs` on home + blog articles |
| 9 | Fabricated claims sweep | ✅ | ACSP / HMRC MLR / ICO / "10,000+ founders" claims removed (commit `12c9634`) |
| 10 | Review policy honesty | ✅ | Submissions never auto-published; requires human promotion |
| 11 | `BRAND.md` | ✅ | Created 2026-10-20 |
| 12 | `docs/` mandate files | ✅ | 01/02/03 created 2026-10-20 |
| 13 | Meta description length | ✅ | 114 blog + 9 static descriptions within 160 chars |
| 14 | Image alt text | ✅ | 7 articles given images/alt (commit `ea8b89a`) |
| 15 | CLS fix (hero) | ✅ | Explicit `1200×630` + `fetchpriority` |
| 16 | Pinterest integration | ✅ Removed | Commit `cd13afd`; only editorial mentions remain |
| 17 | AdSense | ✅ Removed | Commit `426188e`; `public/ads.txt` deleted |
| 18 | Adstera | ✅ Removed | Commit `64bc9a7`; zero occurrences in source |
| 19 | Exit-intent popup | ✅ Removed | Commit `fb530ec` |
| 20 | Vercel serverless crash | ✅ Fixed | Module-level `connectDB()` removed (commit `fc23a2f`) |

---

## Open Findings

| # | Finding | Severity | Impact |
|---|---|---|---|
| F1 | **Leads are not persisted.** `/api/contact`, `/api/lead-capture`, `/api/affiliate-apply` only email + log to console. No durable record. | 🔴 Critical | Every enquiry is lost if the email bounces. **Biggest revenue risk.** |
| F1a | **Vercel serverless filesystem is read-only.** `vercel.json` builds `server.js` as a `@vercel/node` function, so any `fs.appendFileSync` fails in production. A local-pass/production-fail that was caught during verification. | 🔴 Critical | The file-based lead store works locally but cannot work on Vercel. Production persistence must be Google Sheets or an Apps Script webhook. |
| F1b | **Google Sheets API not enabled** in GCP project `375506795519`. | 🔴 Critical | Sheets path returns `accessNotConfigured`. Requires one manual click by the owner. |
| F2 | **No checkout.** `/pricing` CTAs route to `/contact?package=`; `/checkout` returns 404. | 🔴 Critical | No self-serve conversion; zero revenue path. |
| F3 | **Mailgun is a sandbox domain** (`sandbox…mailgun.org`). Sandbox sends only to authorised recipients. | 🔴 Critical | Lead notifications may never arrive. |
| F4 | **49 articles under 800 words.** | 🟡 Medium | Thin content; weak topical authority. |
| F5 | **No affiliate IDs integrated** — application form only. | 🟡 Medium | No affiliate revenue possible. |
| F6 | **Banking referral links absent** (Wise/Tide/Revolut/Monzo). | 🟡 Medium | Copy promises introductions with no link. |
| F7 | **No review collection CTA** deployed site-wide. | 🟢 Low | No social proof accumulating. |

---

## Targets

| Target | From | To | Notes |
|---|---|---|---|
| Revenue | £0 | First £1 | Requires F1 + F2 + F3 fixed |
| Thin articles | 49 | <15 | Consolidate/expand lowest-value set |
| Lead durability | 0% persisted | 100% persisted | Requires F1 fix |

---

## Change Log

| Date | Change | Commit |
|---|---|---|
| 2026-10-10 | AdSense fully removed | `426188e` |
| 2026-10-11 | Adstera integrated; affiliate disclosure; referral link | `b7741a0`, `870ee3e`, `6735964` |
| 2026-10-12 | Vercel crash fixed; homepage restored | `fc23a2f`, `93189f0` |
| 2026-10-12 | Favicon + apple-touch-icon | `408f111` |
| 2026-10-12 | Pinterest fully removed | `582e98c` |
| 2026-10-12 | 114 blog meta descriptions fixed; 7 articles given images | `eb0c000`, `ea8b89a` |
| 2026-10-13 | Unverifiable regulatory/volume claims removed (61 instances) | `12c9634` |
| 2026-10-13 | Pinterest + Adstera reverted | `cd13afd`, `64bc9a7` |
| 2026-10-20 | Enquiry and lead-capture paths repaired | `8d88a13` |
| 2026-10-20 | `BRAND.md`, `docs/01-03`, ARD manifest created | `398281f` |
| 2026-10-20 | Lead store: file + Sheets + Apps Script webhook paths | `2c58c7a` |
| 2026-10-20 | `stores` exposed on lead responses; deploy verified live (`stores:[]`) | `243f178` |

---

## Verified Live (2026-10-20, post-deploy)

| Check | Result |
|---|---|
| `/.well-known/ard.json` | **200** (was 404) |
| `/api/lead-capture` | `{"success":true,"notified":false,"persisted":false,"stores":[]}` |
| Interpretation | New code is live. `stores:[]` proves **no persistence store is configured on Vercel** — the file path cannot work there (read-only filesystem) and neither `LEAD_SHEET_ID` nor `LEAD_WEBHOOK_URL` is set. |
| Mailgun notification | `notified:false` — confirms **F3** (sandbox domain cannot deliver) |

**Action required to close F1:** set `LEAD_SHEET_ID` (after enabling the Sheets API)
or `LEAD_WEBHOOK_URL` in the Vercel environment.

