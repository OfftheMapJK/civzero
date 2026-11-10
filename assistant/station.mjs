// Serveur de la station CivZero : sert le site construit (dist/) et la page de l'assistant.
// Aucune dépendance en plus de celles du site. Aucune page n'a besoin de JavaScript.
//
//   PORT       port d'écoute (défaut 8000)
//   LLAMA_URL  adresse de llama-server (défaut http://127.0.0.1:8080)
//   HOTE       interface d'écoute (défaut 0.0.0.0 : visible sur le réseau local)
//   REDACTION  0 pour que l'assistant ne rédige rien (fiches et passages seulement)
//   MEMOIRE    nombre de questions dont l'assistant se souvient (défaut 10 ; station sobre : 4)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { construireIndex, repondre, regle, mots, modeleDisponible, MEMOIRE } from './classifieur.mjs';
import { mdi } from '../src/lib/corpus.mjs';

const RACINE = process.cwd();
const DIST = path.join(RACINE, 'dist');
const PORT = Number(process.env.PORT || 8000);
const HOTE = process.env.HOTE || '0.0.0.0';
const JOURNAL = path.join(RACINE, 'donnees', 'questions.jsonl');
const CSS = fs.readFileSync(path.join(RACINE, 'src', 'styles', 'global.css'), 'utf8');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream', '.pf_filter': 'application/octet-stream' };

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('Le site n\'est pas construit. Lancez d\'abord : npm run station');
  process.exit(1);
}
const index = construireIndex();
const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
const E = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let etatModele = { ok: false, quand: 0 };
async function modeleActif() {
  if (Date.now() - etatModele.quand > 30000) etatModele = { ok: await modeleDisponible(), quand: Date.now() };
  return etatModele.ok;
}

function journaliser(entree) {
  try {
    fs.mkdirSync(path.dirname(JOURNAL), { recursive: true });
    fs.appendFileSync(JOURNAL, JSON.stringify({ date: new Date().toISOString(), ...entree }) + '\n');
  } catch { /* le journal ne doit jamais empêcher de répondre */ }
}

// Phrases d'introduction : des modèles fixes, remplis avec les titres des fiches. Rien n'est rédigé par le modèle.
function phrasePassage(e) {
  if (e.type === 'coince') {
    let p = e.probleme.trim().replace(/[.!?]+$/, '');
    p = p.charAt(0).toLowerCase() + p.slice(1);
    return `Si ${p}, voici la solution prévue par la fiche :`;
  }
  const t = e.titre.replace(/\s*\([^)]*\)\s*$/, '');
  const verbe = /^[a-zàâéèêëîïôûç]+(er|ir|re|oir)$/i.test(t.split(' ')[0]);
  return verbe ? `Voici l'étape pour ${t.charAt(0).toLowerCase() + t.slice(1)} :` : `Voici l'étape « ${t} » :`;
}

function carteFiche(f, courte = false) {
  const niveau = ['vert', 'orange', 'rouge'].includes(f.danger)
    ? `DANGER ESTIMÉ : ${f.danger.toUpperCase()}${f.variante ? ` (VARIANTE ${f.variante.toUpperCase()})` : ''} · BROUILLON`
    : 'PRÉALABLE À TOUTES LES FICHES · BROUILLON';
  return `<a class="opt" href="${E(f.lien)}"><span><span class="note">${niveau}</span>`
    + `<span class="t">${E(f.titreFiche)}</span>`
    + (courte ? '' : `<span class="s">${E(f.accroche || '')}</span>`)
    + '</span><span class="go" aria-hidden="true">&gt;</span></a>';
}

function cartePassage(e) {
  if (e.type === 'coince') {
    return `<a class="opt" href="${E(e.lien)}"><span><span class="note">SOLUTION · ${E(e.titreFiche)}</span>`
      + `<span class="t">${mdi(cap(e.reponse))}</span></span><span class="go" aria-hidden="true">&gt;</span></a>`;
  }
  return `<a class="opt" href="${E(e.lien)}"><span><span class="note">ÉTAPE ${e.etape} · ${E(e.titreFiche)}</span>`
    + `<span class="t">${mdi(cap(e.action))}</span>`
    + (e.verif ? `<span class="s">Vérification : ${mdi(e.verif)}</span>` : '')
    + '</span><span class="go" aria-hidden="true">&gt;</span></a>';
}

