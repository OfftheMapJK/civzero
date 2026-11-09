# CivZero

Une station de savoirs pratiques hors-ligne pour tenir une coupure et gagner en autonomie avec ce qui existe déjà : réparer, détourner, mailler. L'écologie y est une contrainte de départ, pas un module.

> **Bêta du 09/11/2026.** Les fiches sont au statut **brouillon**, rédigées avec l'assistance d'une IA et non relues. Ne les appliquez pas comme sûres. La démo ouvre les fiches autour de la préparation à une coupure de 72 heures ; les autres sont visibles, grisées, comme « à venir ».

## Ce qu'il y a ici

| Dossier | Contenu |
| --- | --- |
| `corpus/fiches/` | Les 21 fiches, une par fichier Markdown, avec leur en-tête |
| `corpus/besoins.yaml` | Les besoins et blocs qui forment l'entonnoir de navigation |
| `corpus/civzero.yaml` | Réglages : dépôt, adresse des rapports, fiches ouvertes dans la démo |
| `corpus/RELECTURE.md` | Le cahier de relecture : chaque point à valider, fiche par fiche |
| `src/` | Le site Astro : `lib/` lit les fiches et calcule l'entonnoir, `components/` les affiche |
| `outils/build.py` | Contrôle des fiches, index et cahier de relecture |
| `docs/` | Documents d'accompagnement (recrutement des testeurs) |

## Lancer le site

Il faut Node.js 20 ou plus récent.

    npm install
    npm run build      # construit le site dans dist/ et son index de recherche
    npm run preview    # l'ouvre sur http://localhost:4321

Le dossier `dist/` est le site complet : HTML sans JavaScript (sauf la page de recherche), à copier tel quel sur la station.

## Publier en ligne

Le site est publié sur GitHub Pages à chaque envoi sur `main` (`.github/workflows/pages.yml`). À activer une seule fois : *Settings › Pages › Source : GitHub Actions*.

## Tester une fiche

C'est la contribution la plus utile : choisissez une fiche, suivez-la, puis envoyez un rapport depuis le bouton « Faire un rapport ». Le mode d'emploi est dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Contrôler les fiches

    python3 outils/build.py corpus

Demande Python 3 et le module `yaml`. Le script signale les champs ou sections manquants et regénère le cahier de relecture.

## Licences

- **Les fiches et tout le contenu de `corpus/`** : Creative Commons Attribution - Partage dans les mêmes conditions 4.0 (CC BY-SA 4.0). Texte complet dans [LICENSE-CONTENU](LICENSE-CONTENU).
- **Le code** : GNU Affero General Public License v3.0 (AGPL-3.0). Texte complet dans `LICENSE`.
