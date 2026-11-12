---
id: monter-station-civicnode-raspberry-pi
titre: Monter sa station CivicNode sur un Raspberry Pi
accroche: "Elle explique comment installer le système sur un Raspberry Pi sans écran ni clavier, puis y servir les fiches CivicNode et Wikipédia hors-ligne."
socle: strate
savoirs: [monter-station]
horizon: hours
temps: "une demi-journée, plus le téléchargement de Wikipédia"
vague: 2
milieu: [urbain, rural]
tier: [1]
exige_avance: "un Raspberry Pi avec Wi-Fi ou Ethernet, son alimentation officielle, une carte microSD, un ordinateur avec lecteur de carte, un accès Internet pendant l'installation"
origine_materiel: neuf
variantes:
  - id: alimentation-officielle
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "carte électronique"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "alimentation solaire (fiche Alimenter un Raspberry Pi au solaire toute l'année)"
prerequis: [nodule-zero, energie-lire-etiquette]
provenance:
  - id: s1
    titre: "Getting started (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/getting-started.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Remote access (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/remote-access.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Raspberry Pi hardware, Power supply (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s4
    titre: "Configuration (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/configuration.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s5
    titre: "kiwix-serve (documentation de kiwix-tools)"
    auteur: "kiwix-team"
    source: "https://kiwix-tools.readthedocs.io/en/latest/kiwix-serve.html"
    licence: "non indiquée (© 2024 kiwix-team)"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
attestations: []
medias:
  - fichier: raspberry-pi-4-dessus.jpg
    type: image
    etape: 5
    legende:
      fr: "Un Raspberry Pi 4 vu de dessus. Le port d'alimentation USB-C est sur le grand côté, près des deux ports micro-HDMI ; la carte microSD se glisse dessous, sur le petit côté opposé aux ports USB."
      en: "A Raspberry Pi 4 seen from above. The USB-C power port is on the long side, next to the two micro-HDMI ports; the microSD card slides in underneath, on the short side opposite the USB ports."
    titre: "Raspberry Pi 4 Model B - Top"
    auteur: "Laserlicht"
    source: "https://commons.wikimedia.org/wiki/File:Raspberry_Pi_4_Model_B_-_Top.jpg"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/Raspberry_Pi_4_Model_B_-_Top.jpg?width=1200"
maj: 2026-11-12
---

# Monter sa station CivicNode sur un Raspberry Pi

Un Raspberry Pi consomme peu, tient dans la main et suffit à servir les fiches CivicNode et Wikipédia à toute une maison. Cette fiche reprend la fiche *Monter sa station CivicNode sur un mini-PC de récupération* pour ce matériel. L'assistant n'est pas traité ici.

## 1. Principe

La station fonctionne « sans tête » : ni écran ni clavier, on la pilote depuis un autre ordinateur par le réseau. On prépare d'abord la carte microSD sur son ordinateur, avec l'outil Raspberry Pi Imager, qui installe le système et règle d'avance le nom de la machine, le compte, le Wi-Fi et l'accès à distance. On installe ensuite deux services : Kiwix pour Wikipédia, et un petit serveur web pour les fiches, qui sont de simples pages HTML. Tout se fait pendant qu'on a Internet ; ensuite, plus rien n'en dépend.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Alimentation par le bloc secteur officiel, fermé : on ne l'ouvre pas (moratoire rouge).
> - Un Raspberry Pi nu posé sur une surface métallique peut se mettre en court-circuit : le placer dans un boîtier ou sur un support isolant.
> - En écrivant la carte, vérifier deux fois le support choisi : se tromper efface un autre disque de l'ordinateur.
> - Couper le courant sans arrêter le système peut corrompre la carte : toujours éteindre par la commande d'arrêt.

## 3. Pas-à-pas

Les commandes des étapes 7 à 10 sont indicatives. [À VALIDER : commandes exactes sur une machine réelle]

### Étape 1 : Réunir l'alimentation et la carte

