// Tests de la chaîne de vérification : verdict de la relecture IA, liste pour la personne qui confirme,
// et règles des statuts dans le vérificateur (sur une copie du corpus).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { verdict, listeHumaine } from '../agent/relire.mjs';

test('une seule réserve suffit pour que la relecture IA demande une correction', () => {
  const ok = { etapes: [{ n: 1, verdict: 'conforme' }, { n: 2, verdict: 'sans_source' }], chiffres: [{ valeur: '30 minutes', trouve: true }] };
  assert.equal(verdict(ok), 'conforme');
  assert.equal(verdict({ ...ok, etapes: [{ n: 1, verdict: 'ajout' }] }), 'a_corriger');
  assert.equal(verdict({ ...ok, chiffres: [{ valeur: '7 gouttes', trouve: false }] }), 'a_corriger');
  assert.equal(verdict({ ...ok, chiffres: [{ valeur: '2 000 m', trouve: false, a_valider: true }] }), 'conforme');
  assert.equal(verdict({ ...ok, precautions_absentes: ['ne pas mélanger'] }), 'a_corriger');
  assert.equal(verdict({}), 'incomplete');
});

test('la liste humaine reprend chaque point signalé', () => {
  const l = listeHumaine('x', { date: '2026-11-11', modele: 'essai', verdict: 'a_corriger',
    etapes: [{ n: 3, verdict: 'ecart', remarque: 'durée différente' }], chiffres: [{ valeur: '7', trouve: false }] });
  assert.match(l, /Étape 3 : ecart, durée différente/);
  assert.match(l, /Chiffre non trouvé dans les sources : 7/);
});

function verifierSur(modifier) {
  const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'statuts-'));
  fs.cpSync('corpus', path.join(racine, 'corpus'), { recursive: true });
  for (const d of ['relectures', 'sources']) if (fs.existsSync(path.join('agent', d))) fs.cpSync(path.join('agent', d), path.join(racine, 'agent', d), { recursive: true });
  modifier(racine);
  try { execFileSync(process.execPath, [path.resolve('scripts/verifier.mjs')], { cwd: racine }); return ''; }
  catch (e) { return e.stdout.toString(); }
}
const changer = (racine, fichier, de, vers) => {
  const p = path.join(racine, 'corpus', 'fiches', fichier);
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(de, vers));
};

test('« vérifiée par IA » exige une relecture IA et les copies, « fidèle » une attestation humaine', () => {
  const sortie = verifierSur((r) => {
    changer(r, '28-rendre-eau-potable-faisant-bouillir.md', /^statut: .*$/m, 'statut: fidele');
    fs.rmSync(path.join(r, 'agent'), { recursive: true, force: true });
  });
  assert.match(sortie, /sans relecture IA/);
  assert.match(sortie, /sans copie de la source s1/);
  assert.match(sortie, /sans attestation de fidélité/);
  // une relecture IA qui conclut « à corriger » bloque
  const b = verifierSur((r) => {
    fs.writeFileSync(path.join(r, 'agent', 'relectures', 'filtrer-eau-filtre-ceramique.yaml'),
      'fiche: filtrer-eau-filtre-ceramique\nverdict: conforme\netapes:\n  - n: 6\n    verdict: ajout\n');
  });
  assert.match(b, /la relecture IA conclut « a_corriger »/);
});

test("une fiche créée par CivicNode ne peut pas être « fidèle », une fiche orange « testée » demande une relecture pro", () => {
  const a = verifierSur((r) => changer(r, '05-telecom-plan-communication.md', /^statut: .*$/m, 'statut: fidele'));
  assert.match(a, /n'a pas de source à laquelle être fidèle/);
  const b = verifierSur((r) => changer(r, '30-desinfecter-eau-chlore.md', /^statut: .*$/m, 'statut: testee'));
  assert.match(b, /sans relecture d'une personne compétente/);
});
