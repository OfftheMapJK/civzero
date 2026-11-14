# Feuille de route du 13/11/2026 : construire tout le projet et le tester sur un Raspberry Pi

*Décidé par Julien le 13/11/2026 au soir ; recopié du Project le 14/11/2026.* Objectif : construire le projet entier (structure du contenu, design de la plateforme page par page, logithèque, Kiwix, cartes, assistant entraîné) et le tester sur un Raspberry Pi, sur secteur puis sur batterie 12 V. **Les relectures humaines sont mises à part pour le moment** : elles reprendront après le test.

**Principe :** la station fonctionne entièrement hors-ligne, avec tout son contenu et son assistant ; Internet ne sert qu'à la préparer et à la mettre à jour.

## Étape 0. Remettre les outils en place (au retour du Mac)

- Recopier les décisions du 13 et du 14/11 dans `docs/decisions.md`, et les documents du Project dans `docs/`. Fait le 14/11/2026 par la conversation Chantier.
- Relier GitHub (branche `notes`, accès limité à civicnode-eu/civicnode) : les décisions prises depuis le téléphone arrivent au dépôt même Mac éteint. À faire.

## Étape 1. Commander le matériel du Pi (tout de suite : le délai de livraison court pendant le reste)

- Raspberry Pi 5, 16 Go de mémoire conseillés pour l'assistant (8 Go au minimum) ; un SSD NVMe de 512 Go avec sa carte M.2 (voir « Poids de la station ») ; l'alimentation officielle ; un boîtier ventilé ; une carte microSD de secours.
- Pour l'étape 7 bis : batterie 12 V (LiFePO4 de préférence), convertisseur 12 V vers 5 V USB-C capable de 5 A, fusible près de la batterie ; plus tard panneau solaire et régulateur ; un wattmètre USB pour mesurer.
- Modèles, prix et disponibilité à vérifier au moment de commander.

## Étape 2. L'architecture de la station (Claude Code)

