"""Générateur du site bêta CivZero : fiches Markdown -> pages HTML sans JavaScript.

Usage : python3 -I site.py <corpus> <sortie> [--web]
  --web : version publiée en ligne (accueil nommé accueil.html, police chargée en ligne,
          page d'entrée sans squelette HTML).
"""
import sys, re, html, pathlib, shutil, yaml, markdown

corpus, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
WEB = "--web" in sys.argv
HOME = "accueil.html" if WEB else "index.html"
DATE = "09/11/2026"
E = html.escape

cfg = yaml.safe_load((corpus / "besoins.yaml").read_text(encoding="utf-8"))
BLOCS, BESOINS, NIVEAUX = cfg["blocs"], cfg["besoins"], cfg["niveaux"]
_conf = corpus / "civzero.yaml"
CONF = (yaml.safe_load(_conf.read_text(encoding="utf-8")) or {}) if _conf.exists() else {}
DEPOT, EMAIL = (CONF.get("depot") or "").strip(), (CONF.get("email") or "").strip()

def envoi_rapport(fid):
    from urllib.parse import urlencode
    lignes = []
    if DEPOT:
        q = urlencode({"template": "rapport-reproduction.yml", "title": f"Rapport : {fid}",
                       "fiche": fid, "version": DATE})
        lignes.append(f'<a class="btn plein" href="https://github.com/{E(DEPOT)}/issues/new?{E(q)}">'
                      "[ ENVOYER LE RAPPORT SUR GITHUB ]</a>"
                      '<p class="src">Le formulaire s\'ouvre avec la fiche et la version déjà remplies. '
                      "Il faut un compte GitHub et une connexion.</p>")
    else:
        lignes.append('<p>[À DÉFINIR : dépôt GitHub du projet, dans <code>civzero.yaml</code>]</p>')
    if EMAIL:
        lignes.append(f'<p>Sans compte GitHub : copiez le texte ci-dessus et envoyez-le à '
                      f'<strong style="user-select:all">{E(EMAIL)}</strong></p>')
    else:
        lignes.append('<p>[À DÉFINIR : adresse e-mail des rapports, dans <code>civzero.yaml</code>]</p>')
    lignes.append('<p class="src">Hors-ligne, gardez le texte et envoyez-le dès que vous retrouvez du réseau. '
                  "Sur la station, les rapports seront enregistrés et repartiront par clé USB.</p>")
    return '<div class="panel" style="display:flex;flex-direction:column;gap:.75rem">' \
           '<span class="lab">Où l\'envoyer</span>' + "".join(lignes) + "</div>"

# ---------------------------------------------------------------- lecture des fiches
def md(s, inline=False):
    h = markdown.markdown(s, extensions=["tables"])
    if inline:
        h = re.sub(r"^<p>(.*)</p>$", r"\1", h.strip(), flags=re.S)
    return h.replace("<table>", '<div class="tablebox"><table>').replace("</table>", "</table></div>")

FICHES = []
for f in sorted((corpus / "fiches").glob("*.md")):
    txt = f.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.S)
    meta, body = yaml.safe_load(m.group(1)), m.group(2)
    body = re.sub(r"^# .*\n", "", body.lstrip(), count=1)
    parts = re.split(r"^## (\d)\. (.+)$", body, flags=re.M)
    intro, secs = parts[0].strip(), {}
    for i in range(1, len(parts), 3):
        secs[int(parts[i])] = parts[i + 2].strip()
    # étapes
    s3 = secs.get(3, "")
    sp = re.split(r"^### Étape (\d+) : (.+)$", s3, flags=re.M)
    preface, steps = sp[0].strip(), []
    for i in range(1, len(sp), 3):
        blk = sp[i + 2]
        def field(name):
            mm = re.search(rf"^- \*\*{name} :\*\* (.*)$", blk, re.M)
            return mm.group(1).strip() if mm else ""
        steps.append({"n": int(sp[i]), "titre": sp[i + 1].strip(),
                      "action": field("Action"), "verif": field("Vérification"), "source": field("Source")})
    # si ça coince
    coince = []
    for mm in re.finditer(r"^- \*\*(.+?)\*\*\s*(.*)$", secs.get(4, ""), re.M):
        label, rest = mm.group(1), mm.group(2)
        nums = [int(x) for x in re.findall(r"\d+", label.split("—")[0])] if label.startswith("Étape") else []
        probleme = label.split("—", 1)[1].strip() if "—" in label else label
        coince.append({"etapes": nums, "probleme": probleme, "texte": rest})
    # sécurité : risques propres
    s2 = secs.get(2, "")
    quote = [l[1:].strip() for l in s2.splitlines() if l.startswith(">")]
    risques = [l[2:].strip() for l in quote if l.startswith("- ")]
    for l in quote:
        mm = re.match(r"Risques propres à cette fiche : (.+)", l)
        if mm:
            risques.append(mm.group(1))
    s2_reste = "\n".join(l for l in s2.splitlines() if not l.startswith(">")).strip()
    # ressource : entre les deux modes
    s5 = secs.get(5, "")
    mm = re.search(r"^### Entre les deux modes\n(.*?)(?=^### |\Z)", s5, re.S | re.M)
    FICHES.append({"file": f, "num": f.name[:2], "meta": meta, "id": meta["id"], "intro": intro,
                   "secs": secs, "preface": preface, "steps": steps, "coince": coince,
                   "risques": risques, "s2_reste": s2_reste,
                   "modes_txt": mm.group(1).strip() if mm else "", "body": body})
