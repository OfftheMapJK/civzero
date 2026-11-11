import sys, re, pathlib, yaml

root = pathlib.Path(sys.argv[1])
fiches = sorted((root / "fiches").glob("*.md"))
RANK = {"vert": 0, "orange": 1, "rouge": 2}
REQ = ["id", "titre", "bloc", "besoin", "mode", "vague", "tier", "exige_avance",
       "origine_materiel", "variantes", "danger", "statut", "redaction", "prerequis", "maj"]

data, errors = [], []
for f in fiches:
    txt = f.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.S)
    if not m:
        errors.append(f"{f.name}: en-tête introuvable"); continue
    meta, body = yaml.safe_load(m.group(1)), m.group(2)
    for k in REQ:
        if k not in meta:
            errors.append(f"{f.name}: champ manquant « {k} »")
    vs = meta.get("variantes") or []
    if vs:
        top = max(vs, key=lambda v: RANK[v["danger"]])["danger"]
        if meta.get("danger") != top:
            errors.append(f"{f.name}: danger {meta.get('danger')} ≠ plus élevé des variantes ({top})")
    if meta.get("statut") != "brouillon":
        errors.append(f"{f.name}: statut différent de brouillon")
    for sec in ["## 1. Principe", "## 2. Sécurité", "## 3. Pas-à-pas", "## 4. Si ça coince", "## 5. Ressource"]:
        if sec not in body:
            errors.append(f"{f.name}: section manquante « {sec} »")
    lines = body.splitlines()
    points = []
    for i, line in enumerate(lines):
        for mm in re.finditer(r"\[À VALIDER : ([^\]]+)\]", line):
            ctx = next((l for l in reversed(lines[:i + 1]) if l.startswith("###") or l.startswith("## ")), "")
            points.append((ctx.lstrip("# ").strip(), mm.group(1)))
    sources = len(re.findall(r"\[SOURCE À TROUVER", body))
    data.append((f, meta, points, sources))

ids = {m["id"] for _, m, _, _ in data}
for f, m, _, _ in data:
    for p in m.get("prerequis") or []:
        if p not in ids:
            errors.append(f"{f.name}: prérequis inconnu « {p} »")

# README
out = ["# CivicNode — corpus de la phase 1 (bêta)", "",
       "Toutes les fiches sont au statut **brouillon** et rédigées avec l'assistance d'une IA. Aucune n'est à appliquer comme sûre avant relecture. Voir `RELECTURE.md`.", ""]
for v, label in [(1, "Vague 1 — sans station ni achat"), (2, "Vague 2 — avec la station"), (3, "Vague 3 — vers l'alternative")]:
    out += [f"## {label}", "", "| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |", "| --- | --- | --- | --- | --- | --- |"]
    for f, m, _, _ in data:
        if m["vague"] == v:
            tier = ", ".join(str(t) for t in m["tier"])
            susp = " *(en suspens)*" if m.get("suspendu") else ""
            out.append(f"| {f.name[:2]} | [{m['titre']}](fiches/{f.name}){susp} | {m['bloc']} | {tier} | {m['danger']} | {m['exige_avance']} |")
    out.append("")
(root / "README.md").write_text("\n".join(out), encoding="utf-8")

# RELECTURE
total = sum(len(p) for _, _, p, _ in data)
tsrc = sum(s for _, _, _, s in data)
r = ["# Cahier de relecture", "",
     f"{total} points à valider et {tsrc} sources à trouver, sur {len(data)} fiches. Les fiches marquées « relecture obligatoire » touchent une batterie : aucune valeur chiffrée n'y est utilisable avant relecture par un professionnel.", "",
     "Pour chaque point : cocher, écrire la réponse, indiquer la source et le nom du relecteur.", ""]
for f, m, pts, s in data:
    flag = " — **relecture obligatoire**" if m.get("relecture_obligatoire") else ""
    r += [f"## {f.name[:2]} · {m['titre']}{flag}", "",
          f"Danger estimé : {m['danger']} · Sources à trouver : {s}", ""]
    if pts:
        for ctx, q in pts:
            r.append(f"- [ ] **{ctx}** — {q}")
    else:
        r.append("- Aucun point à valider ; vérifier les sources.")
    r.append("")
(root / "RELECTURE.md").write_text("\n".join(r), encoding="utf-8")

print(f"{len(data)} fiches, {total} points à valider, {tsrc} sources à trouver")
print("ERREURS:" if errors else "Aucune erreur de structure.")
for e in errors:
    print(" -", e)
