// Fait une copie texte de chaque source adaptée des fiches : agent/sources/<id de la fiche>/<sN>.txt.
// À lancer sur un ordinateur relié à Internet, depuis le dossier du projet :   npm run sources
// La copie garde ce qui a été lu, à une date donnée : le vérificateur y cherche les chiffres de la fiche, et la
// relecture IA compare la fiche à ces copies, sans dépendre d'une page qui peut changer ou disparaître.
// Seules les sources adaptées (domaine public, CC BY, CC BY-SA…) sont copiées : leur licence le permet.
//   npm run sources                  copie les sources qui n'ont pas encore de copie
//   npm run sources -- --tout        recopie tout (après une mise à jour des sources)
//   npm run sources -- <id-fiche>    seulement cette fiche
//   npm run sources -- --essai <adresse>   lit une page des deux façons et montre le résultat, sans rien écrire
// Une page qui refuse la lecture simple (robots bloqués, page construite par JavaScript) est rouverte avec
// Playwright, un vrai navigateur sans fenêtre. Son installation : npm install, puis npx playwright install chromium
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus } from '../src/lib/corpus.mjs';
import { adaptable } from '../src/lib/licences.mjs';
import { sansHtml } from './adapter.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');

export const cheminCopie = (fiche, s) => path.join(ICI, 'sources', fiche, `${s}.txt`);
export function enTeteCopie(s, date) {
  return `# Copie de la source ${s.id} : « ${s.titre} »\n# Auteur : ${s.auteur || ''}\n# Lien : ${s.source}\n`
    + `# Licence : ${s.licence}\n# Copiée le : ${date}\n\n`;
}

const MINIMUM = 200; // en dessous, la page est vide ou n'a rendu qu'un message de refus
function assezDeTexte(texte) {
  if (texte.length < MINIMUM) throw new Error('page presque vide');
  return texte;
}

// Lecture simple : la page telle que le serveur l'envoie.
export async function lireSimple(url) {
  const rep = await fetch(url, { headers: { 'User-Agent': 'CivicNode/1 (https://github.com/civicnode-eu/civicnode)' } });
  if (!rep.ok) throw new Error(`la page répond ${rep.status}`);
  return assezDeTexte(sansHtml(await rep.text()));
}

// Lecture avec Playwright : la page telle qu'un navigateur l'affiche. Chargé seulement quand il sert.
export async function lireNavigateur(url) {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { throw new Error("Playwright n'est pas installé (npm install)"); }
  let navigateur;
  try { navigateur = await chromium.launch(); }
  catch { throw new Error("le navigateur de Playwright n'est pas installé (npx playwright install chromium)"); }
  try {
    const page = await navigateur.newPage();
    const rep = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (rep && !rep.ok()) throw new Error(`la page répond ${rep.status()}`);
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}); // certaines pages ne se taisent jamais
    return assezDeTexte(sansHtml(await page.content()));
  } finally {
    await navigateur.close();
  }
}

// La lecture simple d'abord ; si elle échoue, Playwright ; l'échec n'est déclaré que si les deux échouent.
export async function lireSource(url, { simple = lireSimple, navigateur = lireNavigateur } = {}) {
  try {
    return { texte: await simple(url), moyen: 'lecture simple' };
  } catch (e1) {
    try {
      return { texte: await navigateur(url), moyen: 'Playwright' };
    } catch (e2) {
      throw new Error(`${e1.message} ; puis avec Playwright : ${e2.message.split('\n')[0]}`);
    }
  }
}

async function essai(url) {
  console.log(`Essai de lecture, sans rien écrire : ${url}\n`);
  for (const [nom, lire] of [['Lecture simple', lireSimple], ['Playwright', lireNavigateur]]) {
    try {
      const texte = await lire(url);
      console.log(`✓ ${nom} : ${Math.round(texte.length / 1000)} k caractères. Début : « ${texte.slice(0, 160)}… »`);
    } catch (e) {
      console.log(`✗ ${nom} : ${e.message.split('\n')[0]}`);
    }
  }
  try {
    const { moyen } = await lireSource(url);
    console.log(`\nnpm run sources ferait la copie par : ${moyen}.`);
  } catch (e) {
    console.log(`\nnpm run sources déclarerait un échec : ${e.message}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--essai')) {
    const url = args[args.indexOf('--essai') + 1];
    if (!url || !/^https?:/.test(url)) { console.log('Donnez une adresse : npm run sources -- --essai https://…'); process.exit(1); }
    await essai(url);
    process.exit(0);
  }
  const tout = args.includes('--tout');
  const seules = args.filter((a) => !a.startsWith('--'));
  const c = loadCorpus(path.join(RACINE, 'corpus'), 'fr');
  const date = new Date().toISOString().slice(0, 10);
  let faites = 0, echecs = 0;
  for (const f of c.fiches) {
    if (seules.length && !seules.includes(f.id)) continue;
    for (const s of (f.meta.provenance || []).filter((x) => x.usage === 'adapte' && x.source)) {
      if (!adaptable(s.licence)) { console.log(`✗ ${f.id}/${s.id} : licence « ${s.licence} » non adaptable, pas de copie`); continue; }
      const cible = cheminCopie(f.id, s.id);
      if (fs.existsSync(cible) && !tout) continue;
      try {
        const { texte, moyen } = await lireSource(s.source);
        fs.mkdirSync(path.dirname(cible), { recursive: true });
        fs.writeFileSync(cible, enTeteCopie(s, date) + texte.replace(/(.{1,100})(\s|$)/g, '$1\n'));
        console.log(`✓ ${f.id}/${s.id} (${Math.round(texte.length / 1000)} k caractères${moyen === 'Playwright' ? ', lue avec Playwright' : ''})`);
        faites++;
      } catch (e) {
        echecs++;
        console.log(`✗ ${f.id}/${s.id} : ${e.message} (${s.source})`);
      }
    }
  }
  console.log(`\n${faites} copie(s) faite(s), ${echecs} échec(s).`);
  if (echecs) console.log("Pour une page qui refuse même avec Playwright : ouvrez-la dans le navigateur, copiez son texte dans le fichier indiqué, avec les lignes d'en-tête.");
}
