---
id: alimenter-raspberry-pi-solaire
titre: Alimenter un Raspberry Pi au solaire toute l'année
accroche: "Elle explique comment dimensionner et assembler un panneau, un régulateur, une batterie et un convertisseur 5 V pour qu'un Raspberry Pi tienne aussi en hiver."
socle: ambre
savoirs: [alimenter-station]
horizon: hours
temps: "une à deux journées d'atelier, puis une semaine d'observation"
vague: 3
milieu: [urbain, rural]
tier: [2]
exige_avance: "un panneau solaire, un régulateur de charge réglable pour le lithium fer phosphate, une batterie 12 V lithium fer phosphate avec protection intégrée, un convertisseur 12 V vers 5 V, fusibles et porte-fusibles, câbles, multimètre"
origine_materiel: neuf
variantes:
  - id: batterie-lfp-12v
    danger: orange
danger: orange
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
relecture_obligatoire: true
impact:
  toxicite: "batterie au lithium, électronique"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "réduire d'abord la consommation de la station avant d'agrandir le panneau"
prerequis: [nodule-zero, energie-lire-etiquette, energie-multimetre, energie-bilan-papier, energie-protection-12v, energie-station-batterie, energie-recharge-solaire, monter-station-civicnode-raspberry-pi]
provenance:
  - id: s1
    titre: "Raspberry Pi hardware, Power supply (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Getting started (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/getting-started.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Lithium iron phosphate battery"
    auteur: "Contributeurs de Wikipédia"
    source: "https://en.wikipedia.org/wiki/Lithium_iron_phosphate_battery"
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
attestations: []
medias:
  - fichier: chaine-solaire-raspberry-pi.svg
    type: schema
    etape: 8
    legende:
      fr: "La chaîne d'alimentation. Chaque trait représente une paire de fils (+ et −). 1 : panneau solaire. 2 : régulateur de charge. 3 : batterie 12 V. 4 : fusibles, au plus près de la borne + de la batterie. 5 : convertisseur 12 V vers 5 V. 6 : Raspberry Pi."
      en: "The power chain. Each line stands for a pair of wires (+ and −). 1: solar panel. 2: charge controller. 3: 12 V battery. 4: fuses, as close as possible to the battery's + terminal. 5: 12 V to 5 V converter. 6: Raspberry Pi."
    titre: "Du panneau au Raspberry Pi"
    auteur: "CivicNode"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    relu: false
maj: 2026-11-12
---

# Alimenter un Raspberry Pi au solaire toute l'année

Faire tourner la station sans prise de courant, été comme hiver. **Aucune valeur chiffrée de cette fiche n'est à appliquer avant relecture par une personne compétente et essai sur matériel réel.**

## 1. Principe