const REDACTION = process.env.REDACTION !== '0';
const SUPPL = `
.fil { display: grid; gap: 0; }
.tour { padding-top: 1.5rem; }
.tour + .tour { border-top: 2px dashed var(--dim); margin-top: 2rem; }
.tour h2 { margin: 2rem 0 .75rem; }
.tour > p { margin: 1.25rem 0 .5rem; }
.sol { margin-top: 2rem; max-width: 70ch; }
.sol h3 { margin: 0; font-size: 1.125rem; }
.sol .niv { font-size: .8125rem; font-weight: 700; letter-spacing: .06em; color: var(--dim); margin: .25rem 0 .5rem; }
.sol .regle { font-size: .9375rem; margin: .5rem 0; }
.sol .choix { margin-top: .75rem; }
.d-vert { color: var(--vert); } .d-orange { color: var(--orange); } .d-rouge { color: var(--rouge); }
.tour-q { font-weight: 700; font-size: 1.125rem; margin: 0 0 1rem; }
.redige { max-width: 70ch; }
.redige p { margin: .35rem 0 0; }
.redige .note, .gabarit .note { display: block; font-size: .8125rem; font-weight: 700; letter-spacing: .06em; color: var(--dim); }
.gabarit { max-width: 70ch; }
.ecart { font-size: .875rem; color: var(--dim); }
.ancien .redige, .ancien .gabarit { opacity: .85; }
`;

// Conversations : gardées en mémoire sur la station (perdues au redémarrage), chaque tour est aussi journalisé.
const conversations = new Map();
function conversation(id, params) {
  if (id && conversations.has(id)) return conversations.get(id);
  const fiche = index.parId.has(params.get('fiche') || '') ? params.get('fiche') : '';
  const c = { id: crypto.randomUUID().slice(0, 8), ctx: { fiche, etape: fiche ? Number(params.get('etape')) || 0 : 0 }, tours: [] };
  conversations.set(c.id, c);
  if (conversations.size > 300) conversations.delete(conversations.keys().next().value);
  return c;
}

const lienQ = (conv, q, extra = '') => `assistant?c=${conv.id}&q=${encodeURIComponent(q)}${extra}#dernier`;

const DEMANDE = 'Que voulez-vous faire ? Expliquez brièvement la situation.';

async function traiterTour(conv, q) {
  // Les messages envoyés depuis la dernière vraie réponse forment une seule demande : « batterie », puis « électricité »…
  const attente = [];
  for (const t of [...conv.tours].reverse()) { if (t.demande) attente.unshift(t.q); else break; }
  const demande = [...attente, q].join(', ');
  const reponses = conv.tours.filter((t) => !t.demande);
  const prec = reponses.at(-1);

  // Tant que la demande tient en un ou deux mots, sans réponse ni fiche en cours, l'assistant demande, sans rien proposer.
  if (!prec && !conv.ctx.fiche && mots(demande).length <= 2) {
    conv.tours.push({ q, demande: attente.length ? `J'ai noté : « ${demande} ». ${DEMANDE}` : DEMANDE });
    journaliser({ conversation: conv.id, q, demande, precision: true });
    return;
  }

  const actif = await modeleActif();
  const ficheCtx = prec?.fiche || prec?.solutions?.[0]?.id || conv.ctx.fiche;
  const etapeCtx = !prec ? conv.ctx.etape : 0;
  const precedentes = reponses.slice(-Math.min(MEMOIRE, 3)).map((t) => t.requete || t.q);
  // Toute la conversation (dans la limite MEMOIRE), y compris les tours sans texte rédigé.
  const historique = reponses.map((t) => ({ q: t.requete || t.q, question: '', texte: resume(t) }));
  const res = await repondre(index, demande, { ctx: { fiche: ficheCtx, etape: etapeCtx, precedentes },
    precedente: prec?.requete || prec?.q || '', historique, actif, redaction: REDACTION });
  // Le modèle juge la demande trop vague pour répondre : il ne pose que sa question.
  const red = res.redaction;
  if (res.type === 'fiche' && red && !red.texte && !red.ecartee && red.question) {
    conv.tours.push({ q, demande: red.question, redigee: true });
    journaliser({ conversation: conv.id, q, demande, precision: true, question: red.question });
    return;
  }
  const tour = { q, requete: demande, ...res, fiche: res.fiche || '' };
  conv.tours.push(tour);
  journaliser({ conversation: conv.id, q, demande, type: res.type, mode: res.mode, fiche: tour.fiche,
                passages: res.passages, solutions: res.solutions?.map((x) => x.id),
                redaction: red?.texte || res.intro || '', ecartee: red?.ecartee || '' });
}

