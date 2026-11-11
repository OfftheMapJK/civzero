---
id: energie-station-batterie
titre: Alimenter la station depuis une batterie 12 V
socle: ambre
savoirs: [alimenter-station]
horizon: hours
temps: "une journée d'atelier"
vague: 3
milieu: [urbain, rural]
tier: [1, 2]
exige_avance: "batterie 12 V, convertisseur continu-continu adapté, connecteur compatible avec la station, fusible"
origine_materiel: mixte
variantes:
  - id: convertisseur-elevateur
    danger: orange
danger: orange
statut: brouillon
redaction: assistee-ia
reproductions: 0
relecture_obligatoire: true
impact:
  toxicite: "plomb ou lithium de la batterie"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "recharge solaire de la batterie"
prerequis: [nodule-zero, energie-protection-12v, energie-multimetre, energie-lire-etiquette, calcul-station-minipc]
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Alimenter la station depuis une batterie 12 V

Faire fonctionner la station sans secteur, sans passer par un onduleur 230 V. **Aucune valeur chiffrée de cette fiche n'est à appliquer avant relecture et essai sur matériel réel.**

## 1. Principe

Beaucoup de mini-PC attendent une tension continue plus élevée que 12 V (souvent autour de 19 ou 20 V : lire l'étiquette). Un convertisseur continu-continu élève la tension de la batterie à la valeur demandée. La tension d'une batterie varie selon sa charge : le convertisseur doit accepter toute cette plage. Certains fabricants vérifient aussi l'identité du chargeur par une broche du connecteur.

Un convertisseur élévateur ne sait pas abaisser une tension : si la batterie dépasse la tension réglée, elle passe presque telle quelle. Ce n'est pas un problème pour une station qui attend 19 V, puisque la batterie n'y monte jamais. Pour un appareil qui attend une tension proche de celle de la batterie, il faut un convertisseur abaisseur-élévateur (buck-boost).

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Tous ceux de la fiche *Mesure et protection d'un circuit 12 V*.
> - Une tension de sortie mal réglée peut détruire la station : on règle à vide, au multimètre, avant de brancher.
> - Une décharge trop profonde abîme la batterie.

## 3. Pas-à-pas

### Étape 1 : Lire l'entrée de la station

- **Action :** relever sur le bloc d'origine la tension, le courant et la polarité de sortie, et identifier le connecteur.
- **Vérification :** tension, courant, polarité et type de connecteur notés.
- **Source :** fiche *Lire une étiquette*

### Étape 2 : Choisir le convertisseur

- **Action :** un convertisseur qui fournit la tension demandée, avec une marge de puissance, et qui accepte toute la plage de tension de la batterie. [À VALIDER : marge de puissance et plage de tension d'entrée]
- **Vérification :** les caractéristiques du convertisseur couvrent les besoins notés à l'étape 1.
- **Source :** [SOURCE À TROUVER]

### Étape 3 : Vérifier la question du connecteur

- **Action :** chercher si votre modèle de mini-PC exige un connecteur à broche d'identification. [À VALIDER : essai sur matériel réel, modèle par modèle]
- **Vérification :** vous savez si un connecteur standard suffit.
- **Source :** [SOURCE À TROUVER]

### Étape 4 : Régler la sortie à vide

- **Action :** brancher le convertisseur sur la batterie (avec fusible), **sans la station**, et régler la sortie au multimètre.
- **Vérification :** le multimètre affiche la tension demandée par la station, polarité correcte.
- **Source :** fiche *Se servir d'un multimètre*

### Étape 5 : Câbler avec protection

- **Action :** appliquer la fiche *Mesure et protection d'un circuit 12 V* entre batterie et convertisseur.
- **Vérification :** fusible au plus près de la borne +, contrôle de continuité fait.
- **Source :** fiche *Mesure et protection d'un circuit 12 V*

### Étape 6 : Protéger la batterie contre la décharge profonde

- **Action :** ajouter une coupure automatique à basse tension, ou arrêter la station à un seuil. [À VALIDER : seuil selon la technologie ; proposition reçue : 11,8 V pour le plomb, 12,0 V pour le LFP, ce qui correspond à une batterie LFP presque vide ; beaucoup de batteries LFP ont leur propre protection]
- **Vérification :** la station s'arrête avant que la batterie ne descende sous le seuil.
- **Source :** [SOURCE À TROUVER]

### Étape 7 : Mesurer la consommation réelle

- **Action :** relever la consommation de la station au repos et en charge, puis refaire le bilan (fiche *Estimer sa consommation*).
- **Vérification :** l'autonomie calculée repose sur des mesures, pas sur l'étiquette.
- **Source :** [À VALIDER : méthode de mesure du courant, hors du périmètre de la fiche multimètre]

## 4. Si ça coince

- **Étape 4 — la sortie ne se règle pas à la bonne valeur.** Le convertisseur n'est pas adapté : ne branchez pas la station.
- **Étape 3 — la station refuse de démarrer sur le convertisseur.** Problème probable de broche d'identification. [À VALIDER : solutions connues selon le modèle]
- **Étape 6 — la station s'éteint trop tôt.** Refaites le bilan d'autonomie et réduisez ce qui tourne.

## 5. Ressource

### Pistes de sources (non vérifiées)

- [SOURCE À TROUVER : notice du convertisseur retenu]
- Wikipédia : « Convertisseur Boost »
