---
id: telecom-partage-telephone
titre: Passer des fiches de téléphone à téléphone
socle: mycelium
savoirs: [partager-sans-internet]
horizon: instant
temps: "quelques minutes"
vague: 1
milieu: [urbain, rural]
tier: [0]
exige_avance: "avoir déjà les fiches (archive HTML ou fichier Kiwix) sur au moins un téléphone"
origine_materiel: aucun
variantes:
  - id: sans-fil-proximite
    danger: vert
  - id: cable-ou-cle-otg
    danger: vert
danger: vert
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "aucune"
  fin_de_vie: "sans objet"
  passerelle: "chaque copie fait une bibliothèque de plus dans le quartier"
prerequis: []
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Passer des fiches de téléphone à téléphone

Faire circuler le corpus CivicNode sans Internet ni station : un téléphone qui l'a peut le donner à un autre.

## 1. Principe

Les téléphones savent échanger des fichiers directement, sans réseau mobile : par le partage de proximité de leur système, par Bluetooth, ou par un câble ou une clé USB. Le corpus des fiches est petit ; Wikipédia hors-ligne est beaucoup plus gros et se transmet mal sans fil.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche : n'accepter que les fichiers d'une personne que l'on connaît.

## 3. Pas-à-pas

### Étape 1 : Avoir le corpus sous forme de fichier

- **Action :** sur le téléphone qui donne, repérer l'archive des fiches CivicNode ou le fichier `.zim` lu par l'application Kiwix.
- **Vérification :** vous trouvez le fichier dans le gestionnaire de fichiers et connaissez sa taille.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Choisir le moyen de transfert

- **Action :** entre deux Android, le partage à proximité (Quick Share) ; entre deux iPhone, AirDrop. Entre Android et iPhone, l'échange direct n'existe que sur certains téléphones récents (les Pixel 10 depuis novembre 2025). Sinon, et pour les gros fichiers, une clé USB à double connecteur (USB-C et USB-A), sur un téléphone qui accepte les clés. Bluetooth en dernier recours.
- **Vérification :** les deux téléphones se voient, ou la clé est reconnue.
- **Source :** TechCrunch, 20 novembre 2025 (voir pistes)

### Étape 3 : Envoyer le petit fichier d'abord

- **Action :** transmettre l'archive des fiches avant tout fichier volumineux.
- **Vérification :** le transfert se termine sans erreur.
- **Source :** sans objet

### Étape 4 : Vérifier chez le destinataire

- **Action :** ouvrir l'archive dans le navigateur ou le fichier dans Kiwix sur le téléphone qui reçoit.
- **Vérification :** l'accueil CivicNode ou la page d'accueil Kiwix s'affiche.
- **Source :** [SOURCE À TROUVER]

### Étape 5 : Vérifier la date de version

- **Action :** comparer la date de synchro affichée sur les deux téléphones.
- **Vérification :** les deux ont la même version, ou vous savez laquelle est la plus récente.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 2 — les deux téléphones ne se voient pas.** Activez Bluetooth et la visibilité sur les deux, rapprochez-les, ou passez par une clé USB.
- **Étape 3 — le transfert s'interrompt.** Fichier trop gros pour Bluetooth : utilisez le câble ou la clé.
- **Étape 4 — l'archive ne s'ouvre pas dans le navigateur.** Certains navigateurs mobiles bloquent les fichiers locaux. [À VALIDER : navigateurs compatibles] Essayez l'application Kiwix.

## 5. Ressource

### Pistes de sources (non vérifiées)

- Kiwix, lecteur de contenus hors-ligne : https://kiwix.org
- Quick Share compatible avec AirDrop sur les Pixel 10 : https://techcrunch.com/2025/11/20/androids-quick-share-now-works-with-iphones-airdrop-starting-with-the-pixel-10-lineup/
- [SOURCE À TROUVER : documentation officielle Quick Share et AirDrop]