// Ce que l'assistant « a dit » à un tour, pour la mémoire de la conversation.
function resume(t) {
  if (t.type === 'solutions') {
    return [t.intro, ...t.solutions.map((x) => `${x.libelle || index.pano.parId.get(x.id).titre} : ${x.texte || index.pano.parId.get(x.id).accroche}`)]
      .filter(Boolean).join(' ');
  }
  return t.redaction?.texte || (t.fiche ? `Fiche « ${index.parId.get(t.fiche).titreFiche} ».` : 'Aucune fiche ne répond.');
}

const NIVEAU_H = { instant: 'INSTANT', hours: 'HEURES', seasons: 'SAISONS' };
function niveaux(f) {
  return [NIVEAU_H[f.horizon], f.tier?.length ? `TIER ${f.tier.join('–')}` : '',
    ['vert', 'orange', 'rouge'].includes(f.danger) ? `<span class="d-${f.danger}">DANGER ${f.danger.toUpperCase()}</span>` : '',
    f.variante ? `<span class="d-${f.variante}">VARIANTE ${f.variante.toUpperCase()}</span>` : '']
    .filter(Boolean).join(' · ');
}

function renduSolutions(t, dernier) {
  const redige = t.intro || t.solutions.some((x) => x.texte);
  let h = redige ? `<div class="redige"><span class="note">RÉPONSE RÉDIGÉE PAR L'ASSISTANT · À VÉRIFIER DANS LES FICHES</span>`
      + `<p>${E(t.intro || 'Voici les solutions que proposent les fiches, de la plus rapide à la plus longue.')}</p></div>`
    : '<div class="gabarit"><p>Voici les fiches qui répondent, de la plus rapide à la plus longue.</p></div>';
  for (const x of t.solutions) {
    const f = index.pano.parId.get(x.id);
    h += `<div class="sol"><h3>${E(x.libelle || f.titre)}</h3><p class="niv">${niveaux(f)}</p>`
      + `<p>${E(x.texte || f.accroche)}</p>`;
    if (dernier) {
      const r = regle(f);
      if (r) h += `<p class="regle"><strong>Règle :</strong> ${mdi(cap(r))}</p>`;
      if (f.avant.length) h += `<p class="regle"><strong>Avant :</strong> ${f.avant.map((a) => `fiche « ${E(a)} »`).join(', ')}.</p>`;
      h += f.ouverte
        ? `<div class="choix"><a class="opt" href="${E(f.lien)}"><span><span class="note">FICHE · BROUILLON</span>`
          + `<span class="t">${E(f.titre)}</span></span><span class="go" aria-hidden="true">&gt;</span></a></div>`
        : `<div class="choix"><div class="opt vide"><span><span class="note">FICHE À VENIR · BROUILLON</span>`
          + `<span class="t">${E(f.titre)}</span></span></div></div>`;
    }
    h += '</div>';
  }
  const origine = redige
    ? "Les noms et descriptions des solutions sont rédigés par l'assistant à partir des fiches ; les niveaux et les règles sont ceux des fiches, tels quels."
    : t.mode === 'recherche' ? 'Assistant indisponible : la recherche a choisi ces fiches.' : '';
  return h + (dernier && origine ? `<p class="src">${origine}</p>` : '');
}

function encadreRisques(f) {
  if (!f.risques.length) return '';
  return `<div class="danger"><div><span class="niv">À SAVOIR AVANT DE COMMENCER</span>`
    + `<ul>${f.risques.map((x) => `<li>${mdi(x)}</li>`).join('')}</ul></div></div>`;
}

