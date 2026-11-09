// L'assistant de CivZero choisit, il n'écrit pas.
// 1. Une recherche locale propose des candidats : fiches, étapes, entrées « Si ça coince ».
// 2. Le modèle (llama-server) choisit parmi eux, sa réponse étant limitée à leurs identifiants.
// 3. Tout identifiant reçu est revérifié ; sans modèle, la recherche seule répond.
// Le texte affiché vient toujours des fiches, jamais du modèle.
import { loadCorpus } from '../src/lib/corpus.mjs';

const MOTS_VIDES = new Set(('a au aux avec ce ces c ca cela cet cette d dans de des du elle en est et '
  + 'il ils j je l la le les leur lui m ma mais me mes moi mon n ne ni nos notre nous on ou par pas pour '
  + 'qu que qui s sa sans se ses si son sur t ta te tes toi ton tu un une vos votre vous y comment quoi '
  + 'quand ou faire fait faut peut plus tres bien etre avoir ai as avons avez ont suis es sommes etes sont '
  + 'quel quelle quels quelles est-ce').split(' '));
const FINS = ['ements', 'ement', 'ations', 'ation', 'euses', 'euse', 'eurs', 'eur', 'ees', 'ee', 'er', 'ez',
              'es', 'e', 's', 'x'];

export function mots(texte) {
  return (texte || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, ' ').split(/[^a-z0-9]+/)
    .filter((m) => m.length > 1 && !MOTS_VIDES.has(m))
    .map((m) => { for (const f of FINS) if (m.length - f.length >= 4 && m.endsWith(f)) return m.slice(0, -f.length); return m; });
}

