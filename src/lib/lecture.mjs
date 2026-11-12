// Prépare le texte lu à voix haute par le bouton « Écouter » d'une fiche (synthèse vocale du navigateur).
// Tout se décide ici, à la construction du site : le navigateur ne fait que lire la liste de phrases qu'on lui donne.
// On lit le titre, la sécurité, le principe et les étapes. On ne lit pas : les crochets [À VALIDER : …] (en anglais
// [TO CHECK: …]), les lignes « Source » et les renvois « (source s1) », les blocs de code, les adresses web.

// Un morceau de code dans une phrase : un mot ou un nom court (`yes`, `.zim`) se lit ; une commande est remplacée
// par quelques mots.
const MOT_SIMPLE = /^[\p{L}\p{N}._-]{1,14}$/u;

export function texteALire(texte, commande = '') {
  return String(texte || '')
    .replace(/```[\s\S]*?```/g, ' ')                                        // blocs de code
    .replace(/\[(?:À VALIDER|TO CHECK)[^\]]*\]/g, ' ')                      // crochets à valider
    .replace(/^.*\*\*Source ?:\*\*.*$/gm, ' ')                              // lignes « Source »
    .replace(/\((?:sources? )?s\d+(?:\s*(?:,|;|et|and)\s*s\d+)*\)/gi, ' ')  // renvois (source s1), (s1 et s2)
    .replace(/`([^`]*)`/g, (x, code) => (MOT_SIMPLE.test(code.trim()) ? code.trim() : ` ${commande} `))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                                  // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')                                // liens : on garde leur texte
    .replace(/https?:\/\/\S+/g, ' ')                                        // adresses web
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, ' ')                           // ligne de séparation d'un tableau
    .replace(/\|/g, ', ')
    .replace(/^\s*#{1,6} /gm, '')                                           // titres
    .replace(/^\s*>\s?/gm, '')                                              // citations
    .replace(/^\s*(?:[-*]|\d+\.) /gm, '')                                   // puces
    .replace(/\*+/g, '')                                                    // gras, italique
    .replace(/[ \t]+/g, ' ')
    .replace(/ +([,.])(?=\s|$)/gm, '$1')                                    // pas d'espace avant une virgule ou un point
    .replace(/\( *\)/g, ' ')
    .replace(/\( +/g, '(').replace(/ +\)/g, ')')
    .replace(/[,;:] *(?=[.;!?])/g, '')                                      // ponctuation restée seule après un retrait
    .replace(/[ ,;]+$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

const fin = (x) => (/[.!?…:]$/.test(x) ? x : `${x}.`);
// Le deux-points prend une espace avant lui en français, pas en anglais.
const deuxPoints = (t) => (t.lang === 'fr' ? ' : ' : ': ');

// Découpe en phrases courtes : certains navigateurs coupent une lecture trop longue.
export function enPhrases(texte, commande = '') {
  return String(texte || '').split(/\n+/)
    .flatMap((ligne) => texteALire(ligne, commande).split(/(?<=[.!?…])\s+/))
    .map((x) => x.trim())
    .filter((x) => /[\p{L}\p{N}]/u.test(x))
    .map((x) => fin(x.charAt(0).toUpperCase() + x.slice(1)));
}


// Une étape : son rang, son titre, l'action, la vérification. Jamais la ligne « Source ».
export function lectureEtape(etape, rang, total, t) {
  const c = t.lire.commande;
  return [
    fin(`${t.lire.etape(rang, total)}${deuxPoints(t)}${texteALire(etape.titre, c)}`),
    ...enPhrases(etape.action, c),
    ...(etape.verif ? enPhrases(`${t.verif}${deuxPoints(t)}${etape.verif}`, c) : []),
  ];
}

// La fiche entière, dans l'ordre de la page : titre, sécurité, principe, étapes.
// danger : { mot, label } quand la fiche a un niveau de danger, sinon null (Nodule Zéro).
export function lectureFiche(f, t, danger = null) {
  const c = t.lire.commande;
  const securite = danger
    ? [fin(`${t.nivDanger}${deuxPoints(t)}${danger.mot.toLowerCase()}`), ...enPhrases(danger.label, c),
       ...f.risques.flatMap((r) => enPhrases(r, c)), ...enPhrases(f.s2Reste, c)]
    : enPhrases(f.secs[2], c);
  return [
    fin(texteALire(f.meta.titre, c)),
    ...(securite.length ? [fin(t.lire.securite), ...securite] : []),
    fin(t.principe), ...enPhrases(f.secs[1], c),
    ...enPhrases(f.preface, c),
    ...f.steps.flatMap((s, i) => lectureEtape(s, i + 1, f.steps.length, t)),
  ];
}