function renduTour(conv, t, dernier) {
  let h = `<section class="tour${dernier ? '' : ' ancien'}"${dernier ? ' id="dernier"' : ''}><p class="tour-q">&gt; ${E(t.q)}</p>`;
  if (t.demande) {
    return h + `<div class="redige"><span class="note">${t.redigee ? "QUESTION RÉDIGÉE PAR L'ASSISTANT" : "L'ASSISTANT"}</span>`
      + `<p>${E(t.demande)}</p></div></section>`;
  }
  if (t.type === 'solutions') return h + renduSolutions(t, dernier) + '</section>';
  if (!t.fiche) {
    return h + '<h2>Aucune fiche ne répond à cette question</h2>'
      + '<p class="lead">Votre question est enregistrée sur la station : elle aidera à choisir les prochaines fiches. '
      + 'Essayez d\'autres mots, ou parcourez <a href="toutes.html">toutes les fiches</a>.</p></section>';
  }
  const f = index.parId.get(t.fiche);
  const red = t.redaction;

  // 2. La réponse : rédigée par le modèle et vérifiée, ou, à défaut, une phrase fixe.
  if (red?.texte) {
    h += `<div class="redige"><span class="note">RÉPONSE RÉDIGÉE PAR L'ASSISTANT · À VÉRIFIER DANS LA FICHE</span>`
      + `<p>${E(red.texte)}</p></div>`;
  } else {
    h += `<div class="gabarit"><p>Voici la fiche qui correspond : « ${E(f.titreFiche)} ». ${E(f.accroche)}</p>`
      + (red?.question ? `<p><strong>Question de l'assistant :</strong> ${E(red.question)}</p>` : '')
      + (red?.ecartee ? `<p class="ecart">Réponse rédigée écartée : ${E(red.ecartee)}. Seul le texte des fiches est affiché.</p>` : '')
      + '</div>';
  }
  if (!dernier) return h + `<p><a href="${E(f.lien)}">Fiche « ${E(f.titreFiche)} » &gt;</a></p></section>`;

  // 3. La fiche, ses risques et les passages précis, tels qu'écrits.
  h += `<h2>La fiche</h2><div class="choix">${carteFiche(f)}</div>${encadreRisques(f)}`;
  const passages = t.passages.map((id) => index.parId.get(id));
  if (passages.length) {
    h += '<h2>Pour aller droit au but</h2>'
      + passages.map((p) => `<p>${E(phrasePassage(p))}</p><div class="choix">${cartePassage(p)}</div>`).join('');
  }

  if (t.aVenir?.length) {
    h += '<h2>Pas encore sur la station</h2><div class="choix">'
      + t.aVenir.map((id) => {
        const x = index.fermees.find((f) => f.id === id);
        const niveaux = [x.horizon && ({ instant: 'INSTANT', hours: 'HEURES', seasons: 'SAISONS' }[x.horizon] || x.horizon.toUpperCase()),
          x.tier.length && `TIER ${x.tier.join('–')}`, x.danger && `DANGER ${x.danger.toUpperCase()}`].filter(Boolean).join(' · ');
        return `<div class="opt vide"><span><span class="note">FICHE À VENIR${niveaux ? ` · ${niveaux}` : ''}</span><span class="t">${E(x.titre)}</span></span></div>`;
      }).join('') + '</div>';
  }
  if (t.aussi.length) {
    h += `<h2>Voir aussi</h2><div class="choix">${t.aussi.map((id) => carteFiche(index.parId.get(id), true)).join('')}</div>`;
  }
  const origine = red?.texte
    ? "La réponse rédigée vient de l'assistant, à partir des fiches ; les fiches, leurs risques et leurs étapes sont cités tels quels."
    : t.mode !== 'recherche' ? "L'assistant a choisi la fiche et les passages ; leur texte est celui des fiches, tel quel."
      : 'Assistant indisponible : la recherche a choisi ces passages.';
  return h + `<p class="src">${origine}</p></section>`;
}

