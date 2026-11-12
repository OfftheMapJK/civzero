// Intègre au corpus une fiche écrite par l'agent ou l'atelier de rédaction (dossier agent/sortie/).
//
//   npm run integrer -- agent/sortie/NN-id.md [autres fiches…]     (sans argument : toutes les fiches de agent/sortie/)
//   npm run integrer -- --essai agent/sortie/NN-id.md               (montre ce qui serait fait, sans rien changer)
//
// Pour chaque fiche : contrôle de l'en-tête (identifiant, provenance adaptée, brouillon) ; nouveau numéro, le premier libre
// du corpus ; copie dans corpus/fiches/ ; retrait de corpus/prevues.yaml ; mise à jour de sa ligne dans
// corpus/catalogue.csv (numéro, statut, sources) ; ajout à la démo seulement si sa traduction anglaise existe
// (corpus/fiches/en/, même nom) ; la fiche d'origine est rangée dans agent/sortie/integrees/. Puis le vérificateur.
// Rien n'est supprimé : en cas de doute, tout se retrouve dans agent/sortie/integrees/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';
import { lireCsv } from '../src/lib/corpus.mjs';
import { adaptable } from '../src/lib/licences.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));

const enTete = (txt) => {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error("pas d'en-tête YAML entre deux lignes « --- »");
  return yaml.load(m[1]) || {};
};

// Une ligne CSV, avec guillemets quand il le faut (comme l'écrit un tableur).
const champCsv = (v) => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const ligneCsv = (valeurs) => valeurs.map(champCsv).join(',');

// Retire un bloc « - id: x » de prevues.yaml en gardant le reste du fichier tel quel.
export function retirerPrevue(texte, id) {
  const lignes = texte.split('\n');
  const debut = lignes.findIndex((l) => l === `- id: ${id}`);
  if (debut < 0) return { texte, retire: false };
  let fin = debut + 1;
  while (fin < lignes.length && !lignes[fin].startsWith('- ')) fin++;
  return { texte: [...lignes.slice(0, debut), ...lignes.slice(fin)].join('\n'), retire: true };
}

// Met à jour la ligne du catalogue dont le titre correspond, sans réécrire les autres lignes.
export function majCatalogue(texte, titre, { numero, sources }) {
  const lignes = texte.split('\n');
  const tete = lignes[0].split(',');   // l'en-tête du catalogue n'a ni guillemets ni virgules dans ses noms
  const col = Object.fromEntries(tete.map((k, i) => [k, i]));
  for (let i = 1; i < lignes.length; i++) {
    if (!lignes[i].trim()) continue;
    const ligne = lireCsv(`${lignes[0]}\n${lignes[i]}\n`)[0];
    if (!ligne || ligne.titre !== titre) continue;
    const valeurs = tete.map((k) => ligne[k] ?? '');
    valeurs[col.numero] = numero;
    valeurs[col.statut] = 'existante';
    if (sources) valeurs[col.sources] = sources;
    lignes[i] = ligneCsv(valeurs);
    return { texte: lignes.join('\n'), trouve: true };
  }
  return { texte, trouve: false };
}

// Ajoute un identifiant à la fin de la liste « demo: » de civicnode.yaml.
export function ajouterDemo(texte, id) {
  const lignes = texte.split('\n');
  const d = lignes.findIndex((l) => /^demo:\s*$/.test(l));
  if (d < 0) return { texte, ajoute: false };
  let fin = d + 1;
  while (fin < lignes.length && /^\s+- /.test(lignes[fin])) fin++;
  if (lignes.slice(d + 1, fin).some((l) => l.trim() === `- ${id}`)) return { texte, ajoute: false };
  lignes.splice(fin, 0, `  - ${id}`);
  return { texte: lignes.join('\n'), ajoute: true };
}

// Remplace le bloc « medias: » de l'en-tête d'une fiche, sans toucher au reste du fichier.
export function remplacerMedias(texte, medias) {
  const m = texte.match(/^---\n([\s\S]*?)\n---\n/);
  const lignes = m[1].split('\n');
  const debut = lignes.findIndex((l) => /^medias:/.test(l));
  const bloc = yaml.dump({ medias }, { lineWidth: 200, quotingType: '"' }).trim().split('\n');
  if (debut < 0) lignes.push(...bloc);
  else {
    let fin = debut + 1;
    while (fin < lignes.length && /^(\s|-)/.test(lignes[fin])) fin++;
    lignes.splice(debut, fin - debut, ...bloc);
  }
  return texte.replace(m[1], lignes.join('\n'));
}

const copierMedias = (de, vers) => {
  if (!fs.existsSync(de)) return 0;
  fs.mkdirSync(vers, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(de)) {
    if (f === 'medias.yaml' || fs.statSync(path.join(de, f)).isDirectory()) continue;
    fs.copyFileSync(path.join(de, f), path.join(vers, f));
    n++;
  }
  return n;
};

