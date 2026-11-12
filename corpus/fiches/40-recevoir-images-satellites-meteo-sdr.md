---
id: recevoir-images-satellites-meteo-sdr
titre: Recevoir les images des satellites météo avec une clé SDR
accroche: "Elle explique comment capter, avec une clé radio USB et une antenne à deux brins, les images que les satellites Meteor-M diffusent librement en passant au-dessus de soi."
socle: mycelium
savoirs: [recevoir-information]
horizon: hours
temps: "une demi-journée de préparation, puis un quart d'heure par passage"
vague: 3
milieu: [urbain, rural]
tier: [1]
exige_avance: "une clé SDR USB (type RTL-SDR), une antenne dipôle à deux brins réglables et son câble, un ordinateur avec le logiciel SatDump, les heures de passage notées tant qu'on a Internet"
origine_materiel: neuf
variantes:
  - id: reception-seule-meteor-lrpt
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "électronique"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "voir les nuages et les dépressions arriver sans dépendre d'Internet"
prerequis: [nodule-zero]
provenance:
  - id: s1
    titre: "Low-rate picture transmission"
    auteur: "Contributeurs de Wikipédia"
    source: "https://en.wikipedia.org/wiki/Low-rate_picture_transmission"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Meteor-M No.2-3"
    auteur: "Contributeurs de Wikipédia"
    source: "https://en.wikipedia.org/wiki/Meteor-M_No.2-3"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Meteor-M No.2-4"
    auteur: "Contributeurs de Wikipédia"
    source: "https://en.wikipedia.org/wiki/Meteor-M_No.2-4"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s4
    titre: "Basic usage (SatDump)"
    auteur: "zbychu (SatDump), billet du 22/09/2022"
    source: "https://satdump.org/posts/basic-usage"
    licence: "CC BY 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s5
    titre: "Satellite list (SatDump)"
    auteur: "SatDump, liste tenue par Meti"
    source: "https://www.satdump.org/Satellite-List/"
    licence: "non indiquée sur la page"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
  - id: s6
    titre: "SatDump (dépôt GitHub, README)"
    auteur: "SatDump"
    source: "https://github.com/SatDump/SatDump"
    licence: "GPL-3.0"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
  - id: s7
    titre: "Satellite: Meteor-M N2-3 (OSCAR)"
    auteur: "Organisation météorologique mondiale"
    source: "https://space.oscar.wmo.int/satellites/view/meteor_m_n2_3"
    licence: "tous droits réservés (© OMM)"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
attestations: []
medias:
  - fichier: image-meteor-lrpt.jpg
    type: image
    legende:
      fr: "Ce que l'on obtient : une image du satellite Meteor-M2 reçue en LRPT par un amateur, en Pologne, le 20 juin 2015."
      en: "What you get: an image from the Meteor-M2 satellite received in LRPT by a hobbyist in Poland on 20 June 2015."
    titre: "Meteor-M2 LRPT 2015 06 20 10-26 125"
    auteur: "MKjanek32"
    source: "https://commons.wikimedia.org/wiki/File:Meteor-M2_LRPT_2015_06_20_10-26_125.jpg"
    licence: "domaine public"
    verifie_le: "2026-11-12"
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/Meteor-M2_LRPT_2015_06_20_10-26_125.jpg?width=1200"
  - fichier: cle-rtl-sdr.jpg
    type: image
    etape: 1
    legende:
      fr: "Une clé SDR USB de type RTL-SDR, avec un adaptateur d'antenne et un adaptateur USB."
      en: "An RTL-SDR type USB SDR dongle, with an antenna adapter and a USB adapter."
    titre: "Rtl-sdr"
    auteur: "Joeceads"
    source: "https://commons.wikimedia.org/wiki/File:Rtl-sdr.jpg"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/Rtl-sdr.jpg"
  - fichier: dipole-en-v.svg
    type: schema
    etape: 3
    legende:
      fr: "Antenne dipôle en V, vue de dessus. 1 : brin. 2 : angle entre les deux brins. 3 : longueur d'un brin. 4 : câble vers la clé SDR. N : nord."
      en: "V-dipole antenna, top view. 1: element. 2: angle between the two elements. 3: length of one element. 4: cable to the SDR dongle. N: north."
    titre: "Antenne dipôle en V"
    auteur: "CivicNode"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    relu: false
maj: 2026-11-12
---

# Recevoir les images des satellites météo avec une clé SDR

Plusieurs fois par jour, un satellite météo passe au-dessus de chez vous et diffuse en clair l'image de ce qu'il survole. Une clé radio USB et une antenne simple suffisent à la recevoir, sans Internet.

