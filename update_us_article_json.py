import json
import os

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# Update article ID 126 - how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026
for article in data['articles']:
    if article.get('slug') == 'how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026':
        article['metaTitle'] = 'Form UK Ltd Company from USA 2026 — Complete Step-by-Step Guide'
        article['metaDescription'] = 'Form a UK Ltd company from the USA in 2026. Step-by-step guide: Companies House filing, ACSP verification, US tax implications, UK business bank accounts. From £119.99.'
        article['focusKeyword'] = 'form UK Ltd company from USA'
        article['secondaryKeywords'] = [
            'UK Ltd vs US LLC for Americans',
            'open UK bank account from US',
            'UK company formation for US citizens',
            'London virtual office for US startups'
        ]
        article['readTime'] = 15
        article['wordCount'] = 3500
        article['updatedDate'] = '2026-10-20'
        print(f"Updated article: {article['slug']}")
        break

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print("JSON file updated successfully")
