"""Resolve chosen Commons files, download resized copies, and write images.json with credits."""
import json, sys, os, re, io, time, glob, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from commons import info, UA
from PIL import Image

B = sys.argv[1]; IMG = sys.argv[2]
known = {}
for f in glob.glob(B + '/img-search/*results*.json'):
    for v in json.load(open(f)).values():
        for x in v: known[x['title'][5:]] = x
rows = [l.rstrip('\n').split('\t') for l in open(B + '/img-search/select.tsv') if l.strip()]
def resolve(name):
    if name.endswith('*'):
        m = [t for t in known if t.startswith(name[:-1])]
        if not m: raise SystemExit('unresolved ' + name)
        return sorted(m, key=len)[0]
    return name
sel = [(r[0], resolve(r[1]), r[2], r[3] if len(r) > 3 else '', r[4] if len(r) > 4 else '') for r in rows]
ill = [s for s in sel if s[0][0] == 'i']; por = [s for s in sel if s[0][0] == 'p']
# reuse metadata already collected by the searches; only ask the API about anything new
meta = {}
for f in glob.glob(B + '/img-search/guess-results.json'):
    for v in json.load(open(f)).values():
        for x in v: known.setdefault(x['title'][5:], x)
def sized(m, width):
    t = m.get('thumb') or ''
    if not t or (m.get('w') or 0) <= width: return t
    return re.sub(r'/(\d+)px-', f'/{width}px-', t)
missing = []
for key, title, *_ in sel:
    m = known.get(title)
    if m and m.get('thumb'):
        meta['File:' + title] = dict(m, thumb=sized(m, 960 if key[0] == 'i' else 500))
    else: missing.append((key, title))
print('missing metadata:', missing, flush=True)
for key, title in missing:
    meta.update(info(['File:' + title], 960 if key[0] == 'i' else 500))

def clean_artist(a):
    a = re.sub(r'^\w+:', '', a or '')
    a = re.sub(r'(Unknown author)+', '', a, flags=re.I).strip(' ,;')
    if a.lower() in ('unattributed', 'unknown', 'anonymous'): a = ''
    return a[:100]
def clean_date(d):
    d = re.split(r'date QS|\bQS:', d or '')[0].strip()
    d = re.sub(r'\s+\d{1,2}:\d{2}(:\d{2})?$', '', d)
    return d[:30]

STD = [1280, 960, 500, 330, 250]
def std_thumbs(m, key):
    page = m['page'].split('/wiki/File:')[-1]
    name = urllib.parse.unquote(page)
    import hashlib
    h = hashlib.md5(name.encode()).hexdigest()
    q = urllib.parse.quote(name)
    ext = '.jpg' if name.lower().endswith(('.tif', '.tiff')) else ''
    want = 960 if key[0] == 'i' else 330
    sizes = [s for s in STD if s <= want and s < (m.get('w') or 1e9)] or [250]
    return [f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{s}px-{q}{ext}' for s in sizes]

manifest = {}
for key, title, disp, artist, date in sel:
    m = meta.get('File:' + title)
    if not m: print('MISSING', key, title); continue
    url = (m['thumb'] or '').replace('thumb.wikimedia.org', 'upload.wikimedia.org')
    url = re.sub(r'\?.*$', '', url)
    out = f"{IMG}/{key}.jpg"
    # NODL=1 rebuilds images.json from the files already downloaded, without fetching anything
    if not os.path.exists(out) and os.environ.get('NODL'): continue
    if not os.path.exists(out):
        # Wikimedia only serves this client standard thumbnail sizes (https://w.wiki/GHai), never originals,
        # and a thumbnail must be narrower than the original
        urls = std_thumbs(m, key)
        data = None
        for i in range(8):
            u = urls[i % len(urls)]
            try:
                with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=90) as r: data = r.read()
                break
            except Exception as e:
                print('retry', key, getattr(e, 'code', e), re.search(r'/(\d+)px-', u).group(1) + 'px', flush=True)
                time.sleep(20 * (i + 1))
        if not data: print('FAILED', key, url); continue
        im = Image.open(io.BytesIO(data))
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA'); bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.split()[-1]); im = bg
        else: im = im.convert('RGB')
        maxw = 1100 if key[0] == 'i' else 360
        if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
        if key[0] == 'i' and im.height > 900: im = im.resize((round(im.width * 900 / im.height), 900), Image.LANCZOS)
        im.save(out, 'JPEG', quality=80, optimize=True, progressive=True)
        print('saved', key, flush=True)
        time.sleep(4)
    w, h = Image.open(out).size
    stop = key[1:]
    entry = {'file': f'img/{key}.jpg', 'title': disp, 'artist': artist or clean_artist(m['artist']),
             'date': date or clean_date(m['date']), 'license': m['license'] or 'see source', 'page': m['page'], 'w': w, 'h': h}
    manifest.setdefault(stop, {})['ill' if key[0] == 'i' else 'person'] = entry
json.dump(manifest, open(B + '/images.json', 'w'), indent=1, ensure_ascii=False)
tot = sum(os.path.getsize(f) for f in glob.glob(IMG + '/*.jpg'))
print('images', len(glob.glob(IMG + '/*.jpg')), 'total KB', tot // 1024)
