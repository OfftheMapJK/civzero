// Bouton « Écouter » : ce qui est lu à voix haute, et ce qui ne l'est pas, dans les deux langues.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus } from '../src/lib/corpus.mjs';
import { buildModel } from '../src/lib/model.mjs';
import { T } from '../src/lib/i18n.mjs';
import { texteALire, enPhrases, lectureEtape } from '../src/lib/lecture.mjs';

const CORPUS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'corpus');
const C = "la commande affichée à l'écran";

test('les crochets À VALIDER et TO CHECK ne sont pas lus', () => {
  assert.equal(texteALire('Verser deux gouttes [À VALIDER : dose pour une eau trouble] puis attendre.'), 'Verser deux gouttes puis attendre.');
  assert.equal(texteALire('Add two drops [TO CHECK: dose for cloudy water] then wait.'), 'Add two drops then wait.');
});

test('les lignes Source et les renvois aux sources ne sont pas lus', () => {
  assert.equal(texteALire('- **Action :** ouvrir le robinet.\n- **Source :** s1 (page 4)'), 'Action : ouvrir le robinet.');
  assert.equal(texteALire('Le toit doit être propre (source s2), la cuve fermée (s1 et s3).'), 'Le toit doit être propre, la cuve fermée.');
});

test('un bloc de code est retiré, une commande dans une phrase est remplacée, un simple mot est lu', () => {
  assert.equal(texteALire('Lancer :\n```\nsudo apt update\n```\nPuis attendre.').replace(/\s+/g, ' '), 'Lancer : Puis attendre.');
  assert.equal(texteALire('Taper `ssh <utilisateur>@civicnode.local` puis répondre `yes`.', C), `Taper ${C} puis répondre yes.`);
  assert.equal(texteALire('Un fichier `.zim` (`sudo apt update`, puis `ls`).', C), `Un fichier .zim (${C}, puis ls).`);
});

test('la mise en forme et les adresses web ne sont pas lues', () => {
  assert.equal(texteALire('**Attention** : voir la [fiche *Bouillir*](f-bouillir.html) et https://exemple.org'), 'Attention : voir la fiche Bouillir et');
});

test('le texte est découpé en phrases, sans phrase vide', () => {
  assert.deepEqual(enPhrases('Première phrase. Deuxième ? [À VALIDER : rien]\n\nTroisième.'), ['Première phrase.', 'Deuxième ?', 'Troisième.']);
});

test("une étape se lit avec son rang, son titre, l'action et la vérification, sans sa source", () => {
  const e = { titre: 'Remplir la cuve', action: 'ouvrir la vanne.', verif: "l'eau monte.", source: 's1 [À VALIDER : débit]' };
  assert.deepEqual(lectureEtape(e, 2, 5, T.fr), ['Étape 2 sur 5 : Remplir la cuve.', 'Ouvrir la vanne.', "Vérification : l'eau monte."]);
  assert.equal(lectureEtape(e, 2, 5, T.en)[0], 'Step 2 of 5: Remplir la cuve.');
});

for (const lang of ['fr', 'en']) {
  test(`${lang} : chaque fiche ouverte et chaque étape a son texte à lire, sans crochet, sans code ni source`, () => {
    const pages = buildModel(loadCorpus(CORPUS, lang)).pages.filter((p) => p.kind === 'fiche' || p.kind === 'etape');
    assert.ok(pages.length > 20);
    for (const p of pages) {
      assert.ok(p.lecture.length >= 2, `${p.slug} : rien à lire`);
      if (p.kind === 'fiche') {
        assert.equal(p.lecture[0], `${p.titre}.`.replace(/([.!?…:])\.$/, '$1'), `${p.slug} : la lecture commence par le titre`);
        assert.ok(p.lecture.includes(`${T[lang].principe}.`), `${p.slug} : principe absent`);
        assert.ok(p.lecture.some((x) => x.startsWith(T[lang].lire.etape(1, p.etapes.length))), `${p.slug} : étapes absentes`);
      }
      for (const x of p.lecture) {
        assert.doesNotMatch(x, /À VALIDER|TO CHECK|`|\*\*|https?:|\[|\]/, `${p.slug} : « ${x} »`);
        assert.doesNotMatch(x, /^Source ?:|\((?:sources? )?s\d+\)/i, `${p.slug} : « ${x} »`);
      }
    }
  });
}
