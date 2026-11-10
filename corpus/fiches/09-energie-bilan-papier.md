---
id: energie-bilan-papier
titre: Estimer sa consommation et son autonomie, sur papier
bloc: energie
besoin: comprendre-ses-appareils
horizon: hours
temps: "une heure"
vague: 1
milieu: [urbain, rural]
tier: [0]
exige_avance: "papier, crayon, les étiquettes des appareils"
origine_materiel: aucun
variantes:
  - id: calcul
    danger: vert
danger: vert
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "aucune"
  fin_de_vie: "sans objet"
  passerelle: "dimensionner juste évite d'acheter trop grand"
prerequis: [energie-lire-etiquette]
sources: []
maj: 2026-11-09
---

# Estimer sa consommation et son autonomie, sur papier

Savoir combien de temps une batterie fera tourner vos appareils, avec quatre opérations. Rien n'est branché.

## 1. Principe

- **Énergie consommée** (Wh) = puissance (W) × durée d'utilisation (h).
- **Énergie stockée** dans une batterie (Wh) = capacité (Ah) × tension (V).
- On ne vide jamais complètement une batterie : seule une fraction est utilisable.
- **Autonomie** (jours) = énergie utilisable ÷ consommation par jour.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche : aucun, c'est un calcul.

## 3. Pas-à-pas

### Étape 1 : Lister les appareils et leur puissance

- **Action :** pour chaque appareil, relever la puissance sur l'étiquette (fiche *Lire une étiquette*).
- **Vérification :** chaque ligne a une valeur en W.
- **Source :** fiche *Lire une étiquette*

### Étape 2 : Estimer la durée d'usage par jour

- **Action :** noter combien d'heures par jour chaque appareil fonctionne.
- **Vérification :** chaque ligne a une durée en heures.
- **Source :** sans objet

### Étape 3 : Calculer l'énergie par appareil

- **Action :** puissance × durée. Exemple illustratif : un routeur de 8 W allumé 24 h consomme 192 Wh par jour.
- **Vérification :** chaque ligne a une valeur en Wh.
- **Source :** sans objet

### Étape 4 : Additionner

- **Action :** faire la somme des Wh de toutes les lignes.
- **Vérification :** vous avez une consommation totale par jour.
- **Source :** sans objet

### Étape 5 : Calculer l'énergie utilisable de la batterie

- **Action :** capacité × tension × fraction utilisable. Ordres de grandeur couramment cités : environ 50 % pour une batterie au plomb, 80 à 85 % pour une batterie lithium fer phosphate (LFP). Exemple illustratif : 12 V × 100 Ah = 1 200 Wh ; au plomb, environ 600 Wh utilisables.
- **Vérification :** vous avez une énergie utilisable en Wh.
- **Source :** [SOURCE À TROUVER]

### Étape 6 : Tenir compte des pertes

- **Action :** retirer les pertes des convertisseurs entre la batterie et les appareils : comptez environ 15 % (ordre de grandeur).
- **Vérification :** l'énergie utilisable est corrigée.
- **Source :** [SOURCE À TROUVER]

### Étape 7 : Calculer l'autonomie

- **Action :** énergie utilisable corrigée ÷ consommation par jour.
- **Vérification :** vous avez une autonomie en jours, à arrondir vers le bas.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 1 — l'étiquette donne des ampères mais pas de watts.** Multipliez par la tension.
- **Étape 3 — l'appareil ne consomme pas toujours sa puissance maximale.** L'étiquette donne souvent le maximum : le calcul est prudent, c'est bien. La mesure réelle viendra avec la vague 3.
- **Étape 7 — l'autonomie est trop courte.** Réduisez d'abord la durée d'usage des appareils les plus gourmands avant de chercher une plus grosse batterie.

## 5. Ressource

### Modèle de tableau

| Appareil | Puissance (W) | Heures par jour | Énergie (Wh/jour) |
| --- | --- | --- | --- |
| … | … | … | … |
| **Total** | | | … |

### Pistes de sources (non vérifiées)

- Wikipédia : « Wattheure », « Ampère-heure »
- [SOURCE À TROUVER : guide de dimensionnement d'un système autonome basse tension]
