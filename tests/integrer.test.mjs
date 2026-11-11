// Tests de l'intégration d'une fiche de agent/sortie/ dans le corpus, sur une copie du corpus.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { integrer, integrerMedias, retirerPrevue, ajouterDemo } from '../agent/integrer.mjs';

function copieDuCorpus() {
  const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'integrer-'));
  fs.cpSync('corpus', path.join(racine, 'corpus'), { recursive: true });
  fs.mkdirSync(path.join(racine, 'agent', 'sortie'), { recursive: true });
  return racine;
}
// Une fiche « rédigée » pour une fiche prévue : on reprend la fiche 28 en changeant son identifiant et son titre.
function ficheRedigee(racine, id, titre) {
  const t = fs.readFileSync('corpus/fiches/28-rendre-eau-potable-faisant-bouillir.md', 'utf8')
    .replace('id: rendre-eau-potable-faisant-bouillir', `id: ${id}`)
    .replace(/^statut: .*$/m, 'statut: brouillon')
    .replace(/^titre: .*$/m, `titre: ${titre}`)
    .replace('savoirs: [rendre-eau-potable]', 'savoirs: [trouver-recuperer-eau]');
  const f = path.join(racine, 'agent', 'sortie', `40-${id}.md`);
  fs.writeFileSync(f, t);
  fs.writeFileSync(f.replace(/\.md$/, '.rapport.md'), '# rapport\n');
  return f;
}

test('une fiche prévue entre dans le corpus avec le premier numéro libre, et sort des fiches prévues', () => {
  const racine = copieDuCorpus();
  const f = ficheRedigee(racine, 'recuperer-eau-pluie', "Récupérer l'eau de pluie");
  const libre = String(Math.max(...fs.readdirSync('corpus/fiches').filter((x) => x.endsWith('.md')).map((x) => Number(x.slice(0, 2)))) + 1).padStart(2, '0');
  const [r] = integrer([f], { racine });
  assert.equal(r.erreur, undefined);
  assert.equal(r.cible, path.join('corpus', 'fiches', `${libre}-recuperer-eau-pluie.md`));
  assert.ok(fs.existsSync(path.join(racine, r.cible)));
  assert.ok(fs.existsSync(path.join(racine, 'agent', 'sortie', 'integrees', '40-recuperer-eau-pluie.md')));
  assert.doesNotMatch(fs.readFileSync(path.join(racine, 'corpus', 'prevues.yaml'), 'utf8'), /id: recuperer-eau-pluie/);
  assert.match(fs.readFileSync(path.join(racine, 'corpus', 'catalogue.csv'), 'utf8'), new RegExp(`,${libre},Récupérer l'eau de pluie`));
  // non traduite : reste hors de la démo
  assert.doesNotMatch(fs.readFileSync(path.join(racine, 'corpus', 'civicnode.yaml'), 'utf8'), /- recuperer-eau-pluie/);
});

test("une fiche sans source adaptée, ou déjà présente, n'entre pas", () => {
  const racine = copieDuCorpus();
  const f = ficheRedigee(racine, 'recuperer-eau-pluie', 'x');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('usage: adapte', 'usage: reference'));
  assert.match(integrer([f], { racine })[0].erreur, /aucune source adaptée/);
  const g = ficheRedigee(racine, 'desinfecter-eau-chlore', 'x');
  assert.match(integrer([g], { racine })[0].erreur, /existe déjà/);
});

test('le retrait d\'une fiche prévue et l\'ajout à la démo ne touchent pas au reste du fichier', () => {
  const p = '# tête\n- id: a\n  x: 1\n- id: b\n  x: 2\n';
  assert.equal(retirerPrevue(p, 'a').texte, '# tête\n- id: b\n  x: 2\n');
  const d = 'depot: x\ndemo:\n  - a\n  - b\n\n# fin\n';
  assert.equal(ajouterDemo(d, 'c').texte, 'depot: x\ndemo:\n  - a\n  - b\n  - c\n\n# fin\n');
  assert.equal(ajouterDemo(d, 'a').ajoute, false);
});

test("des médias préparés pour une fiche existante s'ajoutent à son en-tête, et leurs fichiers à public/medias/", () => {
  const racine = copieDuCorpus();
  const d = path.join(racine, 'agent', 'sortie', 'medias', 'desinfecter-eau-chlore');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'dose.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  fs.writeFileSync(path.join(d, 'medias.yaml'), JSON.stringify([{ fichier: 'dose.svg', type: 'schema', etape: 3, auteur: 'CivicNode',
    licence: 'CC BY-SA 4.0', legende: { fr: 'Dose', en: 'Dose' } }]));
  const [r] = integrerMedias([d], { racine });
  assert.equal(r.erreur, undefined);
  assert.ok(fs.existsSync(path.join(racine, 'public', 'medias', 'desinfecter-eau-chlore', 'dose.svg')));
  assert.match(fs.readFileSync(path.join(racine, r.cible), 'utf8'), /fichier: dose\.svg/);
  // une licence NC est refusée
  const e = path.join(racine, 'agent', 'sortie', 'medias', 'desinfecter-eau-soleil-sodis');
  fs.mkdirSync(e, { recursive: true });
  fs.writeFileSync(path.join(e, 'medias.yaml'), JSON.stringify([{ fichier: 'x.jpg', telecharger: 'https://x', auteur: 'X',
    licence: 'CC BY-NC 4.0', legende: { fr: 'x', en: 'x' } }]));
  assert.match(integrerMedias([e], { racine })[0].erreur, /non accepté/);
});