- Fixer ce que contient la station : système (Raspberry Pi OS Lite 64 bits), point d'accès Wi-Fi et page d'accueil à la connexion, site CivicNode, Kiwix (kiwix-serve et ses fichiers ZIM), logithèque (fichiers et sommes de contrôle), cartes hors-ligne, assistant (llama.cpp), bouton « Écouter ».
- **Deux usages, à rendre clairs dans la page d'accueil :**
  - **consulter sur place**, dans le navigateur, sans rien installer : site, Kiwix, carte, assistant. Seuls les moteurs sont installés sur le Pi (point d'accès, serveur web, kiwix-serve, llama.cpp) ;
  - **emporter** : la logithèque contient des fichiers d'installation, pas des logiciels installés sur le Pi (.apk Android, .dmg Mac, .exe/.msi Windows, AppImage Linux), avec leurs sommes de contrôle ; de même pour les cartes (sa région à télécharger sur le téléphone) et des sélections Kiwix.
- **Limite iPhone :** il n'installe rien depuis la station ; pour lui tout passe par le navigateur. Inviter à installer Kiwix et Organic Maps (ou OsmAnd) depuis un magasin d'applications tant qu'on a Internet. Sur Android, autoriser les sources inconnues : petite fiche à prévoir.
- **Le Wi-Fi de la station :** le Pi crée son propre réseau (« CivicNode », nom à choisir), sans accès à Internet, avec une page d'accueil qui s'ouvre à la connexion. Portée d'une box (une maison, une salle) ; environ une dizaine d'appareils avec la puce intégrée, à mesurer. Pour aller plus loin : clé Wi-Fi USB ou antenne, petit routeur OpenWrt, Wi-Fi maillé (fiche 38). À trancher : réseau ouvert (proposé : rien de privé, pas d'Internet) ou mot de passe sur la boîte.
- **Cartes :** sa région et son pays en détail (Bretagne, France), une carte du monde légère, le reste selon la place ; choisi avec la couche territoriale dans les réglages. Tester quelle application importe le plus simplement un fichier de carte (OsmAnd paraît plus simple qu'Organic Maps) ; fiche à prévoir « Emporter la carte de sa région sur son téléphone ».
- Un budget de disque et de mémoire, élément par élément (premier ordre de grandeur ci-dessous).
- Un script d'installation reproductible : une commande sur un Pi neuf, puis une image disque à copier.

### Trois versions de la station, en modules (décidé le 13/11/2026)

- **Principe :** les fiches se suffisent à elles-mêmes (étapes, niveaux, précautions, « Si ça coince »), et l'assistant ne lit que les fiches. Une station sans Kiwix fait donc la même chose que la station complète : mêmes fiches, mêmes savoirs, même assistant, mêmes réponses. **Kiwix et Wikipédia sont une ressource complémentaire** (« Wikipédia dit ce que sont les choses, CivicNode apprend à les faire ») : un module « bibliothèque », ajouté si la place le permet.

| Version | Contenu | Poids | Matériel |
| --- | --- | --- | --- |
| **Poche** | les fiches seules (dans l'application Kiwix, ou le site) | environ 1 Go | un téléphone, un vieux portable |
| **Légère** | fiches, assistant, carte de sa région, logithèque essentielle | 15 à 25 Go | un Pi avec une carte de 32 ou 64 Go |
| **Complète** | tout, plus la bibliothèque Kiwix (Wikipédia, WikiMed…) et la carte de la France | 150 à 250 Go | un Pi avec un SSD |

- **Sources jointes aux fiches, dans toutes les versions :** hors-ligne, les liens web des sources ne marchent pas. La station embarque les copies texte des sources déjà faites pour la relecture (`agent/sources/`, licences adaptables seulement) : on peut vérifier une fiche sans Internet, même en version légère. Poids négligeable.
- **Liens « pour comprendre » vers Wikipédia :** dans la version légère, affichés « disponible sur une station complète ou en ligne », jamais comme un lien cassé.
- **Entrée enfants et futurs cours :** écrits par nous à partir de sources adaptées, donc présents dans toutes les versions.
- **Identité :** CivicNode n'est pas une boîte à Wikipédia (Internet-in-a-Box le fait déjà) ; c'est une station de savoirs pratiques qui peut accueillir Wikipédia en plus. La version légère, moins chère et plus sobre, est la plus facile à diffuser.
- Le script d'installation demande la version voulue ; deux images disque à terme (légère, complète).

### Poids de la station complète (ordre de grandeur du 13/11/2026, à vérifier sur la bibliothèque Kiwix et les sites de cartes)

| Élément | Poids |
| --- | --- |
| Système et moteurs | 4 à 6 Go |
| Site CivicNode, fiches, médias et copies des sources | moins de 1 Go |
| Assistant (deux modèles gardés, dont le nôtre) | 3 à 6 Go |
| Logithèque (une vingtaine de logiciels, quatre systèmes) | 5 à 10 Go |
| Cartes France détaillée et monde léger (navigateur et à emporter) | 10 à 20 Go |
| Kiwix, version sobre (sélections Wikipédia, WikiMed, Wikivoyage, Vikidia) | 15 à 30 Go |
| Kiwix, version complète (Wikipédia FR avec images, EN sans images, Wiktionnaire) | 100 à 150 Go |

Choix proposé pour le pilote : SSD de 512 Go, pour tester la version complète avec de la marge, puis la version légère sur une carte de 64 Go.

## Étape 3. La structure complète du contenu

- Le gabarit de chaque sorte de page, même encore vide : socle, domaine, savoir, fiche, piste, activité des enfants, expérience et cours (prévus), logithèque, carte et territoire, assistant, « Nos sources et notre méthode », à propos (statement), page d'accueil du Wi-Fi.
- Les 11 socles et l'entrée enfants dans `corpus/structure.yaml` ; une première couche territoriale (France, puis Morbihan et Crac'h).
- Les 41 fiches en place, les fiches prévues en pointillés. L'Atelier continue en parallèle : d'abord le pilote enfants (4 + 4 activités), puis les vagues de `docs/commande-atelier.md`.

## Étape 4. Le design de la plateforme, page par page (conversation Design, puis Claude Code intègre)

- D'abord figer le logo (test de lecture auprès de cinq personnes) et la baseline.
- Ordre proposé : page d'accueil du Wi-Fi et accueil, fiche (la plus importante), savoir, socle, assistant, logithèque, entrée Kiwix, carte, enfants, piste, « Nos sources et notre méthode », à propos.
- Contraintes : petit écran et vieux téléphone, hors-ligne, JavaScript seulement pour la recherche, polices libres embarquées, mode sombre, danger jamais signalé par la couleur seule. Les pages doivent fonctionner dans les trois versions (lien Wikipédia absent dans la version légère).
- Peut commencer dès que l'étape 3 a fixé la liste des pages.

## Étape 5. Les contenus embarqués : logithèque, Kiwix, cartes

- **Logithèque :** la liste retenue (Kiwix, Briar, Meshtastic, Organic Maps, OsmAnd, KeePassXC, LibreOffice…), avec les versions Android, Windows, Mac et Linux, la licence, les sommes de contrôle et les signatures ; un script de téléchargement et de mise à jour. Une sélection « essentielle » pour la version légère.
- **Kiwix :** choix des fichiers ZIM selon la place (sélections Wikipédia FR et EN, WikiMed, Wikivoyage, Vikidia, Wiktionnaire) ; les fiches CivicNode elles-mêmes au format ZIM. C'est la version « poche » : dans l'application Kiwix, toutes les fiches hors-ligne avec la recherche, sur Android comme sur iPhone, sans IA.
- **Cartes :** OpenStreetMap de la région (Bretagne) et de la France, à emporter et consultable dans le navigateur.

## Étape 6. L'assistant : tests, puis notre modèle entraîné

- **6a. Tests sur le Mac** avec `assistant/mesurer.mjs` : Ministral 3 3B (référence) contre Pleias-RAG-1B, SmolLM3-3B, Lucie et les autres, selon le plan de tests de `docs/modeles-donnees-ouvertes.md`.
- **6b. Les mêmes tests sur le Pi** : vitesse de réponse, mémoire et consommation. C'est le Pi qui décide de la taille réaliste du modèle.
- **6c. Préparer les données d'affinage** à partir des fiches et du standard de réponse (questions types et bonnes réponses).
- **6d. Affiner sur le Mac mini avec MLX**, comparer au modèle de base, publier toute la lignée.
- Le test de la station peut commencer avec le meilleur modèle de base ; le modèle entraîné le remplace quand il est prêt.

## Étape 7. Le grand test sur le Pi (sur secteur)

- Installation depuis zéro avec le script, puis Internet débranché pour de bon. Version complète d'abord, puis version légère.
- Plusieurs téléphones et ordinateurs connectés en même temps. Parcours : page d'accueil du Wi-Fi, une fiche, ses sources, « Écouter », une question à l'assistant, un article Kiwix, une carte, un logiciel téléchargé et vérifié, une carte emportée sur le téléphone.
- Mesures : temps de démarrage, vitesse de l'assistant, nombre d'appareils, portée du Wi-Fi, consommation électrique, chaleur.
- Liste des défauts, corrections, puis image disque version 0.1.

## Étape 7 bis. Le test sur batterie 12 V (décidé le 13/11/2026)

- Montage : batterie 12 V (LiFePO4 de préférence), fusible près de la batterie, convertisseur 12 V vers 5 V USB-C capable de 5 A (sinon le Pi limite ses ports USB ; à vérifier avec le SSD), puis panneau solaire et régulateur. Tout en basse tension, dans le cadre du moratoire.
- Mesurer la consommation réelle sur plusieurs jours (au repos, en usage, pendant que l'assistant rédige). Ordre de grandeur attendu, à confirmer : quelques watts au repos, une dizaine quand l'assistant rédige, de l'ordre de 100 à 150 Wh par jour allumée en continu ; une LiFePO4 de 100 Ah (environ 1 200 Wh) tiendrait une petite semaine sans soleil.
- Dimensionner le panneau avec PVGIS pour Crac'h, en hiver (la saison la plus faible).
- Économies à essayer : modèle de l'assistant chargé seulement à la demande, veille ou arrêt la nuit à heure fixe, puissance du Wi-Fi au juste nécessaire.
- La station applique ses propres fiches (batterie 12 V, solaire, bilan papier, savoir « Alimenter la station ») : le montage et les mesures deviennent la fiche « Alimenter la station en 12 V et au soleil ».

## Piste, après le test : l'assistant de poche (notée le 13/11/2026)

- **L'idée :** l'assistant CivicNode sur le téléphone, hors-ligne, loin de la station.
- **Faisable techniquement :** des applications libres comme PocketPal (construite sur llama.cpp) font déjà tourner un petit modèle sur un téléphone récent ; un modèle d'environ un milliard de paramètres (Pleias-RAG-1B, ou notre modèle affiné) pèse environ 1 Go.
- **Mais l'assistant n'est pas qu'un modèle :** c'est le modèle, plus la recherche dans les fiches, plus nos règles (ne parler qu'à partir des fiches, citer niveaux et précautions mot pour mot, garde-fou contre les chiffres inventés). Un modèle seul dans une application de discussion répondrait de mémoire et inventerait : exclu.
- **Forme envisagée :** une application CivicNode, ou une version de la station dans le navigateur du téléphone, qui embarque les fiches, notre modèle affiné et les mêmes règles.
- **Limites :** mémoire insuffisante sur les vieux téléphones ; batterie et chaleur.
- **Quand :** après le grand test, une fois notre modèle choisi et entraîné. En attendant, la version « poche », c'est Kiwix avec les fiches au format ZIM, plus la carte de sa région (étape 5).

## Ensuite, à part

Relectures humaines des fiches (fidélité 28 à 35, essais, électricien pour la 37), statement final, dépôt de la marque, domaine civicnode.eu, pilote à Auray et Crac'h, contact avec Kiwix et les organisations de `docs/audit-sources.md`.

## Qui fait quoi, en parallèle

- **Julien :** le matériel du Pi et de la batterie, le test de lecture du logo, les arbitrages.
- **Claude Code :** étapes 2, 3, 5, 6, 7 et 7 bis.
- **Design :** étape 4.
- **Atelier :** le pilote enfants, puis les vagues de fiches.
- **Chantier (claude.ai) :** le fond, le statement, la coordination.
