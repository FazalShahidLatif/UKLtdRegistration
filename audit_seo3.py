#!/usr/bin/env python3
"""SEO & Technical Audit — UK LTD Registration (revised)"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

def load_json(name):
    with open(os.path.join(BASE, name)) as f:
        return json.load(f)

def audit():
    print("=" * 60)
    print("UK LTD REGISTRATION — SEO & TECHNICAL AUDIT")
    print("=" * 60)

    # Load data
    blog_data = load_json('content/blog/blog-articles.json')
    articles = blog_data.get('articles', [])
    published = [a for a in articles if a.get('publishedDate') or a.get('updatedDate')]
    published_slugs = set(a['slug'] for a in published)

    redirects_data = load_json('content/redirects.json')
    redirect_sources = set(r['from'] for r in redirects_data)
    # Also map redirect targets to normalized slugs
    redirect_targets = set()
    for r in redirects_data:
        target = r.get('to', '')
        # Normalize: if target starts with /blog/, extract slug
        if target.startswith('/blog/'):
            redirect_targets.add(target.replace('/blog/', ''))
        elif target.startswith('/'):
            redirect_targets.add(target)

    # Load sitemap routes for static routes
    with open(os.path.join(BASE, 'routes/sitemap.js')) as f:
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
        '/uk-company-formation-for-residents', '/non-residents',
        '/ltd-formation', '/non-uk-resident-company', '/uk-residents',
        '/packages', '/services', '/contact', '/checklist-download',
        '/legal/review-policy', '/partners', '/success-stories',
        '/register-a-limited-company-uk', '/faq', '/about', '/register-company-england',
        '/register-company-scotland', '/register-company-wales',
        '/register-company-london', '/register-company-manchester',
        '/register-company-birmingham', '/register-company-leeds',
        '/register-company-edinburgh', '/regions/england', '/regions/scotland',
        '/regions/wales', '/regions/london', '/regions/birmingham',
        '/regions/manchester', '/regions/leeds', '/regions/edinburgh',
    })

    # ============================================================
    # 1. PUBLISHED BLOG ARTICLES & ROUTABILITY
    # ============================================================
    print("\n1. PUBLISHED BLOG ARTICLES")
    print(f"   Total published: {len(published)}")

    # Check which published blog articles are reachable
    unreachable = []
    for slug in published_slugs:
        # Direct routes are dynamic (/blog/:slug) - all are reachable
        # But check if any redirect points to this
        if slug not in redirect_sources and not any(r.get('to') == f'/blog/{slug}' for r in redirects_data):
            unreachable.append(slug)

    if unreachable:
        print(f"   Unreachable published articles: {len(unreachable)}")
        for slug in sorted(unreachable)[:15]:
            print(f"     /blog/{slug}")
    else:
        print("   All published articles reachable")

    # ============================================================
    # 2. REDIRECT TARGETS CHECK
    # ============================================================
    print("\n2. REDIRECT TARGETS CHECK")
    broken_redirects = []
    for r in redirects_data:
        target = r.get('to', '')
        if target.startswith('/blog/'):
            if target not in published_slugs:
                broken_redirects.append((r['from'], target))
        elif not target.startswith('/') or target.startswith('http'):
            broken_redirects.append((r['from'], target))

    if broken_redirects:
        print(f"   BROKEN redirect targets: {len(broken_redirects)}")
        for src, tgt in broken_redirects[:20]:
            print(f"     {src} -> {tgt}")
    else:
        print("   No broken redirect targets")

    # Check redirects pointing to non-existent blog URLs
    print("\n3. REDIRECT TARGETS THAT DON'T EXIST IN DATA")
    broken_hits = 0
    for r in redirects_data:
        target = r.get('to', '')
        if target.startswith('/blog/'):
            # Check if this blog URL exists in data
            found = any(a.get('slug') == target.replace('/blog/', '') for a in articles)
            if not found:
                print(f"     {r['from']} -> {target}")
                broken_hits += 1
    if broken_hits == 0:
        print("   All redirect targets exist")

    # ============================================================
    # 4. ARTICLES WITH MISSING META
    # ============================================================
    print("\n4. ARTICLES WITH MISSING META")
    missing_meta = [a for a in published if not a.get('metaTitle') or not a.get('metaDescription')]
    if missing_meta:
        for a in missing_meta:
            print(f"     ID {a['id']}: {a.get('title','')[:60]}")
    else:
        print("   All published articles have complete meta")

    # ============================================================
    # 5. ARTICLES WITH MISSING IMAGES
    # ============================================================
    print("\n5. ARTICLES WITH MISSING IMAGES")
    missing_image = [a for a in published if not a.get('image')]
    if missing_image:
        for a in missing_image:
            print(f"     ID {a['id']}: {a.get('title','')[:60]}")
    else:
        print("   All published articles have images")

    # ============================================================
    # 6. ARTICLES WITHOUT FOCUS KEYWORD
    # ============================================================
    print("\n6. ARTICLES WITHOUT FOCUS KEYWORD")
    no_focus = [a for a in published if not a.get('focusKeyword')]
    if no_focus:
        for a in no_focus:
            print(f"     ID {a['id']}: {a.get('title','')[:60]}")
    else:
        print("   All published articles have focus keywords")

    # ============================================================
    # 7. CATEGORY DISTRIBUTION
    # ============================================================
    print("\n7. CATEGORY DISTRIBUTION")
    categories = {}
    for a in published:
        cat = a.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"     {cat}: {count}")

    # ============================================================
    # 8. SITE-WIDE ROUTE COUNT
    # ============================================================
    print("\n8. SITE-LEVEL ROUTE SUMMARY")
    print(f"   Static routes (sitemap.js): {len(static_routes)}")
    print(f"   Blog dynamic routes: 1 (/blog/:slug)")
    print(f"   Total known routes: {len(static_routes) + 1}")

    # Count total articles
    all_article_slugs = set(a['slug'] for a in articles)
    print(f"\n9. CONTENT SUMMARY")
    print(f"   Published articles: {len(published)}")
    print(f"   Unpublished: {len(all_article_slugs) - len(published)}")
    print(f"   Categories: {len(categories)}")

    print("\n" + "=" * 60)
    print("AUDIT COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    audit()
