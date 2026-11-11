// Vérificateur du corpus : à lancer avant chaque construction (npm run verifier, et automatiquement avant npm run build).
// Il lit les fiches, la structure, les fiches prévues et les traductions, et signale en clair ce qui ne va pas.
// Erreur = le site serait faux ou incomplet : la construction s'arrête. Avertissement = à corriger, sans bloquer.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { loadCorpus } from '../src/lib/corpus.mjs';

const RACINE = path.resolve(process.cwd(), 'corpus');
const erreurs = [];
const avertissements = [];
const err = (ou, msg) => erreurs.push(`${ou} : ${msg}`);
const avert = (ou, msg) => avertissements.push(`${ou} : ${msg}`);

const HORIZONS = ['instant', 'hours', 'seasons'];
const DANGERS = ['vert', 'orange', 'rouge'];
const STATUTS = ['brouillon', 'documentee', 'testee', 'reproduite'];
// Seules ces licences permettent d'adapter une source dans le texte d'une fiche (voir le document sur les licences).
const LICENCES_ADAPTABLES = /^(domaine public|public domain|cc0( 1\.0)?|cc by( \d\.\d)?|cc by-sa( \d\.\d)?|licence ouverte( 2\.0)?|etalab( 2\.0)?|odbl( 1\.0)?)$/i;
const TYPES_ATTESTATION = ['testée', 'réalisée', 'confirmée', 'tested', 'made', 'confirmed'];
const TYPES_MEDIA = ['image', 'schema', 'video'];

const c = loadCorpus(RACINE, 'fr');
const { structure, prevues, conf } = c;
const { familles = [], socles = {}, domaines = {}, savoirs = {} } = structure;

// ---------------------------------------------------------------- structure
const socleDeFamille = new Map();
for (const fa of familles) {
  if (!fa.nom?.fr || !fa.nom?.en) err(`structure, famille ${fa.id}`, 'il manque le nom en français ou en anglais');
  for (const so of fa.socles || []) {
    if (!socles[so]) err(`structure, famille ${fa.id}`, `le socle « ${so} » n'existe pas`);
    if (socleDeFamille.has(so)) err(`structure, socle ${so}`, 'il appartient à deux familles');
    socleDeFamille.set(so, fa.id);
  }
}
for (const [so, s] of Object.entries(socles)) {
  if (!socleDeFamille.has(so)) err(`structure, socle ${so}`, "il n'appartient à aucune famille");
  for (const champ of ['nom', 'domaine', 'nom_explique']) {
    if (!s[champ]?.fr || !s[champ]?.en) err(`structure, socle ${so}`, `il manque « ${champ} » en français ou en anglais`);
  }
}
for (const [d, x] of Object.entries(domaines)) {
  if (!socles[x.socle]) err(`structure, domaine ${d}`, `le socle « ${x.socle} » n'existe pas`);
  if (!x.titre?.fr || !x.titre?.en) err(`structure, domaine ${d}`, 'il manque le titre en français ou en anglais');
}
for (const [sv, x] of Object.entries(savoirs)) {
  if (!domaines[x.domaine]) err(`structure, savoir ${sv}`, `le domaine « ${x.domaine} » n'existe pas`);
  if (!x.titre?.fr || !x.titre?.en) err(`structure, savoir ${sv}`, 'il manque le titre en français ou en anglais');
  if (x.principe && (!x.principe.fr || !x.principe.en)) err(`structure, savoir ${sv}`, 'le principe existe dans une seule langue');
  if (!x.principe) avert(`structure, savoir ${sv}`, "pas encore de principe (ce que toutes ses fiches ont en commun)");
  if (x.ordre && (!x.ordre.fr || !x.ordre.en)) err(`structure, savoir ${sv}`, "l'ordre de combinaison existe dans une seule langue");
}
const socleDuSavoir = (sv) => domaines[savoirs[sv]?.domaine]?.socle;

