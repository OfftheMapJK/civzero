---
id: calcul-lire-sans-station
titre: Lire les fiches sans station
socle: strate
savoirs: [garder-savoir]
horizon: instant
temps: "quelques minutes"
vague: 2
milieu: [urbain, rural]
tier: [0]
exige_avance: "avoir copié l'archive des fiches sur l'appareil ou sur une clé"
origine_materiel: aucun
variantes:
  - id: ordinateur
    danger: vert
  - id: telephone
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "aucune"
  fin_de_vie: "sans objet"
  passerelle: "chaque appareil devient une petite station"
prerequis: []
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Lire les fiches sans station

Les fiches CivicNode sont de simples pages HTML : n'importe quel ordinateur ou téléphone peut les lire, sans serveur ni Internet.

## 1. Principe

Le site des fiches fonctionne sans JavaScript ni serveur. On ouvre le fichier d'accueil dans un navigateur, et toutes les fiches se parcourent par liens. Wikipédia, plus volumineux, se lit avec l'application Kiwix.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche : aucun particulier.

## 3. Pas-à-pas

### Étape 1 : Récupérer l'archive

- **Action :** copier le dossier des fiches depuis une station, une clé ou un autre téléphone (fiche *Passer des fiches de téléphone à téléphone*).
- **Vérification :** le dossier contient un fichier `index.html`.
- **Source :** sans objet

### Étape 2 : Sur un ordinateur

- **Action :** ouvrir `index.html` dans un navigateur, par un double-clic.
- **Vérification :** l'accueil CivicNode s'affiche et les liens mènent aux fiches.
- **Source :** sans objet

### Étape 3 : Sur un téléphone

- **Action :** ouvrir `index.html` depuis le gestionnaire de fichiers. Certains navigateurs mobiles récents bloquent l'ouverture directe des fichiers locaux : dans ce cas, l'application Kiwix est la voie la plus fiable. Pour Wikipédia, utiliser Kiwix avec un fichier `.zim`. [À VALIDER : version des fiches au format Kiwix (ZIM), pas encore publiée]
- **Vérification :** les fiches s'affichent sur le téléphone.
- **Source :** [SOURCE À TROUVER]

### Étape 4 : Depuis une clé sur un téléphone

- **Action :** brancher la clé avec un adaptateur OTG, puis ouvrir `index.html` depuis la clé ou copier le dossier sur le téléphone.
- **Vérification :** les fiches s'affichent.
- **Source :** [SOURCE À TROUVER]

### Étape 5 : Vérifier la version

- **Action :** lire la date de synchro sur l'accueil.
- **Vérification :** vous savez de quand date votre copie.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 2 — la page s'affiche sans mise en forme.** Le dossier a été copié incomplètement : recopiez-le en entier.
- **Étape 3 — le téléphone refuse d'ouvrir le fichier.** Essayez un autre navigateur, ou demandez une version au format Kiwix.
- **Étape 4 — la clé n'est pas reconnue.** Le téléphone ne gère peut-être pas l'OTG : passez par un ordinateur.

## 5. Ressource

### Pistes de sources (non vérifiées)

- Kiwix : https://kiwix.org
- Wikipédia : « USB On-The-Go »
