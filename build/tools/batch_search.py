import sys, json, time
sys.path.insert(0, sys.argv[1])
from commons import search, info
rows = [l.rstrip("\n").split("\t") for l in open(sys.argv[2]) if l.strip()]
import os
out = json.load(open(sys.argv[3])) if os.path.exists(sys.argv[3]) else {}
for key, q in rows:
    if isinstance(out.get(key), list) and out[key]: continue
    try:
        res = search(q, 6)
        meta = info(res, 600) if res else {}
        out[key] = [dict(m, q=q) for t in res if (m := meta.get(t))]
    except SystemExit as e:
        out[key] = {"error": str(e)}
    time.sleep(1)
    json.dump(out, open(sys.argv[3], "w"), indent=1)
    print(key, len(out[key]) if isinstance(out[key], list) else out[key], flush=True)
