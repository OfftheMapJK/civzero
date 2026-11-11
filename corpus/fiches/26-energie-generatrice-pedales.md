---
id: energie-generatrice-pedales
titre: Fabriquer une génératrice à pédales pour recharger
accroche: "Elle décrit comment un vélo sur support, un moteur récupéré et une batterie 12 V forment une petite centrale d'atelier, à monter à plusieurs et à faire relire avant tout essai."
socle: ambre
savoirs: [recharger-telephone, produire-electricite]
horizon: seasons
temps: "plusieurs semaines à quelques mois, à plusieurs"
vague: 3
milieu: [urbain, rural]
tier: [2]
exige_avance: "un vélo et un support d'entraînement à rouleau, un moteur à courant continu à aimants permanents de récupération, une diode de puissance, un régulateur de charge, une batterie 12 V, fusibles, câbles, un convertisseur 12 V vers USB, un multimètre"
origine_materiel: recupere
variantes:
  - id: moteur-recupere
    danger: orange
danger: orange
statut: brouillon
redaction: assistee-ia
reproductions: 0
relecture_obligatoire: true
impact:
  toxicite: "batterie 12 V (plomb ou lithium)"
  fin_de_vie: "batterie en filière de collecte"
  passerelle: "une centrale collective pour un atelier, une école, un tiers-lieu"
prerequis: [nodule-zero, energie-multimetre, energie-protection-12v, energie-recharge-solaire, energie-station-batterie]
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Fabriquer une génératrice à pédales pour recharger

Le projet le plus ambitieux de la série : transformer l'effort des jambes en énergie stockée. Il s'adresse à un groupe, dans un atelier, pas à une personne seule pendant une coupure. **Aucune valeur chiffrée de cette fiche n'est à appliquer avant relecture.**

## 1. Principe

Le pneu arrière du vélo, posé sur un support à rouleau, entraîne un moteur à courant continu qui fonctionne alors comme génératrice. Le courant passe par une **diode**, qui l'empêche de repartir vers le moteur, puis par un **régulateur de charge**, qui protège la batterie, comme pour un panneau solaire. La batterie stocke l'énergie, et un convertisseur USB recharge les téléphones. On ne pédale jamais directement pour un téléphone : on pédale pour la batterie. [À VALIDER : puissance qu'une personne peut fournir longtemps, et compatibilité d'un régulateur solaire avec une génératrice]

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Tous ceux de la fiche *Mesure et protection d'un circuit 12 V*.
> - Pièces en rotation : roue, rouleau, courroie. Protéger les doigts, les cheveux longs et les vêtements amples ; personne ne s'approche quand on pédale.
> - Un moteur entraîné vite sans charge peut produire une tension plus haute que prévu : ne jamais pédaler avec le circuit ouvert. [À VALIDER : protection contre la surtension]
> - Une batterie au plomb en charge dégage un gaz inflammable : local aéré, aucune flamme ni étincelle à proximité.

## 3. Pas-à-pas

### Étape 1 : Réunir et lire les pièces

- **Action :** relever la tension et le courant nominaux du moteur, la plage d'entrée du régulateur et le type de batterie (fiche *Lire une étiquette*). Faire valider le choix des pièces par une personne compétente avant tout montage.
- **Vérification :** les tensions du moteur, du régulateur et de la batterie sont compatibles, et un relecteur l'a confirmé.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Fixer le moteur sur le support

- **Action :** fixer le moteur pour que son axe soit entraîné par le pneu ou le rouleau, sans jeu, et poser un capot sur les parties qui tournent.
- **Vérification :** en tournant la roue à la main, l'axe du moteur tourne sans glisser ni vibrer.
- **Source :** [SOURCE À TROUVER]

### Étape 3 : Mesurer la tension à vide, à faible vitesse

- **Action :** sans rien brancher, pédaler doucement et mesurer la tension aux bornes du moteur au multimètre (fiche *Se servir d'un multimètre*). Ne pas pédaler fort circuit ouvert.
- **Vérification :** la tension mesurée reste dans la plage d'entrée du régulateur.
- **Source :** [SOURCE À TROUVER]

### Étape 4 : Câbler avec protection

- **Action :** moteur, puis diode, puis régulateur, puis batterie, avec un fusible près de la batterie (fiche *Mesure et protection d'un circuit 12 V*). Brancher dans l'ordre prévu par la notice du régulateur, en général la batterie en premier.
- **Vérification :** un relecteur a vérifié le câblage avant le premier essai.
- **Source :** notice du régulateur

### Étape 5 : Premier essai

- **Action :** pédaler à allure modérée et regarder le témoin de charge du régulateur. Arrêter au moindre échauffement ou odeur.
- **Vérification :** le régulateur indique que la batterie se charge ; rien ne chauffe anormalement.
- **Source :** notice du régulateur

### Étape 6 : Recharger les téléphones depuis la batterie

- **Action :** brancher le convertisseur 12 V vers USB sur la batterie, protégé par un fusible (fiche *Alimenter la station depuis une batterie 12 V*).
- **Vérification :** les téléphones chargent, y compris quand personne ne pédale.
- **Source :** notice du convertisseur

## 4. Si ça coince

- **Étape 5 — le régulateur ne charge pas.** La tension du moteur est trop basse à cette vitesse : pédalez plus vite ou revoyez le rapport entre la roue et l'axe du moteur avec le relecteur.
- **Étape 2 — le pneu patine sur l'axe.** Augmentez la pression du pneu et le serrage du support, ou ajoutez un rouleau adapté.
- **Étape 3 — la tension monte très haut.** Arrêtez de pédaler : le moteur ne convient pas à ce régulateur sans protection supplémentaire.

## 5. Ressource

### Pistes de sources (non vérifiées)

- Fiches de construction de « vélo générateur » des ateliers d'autoconstruction et des low-tech labs.
- Notices des régulateurs de charge.
