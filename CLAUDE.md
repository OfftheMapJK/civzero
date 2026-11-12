# CivicNode — consignes pour Claude

Lu au début de chaque session. Ce fichier résume les décisions prises ; en cas de doute, les documents cités font foi.

**À chaque session, lis aussi `docs/decisions.md`** : c'est là que les conversations de claude.ai (Chantier, Atelier, Relecture, Design) écrivent ce qu'elles ont décidé. Applique ce qui te concerne après accord de Julien, et note « fait » avec la date. Quand une décision se prend avec toi, écris-la aussi dans ce journal.

## Le projet

CivicNode est une station de savoirs hors-ligne : « une station de savoirs pour les interstices ». Des fiches pratiques (eau, énergie, réseau, soin…), sourcées et vérifiées, servies par un site statique qui marche sans Internet, avec un petit assistant local.

- Dépôt : `civicnode-eu/civicnode` (GitHub). Site : https://civicnode-eu.github.io/civicnode/ (GitHub Pages, construit par GitHub Actions à chaque publication).
- Contact public : hello@civicnode.eu. Domaine civicnode.eu : à relier seulement après son transfert vers Infomaniak.
- Ancien nom : CivZero. Le dossier local s'appelle encore `CivZero` ; ne pas le renommer.

## Avec qui tu travailles

Julien porte le projet seul et n'est pas développeur.
- Réponds en français, court et pragmatique : un panorama avec une recommandation, puis les gestes à faire.
- Explique les commandes Terminal pas à pas, sans jargon.
- Ne demande jamais à voir une clé API, et rappelle de ne jamais en montrer une à l'écran.

## Règles d'or

1. **Tu ne publies jamais.** Pas de `git commit`, pas de `git push` : Julien publie avec GitHub Desktop. Termine par le nombre de fichiers modifiés et un résumé de publication proposé.
2. **Lance `npm test` après chaque changement** (vérificateur du corpus + tests). Rien ne se publie avec une erreur.
3. **Chaque conversation écrit dans son dossier :**
   - « Atelier de rédaction » : seulement `agent/sortie/` ;
   - « Relecture » : seulement `agent/relectures/<id>.yaml` et `<id>.md` ;
   - « Design » : seulement `agent/sortie/design/` ;
   - Claude Code (le Chantier depuis le 12/11/2026) : intégration, site, scripts, tout le reste. C'est lui qui fait entrer une fiche dans `corpus/`.
   - La conversation « Chantier » sur claude.ai garde les décisions de fond et les écrit dans `docs/decisions.md`.
4. **Ne supprime rien sans le dire** ; préfère déplacer (par exemple `corpus/pistes-archivees/`).
5. Le projet pam-project, sur le même ordinateur, est un autre projet : n'y touche pas.

## Organisation

