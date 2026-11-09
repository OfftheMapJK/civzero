# CivZero

Une station de savoirs pratiques hors-ligne pour tenir une coupure et gagner en autonomie avec ce qui existe déjà : réparer, détourner, mailler. L'écologie y est une contrainte de départ, pas un module.

> **Bêta du 09/11/2026.** Les 21 fiches sont au statut **brouillon**, rédigées avec l'assistance d'une IA et non relues. Ne les appliquez pas comme sûres. Les fiches qui touchent une batterie attendent la relecture d'un professionnel.

## Ce qu'il y a ici

| Dossier | Contenu |
| --- | --- |
| `corpus/fiches/` | Les fiches, une par fichier Markdown, avec leur en-tête |
| `corpus/besoins.yaml` | Les besoins et blocs qui forment l'entonnoir de navigation |
| `corpus/RELECTURE.md` | Le cahier de relecture : chaque point à valider, fiche par fiche |
| `site/` | Le site généré : HTML sans JavaScript ni ressource externe |
| `outils/` | Les scripts de contrôle et de génération |
| `docs/` | Documents d'accompagnement (recrutement des testeurs) |

## Lire les fiches

Ouvrez `site/index.html` dans un navigateur. Le site fonctionne sans Internet et sans serveur, et peut être copié tel quel sur une station, une clé ou un téléphone.

## Tester une fiche

C'est la contribution la plus utile. Choisissez une fiche, suivez-la, puis envoyez un rapport : réussite, échec ou blocage, tout compte. Le mode d'emploi est dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Regénérer le site

    python3 outils/build.py corpus      # contrôle des fiches, index, cahier de relecture
    python3 outils/site.py corpus site  # regénère le site

Les scripts demandent Python 3 et les modules `yaml` et `markdown`. Les réglages du projet (dépôt, adresse des rapports) sont dans `corpus/civzero.yaml`.

## Licences

- **Les fiches et tout le contenu de `corpus/`** : Creative Commons Attribution - Partage dans les mêmes conditions 4.0 (CC BY-SA 4.0). Texte complet dans [LICENSE-CONTENU](LICENSE-CONTENU).
- **Le code de `outils/`** : GNU Affero General Public License v3.0 (AGPL-3.0). Texte complet dans `LICENSE`.
