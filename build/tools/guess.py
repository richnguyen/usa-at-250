import json, sys
sys.path.insert(0, sys.argv[1])
from commons import info
g = json.load(open(sys.argv[2]))
titles = ["File:" + t for v in g.values() for t in v]
meta = info(titles, 600)
out = {}
for k, v in g.items():
    out[k] = [dict(meta["File:" + t]) for t in v if meta.get("File:" + t)]
json.dump(out, open(sys.argv[3], "w"), indent=1)
for k, v in out.items():
    print(k, '|', ' || '.join(f"{x['title'][5:60]} [{x['w']}x{x['h']},{x['license'][:12]}]" for x in v) or '-- none')
