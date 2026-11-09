// Mesure l'assistant sur les questions types : avec le modèle, puis sans (recherche seule).
// Usage : node assistant/mesurer.mjs            (avec le modèle si llama-server tourne)
//         node assistant/mesurer.mjs --sans-modele
import fs from 'node:fs';
import { construireIndex, classer, modeleDisponible } from './classifieur.mjs';

const sansModele = process.argv.includes('--sans-modele');
const questions = JSON.parse(fs.readFileSync(new URL('./questions.json', import.meta.url), 'utf8'));
const index = construireIndex();

if (!sansModele && !(await modeleDisponible())) {
  console.log("llama-server ne répond pas : mesure de la recherche seule. Lancez le modèle, ou ajoutez --sans-modele.\n");
}

let premier = 0, trouve = 0, total = 0;
const lignes = [];
for (const q of questions) {
  const t0 = Date.now();
  const r = await classer(index, q.question, { fiche: q.fiche, etape: q.etape }, { sansModele });
  const ms = Date.now() - t0;
  const ids = r.choix.map((e) => e.id);
  let ok1, okN;
  if (!q.attendu.length) { ok1 = okN = ids.length === 0; }
  else { ok1 = q.attendu.includes(ids[0]); okN = ids.some((id) => q.attendu.includes(id)); }
  premier += ok1; trouve += okN; total++;
  lignes.push(`${ok1 ? '✓' : okN ? '~' : '✗'}  ${String(ms).padStart(6)} ms  ${r.mode.padEnd(9)} ${q.question}\n`
    + `      attendu : ${q.attendu.join(', ') || '(rien)'}\n      obtenu  : ${ids.join(', ') || '(rien)'}${r.erreur ? `  [${r.erreur}]` : ''}`);
}
console.log(lignes.join('\n'));
console.log(`\nBonne réponse en premier : ${premier}/${total}`);
console.log(`Bonne réponse parmi les choix : ${trouve}/${total}`);
console.log('✓ juste en premier · ~ juste mais pas en premier · ✗ faux. Les deux dernières questions sont hors du corpus : la bonne réponse est « rien ».');
