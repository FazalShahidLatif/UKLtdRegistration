import json
import os

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# New articles to add (based on markdown files created in Week 2)
new_articles = [
    {
        "id": 124,
        "slug": "form-uk-ltd-company-from-pakistan-for-ecommerce",
        "title": "Form a UK Ltd Company from Pakistan for E-commerce — 2026 Complete Guide",
        "metaTitle": "Form UK Ltd Company from Pakistan for E-commerce 2026 | Step-by-Step Guide",
        "metaDescription": "Form a UK Ltd company from Pakistan for e-commerce in 2026. Step-by-step guide: Companies House registration, ACSP verification, banking options, tax setup, and e-commerce platform integration.",
        "category": "Company Formation",
        "tags": ["pakistan", "ecommerce", "formation", "non-resident", "UK LTD", "2026", "guide"],
        "publishedDate": "2026-09-20",
        "updatedDate": "2026-10-20",
        "focusKeyword": "form UK Ltd company from Pakistan for e-commerce",
        "secondaryKeywords": [
            "register UK company from Pakistan",
            "UK Ltd formation from Pakistan for e-commerce",
            "UK company setup for Pakistani founders",
            "non-resident UK company registration Pakistan",
            "UK Ltd for Amazon FBA from Pakistan"
        ],
        "searchIntent": "transactional",
        "commercialIntent": "high",
        "featured": False,
        "readTime": 12,
        "image": "/images/blog_uk_formation_guide_2026.png",
        "imageAlt": "Form UK Ltd Company from Pakistan for E-commerce 2026",
        "excerpt": "Form a UK Ltd company from Pakistan for e-commerce in 24 hours. Step-by-step guide covering Companies House filing, banking, tax, and e-commerce platform setup."
    },
    {
        "id": 125,
        "slug": "limited-company-formation-guide",
        "title": "Limited Company Formation: A Complete Guide for UK Ltd Setup in 2026",
        "metaTitle": "Limited Company Formation 2026: Step-by-Step Guide for UK Ltd",
        "metaDescription": "Limited company formation guide for UK Ltd registration in 2026. Step-by-step: name check, constitution, registered office, bank account, taxes, compliance, and costs — from £119.99.",
        "category": "Company Formation",
        "tags": ["limited company", "formation", "UK Ltd", "guide", "step-by-step", "2026", "incorporation"],
        "publishedDate": "2026-10-20",
        "updatedDate": "2026-10-20",
        "focusKeyword": "limited company formation",
        "secondaryKeywords": [
            "set up a limited company online",
            "limited company registration UK",
            "UK company formation guide",
            "register a limited company UK",
            "how to form a UK Ltd company"
        ],
        "searchIntent": "transactional",
        "commercialIntent": "very high",
        "featured": False,
        "readTime": 10,
        "image": "/images/blog_uk_formation_guide_2026.png",
        "imageAlt": "Limited Company Formation: UK Ltd Setup 2026 Guide",
        "excerpt": "Limited company formation guide for UK Ltd registration in 2026. Step-by-step: name check, constitution, registered office, bank account, taxes, compliance."
    },
    {
        "id": 126,
        "slug": "set-up-limited-company-online",
        "title": "Set Up a Limited Company Online — Step-by-Step Guide (2026)",
        "metaTitle": "Set Up a Limited Company Online 2026 | UK Ltd Registration Guide",
        "metaDescription": "Set up a limited company online in 2026 — UK Ltd formation guide. Step-by-step: name check, constitution, registered office, bank account, company tax, compliance, and costs. From £119.99.",
        "category": "Company Formation",
        "tags": ["limited company", "online", "UK Ltd", "formation", "guide", "step-by-step"],
        "publishedDate": "2026-10-20",
        "updatedDate": "2026-10-20",
        "focusKeyword": "set up a limited company online",
        "secondaryKeywords": [
            "limited company registration online",
            "register a limited company online UK",
            "set up UK company online",
            "UK company formation online 2026"
        ],
        "searchIntent": "transactional",
        "commercialIntent": "very high",
        "featured": False,
        "readTime": 9,
        "image": "/images/blog_uk_formation_guide_2026.png",
        "imageAlt": "Set Up a Limited Company Online 2026",
        "excerpt": "Set up a limited company online in 2026 — UK Ltd formation guide. Step-by-step: name check, constitution, registered office, bank account, company tax."
    },
    {
        "id": 127,
        "slug": "sic-code-forex-trading-own-capital",
        "title": "UK SIC Code for Forex Trading Own Capital — 2026 Guide",
        "metaTitle": "UK SIC Code for Forex Trading Own Capital 2026 | Non-Resident Guide",
        "metaDescription": "Find the correct UK SIC code for forex trading own capital. Learn which SIC 66112 or 64110 to use for currency trading, LLCs, and non-resident UK Ltd companies in 2026.",
        "category": "Tax & Compliance",
        "tags": ["SIC code", "forex", "currency trading", "own capital", "non-resident", "HMRC", "UK Ltd"],
        "publishedDate": "2026-10-20",
        "updatedDate": "2026-10-20",
        "focusKeyword": "UK SIC code for forex trading own capital",
        "secondaryKeywords": [
            "SIC code forex trading UK",
            "UK SIC code for currency trading",
            "SIC 66112 forex trading",
            "SIC code for trading own capital UK"
        ],
        "searchIntent": "informational",
        "commercialIntent": "medium",
        "featured": False,
        "readTime": 10,
        "image": "/images/blog_forex.ico",
        "imageAlt": "UK SIC Code for Forex Trading Own Capital",
        "excerpt": "Find the correct UK SIC code for forex trading own capital. Learn which SIC 66112 or 64110 to use for currency trading, LLCs, and non-resident UK Ltd companies."
    },
]

# Add new articles to the list
data['articles'].extend(new_articles)

# Sort by ID to keep order
data['articles'].sort(key=lambda x: x['id'])

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {len(new_articles)} new articles to blog-articles.json")
print(f"Total articles: {len(data['articles'])}")
