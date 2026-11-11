// Agent d'adaptation de CivicNode : d'une source ouverte à une fiche au gabarit, en brouillon.
// La consigne est agent/METHODE.md ; ce programme l'applique et contrôle le résultat, sans rien publier.
//
//   node agent/adapter.mjs agent/travaux/<id>.yaml            (ou : npm run adapter -- agent/travaux/<id>.yaml)
//
// Options (variables d'environnement) :
//   MODELE        claude (API Anthropic, clé dans ANTHROPIC_API_KEY), local (llama-server, LLAMA_URL) ou essai
//   CLAUDE_MODELE identifiant du modèle Claude (défaut : claude-opus-5-5)
//   ANTHROPIC_WORKSPACE_ID  identifiant de l'espace de travail, pour une clé de console liée à un espace (sk-ant-usr-…)
//   LLAMA_URL     adresse de llama-server (défaut : http://127.0.0.1:8080)
//
// Étapes : 1. lire la commande (fiche prévue + sources) ; 2. refuser toute source qui n'est pas adaptable ;
// 3. lire le texte des sources (fichier local ou page web) ; 4. demander la fiche au modèle, avec la méthode et
// une fiche modèle ; 5. remplacer l'en-tête par des valeurs sûres (provenance, statut, rédaction) ;
// 6. contrôler : gabarit, sources citées, chiffres absents des sources ; 7. écrire la fiche et son rapport
// dans agent/sortie/. Un humain relit le rapport, puis déplace la fiche dans corpus/fiches/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { parseFiche } from '../src/lib/corpus.mjs';
import { adaptable } from '../src/lib/licences.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');
const CORPUS = path.join(RACINE, 'corpus');
const lire = (f) => fs.readFileSync(f, 'utf8');
const aujourdhui = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- 1. la commande
export function lireCommande(fichier) {
  const c = yaml.load(lire(fichier)) || {};
  const prevues = yaml.load(lire(path.join(CORPUS, 'prevues.yaml'))) || [];
  const p = prevues.find((x) => x.id === c.id);
  if (!p && !c.titre) throw new Error(`« ${c.id} » n'est pas une fiche prévue (corpus/prevues.yaml) et la commande n'a pas de titre`);
  return { ...c, prevue: p || null, dossier: path.dirname(fichier) };
}

// ---------------------------------------------------------------- 2. les licences
export function controlerSources(sources = []) {
  const refus = [];
  if (!sources.length) refus.push('aucune source : une fiche adaptée part toujours d\'au moins une source');
  for (const s of sources) {
    const nom = s.titre || s.id || '(sans titre)';
    if (!s.id || !/^s\d+$/.test(s.id)) refus.push(`« ${nom} » : identifiant attendu de la forme s1, s2…`);
    if (!s.licence) refus.push(`« ${nom} » : licence non indiquée`);
    else if (!adaptable(s.licence)) refus.push(`« ${nom} » : « ${s.licence} » ne permet pas l'adaptation (à citer en référence seulement)`);
    if (!s.source) refus.push(`« ${nom} » : lien manquant`);
    if (!s.verifie_le) refus.push(`« ${nom} » : date de vérification de la licence (verifie_le) manquante`);
  }
  return refus;
}

