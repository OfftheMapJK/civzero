---
id: calcul-station-minipc
titre: Monter sa station CivicNode sur un mini-PC de récupération
socle: strate
savoirs: [monter-station]
horizon: hours
temps: "une journée"
vague: 2
milieu: [urbain, rural]
tier: [1, 2]
exige_avance: "un mini-PC ou un portable de récupération, une clé USB d'installation, un accès Internet pendant l'installation"
origine_materiel: recuperation
variantes:
  - id: bloc-secteur-origine
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "cartes électroniques, batterie interne éventuelle"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "alimentation sur batterie 12 V et solaire en vague 3"
prerequis: [nodule-zero, energie-lire-etiquette]
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Monter sa station CivicNode sur un mini-PC de récupération

Transformer un petit ordinateur d'occasion en bibliothèque hors-ligne : les fiches CivicNode et Wikipédia, consultables depuis un navigateur. L'assistant n'est pas traité ici.

## 1. Principe

La station est un ordinateur ordinaire qui fait tourner deux services : un lecteur de corpus hors-ligne (Kiwix) pour Wikipédia, et un petit serveur web pour les fiches CivicNode, qui sont de simples pages HTML. Tout est installé pendant qu'on a Internet ; ensuite, plus rien n'en dépend.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Alimentation par le bloc secteur d'origine, fermé : on ne l'ouvre pas (moratoire rouge).
> - Ne pas ouvrir la machine branchée.

## 3. Pas-à-pas

Les commandes données sont indicatives. [À VALIDER : commandes exactes sur une machine réelle]

### Étape 1 : Vérifier la machine

- **Action :** l'allumer avec son bloc d'origine, entrer dans le menu de démarrage, relever la mémoire vive et le stockage. [À VALIDER : configuration minimale de référence, par exemple 8 Go de mémoire et 256 Go de stockage]
- **Vérification :** la machine démarre et vous avez noté sa configuration.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Installer un système Linux stable

- **Action :** préparer une clé d'installation de Debian et l'installer sur la machine.
- **Vérification :** la machine démarre sur Debian sans la clé.
- **Source :** documentation d'installation de Debian (voir pistes)

### Étape 3 : Installer Kiwix et télécharger Wikipédia

- **Action :** installer le paquet des outils Kiwix (`sudo apt install kiwix-tools`), puis télécharger un fichier `.zim` de Wikipédia en français. Choisir la version `wikipedia_fr_all_nopic`, sans images, bien plus légère ; sa taille s'affiche dans la bibliothèque Kiwix.
- **Vérification :** le fichier `.zim` est présent et sa taille correspond à celle annoncée.
- **Source :** bibliothèque Kiwix (voir pistes)

### Étape 4 : Servir Wikipédia en local

- **Action :** lancer le serveur Kiwix, par exemple `kiwix-serve --port=8080 /chemin/vers/wikipedia.zim`.
- **Vérification :** depuis la station, `http://localhost:8080` affiche la page d'accueil Kiwix.
- **Source :** documentation Kiwix

### Étape 5 : Copier et servir les fiches CivicNode

- **Action :** copier le dossier des fiches (site HTML) sur la station et le servir avec un serveur web léger comme `darkhttpd`, un programme unique disponible en paquet Debian : par exemple `darkhttpd /chemin/vers/site --port 8000`. [À VALIDER : commande exacte sur la machine réelle]
- **Vérification :** l'accueil CivicNode s'affiche dans le navigateur de la station.
- **Source :** [SOURCE À TROUVER]

### Étape 6 : Démarrage automatique

- **Action :** configurer les deux services pour qu'ils démarrent avec la machine. [À VALIDER : fichiers de service systemd]
- **Vérification :** après un redémarrage, les deux adresses répondent sans intervention.
- **Source :** [SOURCE À TROUVER]

### Étape 7 : Tester depuis un autre appareil

- **Action :** relier un téléphone ou un ordinateur au même réseau local et ouvrir l'adresse de la station.
- **Vérification :** les fiches et Wikipédia s'affichent sur l'autre appareil.
- **Source :** fiche *Point d'accès Wi-Fi local*

### Étape 8 : Noter la date de synchro

- **Action :** inscrire la date de la version du corpus pour qu'elle s'affiche dans la barre d'état.
- **Vérification :** la date apparaît sur l'accueil.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 1 — la machine ne démarre pas.** Vérifiez le bloc avec la fiche *Lire une étiquette*. Une machine qui ne démarre pas reste hors du périmètre de cette fiche.
- **Étape 3 — le stockage est insuffisant.** Prenez la version de Wikipédia sans images, ou une sélection thématique.
- **Étape 7 — l'autre appareil ne trouve pas la station.** Vérifiez qu'ils sont sur le même réseau ; la question du point d'accès est traitée dans sa fiche.

## 5. Ressource

### Pistes de sources (non vérifiées)

- Debian, guide d'installation : https://www.debian.org/releases/stable/installmanual
- Kiwix, bibliothèque de contenus : https://library.kiwix.org
- Kiwix, outils serveur : https://kiwix.org
