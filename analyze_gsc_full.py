import csv, os
from collections import defaultdict

BASE = 'C:/Gitub-Projects/UKLtdRegistration/performance_extracted'

def load_csv(filename):
    path = BASE.replace('\\', '/') + '/' + filename
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

# ===== 1. MONTHLY TREND from Chart.csv =====
chart = load_csv('Chart.csv')
chart = [r for r in chart if r['Clicks'].strip().isdigit() and r['Impressions'].strip().isdigit()]
print("=" * 70)
print("MONTHLY TREND (Nov 2025 - Oct 2026)")
print("=" * 70)
monthly = defaultdict(lambda: {'clicks': 0, 'impressions': 0})
for r in chart:
    month = r['Date'][:7]
    monthly[month]['clicks'] += int(r['Clicks'])
    monthly[month]['impressions'] += int(r['Impressions'])

for month in sorted(monthly.keys()):
    m = monthly[month]
    ctr = (m['clicks'] / m['impressions'] * 100) if m['impressions'] > 0 else 0
    print(f"  {month}: {m['clicks']:,} clicks, {m['impressions']:,} impressions, CTR: {ctr:.3f}%")

all_clicks = sum(m['clicks'] for m in monthly.values())
all_imp = sum(m['impressions'] for m in monthly.values())
print(f"\n  TOTAL: {all_clicks:,} clicks, {all_imp:,} impressions, avg CTR: {all_clicks/all_imp*100:.3f}%")

# ===== 2. TOP 20 QUERIES =====
queries = load_csv('Queries.csv')
queries = [r for r in queries if r['Top queries'].strip() != '']
print("\n" + "=" * 70)
print("TOP 20 SEARCH QUERIES")
print("=" * 70)
queries_sorted = sorted(queries, key=lambda x: int(x['Clicks']), reverse=True)
print(f"\n{'Rank':<5} {'Query':<45} {'Clicks':>8} {'Imp':>10} {'CTR':>8} {'Pos':>8}")
print("-" * 85)
for i, r in enumerate(queries_sorted[:20]):
    ctr = float(r['CTR'].replace('%', ''))
    pos = float(r['Position'])
    print(f"{i+1:<5} {r['Top queries']:<45} {int(r['Clicks']):>8} {int(r['Impressions']):>10} {ctr:>7.2f}% {pos:>8.2f}")

# Zero-click high-impression queries (big opportunity)
zero_click = [r for r in queries if int(r['Clicks']) == 0 and int(r['Impressions']) > 300]
print(f"\n\nZERO-CLICK HIGH-IMPPRESSION QUERIES (|imp|>300): {len(zero_click)}")
print(f"{'Query':<45} {'Clicks':>8} {'Imp':>10} {'Pos':>8} {'Intent':<30}")
print("-" * 110)
for r in sorted(zero_click, key=lambda x: int(x['Impressions']), reverse=True)[:25]:
    pos = float(r['Position'])
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
    print(f"{r['Top queries']:<45} {int(r['Clicks']):>8} {int(r['Impressions']):>10} {pos:>8.2f} {intent:<30}")