const nettoie = (s) => (s || '').replace(/\*\*|`|\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

// Construit l'index des entrées que l'assistant peut désigner (fiches ouvertes seulement).
export function construireIndex(corpus = loadCorpus()) {
  const demo = Array.isArray(corpus.conf.demo) && corpus.conf.demo.length ? new Set(corpus.conf.demo) : null;
  const entrees = [];
  for (const f of corpus.fiches.filter((x) => !demo || demo.has(x.id))) {
    const titre = f.meta.titre;
    const principe = nettoie((f.secs[1] || '').split('\n\n')[0]);
    entrees.push({ id: f.id, type: 'fiche', fiche: f.id, titreFiche: titre,
                   court: `${titre}. ${principe}`.slice(0, 220),
                   texte: `${titre} ${corpus.besoins[f.meta.besoin]?.titre || ''} ${principe} ${f.meta.exige_avance}`,
                   lien: `f-${f.id}.html` });
    for (const s of f.steps) {
      entrees.push({ id: `${f.id}:e${s.n}`, type: 'etape', fiche: f.id, titreFiche: titre, etape: s.n,
                     titre: s.titre, action: s.action, verif: s.verif,
                     court: `Étape ${s.n} de « ${titre} » : ${s.titre}. ${nettoie(s.action)}`.slice(0, 220),
                     texte: `${s.titre} ${s.titre} ${nettoie(s.action)} ${nettoie(s.verif)}`,
                     lien: `f-${f.id}-e${s.n}.html` });
    }
    f.coince.forEach((c, i) => {
      const etapes = f.steps.filter((s) => c.etapes.includes(s.n));
      entrees.push({ id: `${f.id}:c${i + 1}`, type: 'coince', fiche: f.id, titreFiche: titre, etapes: c.etapes,
                     probleme: c.probleme, reponse: c.texte,
                     court: `Blocage dans « ${titre} » : ${nettoie(c.probleme)} ${nettoie(c.texte)}`.slice(0, 220),
                     texte: `${c.probleme} ${c.probleme} ${nettoie(c.texte)} ${etapes.map((s) => s.titre).join(' ')}`,
                     lien: etapes.length ? `f-${f.id}-e${etapes[0].n}.html` : `f-${f.id}.html` });
    });
  }
  // Statistiques BM25
  const docs = entrees.map((e) => mots(e.texte));
  const df = new Map();
  docs.forEach((d) => new Set(d).forEach((m) => df.set(m, (df.get(m) || 0) + 1)));
  const moy = docs.reduce((a, d) => a + d.length, 0) / docs.length;
  return { entrees, docs, df, moy, parId: new Map(entrees.map((e) => [e.id, e])) };
}

function bm25(index, requete) {
  const { docs, df, moy } = index;
  const N = docs.length, k1 = 1.2, b = 0.75;
  const q = [...new Set(mots(requete))];
  return docs.map((d) => {
    let s = 0;
    for (const m of q) {
      const tf = d.filter((x) => x === m).length;
      if (!tf) continue;
      const idf = Math.log(1 + (N - df.get(m) + 0.5) / (df.get(m) + 0.5));
      s += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * d.length / moy));
    }
    return s;
  });
}

// Candidats : les meilleures entrées, en favorisant la fiche et l'étape où se trouve la personne.
export function candidats(index, question, ctx = {}, n = 8) {
  const scores = bm25(index, question);
  const notes = index.entrees.map((e, i) => {
    let s = scores[i];
    if (ctx.fiche && e.fiche === ctx.fiche) s *= 1.5;
    if (ctx.etape && e.type === 'coince' && e.fiche === ctx.fiche && e.etapes.includes(ctx.etape)) s = s * 2 + 0.5;
    return { e, s };
  });
  return notes.filter((x) => x.s > 0).sort((a, z) => z.s - a.s).slice(0, n);
}

const SYSTEME = "Tu es l'aiguilleur de la station CivZero. Tu ne rédiges jamais de texte. "
  + "On te donne une question et une liste d'entrées, chacune avec son identifiant. "
  + "Choisis de 0 à 3 identifiants dont l'entrée répond directement à la question, de la plus utile à la moins utile. "
  + "Si aucune entrée ne répond, renvoie une liste vide. "
  + 'Réponds uniquement par un objet JSON de la forme {"choix": ["identifiant", ...]}.';

async function demanderAuModele(url, question, ctx, liste, delai) {
  const ids = liste.map((x) => x.e.id);
  const contexte = ctx.fiche ? `\nContexte : la personne suit la fiche ${ctx.fiche}${ctx.etape ? `, étape ${ctx.etape}` : ''}.` : '';
  const corps = {
    messages: [
      { role: 'system', content: SYSTEME },
      { role: 'user', content: `Question : ${question}${contexte}\n\nEntrées :\n`
          + liste.map((x) => `${x.e.id} — ${x.e.court}`).join('\n') + '\n/no_think' },
    ],
    temperature: 0,
    max_tokens: 96,
    chat_template_kwargs: { enable_thinking: false },
    response_format: { type: 'json_schema', json_schema: { name: 'choix', strict: true, schema: {
      type: 'object', additionalProperties: false, required: ['choix'],
      properties: { choix: { type: 'array', maxItems: 3, items: { type: 'string', enum: ids } } },
    } } },
  };
  const ctrl = new AbortController();
  const minuterie = setTimeout(() => ctrl.abort(), delai);
  try {
    const r = await fetch(`${url}/v1/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps), signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(`le modèle a répondu ${r.status}`);
    const json = await r.json();
    const texte = json.choices?.[0]?.message?.content || '';
    const objet = JSON.parse(texte.slice(texte.indexOf('{'), texte.lastIndexOf('}') + 1));
    const valides = new Set(ids);
    // Seconde barrière : on ne garde que des identifiants proposés, sans doublon.
    return [...new Set((objet.choix || []).filter((id) => typeof id === 'string' && valides.has(id)))].slice(0, 3);
  } finally {
    clearTimeout(minuterie);
  }
}

// Point d'entrée : renvoie { mode, choix: [entrées], candidats, erreur? }.
export async function classer(index, question, ctx = {}, options = {}) {
  const { llamaUrl = process.env.LLAMA_URL || 'http://127.0.0.1:8080', delai = 60000, sansModele = false } = options;
  const liste = candidats(index, question, ctx);
  const repli = (erreur) => ({ mode: 'recherche', erreur,
    choix: liste.slice(0, 3).map((x) => x.e), candidats: liste.map((x) => x.e) });
  if (!question.trim() || !liste.length) return { mode: sansModele ? 'recherche' : 'modele', choix: [], candidats: [] };
  if (sansModele) return repli();
  try {
    const ids = await demanderAuModele(llamaUrl, question, ctx, liste, delai);
    return { mode: 'modele', choix: ids.map((id) => index.parId.get(id)), candidats: liste.map((x) => x.e) };
  } catch (e) {
    return repli(e.name === 'AbortError' ? 'le modèle a mis trop de temps' : String(e.message || e));
  }
}

// Vérifie rapidement si llama-server répond.
export async function modeleDisponible(url = process.env.LLAMA_URL || 'http://127.0.0.1:8080') {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 1500);
  try { return (await fetch(`${url}/health`, { signal: ctrl.signal })).ok; }
  catch { return false; }
  finally { clearTimeout(t); }
}
