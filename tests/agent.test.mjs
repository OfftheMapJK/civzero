// Tests de l'agent d'adaptation, sans modèle : le modèle « essai » renvoie une fiche toute faite.
// On vérifie les refus de licence, l'en-tête imposé, et le garde-fou des chiffres absents des sources.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { adapter, controlerSources, chiffresSansSource } from '../agent/adapter.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-'));
const source = { id: 's1', titre: 'How to Make Water Safe in an Emergency', auteur: 'CDC', source: 'https://www.cdc.gov/water-emergency/about/',
                 licence: 'domaine public', verifie_le: '2026-11-11', fichier: path.resolve('tests/sources/source-cdc-extrait.txt') };
const commande = (sources, extra = {}) => {
  const f = path.join(tmp, `cmd-${Math.random().toString(36).slice(2)}.yaml`);
  fs.writeFileSync(f, JSON.stringify({ id: 'essai-chlore', titre: "Désinfecter l'eau au chlore (essai)", socle: 'source',
    savoirs: ['rendre-eau-potable'], horizon: 'instant', tier: [0], danger: 'orange', sources, ...extra }));
  return f;
};
const reponse = fs.readFileSync('corpus/fiches/30-desinfecter-eau-chlore.md', 'utf8');

test('une source sous licence NC ou sans licence est refusée avant tout appel au modèle', async () => {
  const r = await adapter(commande([{ ...source, licence: 'CC BY-NC-SA 4.0' }]), { modele: 'essai', reponse, sortie: tmp });
  assert.ok(r.refus?.some((x) => /ne permet pas/.test(x)));
  assert.ok(controlerSources([{ id: 's1', titre: 'x', source: 'https://x' }]).some((x) => /licence non indiquée/.test(x)));
});

test("l'en-tête vient de la commande : provenance, statut brouillon, rédaction adaptée", async () => {
  const r = await adapter(commande([source]), { modele: 'essai', reponse: reponse.replace('licence: "domaine public"', 'licence: "inventée"'), sortie: tmp });
  const t = fs.readFileSync(r.fichier, 'utf8');
  assert.match(t, /statut: brouillon/);
  assert.match(t, /redaction: adaptee-ia/);
  assert.match(t, /usage: adapte/);
  assert.doesNotMatch(t, /inventée/);
  assert.deepEqual(r.erreurs, []);
  assert.ok(fs.existsSync(r.fichier.replace(/\.md$/, '.rapport.md')));
});

test('un chiffre absent des sources est signalé, pas un chiffre marqué À VALIDER', () => {
  const textes = [fs.readFileSync(source.fichier, 'utf8')];
  assert.deepEqual(chiffresSansSource('Ajouter 2 gouttes par litre et attendre 30 minutes.', textes), []);
  assert.deepEqual(chiffresSansSource('Ajouter 7 gouttes par litre.', textes), ['7']);
  assert.deepEqual(chiffresSansSource('Ajouter 7 gouttes. [À VALIDER : 7 gouttes pour 2,6 %]', textes), ['7']);
  assert.deepEqual(chiffresSansSource('Voir étape 4. [À VALIDER : 2,6 %]', textes), []);
});

test('une étape qui cite une source inconnue est une erreur', async () => {
  const r = await adapter(commande([source]), { modele: 'essai', reponse: reponse.replace('- **Source :** s1', '- **Source :** s9'), sortie: tmp });
  assert.ok(r.erreurs.some((e) => /s9/.test(e)));
});
