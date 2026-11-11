// L'assistant de CivicNode choisit, puis rédige sous contrôle.
// 1. Une recherche locale propose des candidats : fiches, étapes, entrées « Si ça coince ».
// 2. Le modèle (llama-server) choisit parmi eux, sa réponse étant limitée à leurs identifiants.
// 3. Tout identifiant reçu est revérifié ; sans modèle, la recherche seule répond.
// 4. Le modèle rédige une courte réponse à partir des seuls passages choisis. Un garde-fou écarte
//    toute rédaction qui contient un chiffre absent des fiches. Les étapes et les risques restent
//    affichés tels qu'écrits dans les fiches, sous la réponse rédigée.
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

// Le niveau d'une fiche est celui du geste principal ; une variante plus risquée est signalée à côté.
const RANG_DANGER = { vert: 1, orange: 2, rouge: 3 };
export function varianteRisquee(meta) {
  const base = RANG_DANGER[meta.danger] || 0;
  const v = (meta.variantes || []).filter((x) => (RANG_DANGER[x.danger] || 0) > base)
    .sort((a, z) => RANG_DANGER[z.danger] - RANG_DANGER[a.danger])[0];
  return v ? v.danger : '';
}

const nettoie = (s) => (s || '').replace(/\*\*|`|\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

// Construit l'index des entrées que l'assistant peut désigner (fiches ouvertes seulement).
export function construireIndex(corpus = loadCorpus()) {
  // Les titres des savoirs d'une fiche (structure des socles) enrichissent sa recherche.
  const savoirs = corpus.structure?.savoirs || {};
  const titreSavoirs = (m) => (m.savoirs || []).map((sv) => savoirs[sv]?.titre?.fr || '').join(' ');
  const demo = Array.isArray(corpus.conf.demo) && corpus.conf.demo.length ? new Set(corpus.conf.demo) : null;
  const entrees = [];
  for (const f of corpus.fiches.filter((x) => !demo || demo.has(x.id))) {
    const titre = f.meta.titre;
    const principe = nettoie((f.secs[1] || '').split('\n\n')[0]);
    // Le titre compte triple : une question large doit d'abord trouver la fiche qui porte son sujet.
    const accroche = f.meta.accroche || (principe.match(/^[^.!?]+[.!?]/) || [principe])[0];
    entrees.push({ id: f.id, type: 'fiche', fiche: f.id, titreFiche: titre, principe, accroche,
                   danger: f.meta.danger, variante: varianteRisquee(f.meta), socle: f.meta.socle === 'commencer',
                   exige: nettoie(f.meta.exige_avance || f.meta.exige || ''),
                   // Le Nodule Zéro définit les niveaux de danger : ses « risques » sont des libellés, pas des consignes.
                   risques: f.id === 'nodule-zero' ? [] : f.risques.filter((r) => !/^aucun/i.test(r.trim())),
                   court: `Fiche entière « ${titre} » : ${principe}`.slice(0, 220),
                   texte: `${titre} ${titre} ${titre} ${titreSavoirs(f.meta)} ${principe} ${f.meta.exige_avance}`,
                   lien: `fr/f-${f.id}.html` });
    for (const s of f.steps) {
      entrees.push({ id: `${f.id}:e${s.n}`, type: 'etape', fiche: f.id, titreFiche: titre, etape: s.n,
                     titre: s.titre, action: s.action, verif: s.verif,
                     court: `Étape « ${s.titre} » (fiche « ${titre} ») : ${nettoie(s.action)}`.slice(0, 220),
                     texte: `${s.titre} ${s.titre} ${nettoie(s.action)} ${nettoie(s.verif)}`,
                     lien: `fr/f-${f.id}-e${s.n}.html` });
    }
    f.coince.forEach((c, i) => {
      const etapes = f.steps.filter((s) => c.etapes.includes(s.n));
      entrees.push({ id: `${f.id}:c${i + 1}`, type: 'coince', fiche: f.id, titreFiche: titre, etapes: c.etapes,
                     probleme: c.probleme, reponse: c.texte,
                     court: `Problème : ${nettoie(c.probleme)} Solution : ${nettoie(c.texte)} (fiche « ${titre} »)`.slice(0, 220),
                     texte: `${c.probleme} ${c.probleme} ${nettoie(c.texte)} ${etapes.map((s) => s.titre).join(' ')}`,
                     lien: etapes.length ? `fr/f-${f.id}-e${etapes[0].n}.html` : `fr/f-${f.id}.html` });
    });
  }
  // Fiches écrites mais pas encore ouvertes sur la station : l'assistant peut seulement les annoncer.
  const fermees = corpus.fiches.filter((x) => demo && !demo.has(x.id))
    .map((x) => ({ id: x.id, titre: x.meta.titre, horizon: x.meta.horizon || '', tier: x.meta.tier || [], danger: x.meta.danger,
                   mots: new Set(mots(`${x.meta.titre} ${titreSavoirs(x.meta)}`)) }));
  // Toutes les fiches, ouvertes ou à venir, pour le panorama des solutions (le Nodule Zéro est un préalable, pas une solution).
  const titres = new Map(corpus.fiches.map((x) => [x.id, x.meta.titre]));
  const fiches = corpus.fiches.filter((x) => x.id !== 'nodule-zero').map((x) => {
    const principe = nettoie((x.secs[1] || '').split('\n\n')[0]);
    return { id: x.id, titre: x.meta.titre, principe, ouverte: !demo || demo.has(x.id), socle: x.meta.socle === 'commencer',
             accroche: x.meta.accroche || (principe.match(/^[^.!?]+[.!?]/) || [principe])[0],
             horizon: x.meta.horizon || '', tier: x.meta.tier || [], danger: x.meta.danger, variante: varianteRisquee(x.meta),
             exige: nettoie(x.meta.exige_avance || ''), etapes: x.steps.map((st) => st.titre),
             risques: x.risques.filter((r) => !/^aucun/i.test(r.trim())),
             avant: (x.meta.prerequis || []).filter((id) => id !== 'nodule-zero' && titres.has(id)).map((id) => titres.get(id)),
             texte: `${x.meta.titre} ${x.meta.titre} ${x.meta.titre} ${titreSavoirs(x.meta)} ${principe} `
               + `${x.meta.exige_avance || ''} ${x.steps.map((st) => `${st.titre} ${nettoie(st.action)}`).join(' ')} `
               + x.coince.map((co) => co.probleme).join(' '),
             savoirs: x.meta.savoirs || [], lien: `fr/f-${x.id}.html` };
  });
  // Les savoirs et leur principe : le panorama s'ouvre sur le principe du savoir qu'il couvre, cité tel quel.
  const principes = new Map(Object.entries(savoirs).filter(([, s]) => s.principe?.fr)
    .map(([id, s]) => [id, { id, titre: s.titre?.fr || id, principe: nettoie(s.principe.fr), ordre: nettoie(s.ordre?.fr || ''),
                             lien: `fr/v-${id}.html`, mots: new Set(mots(`${s.titre?.fr || ''} ${s.principe.fr}`)) }]));
  return { ...statistiques(entrees), entrees, fermees, principes, parId: new Map(entrees.map((e) => [e.id, e])),
           pano: { ...statistiques(fiches), fiches, parId: new Map(fiches.map((x) => [x.id, x])) } };
}

function statistiques(liste) {
  const docs = liste.map((e) => mots(e.texte));
  const df = new Map();
  docs.forEach((d) => new Set(d).forEach((m) => df.set(m, (df.get(m) || 0) + 1)));
  const moy = docs.reduce((a, d) => a + d.length, 0) / (docs.length || 1);
  return { docs, df, moy };
}

export function bm25(index, requete) {
  if (!index.docs.length) return [];
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
    if (ctx.seulement && e.fiche !== ctx.seulement) return { e, s: 0 };   // la personne a désigné la fiche
    let s = scores[i];
    if (ctx.fiche && e.fiche === ctx.fiche) s *= 1.5;
    if (e.type === 'fiche' && e.socle) s *= 1.3;   // fiches « Commencer ici » : porte d'entrée des questions larges
    if (ctx.etape && e.type === 'coince' && e.fiche === ctx.fiche && e.etapes.includes(ctx.etape)) s = s * 2 + 0.5;
    return { e, s };
  });
  return notes.filter((x) => x.s > 0).sort((a, z) => z.s - a.s).slice(0, n);
}

const SYSTEME = "Tu es l'aiguilleur de la station CivicNode. Tu ne rédiges jamais de texte. "
  + "On te donne une question et une liste d'entrées, chacune avec son identifiant. "
  + "Les entrées sont déjà classées de la plus probable à la moins probable par une recherche par mots. "
  + "Quand la question décrit un problème, préfère l'entrée « Problème » qui le décrit, plutôt qu'une étape. "
  + "Choisis de 0 à 3 identifiants dont l'entrée répond directement à la question, de la plus utile à la moins utile. "
  + "Si aucune entrée ne répond, renvoie une liste vide. "
  + 'Réponds uniquement par un objet JSON de la forme {"choix": ["identifiant", ...]}.';

// Appel commun à llama-server : la réponse est contrainte par un schéma JSON.
async function appelerModele(url, messages, nom, schema, maxTokens, delai) {
  const corps = {
    messages, temperature: 0, max_tokens: maxTokens,
    chat_template_kwargs: { enable_thinking: false },
    response_format: { type: 'json_schema', json_schema: { name: nom, strict: true, schema } },
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
    return JSON.parse(texte.slice(texte.indexOf('{'), texte.lastIndexOf('}') + 1));
  } finally {
    clearTimeout(minuterie);
  }
}

async function demanderAuModele(url, question, ctx, liste, delai) {
  const ids = liste.map((x) => x.e.id);
  const contexte = (ctx.fiche ? `\nContexte : la personne suit la fiche ${ctx.fiche}${ctx.etape ? `, étape ${ctx.etape}` : ''}.` : '')
    + (ctx.precedentes?.length ? `\nQuestions précédentes de la conversation : ${ctx.precedentes.map((x) => `« ${x} »`).join(', ')}.` : '');
  const objet = await appelerModele(url, [
    { role: 'system', content: SYSTEME },
    { role: 'user', content: `Question : ${question}${contexte}\n\nEntrées :\n`
        + liste.map((x) => `${x.e.id} — ${x.e.court}`).join('\n') + '\n/no_think' },
  ], 'choix', {
    type: 'object', additionalProperties: false, required: ['choix'],
    properties: { choix: { type: 'array', maxItems: 3, items: { type: 'string', enum: ids } } },
  }, 96, delai);
  const valides = new Set(ids);
  // Seconde barrière : on ne garde que des identifiants proposés, sans doublon.
  return [...new Set((objet.choix || []).filter((id) => typeof id === 'string' && valides.has(id)))].slice(0, 3);
}

// Point d'entrée : renvoie { mode, choix: [entrées], candidats, erreur? }.
// Stratégies : « recherche » (sans modèle), « modele » (le modèle choisit et ordonne),
// « hybride » (le modèle juge s'il y a une réponse ; la recherche ordonne, et le premier choix du modèle est gardé).
export async function classer(index, question, ctx = {}, options = {}) {
  const { llamaUrl = process.env.LLAMA_URL || 'http://127.0.0.1:8080', delai = 60000, sansModele = false } = options;
  const strategie = sansModele ? 'recherche' : (options.strategie || process.env.STRATEGIE || 'hybride');
  const liste = candidats(index, question, ctx);
  const N = 5;   // nombre de passages affichés
  const repli = (erreur) => ({ mode: 'recherche', erreur,
    choix: liste.slice(0, N).map((x) => x.e), candidats: liste.map((x) => x.e) });
  if (!question.trim() || !liste.length) return { mode: strategie, choix: [], candidats: [], notes: [], modeleIds: [] };
  if (strategie === 'recherche') return { ...repli(), notes: liste, modeleIds: [] };
  try {
    const ids = await demanderAuModele(llamaUrl, question, ctx, liste, delai);
    const base = { candidats: liste.map((x) => x.e), notes: liste, modeleIds: ids };
    if (strategie === 'hybride') {
      if (!ids.length) return { mode: 'hybride', choix: [], ...base };
      const ordre = liste.slice(0, N).map((x) => x.e.id);
      if (!ordre.includes(ids[0])) ordre[Math.min(N - 1, ordre.length)] = ids[0];
      return { mode: 'hybride', choix: ordre.map((id) => index.parId.get(id)), ...base };
    }
    return { mode: 'modele', choix: ids.map((id) => index.parId.get(id)), ...base };
  } catch (e) {
    return { ...repli(e.name === 'AbortError' ? 'le modèle a mis trop de temps' : String(e.message || e)),
             notes: liste, modeleIds: [] };
  }
}

// Organise une réponse : d'abord la fiche qui correspond, puis, seulement si l'assistant en est sûr,
// les passages précis de cette fiche, puis les autres fiches à voir.
// Un passage est « sûr » s'il a été choisi par le modèle, ou si la recherche le place presque au niveau du meilleur.
export function composer(index, r, seuil = 0.8) {
  if (!r.choix.length) return null;
  const modele = new Set(r.modeleIds || []);
  const tete = r.modeleIds?.length ? index.parId.get(r.modeleIds[0]) : r.choix[0];
  const fiche = index.parId.get(tete.fiche);
  const meilleur = r.notes.length ? r.notes[0].s : 0;
  const passages = r.notes
    .filter((x) => x.e.fiche === fiche.id && x.e.type !== 'fiche')
    .filter((x) => modele.has(x.e.id) || x.s >= seuil * meilleur)
    .slice(0, 2).map((x) => x.e);
  const aussi = [...new Set([...r.choix, ...r.notes.map((x) => x.e)].map((e) => e.fiche))]
    .filter((id) => id !== fiche.id).slice(0, 2).map((id) => index.parId.get(id));
  return { fiche, passages, aussi };
}

// Fiches pas encore ouvertes qui partagent au moins deux mots avec la demande.
// À égalité, ce qui se fait dans l'instant passe avant ce qui prend des heures, puis des saisons.
const ORDRE_HORIZON = { instant: 0, hours: 1, seasons: 2 };
export function aVenirPour(index, question, n = 3) {
  const q = new Set(mots(question));
  const rang = (f) => ORDRE_HORIZON[f.horizon] ?? 3;
  return index.fermees.map((f) => ({ f, k: [...f.mots].filter((m) => q.has(m)).length }))
    .filter((x) => x.k >= 2).sort((a, z) => z.k - a.k || rang(a.f) - rang(z.f)).slice(0, n).map((x) => x.f);
}

// Les fiches en tête de la recherche, avec leur meilleure note : sert à savoir si une question est ambiguë.
export function fichesEnTete(index, r, n = 3) {
  const max = new Map();
  for (const x of r.notes) if (!max.has(x.e.fiche)) max.set(x.e.fiche, x.s);
  return [...max].slice(0, n).map(([id, s]) => ({ fiche: index.parId.get(id), s }));
}

// ---- Rédaction encadrée -------------------------------------------------------------------------

const REDACTEUR = "Tu es l'assistant de la station CivicNode, qui aide à se débrouiller pendant une coupure. "
  + 'Tu réponds en français, en vouvoyant, sur un ton simple et direct. '
  + "Tu n'utilises QUE les extraits de fiches fournis : tu n'ajoutes aucune consigne, aucun chiffre, "
  + "aucun produit ni aucune marque qui n'y figure pas. "
  + 'Dans "reponse", écris une synthèse de 1 ou 2 phrases, 45 mots au plus : la fiche affiche déjà les étapes, '
  + 'les détails et les risques, ne les répète pas. '
  + "Ne suppose jamais que la personne possède un équipement : si la fiche en demande un, dis-le comme une condition. "
  + "Si la demande exclut quelque chose (« sans électricité », « sans voiture »), ne le propose pas. "
  + "Si la fiche ne couvre pas la situation de la personne, dis-le franchement, dis ce qu'elle permet quand même, "
  + "et nomme la fiche à venir si une est indiquée. "
  + 'Si la demande est trop vague pour savoir ce que veut la personne, laisse "reponse" vide '
  + 'et écris dans "question" une seule question courte qui demande ce que la personne veut faire, sans proposer de réponse. '
  + 'Sinon, laisse "question" vide.';

// Le texte que le modèle reçoit : la fiche choisie, ses étapes, les passages retenus, ses risques.
export function contexteRedaction(index, c) {
  const f = c.fiche;
  const etapes = index.entrees.filter((e) => e.fiche === f.id && e.type === 'etape');
  const ligne = (e) => (e.type === 'coince'
    ? `- Problème : ${nettoie(e.probleme)} Solution : ${nettoie(e.reponse)}`
    : `- Étape ${e.etape} « ${e.titre} » : ${nettoie(e.action)}${e.verif ? ` Vérification : ${nettoie(e.verif)}` : ''}`);
  return [
    `Fiche « ${f.titreFiche} »`,
    `Ce que propose la fiche : ${f.principe}`,
    f.exige ? `Ce qu'il faut avoir : ${f.exige}` : '',
    `Étapes de la fiche :\n${etapes.map((e) => `${e.etape}. ${e.titre} : ${nettoie(e.action).slice(0, 260)}`).join('\n')}`,
    c.passages.length ? `Passages qui répondent à la question :\n${c.passages.map(ligne).join('\n')}` : '',
    f.risques.length ? `Risques signalés par la fiche : ${f.risques.map(nettoie).join(' ')}` : '',
    c.aVenir?.length ? `Fiches à venir, pas encore disponibles sur la station : ${c.aVenir.map((x) => `« ${x.titre} »`).join(', ')}` : '',
  ].filter(Boolean).join('\n');
}

