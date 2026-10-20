import json

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# Add new UK resident article
new_article = {
    "id": 128,
    "slug": "uk-resident-company-formation-2026",
    "title": "Register a UK Ltd Company from the UK — 2026 British Founder's Guide",
    "metaTitle": "Register UK Ltd Company from UK 2026 | British Founder's Guide",
    "metaDescription": "Register a UK Ltd company as a UK resident in 2026. Complete step-by-step guide: Companies House filing, ACSP verification, UK bank accounts, VAT registration, and compliance.",
    "category": "Company Formation",
    "tags": ["UK residents", "formation", "UK Ltd", "guide", "step-by-step", "2026", "British"],
    "publishedDate": "2026-09-10",
    "updatedDate": "2026-10-20",
    "focusKeyword": "register UK Ltd company from UK",
    "secondaryKeywords": [
        "UK company formation for UK residents",
        "register a UK limited company as UK resident",
        "UK Ltd formation UK resident guide",
        "Companies House filing for UK residents"
    ],
    "searchIntent": "transactional",
    "commercialIntent": "high",
    "featured": False,
    "readTime": 12,
    "image": "/images/blog_uk_formation_guide_2026.png",
    "imageAlt": "Register UK Ltd Company from UK 2026",
    "excerpt": "Register a UK Ltd company as a UK resident in 2026. Complete step-by-step guide: Companies House filing, ACSP verification, UK bank accounts, VAT registration, and compliance."
}

data['articles'].append(new_article)
data['articles'].sort(key=lambda x: x['id'])

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added new article: uk-resident-company-formation-2026 (ID {new_article['id']})")
print(f"Total articles: {len(data['articles'])}")
