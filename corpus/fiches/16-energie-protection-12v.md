---
id: energie-protection-12v
titre: Mesure et protection d'un circuit 12 V — fusible et section de câble
socle: ambre
savoirs: [alimenter-station]
horizon: hours
temps: "une demi-journée d'atelier"
vague: 3
milieu: [urbain, rural]
tier: [1]
exige_avance: "fusibles et porte-fusible, câble de section adaptée, cosses, outil de sertissage, multimètre"
origine_materiel: achat
variantes:
  - id: circuit-batterie-12v
    danger: orange
danger: orange
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
relecture_obligatoire: true
impact:
  toxicite: "plomb ou lithium de la batterie, gaines plastiques"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "base de toute installation solaire autonome"
prerequis: [nodule-zero, energie-lire-etiquette, energie-multimetre, energie-bilan-papier]
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Mesure et protection d'un circuit 12 V — fusible et section de câble

Toute fiche qui branche un appareil sur une batterie passe par celle-ci. **Aucune valeur chiffrée de cette fiche n'est à appliquer avant relecture.**

## 1. Principe

Une batterie 12 V délivre peu de tension mais peut fournir un courant très élevé en cas de court-circuit : le câble chauffe jusqu'à faire fondre son isolant et mettre le feu. Le fusible protège **le câble**, pas l'appareil. Il se place au plus près de la borne positive, pour que tout le câble en aval soit protégé. La section du câble dépend du courant et de la longueur ; en 12 V, un câble trop fin et trop long fait aussi perdre beaucoup de tension.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Court-circuit franc : arc, projection de métal fondu, brûlure, incendie.
> - Un outil métallique posé sur les deux bornes provoque ce court-circuit : ne jamais rien poser sur une batterie.
> - Travailler à deux, sans bijoux, outils isolés (Nodule Zéro, étapes 3 et 4).

## 3. Pas-à-pas

### Étape 1 : Dessiner le schéma sur papier

- **Action :** batterie → fusible → interrupteur → appareil, et le retour au −.
- **Vérification :** le schéma montre le fusible juste après la borne +.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Connaître le courant de l'appareil

- **Action :** relever ou calculer le courant (puissance ÷ tension), fiches *Lire une étiquette* et *Estimer sa consommation*.
- **Vérification :** vous avez une valeur en ampères.
- **Source :** fiche *Lire une étiquette*

### Étape 3 : Choisir la section du câble

- **Action :** choisir la section selon le courant et la longueur aller-retour. [À VALIDER : table des sections ; proposition reçue : viser une chute de tension de 3 % au plus]
- **Vérification :** la section retenue figure sur le schéma.
- **Source :** [SOURCE À TROUVER]

### Étape 4 : Choisir le calibre du fusible

- **Action :** un calibre au-dessus du courant normal de l'appareil et au-dessous de ce que le câble supporte. [À VALIDER : règle de choix et marges]
- **Vérification :** calibre du fusible noté sur le schéma.
- **Source :** [SOURCE À TROUVER]

### Étape 5 : Monter, batterie déconnectée, fusible retiré

- **Action :** installer le porte-fusible au plus près de la borne +, **sans fusible dedans**. Raccorder le câble à l'appareil. [À VALIDER : ordre de raccordement ; proposition reçue : brancher le + puis le −, débrancher le − puis le +]
- **Vérification :** aucun courant ne peut circuler tant que le fusible n'est pas en place.
- **Source :** [SOURCE À TROUVER]

### Étape 6 : Contrôler au multimètre

- **Action :** vérifier la polarité à l'arrivée sur l'appareil, et la continuité de chaque fil (fiche *Se servir d'un multimètre*).
- **Vérification :** + arrive sur le + de l'appareil, aucune continuité entre + et −.
- **Source :** fiche *Se servir d'un multimètre*

### Étape 7 : Insérer le fusible en dernier

- **Action :** insérer le fusible, puis allumer l'appareil par l'interrupteur.
- **Vérification :** l'appareil fonctionne.
- **Source :** sans objet

### Étape 8 : Surveiller l'échauffement

- **Action :** après un temps de fonctionnement, toucher prudemment câbles et connexions. [À VALIDER : durée et critère d'échauffement acceptable]
- **Vérification :** rien ne chauffe anormalement.
- **Source :** [SOURCE À TROUVER]

## 4. Si ça coince

- **Étape 6 — continuité entre + et −.** Il y a un court-circuit : ne pas insérer le fusible, tout revérifier.
- **Étape 7 — le fusible saute immédiatement.** Court-circuit ou calibre trop faible : retirez, revérifiez l'étape 6 avant de changer quoi que ce soit.
- **Étape 8 — un câble chauffe.** Coupez, la section est trop faible ou une connexion est mal serrée.

## 5. Ressource

### Pistes de sources (non vérifiées)

- [SOURCE À TROUVER : guide de câblage basse tension pour installations autonomes]
- Wikipédia : « Fusible », « Chute de tension »
