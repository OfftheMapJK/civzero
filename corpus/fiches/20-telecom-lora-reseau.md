---
id: telecom-lora-reseau
titre: Mettre plusieurs stations LoRa en réseau
bloc: telecom
aussi: [communs]
besoin: se-joindre
horizon: seasons
temps: "plusieurs semaines : sites, réglages, essais"
vague: 3
milieu: [urbain, rural]
tier: [2]
exige_avance: "au moins trois modules réglés (fiche précédente), un emplacement en hauteur, une alimentation pour le nœud fixe"
origine_materiel: achat
variantes:
  - id: noeud-interieur
    danger: vert
  - id: noeud-exterieur-en-hauteur
    danger: orange
danger: orange
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "batteries des modules, boîtier extérieur"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "un réseau de proximité qui appartient à ses utilisateurs"
prerequis: [telecom-lora-messages, telecom-plan-communication, telecom-carte-hors-ligne]
sources:
  - id: s1
    titre: "Meshtastic — Configuration LoRa"
    url: https://meshtastic.org/docs/configuration/radio/lora
  - id: s2
    titre: "Meshtastic — Choosing the right device role"
    url: https://meshtastic.org/blog/choosing-the-right-device-role/
maj: 2026-11-09
---

# Mettre plusieurs stations LoRa en réseau

Passer de deux modules à un réseau de quartier : les messages sautent d'un module à l'autre jusqu'à leur destinataire. C'est l'outil de reconstruction de la vague 3.

## 1. Principe

Dans un réseau maillé, chaque module retransmet les messages qu'il reçoit, dans une limite de sauts. Un module fixe placé en hauteur couvre une grande zone et relie les autres. Le groupe partage un canal privé, protégé par une clé commune.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Variante nœud extérieur : travail en hauteur, risque de chute. Pas de toit ni d'échelle sans sécurisation. [À VALIDER : conditions acceptables]
> - Alimentation du nœud fixe : voir les fiches de la vague 3.
> - Emplacement : uniquement chez soi ou avec l'accord explicite du propriétaire du lieu.

## 3. Pas-à-pas

### Étape 1 : Planifier sur la carte

- **Action :** reporter sur la carte du quartier les domiciles du groupe et les points hauts possibles.
- **Vérification :** un point haut central est identifié, avec l'accord du lieu.
- **Source :** fiche *Carte hors-ligne de sa région*

### Étape 2 : Créer le canal du groupe

- **Action :** créer un canal privé avec un nom et une clé, puis le partager hors ligne, par exemple par le code QR de l'application.
- **Vérification :** tous les modules du groupe affichent le même canal.
- **Source :** [SOURCE À TROUVER : documentation Meshtastic sur les canaux]

### Étape 3 : Installer le nœud fixe

- **Action :** placer un module au point haut, antenne dégagée, alimenté en continu. Rôle : `CLIENT_BASE` pour un nœud de toit ou de grenier, `CLIENT` dans le doute. `ROUTER` seulement sur un site vraiment stratégique, comme un sommet. Ne pas utiliser `CLIENT_MUTE`, qui ne retransmet rien. [À VALIDER : rôles disponibles dans la version installée]
- **Vérification :** le nœud fixe apparaît dans la liste des nœuds de tous les membres.
- **Source :** s2

### Étape 4 : Garder la limite de sauts par défaut

- **Action :** laisser la limite de sauts à 3, valeur par défaut, sauf besoin prouvé. L'augmenter encombre le réseau.
- **Vérification :** la limite est à 3 sur tous les modules.
- **Source :** s1 (défaut 3, maximum 7)

### Étape 5 : Alimenter le nœud fixe

- **Action :** prévoir une alimentation fiable : secteur avec batterie de secours, ou petite installation solaire. [À VALIDER : dimensionnement]
- **Vérification :** le nœud reste allumé une nuit entière sans secteur.
- **Source :** fiche *Recharger une batterie 12 V avec un panneau*

### Étape 6 : Tester la couverture

- **Action :** depuis plusieurs points du quartier, envoyer un message test et noter sur la carte où il passe.
- **Vérification :** la carte de couverture est dessinée.
- **Source :** sans objet

### Étape 7 : Intégrer au plan de communication

- **Action :** ajouter le canal et des heures d'écoute au plan de communication du groupe.
- **Vérification :** le plan papier mentionne le canal LoRa.
- **Source :** fiche *Plan de communication entre proches et voisins*

## 4. Si ça coince

- **Étape 2 — un module ne voit pas le canal.** Vérifiez la clé et le préréglage radio, identiques partout.
- **Étape 6 — une zone n'est pas couverte.** Ajoutez un nœud relais entre cette zone et le nœud fixe.
- **Les messages arrivent en retard ou pas du tout.** Trop de trafic ou limite d'émission atteinte : messages plus courts, moins fréquents.

## 5. Ressource

### Le sens de cette fiche

Ce réseau n'utilise aucune infrastructure d'autrui : il appartient à ceux qui le montent. C'est la première brique d'une proximité qui se relie elle-même.

### Pistes de sources (non vérifiées)

- s1 ci-dessus, lue pour la limite de sauts ; s2, lue pour les rôles
- [SOURCE À TROUVER : documentation Meshtastic sur les canaux]