La chaîne a cinq maillons : le panneau, le régulateur de charge, la batterie 12 V, un fusible, puis un convertisseur qui abaisse le 12 V de la batterie au 5 V que demande le Raspberry Pi. Cette fiche assemble trois fiches existantes (*Mesure et protection d'un circuit 12 V*, *Alimenter la station depuis une batterie 12 V*, *Recharger une batterie 12 V avec un panneau et un régulateur*) et y ajoute ce qui est propre au Raspberry Pi. « Toute l'année » décide de tout : le panneau et la batterie se calculent pour le mois le moins ensoleillé, pas pour l'été. Une batterie lithium fer phosphate (LFP) de quatre éléments a une tension nominale de 12,8 V, proche de celle d'une batterie au plomb.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Tous ceux des fiches *Mesure et protection d'un circuit 12 V* et *Recharger une batterie 12 V avec un panneau et un régulateur* : court-circuit, arc, incendie ; panneau sous tension dès qu'il reçoit de la lumière.
> - Batterie au lithium : n'utiliser qu'une batterie 12 V du commerce, fermée, avec sa protection intégrée. Ne jamais l'ouvrir ni assembler soi-même des éléments récupérés : c'est hors du périmètre de cette fiche.
> - Un régulateur réglé pour le plomb peut abîmer une batterie LFP par une tension de charge trop élevée : régler le type de batterie avant tout raccordement.
> - Une sortie de convertisseur mal réglée détruit le Raspberry Pi : mesurer à vide avant de le brancher.
> - Panneau sur un toit ou en hauteur : risque de chute, hors du périmètre de cette fiche. Le panneau se pose au sol ou sur un support bas, solidement lesté.

## 3. Pas-à-pas

### Étape 1 : Connaître la consommation du Raspberry Pi

- **Action :** relever le courant de son modèle. À titre indicatif, la carte nue consomme en fonctionnement autour de 350 mA pour un Zero 2 W, 500 mA pour un 3B+, 600 mA pour un 4B et 800 mA pour un 5, sous 5,1 V ; tout ce qu'on y branche s'ajoute. Mesurer ensuite sa propre station pendant une journée (fiche *Estimer sa consommation et son autonomie, sur papier*).
- **Vérification :** une consommation en watts est notée, mesurée et non lue sur une étiquette.
- **Source :** s1 (courants typiques de la carte nue ; tension de 5,1 V) [À VALIDER : méthode de mesure du courant, hors du périmètre de la fiche multimètre]

### Étape 2 : Calculer l'énergie d'une journée

- **Action :** multiplier la consommation en watts par 24 heures pour obtenir des wattheures par jour, puis ajouter les pertes du convertisseur et du régulateur. [À VALIDER : pertes à prendre en compte]
- **Vérification :** un nombre de wattheures par jour est écrit.
- **Source :** aucune source ouverte (étape créée, à tester) ; méthode de la fiche *Estimer sa consommation et son autonomie, sur papier*

### Étape 3 : Choisir la batterie

- **Action :** choisir une batterie 12 V lithium fer phosphate dont l'énergie couvre plusieurs jours sans soleil. [À VALIDER : nombre de jours d'autonomie à viser, et part de la capacité réellement utilisable] Vérifier sur sa notice qu'elle contient sa propre protection, et la plage de températures où elle accepte la charge. [À VALIDER : charge par temps de gel]
- **Vérification :** énergie de la batterie (en wattheures) divisée par l'énergie d'une journée : le nombre de jours obtenu est écrit.
- **Source :** s3 (tension nominale de 12,8 V pour quatre éléments ; les chargeurs doivent être adaptés au LFP) ; le dimensionnement : aucune source ouverte (étape créée, à tester)

### Étape 4 : Choisir le panneau pour le mois le plus sombre

- **Action :** chercher, pour son lieu, la production d'un panneau au mois le moins ensoleillé, par exemple avec l'outil public PVGIS de la Commission européenne. Choisir une puissance de panneau dont la production de ce mois-là dépasse la consommation de l'étape 2. [À VALIDER : marge à prendre]
- **Vérification :** production estimée du mois le plus faible et consommation du même mois sont écrites côte à côte.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 5 : Choisir et régler le régulateur

- **Action :** appliquer la fiche *Recharger une batterie 12 V avec un panneau et un régulateur* : régulateur compatible avec le panneau, réglé sur le type de batterie lithium fer phosphate.
- **Vérification :** le régulateur affiche le type de batterie LFP.
- **Source :** fiche *Recharger une batterie 12 V avec un panneau et un régulateur* ; s3 (chargeur adapté au LFP)

### Étape 6 : Choisir le convertisseur 12 V vers 5 V