const nombres = (t) => (t.match(/\d+(?:[.,]\d+)?/g) || []).map((n) => n.replace(',', '.'));

// Garde-fou : la rédaction est écartée si elle cite un chiffre qui n'est ni dans les fiches ni dans la question,
// si elle contient un lien, ou si elle est vide.
export function verifierRedaction(texte, sources) {
  const t = (texte || '').trim();
  if (!t) return 'vide';
  if (/https?:|www\./i.test(t)) return 'elle contenait un lien';
  const connus = new Set(nombres(sources));
  const inconnus = nombres(t).filter((n) => !connus.has(n));
  if (inconnus.length) return `elle citait un chiffre absent des fiches (${inconnus.join(', ')})`;
  return null;
}

// Nombre de questions dont l'assistant se souvient. Station sobre (peu d'énergie) : MEMOIRE=4.
export const MEMOIRE = Math.max(0, Number(process.env.MEMOIRE ?? 10));
const BUDGET_HISTORIQUE = 6000;   // caractères, pour tenir dans un contexte de 8192 jetons

// historique : [{ q, texte }] des tours précédents, du plus ancien au plus récent.
export async function rediger(index, c, question, historique = [], options = {}) {
  const { llamaUrl = process.env.LLAMA_URL || 'http://127.0.0.1:8080', delai = 60000, preciser = null } = options;
  // preciser : liste de fiches possibles pour une demande trop vague ; le modèle ne fait alors que poser la question.
  const contexte = preciser
    ? `Fiches possibles :\n${preciser.map((f) => `- « ${f.titreFiche} » : ${f.accroche}`).join('\n')}`
    : contexteRedaction(index, c);
  const messages = [{ role: 'system', content: REDACTEUR }];
  let hist = MEMOIRE ? historique.slice(-MEMOIRE) : [];
  while (hist.length && hist.reduce((a, h) => a + h.q.length + (h.texte || '').length, 0) > BUDGET_HISTORIQUE) hist = hist.slice(1);
  for (const h of hist) {
    messages.push({ role: 'user', content: h.q });
    messages.push({ role: 'assistant', content: JSON.stringify({ reponse: h.texte || '', question: h.question || '' }) });
  }
  if (hist.length) messages[0].content += " Tiens compte de toute la conversation : une relance courte (« et avec la voiture ? ») prolonge la question précédente.";
  messages.push({ role: 'user', content: preciser
    ? `${contexte}\n\nDemande : ${question}\nCette demande est trop vague. Laisse "reponse" vide et écris dans "question" `
      + 'une seule question courte qui aide la personne à dire ce qu\'elle veut faire, en t\'appuyant sur les fiches possibles.\n/no_think'
    : `Extraits de fiches :\n${contexte}\n\nQuestion : ${question}\n/no_think` });
  try {
    const o = await appelerModele(llamaUrl, messages, 'redaction', {
      type: 'object', additionalProperties: false, required: ['reponse', 'question'],
      properties: { reponse: { type: 'string', maxLength: 320 }, question: { type: 'string', maxLength: 160 } },
    }, 220, delai);
    const sources = `${contexte} ${question} ${historique.map((h) => h.q).join(' ')}`;
    const texte = preciser ? '' : String(o.reponse || '').replace(/\*\*|__|`/g, '').trim();
    const q = String(o.question || '').trim();
    const ecartee = texte ? verifierRedaction(texte, sources) : null;
    // Une rédaction écartée emporte sa question : elle n'a plus de raison d'être posée.
    // Une question n'est gardée que sans réponse : une réponse se suffit, la conversation permet de préciser.
    const questionOk = q && !texte && !verifierRedaction(q, sources) ? q : '';
    return { texte: ecartee ? '' : texte, question: questionOk, ecartee, brut: texte };
  } catch (e) {
    return { texte: '', question: '', ecartee: e.name === 'AbortError' ? 'le modèle a mis trop de temps' : 'le modèle n\'a pas répondu' };
  }
}

// ---- Panorama des solutions ---------------------------------------------------------------------

// Les fiches qui répondent à une demande, ouvertes ou à venir, de la plus immédiate à la plus longue.
const ORDRE_H = ORDRE_HORIZON;
export function panorama(index, question, ctx = {}, n = 7) {
  const scores = bm25(index.pano, question);
  const notes = index.pano.fiches.map((f, i) => ({ f, s: scores[i] * (ctx.fiche === f.id ? 1.3 : 1) }))
    .filter((x) => x.s > 0).sort((a, z) => z.s - a.s);
  if (!notes.length) return [];
  const seuil = 0.55 * notes[0].s;
  const liste = notes.filter((x) => x.s >= seuil).slice(0, n).map((x) => x.f);
  liste.meilleure = notes[0].f.id;   // la fiche la mieux notée, avant le tri par niveaux
  liste.notes = new Map(notes.map((x) => [x.f.id, x.s / notes[0].s]));
  return liste.sort((a, z) => (ORDRE_H[a.horizon] ?? 3) - (ORDRE_H[z.horizon] ?? 3) || Math.min(...a.tier, 9) - Math.min(...z.tier, 9));
}

// Le savoir principal d'un panorama : chaque savoir prend la note de sa fiche la mieux classée (le savoir principal
// d'une fiche compte double). Seul un savoir qui a un principe peut ouvrir la réponse.
// Les mots de la demande retrouvés dans le titre et le principe d'un savoir départagent les fiches qui se ressemblent.
export function savoirDuPanorama(index, liste, question = '') {
  const poids = new Map();
  const q = [...new Set(mots(question))];
  for (const f of liste) {
    if (f.socle) continue;
    const note = liste.notes?.get(f.id) ?? 0.5;
    (f.savoirs || []).forEach((sv, i) => poids.set(sv, Math.max(poids.get(sv) || 0, note * note * (i === 0 ? 2 : 1))));
  }
  // Un mot rare parmi les savoirs (« radio ») pèse plus qu'un mot qu'ils partagent tous (« téléphone »).
  const tous = [...(index.principes?.values() || [])];
  const idf = (m) => Math.log((tous.length + 1) / (1 + tous.filter((p) => p.mots.has(m)).length));
  const total = q.reduce((a, m) => a + idf(m), 0);
  for (const sv of poids.keys()) {
    const p = index.principes?.get(sv);
    if (p && total > 0) poids.set(sv, poids.get(sv) + 2 * q.filter((m) => p.mots.has(m)).reduce((a, m) => a + idf(m), 0) / total);
  }
  // Le principe n'ouvre la réponse que si le savoir porte au moins deux des fiches proposées (ou la seule) :
  // un savoir représenté par une seule fiche parmi d'autres risquerait d'annoncer un principe hors sujet.
  const vraies = liste.filter((f) => !f.socle);
  const minimum = Math.min(2, vraies.length);
  const nb = (sv) => vraies.filter((f) => (f.savoirs || []).includes(sv)).length;
  const tri = [...poids].filter(([sv]) => index.principes?.has(sv) && nb(sv) >= minimum).sort((a, z) => z[1] - a[1]);
  return tri.length ? index.principes.get(tri[0][0]) : null;
}

// La règle affichée sous une solution : le premier risque propre à la fiche, cité tel quel.
export const regle = (f) => f.risques.find((r) => !/^Tous ceux/i.test(r)) || '';

const REDACTEUR_SOLUTIONS = "Tu es l'assistant de la station CivicNode : un technicien pragmatique qui aide à se débrouiller "
  + 'pendant une coupure. Tu réponds en français, en vouvoyant. On te donne une demande et des fiches. '
  + "Tu n'utilises QUE ces fiches : aucune consigne, aucun chiffre, aucun produit qui n'y figure pas. "
  + 'Pour chaque fiche qui répond vraiment à la demande, écris une solution : '
  + '"libelle" est un nom d\'action de 2 à 5 mots (par exemple « Utiliser ce qui existe », « Adapter un vélo », '
  + '« Trouver une prise ailleurs ») ; "texte" fait 1 ou 2 phrases : ce que c\'est concrètement, puis ce qu\'on peut '
  + "en attendre de façon réaliste (effort, rendement, limite, ou pour qui c'est fait). "
  + "Ne parle pas de sécurité : la règle de chaque fiche est affichée à part. Ignore les fiches qui ne répondent pas. "
  + 'Si la demande exclut quelque chose (« sans électricité », « sans voiture »), écarte la fiche qui en dépend. '
  + '"intro" est une seule phrase courte qui annonce les solutions, sans les détailler et sans répéter le principe, '
  + 'qui est affiché juste avant elle.';

function contexteSolution(f) {
  return `[${f.id}] « ${f.titre} »${f.socle ? ' — à présenter comme la façon de se préparer avant une coupure' : ''}\nCe que propose la fiche : ${f.principe}\n`
    + (f.exige ? `Il faut : ${f.exige}\n` : '') + `Étapes : ${f.etapes.join(' ; ')}`;
}

export async function redigerSolutions(index, fiches, question, historique = [], options = {}) {
  const { llamaUrl = process.env.LLAMA_URL || 'http://127.0.0.1:8080', delai = 120000 } = options;
  const ids = fiches.map((f) => f.id);
  const messages = [{ role: 'system', content: REDACTEUR_SOLUTIONS }];
  let hist = MEMOIRE ? historique.slice(-MEMOIRE) : [];
  while (hist.length && hist.reduce((a, h) => a + h.q.length + (h.texte || '').length, 0) > BUDGET_HISTORIQUE) hist = hist.slice(1);
  for (const h of hist) {
    messages.push({ role: 'user', content: h.q });
    messages.push({ role: 'assistant', content: h.texte || '' });
  }
  messages.push({ role: 'user', content: `Fiches :\n${fiches.map(contexteSolution).join('\n\n')}\n\nDemande : ${question}\n/no_think` });
  try {
    const o = await appelerModele(llamaUrl, messages, 'solutions', {
      type: 'object', additionalProperties: false, required: ['intro', 'solutions'],
      properties: {
        intro: { type: 'string', maxLength: 200 },
        solutions: { type: 'array', maxItems: ids.length, items: {
          type: 'object', additionalProperties: false, required: ['fiche', 'libelle', 'texte'],
          properties: { fiche: { type: 'string', enum: ids }, libelle: { type: 'string', maxLength: 50 },
                        texte: { type: 'string', maxLength: 320 } } } },
      },
    }, 1000, delai);
    const propre = (t) => String(t || '').replace(/\*\*|__|`/g, '').trim();
    const vues = new Set();
    const solutions = [];
    for (const x of o.solutions || []) {
      const f = index.pano.parId.get(x.fiche);
      if (!f || vues.has(f.id)) continue;
      vues.add(f.id);
      const libelle = propre(x.libelle), texte = propre(x.texte);
      // Garde-fou par solution : seuls les chiffres de sa propre fiche ou de la demande sont admis.
      const ecartee = verifierRedaction(`${libelle} ${texte}`, `${contexteSolution(f)} ${f.risques.join(' ')} ${question}`);
      solutions.push({ id: f.id, libelle: ecartee ? '' : libelle, texte: ecartee ? '' : texte, ecartee });
    }
    const intro = propre(o.intro);
    const introOk = intro && !verifierRedaction(intro, `${fiches.map(contexteSolution).join(' ')} ${question}`) ? intro : '';
    return { intro: introOk, solutions };
  } catch (e) {
    return { intro: '', solutions: [], erreur: e.name === 'AbortError' ? 'le modèle a mis trop de temps' : 'le modèle n\'a pas répondu' };
  }
}

