// Tests de l'assistant, sans modèle : la recherche doit continuer à trouver les bonnes fiches.
// Les seuils sont des garde-fous contre une régression, pas un objectif : on les relève quand l'assistant progresse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { construireIndex, classer, repondre } from '../assistant/classifieur.mjs';

const index = construireIndex();
const questions = JSON.parse(fs.readFileSync(new URL('../assistant/questions.json', import.meta.url), 'utf8'));

test('chaque réponse attendue des questions types existe dans l\'index', () => {
  for (const q of questions) for (const id of q.attendu) assert.ok(index.parId.has(id), `« ${q.question} » attend ${id}, absent de l'index`);
});

test('la recherche seule trouve la bonne réponse en premier pour au moins 15 questions types sur 21', async () => {
  let premier = 0;
  for (const q of questions.filter((x) => x.attendu.length)) {
    const r = await classer(index, q.question, { fiche: q.fiche, etape: q.etape }, { sansModele: true });
    if (q.attendu.includes(r.choix[0]?.id)) premier++;
  }
  assert.ok(premier >= 15, `seulement ${premier} bonnes réponses en premier`);
});

test('une demande large donne un panorama qui contient la fiche 72 heures', async () => {
  const r = await repondre(index, 'Comment recharger mon téléphone sans électricité', { actif: false });
  assert.equal(r.type, 'solutions');
  assert.ok(r.solutions.some((s) => s.id === 'socle-coupure-72h'));
  assert.ok(r.solutions.length >= 3);
});

test("le panorama s'ouvre sur le principe du savoir qu'il couvre, cité depuis la structure", async () => {
  const r = await repondre(index, 'Comment recharger mon téléphone sans électricité', { actif: false });
  assert.equal(r.savoir, 'recharger-telephone');
  assert.match(index.principes.get(r.savoir).principe, /consommer moins/);
});

test("sans savoir commun à plusieurs fiches, le panorama n'annonce pas de principe", async () => {
  const r = await repondre(index, 'talkie walkie portée', { actif: false });
  if (r.type === 'solutions') assert.equal(r.savoir, '');
});

test('un problème précis reste sur sa fiche et donne la solution prévue', async () => {
  const r = await repondre(index, 'La prise allume-cigare de la voiture ne donne rien', { actif: false });
  assert.equal(r.type, 'fiche');
  assert.equal(r.fiche, 'energie-recharge-voiture');
});

test("les liens de l'assistant mènent aux pages françaises", () => {
  for (const e of index.entrees) assert.match(e.lien, /^fr\/f-/, `${e.id} : lien ${e.lien}`);
});