// ---------------------------------------------------------------- fiches
const ids = new Map();
const numeros = new Map();
for (const f of c.fiches) {
  const ou = `fiche ${f.file}`;
  const m = f.meta;
  if (!m.id) { err(ou, "il manque l'identifiant (id)"); continue; }
  if (ids.has(m.id)) err(ou, `identifiant « ${m.id} » déjà utilisé par ${ids.get(m.id)}`);
  ids.set(m.id, f.file);
  if (numeros.has(f.num)) err(ou, `numéro ${f.num} déjà utilisé par ${numeros.get(f.num)}`);
  numeros.set(f.num, f.file);
  if (!f.file.slice(3).startsWith(m.id)) avert(ou, `le nom du fichier ne reprend pas l'identifiant « ${m.id} »`);

  for (const champ of ['titre', 'socle', 'horizon', 'temps', 'vague', 'tier', 'exige_avance', 'danger', 'statut']) {
    if (m[champ] === undefined || m[champ] === '') err(ou, `il manque le champ « ${champ} »`);
  }
  if (m.horizon && !HORIZONS.includes(m.horizon)) err(ou, `horizon « ${m.horizon} » inconnu (permis : ${HORIZONS.join(', ')})`);
  if (m.danger && m.id !== 'nodule-zero' && !DANGERS.includes(m.danger)) err(ou, `danger « ${m.danger} » inconnu (permis : ${DANGERS.join(', ')})`);
  if (m.statut && !STATUTS.includes(m.statut)) err(ou, `statut « ${m.statut} » inconnu (permis : ${STATUTS.join(', ')})`);
  if (m.vague !== undefined && ![1, 2, 3].includes(m.vague)) err(ou, `vague « ${m.vague} » inconnue (permis : 1, 2, 3)`);
  if (m.tier !== undefined && (!Array.isArray(m.tier) || !m.tier.length || m.tier.some((t) => ![0, 1, 2].includes(t)))) {
    err(ou, 'le tier doit être une liste de 0, 1 ou 2, par exemple [0, 1]');
  }
  for (const v of m.variantes || []) {
    if (!DANGERS.includes(v.danger)) err(ou, `la variante « ${v.id} » a un danger inconnu « ${v.danger} »`);
  }

  // Rattachement à la structure
  if (m.socle && m.socle !== 'commencer' && !socles[m.socle]) err(ou, `le socle « ${m.socle} » n'existe pas`);
  if (!Array.isArray(m.savoirs)) err(ou, 'le champ « savoirs » doit être une liste, même vide : []');
  else {
    if (m.socle !== 'commencer' && !m.savoirs.length) err(ou, "la fiche n'appartient à aucun savoir");
    for (const sv of m.savoirs) if (!savoirs[sv]) err(ou, `le savoir « ${sv} » n'existe pas dans structure.yaml`);
    const principal = m.savoirs[0];
    if (principal && savoirs[principal] && m.socle !== socleDuSavoir(principal)) {
      avert(ou, `son socle « ${m.socle} » n'est pas celui de son savoir principal « ${principal} » (${socleDuSavoir(principal)})`);
    }
  }

  // Contenu
  if (!f.steps.length) err(ou, "aucune étape trouvée (titres attendus : « ### Étape 1 : … »)");
  const nums = f.steps.map((s) => s.n);
  nums.forEach((n, i) => { if (n !== i + 1) err(ou, `les étapes ne se suivent pas : étape ${n} en position ${i + 1}`); });
  for (const s of f.steps) {
    if (!s.action) err(ou, `l'étape ${s.n} n'a pas d'action (« - **Action :** … »)`);
    if (!s.verif) err(ou, `l'étape ${s.n} n'a pas de vérification (« - **Vérification :** … »)`);
    if (!s.source) avert(ou, `l'étape ${s.n} n'a pas de ligne Source`);
  }
  for (const co of f.coince) for (const n of co.etapes) {
    if (!nums.includes(n)) err(ou, `« Si ça coince » renvoie à l'étape ${n}, qui n'existe pas`);
  }
  if (['orange', 'rouge'].includes(m.danger) && !f.risques.length) err(ou, `fiche ${m.danger} sans risque propre dans l'encadré de sécurité`);
  if (/^## \d\. .*$/m.test(f.body) === false) err(ou, 'aucune section numérotée trouvée (« ## 1. Principe »)');
  if (/Entre les deux modes/.test(f.body)) avert(ou, 'la section « Entre les deux modes » a été retirée du gabarit');

  // Provenance, attestations, médias
  for (const s of m.provenance || []) {
    if (typeof s !== 'object') continue;   // anciennes pistes de sources, en texte libre
    if (!s.titre) err(ou, 'une source de la provenance n\'a pas de titre');
    if (s.licence && !LICENCES_ADAPTABLES.test(s.licence)) {
      err(ou, `la source « ${s.titre} » est sous « ${s.licence} » : cette licence ne permet pas de l'adapter dans une fiche`);
    }
    if (!s.licence && !s.url && !s.source) avert(ou, `la source « ${s.titre} » n'a ni licence ni lien`);
  }
  for (const a of m.attestations || []) {
    if (!TYPES_ATTESTATION.includes(a.type)) err(ou, `attestation de type inconnu « ${a.type} » (permis : ${TYPES_ATTESTATION.join(', ')})`);
    if (!a.par) err(ou, "une attestation n'a pas d'auteur (« par »)");
  }
  for (const md of m.medias || []) {
    if (!md.fichier) err(ou, "un média n'a pas de fichier");
    if (md.type && !TYPES_MEDIA.includes(md.type)) err(ou, `média de type inconnu « ${md.type} »`);
    if (!md.licence) err(ou, `le média « ${md.fichier} » n'a pas de licence`);
    if (md.etape && !nums.includes(md.etape)) err(ou, `le média « ${md.fichier} » vise l'étape ${md.etape}, qui n'existe pas`);
  }
}
for (const f of c.fiches) for (const p of f.meta.prerequis || []) {
  if (!ids.has(p)) err(`fiche ${f.file}`, `le prérequis « ${p} » n'existe pas`);
}

// ---------------------------------------------------------------- démo
const demo = conf.demo || [];
for (const id of demo) if (!ids.has(id)) err('civzero.yaml, demo', `la fiche « ${id} » n'existe pas`);

// ---------------------------------------------------------------- traductions
const DOSSIER_EN = path.join(RACINE, 'fiches', 'en');
const en = loadCorpus(RACINE, 'en');
for (const fe of en.fiches) {
  const fr = c.fiches.find((x) => x.file === fe.file);
  const ou = `traduction ${fe.file}`;
  if (!fe.traduite) {
    if (!fe.meta.titre || fe.meta.titre === fr.meta.titre) avert(`fiche ${fe.file}`, "pas de titre anglais (fiches/en/titres.yaml)");
    if (demo.includes(fe.id)) err(`fiche ${fe.file}`, "elle est ouverte dans la démo mais n'est pas traduite en anglais");
    continue;
  }
  if (fe.steps.length !== fr.steps.length) err(ou, `${fe.steps.length} étapes en anglais, ${fr.steps.length} en français`);
  if (fe.coince.length !== fr.coince.length) err(ou, `${fe.coince.length} entrées « If you get stuck », ${fr.coince.length} en français`);
  if (fe.risques.length !== fr.risques.length) avert(ou, `${fe.risques.length} risques en anglais, ${fr.risques.length} en français`);
  fe.steps.forEach((s, i) => { if (!s.action || !s.verif) err(ou, `l'étape ${i + 1} n'a pas d'action ou de vérification (« - **Action:** », « - **Check:** »)`); });
}
for (const f of fs.existsSync(DOSSIER_EN) ? fs.readdirSync(DOSSIER_EN) : []) {
  if (f.endsWith('.md') && !c.fiches.some((x) => x.file === f)) err(`traduction ${f}`, "aucune fiche française ne porte ce nom de fichier");
}
const titresEn = fs.existsSync(path.join(DOSSIER_EN, 'titres.yaml')) ? yaml.load(fs.readFileSync(path.join(DOSSIER_EN, 'titres.yaml'), 'utf8')) || {} : {};
for (const id of Object.keys(titresEn)) if (!ids.has(id)) err('fiches/en/titres.yaml', `la fiche « ${id} » n'existe pas`);

// ---------------------------------------------------------------- fiches prévues
const idsPrevues = new Set();
for (const p of prevues) {
  const ou = `prévue « ${p.id} »`;
  if (idsPrevues.has(p.id) || ids.has(p.id)) err(ou, 'identifiant déjà utilisé');
  idsPrevues.add(p.id);
  if (!p.titre?.fr || !p.titre?.en) err(ou, 'il manque le titre en français ou en anglais');
  if (!HORIZONS.includes(p.horizon)) err(ou, `horizon « ${p.horizon} » inconnu`);
  if (!DANGERS.includes(p.danger)) err(ou, `danger « ${p.danger} » inconnu`);
  if (!socles[p.socle]) err(ou, `le socle « ${p.socle} » n'existe pas`);
  if (!p.savoirs?.length) err(ou, "elle n'appartient à aucun savoir");
  for (const sv of p.savoirs || []) if (!savoirs[sv]) err(ou, `le savoir « ${sv} » n'existe pas`);
}
const vides = Object.keys(savoirs).filter((sv) => !c.fiches.some((f) => (f.meta.savoirs || []).includes(sv))
  && !prevues.some((p) => (p.savoirs || []).includes(sv)));
for (const sv of vides) avert(`structure, savoir ${sv}`, 'aucune fiche, écrite ou prévue');

// ---------------------------------------------------------------- pistes (socle Spore)
const MATURITES = ['idee', 'prototype', 'terrain', 'documentee'];
const SECTIONS_PISTE = 6;   // l'idée, où on en est, qui y travaille, questions ouvertes, comment contribuer, vigilance
const idsPistes = new Set();
const socleSpore = Object.keys(socles).filter((so) => socles[so].pistes);
if (socleSpore.length !== 1) err('structure', `il faut exactement un socle de pistes (« pistes: true »), il y en a ${socleSpore.length}`);
for (const pi of c.pistes || []) {
  const ou = `piste ${pi.file}`;
  const m = pi.meta;
  if (!m.id) { err(ou, "il manque l'identifiant (id)"); continue; }
  if (idsPistes.has(m.id) || ids.has(m.id) || idsPrevues.has(m.id)) err(ou, `identifiant « ${m.id} » déjà utilisé`);
  idsPistes.add(m.id);
  if (!pi.file.slice(3).startsWith(m.id)) avert(ou, `le nom du fichier ne reprend pas l'identifiant « ${m.id} »`);
  for (const champ of ['titre', 'accroche', 'socle', 'maturite', 'maj']) if (!m[champ]) err(ou, `il manque le champ « ${champ} »`);
  if (m.socle && !socleSpore.includes(m.socle)) err(ou, `le socle « ${m.socle} » n'est pas un socle de pistes`);
  if (m.maturite && !MATURITES.includes(m.maturite)) err(ou, `maturité « ${m.maturite} » inconnue (permis : ${MATURITES.join(', ')})`);
  if (!Array.isArray(m.savoirs) || !m.savoirs.length) err(ou, 'une piste doit se rattacher à au moins un savoir');
  for (const sv of m.savoirs || []) if (!savoirs[sv]) err(ou, `le savoir « ${sv} » n'existe pas dans structure.yaml`);
  if (pi.sections.length !== SECTIONS_PISTE) err(ou, `${pi.sections.length} sections, ${SECTIONS_PISTE} attendues (« ## 1. L'idée » … « ## 6. Vigilance »)`);
  if (/^### (Étape|Step) /m.test(pi.body)) err(ou, "une piste n'a pas d'étapes : quand la méthode est prête, elle devient une fiche");
  for (const a of m.acteurs || []) if (!a.nom) err(ou, "un acteur n'a pas de nom");
  if (!(m.acteurs || []).length) avert(ou, 'aucun acteur (qui y travaille)');
  for (const s of m.provenance || []) {
    if (!s.titre) err(ou, "une source n'a pas de titre");
    if (!s.source && !s.url) avert(ou, `la source « ${s.titre} » n'a pas de lien`);
    if (s.licence && !LICENCES_ADAPTABLES.test(s.licence)) err(ou, `la source « ${s.titre} » est sous « ${s.licence} » : on ne peut pas l'adapter`);
  }
}
for (const pe of en.pistes || []) {
  const fr = (c.pistes || []).find((x) => x.file === pe.file);
  if (!pe.traduite) { avert(`piste ${pe.file}`, 'pas encore traduite en anglais (pistes/en/)'); continue; }
  if (pe.sections.length !== fr.sections.length) err(`traduction de piste ${pe.file}`, `${pe.sections.length} sections en anglais, ${fr.sections.length} en français`);
}
const DOSSIER_PISTES_EN = path.join(RACINE, 'pistes', 'en');
for (const f of fs.existsSync(DOSSIER_PISTES_EN) ? fs.readdirSync(DOSSIER_PISTES_EN) : []) {
  if (f.endsWith('.md') && !(c.pistes || []).some((x) => x.file === f)) err(`traduction de piste ${f}`, 'aucune piste française ne porte ce nom de fichier');
}

// ---------------------------------------------------------------- bilan
const N = c.fiches.length;
console.log(`Corpus : ${N} fiches écrites (${demo.length} ouvertes), ${prevues.length} prévues, `
  + `${Object.keys(socles).length} socles, ${Object.keys(savoirs).length} savoirs, `
  + `${en.fiches.filter((f) => f.traduite).length} traductions anglaises, ${(c.pistes || []).length} pistes.`);
if (avertissements.length) {
  console.log(`\n${avertissements.length} avertissement(s) :`);
  for (const a of avertissements) console.log(`  · ${a}`);
}
if (erreurs.length) {
  console.log(`\n${erreurs.length} erreur(s) :`);
  for (const e of erreurs) console.log(`  ✗ ${e}`);
  console.log('\nLe corpus contient des erreurs : corrigez-les avant de construire le site.');
  process.exit(1);
}
console.log('\nAucune erreur.');
