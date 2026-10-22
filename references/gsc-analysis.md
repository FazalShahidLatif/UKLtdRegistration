# GSC Performance Analysis Script

A reusable Python script for processing Google Search Console (GSC) performance export CSVs and identifying SEO optimization opportunities.

## Input files (from GSC download)
- `Chart.csv` — Daily trend data (Date, Clicks, Impressions, CTR, Position)
- `Queries.csv` — Top search queries (Top queries, Clicks, Impressions, CTR, Position)
- `Pages.csv` — Top pages (Top pages, Clicks, Impressions, CTR, Position)
- `Countries.csv` — Geographic breakdown (Country, Clicks, Impressions, CTR, Position)
- `Devices.csv` — Device breakdown (Device, Clicks, Impressions, CTR, Position)
- `Search appearance.csv` — Rich results (Search Appearance, Clicks, Impressions, CTR, Position)

## Analysis workflow

### Step 1: Monthly trend
```python
chart = load_csv('Chart.csv')
chart = [r for r in chart if r['Clicks'].strip().isdigit() and r['Impressions'].strip().isdigit()]
monthly = defaultdict(lambda: {'clicks': 0, 'impressions': 0})
for r in chart:
    month = r['Date'][:7]
    monthly[month]['clicks'] += int(r['Clicks'])
    monthly[month]['impressions'] += int(r['Impressions'])
```

### Step 2: Top queries
```python
queries = load_csv('Queries.csv')
queries = [r for r in queries if r['Top queries'].strip() != '']
queries_sorted = sorted(queries, key=lambda x: int(x['Clicks']), reverse=True)
```

### Step 3: Zero-click high-impression opportunities
```python
zero_click = [r for r in queries if int(r['Clicks']) == 0 and int(r['Impressions']) > 300]
# Sort by impressions descending
```

### Step 4: Low-CTR high-impression pages
```python
Pages = load_csv('Pages.csv')
low_ctr = [r for r in pages if float(r['CTR'].replace('%', '')) < 0.05 and int(r['Impressions']) > 1000]
# Sort by impressions descending — these are the highest-priority pages
```

### Step 5: Country/device breakdown
```python
countries = load_csv('Countries.csv')
devices = load_csv('Devices.csv')
```

## Output
Print a structured report:
1. Monthly trend table
2. Top 20 queries
3. Zero-click high-impression queries with intent classification
4. Low-CTR high-impression pages (highest priority)
5. Country/device breakdown
6. Rich result opportunities (Search appearance)

## Intent classification for zero-click queries
```python
q = r['Top queries'].lower()
if 'register' in q or 'formation' in q or 'set up' in q or 'incorporation' in q:
    intent = "Transactional (form/reg)"
elif ' vs ' in q or 'comparison' in q or 'difference' in q:
    intent = "Information (compare)"
elif 'guide' in q or 'how to' in q or 'step by step' in q or 'requirements' in q or 'rules' in q:
    intent = "Informational (guide)"
elif 'vat' in q or 'tax' in q or 'accounting' in q:
    intent = "Transactional/Info (tax)"
elif 'price' in q or 'cost' in q:
    intent = "Transactional (price)"
else:
    intent = "Informational"
```

## Pitfalls
- **Path handling on Windows (execute_code)**: `os.path.join('C:/path', 'file.csv')` converts to `'C:\\path\\file.csv'` (double backslashes). Use `BASE + '/' + filename` instead.
- **Filter empty rows**: GSC exports contain many zero-rows. Always filter `r['Clicks'].strip().isdigit()` and `r['Impressions'].strip().isdigit()`.
- **CTR percent format**: Stored as string like `'0.51%'`. Remove `%` and convert to float.
- **Position decimal**: May be stored as string like `'66.87'`. Convert to float when comparing.
- **Threshold adjustment**: Zero-click threshold `> 300` is a starting point; adjust based on traffic volume. For low-traffic sites, `> 100` may be more appropriate.
