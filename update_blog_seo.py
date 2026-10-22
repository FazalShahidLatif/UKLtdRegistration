import json
import os

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# Update article ID 109: vat-registration-threshold-uk-2026
for article in data['articles']:
    if article.get('slug') == 'vat-registration-threshold-uk-2026':
        article['metaTitle'] = 'UK VAT Registration Threshold 2026: £90K Rule & Deadlines'
        article['metaDescription'] = 'UK VAT registration threshold is £90,000 in 2026. Learn when you must register, how the rolling 12-month test works, and what happens if you miss the deadline.'
        article['imageAlt'] = 'UK VAT Registration Threshold 2026: £90K Rule & Deadlines'
        print(f"Updated ID 109: {article['slug']}")
        break

# Update article ID 66: tide-business-account-uk-ltd-non-resident-review-2026
for article in data['articles']:
    if article.get('slug') == 'tide-business-account-uk-ltd-non-resident-review-2026':
        article['metaTitle'] = 'Tide Business Account Review 2026 — Non-Residents, Fees & Better Alternatives'
        article['metaDescription'] = 'Read our 2026 review of the Tide business account for UK Ltd non-residents. We cover eligibility, fees, transfer times, and better alternatives like Dash, Airwallex, and Revolut Business.'
        article['imageAlt'] = 'Tide Business Account Review 2026 — Non-Residents, Fees & Better Alternatives'
        print(f"Updated ID 66: {article['slug']}")
        break

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print("\nJSON file updated successfully")
