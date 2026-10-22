import json

json_path = 'content/blog/blog-articles.json'

with open(json_path, 'r') as f:
    data = json.load(f)

# Add FAQ data to articles that have FAQ sections
# This data will be used for FAQ structured data (JSON-LD)
faq_updates = {
    'uk-ltd-vs-us-llc': [
        {
            'question': 'Can I start a US LLC and register a UK Ltd company?',
            'answer': 'Yes. You can start a US LLC and register a UK Ltd company. Many US entrepreneurs use UK Ltd for EU market access, UK business banking, and international credibility. The two structures serve different purposes and can coexist.'
        },
        {
            'question': 'Do I need a US LLC to register a UK Ltd company?',
            'answer': 'No. You can register a UK Ltd company without a US LLC. A US LLC is only needed if you want to operate in the US market. For UK residents, a UK Ltd is sufficient.'
        },
        {
            'question': 'Which is better for US citizens: UK Ltd or US LLC?',
            'answer': 'It depends on your goals. UK Ltd is better for EU market access and UK business banking. US LLC is better for US operations. Consult a tax advisor for your specific situation.'
        },
        {
            'question': 'Can a UK Ltd company have non-US directors?',
            'answer': 'Yes. A UK Ltd company can have any number of directors from any country. There is no requirement for directors to be UK or US residents.'
        },
    ],
    'form-uk-ltd-company-from-pakistan-for-ecommerce': [
        {
            'question': 'Can a Pakistani resident register a UK Ltd company?',
            'answer': 'Yes. Pakistani residents can register UK Ltd companies online. You need a UK registered office address and your passport/ID.'
        },
        {
            'question': 'What is the cost of registering a UK Ltd company from Pakistan?',
            'answer': 'From £119.99 (all-inclusive) with UK LTD Registration. This includes Companies House filing, registered office, and 24-hour service.'
        },
        {
            'question': 'Can I be the sole director and shareholder of a UK Ltd company?',
            'answer': 'Yes. You can be your own director and sole shareholder of a UK Ltd company.'
        },
        {
            'question': 'Do I need a UK address to form a UK Ltd company?',
            'answer': 'Yes. You must have a UK registered office address. We provide London, Manchester, or Edinburgh addresses.'
        },
        {
            'question': 'How long does UK Ltd formation take from Pakistan?',
            'answer': 'Same-day service is available. With a formation agent, you receive your incorporation certificate within 24 hours.'
        },
    ],
    'limited-company-formation-guide': [
        {
            'question': 'How much does it cost to form a limited company in the UK?',
            'answer': 'From £100 (Companies House fee) or £119.99 (all-inclusive with a formation agent).'
        },
        {
            'question': 'Can I register a limited company online?',
            'answer': 'Yes. You can file online with Companies House, or use a formation agent like UK LTD Registration.'
        },
        {
            'question': 'How long does limited company formation take?',
            'answer': 'Same-day service is available. With a formation agent, you receive your certificate within 24 hours.'
        },
        {
            'question': 'Can I be the only director and shareholder?',
            'answer': 'Yes. One person can be the sole director and sole shareholder of a UK Ltd company.'
        },
        {
            'question': 'Do I need a registered office address?',
            'answer': 'Yes. You must have a UK registered office address for Companies House and HMRC.'
        },
    ],
    'set-up-limited-company-online': [
        {
            'question': 'Can I set up a limited company online from Pakistan?',
            'answer': 'Yes. Pakistani residents can register UK Ltd companies online. You need a UK registered office address.'
        },
        {
            'question': 'How long does it take to set up a limited company?',
            'answer': 'Same-day service. With a formation agent, you receive your certificate within 24 hours.'
        },
        {
            'question': 'What is the cost to set up a limited company online?',
            'answer': 'From £100 (Companies House) or £119.99 (all-inclusive with agent).'
        },
        {
            'question': 'Do I need a UK address to set up a limited company?',
            'answer': 'Yes. You must have a UK registered office address — we provide London, Manchester, or Edinburgh addresses.'
        },
    ],
    'sic-code-forex-trading-own-capital': [
        {
            'question': 'What is the correct SIC code for forex trading?',
            'answer': 'SIC code 66112 (Financial Instrument Trading) is the recommended code for forex trading with your own capital.'
        },
        {
            'question': 'Can non-residents trade forex in the UK?',
            'answer': 'Yes. UK Ltd companies can trade forex, and non-residents can register UK Ltd companies.'
        },
        {
            'question': 'Do I need to register for VAT on forex trading?',
            'answer': 'You only need to register if your turnover exceeds £90,000 (2026 threshold) — and forex trading may not be taxable in the same way as other trading.'
        },
        {
            'question': 'Can I open a UK business bank account for forex trading?',
            'answer': 'Yes. Some banks accept non-resident forex traders with proper documentation. Our recommended partners include Tide, Revolut Business, and Airwallex.'
        },
    ],
    'vat-registration-threshold-uk-2026': [
        {
            'question': 'What is the UK VAT registration threshold for 2026?',
            'answer': 'The UK VAT registration threshold is £90,000 in taxable turnover over a rolling 12-month period.'
        },
        {
            'question': 'Do I need to register for VAT if my turnover is below £90,000?',
            'answer': 'No, but you can register voluntarily. Some businesses register voluntarily to claim VAT on purchases or signal larger scale to customers.'
        },
        {
            'question': 'How do I register for VAT in the UK?',
            'answer': 'Register online via HMRC, by post using form VAT1, or through a formation agent. You can register for VAT online at the HMRC website within 15 minutes.'
        },
        {
            'question': 'What happens if I miss the VAT registration deadline?',
            'answer': 'You may be liable for late registration penalties and backdated VAT. You must declare all VAT due from the date you should have registered.'
        },
        {
            'question': 'Can non-residents register for UK VAT?',
            'answer': 'Yes, non-residents can register for UK VAT if their taxable turnover in the UK exceeds £90,000. You must appoint a representative in the UK.'
        },
    ],
    'tide-business-account-uk-ltd-non-resident-review-2026': [
        {
            'question': 'Is the Tide business account suitable for UK Ltd non-residents?',
            'answer': 'Yes. Tide is a popular business account for UK Ltd companies. Non-residents can open an account, though they may need to verify their identity and address.'
        },
        {
            'question': 'What are the fees for the Tide business account?',
            'answer': 'Tide provides free business banking with no monthly fees. Some features may have charges (ATMs, currency conversion, etc.).'
        },
        {
            'question': 'Are there better alternatives to Tide for UK Ltd non-residents?',
            'answer': 'Yes. Dash, Airwallex, Revolut Business, and Wise Business are also suitable for UK Ltd non-residents, depending on your needs.'
        },
        {
            'question': 'Can I open a Tide account as a non-resident?',
            'answer': 'Tide is a UK-based account and requires UK presence. Non-residents may need to use a UK address or a formation agent.'
        },
    ],
}

# Update articles with FAQ data
for article in data['articles']:
    slug = article.get('slug', '')
    if slug in faq_updates:
        article['faq'] = faq_updates[slug]
        print(f"Added FAQ data to article: {slug}")

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nUpdated {len(faq_updates)} articles with FAQ data")