// ---- Réponse à une demande ------------------------------------------------------------------------
// Deux formes :
//  - « solutions » : la demande appelle un panorama (comment faire, comment recharger…) ;
//    plusieurs fiches répondent, chacune devient une solution avec son niveau et sa règle.
//  - « fiche » : la demande décrit un problème précis (« la prise de la voiture ne donne rien ») ;
//    une fiche et le passage qui le résout.
export async function repondre(index, demande, { ctx = {}, precedente = '', historique = [], actif = true, redaction = true } = {}) {
  let r = await classer(index, demande, ctx, { sansModele: !actif });
  if (!r.notes.length && precedente && mots(demande).length < 3) {
    r = await classer(index, `${demande} ${precedente}`, ctx, { sansModele: !actif });
  }
  // Le modèle a jugé qu'aucune fiche ouverte ne répond : on ne cherche pas plus loin.
  if (r.mode === 'hybride' && !r.modeleIds.length) return { type: 'rien', mode: r.mode };
  const c = composer(index, r);
  const tete = r.modeleIds?.length ? index.parId.get(r.modeleIds[0]) : r.notes[0]?.e;
  const pano = panorama(index, demande, ctx);
  // Panorama si la demande est large (la meilleure entrée est une fiche entière), ou si une autre fiche,
  // ouverte ou à venir, couvre mieux le sujet. Un problème décrit, ou une étape précise, reste sur sa fiche.
  const large = tete?.type === 'fiche' || (tete?.type === 'etape' && pano.meilleure && pano.meilleure !== tete.fiche);
  if (tete?.type !== 'coince' && (large || !c) && pano.length >= (c ? 2 : 1)) {
    // Une recherche sert aussi à se préparer : la fiche socle (préparer une coupure) fait toujours partie du panorama.
    const socle = index.pano.fiches.find((f) => f.socle);
    if (socle && !pano.includes(socle)) {
      pano.push(socle);
      pano.sort((a, z) => (ORDRE_H[a.horizon] ?? 3) - (ORDRE_H[z.horizon] ?? 3) || Math.min(...a.tier, 9) - Math.min(...z.tier, 9));
    }
    const sv = savoirDuPanorama(index, pano, demande);
    const res = { type: 'solutions', mode: r.mode, intro: '', savoir: sv ? sv.id : '',
                  solutions: pano.map((f) => ({ id: f.id, libelle: '', texte: '' })) };
    if (actif && redaction) {
      const red = await redigerSolutions(index, pano, demande, historique);
      if (red.solutions.length) {
        // Ordre des niveaux, pas celui du modèle ; les fiches qu'il a écartées disparaissent.
        const parId = new Map(red.solutions.map((x) => [x.id, x]));
        if (socle && !parId.has(socle.id)) parId.set(socle.id, { id: socle.id, libelle: 'Se préparer à l\'avance', texte: '' });
        res.solutions = pano.filter((f) => parId.has(f.id)).map((f) => parId.get(f.id));
        // Le principe suit les fiches que le modèle a gardées.
        const gardees = Object.assign(pano.filter((f) => parId.has(f.id)), { notes: pano.notes });
        res.savoir = savoirDuPanorama(index, gardees, demande)?.id || res.savoir;
      }
      res.intro = red.intro;
      res.erreur = red.erreur;
    }
    return res;
  }
  if (!c) return { type: 'rien', mode: r.mode };
  const res = { type: 'fiche', mode: r.mode, fiche: c.fiche.id, passages: c.passages.map((e) => e.id),
                aussi: c.aussi.map((f) => f.id), aVenir: aVenirPour(index, demande).map((f) => f.id), redaction: null };
  if (actif && redaction) {
    c.aVenir = res.aVenir.map((id) => index.fermees.find((f) => f.id === id));
    res.redaction = await rediger(index, c, demande, historique);
  }
  return res;
}

// Vérifie rapidement si llama-server répond.
export async function modeleDisponible(url = process.env.LLAMA_URL || 'http://127.0.0.1:8080') {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 1500);
  try { return (await fetch(`${url}/health`, { signal: ctrl.signal })).ok; }
  catch { return false; }
  finally { clearTimeout(t); }
}
