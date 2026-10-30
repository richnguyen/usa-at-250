"""Small Wikimedia Commons client with polite rate limiting.
Usage:
  commons.py info  "File:A.jpg" "File:B.jpg" ...   -> metadata for exact titles (batched)
  commons.py search "query" [limit]                 -> candidate file titles with sizes
"""
import json, sys, time, urllib.parse, urllib.request, re, html

UA = "USA250HistoryExplorer/1.0 (https://claude.ai; educational non-commercial) python-urllib"
API = "https://commons.wikimedia.org/w/api.php"

def get(params, tries=8):
    params = dict(params, format="json", formatversion="2", maxlag="5")
    url = API + "?" + urllib.parse.urlencode(params)
    delay = 3
    for _ in range(tries):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                d = json.loads(r.read().decode())
            if "error" in d:
                time.sleep(delay); delay = min(delay * 2, 40); continue
            return d
        except (urllib.error.URLError, TimeoutError) as e:
            if not isinstance(e, urllib.error.HTTPError):
                time.sleep(delay); delay = min(delay * 2, 40); continue
            ra = e.headers.get("retry-after") if hasattr(e, "headers") else None
            time.sleep(max(delay, int(ra) if ra and ra.isdigit() else delay))
            delay = min(delay * 2, 40)
    raise SystemExit("rate limited: " + url)

def clean(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    return html.unescape(re.sub(r"\s+", " ", s)).strip()

def info(titles, width=900):
    out = {}
    for i in range(0, len(titles), 10):
        d = get({"action": "query", "titles": "|".join(titles[i:i+10]), "prop": "imageinfo",
                 "iiprop": "url|size|extmetadata|mime", "iiurlwidth": str(width)})
        norm = {n["from"]: n["to"] for n in d["query"].get("normalized", [])}
        pages = {p["title"]: p for p in d["query"]["pages"]}
        for t in titles[i:i+10]:
            p = pages.get(norm.get(t, t))
            if not p or p.get("missing") or "imageinfo" not in p:
                out[t] = None; continue
            ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
            g = lambda k: clean(m.get(k, {}).get("value", ""))
            out[t] = {"title": p["title"], "thumb": ii.get("thumburl"), "w": ii.get("width"), "h": ii.get("height"),
                      "page": ii.get("descriptionurl"), "artist": g("Artist"), "license": g("LicenseShortName"),
                      "date": g("DateTimeOriginal"), "desc": g("ImageDescription")[:200], "credit": g("Credit")[:160]}
        time.sleep(1.5)
    return out

def search(q, limit=8):
    d = get({"action": "query", "list": "search", "srsearch": q, "srnamespace": "6", "srlimit": str(limit)})
    return [s["title"] for s in d["query"]["search"]]

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "info":
        print(json.dumps(info(sys.argv[2:]), indent=1))
    elif cmd == "search":
        res = search(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 8)
        meta = info(res, 300)
        for t in res:
            m = meta.get(t)
            if m: print(f"{t} | {m['w']}x{m['h']} | {m['license']} | {m['artist'][:50]} | {m['date'][:20]}")
