# Outils libres : pour le travail et pour CivicNode

Liste établie le 12/11/2026 (conversation Chantier). Les licences sont à vérifier avant tout usage, selon `agent/METHODE.md` section 2. Un outil retenu entre au catalogue (`corpus/catalogue.csv`) dans son socle ; ce document n'est pas lu par le site.

## A. Pour automatiser le travail (à installer sur le Mac, utilisés par Claude Code)

- **Sources :** Playwright (**en place depuis le 12/11/2026** dans `npm run sources` : lit les pages construites par JavaScript ; ne passe pas les contrôles anti-robot, comme ceux de la documentation Raspberry Pi ou d'Akvopedia, et on ne les contourne pas) ; Trafilatura (texte principal propre) ; ArchiveBox ou Wayback Machine (capture datée de chaque source) ; API de Wikimedia Commons (**en place depuis le 12/11/2026** : `npm run medias` compare la licence et l'auteur à ceux de la fiche et signale les désaccords, sans rien corriger).
- **Texte et site :** LanguageTool (orthographe FR/EN, hors-ligne) ; Vale (règles de style) ; lychee (liens morts, tâche planifiée) ; axe-core et html-validate (accessibilité) ; REUSE (licence de chaque fichier).
- **Images :** ImageMagick ou sharp (photos sous 600 Ko) ; SVGO (schémas) ; ExifTool (métadonnées, GPS).
- **Garde-fous et publication :** Husky (**en place depuis le 12/11/2026** : `npm test` avant chaque commit, `.husky/pre-commit`) ; GitHub Actions (`npm test` sur les contributions) ; python-libzim ou zimit (fichier ZIM des fiches pour Kiwix).
- **Assistant :** llama.cpp ou Ollama (tester Ministral).
- **Fait :** Playwright, API Commons dans `npm run medias`, Husky.

## B. Ressources à présenter dans CivicNode, par socle

Licences à vérifier avant usage ; un logiciel libre peut avoir une documentation NC (ESPHome) : présenté, jamais adapté.

