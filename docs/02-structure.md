# 02 — Site Structure

Property: **UK LTD Registration** (`https://ukltdregistration.com`)
Repo: `C:/Gitub-Projects/UKLtdRegistration` (branch `main`)

---

## Classification

| Item | Value |
|---|---|
| Type | Server-rendered multi-page Node/Express site (EJS templates) |
| Runtime | Node.js + Express |
| Templating | EJS (`views/pages`, `views/partials`) |
| Styling | Tailwind CSS (`public/css/output.css`), `brand` token set |
| Data | MongoDB via Mongoose, with JSON fallback ("Limited Mode") |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Analytics | GA4 (`G-2C4WERJC1D`), GTM (`GT-WBLVXC7D`) |
| Mail | Mailgun (sandbox domain — see `docs/03-status.md`) |
| AI | On-site chatbot (`/api/chat`) via `utils/aiService.js` |

**No client-side framework.** Content is prerendered HTML — the audit can be
performed against source, not rendered extracts.

---

## Route Map

### Page routes (`routes/pages.js`) — 46 routes
Service pages, regional formation pages, legal pages, and utility pages
(`/company-name-check`, `/strategic-research-hub`, `/reviews`, `/faq`).

### Content routes
| Route | File | Notes |
|---|---|---|
| `/blog` | `routes/blog.js` | Blog list + article detail |
| `/knowledge-hub` | `routes/hub.js` | SIC / research hub |
| `/` (home) | `routes/home.js` | Homepage |

### API routes (`routes/api.js`)
| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Health probe |
| `POST /api/chat` | Chatbot completion |
| `GET /api/company-search` | Companies House lookup |
| `GET /api/sic-finder` | SIC code search |
| `POST /api/contact` | **Sales enquiry — primary lead path** |
| `POST /api/lead-capture` | Checklist funnel lead |
| `POST /api/affiliate-apply` | Partner application |
| `POST /api/review` | Review submission (moderated) |

### Admin routes (`routes/admin.js`)
`/admin`, `/admin/orders`, `/admin/partners`, `/admin/leads`, `/admin/seo`.

---

## Content Inventory

| Asset | Count |
|---|---|
| Blog articles (`content/blog/*.md`) | **120** |
| Total article words | **240,924** |
| Average words per article | **2,007** |
| Articles under 800 words | **49** (thin content) |
| Sitemap URLs | **160** |
| EJS templates | 77 |

---

## Machine Discovery

| Protocol | Path | Status |
|---|---|---|
| robots.txt | `/robots.txt` | ✅ 200 |
| sitemap.xml | `/sitemap.xml` | ✅ 200 (160 URLs) |
| llms.txt | `/llms.txt` | ✅ 200 |
| ARD manifest | `/.well-known/ard.json` | ✅ 200 |

---

## Template Partials

`header`, `footer`, `schema` (JSON-LD `@graph`), `chatbot-widget`,
`affiliate-disclosure`.

---

## Known Structural Issues

1. **`/checkout` has no route.** `views/pages/checkout.ejs` exists but is not
   registered in `routes/pages.js`; the live URL returns **404**. The template
   itself states "No payment gateway is required for this step" — it is a
   contact redirect, not a checkout. Either wire it to a real gateway or remove
   the template to avoid a dead asset.
2. **49 articles under 800 words** — thin content, against the "zero stubs"
   content standard.