- **Action :** prendre l'alimentation officielle prévue pour son modèle : 5 V et 3 A pour un Raspberry Pi 4, 5 V et 5 A pour un Raspberry Pi 5, 5 V et 2,5 A pour un Raspberry Pi 3 ou un Zero. Prendre une carte microSD d'au moins 8 Go pour le système seul ; il en faut bien davantage pour Wikipédia.
- **Vérification :** l'étiquette de l'alimentation porte la tension et le courant demandés par le modèle (fiche *Lire une étiquette*).
- **Source :** s1 [À VALIDER : capacité de carte nécessaire pour Wikipédia en français, aucune source lue]

### Étape 2 : Installer Raspberry Pi Imager sur son ordinateur

- **Action :** télécharger Raspberry Pi Imager sur le site de Raspberry Pi et l'installer (Windows, Mac ou Linux), puis le lancer.
- **Vérification :** la fenêtre de Raspberry Pi Imager s'ouvre.
- **Source :** s1

### Étape 3 : Choisir le modèle, le système et la carte

- **Action :** dans Imager, choisir son modèle de Raspberry Pi, puis le système Raspberry Pi OS Lite (sans bureau, recommandé pour une machine sans écran). Insérer la carte microSD dans l'ordinateur et la choisir comme support. Laisser cochée l'option qui exclut les disques système.
- **Vérification :** le support affiché a la taille de la carte microSD, pas celle du disque de l'ordinateur.
- **Source :** s1

### Étape 4 : Régler la machine avant l'écriture

- **Action :** dans l'onglet de personnalisation, donner un nom à la machine (par exemple `civicnode`, lettres, chiffres et tirets seulement), choisir sa capitale (elle règle le fuseau horaire, le clavier et le domaine Wi-Fi), créer un nom d'utilisateur en minuscules et un mot de passe, saisir le nom et le mot de passe du réseau Wi-Fi de la maison, puis activer SSH avec authentification par mot de passe.
- **Vérification :** le nom de la machine, le compte et le mot de passe sont notés sur papier.
- **Source :** s1

### Étape 5 : Écrire la carte et démarrer

