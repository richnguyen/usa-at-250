"""Fetch today's official state flags (as maintained on Wikimedia Commons) as small PNGs, with credits."""
import json, sys, os, re, time, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from commons import get, clean, UA
B = sys.argv[1]; OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
C = json.loads(os.popen(f'node -e "process.stdout.write(JSON.stringify(require(\'{B}/content.js\').STATES))"').read())
title = {p: f"File:Flag of {'Georgia (U.S. state)' if p == 'GA' else v[0]}.svg" for p, v in C.items()}
meta = {}
ts = list(title.items())
for i in range(0, len(ts), 10):
    chunk = ts[i:i + 10]
    d = get({"action": "query", "titles": "|".join(t for _, t in chunk), "prop": "imageinfo",
             "iiprop": "url|size|extmetadata|timestamp", "iiurlwidth": "120"})
    norm = {n["from"]: n["to"] for n in d["query"].get("normalized", [])}
    pages = {p["title"]: p for p in d["query"]["pages"]}
    for p, t in chunk:
        pg = pages.get(norm.get(t, t))
        if not pg or "imageinfo" not in pg: print("MISSING", p, t, flush=True); continue
        ii = pg["imageinfo"][0]; m = ii.get("extmetadata", {})
        meta[p] = {"title": pg["title"], "thumb": re.sub(r"\?.*$", "", ii["thumburl"]).replace("thumb.wikimedia.org", "upload.wikimedia.org"),
                   "page": ii["descriptionurl"], "license": clean(m.get("LicenseShortName", {}).get("value", "")),
                   "updated": ii.get("timestamp", "")[:10], "w": ii["width"], "h": ii["height"]}
    time.sleep(1.5)
json.dump(meta, open(B + "/state-flags-meta.json", "w"), indent=1)
print("meta", len(meta), flush=True)
for p, m in meta.items():
    out = f"{OUT}/{p.lower()}.png"
    if os.path.exists(out): continue
    for i in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(m["thumb"], headers={"User-Agent": UA}), timeout=60) as r: data = r.read()
            open(out, "wb").write(data); print("saved", p, len(data), flush=True); break
        except Exception as e:
            print("retry", p, getattr(e, "code", e), flush=True); time.sleep(5 * (i + 1))
    time.sleep(2)
print("done", len([f for f in os.listdir(OUT) if f.endswith('.png')]), flush=True)