BY_ID = {x["id"]: x for x in FICHES}

# libellés de danger : définis une seule fois, dans le Nodule Zéro
LABELS = {}
for l in BY_ID["nodule-zero"]["secs"][2].splitlines():
    mm = re.match(r">\s*- \*\*(VERT|ORANGE|ROUGE) \(\w+\)\*\* — (.+)$", l)
    if mm:
        LABELS[mm.group(1).lower()] = mm.group(2)
def label_court(niv):
    t = LABELS.get(niv, "")
    return "Libellé officiel en attente de relecture (Nodule Zéro)" if t.startswith("[À VALIDER") else t

FORMES = {
    "vert": ('<circle cx="14" cy="14" r="11" style="fill:var(--vert)"/>', "Cercle"),
    "orange": ('<polygon points="14,3 26,25 2,25" style="fill:var(--orange)"/>', "Triangle"),
    "rouge": ('<polygon points="9,2 19,2 26,9 26,19 19,26 9,26 2,19 2,9" style="fill:var(--rouge)"/>', "Octogone"),
}
def forme(niv, taille="1.5rem"):
    if niv not in FORMES:
        return ""
    shape, nom = FORMES[niv]
    return (f'<svg viewBox="0 0 28 28" width="{taille}" height="{taille}" role="img" '
            f'aria-label="{nom} : niveau {niv}">{shape}</svg>')

def min_tier(x): return min(x["meta"]["tier"])
def coupure_ok(x): return "coupure" in x["meta"]["mode"]

