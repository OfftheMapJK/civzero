// Les licences qui permettent d'adapter une source dans le texte d'une fiche (voir agent/METHODE.md
// et le document « Licences Creative Commons : référence CivicNode »). Partagé par le vérificateur et l'agent.
export const LICENCES_ADAPTABLES = /^(domaine public|public domain|cc0( 1\.0)?|cc by( \d\.\d)?|cc by-sa( \d\.\d)?|licence ouverte( 2\.0)?|etalab( 2\.0)?|odbl( 1\.0)?)$/i;
export const USAGES = ['adapte', 'reference'];
export const adaptable = (licence) => LICENCES_ADAPTABLES.test(String(licence || '').trim());
