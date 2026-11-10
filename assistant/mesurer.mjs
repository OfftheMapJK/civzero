// Mesure l'assistant sur les questions types, pour chaque stratégie.
// Usage : node assistant/mesurer.mjs            (recherche, modèle et hybride si llama-server tourne)
//         node assistant/mesurer.mjs --sans-modele
//         node assistant/mesurer.mjs --redaction   (affiche ce que l'assistant rédige pour chaque question)
import fs from 'node:fs';
import { construireIndex, classer, repondre, modeleDisponible } from './classifieur.mjs';

const questions = JSON.parse(fs.readFileSync(new URL('./questions.json', import.meta.url), 'utf8'));
const index = construireIndex();
const avecModele = !process.argv.includes('--sans-modele') && (await modeleDisponible());
if (!avecModele && !process.argv.includes('--sans-modele')) {
  console.log("llama-server ne répond pas : mesure de la recherche seule.\n");
}
if (process.argv.includes('--redaction')) {
  if (!avecModele) { console.log('La rédaction demande llama-server.'); process.exit(1); }
  let ecartees = 0, ms = 0;
  for (const q of questions) {
    const t0 = Date.now();
    const r = await repondre(index, q.question, { ctx: { fiche: q.fiche, etape: q.etape } });
    ms += Date.now() - t0;
    console.log(`\n> ${q.question}   [${r.type}]`);
    if (r.type === 'rien') { console.log('   (aucune fiche)'); continue; }
    if (r.type === 'solutions') {
      if (r.intro) console.log(`   ${r.intro}`);
      for (const x of r.solutions) {
        const f = index.pano.parId.get(x.id);
        console.log(`   - ${x.libelle || f.titre} (${f.horizon || '?'}, tier ${f.tier.join('-')}, ${f.danger})${f.ouverte ? '' : ' [à venir]'}`);
        if (x.texte) console.log(`     ${x.texte}`);
        if (x.ecartee) { ecartees++; console.log(`     ÉCARTÉ : ${x.ecartee}`); }
      }
    } else {
      const red = r.redaction || {};
      console.log(`   fiche : ${r.fiche}`);
      if (red.texte) console.log(`   RÉDIGÉ : ${red.texte}`);
      if (red.ecartee) { ecartees++; console.log(`   ÉCARTÉ : ${red.ecartee}`); }
      if (red.question) console.log(`   QUESTION : ${red.question}`);
    }
  }
  console.log(`\nTextes écartés par le garde-fou : ${ecartees} · ${Math.round(ms / questions.length)} ms par question`);
  console.log('Lisez chaque texte gardé : une consigne inventée sans chiffre passe le garde-fou.');
  process.exit(0);
}
const strategies = avecModele ? ['recherche', 'modele', 'hybride'] : ['recherche'];

const noter = (q, ids) => (!q.attendu.length
  ? (ids.length === 0 ? '✓' : '✗')
  : q.attendu.includes(ids[0]) ? '✓' : ids.some((id) => q.attendu.includes(id)) ? '~' : '✗');

const totaux = Object.fromEntries(strategies.map((s) => [s, { premier: 0, trouve: 0, ms: 0 }]));
for (const q of questions) {
  console.log(`\n${q.question}\n   attendu   : ${q.attendu.join(', ') || '(rien)'}`);
  for (const s of strategies) {
    const t0 = Date.now();
    const r = await classer(index, q.question, { fiche: q.fiche, etape: q.etape }, { strategie: s, sansModele: s === 'recherche' });
    const ms = Date.now() - t0;
    const ids = r.choix.map((e) => e.id);
    const note = noter(q, ids);
    totaux[s].premier += note === '✓';
    totaux[s].trouve += note !== '✗';
    totaux[s].ms += ms;
    console.log(`   ${note} ${s.padEnd(9)} : ${ids.join(', ') || '(rien)'}  (${ms} ms)${r.erreur ? `  [${r.erreur}]` : ''}`);
  }
}
console.log('\nRésultats sur', questions.length, 'questions');
for (const s of strategies) {
  const t = totaux[s];
  console.log(`  ${s.padEnd(9)}  bonne en premier : ${String(t.premier).padStart(2)}  ·  bonne parmi les choix : ${String(t.trouve).padStart(2)}  ·  ${Math.round(t.ms / questions.length)} ms en moyenne`);
}
console.log("✓ juste en premier · ~ juste mais pas en premier · ✗ faux. Hors du corpus, la bonne réponse est « rien ».");
