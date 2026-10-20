#!/usr/bin/env python3
"""Fix audit - check actual routes"""
import json, os, re

BASE = os.path.dirname(os.path.abspath(__file__))

# Load blog data
with open(os.path.join(BASE, 'content/blog/blog-articles.json')) as f:
    blog_data = json.load(f)
blog_articles = blog_data.get('articles', [])
all_slugs = set(a['slug'] for a in blog_articles)
# Published = has date
published = [a for a in blog_articles if a.get('publishedDate') or a.get('updatedDate')]
published_slugs = set(a['slug'] for a in published)

# Load redirects
with open(os.path.join(BASE, 'content/redirects.json')) as f:
    redirects_data = json.load(f)

# Load routes from pages.js
with open(os.path.join(BASE, 'routes/pages.js')) as f:
    pages_code = f.read()

# Extract all dynamic routes
route_patterns = re.findall(r"router\.get\((\[?['\"]([^'\"]+)['\"])", pages_code)
routes = set()
for pattern, route in route_patterns:
    # Handle pattern arrays like ['/path', '/path2']
    if pattern.startswith('[') and pattern.endswith(']'):
        arr = pattern[1:-1]
        for item in arr.split(','):
            routes.add(item.strip().strip("'\""))
    else:
        routes.add(route)

print(f"Routes found in pages.js: {routes}")
print(f"Total routes: {len(routes)}")

# Check blog routes
blog_prefix = '/blog/'
blog_routes = [r for r in routes if r.startswith(blog_prefix)]
print(f"\nBlog routes: {len(blog_routes)}")

# Check if all published articles are reachable
all_blog_routes = set(r for r in blog_routes)
missing_routes = []
for slug in published_slugs:
    expected = f'/blog/{slug}'
    if expected not in all_blog_routes and expected not in redirect_sources:
        # Check if any redirect points to this
        if not any(r.get('to') == expected for r in redirects_data):
            missing_routes.append(expected)

print(f"\nPublished articles: {len(published_slugs)}")
print(f"Direct blog routes: {len(all_blog_routes)}")
print(f"Missing routes: {len(missing_routes)}")
for m in missing_routes[:20]:
    print(f"  MISSING: {m}")