# ---------------------------------------------------------------- gabarit de page
CSS = """
/* Une colonne de terminal : barre d'état inversée, crochets pour les actions, la couleur réservée au danger. */
:root{
  --bg:#FFFFFF; --fg:#0A0A0A; --dim:#3D3D3D; --panel:#EDEDED; --line:#0A0A0A;
  --vert:#1A6B33; --orange:#A85400; --rouge:#A8201A;
  --mono:"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#0C0C0C; --fg:#ECE9E0; --dim:#B5B2A8; --panel:#1E1E1B; --line:#ECE9E0;
  --vert:#4CC76F; --orange:#FF9A2E; --rouge:#FF5A4F; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0C0C0C; --fg:#ECE9E0; --dim:#B5B2A8; --panel:#1E1E1B; --line:#ECE9E0;
  --vert:#4CC76F; --orange:#FF9A2E; --rouge:#FF5A4F; color-scheme:dark}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.0625rem;line-height:1.55}
a{color:inherit;text-underline-offset:.2em}
:focus-visible{outline:3px solid var(--fg);outline-offset:3px}
.bar{background:var(--fg);color:var(--bg);font-weight:600;font-size:.875rem;letter-spacing:.05em;
  padding-block:.65rem;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}
.bar .in{max-width:64rem;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem 1.5rem}
.bar a{text-decoration:none}
main,.foot{max-width:64rem;margin:0 auto;padding-block:1.5rem;
  padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}
main{display:flex;flex-direction:column;gap:1.25rem}
main>*{min-width:0}
.crumb{font-size:.9375rem;color:var(--dim);display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem 1rem}
.crumb strong{color:var(--fg)}
h1{font-size:1.625rem;line-height:1.25;margin:0;text-wrap:balance}
h2{font-size:.9375rem;letter-spacing:.08em;text-transform:uppercase;margin:0}
p{margin:0}
.lead{color:var(--dim);max-width:65ch}
.btn{display:flex;align-items:center;justify-content:center;min-height:4rem;padding:.5rem 1.25rem;
  border:2px solid var(--line);font-weight:700;text-decoration:none;text-align:center;letter-spacing:.03em}
.btn.plein{background:var(--fg);color:var(--bg)}
.row{display:flex;flex-wrap:wrap;gap:1rem}
.row>.btn{flex:1 1 15rem}
.choix{display:flex;flex-direction:column;gap:1rem}
.opt{display:flex;align-items:center;gap:1.25rem;min-height:5.5rem;padding:1rem 1.25rem;border:2px solid var(--line);text-decoration:none}
.opt>span{min-width:0}
.opt .t{display:block;font-size:1.1875rem;font-weight:600;line-height:1.35}
.opt .s{display:block;color:var(--dim);font-size:.9375rem}
.opt .k{flex:none;font-weight:700;width:5.5rem}
.opt .go{flex:none;margin-left:auto;font-weight:700;font-size:1.5rem}
.opt .note{display:block;font-size:.8125rem;font-weight:700;letter-spacing:.06em;margin-top:.35rem}
.opt.vide{border-style:dashed;color:var(--dim)}
.opt.vide .go{font-size:.8125rem;letter-spacing:.06em}
.tuiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:1rem}
.tuile{display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem;min-height:9rem;padding:1rem 1.125rem;border:2px solid var(--line);text-decoration:none}
.tuile .n{font-size:.875rem;font-weight:600;color:var(--dim)}
.tuile .t{display:block;font-size:1.625rem;font-weight:700;letter-spacing:.04em}
.tuile .s{display:block;color:var(--dim);font-size:.9375rem}
.avenir{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.75rem;color:var(--dim);font-size:.875rem}
.avenir div{border:2px dashed currentColor;padding:.85rem 1rem;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem .75rem;font-weight:600}
.mode{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.mode a,.mode strong{min-height:3rem;padding:.4rem 1rem;border:2px solid var(--line);font-weight:700;text-decoration:none;display:flex;align-items:center}
.mode strong{background:var(--fg);color:var(--bg)}
.mode .lab{margin-right:.5rem}
.danger{border:2px solid var(--line);padding:1rem 1.25rem;display:flex;gap:1rem;align-items:flex-start}
.danger svg{flex:none}
.danger>div{min-width:0}
.danger .niv{font-weight:700;letter-spacing:.08em;font-size:1.125rem}
.danger ul{margin:.5rem 0 0;padding-left:1.25rem}
.danger li+li{margin-top:.25rem}
.danger details{border:0;margin-top:.35rem}
.danger summary{min-height:2.75rem;padding:.5rem 0;font-size:.875rem;letter-spacing:.06em}
.badges{display:flex;flex-wrap:wrap;gap:.5rem}
.badge{border:2px solid currentColor;padding:.15rem .55rem;font-size:.8125rem;font-weight:700;letter-spacing:.07em}
.badge.trame{background:repeating-linear-gradient(45deg,transparent 0 6px,var(--panel) 6px 12px)}
.panel{background:var(--panel);padding:1rem 1.25rem}
.lab{display:block;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.action{font-size:1.5rem;line-height:1.4;font-weight:600;max-width:46ch}
.src{font-size:.875rem;color:var(--dim)}
.prog{font-weight:700;display:flex;flex-wrap:wrap;gap:.25rem 1rem;align-items:baseline}
details{border:2px solid var(--line)}
summary{min-height:3.5rem;padding:1rem 1.25rem;font-weight:700;cursor:pointer}
details>div{padding:0 1.25rem 1rem;display:flex;flex-direction:column;gap:.75rem}
.etapes{margin:0;padding-left:2.25rem;display:flex;flex-direction:column;gap:.35rem}
.prose{max-width:72ch;overflow-wrap:anywhere;display:flex;flex-direction:column;gap:.85rem}
.prose h2{margin-top:1rem}
.prose h3{font-size:1.0625rem;margin:.5rem 0 0}
.prose ul,.prose ol{margin:0;padding-left:1.5rem}
.prose blockquote{margin:0;border:2px solid var(--line);padding:.75rem 1rem}
.prose code{background:var(--panel);padding:0 .25rem}
.tablebox{overflow-x:auto}
table{border-collapse:collapse;font-size:.9375rem}
th,td{border:1px solid var(--line);padding:.45rem .65rem;text-align:left;vertical-align:top}
th{font-weight:700}
.legende{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;align-items:center;font-size:.9375rem}
.legende span{display:flex;gap:.5rem;align-items:center}
textarea{width:100%;min-height:26rem;font:inherit;font-size:1rem;line-height:1.5;color:var(--fg);background:var(--bg);border:2px solid var(--line);padding:1rem}
.vide-grand{font-size:2.5rem;font-weight:700;line-height:1}
.foot{font-size:.875rem;color:var(--dim);border-top:2px solid var(--line);display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;justify-content:space-between}
@media (max-width:30rem){h1{font-size:1.375rem}.action{font-size:1.3125rem}.opt{gap:.85rem;padding:.9rem 1rem}.opt .k{width:auto}}
"""