## 1. Principe

Les satellites russes Meteor-M tournent autour de la Terre en passant près des pôles et diffusent en continu leurs images par un signal numérique appelé LRPT, dans la bande des 137 MHz. La plupart de ces émissions sont libres et non chiffrées : chacun peut les recevoir. Une clé SDR (radio logicielle) transforme le signal en données ; le logiciel libre SatDump le décode et reconstruit l'image : trois canaux, avec une résolution d'un kilomètre par pixel. Le dernier satellite américain NOAA qui diffusait l'ancien signal analogique (APT), NOAA-19, a été mis hors service en 2025 : beaucoup de tutoriels le décrivent encore. On ne reçoit que pendant un passage, quelques minutes, et il faut donc en connaître l'heure d'avance.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Réception seule : la clé SDR n'émet rien. On écoute une diffusion publique ; on n'écoute pas les communications privées d'autrui. [À VALIDER : cadre légal français de la réception]
> - Antenne posée au sol, sur un balcon ou tenue à la main. Pas d'antenne sur un toit ou un mât : risque de chute, hors du périmètre de cette fiche.
> - Jamais d'antenne dehors par temps d'orage, ni près d'une ligne électrique.
> - Une image reçue montre les nuages du moment : ce n'est pas une prévision, et elle ne remplace pas une alerte officielle.

## 3. Pas-à-pas

Fréquences, réglages et noms de menus changent avec les satellites et les versions du logiciel. [À VALIDER : chaque réglage sur un passage réel]

### Étape 1 : Réunir le matériel

- **Action :** prendre une clé SDR USB de type RTL-SDR, une antenne dipôle à deux brins et son câble, et un ordinateur. Vérifier sur la notice de la clé qu'elle couvre la bande des 137 MHz.
- **Vérification :** la clé est reconnue par l'ordinateur quand on la branche.
- **Source :** s2 (un récepteur SDR et un simple dipôle suffisent) ; le choix de la clé : aucune source ouverte (étape créée, à tester)

### Étape 2 : Installer SatDump

- **Action :** tant qu'on a Internet, installer SatDump depuis la page des versions du projet (Windows, macOS), ou le compiler sous Linux en suivant le fichier README du dépôt. Brancher la clé, ouvrir SatDump, et vérifier qu'elle apparaît dans la liste des sources.
- **Vérification :** la clé est proposée comme source dans SatDump.
- **Source :** aucune source ouverte (étape créée, à tester ; la procédure est dans s6, en référence)

### Étape 3 : Régler l'antenne en V

- **Action :** régler les deux brins à la même longueur, proche d'un quart de la longueur d'onde, et les ouvrir en V. Poser l'antenne à plat, horizontale, dehors, avec un ciel aussi dégagé que possible, loin des écrans et des chargeurs. [À VALIDER : longueur des brins, angle et orientation ; valeurs répandues, sans source ouverte : environ 53 cm par brin, angle de 120°, axe nord-sud]
- **Vérification :** les deux brins ont la même longueur au mètre ruban et l'antenne est horizontale.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 4 : Noter les passages d'avance

- **Action :** tant qu'on a Internet, relever avec un outil de prévision de passages les heures où Meteor-M N2-3 et N2-4 passent haut dans le ciel de son lieu pour les jours à venir, et les noter. Sans mise à jour, ces prévisions se dégradent au fil des semaines. [À VALIDER : outil conseillé, et durée de validité des prévisions hors-ligne]
- **Vérification :** une liste de passages (date, heure de début et de fin, hauteur maximale) est écrite.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 5 : Régler la réception

- **Action :** quelques minutes avant le passage, ouvrir l'onglet Recorder de SatDump. Dans les réglages de la source, choisir la clé, puis régler la fréquence, la fréquence d'échantillonnage et le gain. Régler la fréquence sur 137,9 MHz ; ces satellites émettent sur 137,9 ou 137,1 MHz, et la fréquence en service peut changer. Démarrer la source.
- **Vérification :** le spectre s'anime à l'écran.
- **Source :** s4 (onglet Recorder, réglages de la source : fréquence, échantillonnage, gain) et s3 (LRPT sur 137,9 MHz) ; « démarrer la source » : aucune source ouverte lue ; 137,1 MHz : s5, en référence [À VALIDER : fréquence d'échantillonnage et gain ; l'interface de SatDump 2 diffère de celle décrite par s4]

### Étape 6 : Lancer le décodage

