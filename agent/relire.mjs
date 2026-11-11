// Relecture IA de fidélité : compare une fiche adaptée aux copies de ses sources (agent/sources/<id>/).
//   MODELE=claude npm run relire -- <id-fiche>        (ou MODELE=local ; consigne : agent/RELECTURE.md)
// Écrit agent/relectures/<id>.yaml (le résultat, lu par le vérificateur) et agent/relectures/<id>.md (la liste pour la
// personne qui confirme). Le verdict n'est pas celui du modèle : il est recalculé à partir du détail.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { loadCorpus } from '../src/lib/corpus.mjs';
import { appelerModele } from './adapter.mjs';
import { cheminCopie } from './sources.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');

export function consigneRelecture() {
  const t = fs.readFileSync(path.join(ICI, 'RELECTURE.md'), 'utf8');
  return t.slice(t.indexOf('## Première partie'), t.indexOf('## Seconde partie')).trim();
}

// Le verdict se déduit du détail : une seule réserve suffit à demander une correction.
export function verdict(r) {
  const etapes = r.etapes || [];
  if (!etapes.length) return 'incomplete';
  if (etapes.some((e) => ['ecart', 'ajout'].includes(e.verdict))) return 'a_corriger';
  // Un chiffre non trouvé mais déclaré « À VALIDER » dans la fiche est un manque assumé, laissé à la personne qui confirme.
  if ((r.chiffres || []).some((c) => !c.trouve && !c.a_valider)) return 'a_corriger';
  if ((r.precautions_absentes || []).filter(Boolean).length) return 'a_corriger';
  return 'conforme';
}

export function listeHumaine(id, r) {
  const l = [`# Relecture de fidélité : ${id}`, '', `Relecture IA du ${r.date} (${r.modele}) : **${r.verdict}**.`, ''];
  const points = [
    ...(r.etapes || []).filter((e) => e.verdict !== 'conforme').map((e) => `Étape ${e.n} : ${e.verdict}${e.remarque ? `, ${e.remarque}` : ''}`),
    ...(r.chiffres || []).filter((c) => !c.trouve).map((c) => `Chiffre non trouvé dans les sources${c.a_valider ? ' (marqué À VALIDER)' : ''} : ${c.valeur}`),
    ...(r.precautions_absentes || []).filter(Boolean).map((p) => `Précaution de la source absente de la fiche : ${p}`),
    ...(r.niveaux ? [`Niveaux : ${r.niveaux}`] : []),
  ];
  l.push('## Points à vérifier', '', ...(points.length ? points.map((p) => `- [ ] ${p}`) : ['- Aucun point signalé.']), '');
  l.push('## Étapes jugées conformes (en vérifier trois au hasard)', '');
  for (const e of (r.etapes || []).filter((x) => x.verdict === 'conforme')) l.push(`- [ ] Étape ${e.n} (${e.source}) : « ${e.passage || ''} »`);
  l.push('', 'Puis suivre la liste de la seconde partie de agent/RELECTURE.md.');
  return l.join('\n') + '\n';
}

export async function relire(id, options = {}) {
  const c = loadCorpus(path.join(RACINE, 'corpus'), 'fr');
  const f = c.fiches.find((x) => x.id === id);
  if (!f) throw new Error(`fiche « ${id} » introuvable`);
  if (f.meta.origine !== 'adaptee') throw new Error("seule une fiche adaptée d'une source se relit pour la fidélité");
  const sources = (f.meta.provenance || []).filter((s) => s.usage === 'adapte');
  const copies = sources.map((s) => {
    const p = cheminCopie(id, s.id);
    if (!fs.existsSync(p)) throw new Error(`pas de copie de la source ${s.id} : lancer npm run sources`);
    return `--- COPIE DE LA SOURCE ${s.id} ---\n${fs.readFileSync(p, 'utf8').slice(0, 30000)}`;
  });
  const texteFiche = fs.readFileSync(path.join(RACINE, 'corpus', 'fiches', f.file), 'utf8');
  const brut = await appelerModele(consigneRelecture(), `--- FICHE ---\n${texteFiche}\n\n${copies.join('\n\n')}`, options);
  let r;
  try { r = yaml.load(brut.replace(/^```(?:yaml)?\n/, '').replace(/\n```\s*$/, '')) || {}; }
  catch (e) { throw new Error(`réponse du modèle illisible : ${e.message}`); }
  r = { fiche: id, date: new Date().toISOString().slice(0, 10), modele: options.nomModele || process.env.CLAUDE_MODELE || process.env.MODELE || 'claude', ...r };
  r.verdict = verdict(r);
  const dossier = options.sortie || path.join(ICI, 'relectures');
  fs.mkdirSync(dossier, { recursive: true });
  fs.writeFileSync(path.join(dossier, `${id}.yaml`), yaml.dump(r, { lineWidth: 200 }));
  fs.writeFileSync(path.join(dossier, `${id}.md`), listeHumaine(id, r));
  return r;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const id = process.argv[2];
  if (!id) { console.log('Usage : npm run relire -- <id-fiche>'); process.exit(1); }
  try {
    const r = await relire(id);
    console.log(`Relecture de ${id} : ${r.verdict}. Détail : agent/relectures/${id}.yaml ; liste : agent/relectures/${id}.md`);
  } catch (e) { console.log(`Échec : ${e.message}`); process.exit(1); }
}