FONT = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&amp;display=swap">'
        if WEB else "")

PAGES = {}
def page(name, title, main, mode_txt="BÊTA"):
    head = (f'<title>{E(title)}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
            f'{FONT}\n<style>{CSS}</style>\n')
    content = (f'<header class="bar"><div class="in"><a href="{HOME}">CIVZERO // STATION HORS-LIGNE</a>'
               f'<span>SYNCHRO {DATE} · {E(mode_txt)}</span></div></header>\n'
               f'<main>\n{main}\n</main>\n'
               f'<footer class="foot"><span>Version bêta du {DATE}. Toutes les fiches sont des brouillons '
               f'rédigés avec l\'assistance d\'une IA, non relus : ne les appliquez pas comme sûres.</span>'
               f'<a href="toutes.html">Toutes les fiches</a></footer>\n')
    doc = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
           f'{head}</head>\n<body>\n{content}</body>\n</html>\n')
    PAGES[name] = doc
    return head + content

MODES = {"prepare": ("JE PRÉPARE", HOME), "coupure": ("ÇA A COUPÉ", "coupure.html")}
def nom_tier(u): return f"TIER {u}"

def badges(x, court=False):
    b = ['<span class="badge trame">▒ BROUILLON ▒</span>']
    if x["meta"].get("suspendu"):
        b.append('<span class="badge">EN SUSPENS</span>')
    for mo in ([] if court else x["meta"]["mode"]):
        b.append(f'<span class="badge">{MODES[mo][0]}</span>')
    return '<div class="badges">' + "".join(b) + "</div>"

def boite_danger(x, compact=False):
    niv = x["meta"]["danger"]
    if niv not in FORMES:
        return ""
    lis = ""
    if x["risques"]:
        lis = "<ul>" + "".join(f"<li>{md(r, True)}</li>" for r in x["risques"]) + "</ul>"
        if compact:
            lis = f'<details class="risques"><summary>RISQUES DE CETTE FICHE ({len(x["risques"])})</summary>{lis}</details>'
    taille = "2rem" if compact else "2.75rem"
    return (f'<section class="danger" aria-label="Niveau de danger">{forme(niv, taille)}<div>'
            f'<div class="niv">{niv.upper()}</div><p>{E(label_court(niv))}</p>{lis}</div></section>')

def crumb_fiche(x):
    b = x["meta"]["bloc"]
    bt = BLOCS[b]["titre"] if b in BLOCS else "SOCLE"
    return (f'<div class="crumb"><span>/ {bt} / <strong>{E(BESOINS[x["meta"]["besoin"]]["titre"])}</strong></span>'
            f'<a href="{HOME}">ACCUEIL</a></div>')

