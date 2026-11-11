---
id: energie-multimetre
titre: Se servir d'un multimètre — tension et continuité
socle: ambre
savoirs: [lire-mesurer]
horizon: hours
temps: "une heure d'essai"
vague: 1
milieu: [urbain, rural]
tier: [1]
exige_avance: "un multimètre (récupération ou bas de gamme) et sa pile"
origine_materiel: mixte
variantes:
  - id: continuite-hors-tension
    danger: vert
  - id: tension-batterie-12v
    danger: orange
danger: orange
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "pile du multimètre"
  fin_de_vie: "pile en point de collecte"
  passerelle: "un multimètre permet de diagnostiquer au lieu de jeter"
prerequis: [nodule-zero, energie-lire-etiquette]
provenance: []
attestations: []
medias: []
maj: 2026-11-09
---

# Se servir d'un multimètre — tension et continuité

Deux mesures suffisent pour la plupart des fiches : vérifier qu'un fil ou un fusible conduit, et lire la tension d'une batterie. Le courant (en ampères) n'est pas traité ici.

## 1. Principe

- **Continuité :** le multimètre envoie un petit courant et bipe si le circuit est fermé. On l'utilise **uniquement sur un circuit débranché**.
- **Tension :** le multimètre mesure la différence entre deux points, sans laisser passer de courant notable. On l'utilise **en parallèle** de la source.
- La plupart des erreurs viennent d'une mauvaise position du sélecteur ou des cordons.

## 2. Sécurité

> **NIVEAU : ORANGE (triangle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Le multimètre réglé sur ampères (A), ou le cordon rouge dans la borne A, et posé sur une batterie crée un court-circuit : étincelle, fusible du multimètre grillé, cordons qui chauffent.
> - Réglé sur continuité ou sur résistance (Ω) et posé sur une batterie, il ne crée pas de court-circuit, mais il donne une mesure absurde et peut s'abîmer.
> - Moratoire rouge : aucune mesure sur une prise secteur ou une installation 230 V dans la bêta.
> - [À VALIDER : catégorie de sécurité (CAT) minimale du multimètre pour ces usages]

## 3. Pas-à-pas

### Étape 1 : Reconnaître les bornes

- **Action :** repérer la borne COM (cordon noir), la borne V/Ω (cordon rouge) et la borne A ou mA. Dans cette fiche, le cordon rouge ne va **jamais** dans la borne A.
- **Vérification :** noir dans COM, rouge dans V/Ω.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Contrôler l'appareil

- **Action :** vérifier que la pile fonctionne (l'écran s'allume) et que les cordons ne sont ni coupés ni dénudés.
- **Vérification :** écran lisible, isolant des cordons intact sur toute la longueur.
- **Source :** [SOURCE À TROUVER]

### Étape 3 : Tester la continuité d'un câble ou d'un fusible

- **Action :** circuit débranché. Sélecteur sur le symbole sonore. Toucher les deux pointes ensemble (il doit biper), puis toucher les deux extrémités du câble ou du fusible.
- **Vérification :** bip = le courant passe. Silence = coupure.
- **Source :** [SOURCE À TROUVER]

### Étape 4 : Mesurer la tension d'une batterie 12 V

- **Action :** sélecteur sur la tension continue (V avec la ligne pleine et pointillée). Sur un appareil à calibres manuels, si la tension est incertaine, commencer par le calibre le plus élevé, puis descendre jusqu'au calibre juste au-dessus de la valeur lue (souvent 20 V pour une batterie 12 V). Pointe rouge sur la borne +, pointe noire sur la borne −.
- **Vérification :** une valeur positive s'affiche. Un signe − signifie que les pointes sont inversées, sans danger.
- **Source :** [SOURCE À TROUVER]

### Étape 5 : Ranger

- **Action :** retirer les pointes, remettre le sélecteur sur OFF, laisser le cordon rouge dans V/Ω.
- **Vérification :** la prochaine personne ne trouvera pas l'appareil réglé sur ampères.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 3 ou 4 — l'écran affiche « 1 » ou « OL ».** Valeur hors calibre ou circuit ouvert. Changez de calibre, ou vérifiez le contact des pointes.
- **Étape 4 — la valeur saute sans arrêt.** Pile du multimètre faible ou mauvais contact.
- **Étape 4 — l'appareil bipe au contact de la batterie.** Le sélecteur est resté sur continuité. Retirez les pointes et passez sur la tension continue.
- **Étape 4 — étincelle au contact de la batterie.** Le cordon rouge était dans la borne A ou le sélecteur sur ampères. Retirez immédiatement, vérifiez les étapes 1 et 4. Le fusible interne du multimètre a pu griller. [À VALIDER : remplacement du fusible interne]

## 5. Ressource

### Ce que la tension dit d'une batterie

Voir la fiche *Estimer sa consommation et son autonomie* et, plus tard, *Mesure et protection d'un circuit 12 V*. Les correspondances entre tension et état de charge dépendent de la technologie et de l'état de repos. [À VALIDER : tableau tension / état de charge pour plomb et lithium fer phosphate]

### Pistes de sources (non vérifiées)

- Wikipédia : « Multimètre »
- [SOURCE À TROUVER : notice d'un multimètre courant en français]