- **Action :** dans la partie Processing de l'onglet Recorder, choisir la chaîne de traitement (« pipeline ») des satellites Meteor-M en LRPT et régler ses options, puis cliquer sur Start avant le début du passage. Le dossier où les images seront enregistrées se règle dans Settings. [À VALIDER : nom exact de la chaîne ; le débit en service est de 72 000 symboles par seconde d'après s5, en référence ; s1 donne 80 kBaud pour le LRPT en général]
- **Vérification :** le décodage est indiqué comme en cours.
- **Source :** s4 (partie Processing, choix de la chaîne, bouton Start ; dossier de sortie dans Settings)

### Étape 7 : Suivre le passage

- **Action :** pendant le passage, laisser l'antenne immobile et surveiller l'écran : le signal apparaît comme une bosse large dans le spectre, monte, puis redescend. Si l'affichage ralentit l'ordinateur, alléger l'affichage du spectre et de la cascade.
- **Vérification :** une bosse nette se détache du bruit à la fréquence réglée pendant plusieurs minutes.
- **Source :** s4 (l'affichage du spectre, surtout la cascade, est gourmand) ; l'aspect du signal et le réglage du défilement : aucune source ouverte (étape créée, à tester)

### Étape 8 : Arrêter et ouvrir l'image

- **Action :** à la fin du passage, arrêter le décodage puis la source. Ouvrir le dossier de sortie : il contient les images des canaux reçus et des compositions en couleur.
- **Vérification :** au moins une image montre des nuages, des côtes ou des reliefs reconnaissables.
- **Source :** s4 (dossier de sortie réglé dans Settings) et s1 (trois canaux à 1 km par pixel) ; l'ordre d'arrêt : aucune source ouverte (étape créée, à tester)

### Étape 9 : Lire l'image et la dater

- **Action :** repérer sa région sur l'image, puis les masses nuageuses et leur position. Noter sur l'image la date, l'heure et le satellite. D'un passage à l'autre, comparer : ce qui approche, ce qui s'éloigne.
- **Vérification :** l'image est rangée avec sa date et son heure.
- **Source :** aucune source ouverte (étape créée, à tester)

## 4. Si ça coince

- **Étape 5 — la clé n'apparaît pas.** Rafraîchissez la liste des sources (flèche à côté de la liste), puis rebranchez la clé.
- **Étape 7 — aucun signal.** Vérifiez l'heure du passage et la fréquence (137,9 ou 137,1 MHz), puis augmentez le gain. Un passage bas sur l'horizon donne rarement une image.
- **Étape 7 — signal faible avec Meteor-M N2-3.** L'antenne de ce satellite ne s'est pas entièrement déployée : son signal est plus faible. Essayez un passage de N2-4.
- **Étape 8 — image en bandes ou en gros carrés.** La réception a décroché par moments : éloignez l'antenne des appareils électriques, dégagez le ciel, attendez un passage plus haut.
- **Un tutoriel parle de NOAA et d'APT.** Il est périmé : NOAA-19, le dernier satellite à diffuser l'APT, a été arrêté en 2025.

## 5. Ressource

### Ce que disent les sources

Wikipédia décrit le LRPT : une diffusion numérique d'images dans la bande des 137 MHz, à trois canaux et 1 km par pixel, qui remplace l'ancien signal analogique APT ; l'article indique que NOAA-19, dernier satellite à porter l'APT, a été mis hors service le 13 août 2025, et que l'antenne de Meteor-M N2-3 ne s'est pas entièrement déployée (source s1). Les articles sur les satellites précisent que leurs émissions sont libres et recevables avec un récepteur SDR et un dipôle (source s2), et que Meteor-M N2-4 diffuse en LRPT sur 137,9 MHz (source s3). Le billet de SatDump décrit l'onglet Recorder et le menu Processing (source s4).

La liste des satellites tenue par SatDump (source s5, en référence) donne les deux fréquences et le débit en service, et les dates d'arrêt de NOAA 15, 18 et 19 ; seul l'arrêt de NOAA-19 figure dans une source adaptée (s1). Le choix de la clé, l'antenne, la prévision des passages et la lecture de l'image ne s'appuient sur aucune source ouverte : la fiche est à tester et à reproduire.

### Pour aller plus loin

- Liste des satellites et de leurs signaux, tenue par SatDump (source s5) : à consulter avant chaque campagne, les fréquences changent.
- Dépôt de SatDump (source s6) : installation et ligne de commande.
- Fiche de Meteor-M N2-3 dans la base OSCAR de l'Organisation météorologique mondiale (source s7).
- Fiche *Écoute radio pour s'informer*.
