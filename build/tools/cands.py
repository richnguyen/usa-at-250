import json, sys
d = json.load(open(sys.argv[1]))
keys = sys.argv[2:] or list(d)
for k in keys:
    v = d.get(k, [])
    c = [x for x in v if not x['title'].lower().endswith(('.pdf', '.djvu', '.svg', '.webm', '.ogv')) and min(x['w'] or 0, x['h'] or 0) >= 250][:5]
    print(k + ':', ' || '.join(f"{i}){x['title'][5:75]} [{x['w']}x{x['h']},{x['license'][:12]}]" for i, x in enumerate(c)))
