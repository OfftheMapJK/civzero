// Tests du site : la logique des pages, dans les deux langues, sans construire avec Astro.
// Lancer : npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCorpus } from '../src/lib/corpus.mjs';
import { buildModel } from '../src/lib/model.mjs';

const modeles = Object.fromEntries(['en', 'fr'].map((lang) => [lang, buildModel(loadCorpus(undefined, lang))]));

// Tous les liens internes d'une page (champs se terminant en .html), sans entrer dans les textes d'interface.
function liens(o, acc = []) {
  if (!o || typeof o !== 'object') return acc;
  for (const [k, v] of Object.entries(o)) {
    if (k === 't') continue;
    if (typeof v === 'string' && /^[a-z0-9-]+\.html$/.test(v)) acc.push(v);
    else liens(v, acc);
  }
  return acc;
}

for (const [lang, { pages, home }] of Object.entries(modeles)) {
  const existe = new Set([...pages.map((p) => `${p.slug}.html`), 'index.html']);

  test(`${lang} : aucun lien interne cassé`, () => {
    const casses = new Set();
    for (const p of [...pages, home]) for (const l of liens(p)) if (!existe.has(l)) casses.add(`${p.slug} → ${l}`);
    assert.deepEqual([...casses], []);
  });

  test(`${lang} : aucune page en double`, () => {
    const slugs = pages.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  test(`${lang} : chaque page a un titre et la langue de la page`, () => {
    for (const p of [...pages, home]) {
      assert.ok(p.title, `${p.slug} sans titre`);
      assert.equal(p.lang, lang, `${p.slug} n'est pas en ${lang}`);
    }
  });

  test(`${lang} : l'accueil montre les cinq familles et les onze socles, Spore compris`, () => {
    assert.equal(home.familles.length, 5);
    assert.equal(home.familles.flatMap((f) => f.socles).length, 11);
    assert.ok(home.commencer.length >= 2, 'Commencer ici doit contenir le Nodule Zéro et la fiche 72 heures');
  });

  test(`${lang} : chaque fiche ouverte a sa présentation, ses étapes, sa version complète et son rapport`, () => {
    for (const p of pages.filter((x) => x.kind === 'fiche')) {
      assert.ok(existe.has(p.complete) && existe.has(p.rapport), `${p.slug} : page complète ou rapport absent`);
      assert.ok(p.etapes.length > 0, `${p.slug} : aucune étape`);
      for (const e of p.etapes) assert.ok(existe.has(e.href), `${p.slug} : étape ${e.href} absente`);
    }
  });

  test(`${lang} : chaque savoir liste au moins une fiche, rangée de l'instant aux saisons`, () => {
    const ordre = { instant: 0, hours: 1, seasons: 2 };
    for (const p of pages.filter((x) => x.kind === 'savoir')) {
      assert.ok(p.fiches.length > 0, `${p.slug} : aucune fiche`);
      const rangs = p.fiches.map((f) => f.rang[0]);
      assert.deepEqual(rangs, [...rangs].sort((a, b) => a - b), `${p.slug} : fiches mal rangées`);
    }
    assert.ok(Object.keys(ordre).length === 3);
  });

  test(`${lang} : les fiches ouvertes affichent leur niveau de danger`, () => {
    for (const p of pages.filter((x) => x.kind === 'fiche' && x.slug !== 'f-nodule-zero')) {
      assert.ok(p.danger && p.danger.mot && p.danger.label, `${p.slug} : niveau de danger absent`);
    }
  });
}

for (const [lang, { pages }] of Object.entries(modeles)) {
  test(`${lang} : le socle Spore range ses pistes par maturité, et chaque piste a sa page`, () => {
    const spore = pages.find((p) => p.slug === 's-spore');
    assert.ok(spore && spore.pistes.length > 0, 'socle Spore sans pistes');
    const pistes = pages.filter((p) => p.kind === 'piste');
    assert.ok(pistes.length >= 2, `seulement ${pistes.length} pistes`);
    for (const p of pistes) {
      assert.ok(p.maturiteMot, `${p.slug} : maturité inconnue`);
      assert.ok(p.sections.length >= 4, `${p.slug} : sections manquantes`);
      assert.ok(p.savoirs.length > 0, `${p.slug} : aucun savoir lié`);
    }
  });

  test(`${lang} : un savoir montre les pistes qui s'y rattachent`, () => {
    const v = pages.find((p) => p.slug === 'v-batir-isoler');
    assert.ok(v.pistes.some((x) => x.id === 'isolant-mycelium'));
  });

  test(`${lang} : le tableau de choix d'un savoir donne temps, tier, danger et ressources pour chaque fiche`, () => {
    for (const p of pages.filter((x) => x.kind === 'savoir')) {
      for (const f of p.fiches) {
        assert.ok(f.tableau.temps, `${p.slug} / ${f.id} : temps absent`);
        assert.ok(f.tableau.tier !== '', `${p.slug} / ${f.id} : tier absent`);
        assert.ok(f.tableau.ressources, `${p.slug} / ${f.id} : ressources absentes (catalogue.csv)`);
      }
    }
  });
}

test('chaque savoir a son principe, dans les deux langues', () => {
  for (const lang of ['en', 'fr']) {
    for (const p of modeles[lang].pages.filter((x) => x.kind === 'savoir')) assert.ok(p.principeHtml, `${lang} ${p.slug} : pas de principe`);
  }
});

test('les deux langues ont exactement les mêmes pages', () => {
  const en = new Set(modeles.en.pages.map((p) => p.slug));
  const fr = new Set(modeles.fr.pages.map((p) => p.slug));
  assert.deepEqual([...en].filter((s) => !fr.has(s)), []);
  assert.deepEqual([...fr].filter((s) => !en.has(s)), []);
});

test('le bouton de langue mène à la même page dans l\'autre langue', () => {
  const p = modeles.en.pages.find((x) => x.slug === 'f-energie-recharge-voiture');
  assert.equal(p.autre, 'fr/f-energie-recharge-voiture.html');
  const q = modeles.fr.pages.find((x) => x.slug === 'f-energie-recharge-voiture');
  assert.equal(q.autre, '../f-energie-recharge-voiture.html');
});

test("les médias pointent vers public/medias/<fiche>/, un dossier plus haut depuis les pages françaises", () => {
  const en = modeles.en.pages.find((x) => x.slug === 'f-filtrer-eau-filtre-ceramique');
  const fr = modeles.fr.pages.find((x) => x.slug === 'f-filtrer-eau-filtre-ceramique');
  assert.equal(en.medias[0].fichier, 'medias/filtrer-eau-filtre-ceramique/chaine-clarifier-filtrer-desinfecter.svg');
  assert.equal(fr.medias[0].fichier, '../medias/filtrer-eau-filtre-ceramique/chaine-clarifier-filtrer-desinfecter.svg');
  const etape = modeles.fr.pages.find((x) => x.slug === 'f-filtrer-eau-filtre-ceramique-e3');
  assert.equal(etape.medias.length, 1);
});

test('la page « Sources et méthode » existe dans les deux langues, et chaque fiche y renvoie', () => {
  for (const lang of ['en', 'fr']) {
    const p = modeles[lang].pages.find((x) => x.slug === 'a-sources-et-methode');
    assert.ok(p && p.corpsHtml.includes('<h2'), `${lang} : page absente ou vide`);
  }
  assert.match(modeles.en.pages.find((x) => x.slug === 'a-sources-et-methode').titre, /sources/i);
});

test('les pages anglaises sont bien en anglais', () => {
  const p = modeles.en.pages.find((x) => x.slug === 'f-energie-telephone-coupure');
  assert.match(p.titre, /phone/i);
  assert.equal(p.nonTraduite, '');
});
