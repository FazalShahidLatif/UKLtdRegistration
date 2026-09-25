# UK LTD Registration — SEO Fix Summary

> All SEO fixes applied 2026-09-24. 24 articles with duplicate H1/title tags fixed. 31 pages with long titles fixed. 31 pages with low text-HTML ratio fixed. Sitemap, robots.txt, ads.txt, llms.txt, and schema markup all updated.

## What Was Fixed

### 1. Duplicate H1 & Title Tags (24 pages)
All 24 flagged articles now have unique metaTitles that differ from their H1 (article.title) and are ≤55 characters:
- acsp-identity-verification-2026
- banking-for-uk-ltd-owners-ireland
- best-banking-payments-setup-sea-founders
- business-banking-uk-ltd-non-residents
- cheapest-way-register-uk-company-2026
- closing-uk-company-guide
- director-service-address-uk-what-is-it
- how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026
- remote-uk-company-registration-ireland
- required-documents-uk-ltd-ireland
- same-day-company-formation-uk-2026
- sea-founders-uk-playbook-2026
- uk-company-formation-complete-guide-2026
- uk-company-name-rules-2026
- uk-company-vs-delaware-c-corp
- uk-ltd-company-annual-costs-2026
- uk-ltd-vs-local-company-sea-startups
- uk-ltd-vs-offshore-company
- uk-ltd-vs-us-llc
- uk-registered-office-address-requirements-2026
- uk-tax-compliance-non-resident-ireland
- vat-registration-threshold-uk-2026
- why-sea-founders-use-uk-ltd-global-2026
- wise-vs-uk-banks-non-residents

### 2. Title Tag Length (31 pages — previous report)
All route-level titles shortened to ≤55 chars. Blog article metaTitles all ≤55 chars.

### 3. Low Text-HTML Ratio (31 pages — previous report)
Content sections added to thin pages: accounting, cookies, dissolution, meeting-rooms, banking, services, contact, hub, uk-residents.

### 4. Files Updated
- `blog-articles.json` — all 116 articles have unique metaTitles
- `controllers/blogController.js` — buildPageTitle uses "— UK LTD Registration" suffix instead of "Guide:" prefix
- `routes/pages.js` — all titles ≤55 chars
- `routes/home.js` — title shortened
- `public/robots.txt` — updated
- `public/ads.txt` — verified
- `public/llms.txt` — updated with all pages and 36 blog links
- `views/pages/blog-single.ejs` — Article JSON-LD schema added
- `views/pages/services.ejs` — content added
- `views/pages/services/accounting.ejs` — content added
- `views/pages/services/banking.ejs` — content added
- `views/pages/services/dissolution.ejs` — content added
- `views/pages/services/meeting-rooms.ejs` — content added
- `views/pages/contact.ejs` — content added
- `views/pages/hub.ejs` — content added
- `views/pages/uk-residents.ejs` — content added
- `views/pages/legal/cookies.ejs` — content added

### 5. Schema Markup
- Organization, LocalBusiness, WebSite, WebPage, BreadcrumbList — all present in schema.ejs
- Article JSON-LD added to blog-single.ejs for all blog posts
