// Fait une copie texte de chaque source adaptée des fiches : agent/sources/<id de la fiche>/<sN>.txt.
// À lancer sur un ordinateur relié à Internet, depuis le dossier du projet :   npm run sources
// La copie garde ce qui a été lu, à une date donnée : le vérificateur y cherche les chiffres de la fiche, et la
// relecture IA compare la fiche à ces copies, sans dépendre d'une page qui peut changer ou disparaître.
// Seules les sources adaptées (domaine public, CC BY, CC BY-SA…) sont copiées : leur licence le permet.
//   npm run sources                  copie les sources qui n'ont pas encore de copie
//   npm run sources -- --tout        recopie tout (après une mise à jour des sources)
//   npm run sources -- <id-fiche>    seulement cette fiche
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
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
        const rep = await fetch(s.source, { headers: { 'User-Agent': 'CivicNode/1 (https://github.com/civicnode-eu/civicnode)' } });
        if (!rep.ok) throw new Error(`la page répond ${rep.status}`);
        const texte = sansHtml(await rep.text());
        if (texte.length < 200) throw new Error('page presque vide : à copier à la main');
        fs.mkdirSync(path.dirname(cible), { recursive: true });
        fs.writeFileSync(cible, enTeteCopie(s, date) + texte.replace(/(.{1,100})(\s|$)/g, '$1\n'));
        console.log(`✓ ${f.id}/${s.id} (${Math.round(texte.length / 1000)} k caractères)`);
        faites++;
      } catch (e) {
        echecs++;
        console.log(`✗ ${f.id}/${s.id} : ${e.message} (${s.source})`);
      }
    }
  }
  console.log(`\n${faites} copie(s) faite(s), ${echecs} échec(s).`);
  if (echecs) console.log("Pour une page qui refuse : ouvrez-la dans le navigateur, copiez son texte dans le fichier indiqué, avec les lignes d'en-tête.");
}
