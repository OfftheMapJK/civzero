# CivZero — corpus de la phase 1 (bêta)

Toutes les fiches sont au statut **brouillon** et rédigées avec l'assistance d'une IA. Aucune n'est à appliquer comme sûre avant relecture. Voir `RELECTURE.md`.

## Vague 1 — sans station ni achat

| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |
| --- | --- | --- | --- | --- | --- |
| 00 | [Nodule Zéro — principes et sécurité](fiches/00-nodule-zero.md) | socle | 0, 1, 2 | sans-objet | rien |
| 01 | [Lire une étiquette — batterie, chargeur, appareil](fiches/01-energie-lire-etiquette.md) | energie | 0 | vert | rien |
| 02 | [Se servir d'un multimètre — tension et continuité](fiches/02-energie-multimetre.md) | energie | 1 | orange | un multimètre (récupération ou bas de gamme) et sa pile |
| 03 | [Garder un téléphone chargé pendant une coupure](fiches/03-energie-telephone-coupure.md) | energie | 0, 1 | orange | une batterie externe chargée et un câble ; en option un adaptateur USB pour prise 12 V de voiture |
| 04 | [Préparer une coupure de 72 heures — énergie et communication](fiches/04-socle-coupure-72h.md) | socle | 0 | vert | rassembler le matériel ; quelques achats possibles (lampes, piles, radio) |
| 05 | [Plan de communication entre proches et voisins](fiches/05-telecom-plan-communication.md) | telecom | 0 | vert | une réunion avec les personnes concernées, du papier |
| 06 | [Que faire d'une batterie ou d'un appareil hors d'usage](fiches/06-energie-fin-de-vie.md) | energie | 0 | orange | rien |
| 07 | [Écoute radio pour s'informer](fiches/07-telecom-ecoute-radio.md) | telecom | 0 | vert | un poste radio à piles, à manivelle ou solaire, et des piles |
| 08 | [Passer des fiches de téléphone à téléphone](fiches/08-telecom-partage-telephone.md) | telecom | 0 | vert | avoir déjà les fiches (archive HTML ou fichier Kiwix) sur au moins un téléphone |
| 09 | [Estimer sa consommation et son autonomie, sur papier](fiches/09-energie-bilan-papier.md) | energie | 0 | vert | papier, crayon, les étiquettes des appareils |

## Vague 2 — avec la station

| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |
| --- | --- | --- | --- | --- | --- |
| 10 | [Monter sa station CivZero sur un mini-PC de récupération](fiches/10-calcul-station-minipc.md) | calcul | 1, 2 | vert | un mini-PC ou un portable de récupération, une clé USB d'installation, un accès Internet pendant l'installation |
| 11 | [Mettre à jour la station par clé USB](fiches/11-calcul-maj-usb.md) | calcul | 1 | vert | une clé USB, un accès Internet ailleurs pour télécharger la nouvelle version |
| 12 | [Lire les fiches sans station](fiches/12-calcul-lire-sans-station.md) | calcul | 0 | vert | avoir copié l'archive des fiches sur l'appareil ou sur une clé |
| 13 | [Point d'accès Wi-Fi local](fiches/13-telecom-point-acces-local.md) *(en suspens)* | telecom | 1 | orange | la station montée ; selon la variante, une carte Wi-Fi compatible ou un routeur Wi-Fi du commerce |
| 14 | [Carte hors-ligne de sa région](fiches/14-telecom-carte-hors-ligne.md) | telecom | 0 | vert | Internet pour télécharger l'application et la carte de la région |
| 15 | [Repérer les ressources de son quartier](fiches/15-communs-ressources-quartier.md) | telecom | 0 | vert | du temps pour marcher le quartier ; la carte hors-ligne |

## Vague 3 — vers l'alternative

| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |
| --- | --- | --- | --- | --- | --- |
| 16 | [Mesure et protection d'un circuit 12 V — fusible et section de câble](fiches/16-energie-protection-12v.md) | energie | 1 | orange | fusibles et porte-fusible, câble de section adaptée, cosses, outil de sertissage, multimètre |
| 17 | [Alimenter la station depuis une batterie 12 V](fiches/17-energie-station-batterie.md) | energie | 1, 2 | orange | batterie 12 V, convertisseur continu-continu adapté, connecteur compatible avec la station, fusible |
| 18 | [Recharger une batterie 12 V avec un panneau et un régulateur](fiches/18-energie-recharge-solaire.md) | energie | 1, 2 | orange | panneau solaire, régulateur de charge adapté à la batterie, câbles, fusibles, multimètre |
| 19 | [Envoyer des messages texte par radio LoRa](fiches/19-telecom-lora-messages.md) | telecom | 2 | vert | deux modules LoRa compatibles Meshtastic, antennes 868 MHz, deux téléphones, Internet pour l'installation |
| 20 | [Mettre plusieurs stations LoRa en réseau](fiches/20-telecom-lora-reseau.md) | telecom | 2 | orange | au moins trois modules réglés (fiche précédente), un emplacement en hauteur, une alimentation pour le nœud fixe |
