// Télécharge les médias des fiches qui ne sont pas encore dans public/medias/ (champ « telecharger » d'un média).
// À lancer sur un ordinateur relié à Internet, depuis le dossier du projet :   npm run medias
// Le fichier est enregistré sous public/medias/<id de la fiche>/<fichier>. Rien d'autre n'est modifié.
// La licence a été vérifiée avant, sur la page du fichier (champ verifie_le) : ce script ne fait que copier.
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const liste = aTelecharger(loadCorpus(path.join(RACINE, 'corpus'), 'fr'));
  if (!liste.length) { console.log('Tous les médias sont déjà là.'); process.exit(0); }
  let echecs = 0;
  for (const x of liste) {
    try {
      const rep = await fetch(x.url, { headers: { 'User-Agent': 'CivicNode/1 (https://github.com/civicnode-eu/civicnode)' } });
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
  console.log(echecs ? `\n${echecs} échec(s).` : '\nTerminé. Vérifiez chaque image à l\'œil avant de publier.');
  process.exit(echecs ? 1 : 0);
}