# ---------------------------------------------------------------- pages de fiche
for x in FICHES:
    m, fid, n = x["meta"], x["id"], len(x["steps"])
    pre = "f-" + fid
    # présentation
    gen = [c for c in x["coince"] if not c["etapes"]]
    variantes = " · ".join(f'{forme(v["danger"], "1rem")} {E(v["id"].replace("-", " "))}' for v in m.get("variantes") or [])
    suspens = (f'<p class="panel"><span class="lab">Fiche en suspens</span>{E(m["raison_suspension"])}</p>'
               if m.get("suspendu") else "")
    liste = "".join(f'<li><a href="{pre}-e{s["n"]}.html">{E(s["titre"])}</a></li>' for s in x["steps"])
    parts = [crumb_fiche(x), f"<h1>{E(m['titre'])}</h1>", badges(x), suspens, boite_danger(x)]
    if x["s2_reste"] or m["danger"] not in FORMES:
        parts.append(f'<div class="prose">{md(x["secs"][2] if m["danger"] not in FORMES else x["s2_reste"])}</div>')
    parts.append(f'<div class="panel"><span class="lab">Ce qu\'elle exige d\'avance</span>{E(m["exige_avance"])}'
                 + (f'<br><span class="lab" style="margin-top:.75rem">Variantes</span>{variantes}' if variantes else "")
                 + "</div>")
    parts.append(f'<div class="prose"><h2>Principe</h2>{md(x["secs"].get(1, ""))}</div>')
    if x["preface"]:
        parts.append(f'<div class="prose">{md(x["preface"])}</div>')
    if n:
        parts.append(f'<a class="btn plein" href="{pre}-e1.html">[ COMMENCER LE PAS-À-PAS : {n} ÉTAPES &gt; ]</a>')
        parts.append(f'<div><h2>Les étapes</h2><ol class="etapes">{liste}</ol></div>')
    if gen:
        parts.append('<div class="prose"><h2>Si ça coince</h2><ul>' + "".join(
            f'<li><strong>{md(c["probleme"], True)}</strong> {md(c["texte"], True)}</li>' for c in gen) + "</ul></div>")
    if x["modes_txt"]:
        parts.append(f'<div class="prose"><h2>Entre les deux modes</h2>{md(x["modes_txt"])}</div>')
    parts.append(f'<div class="row"><a class="btn" href="{pre}-complete.html">[ FICHE COMPLÈTE SUR UNE PAGE ]</a>'
                 f'<a class="btn" href="{pre}-rapport.html">[ FAIRE UN RAPPORT ]</a></div>')
    page(f"{pre}.html", f"{m['titre']} · CivZero", "\n".join(p for p in parts if p))

    # étapes
    for i, s in enumerate(x["steps"]):
        k = s["n"]
        barre = "■" * (i + 1) + "□" * (n - i - 1)
        loc = [c for c in x["coince"] if k in c["etapes"]]
        if loc:
            coin = ('<details><summary>SI ÇA COINCE SUR CETTE ÉTAPE</summary><div>' + "".join(
                f'<p><strong>{md(c["probleme"], True)}</strong> {md(c["texte"], True)}</p>' for c in loc) + "</div></details>")
        else:
            coin = (f'<p class="src">Aucun blocage documenté pour cette étape. '
                    f'<a href="{pre}-rapport.html">Signaler un blocage</a></p>')
        prev = (f'<a class="btn" href="{pre}-e{x["steps"][i-1]["n"]}.html">[ &lt; ÉTAPE PRÉCÉDENTE ]</a>' if i
                else f'<a class="btn" href="{pre}.html">[ &lt; PRÉSENTATION ]</a>')
        nxt = (f'<a class="btn plein" href="{pre}-e{x["steps"][i+1]["n"]}.html">[ ÉTAPE SUIVANTE &gt; ]</a>' if i < n - 1
               else f'<a class="btn plein" href="{pre}-rapport.html">[ TERMINÉ : FAIRE UN RAPPORT &gt; ]</a>')
        verif = (f'<div class="panel"><span class="lab">Vérification</span>{md(s["verif"], True)}</div>' if s["verif"] else "")
        src = f'<p class="src">Source : {md(s["source"], True)}</p>' if s["source"] else ""
        main = "\n".join(p for p in [
            crumb_fiche(x),
            f'<h1>{E(m["titre"])}</h1>', badges(x, court=True), boite_danger(x, compact=True),
            f'<div class="prog"><span>ÉTAPE {i+1}/{n} <span aria-hidden="true">[{barre}]</span></span>'
            f'<span style="font-weight:400;color:var(--dim)">{E(s["titre"])}</span></div>',
            f'<p class="action">{md(s["action"], True)}</p>', verif, src, coin,
            f'<div class="row">{prev}{nxt}</div>',
            f'<p class="src"><a href="{pre}-complete.html">Voir la fiche complète sur une seule page</a></p>'] if p)
        page(f"{pre}-e{k}.html", f"Étape {i+1} · {m['titre']} · CivZero", main)

    # fiche complète
    body = x["body"].replace("[Libellé officiel affiché depuis le Nodule Zéro]", label_court(m["danger"]))
    page(f"{pre}-complete.html", f"{m['titre']} (complète) · CivZero",
         "\n".join([crumb_fiche(x), f"<h1>{E(m['titre'])}</h1>", badges(x),
                    f'<div class="prose">{md(body)}</div>',
                    f'<div class="row"><a class="btn" href="{pre}.html">[ &lt; PRÉSENTATION ]</a>'
                    f'<a class="btn" href="{pre}-rapport.html">[ FAIRE UN RAPPORT ]</a></div>']))

    # rapport de reproduction
    modele = (f"RAPPORT DE REPRODUCTION — CivZero\n"
              f"Fiche : {fid} ({m['titre']})\nVersion du corpus : {DATE}\nStatut de la fiche : {m['statut']}\n\n"
              "Date :\nMilieu (urbain / rural / aride) :\nVariante suivie :\n"
              "Matériel utilisé, et son origine (récupération / achat) :\n"
              "Résultat (réussi / partiel / échec) :\nÉtape où ça a coincé :\n"
              "Ce qui a coincé, et ce que vous avez fait :\n"
              "Une étape vous a semblé fausse ou dangereuse ? Laquelle et pourquoi :\n"
              "Incident ou quasi-accident (oui / non, décrire) :\nPhoto (oui / non) :\n")
    page(f"{pre}-rapport.html", f"Rapport · {m['titre']} · CivZero", "\n".join([
        crumb_fiche(x), "<h1>&gt; Rapport de reproduction</h1>",
        f'<p class="lead">Vous avez suivi « {E(m["titre"])} », en entier ou en partie. Ce rapport sert à corriger la fiche '
        "et à la faire passer de brouillon à testée. Un échec est aussi utile qu'une réussite.</p>",
        '<label class="lab" for="rapport">Copiez ce texte et complétez-le</label>',
        f'<textarea id="rapport" spellcheck="false">{E(modele)}</textarea>',
        envoi_rapport(fid),
        f'<div class="row"><a class="btn" href="{pre}.html">[ &lt; RETOUR À LA FICHE ]</a>'
        f'<a class="btn" href="{HOME}">[ ACCUEIL ]</a></div>']))

