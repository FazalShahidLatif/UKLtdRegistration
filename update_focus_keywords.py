import json

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# Add focus keywords to articles missing them
fk_updates = {
    'best-banking-payments-setup-sea-founders': 'best banking payments setup for SEA founders UK Ltd',
    'cheapest-way-register-uk-company-2026': 'cheapest UK company formation 2026',
    'closing-uk-company-guide': 'how to close UK company formation',
    'director-service-address-uk-what-is-it': 'UK director service address requirements',
    'eccta-2026-acsp-verification-sea-founders': 'ECCTA 2026 ACSP verification for SEA founders',
    'get-paid-gbp-usd-eur-sea-founders': 'get paid GBP USD EUR SEA founders UK Ltd',
    'same-day-company-formation-uk-2026': 'same day UK company formation 2026',
    'stripe-wise-mercury-setup-sea-founders': 'Stripe Wise Mercury setup for SEA founders UK Ltd',
    'uk-company-formation-cost-breakdown-2026': 'UK company formation cost breakdown 2026',
    'uk-company-formation-uae-guide': 'UK company formation UAE guide',
    'uk-ltd-company-annual-costs-2026': 'UK Ltd company annual costs 2026',
    'uk-ltd-tax-basics-sea-founders': 'UK Ltd tax basics for SEA founders',
    'uk-registered-office-address-requirements-2026': 'UK registered office address requirements 2026',
}

for article in data['articles']:
    slug = article.get('slug')
    if slug in fk_updates and not article.get('focusKeyword'):
        article['focusKeyword'] = fk_updates[slug]
        print(f"Added focus keyword to: {slug}")

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nUpdated {len(fk_updates)} articles with focus keywords")