- **Action :** choisir un convertisseur abaisseur qui accepte toute la plage de tension de la batterie et fournit 5 V avec au moins le courant recommandé pour son modèle : 2,5 A pour un Raspberry Pi 3 ou un Zero, 3 A pour un 4. Le Raspberry Pi 5 demande 5 A ; avec 3 A, il limite ses ports USB à 600 mA. Prévoir le bon connecteur : USB-C pour les Raspberry Pi 4 et 5, micro-USB pour les modèles plus anciens.
- **Vérification :** tension, courant et connecteur du convertisseur couvrent ce que demande le modèle.
- **Source :** s2 (alimentation recommandée par modèle) et s1 (connecteurs) [À VALIDER : plage de tension d'entrée du convertisseur]

### Étape 7 : Vérifier la sortie du convertisseur à vide

- **Action :** alimenter le convertisseur par la batterie, à travers son fusible, **sans le Raspberry Pi**, et mesurer sa sortie au multimètre (fiche *Alimenter la station depuis une batterie 12 V*, étape 4).
- **Vérification :** le multimètre affiche environ 5,1 V, polarité correcte.
- **Source :** s1 (tous les modèles demandent 5,1 V) ; fiche *Alimenter la station depuis une batterie 12 V* [À VALIDER : tolérance acceptable]

### Étape 8 : Câbler dans l'ordre, panneau couvert

- **Action :** câbler la chaîne selon les fiches *Mesure et protection d'un circuit 12 V* et *Recharger une batterie 12 V avec un panneau et un régulateur* : un fusible au plus près de la borne + de la batterie sur chaque départ, panneau couvert pendant le câblage, ordre de raccordement de la notice du régulateur.
- **Vérification :** le schéma papier de la chaîne montre chaque fusible, et chaque raccordement a été contrôlé au multimètre.
- **Source :** fiches *Mesure et protection d'un circuit 12 V* et *Recharger une batterie 12 V avec un panneau et un régulateur*

### Étape 9 : Brancher le Raspberry Pi et chercher les alertes de tension

- **Action :** brancher le Raspberry Pi sur le convertisseur et le laisser démarrer. Le système inscrit une alerte dans le journal du noyau quand la tension d'alimentation passe sous 4,63 V : chercher cette alerte après une heure de fonctionnement [À VALIDER : durée d'observation, et commande exacte pour lire le journal].
- **Vérification :** aucune alerte de sous-tension dans le journal.
- **Source :** s1 (seuil de 4,63 V, à 5 % près ; absent sur les modèles Zero)

### Étape 10 : Protéger la carte contre les coupures

- **Action :** une fois la station installée, activer le système de fichiers en lecture seule (`sudo raspi-config`, options de performance, *Overlay File System*) : les fichiers ne sont plus modifiés en fonctionnement, et une coupure de courant abîme moins facilement la carte.
- **Vérification :** après redémarrage, un fichier créé puis un nouveau redémarrage : le fichier a disparu.
- **Source :** s4 (système de fichiers en lecture seule) et s1 (les coupures peuvent corrompre le stockage)

### Étape 11 : Observer une semaine

- **Action :** chaque matin pendant une semaine, avant le lever du soleil, relever la tension de la batterie et l'état affiché par le régulateur. Refaire ce relevé en décembre.
- **Vérification :** la tension du matin ne baisse pas de jour en jour.
- **Source :** aucune source ouverte (étape créée, à tester)

## 4. Si ça coince

- **Étape 9 — alertes de sous-tension.** Le câble entre le convertisseur et le Raspberry Pi est souvent trop fin ou trop long : raccourcissez-le, puis vérifiez le courant que le convertisseur peut fournir.
- **Étape 11 — la tension du matin baisse chaque jour.** La station consomme plus que le panneau ne produit : réduisez d'abord la consommation (modèle plus sobre, Wi-Fi coupé la nuit), puis agrandissez le panneau.
- **La station s'arrête la nuit.** La protection de la batterie l'a coupée : la batterie est trop petite pour la saison, ou le panneau ne la recharge pas assez.
- **Le régulateur ne propose pas le réglage lithium.** Ne branchez pas la batterie LFP dessus : changez de régulateur.
- **La batterie gonfle, chauffe ou sent.** Arrêtez tout et appliquez la fiche *Que faire d'une batterie ou d'un appareil hors d'usage*.

## 5. Ressource

### Ce que disent les sources

La documentation de Raspberry Pi donne la tension d'alimentation (5,1 V), le courant recommandé et la consommation typique de chaque modèle, et le seuil de l'alerte de sous-tension (sources s1 et s2). Wikipédia indique la tension nominale d'une batterie LFP de quatre éléments et rappelle que la charge doit être adaptée à cette chimie (source s3).

Le dimensionnement (étapes 2 à 4) et l'observation (étape 11) ne s'appuient sur aucune source ouverte : ils sont à tester, et la fiche entière attend la relecture d'une personne compétente en électricité.

### Pour aller plus loin

- PVGIS, outil d'estimation de la production photovoltaïque de la Commission européenne : https://re.jrc.ec.europa.eu/pvg_tools/fr/ (non ouvert pour cette fiche).
- Fiche *Monter sa station CivicNode sur un Raspberry Pi*.