# ---------------------------------------------------------------- entonnoir
def candidats(besoin): return [x for x in FICHES if x["meta"]["besoin"] == besoin]
def matches(besoin, u, mode):
    r = [x for x in candidats(besoin) if min_tier(x) <= u]
    return sorted(r, key=lambda x: (mode == "coupure" and not coupure_ok(x), x["meta"]["vague"], x["num"]))
def tier_utile(besoin):
    sets = [tuple(x["id"] for x in matches(besoin, u, "prepare")) for u in (0, 1, 2)]
    return len(set(sets)) > 1

def note_mode(x, mode):
    if mode == "coupure" and not coupure_ok(x):
        return f'<span class="note">À PRÉPARER AVANT · exige : {E(x["meta"]["exige_avance"])}</span>'
    return ""

def opt_fiche(x, mode):
    return (f'<a class="opt" href="f-{x["id"]}.html">{forme(x["meta"]["danger"], "1.75rem")}'
            f'<span><span class="t">{E(x["meta"]["titre"])}</span>'
            f'<span class="s">{"Prérequis de toutes les fiches" if x["meta"]["danger"] not in FORMES else "Danger estimé : " + x["meta"]["danger"]} · brouillon</span>{note_mode(x, mode)}</span>'
            f'<span class="go" aria-hidden="true">&gt;</span></a>')

def cible(mode, besoin):
    c = candidats(besoin)
    if tier_utile(besoin):
        return f"e-{mode}-{besoin}.html"
    if len(c) == 1:
        return f"f-{c[0]['id']}.html"
    return f"e-{mode}-{besoin}-liste.html"

def liste_page(name, mode, besoin, fiches, titre, retour):
    lab, home = MODES[mode]
    page(name, f"{BESOINS[besoin]['titre']} · CivZero", "\n".join([
        f'<div class="crumb"><span>/ {BLOCS[BESOINS[besoin]["bloc"]]["titre"]} / <strong>{E(BESOINS[besoin]["titre"])}</strong></span>'
        f'<span>MODE : {lab}</span></div>',
        f"<h1>&gt; {titre}</h1>",
        '<div class="choix">' + "".join(opt_fiche(x, mode) for x in fiches) + "</div>",
        f'<div class="row"><a class="btn" href="{retour}">[ &lt; REVENIR ]</a>'
        f'<a class="btn" href="{home}">[ ACCUEIL ]</a></div>']), mode_txt=lab)