// ---------------------------------------------------------------- 3. le texte des sources
const sansHtml = (h) => h.replace(/<(script|style|nav|header|footer)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&frac12;/g, '½').replace(/&frac14;/g, '¼')
  .replace(/&frac34;/g, '¾').replace(/&#(\d+);/g, (x, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, ' ').trim();

export { sansHtml };
export async function texteSource(s, dossier = '.') {
  if (s.fichier) return lire(path.resolve(dossier, s.fichier));
  const rep = await fetch(s.source, { headers: { 'User-Agent': 'CivicNode-agent/1 (https://github.com/civicnode-eu/civicnode)' } });
  if (!rep.ok) throw new Error(`« ${s.titre} » : la page répond ${rep.status}`);
  return sansHtml(await rep.text());
}

// ---------------------------------------------------------------- 4. le modèle
function consigne() {
  const methode = lire(path.join(ICI, 'METHODE.md'));
  const exemple = lire(path.join(CORPUS, 'fiches', '28-rendre-eau-potable-faisant-bouillir.md'));
  return [
    "Tu es l'agent d'adaptation de CivicNode. Tu écris UNE fiche en français, au gabarit exact de l'exemple, "
      + "à partir des seules sources fournies. Tu appliques la méthode ci-dessous sans exception.",
    "Règles qui priment sur tout : aucun chiffre qui ne soit pas dans une source ; sinon « [À VALIDER : …] ». "
      + "Chaque étape a une ligne « - **Source :** » qui donne l'identifiant de sa source (s1, s2…) ou « sans objet ». "
      + "Pas de geste du moratoire rouge. Tu ne recopies pas de longues phrases : tu reformules, simplement.",
    "Réponds uniquement par la fiche complète, en-tête YAML compris, sans texte avant ni après.",
    `--- MÉTHODE ---\n${methode}`,
    `--- FICHE EXEMPLE (pour la forme seulement, pas pour le contenu) ---\n${exemple}`,
  ].join('\n\n');
}

function demande(cmd, textes) {
  const p = cmd.prevue || {};
  const titre = cmd.titre || p.titre?.fr;
  const niveaux = { socle: cmd.socle || p.socle, savoirs: cmd.savoirs || p.savoirs, horizon: cmd.horizon || p.horizon,
                    tier: cmd.tier || p.tier, danger_propose: cmd.danger || p.danger };
  return [
    `Fiche à écrire : « ${titre} » (identifiant ${cmd.id}).`,
    `Niveaux proposés par le catalogue, à garder sauf raison écrite : ${JSON.stringify(niveaux)}.`,
    cmd.consignes ? `Consignes particulières : ${cmd.consignes}` : '',
    ...cmd.sources.map((s, i) => `--- SOURCE ${s.id} : « ${s.titre} », ${s.auteur || ''}, licence ${s.licence} ---\n${textes[i]}`),
  ].filter(Boolean).join('\n\n');
}

const MAX_SOURCE = 24000;   // caractères par source envoyés au modèle

export async function appelerModele(systeme, message, options = {}) {
  const modele = options.modele || process.env.MODELE || 'claude';
  if (modele === 'essai') {
    if (!options.reponse) throw new Error('modèle « essai » : il faut une réponse toute faite (options.reponse)');
    return options.reponse;
  }
  if (modele === 'claude') {
    const cle = process.env.ANTHROPIC_API_KEY;
    if (!cle) throw new Error('ANTHROPIC_API_KEY absente : définissez-la, ou lancez avec MODELE=local');
    if (/…|\.\.\./.test(cle) || !/^sk-ant-[\x21-\x7e]{20,}$/.test(cle)) {
      throw new Error("ANTHROPIC_API_KEY n'est pas une vraie clé (elle contient « … » ou est trop courte) : collez votre clé complète, qui commence par sk-ant-");
    }
    const rep = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      // Les clés de la console au nouveau format (sk-ant-usr-…) passent aussi en « Authorization: Bearer »,
      // et une clé liée à un espace de travail demande son identifiant (ANTHROPIC_WORKSPACE_ID).
      headers: { 'content-type': 'application/json', 'x-api-key': cle, authorization: `Bearer ${cle}`,
                 'anthropic-version': '2023-06-01',
                 ...(process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}) },
      body: JSON.stringify({ model: process.env.CLAUDE_MODELE || 'claude-opus-5-5', max_tokens: 8000,
                             system: systeme, messages: [{ role: 'user', content: message }] }),
    });
    const o = await rep.json();
    if (!rep.ok) throw new Error(`API Claude : ${o.error?.message || rep.status}`);
    return o.content.filter((x) => x.type === 'text').map((x) => x.text).join('');
  }
  if (modele === 'local') {
    const url = process.env.LLAMA_URL || 'http://127.0.0.1:8080';
    const rep = await fetch(`${url}/v1/chat/completions`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'system', content: systeme }, { role: 'user', content: message }],
                             temperature: 0.2, max_tokens: 6000 }),
    });
    if (!rep.ok) throw new Error(`llama-server répond ${rep.status} (${url})`);
    return (await rep.json()).choices[0].message.content;
  }
  throw new Error(`modèle inconnu « ${modele} » (claude, local ou essai)`);
}

// ---------------------------------------------------------------- 5. l'en-tête sûr
export function enteteSur(texte, cmd) {
  const brut = texte.trim().replace(/^```(?:markdown|md)?\n/, '').replace(/\n```$/, '');
  const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("la réponse du modèle n'a pas d'en-tête YAML entre deux lignes « --- »");
  let meta;
  try { meta = yaml.load(m[1]) || {}; } catch (e) { throw new Error(`en-tête YAML illisible : ${e.message}`); }
  const p = cmd.prevue || {};
  Object.assign(meta, {
    id: cmd.id,
    titre: meta.titre || cmd.titre || p.titre?.fr,
    socle: cmd.socle || p.socle || meta.socle,
    savoirs: cmd.savoirs || p.savoirs || meta.savoirs || [],
    origine: 'adaptee', statut: 'brouillon', redaction: 'adaptee-ia', reproductions: 0,
    // La provenance vient de la commande, jamais du modèle : on ne lui laisse pas inventer une source ou une licence.
    provenance: cmd.sources.map((s) => ({ id: s.id, titre: s.titre, auteur: s.auteur || '', source: s.source,
                                          licence: s.licence, usage: 'adapte', modifie: true, verifie_le: s.verifie_le })),
    attestations: [], medias: [], maj: aujourdhui(),
  });
  if (!Array.isArray(meta.prerequis) || !meta.prerequis.includes('nodule-zero')) meta.prerequis = ['nodule-zero', ...(meta.prerequis || [])];
  return `---\n${yaml.dump(meta, { lineWidth: 200, quotingType: '"' }).trim()}\n---\n${m[2].replace(/^\s*/, '\n')}`;
}

