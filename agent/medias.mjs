// Télécharge les médias des fiches qui ne sont pas encore dans public/medias/ (champ « telecharger » d'un média).
// À lancer sur un ordinateur relié à Internet, depuis le dossier du projet :   npm run medias
// Le fichier est enregistré sous public/medias/<id de la fiche>/<fichier>. Rien d'autre n'est modifié.
// La licence a été vérifiée avant, sur la page du fichier (champ verifie_le) : ce script ne fait que copier.
// Ensuite, pour chaque média dont la source est une page de Wikimedia Commons, il relit la licence et l'auteur par
// l'API de Commons (métadonnées étendues) et les compare à ceux de la fiche. Il signale tout désaccord, sans rien
// corriger : c'est à une personne de regarder la page du fichier et de trancher.
//   npm run medias                 tous les médias
//   npm run medias -- <id-fiche>   seulement cette fiche
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus } from '../src/lib/corpus.mjs';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX = 600 * 1024;

export function aTelecharger(corpus) {
  const liste = [];
  for (const f of corpus.fiches) for (const m of f.meta.medias || []) {
    if (!m.telecharger || !m.fichier) continue;
    const cible = path.join(RACINE, 'public', 'medias', f.id, m.fichier);
    if (!fs.existsSync(cible)) liste.push({ fiche: f.id, url: m.telecharger, cible, fichier: m.fichier });
  }
  return liste;
}

const AGENT = { 'User-Agent': 'CivicNode/1 (https://github.com/civicnode-eu/civicnode)' };

// ---------------------------------------------------------------- vérification auprès de Wikimedia Commons
// Le nom du fichier sur Commons, tiré de l'adresse de sa page (…/wiki/File:Nom.jpg) ; rien si ce n'est pas Commons.
export function titreCommons(source) {
  const m = /^https?:\/\/commons\.wikimedia\.org\/wiki\/(File:[^?#]+)/i.exec(source || '');
  if (!m) return null;
  try { return decodeURIComponent(m[1]).replace(/_/g, ' '); } catch { return null; }
}

const sansBalises = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
const simple = (t) => sansBalises(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Ramène une licence à une forme comparable : « CC BY-SA 4.0 » et « cc-by-sa-4.0 » sont la même, comme
// « domaine public » et « Public domain ».
export function licenceComparable(l) {
  const t = simple(l).replace(/creative commons/g, 'cc').replace(/attribution/g, 'by').replace(/share ?alike/g, 'sa');
  if (/cc[ -]?0|cc zero/.test(t)) return 'cc0';
  if (/public domain|domaine public|^pd\b/.test(t)) return 'domaine public';
  const m = /cc[ -]by([ -]sa)?(?:[ -]+(\d(?:\.\d)?))?/.exec(t);
  if (m) return `cc by${m[1] ? '-sa' : ''}${m[2] ? ' ' + (m[2].includes('.') ? m[2] : m[2] + '.0') : ''}`;
  return t;
}

// Même auteur si l'un des deux noms contient l'autre (« Benoît Prieur » et « Benoît Prieur (Agamitsudo) »).
export function memeAuteur(a, b) {
  const x = simple(a), y = simple(b);
  return Boolean(x && y) && (x.includes(y) || y.includes(x));
}

// Compare ce que dit la fiche à ce que dit Commons ; renvoie la liste des désaccords (vide si tout concorde).
export function comparer(media, commons) {
  const d = [];
  if (licenceComparable(media.licence) !== licenceComparable(commons.licence)) {
    d.push(`licence : la fiche dit « ${media.licence || ''} », Commons dit « ${commons.licence || 'rien'} »`);
  }
  if (!memeAuteur(media.auteur, commons.auteur)) {
    d.push(`auteur : la fiche dit « ${media.auteur || ''} », Commons dit « ${commons.auteur || 'rien'} »`);
  }
  return d;
}

// Lit la licence et l'auteur d'un fichier par l'API de Commons.
export async function lireCommons(titre, lire = fetch) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles='
    + encodeURIComponent(titre);
  const rep = await lire(url, { headers: AGENT });
  if (!rep.ok) throw new Error(`l'API de Commons répond ${rep.status}`);
  const pages = Object.values((await rep.json()).query?.pages || {});
  const meta = pages[0]?.imageinfo?.[0]?.extmetadata;
  if (!meta) throw new Error('fichier introuvable sur Commons');
  return { licence: sansBalises(meta.LicenseShortName?.value), auteur: sansBalises(meta.Artist?.value) };
}

export function mediasCommons(corpus) {
  const liste = [];
  for (const f of corpus.fiches) for (const m of f.meta.medias || []) {
    const titre = titreCommons(m.source);
    if (titre) liste.push({ fiche: f.id, media: m, titre });
  }
  return liste;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const seules = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const corpus = loadCorpus(path.join(RACINE, 'corpus'), 'fr');
  const inconnues = seules.filter((id) => !corpus.fiches.some((f) => f.id === id));
  if (inconnues.length) { console.log(`Fiche inconnue : ${inconnues.join(', ')} (donnez l'id sans le numéro, par exemple recuperer-eau-pluie).`); process.exit(1); }
  if (seules.length) corpus.fiches = corpus.fiches.filter((f) => seules.includes(f.id));
  const liste = aTelecharger(corpus);
  if (!liste.length) console.log('Tous les médias sont déjà là.');
  let echecs = 0;
  for (const x of liste) {
    try {
      const rep = await fetch(x.url, { headers: AGENT });
      if (!rep.ok) throw new Error(`la page répond ${rep.status}`);
      const type = rep.headers.get('content-type') || '';
      if (!/^image\/|^video\//.test(type)) throw new Error(`ce n'est pas une image (${type})`);
      const octets = Buffer.from(await rep.arrayBuffer());
      fs.mkdirSync(path.dirname(x.cible), { recursive: true });
      fs.writeFileSync(x.cible, octets);
      const ko = Math.round(octets.length / 1024);
      console.log(`✓ ${x.fiche}/${x.fichier} (${ko} Ko)${octets.length > MAX ? ' : plus de 600 Ko, à alléger' : ''}`);
    } catch (e) {
      echecs++;
      console.log(`✗ ${x.fiche}/${x.fichier} : ${e.message}`);
    }
  }
  if (liste.length) console.log(echecs ? `\n${echecs} échec(s).` : '\nTerminé. Vérifiez chaque image à l\'œil avant de publier.');

  const commons = mediasCommons(corpus);
  let desaccords = 0, nonLus = 0;
  if (commons.length) console.log(`\nLicence et auteur relus sur Wikimedia Commons (${commons.length} média(s)) :`);
  for (const x of commons) {
    try {
      const d = comparer(x.media, await lireCommons(x.titre));
      if (!d.length) { console.log(`✓ ${x.fiche}/${x.media.fichier} : d'accord avec Commons (${x.media.licence}, ${x.media.auteur})`); continue; }
      desaccords++;
      console.log(`⚠ ${x.fiche}/${x.media.fichier} : désaccord avec Commons\n${d.map((l) => `    ${l}`).join('\n')}\n    à regarder : ${x.media.source}`);
    } catch (e) {
      nonLus++;
      console.log(`? ${x.fiche}/${x.media.fichier} : non vérifié, ${e.message}`);
    }
  }
  if (commons.length) {
    console.log(`\n${commons.length - desaccords - nonLus} d'accord, ${desaccords} désaccord(s), ${nonLus} non vérifié(s). Rien n'a été corrigé dans les fiches.`);
  }
  process.exit(echecs ? 1 : 0);
}
