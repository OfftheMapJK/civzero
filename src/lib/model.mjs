// Construit le modèle de toutes les pages du site : l'entonnoir est calculé depuis les en-têtes.
// Les composants Astro ne font qu'afficher ce modèle ; tous les liens sont décidés ici.
import { md, mdi } from './corpus.mjs';

export const DATE = '09/11/2026';
export const HOME = 'index.html';
export const MODES = {
  prepare: { label: 'JE PRÉPARE', home: HOME,
             expl: "Vous avez le temps, Internet et la possibilité d'acheter ou de monter." },
  coupure: { label: 'ÇA A COUPÉ', home: 'coupure.html',
             expl: 'Vous faites avec ce qui est là. Les fiches qui demandaient une préparation sont signalées.' },
};
const NIVEAUX_DANGER = ['vert', 'orange', 'rouge'];

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
  const coupureOk = (f) => f.meta.mode.includes('coupure');
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
    ...(court ? [] : f.meta.mode.map((m) => ({ t: MODES[m].label }))),
  ];
  const crumbFiche = (f) => ({ bloc: blocTitre(f.meta.bloc), besoin: besoinTitre(f.meta.besoin) });

  const optFiche = (f, mode, extra = '') => ({
    href: f.actif ? `f-${f.id}.html` : null,
    titre: f.meta.titre,
    niveau: f.meta.danger,
    sub: f.actif
      ? `${extra}${NIVEAUX_DANGER.includes(f.meta.danger) ? `Danger estimé : ${f.meta.danger}` : 'Prérequis de toutes les fiches'} · brouillon`
      : 'À venir',
    note: f.actif && mode === 'coupure' && !coupureOk(f)
      ? `À PRÉPARER AVANT · exige : ${f.meta.exige_avance}` : '',
  });

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
      modesHtml: f.modesTxt ? md(f.modesTxt) : '',
      complete: `${pre}-complete.html`, rapport: `${pre}-rapport.html`,
    });

    f.steps.forEach((s, i) => {
      add({
        slug: `${pre}-e${s.n}`, kind: 'etape', title: `Étape ${i + 1} · ${f.meta.titre} · CivZero`, modeTxt: 'BÊTA',
        crumb: crumbFiche(f), titre: f.meta.titre, badges: badges(f, true), danger: danger(f),
        rang: i + 1, total: n, barre: '■'.repeat(i + 1) + '□'.repeat(n - i - 1),
        etapeTitre: s.titre, action: mdi(s.action), verif: s.verif ? mdi(s.verif) : '',
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
  const matches = (b, u, mode) => actifs(b).filter((f) => minTier(f) <= u)
    .sort((a, z) => (mode === 'coupure' && !coupureOk(a)) - (mode === 'coupure' && !coupureOk(z))
                    || a.meta.vague - z.meta.vague || a.num.localeCompare(z.num));
  const tierUtile = (b) => new Set([0, 1, 2].map((u) => matches(b, u, 'prepare').map((f) => f.id).join())).size > 1;

  const listePage = (slug, mode, b, liste, titre, retour) => add({
    slug, kind: 'liste', title: `${besoinTitre(b)} · CivZero`, modeTxt: MODES[mode].label,
    crumb: { bloc: blocTitre(besoins[b].bloc), besoin: besoinTitre(b) }, modeLabel: MODES[mode].label,
    titre, fiches: liste.map((f) => optFiche(f, mode)), prevues: prevues(b).map((f) => optFiche(f, mode)),
    retour, home: MODES[mode].home,
  });

  const cibleBesoin = (mode, b) => {
    const a = actifs(b);
    if (!a.length) return null;
    if (tierUtile(b)) return `e-${mode}-${b}.html`;
    if (a.length === 1 && !prevues(b).length) return `f-${a[0].id}.html`;
    return `e-${mode}-${b}-liste.html`;
  };

  for (const [mode, md_] of Object.entries(MODES)) {
    for (const [bloc, bd] of Object.entries(blocs)) {
      const bes = Object.keys(besoins).filter((b) => besoins[b].bloc === bloc);
      if (!bes.some((b) => actifs(b).length)) continue;          // bloc entièrement à venir
      const opts = bes.map((b) => {
        const nb = candidats(b).length, na = actifs(b).length;
        return { titre: besoinTitre(b), desc: besoins[b].description, href: cibleBesoin(mode, b),
                 compte: na ? `${na} fiche${na > 1 ? 's' : ''}${nb > na ? ` · ${nb - na} à venir` : ''}`
                            : `${nb} fiche${nb > 1 ? 's' : ''} à venir` };
      }).sort((a, z) => (a.href === null) - (z.href === null));
      add({ slug: `e-${mode}-${bloc}`, kind: 'bloc', title: `${bd.titre} · CivZero`, modeTxt: md_.label,
            bloc: bd.titre, modeLabel: md_.label, options: opts, retour: md_.home });

      for (const b of bes) {
        if (!actifs(b).length) continue;
        if (!tierUtile(b)) {
          if (actifs(b).length > 1 || prevues(b).length) {
            const n = actifs(b).length;
            listePage(`e-${mode}-${b}-liste`, mode, b, matches(b, 2, mode),
                      `${n} fiche${n > 1 ? 's' : ''} pour ce besoin`, `e-${mode}-${bloc}.html`);
          }
          continue;
        }
        const dispo = [], vides = [];
        for (const u of [0, 1, 2]) {
          const r = matches(b, u, mode);
          const [t, s] = niveaux[u];
          const o = { k: `TIER ${u}`, t, s, mene: '', href: `e-${mode}-${b}-t${u}.html`, vide: !r.length };
          if (r.length === 1) { o.href = `f-${r[0].id}.html`; o.mene = `Mène à : ${r[0].meta.titre}`; }
          else if (r.length) {
            o.mene = `${r.length} fiches`;
            listePage(`e-${mode}-${b}-t${u}`, mode, b, r, `${r.length} fiches avec ce matériel`, `e-${mode}-${b}.html`);
          } else {
            add({ slug: `e-${mode}-${b}-t${u}`, kind: 'impasse', title: 'Aucune fiche · CivZero', modeTxt: md_.label,
                  crumb: { bloc: bd.titre, besoin: besoinTitre(b) }, modeLabel: md_.label,
                  besoin: besoinTitre(b), materiel: `TIER ${u} · ${t}`,
                  proches: actifs(b).map((f) => optFiche(f, mode, `Demande : TIER ${minTier(f)} · `)),
                  retour: `e-${mode}-${b}.html` });
          }
          (r.length ? dispo : vides).push(o);
        }
        add({ slug: `e-${mode}-${b}`, kind: 'tier', title: `${besoinTitre(b)} · CivZero`, modeTxt: md_.label,
              crumb: { bloc: bd.titre, besoin: besoinTitre(b) }, modeLabel: md_.label,
              options: [...dispo, ...vides], retour: `e-${mode}-${bloc}.html` });
      }
    }
  }

  // ------------------------------------------------------------ accueils et index
  const accueil = (mode) => ({
    mode, modeTxt: MODES[mode].label, expl: MODES[mode].expl,
    modes: Object.entries(MODES).map(([k, v]) => ({ label: v.label, href: v.home, actif: k === mode })),
    socle: fiches.filter((f) => f.meta.besoin === 'commencer').map((f) => optFiche(f, mode)),
    blocs: Object.entries(blocs).map(([bloc, bd]) => {
      const bes = Object.keys(besoins).filter((b) => besoins[b].bloc === bloc);
      const nf = fiches.filter((f) => f.meta.bloc === bloc);
      const na = nf.filter((f) => f.actif).length;
      return { titre: bd.titre, sous: bd.sous_titre, href: na ? `e-${mode}-${bloc}.html` : null,
               compte: na ? `${na} fiche${na > 1 ? 's' : ''} · ${nf.length - na} à venir` : `${nf.length} fiches à venir`,
               nbBesoins: bes.length };
    }),
    aVenir: c.aVenir,
  });
  add({ slug: 'coupure', kind: 'accueil', title: 'Station CivZero · Ça a coupé', ...accueil('coupure') });

  add({
    slug: 'toutes', kind: 'toutes', title: 'Toutes les fiches · CivZero', modeTxt: 'BÊTA',
    total: fiches.length, actives: fiches.filter((f) => f.actif).length,
    vagues: [[1, 'Vague 1 · sans station ni achat'], [2, 'Vague 2 · avec la station'], [3, "Vague 3 · vers l'alternative"]]
      .map(([v, t]) => ({ titre: t, lignes: fiches.filter((f) => f.meta.vague === v).map((f) => ({
        num: f.num, titre: f.meta.titre, href: f.actif ? `f-${f.id}.html` : null, niveau: f.meta.danger,
        tier: minTier(f), exige: f.meta.exige_avance, suspendu: !!f.meta.suspendu })) })),
  });
  add({ slug: 'recherche', kind: 'recherche', title: 'Recherche · CivZero', modeTxt: 'BÊTA' });

  return { pages, home: { slug: 'index', kind: 'accueil', title: 'Station CivZero', ...accueil('prepare') } };
}
