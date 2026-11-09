---
id: telecom-lora-messages
titre: Envoyer des messages texte par radio LoRa
bloc: telecom
besoin: se-joindre
mode: [prepare]
vague: 3
milieu: [urbain, rural]
tier: [2]
exige_avance: "deux modules LoRa compatibles Meshtastic, antennes 868 MHz, deux téléphones, Internet pour l'installation"
origine_materiel: achat
variantes:
  - id: deux-modules-portables
    danger: vert
danger: vert
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "petites batteries lithium des modules"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "premier maillon d'un réseau radio de quartier"
prerequis: [nodule-zero]
sources:
  - id: s1
    titre: "Meshtastic — Configuration LoRa"
    url: https://meshtastic.org/docs/configuration/radio/lora
  - id: s2
    titre: "Meshtastic — Configuration initiale"
    url: https://meshtastic.org/docs/getting-started/initial-config/
maj: 2026-11-09
---

# Envoyer des messages texte par radio LoRa

Échanger de courts messages sur plusieurs kilomètres, sans opérateur ni Internet, avec des modules radio à faible consommation. Le réseau appartient à ceux qui l'utilisent.

## 1. Principe

LoRa est une technique radio à longue portée et faible débit. Le logiciel libre Meshtastic transforme un petit module LoRa en messagerie : on écrit sur son téléphone, relié au module par Bluetooth, et le module transmet par radio aux autres modules. En Europe, la bande utilisée (EU_868) est d'usage libre sous conditions, notamment une limite de temps d'émission.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Ne jamais mettre un module sous tension sans son antenne : émettre sans antenne peut détruire son étage d'émission. [À VALIDER : selon le module]
> - Respecter la réglementation : région EU_868 obligatoire, temps d'émission limité. [À VALIDER : conditions réglementaires françaises à jour]

## 3. Pas-à-pas

### Étape 1 : Choisir deux modules et leurs antennes

- **Action :** prendre deux modules de la liste des appareils compatibles Meshtastic, avec des antennes prévues pour 868 MHz.
- **Vérification :** les deux modules et leurs antennes portent la mention 868 MHz.
- **Source :** [SOURCE À TROUVER : liste officielle des appareils compatibles]

### Étape 2 : Visser l'antenne avant toute mise sous tension

- **Action :** fixer l'antenne sur chaque module avant de le brancher ou de l'allumer.
- **Vérification :** les deux antennes sont vissées.
- **Source :** [À VALIDER : consigne du fabricant du module]

### Étape 3 : Installer le logiciel Meshtastic

- **Action :** avec Internet, installer le logiciel sur chaque module avec l'outil d'installation officiel, puis l'application Meshtastic sur chaque téléphone.
- **Vérification :** l'application voit le module par Bluetooth.
- **Source :** s2

### Étape 4 : Régler la région EU_868

- **Action :** dans l'application, régler la région sur EU_868. Tant que la région n'est pas réglée, le module n'émet pas.
- **Vérification :** la région affichée est EU_868 sur les deux modules.
- **Source :** s1, s2

### Étape 5 : Régler le même mode radio sur les deux modules

- **Action :** vérifier que les deux modules utilisent le même préréglage radio : des modules réglés différemment ne se comprennent pas.
- **Vérification :** même préréglage sur les deux modules.
- **Source :** s2

### Étape 6 : Envoyer un premier message de près

- **Action :** les deux modules dans la même pièce, envoyer un message de l'un à l'autre.
- **Vérification :** le message arrive et l'accusé de réception s'affiche.
- **Source :** sans objet

### Étape 7 : Éloigner progressivement

- **Action :** recommencer en éloignant un module, et noter les distances atteintes sur la carte.
- **Vérification :** vous connaissez la portée réelle dans votre environnement.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 4 — le module n'envoie rien.** La région n'est pas réglée : c'est le cas le plus fréquent.
- **Étape 6 — les messages n'arrivent pas.** Vérifiez le préréglage radio et le canal sur les deux modules.
- **Étape 7 — la portée est très courte.** Montez en hauteur, dégagez l'antenne des obstacles, éloignez-la du corps.
- **Les messages partent en retard.** La limite de temps d'émission (10 % sur une heure glissante en EU_868) est atteinte : écrivez des messages courts et moins fréquents.

## 5. Ressource

### Ce que dit la documentation

En EU_868, la plage est 869,4 à 869,65 MHz, avec une limite de 10 % de temps d'émission calculée sur une heure glissante. Le module qui atteint la limite cesse d'émettre jusqu'à ce qu'il y soit de nouveau autorisé (source s1).

### Entre les deux modes

- **Je prépare :** acheter, installer, tester la portée.
- **Ça a coupé :** les modules fonctionnent sur leur batterie et sans aucun réseau.

### Pistes de sources (non vérifiées)

- s1, s2 ci-dessus, lues pour la région et la limite d'émission
- [SOURCE À TROUVER : réglementation française sur les appareils de faible portée]
