// Médias de Wikimedia Commons : la licence et l'auteur de la fiche sont comparés à ceux de l'API, sans rien corriger.
// Aucun appel à Internet : l'API est remplacée par une fausse réponse.
import test from 'node:test';
import assert from 'node:assert/strict';
import { titreCommons, licenceComparable, memeAuteur, comparer, lireCommons } from '../agent/medias.mjs';

test("le nom du fichier se lit dans l'adresse de sa page Commons, et seulement là", () => {
  assert.equal(titreCommons("https://commons.wikimedia.org/wiki/File:R%C3%A9cup%C3%A9rateur_d'eau_(2021).jpg"), "File:Récupérateur d'eau (2021).jpg");
  assert.equal(titreCommons('https://fr.wikipedia.org/wiki/Eau'), null);
  assert.equal(titreCommons(undefined), null);
});

test('deux écritures de la même licence sont reconnues, deux licences différentes ne le sont pas', () => {
  assert.equal(licenceComparable('CC BY-SA 4.0'), licenceComparable('cc-by-sa-4.0'));
  assert.equal(licenceComparable('domaine public'), licenceComparable('Public domain'));
  assert.equal(licenceComparable('CC0'), licenceComparable('CC0 1.0'));
  assert.notEqual(licenceComparable('CC BY-SA 4.0'), licenceComparable('CC BY-SA 3.0'));
  assert.notEqual(licenceComparable('CC BY 4.0'), licenceComparable('CC BY-SA 4.0'));
  assert.notEqual(licenceComparable('CC0'), licenceComparable('Public domain'));
});

test("l'auteur est le même si l'un des noms contient l'autre, liens et accents mis à part", () => {
  assert.ok(memeAuteur('Benoît Prieur', '<a href="//commons.wikimedia.org/wiki/User:Benoit">Benoît Prieur</a> (Agamitsudo)'));
  assert.ok(!memeAuteur('Benoît Prieur', 'Quelqu\'un d\'autre'));
  assert.ok(!memeAuteur('Benoît Prieur', ''));
});

test('un désaccord est signalé avec les deux valeurs, un accord ne dit rien', () => {
  const media = { licence: 'CC BY-SA 4.0', auteur: 'Ada' };
  assert.deepEqual(comparer(media, { licence: 'CC BY-SA 4.0', auteur: 'Ada' }), []);
  const d = comparer(media, { licence: 'CC BY-NC 4.0', auteur: 'Bob' });
  assert.equal(d.length, 2);
  assert.match(d[0], /la fiche dit « CC BY-SA 4.0 », Commons dit « CC BY-NC 4.0 »/);
  assert.match(d[1], /la fiche dit « Ada », Commons dit « Bob »/);
});

test("la réponse de l'API donne la licence et l'auteur, sans balises ; un fichier absent est une erreur", async () => {
  const reponse = (pages) => async () => ({ ok: true, json: async () => ({ query: { pages } }) });
  const r = await lireCommons('File:X.jpg', reponse({ 1: { imageinfo: [{ extmetadata: {
    LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: '<a href="/wiki/User:Ada">Ada</a>' } } }] } }));
  assert.deepEqual(r, { licence: 'CC BY-SA 4.0', auteur: 'Ada' });
  await assert.rejects(lireCommons('File:Absent.jpg', reponse({ '-1': { missing: '' } })), /introuvable/);
});