// ---------------------------------------------------------------- 6. les contrôles
// Les chiffres du texte doivent se trouver dans une source. On ignore les numéros d'étape et de section,
// ce qui est déjà marqué « [À VALIDER : …] » ou « [SOURCE À TROUVER …] », et un chiffre suivi d'un tel marqueur
// dans la même phrase (une conversion, par exemple).
const normaliser = (n) => n.replace(/[\s  ]/g, '').replace(/(\d),(\d{3})\b/g, '$1$2').replace(',', '.');
export function chiffresSansSource(corps, textes) {
  const sources = new Set();
  const FRACTIONS = { '½': '.5', '¼': '.25', '¾': '.75', '⅛': '.125' };
  for (const t00 of textes) {
    // Les copies anciennes peuvent garder des entités HTML (&frac12; pour ½).
    const t0 = t00.replace(/&frac12;/g, '½').replace(/&frac14;/g, '¼').replace(/&frac34;/g, '¾');
    const t = t0.replace(/(\d?)([½¼¾⅛])/g, (x, d, f) => `${d || '0'}${FRACTIONS[f]}`);   // ½ mL = 0,5 ml
    for (const n of t.match(/\d+(?:[.,  ]\d+)*/g) || []) sources.add(normaliser(n));
  }
  const sansMarques = corps
    // Un chiffre suivi, dans la même phrase, d'un « [À VALIDER : …] » est déjà signalé au relecteur.
    .replace(/\d[\d.,  ]*(?=[^.\n[]{0,60}\[(?:À VALIDER|TO CHECK))/g, ' ')
    .replace(/\[(?:À VALIDER|SOURCE À TROUVER|TO CHECK|SOURCE NEEDED)[^\]]*\]/g, ' ')
    .replace(/^#{2,3} .*$/gm, ' ')                       // titres de section et d'étape
    .replace(/(?<!\p{L})(?:étapes?|steps?)\s+\d+(?:\s*(?:,|et|ou|à|and|or)\s*\d+)*/giu, ' ')   // renvois aux étapes
    .replace(/\bs\d+\b/g, ' ')                            // identifiants de source
    .replace(/\b(?:19|20)\d{2}\b/g, ' ');                 // années (dates de publication)
  const douteux = new Set();
  for (const n of sansMarques.match(/\d+(?:[.,  ]\d+)*/g) || []) if (!sources.has(normaliser(n))) douteux.add(n.trim());
  return [...douteux];
}

export function controlerFiche(texte, cmd, textes, structure) {
  const erreurs = [];
  const remarques = [];
  let f;
  try { f = parseFiche(`${cmd.id}.md`, texte); } catch (e) { return { erreurs: [e.message], remarques, chiffres: [] }; }
  const m = f.meta;
  for (const champ of ['titre', 'socle', 'horizon', 'temps', 'vague', 'tier', 'exige_avance', 'danger']) {
    if (m[champ] === undefined || m[champ] === '') erreurs.push(`champ « ${champ} » manquant`);
  }
  if (!['instant', 'hours', 'seasons'].includes(m.horizon)) erreurs.push(`horizon « ${m.horizon} » inconnu`);
  if (!['vert', 'orange', 'rouge'].includes(m.danger)) erreurs.push(`danger « ${m.danger} » inconnu`);
  for (const sv of m.savoirs || []) if (structure && !structure.savoirs?.[sv]) erreurs.push(`savoir « ${sv} » inconnu`);
  if (!f.steps.length) erreurs.push('aucune étape « ### Étape n : … »');
  f.steps.forEach((s, i) => {
    if (s.n !== i + 1) erreurs.push(`étape ${s.n} en position ${i + 1}`);
    if (!s.action || !s.verif) erreurs.push(`étape ${s.n} : action ou vérification manquante`);
    if (!s.source) erreurs.push(`étape ${s.n} : ligne Source manquante`);
    for (const ref of s.source.match(/\bs\d+\b/g) || []) {
      if (!cmd.sources.some((x) => x.id === ref)) erreurs.push(`étape ${s.n} : source « ${ref} » inconnue`);
    }
    if (!/\bs\d+\b|sans objet|À VALIDER|SOURCE À TROUVER/.test(s.source)) remarques.push(`étape ${s.n} : la source « ${s.source} » n'est pas un identifiant`);
  });
  for (const co of f.coince) for (const n of co.etapes) if (!f.steps.some((s) => s.n === n)) erreurs.push(`« Si ça coince » renvoie à l'étape ${n}, absente`);
  if (['orange', 'rouge'].includes(m.danger) && !f.risques.length) erreurs.push(`fiche ${m.danger} sans risque propre`);
  if (m.danger !== (cmd.danger || cmd.prevue?.danger)) remarques.push(`danger « ${m.danger} » différent de celui du catalogue (« ${cmd.danger || cmd.prevue?.danger} ») : à justifier`);
  const chiffres = chiffresSansSource(`${m.temps || ''}\n${m.exige_avance || ''}\n${f.body}`, textes);
  const aValider = (texte.match(/\[(?:À VALIDER|SOURCE À TROUVER)[^\]]*\]/g) || []).length;
  return { erreurs, remarques, chiffres, aValider, etapes: f.steps.length };
}

// ---------------------------------------------------------------- 7. écrire
function prochainNumero() {
  const nums = [path.join(CORPUS, 'fiches'), path.join(ICI, 'sortie')].filter(fs.existsSync)
    .flatMap((d) => fs.readdirSync(d)).map((f) => Number(f.slice(0, 2))).filter(Number.isFinite);
  return String(Math.max(-1, ...nums) + 1).padStart(2, '0');
}

function rapport(cmd, c, fichier) {
  const l = [`# Rapport de l'agent : ${cmd.id}`, '', `${aujourdhui()} · modèle ${process.env.MODELE || 'claude'} · fiche ${path.basename(fichier)}`, ''];
  l.push(c.erreurs.length ? `## Erreurs (${c.erreurs.length}) : la fiche ne peut pas entrer dans le corpus en l'état` : '## Aucune erreur de gabarit');
  for (const e of c.erreurs) l.push(`- ${e}`);
  l.push('', `## Chiffres absents des sources (${c.chiffres.length})`, '');
  l.push(c.chiffres.length ? 'Chacun doit être retrouvé dans une source, ou marqué « [À VALIDER : …] », avant tout usage.' : 'Tous les chiffres du texte se trouvent dans une source.');
  for (const n of c.chiffres) l.push(`- ${n}`);
  l.push('', `## Remarques (${c.remarques.length})`);
  for (const r of c.remarques) l.push(`- ${r}`);
  l.push('', `## À relire par un humain`, '', `- ${c.aValider} point(s) À VALIDER ou SOURCE À TROUVER.`,
    '- Ouvrir chaque source et vérifier chaque étape contre elle.', '- Vérifier les niveaux proposés (horizon, tier, danger).',
    '- Puis déplacer la fiche dans corpus/fiches/, la retirer de corpus/prevues.yaml, et lancer npm test.');
  return l.join('\n') + '\n';
}

export async function adapter(fichierCommande, options = {}) {
  const cmd = lireCommande(fichierCommande);
  const refus = controlerSources(cmd.sources);
  if (refus.length) return { refus };
  const textes = [];
  for (const s of cmd.sources) textes.push((await texteSource(s, cmd.dossier)).slice(0, MAX_SOURCE));
  const brut = await appelerModele(consigne(), demande(cmd, textes), options);
  const fiche = enteteSur(brut, cmd);
  const structure = yaml.load(lire(path.join(CORPUS, 'structure.yaml')));
  const c = controlerFiche(fiche, cmd, textes, structure);
  const sortie = options.sortie || path.join(ICI, 'sortie');
  fs.mkdirSync(sortie, { recursive: true });
  const nom = path.join(sortie, `${prochainNumero()}-${cmd.id}.md`);
  fs.writeFileSync(nom, fiche);
  fs.writeFileSync(nom.replace(/\.md$/, '.rapport.md'), rapport(cmd, c, nom));
  return { fichier: nom, ...c };
}

// ---------------------------------------------------------------- ligne de commande
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const f = process.argv[2];
  if (!f) { console.log('Usage : node agent/adapter.mjs agent/travaux/<id>.yaml'); process.exit(1); }
  try {
    const r = await adapter(f);
    if (r.refus) {
      console.log('Commande refusée :');
      for (const x of r.refus) console.log(`  ✗ ${x}`);
      process.exit(1);
    }
    console.log(`Fiche écrite : ${path.relative(process.cwd(), r.fichier)} (${r.etapes} étapes)`);
    console.log(`Erreurs : ${r.erreurs.length} · chiffres absents des sources : ${r.chiffres.length} · à valider : ${r.aValider}`);
    console.log(`Rapport : ${path.relative(process.cwd(), r.fichier.replace(/\.md$/, '.rapport.md'))}`);
    process.exit(r.erreurs.length ? 2 : 0);
  } catch (e) {
    console.log(`Échec : ${e.message}`);
    process.exit(1);
  }
}
