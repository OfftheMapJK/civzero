---
id: energie-recharge-solaire
titre: Recharger une batterie 12 V avec un panneau et un régulateur
bloc: energie
besoin: produire-son-energie
horizon: hours
temps: "une à deux journées d'atelier"
vague: 3
milieu: [urbain, rural]
tier: [1, 2]
exige_avance: "panneau solaire, régulateur de charge adapté à la batterie, câbles, fusibles, multimètre"
origine_materiel: mixte
variantes:
  - id: panneau-neuf
    danger: orange
  - id: panneau-recupere
    danger: orange
danger: orange
statut: brouillon
redaction: assistee-ia
reproductions: 0
relecture_obligatoire: true
impact:
  toxicite: "panneau (verre, cadre, cellules), batterie"
  fin_de_vie: "panneaux et batteries en filière de collecte"
  passerelle: "énergie produite localement, première brique d'autonomie"
prerequis: [nodule-zero, energie-protection-12v, energie-multimetre, energie-lire-etiquette]
sources: []
maj: 2026-11-09
---

# Recharger une batterie 12 V avec un panneau et un régulateur

Produire sa propre énergie pour la batterie de la station. **Aucune valeur chiffrée de cette fiche n'est à appliquer avant relecture.**

## 1. Principe

Le panneau ne se branche jamais directement sur la batterie : un **régulateur de charge** se place entre les deux et adapte la charge au type de batterie. Deux familles de régulateurs : PWM, simples, et MPPT, qui tirent davantage du panneau. Un panneau produit une tension dès qu'il reçoit de la lumière, même câbles débranchés.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Tous ceux de la fiche *Mesure et protection d'un circuit 12 V*.
> - Le panneau est sous tension à la lumière : le couvrir pendant le câblage.
> - Fixation en hauteur ou sur un toit : risque de chute. Hors du périmètre de la bêta. [À VALIDER : conditions de fixation acceptables]

## 3. Pas-à-pas

### Étape 1 : Lire le panneau et le régulateur

- **Action :** relever sur le panneau la tension à vide (Voc), le courant de court-circuit (Isc) et la puissance ; sur le régulateur, la tension de batterie, le courant maximal et la tension maximale admise côté panneau.
- **Vérification :** la tension à vide du panneau reste sous le maximum du régulateur, avec une marge. [À VALIDER : marge par temps froid ; proposition reçue : majorer la tension à vide de 15 à 20 %]
- **Source :** notices du panneau et du régulateur

### Étape 2 : Régler le type de batterie

- **Action :** configurer le régulateur pour la technologie de votre batterie (plomb, lithium fer phosphate…).
- **Vérification :** le régulateur affiche le bon type.
- **Source :** notice du régulateur

### Étape 3 : Couvrir le panneau

- **Action :** poser une couverture opaque sur le panneau, ou le retourner face contre terre.
- **Vérification :** le multimètre ne mesure presque plus de tension aux bornes du panneau.
- **Source :** fiche *Se servir d'un multimètre*

### Étape 4 : Raccorder dans l'ordre de la notice

- **Action :** suivre l'ordre de raccordement indiqué par la notice du régulateur, souvent la batterie d'abord, puis le panneau. [À VALIDER : ordre selon le modèle ; proposition reçue : batterie d'abord, panneau ensuite, et l'inverse au débranchement]
- **Vérification :** chaque raccordement est fait dans l'ordre prévu, avec un fusible côté batterie.
- **Source :** notice du régulateur

### Étape 5 : Découvrir et orienter le panneau

- **Action :** retirer la couverture et orienter le panneau vers le sud. [À VALIDER : inclinaison conseillée selon la latitude et la saison]
- **Vérification :** le panneau est au soleil, sans ombre portée.
- **Source :** [SOURCE À TROUVER]

### Étape 6 : Vérifier la charge

- **Action :** lire l'affichage du régulateur et mesurer la tension de la batterie.
- **Vérification :** le régulateur indique une charge en cours.
- **Source :** notice du régulateur

## 4. Si ça coince

- **Étape 1 — le panneau est récupéré sans étiquette lisible.** Mesurez sa tension à vide en plein soleil au multimètre. [À VALIDER : méthode de test d'un panneau de récupération]
- **Étape 6 — aucune charge au soleil.** Vérifiez les fusibles, la polarité côté panneau et l'ombre.
- **Étape 6 — la batterie ne se remplit jamais.** Le panneau est trop petit pour la consommation : refaites le bilan.

## 5. Ressource

### Panneaux de récupération

Les panneaux déclassés sont nombreux et souvent encore utilisables : c'est un gisement typique des interstices. Leur puissance réelle est souvent inférieure à celle de l'étiquette.

### Pistes de sources (non vérifiées)

- [SOURCE À TROUVER : guide d'installation solaire autonome basse tension]
- Wikipédia : « Régulateur de charge », « Recherche du point de puissance maximale »
