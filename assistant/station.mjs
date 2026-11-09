// Serveur de la station CivZero : sert le site construit (dist/) et la page de l'assistant.
// Aucune dépendance en plus de celles du site. Aucune page n'a besoin de JavaScript.
//
//   PORT       port d'écoute (défaut 8000)
//   LLAMA_URL  adresse de llama-server (défaut http://127.0.0.1:8080)
//   HOTE       interface d'écoute (défaut 0.0.0.0 : visible sur le réseau local)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { construireIndex, classer, modeleDisponible } from './classifieur.mjs';
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

function carte(e) {
  if (e.type === 'coince') {
    return `<a class="opt" href="${E(e.lien)}"><span><span class="note">SI ÇA COINCE · ${E(e.titreFiche)}</span>`
      + `<span class="t">${mdi(cap(e.probleme))}</span><span class="s">${mdi(cap(e.reponse))}</span></span>`
      + '<span class="go" aria-hidden="true">&gt;</span></a>';
  }
  if (e.type === 'etape') {
    return `<a class="opt" href="${E(e.lien)}"><span><span class="note">ÉTAPE ${e.etape} · ${E(e.titreFiche)}</span>`
      + `<span class="t">${E(e.titre)}</span><span class="s">${mdi(cap(e.action))}</span></span>`
      + '<span class="go" aria-hidden="true">&gt;</span></a>';
  }
  return `<a class="opt" href="${E(e.lien)}"><span><span class="note">FICHE</span>`
    + `<span class="t">${E(e.titreFiche)}</span><span class="s">Ouvrir la fiche</span></span>`
    + '<span class="go" aria-hidden="true">&gt;</span></a>';
}

async function pageAssistant(params) {
  const q = (params.get('q') || '').slice(0, 300).trim();
  const fiche = index.parId.has(params.get('fiche') || '') ? params.get('fiche') : '';
  const etape = Number(params.get('etape')) || 0;
  const actif = await modeleActif();
  let resultat = '';
  if (q) {
    const r = await classer(index, q, { fiche, etape }, { sansModele: !actif });
    journaliser({ q, fiche, etape, mode: r.mode, choix: r.choix.map((e) => e.id) });
    const origine = r.mode === 'modele'
      ? "L'assistant a choisi ces passages dans les fiches. Le texte est celui des fiches, tel quel."
      : "Assistant indisponible : voici les passages les plus proches trouvés par la recherche.";
    resultat = r.choix.length
      ? `<h2>Réponses</h2><p class="src">${origine}</p><div class="choix">${r.choix.map(carte).join('')}</div>`
      : '<p class="vide-grand" aria-hidden="true">[ ∅ ]</p><h2>Aucune fiche ne répond à cette question</h2>'
        + '<p class="lead">Votre question est enregistrée sur la station : elle aidera à choisir les prochaines fiches. '
        + 'Essayez d\'autres mots, ou parcourez <a href="toutes.html">toutes les fiches</a>.</p>';
  }
  const retour = fiche && etape ? `f-${fiche}-e${etape}.html` : fiche ? `f-${fiche}.html` : 'index.html';
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Assistant · CivZero</title><style>${CSS}</style></head><body>
<header class="bar"><div class="in"><a href="index.html">CIVZERO // STATION HORS-LIGNE</a>
<span>ASSISTANT : ${actif ? 'ACTIF' : 'ÉTEINT (RECHERCHE SEULE)'}</span></div></header>
<main>
<div class="crumb"><span>/ <strong>ASSISTANT D'ATELIER</strong>${fiche ? ` · ${E(index.parId.get(fiche).titreFiche)}${etape ? `, étape ${etape}` : ''}` : ''}</span><a href="index.html">ACCUEIL</a></div>
<h1>&gt; Posez votre question</h1>
<p class="lead">L'assistant ne rédige rien : il désigne les passages des fiches qui répondent. Vérifiez toujours le niveau de danger de la fiche.</p>
<form class="cherche" action="assistant" method="get">
<label class="lab" for="q">Votre question</label>
<div><input id="q" name="q" type="search" value="${E(q)}" placeholder="Ma batterie externe ne charge pas">
<button class="btn plein" type="submit">[ DEMANDER ]</button></div>
${fiche ? `<input type="hidden" name="fiche" value="${E(fiche)}">` : ''}${etape ? `<input type="hidden" name="etape" value="${etape}">` : ''}
</form>
${resultat}
<div class="row"><a class="btn" href="${E(retour)}">[ &lt; REVENIR ]</a></div>
</main>
<footer class="foot"><span>Version bêta. Les fiches sont des brouillons non relus : ne les appliquez pas comme sûres.</span>
<span><a href="toutes.html">Toutes les fiches</a> · <a href="recherche.html">Recherche</a></span></footer>
</body></html>`;
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
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await pageAssistant(url.searchParams));
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