- **Action :** lancer l'écriture et attendre la fin. Glisser la carte dans la fente du Raspberry Pi, étiquette tournée à l'opposé de la carte électronique. Brancher l'alimentation en dernier, sur le port marqué POWER IN ou PWR : le Raspberry Pi démarre dès qu'il est alimenté.
- **Vérification :** le voyant d'alimentation ou d'état s'allume.
- **Source :** s1 [À VALIDER : libellé du bouton d'écriture, non lu dans la source]

### Étape 6 : Se connecter depuis son ordinateur

- **Action :** sur l'ordinateur, relié au même réseau, ouvrir un terminal et taper `ssh <utilisateur>@civicnode.local` en remplaçant par son nom d'utilisateur. À la première connexion, répondre `yes` à l'avertissement de sécurité, puis saisir le mot de passe.
- **Vérification :** l'invite `<utilisateur>@civicnode` s'affiche : les commandes s'exécutent désormais sur le Raspberry Pi.
- **Source :** s2 (commande `ssh`) et s1 (nom `<hostname>.local`)

### Étape 7 : Installer Kiwix et télécharger Wikipédia

- **Action :** installer les outils Kiwix (`sudo apt update`, puis `sudo apt install kiwix-tools`). Créer un dossier `zim` et y télécharger un fichier `.zim` de Wikipédia en français depuis la bibliothèque Kiwix ; la version sans images est bien plus légère.
- **Vérification :** le fichier `.zim` est dans le dossier et sa taille correspond à celle annoncée par la bibliothèque.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 8 : Servir Wikipédia

- **Action :** lancer `kiwix-serve --port=8080 zim` : donné un dossier, le serveur sert tous les fichiers `.zim` qu'il contient.
- **Vérification :** sur l'ordinateur, l'adresse `http://civicnode.local:8080` affiche l'accueil de Kiwix.
- **Source :** aucune source ouverte (étape créée, à tester ; les options viennent de s5, en référence)

### Étape 9 : Copier et servir les fiches CivicNode

- **Action :** depuis l'ordinateur, copier le dossier du site sur le Raspberry Pi avec `scp -r dist/ <utilisateur>@civicnode.local:`. Sur le Raspberry Pi, installer un serveur web léger (`sudo apt install darkhttpd`) et le lancer sur ce dossier : `darkhttpd dist --port 8000`.
- **Vérification :** l'adresse `http://civicnode.local:8000` affiche l'accueil de CivicNode.
- **Source :** s2 (copie d'un dossier avec `scp -r`) ; le serveur web : aucune source ouverte (étape créée, à tester)

### Étape 10 : Lancer les deux services au démarrage

- **Action :** créer un service systemd pour chacune des deux commandes, afin qu'elles démarrent avec la machine. [À VALIDER : fichiers de service à écrire et à tester]
- **Vérification :** après `sudo reboot`, les deux adresses répondent sans aucune commande.
- **Source :** s1 (commande `sudo reboot`) ; les services : aucune source ouverte (étape créée, à tester)

### Étape 11 : Tester depuis un téléphone

- **Action :** relier un téléphone au même réseau et ouvrir les deux adresses dans son navigateur.
- **Vérification :** les fiches et Wikipédia s'affichent sur le téléphone.
- **Source :** s1 (le nom `<hostname>.local` est annoncé sur le réseau) [À VALIDER : certains téléphones ne résolvent pas les noms en `.local` ; prévoir l'adresse IP]

### Étape 12 : Éteindre proprement, noter la date

- **Action :** avant de débrancher, toujours taper `sudo poweroff` et attendre l'extinction. Noter la date de la version du corpus et de Wikipédia sur la station.
- **Vérification :** le voyant d'activité ne clignote plus quand on débranche.
- **Source :** s1 [À VALIDER : comportement des voyants à l'arrêt selon le modèle]

## 4. Si ça coince

- **Étape 5 — rien ne s'allume.** Vérifiez l'alimentation avec la fiche *Lire une étiquette* et le port utilisé : sur un Raspberry Pi Zero, un seul des deux ports micro-USB sert à l'alimentation.
- **Étape 6 — `civicnode.local` est introuvable.** Attendez quelques minutes au premier démarrage, vérifiez que l'ordinateur est sur le même réseau, puis cherchez l'adresse IP du Raspberry Pi dans la liste des appareils de la box et utilisez-la à la place du nom.
- **Étape 6 — la connexion expire.** L'adresse est sans doute fausse, ou le Wi-Fi saisi à l'étape 4 est erroné : réécrivez la carte en vérifiant le nom et le mot de passe du réseau.
- **Étape 7 — la carte est trop petite.** Prenez la version de Wikipédia sans images ou une sélection thématique, ou une carte plus grande.
- **La station redémarre seule ou la carte se corrompt.** Une tension trop basse en est souvent la cause : changez d'alimentation et de câble. Si la station doit subir des coupures, activez le système de fichiers en lecture seule (`sudo raspi-config`, options de performance, *Overlay File System*) une fois l'installation terminée.

## 5. Ressource

### Ce que disent les sources

La documentation de Raspberry Pi recommande Raspberry Pi Imager et le système Raspberry Pi OS Lite pour une machine sans écran, et donne l'alimentation recommandée pour chaque modèle (source s1). Elle décrit la connexion par SSH et la copie de dossiers (source s2), signale qu'une alimentation de mauvaise qualité peut corrompre le stockage (source s3) et décrit le système de fichiers en lecture seule (source s4).

Les étapes 7 à 10 (Kiwix, serveur web, démarrage automatique) ne s'appuient sur aucune source ouverte : elles reprennent la fiche du mini-PC et restent à tester sur une machine réelle.

### Pour aller plus loin

- Fiche *Point d'accès Wi-Fi local*, pour que la station crée son propre réseau.
- Fiche *Alimenter un Raspberry Pi au solaire toute l'année*.
- Documentation de kiwix-serve (source s5) et bibliothèque Kiwix : https://library.kiwix.org
