// Construit le modèle de toutes les pages du site : l'entonnoir est calculé depuis les en-têtes.
// Les composants Astro ne font qu'afficher ce modèle ; tous les liens sont décidés ici.
import { md, mdi } from './corpus.mjs';

export const DATE = '09/11/2026';
export const HOME = 'index.html';
// Version station : construite avec CIVZERO_STATION=1, elle donne accès à l'assistant.
export const STATION = process.env.CIVZERO_STATION === '1';
// Une seule entrée : les solutions sont rangées par temps de travail, de l'instant aux saisons.
export const HORIZONS = { instant: 'INSTANT', hours: 'HEURES', seasons: 'SAISONS' };
const ORDRE_HORIZON = { instant: 0, hours: 1, seasons: 2 };
const RANG_DANGER = { vert: 1, orange: 2, rouge: 3 };
const NIVEAUX_DANGER = ['vert', 'orange', 'rouge'];
const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

export function buildModel(c) {
  const { fiches, labels, conf, blocs, besoins, niveaux } = c;
  const demo = Array.isArray(conf.demo) && conf.demo.length ? new Set(conf.demo) : null;
  for (const f of fiches) f.actif = !demo || demo.has(f.id);
  const byId = Object.fromEntries(fiches.map((f) => [f.id, f]));
  const depot = (conf.depot || '').trim();
  const email = (conf.email || '').trim();

  const labelCourt = (niv) => {
    const t = labels[niv] || '';
    return t.startsWith('[À VALIDER') ? 'Libellé officiel en attente de relecture (Nodule Zéro)' : t;
  };
  const minTier = (f) => Math.min(...f.meta.tier);
  const rangH = (f) => ORDRE_HORIZON[f.meta.horizon] ?? 3;
  // Le niveau d'une fiche est celui du geste principal ; une variante plus risquée est signalée à côté.
  const varianteRisquee = (f) => (f.meta.variantes || [])
    .filter((v) => (RANG_DANGER[v.danger] || 0) > (RANG_DANGER[f.meta.danger] || 0))
    .sort((a, z) => RANG_DANGER[z.danger] - RANG_DANGER[a.danger])[0]?.danger || '';
  const blocTitre = (b) => (blocs[b] ? blocs[b].titre : 'SOCLE');
  const besoinTitre = (b) => besoins[b].titre;

  const pages = [];
  const add = (p) => { pages.push(p); return `${p.slug}.html`; };

  const danger = (f) => NIVEAUX_DANGER.includes(f.meta.danger)
    ? { niveau: f.meta.danger, label: labelCourt(f.meta.danger), risques: f.risques.map(mdi) }
    : null;
  const badges = (f, court = false) => [
    { t: '▒ BROUILLON ▒', trame: true },
    ...(f.meta.suspendu ? [{ t: 'EN SUSPENS' }] : []),
    ...(court || !HORIZONS[f.meta.horizon] ? [] : [{ t: HORIZONS[f.meta.horizon] }]),
  ];
  const crumbFiche = (f) => ({ bloc: blocTitre(f.meta.bloc), besoin: besoinTitre(f.meta.besoin) });

  const optFiche = (f, extra = '') => {
    const h = HORIZONS[f.meta.horizon] ? `${cap(HORIZONS[f.meta.horizon].toLowerCase())} · ` : '';
    const v = varianteRisquee(f);
    const d = NIVEAUX_DANGER.includes(f.meta.danger)
      ? `Danger estimé : ${f.meta.danger}${v ? ` (variante ${v})` : ''}` : 'Prérequis de toutes les fiches';
    return { href: f.actif ? `f-${f.id}.html` : null, titre: f.meta.titre, niveau: f.meta.danger,
             sub: f.actif ? `${extra}${h}${d} · brouillon` : `À venir · ${h}${d}`, note: '' };
  };

  // ------------------------------------------------------------ fiches actives
  for (const f of fiches.filter((x) => x.actif)) {
    const pre = `f-${f.id}`;
    const n = f.steps.length;
    const general = f.coince.filter((x) => !x.etapes.length);
    add({
      slug: pre, kind: 'fiche', title: `${f.meta.titre} · CivZero`, modeTxt: 'BÊTA',
      crumb: crumbFiche(f), titre: f.meta.titre, badges: badges(f), danger: danger(f),
      securiteHtml: !NIVEAUX_DANGER.includes(f.meta.danger) ? md(f.secs[2])
        : (f.s2Reste ? md(f.s2Reste) : ''),
      suspension: f.meta.suspendu ? f.meta.raison_suspension : '',
      exige: f.meta.exige_avance,
      variantes: (f.meta.variantes || []).map((v) => ({ niveau: v.danger, nom: v.id.replaceAll('-', ' ') })),
      principeHtml: md(f.secs[1]),
      prefaceHtml: f.preface ? md(f.preface) : '',
      premiere: n ? `${pre}-e${f.steps[0].n}.html` : null,
      etapes: f.steps.map((s) => ({ titre: s.titre, href: `${pre}-e${s.n}.html` })),
      coince: general.map((x) => ({ probleme: mdi(x.probleme), texte: mdi(x.texte) })),
      complete: `${pre}-complete.html`, rapport: `${pre}-rapport.html`,
    });

    f.steps.forEach((s, i) => {
      add({
        slug: `${pre}-e${s.n}`, kind: 'etape', title: `Étape ${i + 1} · ${f.meta.titre} · CivZero`, modeTxt: 'BÊTA',
        crumb: crumbFiche(f), titre: f.meta.titre, badges: badges(f, true), danger: danger(f),
        rang: i + 1, total: n, barre: '■'.repeat(i + 1) + '□'.repeat(n - i - 1),
        ficheId: f.id, etapeN: s.n, etapeTitre: s.titre, action: mdi(cap(s.action)), verif: s.verif ? mdi(cap(s.verif)) : '',
        source: s.source ? mdi(s.source) : '',
        coince: f.coince.filter((x) => x.etapes.includes(s.n))
          .map((x) => ({ probleme: mdi(x.probleme), texte: mdi(x.texte) })),
        precedent: i ? { href: `${pre}-e${f.steps[i - 1].n}.html`, t: '[ < ÉTAPE PRÉCÉDENTE ]' }
                     : { href: `${pre}.html`, t: '[ < PRÉSENTATION ]' },
        suivant: i < n - 1 ? { href: `${pre}-e${f.steps[i + 1].n}.html`, t: '[ ÉTAPE SUIVANTE > ]' }
                           : { href: `${pre}-rapport.html`, t: '[ TERMINÉ : FAIRE UN RAPPORT > ]' },
        complete: `${pre}-complete.html`, rapport: `${pre}-rapport.html`,
      });
    });

    add({
      slug: `${pre}-complete`, kind: 'complete', title: `${f.meta.titre} (complète) · CivZero`, modeTxt: 'BÊTA',
      crumb: crumbFiche(f), titre: f.meta.titre, badges: badges(f),
      bodyHtml: md(f.body.replace('[Libellé officiel affiché depuis le Nodule Zéro]', labelCourt(f.meta.danger))),
      fiche: `${pre}.html`, rapport: `${pre}-rapport.html`,
    });

    const params = new URLSearchParams({ template: 'rapport-reproduction.yml', title: `Rapport : ${f.id}`,
                                         fiche: f.id, version: DATE });
    add({
      slug: `${pre}-rapport`, kind: 'rapport', title: `Rapport · ${f.meta.titre} · CivZero`, modeTxt: 'BÊTA',
      crumb: crumbFiche(f), titre: f.meta.titre,
      modele: `RAPPORT DE REPRODUCTION — CivZero\nFiche : ${f.id} (${f.meta.titre})\nVersion du corpus : ${DATE}\n`
        + `Statut de la fiche : ${f.meta.statut}\n\nDate :\nMilieu (urbain / rural / aride) :\nVariante suivie :\n`
        + 'Matériel utilisé, et son origine (récupération / achat) :\nRésultat (réussi / partiel / échec) :\n'
        + 'Étape où ça a coincé :\nCe qui a coincé, et ce que vous avez fait :\n'
        + 'Une étape vous a semblé fausse ou dangereuse ? Laquelle et pourquoi :\n'
        + 'Incident ou quasi-accident (oui / non, décrire) :\nPhoto (oui / non) :\n',
      github: depot ? `https://github.com/${depot}/issues/new?${params}` : null,
      email: email || null,
      fiche: `${pre}.html`,
    });
  }

  // ------------------------------------------------------------ entonnoir
  const candidats = (b) => fiches.filter((f) => f.meta.besoin === b);
  const actifs = (b) => candidats(b).filter((f) => f.actif);
  const prevues = (b) => candidats(b).filter((f) => !f.actif);
  const matches = (b, u) => actifs(b).filter((f) => minTier(f) <= u)
    .sort((a, z) => rangH(a) - rangH(z) || a.meta.vague - z.meta.vague || a.num.localeCompare(z.num));
  const tierUtile = (b) => new Set([0, 1, 2].map((u) => matches(b, u).map((f) => f.id).join())).size > 1;

  const listePage = (slug, b, liste, titre, retour) => add({
    slug, kind: 'liste', title: `${besoinTitre(b)} · CivZero`, modeTxt: 'BÊTA',
    crumb: { bloc: blocTitre(besoins[b].bloc), besoin: besoinTitre(b) },
    titre, fiches: liste.map((f) => optFiche(f)), prevues: prevues(b).map((f) => optFiche(f)),
    retour, home: HOME,
  });

  const cibleBesoin = (b) => {
    const a = actifs(b);
    if (!a.length) return null;
    if (tierUtile(b)) return `e-${b}.html`;
    if (a.length === 1 && !prevues(b).length) return `f-${a[0].id}.html`;
    return `e-${b}-liste.html`;
  };

  for (const [bloc, bd] of Object.entries(blocs)) {
    const bes = Object.keys(besoins).filter((b) => besoins[b].bloc === bloc);
    if (!bes.some((b) => actifs(b).length)) continue;          // bloc entièrement à venir
    const opts = bes.map((b) => {
      const nb = candidats(b).length, na = actifs(b).length;
      return { titre: besoinTitre(b), desc: besoins[b].description, href: cibleBesoin(b),
               compte: na ? `${na} fiche${na > 1 ? 's' : ''}${nb > na ? ` · ${nb - na} à venir` : ''}`
                          : `${nb} fiche${nb > 1 ? 's' : ''} à venir` };
    }).sort((a, z) => (a.href === null) - (z.href === null));
    add({ slug: `e-${bloc}`, kind: 'bloc', title: `${bd.titre} · CivZero`, modeTxt: 'BÊTA',
          bloc: bd.titre, options: opts, retour: HOME });

    for (const b of bes) {
      if (!actifs(b).length) continue;
      if (!tierUtile(b)) {
        if (actifs(b).length > 1 || prevues(b).length) {
          const n = actifs(b).length;
          listePage(`e-${b}-liste`, b, matches(b, 2),
                    `${n} fiche${n > 1 ? 's' : ''} pour ce besoin, de l'instant aux saisons`, `e-${bloc}.html`);
        }
        continue;
      }
      const dispo = [], vides = [];
      for (const u of [0, 1, 2]) {
        const r = matches(b, u);
        const [t, s_] = niveaux[u];
        const o = { k: `TIER ${u}`, t, s: s_, mene: '', href: `e-${b}-t${u}.html`, vide: !r.length };
        if (r.length === 1) { o.href = `f-${r[0].id}.html`; o.mene = `Mène à : ${r[0].meta.titre}`; }
        else if (r.length) {
          o.mene = `${r.length} fiches`;
          listePage(`e-${b}-t${u}`, b, r, `${r.length} fiches avec ce matériel, de l'instant aux saisons`, `e-${b}.html`);
        } else {
          add({ slug: `e-${b}-t${u}`, kind: 'impasse', title: 'Aucune fiche · CivZero', modeTxt: 'BÊTA',
                crumb: { bloc: bd.titre, besoin: besoinTitre(b) },
                besoin: besoinTitre(b), materiel: `TIER ${u} · ${t}`,
                proches: actifs(b).map((f) => optFiche(f, `Demande : TIER ${minTier(f)} · `)),
                retour: `e-${b}.html` });
        }
        (r.length ? dispo : vides).push(o);
      }
      add({ slug: `e-${b}`, kind: 'tier', title: `${besoinTitre(b)} · CivZero`, modeTxt: 'BÊTA',
            crumb: { bloc: bd.titre, besoin: besoinTitre(b) },
            options: [...dispo, ...vides], retour: `e-${bloc}.html` });
    }
  }

  // ------------------------------------------------------------ accueils et index
  const accueil = {
    modeTxt: 'BÊTA',
    expl: "Les solutions sont rangées selon le temps qu'elles demandent : un instant, quelques heures, plusieurs saisons. "
      + "Chaque fiche dit aussi son niveau de danger et ce qu'il faut avoir.",
    socle: fiches.filter((f) => f.meta.besoin === 'commencer').map((f) => optFiche(f)),
    blocs: Object.entries(blocs).map(([bloc, bd]) => {
      const bes = Object.keys(besoins).filter((b) => besoins[b].bloc === bloc);
      const nf = fiches.filter((f) => f.meta.bloc === bloc);
      const na = nf.filter((f) => f.actif).length;
      return { titre: bd.titre, sous: bd.sous_titre, href: na ? `e-${bloc}.html` : null,
               compte: na ? `${na} fiche${na > 1 ? 's' : ''} · ${nf.length - na} à venir` : `${nf.length} fiches à venir`,
               nbBesoins: bes.length };
    }),
    aVenir: c.aVenir,
  };

  add({
    slug: 'toutes', kind: 'toutes', title: 'Toutes les fiches · CivZero', modeTxt: 'BÊTA',
    total: fiches.length, actives: fiches.filter((f) => f.actif).length,
    vagues: [[1, 'Vague 1 · sans station ni achat'], [2, 'Vague 2 · avec la station'], [3, "Vague 3 · vers l'alternative"]]
      .map(([v, t]) => ({ titre: t, lignes: fiches.filter((f) => f.meta.vague === v).map((f) => ({
        num: f.num, titre: f.meta.titre, href: f.actif ? `f-${f.id}.html` : null, niveau: f.meta.danger,
        horizon: HORIZONS[f.meta.horizon] || '',
        tier: minTier(f), exige: f.meta.exige_avance, suspendu: !!f.meta.suspendu })) })),
  });
  add({ slug: 'recherche', kind: 'recherche', title: 'Recherche · CivZero', modeTxt: 'BÊTA' });

  return { pages, home: { slug: 'index', kind: 'accueil', title: 'Station CivZero', ...accueil } };
}
