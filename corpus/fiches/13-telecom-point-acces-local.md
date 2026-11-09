---
id: telecom-point-acces-local
titre: Point d'accès Wi-Fi local
bloc: telecom
besoin: partager-le-savoir
mode: [prepare]
vague: 2
milieu: [urbain, rural]
tier: [1]
exige_avance: "la station montée ; selon la variante, une carte Wi-Fi compatible ou un routeur Wi-Fi du commerce"
origine_materiel: mixte
suspendu: true
raison_suspension: "attend un essai sur matériel réel : choix entre point d'accès intégré à la station et routeur externe"
variantes:
  - id: point-acces-integre
    danger: vert
  - id: routeur-bloc-origine
    danger: vert
  - id: routeur-sur-batterie-12v
    danger: orange
danger: orange
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "cartes électroniques, plastiques"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "alimentation solaire directe de la station"
prerequis: [nodule-zero, calcul-station-minipc, energie-lire-etiquette]
sources: []
maj: 2026-11-09
---

# Point d'accès Wi-Fi local

> **Fiche en suspens.** Le gabarit a été éprouvé sur cette fiche ; son contenu attend un essai sur matériel réel. La décision d'architecture ci-dessous n'est pas prise.

## 1. Principe

Un réseau Wi-Fi local n'a pas besoin d'Internet : il permet aux téléphones du voisinage d'ouvrir la station dans leur navigateur. Deux architectures sont possibles :

- **Point d'accès intégré :** la station diffuse elle-même le Wi-Fi avec sa carte. Une seule alimentation, et la station maîtrise son adresse et son nom. Demande une carte compatible avec le mode point d'accès.
- **Routeur externe :** un routeur du commerce, relié à la station par câble. Meilleure portée, mais deux appareils à alimenter et une adresse qui dépend du routeur.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Variante routeur sur batterie : risque de court-circuit, fusible obligatoire (fiche *Mesure et protection d'un circuit 12 V*).
> - Lire la polarité du connecteur avant tout branchement (fiche *Lire une étiquette*).

## 3. Pas-à-pas

[À VALIDER : pas-à-pas complet à écrire après le choix d'architecture et l'essai sur matériel réel]

Points déjà établis pour la variante routeur :

### Étape 1 : Lire la tension et la polarité du routeur

- **Action :** relever l'entrée sur l'étiquette du routeur.
- **Vérification :** vous connaissez la tension et la polarité exactes.
- **Source :** notice du routeur

### Étape 2 : Ne rien brancher sur le port Internet

- **Action :** relier la station à un port LAN, jamais au port WAN ou Internet.
- **Vérification :** le port WAN reste vide.
- **Source :** notice du routeur

### Étape 3 : Faire trouver la station facilement

- **Action :** [À VALIDER : nom local ou portail captif, à tester sur Android et iPhone]
- **Vérification :** un téléphone qui rejoint le réseau ouvre la station sans taper d'adresse compliquée.
- **Source :** [SOURCE À TROUVER]

## 4. Si ça coince

- **Le téléphone se déconnecte du Wi-Fi tout seul.** Les téléphones quittent les réseaux sans Internet. [À VALIDER : réglage exact selon Android et iOS]
- **La box de l'opérateur est verrouillée.** Elle n'est pas couverte : utilisez un routeur du commerce ou la variante intégrée.

## 5. Ressource

### Entre les deux modes

- **Je prépare :** choisir l'architecture et la tester.
- **Ça a coupé :** le point d'accès transforme la station en bibliothèque de quartier.

### Pistes de sources (non vérifiées)

- [SOURCE À TROUVER : documentation hostapd et dnsmasq pour la variante intégrée]
- [SOURCE À TROUVER : notice du routeur retenu]
