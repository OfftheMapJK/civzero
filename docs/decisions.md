# Journal des décisions

Le lien entre les conversations de claude.ai (Chantier, Atelier, Relecture, Design) et Claude Code. Toute décision prise ailleurs que dans Claude Code est écrite ici, datée, la plus récente en haut. Claude Code le lit au début de chaque session et applique ce qui le concerne ; il note « fait » et la date quand c'est appliqué.

Format : `- AAAA-MM-JJ — décision. Pour qui. État.`

## 2026-11-12

- **Logithèque hors-ligne** : la station proposera aussi les logiciels libres qu'utilisent les fiches, à télécharger sans Internet. Socle Strate, nouveau savoir « Une logithèque hors-ligne » à créer. Règles et premier lot dans `docs/outils-libres.md`, section E. Pour Claude Code : ajouter le savoir à `corpus/structure.yaml` et les trois fiches prévues (« Installer un logiciel depuis la station », « Vérifier qu'un logiciel téléchargé est authentique », « Recopier F-Droid sur la station ») au catalogue et aux prévues, après accord de Julien. À faire.
- **Outils d'agent** : tri fait dans `docs/outils-libres.md`, section D. Retenus pour le travail : Playwright, Docling ou marker, Tesseract, FFmpeg, ImageMagick, Context7, Promptfoo. Retenus pour la station : llama.cpp, Piper (lecture à voix haute), Whisper (question à voix haute), base vectorielle légère à étudier. Le reste est écarté pour l'instant. Information.
- **Ressources par socle** : `docs/outils-libres.md`, section B. Pour Claude Code : les ajouter au catalogue après le rapport de l'Atelier sur les licences. En attente du rapport.
- **Licences à vérifier par l'Atelier** : Appropedia, Akvopedia, Open Source Ecology, Precious Plastic. Rapport attendu dans `agent/sortie/licences-sources-ouvertes.rapport.md`. Pour Claude Code ensuite : mettre à jour le tableau des licences de `agent/METHODE.md`. En attente.
- **ArtCraft** : en veille (`docs/outils-libres.md`, section C), pas dans Pollen. Information.
- **Outillage** : Playwright dans `npm run sources`, vérification Commons dans `npm run medias` (fait), Husky avant chaque commit. En cours dans Claude Code.
- **Auteurs signalés par la vérification Commons** (SODIS, symbole alimentaire) : on ne change rien, la fiche est plus précise. Plus tard, l'outil pourra accepter ces écritures. Information.
- **Bascule** : le Chantier passe dans Claude Code ; l'Atelier, la Relecture et le Design restent sur claude.ai pour l'instant. GitHub n'est pas connecté à Claude Code. Information.
- **Fiches créées (36 à 40)** : une étape déclarée sans source ne bloque pas la relecture IA ; une fiche créée ne passe jamais en « vérifiée par IA » (écrit dans `agent/RELECTURE.md`). Fait.