- **Strate :** Kiwix et collections ZIM ciblées (WikiMed, Wikivoyage, Wikisource) ; Internet-in-a-Box (modèle à étudier) ; Syncthing ; KeePassXC et VeraCrypt/cryptsetup (fiche « Sauvegarder et chiffrer ») ; Calibre ; YunoHost.
- **Mycélium :** Meshtastic (fiches 19-20) ; Briar (prévue) ; Reticulum, Sideband, NomadNet ; Mumble ; OpenWrt, LibreMesh, Freifunk (fiche 38) ; SatDump, SDR++, rtl_433.
- **Ambre :** OpenEnergyMonitor (fiche « Suivre la charge d'une batterie ») ; PVGIS (outil public, pas logiciel libre).
- **Source :** ESPHome, Tasmota (prolongement fiche 39).
- **Graine :** Grocy (inventaire des réserves).
- **Écorce :** WeeWX (fiche « Petite station météo »).
- **Lichen :** iNaturalist (code libre, demande Internet) ; BirdNET-Pi (licence NC à vérifier : référence seulement).
- **Humus :** OpenStreetMap, uMap, GoGoCarto ; QGIS (fiche « Données publiques de son territoire ») ; Decidim.
- **Pollen :** KiCad, FreeCAD ; PrusaSlicer, Cura ; Arduino IDE ; Inkscape, Krita, GIMP, Audacity, Kdenlive, Blender, Scribus, LibreOffice ; Omeka.
- **Spore (sources de savoir) :** Appropedia, Akvopedia, Open Source Ecology (Global Village Construction Set), Precious Plastic. **Licences à vérifier en premier par l'Atelier** : si ouvertes, sources de dizaines de fiches prévues.

## C. En veille (prometteur, pas encore mûr)

- **ArtCraft** (getartcraft.com) : suite créative annoncée open source, plusieurs applications en alpha ; partie IA (Studio) floue sur le local et les tarifs ; portée par une entreprise d'IA (storyteller.ai) ; licence exacte à lire dans les dépôts. Sortie de veille : version stable, licence vérifiée, fonctionnement entièrement hors-ligne.

## Suite décidée

1. L'Atelier vérifie les licences d'Appropedia, d'Akvopedia et d'Open Source Ecology (et Precious Plastic).
2. Ensuite, Claude Code ajoute au catalogue les outils retenus, dans les socles ci-dessus, et la liste « en veille ».

## D. Outils d'agent : tri de la liste du 12/11/2026

Principe : Claude Code fait déjà l'essentiel (fichiers, git, lecture du web, sous-agents, tâches planifiées). On n'ajoute un outil que s'il supprime un geste manuel ou sert la station.

**Retenus pour notre organisation**
- Playwright (et éventuellement Playwright MCP) : lire les pages qui bloquent les robots.
- Docling ou marker : extraire le texte des sources en PDF (guides officiels) ; Tesseract pour les PDF scannés.
- FFmpeg, ImageMagick : médias.
- Context7 : documentation à jour des bibliothèques (Astro, Pagefind) pour le travail sur le site.
- Promptfoo : tester les réponses de l'assistant, en complément de `tests/assistant.test.mjs`.

**Plus tard**
- GitHub MCP et GitHub Actions : quand des contributeurs proposeront des fiches ; accès limité à l'organisation civicnode-eu.
- cron / launchd ou tâches planifiées de Claude : vérification hebdomadaire des liens et des licences.

**Écartés pour l'instant** (Claude Code couvre déjà le besoin, ou trop lourd pour un porteur seul)
- Frameworks d'agents : LangGraph, CrewAI, AutoGen, OpenHands, Aider, Cline, Continue, Roo Code, Goose.
- Automatisation de workflows : n8n (fair-code, pas libre), Activepieces, Windmill, Temporal, Airflow, Prefect, Huginn.
- Bacs à sable : Docker, E2B, Daytona, Firecracker (utiles seulement si on exécute du code inconnu).
- Mémoire d'agent : Mem0, Letta ; la mémoire du projet, c'est le dépôt et `CLAUDE.md`.
- Recherche : SearXNG, Firecrawl, Crawl4AI, Jina Reader, browser-use (doublons de Playwright et de la lecture web).
- Observabilité : Langfuse, Phoenix, OpenTelemetry, Guardrails AI, NeMo Guardrails.
- Obsidian (propriétaire) ; LM Studio (propriétaire).

**Retenus pour la station** (assistant et accessibilité, hors-ligne)
- llama.cpp ou Ollama : faire tourner le modèle de l'assistant.
- Base vectorielle légère (LanceDB, sqlite-vec ou Chroma) avec LlamaIndex : à étudier si la recherche actuelle de l'assistant ne suffit plus.
- Piper : lire les fiches à voix haute, hors-ligne (personnes qui lisent mal, mains occupées).
- Whisper / faster-whisper : poser une question à voix haute à l'assistant, hors-ligne.

## E. Une logithèque hors-ligne sur la station

Axe décidé le 12/11/2026 : la station propose aussi les logiciels libres qu'utilisent les fiches, à télécharger sans Internet. Socle Strate, nouveau savoir à créer (« Une logithèque hors-ligne »).

- **Licence :** seulement des logiciels libres dont on respecte la licence de redistribution (GPL : code source fourni ou lien vers lui).
- **Confiance :** empreinte ou signature officielle publiée pour chaque fichier ; fiche « Vérifier qu'un logiciel téléchargé est authentique » écrite en premier.
- **Plateformes :** Android et Linux d'abord ; iPhone impossible hors App Store, à dire clairement.
- **Fraîcheur :** version et date affichées pour chaque logiciel.
- **Réutiliser l'existant :** dépôt F-Droid recopié sur la station, apt-offline ou miroir Debian partiel, applications Kiwix.
- **Premier lot :** Kiwix, Briar, Meshtastic, SatDump, Arduino IDE, Organic Maps, KeePassXC, LibreOffice.
- **Fiches prévues :** « Installer un logiciel depuis la station », « Vérifier qu'un logiciel téléchargé est authentique », « Recopier F-Droid sur la station ».
