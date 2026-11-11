# CivicNode — corpus de la phase 1 (bêta)

Toutes les fiches sont au statut **brouillon** et rédigées avec l'assistance d'une IA. Aucune n'est à appliquer comme sûre avant relecture. Voir `RELECTURE.md`.

## Les trois niveaux d'une fiche

Chaque fiche se situe sur trois axes, indépendants :

- **Temps de travail** (champ `horizon`, avec une estimation dans `temps`) : `instant` (Instant : quelques minutes, avec ce qui est là), `hours` (Hours / Heures : de l'heure au week-end de travail), `seasons` (Seasons / Saisons : des semaines, des mois, ou le temps du vivant). C'est une durée, pas un degré d'urgence.
- **Tier** (champ `tier`) : 0 rien d'autre que ce qui est sur place, 1 outils de base, 2 matériel spécialisé.
- **Risque** (champ `danger`) : vert, orange, rouge, selon les libellés du Nodule Zéro. C'est le niveau du **geste principal** de la fiche. Une variante plus risquée garde son propre niveau dans `variantes` et elle est signalée à côté (« vert, variante orange ») : on ne cache rien, on n'alarme pas pour rien.

Le champ `horizon` remplace l'ancien champ `mode` (« Je prépare » / « Ça a coupé »), supprimé le 10/11/2026 avec la section « Entre les deux modes ». Toutes les fiches l'ont.

`catalogue.csv` liste les 118 fiches prévues, en dix socles (Lichen, Ambre, Source, Graine, Écorce, Baume, Mycélium, Humus, Pollen, Strate), avec les niveaux, la couche écologique, le rapport au vivant (prélève, préserve, régénère) et l'erreur du passé évitée. C'est la liste de travail de l'agent d'adaptation.

## Vague 1 — sans station ni achat

| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |
| --- | --- | --- | --- | --- | --- |
| 00 | [Nodule Zéro — principes et sécurité](fiches/00-nodule-zero.md) | socle | 0, 1, 2 | sans-objet | rien |
| 01 | [Lire une étiquette — batterie, chargeur, appareil](fiches/01-energie-lire-etiquette.md) | energie | 0 | vert | rien |
| 02 | [Se servir d'un multimètre — tension et continuité](fiches/02-energie-multimetre.md) | energie | 1 | orange | un multimètre (récupération ou bas de gamme) et sa pile |
| 03 | [Garder un téléphone chargé pendant une coupure](fiches/03-energie-telephone-coupure.md) | energie | 0, 1 | vert (variante voiture orange) | une batterie externe chargée et un câble ; en option un adaptateur USB pour prise 12 V de voiture |
| 04 | [Préparer une coupure de 72 heures — énergie et communication](fiches/04-socle-coupure-72h.md) | socle | 0 | vert | rassembler le matériel ; quelques achats possibles (lampes, piles, radio) |
| 05 | [Plan de communication entre proches et voisins](fiches/05-telecom-plan-communication.md) | telecom | 0 | vert | une réunion avec les personnes concernées, du papier |
| 06 | [Que faire d'une batterie ou d'un appareil hors d'usage](fiches/06-energie-fin-de-vie.md) | energie | 0 | orange | rien |
| 07 | [Écoute radio pour s'informer](fiches/07-telecom-ecoute-radio.md) | telecom | 0 | vert | un poste radio à piles, à manivelle ou solaire, et des piles |
| 08 | [Passer des fiches de téléphone à téléphone](fiches/08-telecom-partage-telephone.md) | telecom | 0 | vert | avoir déjà les fiches (archive HTML ou fichier Kiwix) sur au moins un téléphone |
| 21 | [Trouver où recharger son téléphone pendant une coupure](fiches/21-energie-trouver-recharge.md) | energie | 0 | vert (variante groupe électrogène orange) | un câble et un chargeur ; savoir où sont la mairie et les lieux d'accueil |
| 22 | [Recharger son téléphone avec les batteries de la maison](fiches/22-energie-recharge-sous-la-main.md) | energie | 0, 1 | vert (variante batterie d'outil orange) | un câble ; un appareil à batterie chargé ou un adaptateur USB pour batterie d'outil |
| 23 | [Recharger son téléphone avec un petit panneau solaire USB](fiches/23-energie-panneau-usb.md) | energie | 0 | vert | un panneau solaire pliable à sortie USB ; idéalement une batterie externe |
| 24 | [Recharger son téléphone à la manivelle](fiches/24-energie-manivelle.md) | energie | 0 | vert | une radio, une lampe ou un chargeur à manivelle avec sortie USB |
| 09 | [Estimer sa consommation et son autonomie, sur papier](fiches/09-energie-bilan-papier.md) | energie | 0 | vert | papier, crayon, les étiquettes des appareils |

## Vague 2 — avec la station

| # | Fiche | Bloc | Tier | Danger estimé | Exige d'avance |
| --- | --- | --- | --- | --- | --- |
| 10 | [Monter sa station CivicNode sur un mini-PC de récupération](fiches/10-calcul-station-minipc.md) | calcul | 1, 2 | vert | un mini-PC ou un portable de récupération, une clé USB d'installation, un accès Internet pendant l'installation |
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
| 25 | [Recharger son téléphone avec la dynamo d'un vélo](fiches/25-energie-dynamo-velo.md) | energie | 1 | orange | un moyeu-dynamo, un chargeur USB pour dynamo avec batterie tampon, de quoi démonter une roue |
| 26 | [Fabriquer une génératrice à pédales pour recharger](fiches/26-energie-generatrice-pedales.md) | energie | 2 | orange | vélo sur support à rouleau, moteur récupéré, diode, régulateur, batterie 12 V, fusibles, multimètre |
| 20 | [Mettre plusieurs stations LoRa en réseau](fiches/20-telecom-lora-reseau.md) | telecom | 2 | orange | au moins trois modules réglés (fiche précédente), un emplacement en hauteur, une alimentation pour le nœud fixe |

## Question : « Comment recharger mon téléphone sans électricité ? »

Ce que le corpus propose, de l'instant aux saisons. Les fiches 21 à 26 sont des brouillons, pas encore ouverts dans la démo.

| Temps | Solution | Fiche | Tier | Risque |
| --- | --- | --- | --- | --- |
| instant | Faire durer la charge (mode avion, écran) | 03, étapes 1-2 | 0 | vert |
| instant | Trouver une prise qui marche encore | 21 | 0 | vert, orange chez un voisin à groupe électrogène |
| instant | Ordinateur portable, onduleur, vélo électrique, batterie d'outil | 22 | 0, 1 | vert, orange pour les batteries d'outils |
| heures | Batterie externe, voiture | 03, étapes 3-4 | 0, 1 | vert, orange pour la voiture |
| heures | Petit panneau solaire USB | 23 | 0 | vert |
| heures | Manivelle (radio, lampe, chargeur) | 24, et 07 pour la radio | 0 | vert |
| heures | Dynamo de vélo et chargeur USB | 25 | 1 | orange |
| heures | Panneau solaire, régulateur et batterie 12 V | 18, puis 17 | 1, 2 | orange |
| saisons | Génératrice à pédales | 26 | 2 | orange |

Pistes écartées pour la bêta : générateur thermoélectrique sur un réchaud (matériel spécifique, peu répandu), piles assemblées à la main (risque d'incendie), « batteries » de fruits ou de légumes (énergie dérisoire).

## Structure et gabarit (bascule du 10/11/2026)

**Structure.** `structure.yaml` décrit les familles, les onze socles (dont Spore, ajouté ensuite) (nom, domaine, explication du nom, en anglais et en français), leurs domaines et leurs savoirs (titre, principe commun). Chaque fiche se rattache à un ou plusieurs savoirs. `prevues.yaml` liste les fiches prévues, pas encore écrites ; il est tiré de `catalogue.csv` et ces fiches apparaissent en pointillés dans leurs savoirs. `besoins.yaml` (ancien entonnoir) n'est plus utilisé.

**Champs ajoutés au gabarit :**

- `socle` : le socle d'origine (`commencer` pour le Nodule Zéro et la fiche 72 heures).
- `savoirs` : la liste des savoirs auxquels la fiche appartient ; le premier est le principal.
- `provenance` : les sources adaptées, une entrée par source : `titre`, `auteur`, `source` (le lien), `licence`, `modifie` (vrai si adaptée). Seuls le domaine public, CC BY et CC BY-SA peuvent entrer dans le texte d'une fiche.
- `attestations` : `type` (testée, réalisée, confirmée), `par` (nom ou pseudonyme, publié seulement avec l'accord de la personne), `competence` (par exemple « ingénieure agronome »), `date`, `contexte`.
- `medias` : `fichier`, `type` (image, schema, video), `legende` (`fr` et `en`), `titre`, `auteur`, `source`, `licence`, et `etape` pour un média propre à une étape.

Ces champs sont vides pour l'instant ; le site affiche les sections dès qu'ils sont remplis.

**Une fiche, une méthode.** Les variantes d'un même geste restent dans la même fiche ; une méthode différente (autre matériel, autre danger) devient sa propre fiche. La fiche 03 a ainsi perdu sa partie voiture, devenue la fiche 27, *Recharger son téléphone à la voiture*.

**Traductions.** Le site est en anglais à la racine et en français dans `fr/`, avec un bouton de langue sur chaque page. Une fiche traduite est dans `fiches/en/`, sous le même nom de fichier : son en-tête ne contient que les champs à traduire (`titre`, `accroche`, `temps`, `exige_avance`), les autres restent ceux de la fiche française. Les repères du texte sont en anglais : `### Step 1: …`, `- **Action:**`, `- **Check:**`, `- **Source:**`, `Risks specific to this skill:`, `**LEVEL: GREEN (circle)**`. Depuis le 10/11/2026, les 28 fiches écrites sont traduites ; `fiches/en/titres.yaml` ne sert plus que de secours pour une nouvelle fiche pas encore traduite. Les traductions sont des brouillons, comme le reste.

## Socle Spore : les pistes (10/11/2026)

Un onzième socle, **Spore**, dans une cinquième famille, **Explorer**. Il ne contient pas de fiches mais des **pistes** : des idées, des prototypes et des recherches en cours, sobres, bas carbone et à portée de main, qui deviendront peut-être des fiches. La spore attend le bon endroit pour germer.

Une piste est un fichier de `pistes/` (traduction dans `pistes/en/`, même nom de fichier, en-tête limité à `titre`, `accroche` et, si besoin, `acteurs`). En-tête : `id`, `titre`, `accroche`, `socle: spore`, `savoirs` (au moins un), `maturite` (`idee`, `prototype`, `terrain`, `documentee`), `acteurs` (`nom`, `lieu`, `url`), `provenance`, `maj`. Six sections, sans étapes : `## 1. L'idée`, `## 2. Où on en est`, `## 3. Qui y travaille`, `## 4. Questions ouvertes`, `## 5. Comment contribuer`, `## 6. Vigilance`. Quand la méthode est prête et testée, la piste devient une fiche.

Chaque piste a sa page (`p-<id>`), le socle Spore les range par maturité, et chaque savoir lié les affiche dans une section « En recherche ». Trois premières pistes :

- **Recycler l'urine en engrais** (testée sur le terrain) : programme OCAPI, essais au champ depuis 2024.
- **Isoler avec du mycélium** (prototype) : Station Hyphae en Normandie, panneaux paille et pleurote en Charente.
- **Un vieux smartphone comme station de savoirs de poche** (prototype) : Kiwix sur un téléphone de récupération.

## Savoirs : principe, ordre, tableau de choix

Les 45 savoirs ont maintenant leur **principe** (ce que toutes leurs fiches ont en commun), en français et en anglais. Certains ont aussi un **ordre** de combinaison (`ordre` dans `structure.yaml`), affiché sous le principe. La page d'un savoir présente ses fiches dans un **tableau de choix** : temps, tier, danger (et variante plus risquée), ce qu'il faut d'avance, coût et matériel, rapport au vivant. Coût, matériel et vivant viennent de `catalogue.csv` (par le numéro pour une fiche écrite, par le titre pour une fiche prévue).

L'assistant ouvre un panorama de solutions par le principe du savoir qu'il couvre, cité tel quel, avec un lien vers la page du savoir. Il ne l'affiche que si ce savoir porte au moins deux des fiches proposées.

## Vérifier avant de publier

    npm run verifier    # contrôle le corpus : champs, valeurs permises, savoirs, traductions, licences
    npm test            # le vérificateur, puis les tests du site et de l'assistant

Le vérificateur tourne aussi tout seul avant chaque `npm run build` et `npm run station`, et GitHub lance `npm test` avant chaque publication : si une erreur est trouvée, le site en ligne reste sur la version précédente. Une erreur bloque (le site serait faux) ; un avertissement signale ce qui est à corriger sans bloquer.
