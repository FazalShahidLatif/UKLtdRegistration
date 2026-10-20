#!/usr/bin/env python3
"""SEO & Technical Audit — UK LTD Registration"""
import json
import re
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def load_json(name):
    path = os.path.join(BASE, name)
    with open(path) as f:
        return json.load(f)

def audit():
    print("=" * 60)
    print("UK LTD REGISTRATION — SEO & TECHNICAL AUDIT")
    print("=" * 60)

    # Load data
    blog_data = load_json('content/blog/blog-articles.json')
    articles = blog_data.get('articles', [])
    published = [a for a in articles if a.get('publishedDate') or a.get('updatedDate')]
    all_slugs = set(a['slug'] for a in articles)
    published_slugs = set(a['slug'] for a in published)
    unpublished = all_slugs - published_slugs

    redirects_data = load_json('content/redirects.json')
    redirect_sources = set(r['from'] for r in redirects_data)

    # Load sitemap routes
    with open('routes/sitemap.js') as f:
        sitemap_code = f.read()
    static_routes = set(re.findall(r"'/(\w+/[^']+)'", sitemap_code))
    static_routes.update({
        '/', '/uk-residents', '/us-citizens', '/get-help-forming-a-uk-ltd',
        '/uk-ltd-formation-for-non-residents', '/register-a-limited-company-uk',
        '/company-name-check', '/about', '/faq', '/contact', '/reviews',
        '/legal/privacy', '/legal/terms', '/legal/cookies', '/legal/refund',
        '/legal/compliance', '/knowledge-hub', '/blog',
        '/strategic-research-hub', '/success-stories', '/partners', '/pricing',
        '/cheapest-uk-company-registration', '/budget-formation',
        '/fast-formation', '/fastest-uk-company-registration',
        '/register-company-england', '/register-company-scotland',
        '/register-company-wales', '/register-company-london',
        '/register-company-manchester', '/register-company-birmingham',
        '/register-company-leeds', '/register-company-edinburgh',
        '/regions/birmingham', '/regions/edinburgh', '/regions/england',
        '/regions/leeds', '/regions/london', '/regions/manchester',
        '/regions/scotland', '/regions/wales', '/forex-uk-ltd',
        '/forex-trading-uk-ltd-review', '/ltd-formation',
        '/non-uk-resident-company', '/non-residents', '/partners',
        '/affiliates', '/checklist-download', '/company-secretary',
        '/confirmation-statement', '/company-name-check',
        '/uk-company-formation-complete-guide-2026',
        '/how-to-register-uk-company-from-usa-complete-step-by-step-guide-2026',
        '/sea-founders-uk-playbook-2026',
        '/register-uk-ltd-online-india-pakistan-2026',
        '/pakistan-exporter-guide-leather-textile-uk-ltd',
        '/india-manufacturer-roadmap-usa-europe-uk-ltd',
        '/global-food-export-guide-coffee-meat-seafood-uk-ltd',
        '/global-tendering-guide-uk-ltd-high-ticket-export',
        '/wise-vs-uk-banks-non-residents',
        '/revolut-business-vs-wise-business-uk-ltd-2026',
        '/payoneer-business-account-uk-ltd-setup-guide-2026',
        '/business-banking-uk-ltd-non-residents',
        '/bangalore-fintech-startups-uk-ltd',
        '/dhaka-garment-exporters-uk-ltd-guide-2026',
        '/colombo-call-centers-bpo-uk-company',
        '/nepal-it-freelancers-uk-ltd-payment-gateways',
    })

    # Check for unreachable published articles
    unreachable = []
    for slug in published_slugs:
        is_reachable = slug in redirect_sources or slug in static_routes
        if not is_reachable:
            unreachable.append(slug)

    print("\n1. PUBLISHED BLOG ARTICLES")
    print(f"   Total published: {len(published)}")
    print(f"   Missing direct routes: {len(unreachable)}")
    for slug in sorted(unreachable):
        print(f"     MISSING ROUTE: /blog/{slug}")

    # Check for unreachable static routes
    unreachable_static = static_routes - published_slugs
    # Filter to only ones that look like blog routes
    blog_unreachable = [r for r in unreachable_static if r.startswith('/blog/')]
    print(f"\n2. STATIC ROUTES WITHOUT ENTRIES")
    for r in blog_unreachable[:20]:
        print(f"     NO ENTRY: {r}")

    # Check redirects pointing to non-existent
    print("\n3. REDIRECT TARGETS CHECK")
    broken_redirects = []
    for r in redirects_data:
        target = r.get('to', '')
        if target.startswith('/blog/'):
            if target not in published_slugs:
                broken_redirects.append((r['from'], target))
    if broken_redirects:
        for src, tgt in broken_redirects:
            print(f"     BROKEN: {src} -> {tgt}")
    else:
        print("   No broken redirect targets found")

    # Articles with missing meta
    missing_meta = [a['id'] for a in published if not a.get('metaTitle') or not a.get('metaDescription')]
    print(f"\n4. ARTICLES WITH MISSING META")
    if missing_meta:
        for aid in missing_meta:
            article = next(a for a in published if a['id'] == aid)
            print(f"     ID {aid}: {article.get('title')[:60]}")
    else:
        print("   All published articles have complete meta")

    # Articles with missing images
    missing_image = [a['id'] for a in published if not a.get('image')]
    print(f"\n5. ARTICLES WITH MISSING IMAGES")
    if missing_image:
        for aid in missing_image:
            article = next(a for a in published if a['id'] == aid)
            print(f"     ID {aid}: {article.get('title')[:60]}")
    else:
        print("   All published articles have images")

    # Articles without focus keyword
    no_focus = [a['id'] for a in published if not a.get('focusKeyword')]
    print(f"\n6. ARTICLES WITHOUT FOCUS KEYWORD")
    if no_focus:
        for aid in no_focus[:10]:
            article = next(a for a in published if a['id'] == aid)
            print(f"     ID {aid}: {article.get('title')[:60]}")
    else:
        print("   All published articles have focus keywords")

    # Categories
    categories = {}
    for a in published:
        cat = a.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    print("\n7. CATEGORY DISTRIBUTION")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"     {cat}: {count}")

    # Check for duplicate meta titles
    titles = {}
    for a in published:
        t = a.get('metaTitle', '')
        if t in titles:
            print(f"\n8. DUPLICATE META TITLES: {t}")
        else:
            titles[t] = True

    # Check for orphaned blog articles (not reachable)
    total_reachable = len(published_slugs - unreachable)
    print(f"\n9. REACHABILITY SUMMARY")
    print(f"   Published: {len(published)}")
    print(f"   Reachable via routes/redirects: {total_reachable}")
    print(f"   Unreachable: {len(unreachable)}")

    print("\n" + "=" * 60)
    print("AUDIT COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    audit()
