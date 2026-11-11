// Construit le modèle de toutes les pages du site, pour une langue.
// Structure : familles > socles > domaines > savoirs > fiches (les compétences) > étapes.
// Les composants Astro ne font qu'afficher ce modèle ; tous les liens et tous les textes sont décidés ici.
import { md, mdi } from './corpus.mjs';
import { T } from './i18n.mjs';

export const DATE = '10/11/2026';
export const HOME = 'index.html';
// Version station : construite avec CIVZERO_STATION=1, elle donne accès à l'assistant.
export const STATION = process.env.CIVZERO_STATION === '1';
const ORDRE_HORIZON = { instant: 0, hours: 1, seasons: 2 };
const RANG_DANGER = { vert: 1, orange: 2, rouge: 3 };
const NIVEAUX_DANGER = ['vert', 'orange', 'rouge'];
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export const MATURITES = ['idee', 'prototype', 'terrain', 'documentee'];
// Le vocabulaire du catalogue (coût, matériel, vivant), traduit mot à mot pour l'anglais.
const MOTS_EN = { gratuit: 'free', aucun: 'none', 'récupération': 'salvaged', neuf: 'new', occasion: 'second-hand',
  local: 'local', existant: 'already owned', voiture: 'car', adaptateur: 'adapter', plants: 'seedlings', 'bâche': 'tarp',
  vinaigre: 'vinegar', bocaux: 'jars', sucre: 'sugar', 'porte-greffes': 'rootstock',
  'préserve': 'preserves', 'prélève': 'takes from', 'régénère': 'regenerates' };
const traduireMots = (s, lang) => (lang === 'en' ? s.replace(/[\p{L}-]+/gu, (w) => MOTS_EN[w] ?? w) : s);