for mode, (lab, home) in MODES.items():
    for bloc, bd in BLOCS.items():
        bes = [b for b, d in BESOINS.items() if d["bloc"] == bloc]
        opts = []
        for b in bes:
            nb = len(candidats(b))
            opts.append(f'<a class="opt" href="{cible(mode, b)}"><span><span class="t">{E(BESOINS[b]["titre"])}</span>'
                        f'<span class="s">{E(BESOINS[b]["description"])} · {nb} fiche{"s" if nb > 1 else ""}</span></span>'
                        f'<span class="go" aria-hidden="true">&gt;</span></a>')
        page(f"e-{mode}-{bloc}.html", f"{bd['titre'].capitalize()} · CivZero", "\n".join([
            f'<div class="crumb"><span>/ <strong>{bd["titre"]}</strong></span><span>MODE : {lab}</span></div>',
            "<p class=\"prog\">QUESTION 1 · LE BESOIN</p>",
            "<h1>&gt; Que cherchez-vous ?</h1>",
            '<div class="choix">' + "".join(opts) + "</div>",
            f'<div class="row"><a class="btn" href="{home}">[ &lt; REVENIR ]</a></div>']), mode_txt=lab)

        for b in bes:
            c = candidats(b)
            if not tier_utile(b):
                if len(c) > 1:
                    liste_page(f"e-{mode}-{b}-liste.html", mode, b, matches(b, 2, mode),
                               f"{len(c)} fiches pour ce besoin", f"e-{mode}-{bloc}.html")
                continue
            dispo, vides = [], []
            for u in (0, 1, 2):
                r = matches(b, u, mode)
                t, s = NIVEAUX[u]
                mene = ""
                if len(r) == 1:
                    href, right, cls = f"f-{r[0]['id']}.html", '<span class="go" aria-hidden="true">&gt;</span>', "opt"
                    mene = f"Mène à : {r[0]['meta']['titre']}"
                elif r:
                    href, right, cls = f"e-{mode}-{b}-t{u}.html", '<span class="go" aria-hidden="true">&gt;</span>', "opt"
                    mene = f"{len(r)} fiches"
                    liste_page(href, mode, b, r, f"{len(r)} fiches avec ce matériel", f"e-{mode}-{b}.html")
                else:
                    href, right, cls = f"e-{mode}-{b}-t{u}.html", '<span class="go">AUCUNE FICHE</span>', "opt vide"
                    proches = [x for x in c]
                    page(href, f"Aucune fiche · CivZero", "\n".join([
                        f'<div class="crumb"><span>/ {bd["titre"]} / <strong>{E(BESOINS[b]["titre"])}</strong></span>'
                        f'<span>MODE : {lab}</span></div>',
                        '<p class="vide-grand" aria-hidden="true">[ ∅ ]</p>',
                        "<h1>Aucune fiche pour cette situation</h1>",
                        '<p class="lead">Le corpus ne contient pas encore de fiche qui réponde à ces critères. '
                        "Sur la station, cette demande sans réponse sera enregistrée pour orienter l'écriture des prochaines fiches.</p>",
                        f'<div class="panel"><span class="lab">Besoin</span>{E(BESOINS[b]["titre"])}'
                        f'<span class="lab" style="margin-top:.75rem">Matériel</span>{nom_tier(u)} · {E(t)}</div>',
                        "<h2>Fiches les plus proches dans le corpus</h2>",
                        '<div class="choix">' + "".join(
                            opt_fiche(x, mode).replace('<span class="s">', f'<span class="s">Demande : TIER {min_tier(x)} · ', 1)
                            for x in proches) + "</div>",
                        f'<div class="row"><a class="btn plein" href="e-{mode}-{b}.html">[ MODIFIER LES CRITÈRES ]</a>'
                        f'<a class="btn" href="toutes.html">[ TOUTES LES FICHES ]</a></div>']), mode_txt=lab)
                o = (f'<a class="{cls}" href="{href}"><span class="k">{nom_tier(u)}</span>'
                     f'<span><span class="t">{E(t)}</span><span class="s">{E(s)}</span>'
                     + (f'<span class="note">{E(mene)}</span>' if mene else "") + f'</span>{right}</a>')
                (dispo if r else vides).append(o)
            page(f"e-{mode}-{b}.html", f"{BESOINS[b]['titre']} · CivZero", "\n".join([
                f'<div class="crumb"><span>/ {bd["titre"]} / <strong>{E(BESOINS[b]["titre"])}</strong></span>'
                f'<span>MODE : {lab}</span></div>',
                "<p class=\"prog\">QUESTION 2 · LE MATÉRIEL</p>",
                "<h1>&gt; Quel matériel avez-vous sous la main ?</h1>",
                '<div class="choix">' + "".join(dispo + vides) + "</div>",
                f'<div class="row"><a class="btn" href="e-{mode}-{bloc}.html">[ &lt; REVENIR ]</a></div>']), mode_txt=lab)