// Ajoute à des fiches déjà dans le corpus les médias préparés dans agent/sortie/medias/<id>/ (medias.yaml + fichiers).
export function integrerMedias(dossiers, { racine = path.resolve(ICI, '..'), essai = false } = {}) {
  const dossierFiches = path.join(racine, 'corpus', 'fiches');
  const parId = new Map(fs.readdirSync(dossierFiches).filter((f) => f.endsWith('.md'))
    .map((f) => [enTete(fs.readFileSync(path.join(dossierFiches, f), 'utf8')).id, f]));
  const res = [];
  for (const d of dossiers) {
    const id = path.basename(d);
    const r = { source: d, id, notes: [] };
    res.push(r);
    try {
      const nom = parId.get(id);
      if (!nom) throw new Error(`aucune fiche « ${id} » dans le corpus`);
      const nouveaux = yaml.load(fs.readFileSync(path.join(d, 'medias.yaml'), 'utf8')) || [];
      if (!Array.isArray(nouveaux) || !nouveaux.length) throw new Error('medias.yaml doit être une liste de médias');
      for (const x of nouveaux) {
        if (!x.fichier || !x.licence || !x.auteur || !x.legende?.fr || !x.legende?.en) throw new Error(`média incomplet : ${x.fichier || '(sans fichier)'} (fichier, licence, auteur, légende fr et en)`);
        if (!adaptable(x.licence)) throw new Error(`le média « ${x.fichier} » est sous « ${x.licence} », non accepté`);
        if (!x.telecharger && !fs.existsSync(path.join(d, x.fichier))) throw new Error(`le fichier « ${x.fichier} » manque, et aucun lien « telecharger »`);
      }
      const chemin = path.join(dossierFiches, nom);
      const txt = fs.readFileSync(chemin, 'utf8');
      const existants = enTete(txt).medias || [];
      const garder = existants.filter((e) => !nouveaux.some((n) => n.fichier === e.fichier));
      r.cible = path.join('corpus', 'fiches', nom);
      r.notes.push(`${nouveaux.length} média(s) ajouté(s) ou remplacé(s)`);
      if (!essai) {
        fs.writeFileSync(chemin, remplacerMedias(txt, [...garder, ...nouveaux]));
        const n = copierMedias(d, path.join(racine, 'public', 'medias', id));
        r.notes.push(`${n} fichier(s) copié(s) dans public/medias/${id}/`);
        const rangement = path.join(path.dirname(d), '..', 'integrees', 'medias');
        fs.mkdirSync(rangement, { recursive: true });
        fs.renameSync(d, path.join(rangement, `${id}-${Date.now()}`));
      }
      r.ok = true;
    } catch (e) { r.erreur = e.message; }
  }
  return res;
}