export function buildModel(c) {
  const { fiches, labels, conf, structure, prevues } = c;
  const pistes = c.pistes || [];
  const catalogue = c.catalogue || [];
  const catParNum = new Map(catalogue.filter((r) => r.numero).map((r) => [r.numero, r]));
  const catParTitre = new Map(catalogue.map((r) => [r.titre, r]));
  const lang = c.lang || 'fr';
  const t = T[lang];
  const L = (o) => (o && typeof o === 'object' ? o[lang] ?? o.fr ?? '' : o || '');
  // L'anglais est à la racine du site, le français dans fr/ : le bouton de langue mène à la même page.
  const autre = (slug) => (lang === 'en' ? `fr/${slug}.html` : `../${slug}.html`);
  const commun = (slug) => ({ slug, lang, t, autre: autre(slug), date: DATE });

  const demo = Array.isArray(conf.demo) && conf.demo.length ? new Set(conf.demo) : null;
  for (const f of fiches) f.actif = !demo || demo.has(f.id);
  const depot = (conf.depot || '').trim();
  const email = (conf.email || '').trim();
  const { socles, domaines, savoirs, familles } = structure;

  const labelCourt = (niv) => {
    const x = labels[niv] || '';
    return x.startsWith('[À VALIDER') || x.startsWith('[TO CHECK') ? t.labelAttente : x;
  };
  const varianteRisquee = (m) => (m.variantes || [])
    .filter((v) => (RANG_DANGER[v.danger] || 0) > (RANG_DANGER[m.danger] || 0))
    .sort((a, z) => RANG_DANGER[z.danger] - RANG_DANGER[a.danger])[0]?.danger || '';

  // Une entrée de liste, que ce soit une fiche écrite ou une fiche prévue.
  const item = (x) => {
    const ecrite = !!x.steps;
    const m = ecrite ? x.meta : x;
    const titre = ecrite ? m.titre : L(x.titre);
    const tiers = (m.tier || []).join('–');
    const v = varianteRisquee(m);
    const d = NIVEAUX_DANGER.includes(m.danger) ? t.danger(t.niv[m.danger].toLowerCase()) + (v ? t.variante(t.niv[v].toLowerCase()) : '')
      : t.prerequis;
    const morceaux = [t.h[m.horizon], tiers !== '' && `Tier ${tiers}`, d].filter(Boolean);
    const actif = ecrite && x.actif;
    const cat = (ecrite ? catParNum.get(x.num) : catParTitre.get(x.titre?.fr)) || {};
    const ressources = [cat.cout, cat.materiel].filter(Boolean).map((w) => traduireMots(w, lang)).join(' · ');
    const tableau = { temps: [t.h[m.horizon], ecrite ? m.temps : ''].filter(Boolean).join(' : '),
      tier: tiers, dangerMot: t.niv[m.danger] || '', varianteMot: v ? t.niv[v] : '',
      exige: ecrite ? m.exige_avance || '' : '', ressources, vivant: traduireMots(cat.vivant || '', lang) };
    return { id: x.id, href: actif ? `f-${x.id}.html` : null, titre, niveau: m.danger, tableau,
             sub: actif ? `${morceaux.join(' · ')} · ${t.statut[m.statut] || t.brouillon}` : `${t.aVenir} · ${morceaux.join(' · ')}`,
             note: x.hors_corpus ? t.horsCorpus : '',
             rang: [ORDRE_HORIZON[m.horizon] ?? 3, Math.min(...(m.tier?.length ? m.tier : [9])), actif ? 0 : 1] };
  };
  const trier = (liste) => liste.sort((a, z) => a.rang[0] - z.rang[0] || a.rang[2] - z.rang[2] || a.rang[1] - z.rang[1]
    || a.titre.localeCompare(z.titre));

  const fichesDuSavoir = (sv) => trier([
    ...fiches.filter((f) => (f.meta.savoirs || []).includes(sv)).map(item),
    ...prevues.filter((p) => (p.savoirs || []).includes(sv)).map(item),
  ]);
  const socleDe = (sv) => domaines[savoirs[sv]?.domaine]?.socle;
  const crumbFiche = (f) => {
    const sv = (f.meta.savoirs || [])[0];
    if (!sv) return { a: t.commencer, aHref: HOME };
    const so = socleDe(sv);
    return { a: L(socles[so].nom), aHref: `s-${so}.html`, b: L(savoirs[sv].titre), bHref: `v-${sv}.html` };
  };

  const pages = [];
  const add = (p) => { pages.push(p); return `${p.slug}.html`; };

  const danger = (f) => (NIVEAUX_DANGER.includes(f.meta.danger)
    ? { niveau: f.meta.danger, mot: t.niv[f.meta.danger], label: labelCourt(f.meta.danger), risques: f.risques.map(mdi) }
    : null);
  // Le statut s'affiche en tête de fiche ; tant qu'aucune personne ne l'a confirmée, il reste tramé.
  const badges = (f) => [{ t: `▒ ${(t.statut[f.meta.statut] || t.brouillon).toUpperCase()} ▒`, trame: ['brouillon', 'verifiee-ia'].includes(f.meta.statut || 'brouillon') },
    ...(f.meta.suspendu ? [{ t: lang === 'en' ? 'ON HOLD' : 'EN SUSPENS' }] : []),
    ...(t.H[f.meta.horizon] ? [{ t: t.H[f.meta.horizon] }] : [])];

  // Provenance (TASL : titre, auteur, source, licence), attestations et médias, quand la fiche en a.
  const provenance = (f) => (f.meta.provenance || []).map((s) => (typeof s === 'string' ? { titre: s } : {
    titre: s.titre || '', auteur: s.auteur || '', url: s.source || s.url || '', licence: s.licence || '', modifie: !!s.modifie,
    reference: s.usage !== 'adapte' && !!s.licence, id: s.id || '' }));
  const attestations = (f) => (f.meta.attestations || []).map((a) => ({
    type: a.type || '', par: a.par || '', competence: a.competence || '', date: a.date || '', contexte: a.contexte || '' }));
  const medias = (f, etape = null) => (f.meta.medias || [])
    .filter((m) => (etape === null ? !m.etape : m.etape === etape))
    // Les fichiers sont dans public/medias/<id de la fiche>/ ; les pages françaises sont un dossier plus bas.
    .map((m) => ({ fichier: m.fichier ? `${lang === 'fr' ? '../' : ''}medias/${f.id}/${m.fichier}` : '',
                   type: m.type || 'image', legende: L(m.legende), titre: m.titre || '',
                   auteur: m.auteur || '', url: m.source || '', licence: m.licence || '', nonRelu: m.relu === false }));

  // ------------------------------------------------------------ fiches ouvertes
  for (const f of fiches.filter((x) => x.actif)) {
    const pre = `f-${f.id}`;
    const n = f.steps.length;
    const general = f.coince.filter((x) => !x.etapes.length);
    const base = { crumb: crumbFiche(f), titre: f.meta.titre, modeTxt: t.beta, nonTraduite: f.traduite ? '' : t.nonTraduite };
    add({
      ...commun(pre), kind: 'fiche', title: `${f.meta.titre} · CivicNode`, ...base,
      badges: badges(f), danger: danger(f),
      securiteHtml: !NIVEAUX_DANGER.includes(f.meta.danger) ? md(f.secs[2]) : (f.s2Reste ? md(f.s2Reste) : ''),
      suspension: f.meta.suspendu ? f.meta.raison_suspension : '',
      exige: f.meta.exige_avance,
      variantes: (f.meta.variantes || []).map((v) => ({ niveau: v.danger, nom: v.id.replaceAll('-', ' ') })),
      principeHtml: md(f.secs[1]), prefaceHtml: f.preface ? md(f.preface) : '',
      premiere: n ? `${pre}-e${f.steps[0].n}.html` : null,
      etapes: f.steps.map((s) => ({ titre: s.titre, href: `${pre}-e${s.n}.html` })),
      coince: general.map((x) => ({ probleme: mdi(x.probleme), texte: mdi(x.texte) })),
      provenance: provenance(f), attestations: attestations(f), medias: medias(f),
      complete: `${pre}-complete.html`, rapport: `${pre}-rapport.html`,
    });

    f.steps.forEach((s, i) => {
      add({
        ...commun(`${pre}-e${s.n}`), kind: 'etape', title: `${t.etape(i + 1, n)} · ${f.meta.titre} · CivicNode`, ...base,
        badges: badges(f).slice(0, 1), danger: danger(f),
        rang: i + 1, total: n, barre: '■'.repeat(i + 1) + '□'.repeat(n - i - 1),
        ficheId: f.id, etapeN: s.n, etapeTitre: s.titre, action: mdi(cap(s.action)), verif: s.verif ? mdi(cap(s.verif)) : '',
        source: s.source ? mdi(s.source) : '', medias: medias(f, s.n),
        coince: f.coince.filter((x) => x.etapes.includes(s.n)).map((x) => ({ probleme: mdi(x.probleme), texte: mdi(x.texte) })),
        precedent: i ? { href: `${pre}-e${f.steps[i - 1].n}.html`, t: t.precedente } : { href: `${pre}.html`, t: t.presentation },
        suivant: i < n - 1 ? { href: `${pre}-e${f.steps[i + 1].n}.html`, t: t.suivante } : { href: `${pre}-rapport.html`, t: t.termine },
        complete: `${pre}-complete.html`, rapport: `${pre}-rapport.html`,
      });
    });

    add({
      ...commun(`${pre}-complete`), kind: 'complete', title: `${f.meta.titre} · CivicNode`, ...base, badges: badges(f),
      bodyHtml: md(f.body.replace('[Libellé officiel affiché depuis le Nodule Zéro]', labelCourt(f.meta.danger))
                        .replace('[Official label shown from Nodule Zero]', labelCourt(f.meta.danger))),
      fiche: `${pre}.html`, rapport: `${pre}-rapport.html`,
    });

    const params = new URLSearchParams({ template: 'rapport-reproduction.yml', title: `Rapport : ${f.id}`, fiche: f.id, version: DATE });
    add({
      ...commun(`${pre}-rapport`), kind: 'rapport', title: `${t.rapportBtn.replace(/[[\]]/g, '').trim()} · ${f.meta.titre}`, ...base,
      modele: t.modeleRapport(f, DATE),
      github: depot ? `https://github.com/${depot}/issues/new?${params}` : null, email: email || null,
      fiche: `${pre}.html`,
    });
  }

  // ------------------------------------------------------------ pistes (socle Spore)
  const itemPiste = (pi) => ({ id: pi.id, href: `p-${pi.id}.html`, titre: pi.meta.titre, accroche: pi.meta.accroche || '',
    maturite: pi.meta.maturite, maturiteMot: t.maturite[pi.meta.maturite] || '' });
  const socleSpore = Object.keys(socles).find((so) => socles[so].pistes) || 'spore';
  for (const pi of pistes) {
    const m = pi.meta;
    const params = new URLSearchParams({ title: `Piste : ${pi.id}`, body: `Piste : ${pi.id}\nVersion : ${DATE}\n\n` });
    add({
      ...commun(`p-${pi.id}`), kind: 'piste', title: `${m.titre} · CivicNode`, modeTxt: t.beta,
      crumb: { a: L(socles[socleSpore]?.nom), aHref: `s-${socleSpore}.html`, b: t.maturite[m.maturite] },
      titre: m.titre, accroche: m.accroche || '', maturite: m.maturite, maturiteMot: t.maturite[m.maturite] || '',
      maturiteExpl: t.maturiteExpl[m.maturite] || '', echelle: MATURITES.map((x) => ({ mot: t.maturite[x], actif: x === m.maturite })),
      nonTraduite: pi.traduite ? '' : t.nonTraduitePiste,
      sections: pi.sections.map((x) => ({ titre: x.titre, html: md(x.texte) })),
      acteurs: (m.acteurs || []).map((a) => ({ nom: a.nom || '', lieu: a.lieu || '', url: a.url || '' })),
      savoirs: (m.savoirs || []).filter((sv) => savoirs[sv]).map((sv) => ({ titre: L(savoirs[sv].titre), href: `v-${sv}.html` })),
      provenance: provenance(pi), maj: m.maj ? String(m.maj instanceof Date ? m.maj.toISOString().slice(0, 10) : m.maj) : '',
      github: depot ? `https://github.com/${depot}/issues/new?${params}` : null, email: email || null,
      retour: `s-${socleSpore}.html`,
    });
  }

  // ------------------------------------------------------------ savoirs
  const compte = (liste) => [liste.filter((x) => x.href).length, liste.filter((x) => !x.href).length];
  for (const [sv, s] of Object.entries(savoirs)) {
    const so = socleDe(sv);
    const liste = fichesDuSavoir(sv);
    add({
      ...commun(`v-${sv}`), kind: 'savoir', title: `${L(s.titre)} · CivicNode`, modeTxt: t.beta,
      crumb: { a: L(socles[so].nom), aHref: `s-${so}.html`, b: L(domaines[s.domaine].titre) },
      titre: L(s.titre), principeHtml: s.principe ? md(L(s.principe)) : '', ordreHtml: s.ordre ? md(L(s.ordre)) : '',
      fiches: liste, retour: `s-${so}.html`,
      pistes: pistes.filter((pi) => (pi.meta.savoirs || []).includes(sv)).map(itemPiste),
    });
  }

  // ------------------------------------------------------------ socles
  const fichesDuSocle = (so) => {
    const svs = Object.keys(savoirs).filter((sv) => socleDe(sv) === so);
    const ids = new Set();
    const liste = [];
    for (const sv of svs) for (const x of fichesDuSavoir(sv)) if (!ids.has(x.id)) { ids.add(x.id); liste.push(x); }
    return liste;
  };
  for (const [so, s] of Object.entries(socles)) {
    const doms = Object.entries(domaines).filter(([, d]) => d.socle === so).map(([dk, d]) => ({
      titre: L(d.titre),
      savoirs: Object.entries(savoirs).filter(([, x]) => x.domaine === dk).map(([sv, x]) => {
        const [a, b] = compte(fichesDuSavoir(sv));
        return { titre: L(x.titre), href: `v-${sv}.html`, compte: t.compteSavoir(a, b), ouvert: a > 0 };
      }),
    }));
    const groupesPistes = s.pistes ? MATURITES.map((mat) => ({ titre: t.maturite[mat], expl: t.maturiteExpl[mat],
      pistes: pistes.filter((pi) => pi.meta.maturite === mat).map(itemPiste) })).filter((g) => g.pistes.length) : [];
    add({ ...commun(`s-${so}`), kind: 'socle', title: `${L(s.nom)} · CivicNode`, modeTxt: t.beta,
          nom: L(s.nom), domaine: L(s.domaine), explique: L(s.nom_explique), domaines: doms, pistes: groupesPistes,
          avert: s.pistes ? t.pisteAvert : '', retour: HOME });
  }

  // ------------------------------------------------------------ pages de texte (sources et méthode)
  for (const pt of c.pagesTexte || []) {
    add({ ...commun(`a-${pt.id}`), kind: 'texte', title: `${pt.meta.titre} · CivicNode`, modeTxt: t.beta,
          titre: pt.meta.titre, accroche: pt.meta.accroche || '', corpsHtml: md(pt.corps),
          maj: pt.meta.maj ? String(pt.meta.maj instanceof Date ? pt.meta.maj.toISOString().slice(0, 10) : pt.meta.maj) : '',
          nonTraduite: pt.traduite ? '' : t.nonTraduitePiste, retour: HOME });
  }

  // ------------------------------------------------------------ accueil, toutes, recherche
  const accueil = {
    ...commun('index'), kind: 'accueil', title: `CivicNode · ${t.baseline}`, modeTxt: t.beta,
    commencer: fiches.filter((f) => f.meta.socle === 'commencer').map(item),
    familles: familles.map((fa) => ({
      nom: L(fa.nom),
      socles: fa.socles.map((so) => {
        if (socles[so].pistes) {
          return { nom: L(socles[so].nom), domaine: L(socles[so].domaine), href: `s-${so}.html`,
                   compte: t.comptePistes(pistes.length), ouvert: pistes.length > 0 };
        }
        const [a, b] = compte(fichesDuSocle(so));
        return { nom: L(socles[so].nom), domaine: L(socles[so].domaine), href: `s-${so}.html`, compte: t.compteSocle(a, b), ouvert: a > 0 };
      }),
    })),
  };

  const ligne = (x) => {
    const f = fiches.find((y) => y.id === x.id);
    const m = f ? f.meta : prevues.find((p) => p.id === x.id);
    return { num: f ? f.num : '', titre: x.titre, href: x.href, niveau: m.danger, niveauMot: t.niv[m.danger] || '',
             temps: t.h[m.horizon] || '', tier: (m.tier || []).join('–'), exige: f ? f.meta.exige_avance || '' : '',
             suspendu: !!(f && f.meta.suspendu), prevue: !f };
  };
  const groupes = [{ titre: t.commencer, lignes: fiches.filter((f) => f.meta.socle === 'commencer').map(item).map(ligne) },
    ...Object.entries(socles).filter(([, s]) => !s.pistes)
      .map(([so, s]) => ({ titre: `${L(s.nom)} · ${L(s.domaine)}`, lignes: fichesDuSocle(so).map(ligne) }))];
  add({ ...commun('toutes'), kind: 'toutes', title: `${t.toutes} · CivicNode`, modeTxt: t.beta,
        total: fiches.length + prevues.length, actives: fiches.filter((f) => f.actif).length, groupes });
  add({ ...commun('recherche'), kind: 'recherche', title: `${t.recherche} · CivicNode`, modeTxt: t.beta });

  return { pages, home: accueil };
}
