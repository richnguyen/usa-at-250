"""One request per query: search Commons files and get image info together."""
import sys, json, time, os, urllib.parse, urllib.request, re, html
UA = "USA250HistoryExplorer/1.0 (https://claude.ai; educational non-commercial) python-urllib"
def clean(s):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or ""))).strip()
def q(query, n=6):
    p = {"action": "query", "generator": "search", "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": str(n),
         "prop": "imageinfo", "iiprop": "url|size|extmetadata|mime", "iiurlwidth": "600", "format": "json", "formatversion": "2"}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    for i in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                d = json.loads(r.read().decode())
            if "error" in d: time.sleep(5 * (i + 1)); continue
            pages = sorted(d.get("query", {}).get("pages", []), key=lambda p: p.get("index", 99))
            out = []
            for pg in pages:
                if "imageinfo" not in pg: continue
                ii = pg["imageinfo"][0]; m = ii.get("extmetadata", {})
                g = lambda k: clean(m.get(k, {}).get("value", ""))
                out.append({"title": pg["title"], "thumb": ii.get("thumburl"), "w": ii.get("width"), "h": ii.get("height"),
                            "mime": ii.get("mime"), "page": ii.get("descriptionurl"), "artist": g("Artist")[:80],
                            "license": g("LicenseShortName"), "date": g("DateTimeOriginal")[:40], "desc": g("ImageDescription")[:160]})
            return out
        except urllib.error.HTTPError as e:
            ra = e.headers.get("retry-after"); time.sleep(int(ra) + 1 if ra and ra.isdigit() else 5 * (i + 1))
        except Exception:
            time.sleep(5 * (i + 1))
    return None
if __name__ == "__main__":
    rows = [l.rstrip("\n").split("\t") for l in open(sys.argv[1]) if l.strip()]
    outp = sys.argv[2]
    out = json.load(open(outp)) if os.path.exists(outp) else {}
    for key, query in rows:
        if out.get(key): continue
        out[key] = q(query) or []
        json.dump(out, open(outp, "w"), indent=1)
        print(key, len(out[key]), flush=True)
        time.sleep(1.2)
