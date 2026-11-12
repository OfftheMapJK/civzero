// Copies des sources : la lecture simple d'abord, Playwright en repli, et un en-tête qui ne change pas.
// Aucun appel à Internet : les deux lectures sont remplacées par des fonctions d'essai.
import test from 'node:test';
import assert from 'node:assert/strict';
import { lireSource, enTeteCopie } from '../agent/sources.mjs';

const long = 'texte de la page '.repeat(30);

test('une page lisible simplement ne passe pas par Playwright', async () => {
  let ouvert = false;
  const r = await lireSource('https://exemple.org', { simple: async () => long, navigateur: async () => { ouvert = true; return long; } });
  assert.equal(r.moyen, 'lecture simple');
  assert.equal(ouvert, false);
});

test('une page qui refuse la lecture simple est rouverte avec Playwright', async () => {
  const r = await lireSource('https://exemple.org', {
    simple: async () => { throw new Error('la page répond 403'); },
    navigateur: async () => long,
  });
  assert.equal(r.moyen, 'Playwright');
  assert.equal(r.texte, long);
});

test("l'échec n'est déclaré que si les deux lectures échouent, et il dit pourquoi", async () => {
  await assert.rejects(lireSource('https://exemple.org', {
    simple: async () => { throw new Error('la page répond 403'); },
    navigateur: async () => { throw new Error('page presque vide'); },
  }), /403 ; puis avec Playwright : page presque vide/);
});

test("l'en-tête d'une copie garde ses cinq lignes, quelle que soit la lecture", () => {
  const s = { id: 's1', titre: 'Titre', auteur: 'Autrice', source: 'https://exemple.org', licence: 'CC BY-SA 4.0' };
  assert.equal(enTeteCopie(s, '2026-11-12'),
    '# Copie de la source s1 : « Titre »\n# Auteur : Autrice\n# Lien : https://exemple.org\n# Licence : CC BY-SA 4.0\n# Copiée le : 2026-11-12\n\n');
});