- `corpus/fiches/NN-id.md` : fiches en français ; `corpus/fiches/en/` : leur traduction (même nom, même nombre d'étapes).
- `corpus/structure.yaml` : familles, socles, domaines, savoirs (chaque savoir a un principe FR et EN, sans chiffre non sourcé).
- `corpus/prevues.yaml` et `corpus/catalogue.csv` : fiches prévues ; `corpus/veille.yaml` : outils en veille (lu ni par le site ni par le vérificateur) ; `corpus/civicnode.yaml` : réglages et fiches ouvertes dans la démo.
- `corpus/pistes/` : pistes du socle Spore (famille « Explorer ») ; `corpus/pages/` : pages de texte (dont « Nos sources et notre méthode »).
- `src/` : site Astro 5 (`build.format: 'file'`) ; pages françaises sous `fr/` via `src/pages/fr/[slug].astro` ; `src/lib/` (corpus, modèle, licences, i18n).
- `scripts/verifier.mjs` : le vérificateur ; `tests/` : tests node:test.
- `agent/` : `METHODE.md` (adapter une source), `RELECTURE.md` (relire), scripts, `sources/<id>/sN.txt` (copies des sources), `relectures/`.
- `assistant/` : assistant local (recherche + modèle ; tourne avec llama-server de llama.cpp et Ministral, voir `assistant/LISEZMOI.md`).
- `docs/` : documents de travail (`decisions.md` : journal des décisions, à lire à chaque session ; `outils-libres.md` : outils pour le travail, ressources par socle, liste « en veille », logithèque).

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm test` | vérificateur + tests |
| `npm run dev` / `npm run build` | site en local / construction |
| `npm run integrer` (`-- --essai`) | fait entrer les fiches de `agent/sortie/` dans le corpus (numéro, prévues, catalogue, démo, `origine: adaptee`, médias) |
| `npm run sources` | copie le texte des sources adaptées dans `agent/sources/<id>/` ; une page qui refuse la lecture simple est rouverte avec Playwright ; `-- --essai <adresse>` lit une page sans rien écrire |
| `npm run medias` | télécharge les médias marqués `telecharger` ; compare la licence et l'auteur des médias Commons à ceux de la fiche, signale les désaccords sans rien corriger |
| `npm run relire` | relecture IA par l'API (clé non configurée pour l'instant) |
| `npm run station` | construit la station hors-ligne avec l'assistant |

- Husky lance `npm test` avant chaque commit (`.husky/pre-commit`, qui indique aussi à GitHub Desktop où trouver node) et bloque le commit s'il y a une erreur. Contournement d'urgence, par le Terminal : `git add -A` puis `git commit --no-verify -m "…"`.
- Sur un nouvel ordinateur, après `npm install` : `npx playwright install chromium` (navigateur de Playwright, hors du dépôt).
- Les sites protégés par un contrôle anti-robot (documentation Raspberry Pi, Akvopedia) ne se lisent pas par les scripts, même avec Playwright : passer par leur dépôt source ou par une copie à la main, sans contourner la protection.

## Fiches : origine, statuts, vérification

Principe : nous ne créons pas le savoir, nous le mettons en forme. Fidèle veut dire fidèle au sens, pas mot pour mot.

- `origine: adaptee` (fiches 28 et suivantes, tirées de sources ouvertes) ou `creee` (fiches 00 à 27, ou tout ce qu'aucune source ouverte ne couvre).
- Adaptée : `brouillon` → `verifiee-ia` → `fidele` → `testee` → `reproduite`. Créée : `brouillon` → `testee` → `reproduite`.
- Orange : en plus une relecture `relue` par une personne compétente. Rouge : moratoire jusqu'à deux relectures professionnelles.
- Quatre regards avant publication : rédaction, vérificateur, relecture IA par une autre conversation ou un autre modèle (verdict recalculé, doit être `conforme`, avec les copies des sources), puis confirmation humaine (`type: fidélité`).
- Une fiche jugée `conforme` ne se retouche pas sans nouvelle relecture IA.
- Corrections après relecture : journal dans `agent/relectures/2026-11-11-corrections.md` (une section par vague).
- Détails : `CONTRIBUTING.md` (section 2), `agent/METHODE.md` (section 8), `agent/RELECTURE.md`.

## Licences et médias

- Adaptables : domaine public, CC0, CC BY, CC BY-SA, Licence Ouverte / Etalab, ODbL (`src/lib/licences.mjs`). Jamais NC ni ND : ni adaptées en fiche, ni reprises en média ; seulement citées en référence (`usage: reference`), ou utilisées pour un fait confirmé par une source ouverte (Low-tech Lab, iFixit, ESPHome sont NC). Raison : nos fiches sont en CC BY-SA 4.0.
- Chaque étape cite sa source (`sN`) ; un manque se marque `[À VALIDER : …]` dans la phrase même.
- Médias : réutiliser d'abord un média existant sous licence ouverte (Wikimedia Commons) ; dessiner un SVG seulement s'il n'en existe pas (`relu: false` tant que personne ne l'a relu). Légende FR et EN, auteur, licence, fichier dans `public/medias/<id>/`, 600 Ko au plus.

## Où en est le projet

- 41 fiches écrites, toutes traduites ; 118 prévues ; 47 savoirs ; 2 pistes Spore.
- Fiches eau 28 à 35 : `verifiee-ia`, confirmation humaine à faire.
- Fiches techno 36 à 40 (Raspberry Pi, solaire, Wi-Fi maillé OpenWrt, cuve ESP32, satellites Meteor-M) : créées, relecture IA conforme sur leurs parties sourcées, en brouillon jusqu'à un essai sur matériel réel. La 37 (orange) attend aussi un électricien.
- Plus tard : 3e piste Spore ; contact avec Kiwix (collaborer, pas dupliquer) ; logo de la conversation Design ; domaine civicnode.eu ; paquet station sur clé USB.
