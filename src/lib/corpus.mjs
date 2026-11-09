// Lecture du corpus : fiches Markdown, besoins de l'entonnoir, réglages du projet.
// Ce module ne dépend que de Node, js-yaml et marked : il est testable hors d'Astro.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

const wrapTables = (h) =>
  h.split('<table>').join('<div class="tablebox"><table>').split('</table>').join('</table></div>');
export const md = (s) => wrapTables(marked.parse(s || ''));
export const mdi = (s) => marked.parseInline(s || '');

function parseFiche(file, txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file} : en-tête introuvable`);
  const meta = yaml.load(m[1]);
  const body = m[2].replace(/^\s+/, '').replace(/^# .*\n/, '');

  const parts = body.split(/^## (\d)\. (.+)$/m);
  const secs = {};
  for (let i = 1; i < parts.length; i += 3) secs[Number(parts[i])] = parts[i + 2].trim();

  const sp = (secs[3] || '').split(/^### Étape (\d+) : (.+)$/m);
  const preface = sp[0].trim();
  const steps = [];
  for (let i = 1; i < sp.length; i += 3) {
    const blk = sp[i + 2];
    const field = (name) => {
      const r = blk.match(new RegExp(`^- \\*\\*${name} :\\*\\* (.*)$`, 'm'));
      return r ? r[1].trim() : '';
    };
    steps.push({ n: Number(sp[i]), titre: sp[i + 1].trim(),
                 action: field('Action'), verif: field('Vérification'), source: field('Source') });
  }

  const coince = [];
  for (const r of (secs[4] || '').matchAll(/^- \*\*(.+?)\*\*\s*(.*)$/gm)) {
    const label = r[1];
    const etapes = label.startsWith('Étape') ? (label.split('—')[0].match(/\d+/g) || []).map(Number) : [];
    const probleme = label.includes('—') ? label.split('—').slice(1).join('—').trim() : label;
    coince.push({ etapes, probleme, texte: r[2] });
  }

  const s2 = secs[2] || '';
  const quote = s2.split('\n').filter((l) => l.startsWith('>')).map((l) => l.slice(1).trim());
  const risques = quote.filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  for (const l of quote) {
    const r = l.match(/^Risques propres à cette fiche : (.+)$/);
    if (r) risques.push(r[1]);
  }
  const s2Reste = s2.split('\n').filter((l) => !l.startsWith('>')).join('\n').trim();

  const chunk = (secs[5] || '').split(/^### /m).find((c) => c.startsWith('Entre les deux modes\n'));
  const modesTxt = chunk ? chunk.slice('Entre les deux modes\n'.length).trim() : '';

  return { file, num: file.slice(0, 2), id: meta.id, meta, secs, preface, steps, coince,
           risques, s2Reste, modesTxt, body };
}

export function loadCorpus(root = path.resolve(process.cwd(), 'corpus')) {
  const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
  const cfg = yaml.load(read('besoins.yaml'));
  const conf = fs.existsSync(path.join(root, 'civzero.yaml')) ? yaml.load(read('civzero.yaml')) || {} : {};
  const fiches = fs.readdirSync(path.join(root, 'fiches'))
    .filter((f) => f.endsWith('.md')).sort()
    .map((f) => parseFiche(f, read(path.join('fiches', f))));

  // Libellés de danger : définis une seule fois, dans le Nodule Zéro.
  const labels = {};
  const nodule = fiches.find((f) => f.id === 'nodule-zero');
  for (const l of (nodule?.secs[2] || '').split('\n')) {
    const r = l.match(/^>\s*- \*\*(VERT|ORANGE|ROUGE) \(\w+\)\*\* — (.+)$/);
    if (r) labels[r[1].toLowerCase()] = r[2];
  }

  return { fiches, labels, conf, blocs: cfg.blocs, besoins: cfg.besoins,
           niveaux: cfg.niveaux, aVenir: cfg.a_venir || [] };
}