export function integrer(fichiers, { racine = path.resolve(ICI, '..'), essai = false } = {}) {
  const corpus = path.join(racine, 'corpus');
  const dossierFiches = path.join(corpus, 'fiches');
  const existants = fs.readdirSync(dossierFiches).filter((f) => f.endsWith('.md'));
  const ids = new Set(existants.map((f) => enTete(fs.readFileSync(path.join(dossierFiches, f), 'utf8')).id));
  let prochain = Math.max(-1, ...existants.map((f) => Number(f.slice(0, 2))).filter(Number.isFinite)) + 1;
  const lire = (f) => fs.readFileSync(path.join(corpus, f), 'utf8');
  let prevues = lire('prevues.yaml');
  let catalogue = lire('catalogue.csv');
  let reglages = lire('civicnode.yaml');
  const listePrevues = yaml.load(prevues) || [];
  const resultats = [];

  for (const source of fichiers) {
    const r = { source, notes: [] };
    resultats.push(r);
    try {
      const txt = fs.readFileSync(source, 'utf8');
      const m = enTete(txt);
      if (!m.id) throw new Error("l'en-tête n'a pas d'identifiant (id)");
      if (ids.has(m.id)) throw new Error(`une fiche « ${m.id} » existe déjà dans le corpus`);
      if (m.statut !== 'brouillon') throw new Error(`statut « ${m.statut} » : une fiche qui entre est toujours en brouillon`);
      const adaptees = (m.provenance || []).filter((s) => s.usage === 'adapte');
      if (!adaptees.length) throw new Error('aucune source adaptée dans la provenance');
      for (const s of adaptees) if (!adaptable(s.licence)) throw new Error(`la source « ${s.titre} » est sous « ${s.licence} », non adaptable`);

      const numero = String(prochain).padStart(2, '0');
      const nom = `${numero}-${m.id}.md`;
      r.cible = path.join('corpus', 'fiches', nom);
      r.id = m.id;

      const prevue = listePrevues.find((p) => p.id === m.id);
      const titreCatalogue = prevue?.titre?.fr || m.titre;
      const retrait = retirerPrevue(prevues, m.id);
      prevues = retrait.texte;
      r.notes.push(retrait.retire ? 'retirée des fiches prévues' : "n'était pas dans les fiches prévues");

      const sources = adaptees.map((s) => `${s.auteur || s.titre} (${s.licence})`).join(' ; ');
      const cat = majCatalogue(catalogue, titreCatalogue, { numero, sources });
      catalogue = cat.texte;
      r.notes.push(cat.trouve ? `catalogue : ligne « ${titreCatalogue} » mise à jour` : `catalogue : aucune ligne « ${titreCatalogue} », à ajouter à la main`);

      const traduite = fs.existsSync(path.join(dossierFiches, 'en', nom));
      if (traduite) {
        const d = ajouterDemo(reglages, m.id);
        reglages = d.texte;
        r.notes.push(d.ajoute ? 'ouverte dans la démo' : 'déjà dans la démo');
      } else {
        r.notes.push(`pas encore traduite (corpus/fiches/en/${nom}) : reste fermée dans la démo`);
      }

      // Une fiche qui entre par l'agent adapte des sources : son origine est « adaptee ».
      let texte = txt;
      if (!m.origine) {
        texte = txt.replace(/^(statut:.*)$/m, 'origine: adaptee\n$1');
        r.notes.push('origine : adaptee (ajoutée)');
      }

      if (!essai) {
        fs.writeFileSync(path.join(dossierFiches, nom), texte);
        const n = copierMedias(path.join(path.dirname(source), 'medias', m.id), path.join(racine, 'public', 'medias', m.id));
        if (n) r.notes.push(`${n} média(s) copié(s) dans public/medias/${m.id}/`);
        const rangement = path.join(path.dirname(source), 'integrees');
        fs.mkdirSync(rangement, { recursive: true });
        fs.renameSync(source, path.join(rangement, path.basename(source)));
        const rapport = source.replace(/\.md$/, '.rapport.md');
        if (fs.existsSync(rapport)) fs.renameSync(rapport, path.join(rangement, path.basename(rapport)));
      }
      ids.add(m.id);
      prochain++;
      r.ok = true;
    } catch (e) {
      r.erreur = e.message;
    }
  }
  if (!essai) {
    fs.writeFileSync(path.join(corpus, 'prevues.yaml'), prevues);
    fs.writeFileSync(path.join(corpus, 'catalogue.csv'), catalogue);
    fs.writeFileSync(path.join(corpus, 'civicnode.yaml'), reglages);
  }
  return resultats;
}

// ---------------------------------------------------------------- ligne de commande
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const essai = args.includes('--essai');
  let fichiers = args.filter((a) => a !== '--essai');
  if (!fichiers.length) {
    const sortie = path.join(ICI, 'sortie');
    fichiers = fs.existsSync(sortie) ? fs.readdirSync(sortie).filter((f) => f.endsWith('.md') && !f.endsWith('.rapport.md')).sort()
      .map((f) => path.join(sortie, f)) : [];
  }
  // Les dossiers agent/sortie/medias/<id>/ avec un medias.yaml complètent des fiches déjà dans le corpus.
  const dossierMedias = path.join(ICI, 'sortie', 'medias');
  const idsNouvelles = new Set(fichiers.map((f) => path.basename(f).slice(3).replace(/\.md$/, '')));
  const complements = fs.existsSync(dossierMedias) ? fs.readdirSync(dossierMedias)
    .filter((d) => !idsNouvelles.has(d) && fs.existsSync(path.join(dossierMedias, d, 'medias.yaml'))).map((d) => path.join(dossierMedias, d)) : [];
  if (!fichiers.length && !complements.length) { console.log('Rien à intégrer dans agent/sortie/.'); process.exit(0); }
  const res = [...integrer(fichiers, { essai }), ...integrerMedias(complements, { essai })];
  for (const r of res) {
    if (r.erreur) { console.log(`✗ ${path.basename(r.source)} : ${r.erreur}`); continue; }
    console.log(`${essai ? '(essai) ' : ''}✓ ${path.basename(r.source)} → ${r.cible}`);
    for (const n of r.notes) console.log(`    · ${n}`);
  }
  if (essai) { console.log('\nEssai : rien n\'a été modifié.'); process.exit(0); }
  console.log('\nVérification du corpus :');
  try { execFileSync(process.execPath, [path.join(ICI, '..', 'scripts', 'verifier.mjs')], { stdio: 'inherit' }); }
  catch { process.exit(1); }
}