# ---------------------------------------------------------------- accueils
def accueil(mode):
    lab, home = MODES[mode]
    autre = "coupure" if mode == "prepare" else "prepare"
    sw = (f'<div class="mode"><span class="lab">Mode</span>'
          + "".join(f'<strong>{MODES[k][0]}</strong>' if k == mode else f'<a href="{MODES[k][1]}">{MODES[k][0]}</a>'
                    for k in ("prepare", "coupure")) + "</div>")
    expl = ("Vous avez le temps, Internet et la possibilité d'acheter ou de monter." if mode == "prepare"
            else "Vous faites avec ce qui est là. Les fiches qui demandaient une préparation sont signalées.")
    socle = [x for x in FICHES if x["meta"]["besoin"] == "commencer"]
    tu = []
    for bloc, bd in BLOCS.items():
        nb = len([b for b, d in BESOINS.items() if d["bloc"] == bloc])
        nf = len([x for x in FICHES if x["meta"]["bloc"] == bloc])
        tu.append(f'<a class="tuile" href="e-{mode}-{bloc}.html"><span class="n">{nb} besoins · {nf} fiches</span>'
                  f'<span><span class="t">{bd["titre"]}</span><span class="s">{E(bd["sous_titre"])}</span></span></a>')
    av = "".join(f"<div><span>{E(a)}</span><span>À VENIR</span></div>" for a in cfg["a_venir"])
    leg = "".join(f"<span>{forme(k, '1.25rem')}<strong>{k.upper()}</strong></span>" for k in ("vert", "orange", "rouge"))
    return "\n".join([
        sw, f'<p class="lead">{expl}</p>',
        "<h1>&gt; De quoi avez-vous besoin ?</h1>",
        "<h2>Commencer ici</h2>",
        '<div class="choix">' + "".join(opt_fiche(x, mode) for x in socle) + "</div>",
        "<h2>Les blocs</h2>", f'<div class="tuiles">{"".join(tu)}</div>',
        f'<div class="avenir">{av}</div>',
        f'<div class="legende"><strong>NIVEAUX DE DANGER :</strong>{leg}</div>',
        f'<div class="row"><a class="btn" href="toutes.html">[ TOUTES LES FICHES ]</a></div>'])

entree = page(HOME, "Station CivZero", accueil("prepare"), mode_txt="JE PRÉPARE")
page("coupure.html", "Station CivZero · Ça a coupé", accueil("coupure"), mode_txt="ÇA A COUPÉ")

# ---------------------------------------------------------------- toutes les fiches
rows = []
for v, t in [(1, "Vague 1 · sans station ni achat"), (2, "Vague 2 · avec la station"), (3, "Vague 3 · vers l'alternative")]:
    lignes = "".join(
        f'<tr><td>{x["num"]}</td><td><a href="f-{x["id"]}.html">{E(x["meta"]["titre"])}</a>'
        f'{" (en suspens)" if x["meta"].get("suspendu") else ""}</td>'
        f'<td>{forme(x["meta"]["danger"], "1rem")} {x["meta"]["danger"]}</td>'
        f'<td>{min_tier(x)}</td><td>{E(x["meta"]["exige_avance"])}</td></tr>'
        for x in FICHES if x["meta"]["vague"] == v)
    rows.append(f"<h2>{t}</h2><div class=\"tablebox\"><table><thead><tr><th>#</th><th>Fiche</th><th>Danger</th>"
                f"<th>Tier</th><th>Exige d'avance</th></tr></thead><tbody>{lignes}</tbody></table></div>")
page("toutes.html", "Toutes les fiches · CivZero", "\n".join([
    f'<div class="crumb"><span>/ <strong>TOUTES LES FICHES</strong></span><a href="{HOME}">ACCUEIL</a></div>',
    f"<h1>&gt; {len(FICHES)} fiches, toutes en brouillon</h1>",
    '<p class="lead">Danger estimé, à fixer par le Nodule Zéro après relecture. Le tier indique l\'outillage minimal.</p>'] + rows))

# ---------------------------------------------------------------- écriture
if out.exists():
    shutil.rmtree(out)
out.mkdir(parents=True)
for name, doc in PAGES.items():
    (out / name).write_text(doc, encoding="utf-8")
if WEB:
    (out / "_entree.html").write_text(entree, encoding="utf-8")

# vérification des liens internes
bad = []
for name, doc in PAGES.items():
    for href in re.findall(r'href="([^"#:]+\.html)"', doc):
        if href not in PAGES:
            bad.append(f"{name} -> {href}")
print(f"{len(PAGES)} pages écrites dans {out}")
print("Liens cassés :", bad if bad else "aucun")
