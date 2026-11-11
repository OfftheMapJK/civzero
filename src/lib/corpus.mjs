// Lecture du corpus : fiches Markdown (français, et traductions dans fiches/en/), structure des socles,
// fiches prévues, réglages du projet. Ce module ne dépend que de Node, js-yaml et marked : il est testable hors d'Astro.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

const wrapTables = (h) =>
  h.split('<table>').join('<div class="tablebox"><table>').split('</table>').join('</table></div>');
export const md = (s) => wrapTables(marked.parse(s || ''));
export const mdi = (s) => marked.parseInline(s || '');
export const LANGUES = ['en', 'fr'];

// Les repères du gabarit, dans les deux langues.
const STEP = /^### (?:Étape|Step) (\d+) ?: (.+)$/m;
const CHAMPS = { action: 'Action', verif: '(?:Vérification|Check)', source: 'Source' };
const RISQUES = /^(?:Risques propres à cette fiche|Risks specific to this skill) ?: ?(.*)$/;
const ENTRE_MODES = /^(?:Entre les deux modes|Between the two modes)\n/;

function parseFiche(file, txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file} : en-tête introuvable`);
  const meta = yaml.load(m[1]) || {};
  const body = m[2].replace(/^\s+/, '').replace(/^# .*\n/, '');

  const parts = body.split(/^## (\d)\. (.+)$/m);
  const secs = {};
  for (let i = 1; i < parts.length; i += 3) secs[Number(parts[i])] = parts[i + 2].trim();

  const sp = (secs[3] || '').split(new RegExp(STEP.source, 'm'));
  const preface = sp[0].trim();
  const steps = [];
  for (let i = 1; i < sp.length; i += 3) {
    const blk = sp[i + 2];
    const field = (name) => {
      const r = blk.match(new RegExp(`^- \\*\\*${CHAMPS[name]} ?:\\*\\* (.*)$`, 'm'));
      return r ? r[1].trim() : '';
    };
    steps.push({ n: Number(sp[i]), titre: sp[i + 1].trim(),
                 action: field('action'), verif: field('verif'), source: field('source') });
  }

  const coince = [];
  for (const r of (secs[4] || '').matchAll(/^- \*\*(.+?)\*\*\s*(.*)$/gm)) {
    const label = r[1];
    const parEtape = /^(Étape|Step)/.test(label);
    const etapes = parEtape ? (label.split('—')[0].match(/\d+/g) || []).map(Number) : [];
    const probleme = label.includes('—') ? label.split('—').slice(1).join('—').trim() : label;
    coince.push({ etapes, probleme, texte: r[2] });
  }

  const s2 = secs[2] || '';
  const quote = s2.split('\n').filter((l) => l.startsWith('>')).map((l) => l.slice(1).trim());
  const risques = quote.filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  for (const l of quote) {
    const r = l.match(RISQUES);
    if (r && r[1]) risques.push(r[1]);
  }
  const s2Reste = s2.split('\n').filter((l) => !l.startsWith('>')).join('\n').trim();

  const chunk = (secs[5] || '').split(/^### /m).find((c) => ENTRE_MODES.test(c));
  const modesTxt = chunk ? chunk.replace(ENTRE_MODES, '').trim() : '';

  return { file, num: file.slice(0, 2), id: meta.id, meta, secs, preface, steps, coince,
           risques, s2Reste, modesTxt, body };
}

// Un CSV simple, avec guillemets doubles (le catalogue est écrit par un tableur).
export function lireCsv(txt) {
  const lignes = [];
  let ligne = [], champ = '', guil = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (guil) {
      if (ch === '"' && txt[i + 1] === '"') { champ += '"'; i++; }
      else if (ch === '"') guil = false;
      else champ += ch;
    } else if (ch === '"') guil = true;
    else if (ch === ',') { ligne.push(champ); champ = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && txt[i + 1] === '\n') i++;
      ligne.push(champ); champ = '';
      if (ligne.some((x) => x !== '')) lignes.push(ligne);
      ligne = [];
    } else champ += ch;
  }
  if (champ !== '' || ligne.length) { ligne.push(champ); lignes.push(ligne); }
  const [tete, ...reste] = lignes;
  return reste.map((l) => Object.fromEntries(tete.map((k, i) => [k, (l[i] ?? '').trim()])));
}

function parsePiste(file, txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file} : en-tête introuvable`);
  const meta = yaml.load(m[1]) || {};
  const body = m[2].replace(/^\s+/, '').replace(/^# .*\n/, '').trim();
  const sections = [];
  const parts = body.split(/^## (\d+)\. (.+)$/m);
  for (let i = 1; i < parts.length; i += 3) sections.push({ n: Number(parts[i]), titre: parts[i + 1].trim(), texte: parts[i + 2].trim() });
  return { file, id: meta.id, meta, body, sections };
}

// lang = 'fr' (la langue de rédaction) ou 'en'. En anglais, une fiche traduite remplace le texte français ;
// une fiche non traduite garde son texte français et prend son titre anglais dans fiches/en/titres.yaml.
export function loadCorpus(root = path.resolve(process.cwd(), 'corpus'), lang = 'fr') {
  const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
  const lit = (f, defaut) => (fs.existsSync(path.join(root, f)) ? yaml.load(read(f)) || defaut : defaut);
  const conf = lit('civzero.yaml', {});
  const structure = lit('structure.yaml', { familles: [], socles: {}, domaines: {}, savoirs: {} });
  const prevues = lit('prevues.yaml', []);
  const titresEn = lang === 'en' ? lit('fiches/en/titres.yaml', {}) : {};

  const fiches = fs.readdirSync(path.join(root, 'fiches'))
    .filter((f) => f.endsWith('.md')).sort()
    .map((f) => {
      const fr = parseFiche(f, read(path.join('fiches', f)));
      fr.traduite = lang === 'fr';
      if (lang !== 'en') return fr;
      const fe = path.join('fiches', 'en', f);
      if (fs.existsSync(path.join(root, fe))) {
        const en = parseFiche(f, read(fe));
        // Les champs non textuels (niveaux, structure, provenance) restent ceux de la fiche française.
        return { ...en, id: fr.id, meta: { ...fr.meta, ...en.meta, id: fr.id }, traduite: true };
      }
      const t = titresEn[fr.id] || {};
      return { ...fr, meta: { ...fr.meta, ...t }, traduite: false };
    });

  // Libellés de danger : définis une seule fois, dans le Nodule Zéro.
  const NIV = { VERT: 'vert', GREEN: 'vert', ORANGE: 'orange', ROUGE: 'rouge', RED: 'rouge' };
  const labels = {};
  const nodule = fiches.find((f) => f.id === 'nodule-zero');
  for (const l of (nodule?.secs[2] || '').split('\n')) {
    const r = l.match(/^>\s*- \*\*(VERT|ORANGE|ROUGE|GREEN|RED) \(\w+\)\*\* — (.+)$/);
    if (r) labels[NIV[r[1]]] = r[2];
  }

  // Pistes (socle Spore) : idées, prototypes et recherches en cours. Pas d'étapes, seulement des sections.
  const dossierPistes = path.join(root, 'pistes');
  const pistes = (fs.existsSync(dossierPistes) ? fs.readdirSync(dossierPistes) : [])
    .filter((f) => f.endsWith('.md')).sort()
    .map((f) => {
      const fr = parsePiste(f, read(path.join('pistes', f)));
      if (lang !== 'en') return { ...fr, traduite: true };
      const fe = path.join('pistes', 'en', f);
      if (!fs.existsSync(path.join(root, fe))) return { ...fr, traduite: false };
      const en = parsePiste(f, read(fe));
      return { ...en, id: fr.id, meta: { ...fr.meta, ...en.meta, id: fr.id }, traduite: true };
    });

  // Le catalogue donne, pour chaque fiche écrite ou prévue, son coût, son matériel et son rapport au vivant.
  const catalogue = fs.existsSync(path.join(root, 'catalogue.csv')) ? lireCsv(read('catalogue.csv')) : [];

  return { lang, fiches, labels, conf, structure, prevues, pistes, catalogue, besoins: {} };
}