// Renvoie { redirection } après une question (pour qu'un rechargement ne la repose pas), ou { html }.
async function pageAssistant(params) {
  const conv = conversation(params.get('c'), params);
  const q = (params.get('q') || '').slice(0, 300).trim();
  if (q) {
    await traiterTour(conv, q);
    return { redirection: `/assistant?c=${conv.id}#dernier` };
  }
  const actif = await modeleActif();
  const { fiche, etape } = conv.ctx;
  const retour = fiche && etape ? `f-${fiche}-e${etape}.html` : fiche ? `f-${fiche}.html` : 'index.html';
  const fil = conv.tours.map((t, i) => renduTour(conv, t, i === conv.tours.length - 1)).join('');
  const premier = !conv.tours.length;
  return { html: `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Assistant · CivZero</title><style>${CSS}${SUPPL}</style></head><body>
<header class="bar"><div class="in"><a href="index.html">CIVZERO // STATION HORS-LIGNE</a>
<span>ASSISTANT : ${actif ? 'ACTIF' : 'ÉTEINT (RECHERCHE SEULE)'}</span></div></header>
<main>
<div class="crumb"><span>/ <strong>ASSISTANT D'ATELIER</strong>${fiche ? ` · ${E(index.parId.get(fiche).titreFiche)}${etape ? `, étape ${etape}` : ''}` : ''}</span><a href="assistant">NOUVELLE CONVERSATION</a></div>
${premier ? `<h1>&gt; Posez votre question</h1>
<p class="lead">L'assistant répond à partir des fiches de la station, et seulement d'elles. Sa réponse rédigée est signalée comme telle : vérifiez-la dans la fiche, dont les étapes et les risques sont cités tels quels en dessous.</p>` : `<div class="fil">${fil}</div>`}
<form class="cherche" action="assistant" method="get">
<input type="hidden" name="c" value="${conv.id}">
<label class="lab" for="q">${premier ? 'Votre question' : 'Continuer la conversation'}</label>
<div><input id="q" name="q" type="search" placeholder="${premier ? 'Ma batterie externe ne charge pas' : 'Et avec la voiture ?'}">
<button class="btn plein" type="submit">[ DEMANDER ]</button></div>
</form>
${!premier && MEMOIRE && conv.tours.length >= MEMOIRE ? `<p class="src">L'assistant se souvient des ${MEMOIRE} dernières questions de cette conversation.</p>` : ''}
<div class="row"><a class="btn" href="${E(retour)}">[ &lt; REVENIR ]</a>${premier ? '' : ' <a class="btn" href="assistant">[ NOUVELLE CONVERSATION ]</a>'}</div>
</main>
<footer class="foot"><span>Version bêta. Les fiches sont des brouillons non relus : ne les appliquez pas comme sûres.</span>
<span><a href="toutes.html">Toutes les fiches</a> · <a href="recherche.html">Recherche</a></span></footer>
</body></html>` };
}

function servirFichier(res, chemin) {
  let p = decodeURIComponent(chemin.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const fichier = path.resolve(DIST, '.' + p);
  if (!fichier.startsWith(DIST + path.sep)) { res.writeHead(403); res.end(); return; }
  const essais = [fichier, fichier + '.html'];
  const trouve = essais.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!trouve) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<p>Page introuvable. <a href="/index.html">Accueil</a></p>');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(trouve)] || 'application/octet-stream' });
  fs.createReadStream(trouve).pipe(res);
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://station');
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    if (url.pathname === '/assistant') {
      const p = await pageAssistant(url.searchParams);
      if (p.redirection) { res.writeHead(303, { Location: p.redirection }); res.end(); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(p.html);
      return;
    }
    servirFichier(res, url.pathname);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Erreur de la station : ' + e.message);
  }
}).listen(PORT, HOTE, async () => {
  console.log(`Station CivZero : http://localhost:${PORT}`);
  console.log(`Assistant : ${(await modeleActif()) ? 'modèle trouvé' : 'aucun modèle, recherche seule'} (${process.env.LLAMA_URL || 'http://127.0.0.1:8080'})`);
  console.log('Questions enregistrées dans donnees/questions.jsonl. Ctrl + C pour arrêter.');
});
