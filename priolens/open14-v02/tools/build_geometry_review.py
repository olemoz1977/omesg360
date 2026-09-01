from pathlib import Path
from PIL import Image
import html, json

BASE = Path('/tmp/open14-geometry-review')
SRC = BASE / 'src'
OUT = BASE / 'out'
SRC.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

ITEMS = [
    ('REST-A', 'REST', 'prisėsti / pailsėti', '20260730_215302742.png'),
    ('RESOURCE-B', 'RESOURCE', 'gauti / atidaryti dovaną', '20260731_050136952.png'),
    ('ORDER-A', 'ORDER', 'tvarka / paskirtos vietos', '20260730_230415808.png'),
    ('BELONGING-B', 'BELONGING', 'dalintis šiluma / būti kartu', '20260731_043300801.png'),
    ('KNOWLEDGE-A', 'KNOWLEDGE', 'mokytis / būti klasėje', '20260730_230227381.png'),
]

manifest = []
for exemplar, family, target, filename in ITEMS:
    p = SRC / filename
    im = Image.open(p).convert('RGB')
    w, h = im.size
    if not (w < h):
        raise SystemExit(f'{filename} is not portrait: {w}x{h}')
    side = w
    max_y = h - side
    offsets = {
        'top': 0,
        'center': max_y // 2,
        'bottom': max_y,
    }
    variants = []
    for name, y in offsets.items():
        crop = im.crop((0, y, side, y + side)).resize((640, 640), Image.Resampling.LANCZOS)
        out_name = f'{exemplar.lower()}_sq_{name}_v01.webp'
        crop.save(OUT / out_name, 'WEBP', quality=88, method=6)
        variants.append({'name': name, 'file': out_name, 'y': y})
    manifest.append({
        'exemplar': exemplar,
        'family': family,
        'target': target,
        'source': filename,
        'width': w,
        'height': h,
        'variants': variants,
    })

(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

cards = []
for item in manifest:
    source_url = f"/priolens-research-assets/Gallery/{item['source']}"
    variants_html = ''.join(
        f'''<figure><img src="/priolens-research-assets/Open14-geometry-v01/{v['file']}" alt=""><figcaption>{html.escape(v['name'])}</figcaption></figure>'''
        for v in item['variants']
    )
    cards.append(f'''
      <section class="card">
        <h2>{html.escape(item['exemplar'])} <small>{html.escape(item['family'])}</small></h2>
        <p><b>1 s tikslas:</b> {html.escape(item['target'])}</p>
        <div class="compare">
          <figure class="original"><img src="{source_url}" alt=""><figcaption>originalas · {item['width']}×{item['height']}</figcaption></figure>
          {variants_html}
        </div>
      </section>
    ''')

page = f'''<!doctype html>
<html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PrioLens Open14 · 1:1 crop review</title>
<style>
:root{{--bg:#f5f5f2;--card:#fff;--line:#ddd;--ink:#171717;--muted:#6d6d6d}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif}}main{{max-width:1100px;margin:auto;padding:20px 12px 60px}}h1{{font-size:28px;margin:0 0 8px}}.intro{{color:var(--muted);max-width:760px;margin:0 0 22px}}.card{{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;margin:14px 0}}h2{{margin:0 0 5px;font-size:20px}}h2 small{{font-size:12px;color:var(--muted);font-weight:600;margin-left:6px}}p{{margin:6px 0 12px}}.compare{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:start}}figure{{margin:0}}figure img{{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border:1px solid var(--line);border-radius:12px;background:#eee}}figure.original img{{aspect-ratio:auto;object-fit:contain;max-height:420px}}figcaption{{font-size:12px;color:var(--muted);text-align:center;margin-top:4px}}@media(max-width:720px){{.compare{{grid-template-columns:repeat(2,1fr)}}figure.original{{grid-column:1/3}}figure.original img{{max-height:420px;width:auto;max-width:100%;margin:auto}}}}
</style></head><body><main>
<h1>Open14 1:1 crop review</h1>
<p class="intro">Tik 5 dabartiniai stimulai nėra kvadratiniai. Čia originalai ir trys deterministiniai 1:1 crop variantai. Tai tik peržiūra: live <code>bank.json</code> nekeičiamas.</p>
{''.join(cards)}
</main></body></html>'''
(OUT / 'index.html').write_text(page, encoding='utf-8')
print('BUILT', len(manifest), 'portrait reviews')
