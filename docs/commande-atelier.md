# Commande de la prochaine vague pour l'Atelier

Établie le 13/11/2026 par Claude Code (le Chantier), à la demande de Julien. Elle liste les fiches prévues de `corpus/prevues.yaml` que pourraient nourrir Appropedia, Akvopedia et le wiki d'Open Source Ecology (OSE), avec la page source la plus probable, classées par utilité. Ce document n'est pas lu par le site.

## À lire avant de commencer

- **Ce qui a été vérifié :** l'existence des pages, le 12/11/2026. Pour Appropedia, par son moteur de recherche ; le nombre entre parenthèses est le nombre de mots de la page, pour juger de sa richesse. Pour OSE, en ouvrant chaque page.
- **Ce qui ne l'a pas été :** le contenu des pages (une page longue n'est pas forcément un bon pas-à-pas) et la licence de chaque page. La licence se lit sur la page elle-même, avec sa date (`agent/METHODE.md`, section 2).
- **Documents de tiers hébergés par Appropedia :** les pages « Practical Action/… » et « Solar and Energy Conserving Food Technologies/… » viennent d'autres organisations. Leur licence peut différer de celle du site : la lire avant toute adaptation.
- **Akvopedia :** le site ne se lit pas par les scripts (contrôle anti-robot, non contourné). Aucun titre de page n'est donc cité ici. Elle est probable pour les fiches eau marquées « Akvopedia : à ouvrir à la main ». Texte sous CC BY-SA 3.0, images à lire fichier par fichier, « Akvopedia » et « Akvo » sont des marques (voir `agent/METHODE.md`, « Sources déjà vérifiées »).
- **Le classement** est un jugement (besoin courant, niveau de danger, richesse de la source), pas une mesure.
- Une fiche orange demande en plus une relecture par une personne compétente. Les deux fiches rouges hors corpus (chauffage au bois, cellules lithium) sont écartées.

## 0. En tête : « Vérifier qu'un logiciel téléchargé est authentique »

Identifiant : `verifier-logiciel-telecharge-authentique` (vert, vague 2, savoir « Une logithèque hors-ligne »).

Aucune des trois sources ne la couvre. Source proposée : Wikipédia en français (CC BY-SA 4.0, déjà vérifiée adaptable).

- https://fr.wikipedia.org/wiki/Somme_de_contrôle
- https://fr.wikipedia.org/wiki/Fonction_de_hachage_cryptographique
- https://fr.wikipedia.org/wiki/Signature_numérique
- https://fr.wikipedia.org/wiki/GNU_Privacy_Guard
- https://fr.wikipedia.org/wiki/Empreinte_de_clé_publique

Ces pages expliquent le principe, pas les gestes. Les étapes (calculer une empreinte, la comparer, vérifier une signature) seront sans doute à créer et à tester : la fiche serait alors `origine: creee`, avec ses parties sourcées relues.

## 1. Premier rang : besoin courant, source solide

| # | Fiche prévue (identifiant) | Danger, vague | Pages les plus probables |
| --- | --- | --- | --- |
| 1 | Se laver les mains avec très peu d'eau (`se-laver-mains-tres-peu`) | vert, 1 | Appropedia : [Tippy tap](https://www.appropedia.org/Tippy_tap) (362), [Handwashing](https://www.appropedia.org/Handwashing) (282). Akvopedia : à ouvrir à la main. |
| 2 | Garder au frais sans électricité : le frigo du désert (`garder-frais-electricite-frigo-desert`) | vert, 1 | Appropedia : [Zeer pot refrigerator](https://www.appropedia.org/Zeer_pot_refrigerator) (684), [Zeer pot refrigerator/Design](https://www.appropedia.org/Zeer_pot_refrigerator/Design) (3 998). |
| 3 | Cuire avec une marmite norvégienne (`cuire-marmite-norvegienne`) | vert, 1 | Appropedia : [Fireless cookers](https://www.appropedia.org/Fireless_cookers) (1 150). |
| 4 | Faire un compost (`faire-compost`) | vert, 1 | Appropedia : [Composting](https://www.appropedia.org/Composting) (4 068) ; document de tiers : [Practical Action/Compost bin](https://www.appropedia.org/Practical_Action/Compost_bin) (1 014). |
| 5 | Réutiliser l'eau et se passer de la chasse d'eau (`reutiliser-eau-sans-chasse`) | vert, 1 | Appropedia : [Greywater](https://www.appropedia.org/Greywater) (909). OSE : [Greywater](https://wiki.opensourceecology.org/wiki/Greywater). Akvopedia : à ouvrir à la main. |
| 6 | Cuire au soleil : le cuiseur solaire (`cuire-soleil-cuiseur-solaire`) | orange, 3 | Appropedia : [Solar cooker](https://www.appropedia.org/Solar_cooker) (3 047). |
| 7 | Construire un filtre à sable lent (`construire-filtre-sable-lent`) | orange, 3 | Akvopedia : à ouvrir à la main (source la plus probable). Appropedia : [Slow sand filtration](https://www.appropedia.org/Slow_sand_filtration) (429), [OHorizons BioSand Filter](https://www.appropedia.org/OHorizons_BioSand_Filter) (1 576) ; document de tiers : [Practical Action/Slow sand filtration water treatment plants](https://www.appropedia.org/Practical_Action/Slow_sand_filtration_water_treatment_plants) (6 273). |
| 8 | Installer des toilettes sèches (`installer-toilettes-seches`) | orange, 3 | Appropedia : [Composting toilet](https://www.appropedia.org/Composting_toilet) (4 439). OSE : [Composting Toilet](https://wiki.opensourceecology.org/wiki/Composting_Toilet). Akvopedia : à ouvrir à la main. |
| 9 | Traiter ses eaux grises simplement (`traiter-eaux-grises-simplement`) | orange, 3 | Appropedia : [Greywater](https://www.appropedia.org/Greywater) (909). OSE : [Greywater](https://wiki.opensourceecology.org/wiki/Greywater). Akvopedia : à ouvrir à la main. |
| 10 | Construire et enduire en terre crue (`construire-enduire-terre-crue`) | orange, 3 | OSE : [Earth Plaster](https://wiki.opensourceecology.org/wiki/Earth_Plaster), [Compressed Earth Block](https://wiki.opensourceecology.org/wiki/Compressed_Earth_Block). Appropedia, document de tiers : [Practical Action/Mud plasters and renders](https://www.appropedia.org/Practical_Action/Mud_plasters_and_renders) (1 966). |

## 2. Second rang : utile, source correcte

| Fiche prévue (identifiant) | Danger, vague | Pages les plus probables |
| --- | --- | --- |
| Sécher ses aliments à l'air et au soleil (`secher-aliments-air-soleil`) | vert, 2 | Appropedia, document de tiers : [Solar and Energy Conserving Food Technologies/Model solar food dryer: design and construction](https://www.appropedia.org/Solar_and_Energy_Conserving_Food_Technologies/Model_solar_food_dryer:_design_and_construction) (3 437). |
| Cultiver un petit potager en bacs ou en buttes (`cultiver-petit-potager-bacs-ou`) | vert, 3 | Appropedia : [Raised bed gardens](https://www.appropedia.org/Raised_bed_gardens) (615), [Keyhole garden](https://www.appropedia.org/Keyhole_garden) (119). |
| Isoler avec des matériaux biosourcés de récupération (`isoler-materiaux-biosources-recuperation`) | orange, 3 | Appropedia : [Straw bale construction](https://www.appropedia.org/Straw_bale_construction) (906), [Thermal insulation](https://www.appropedia.org/Thermal_insulation) (2 321). |
| Garder la chaleur sans chauffage (`garder-chaleur-chauffage`) | vert, 1 | Appropedia : [Passive solar design](https://www.appropedia.org/Passive_solar_design) (1 890), [Thermal mass](https://www.appropedia.org/Thermal_mass) (323). |
| Garder le frais sans climatisation (`garder-frais-climatisation`) | vert, 1 | Appropedia : [Evaporative cooling](https://www.appropedia.org/Evaporative_cooling) (3 327). |
| Teindre avec les plantes (`teindre-plantes`) | orange, 3 | Appropedia : [Natural dyeing of textiles](https://www.appropedia.org/Natural_dyeing_of_textiles) (4 085). |
| Imprimer une pièce détachée en 3D (`imprimer-piece-detachee-3d`) | vert, 3 | Appropedia : [3D printing](https://www.appropedia.org/3D_printing) (880). OSE : [3D Printer](https://wiki.opensourceecology.org/wiki/3D_Printer). |
| Dessiner une pièce à fabriquer avec FreeCAD (`dessiner-piece-fabriquer-freecad`) | vert, 3 | OSE : [FreeCAD](https://wiki.opensourceecology.org/wiki/FreeCAD). |
| Monter un abri temporaire (`monter-abri-temporaire`) | orange, 2 | Appropedia : [Hexayurt project](https://www.appropedia.org/Hexayurt_project) (1 231). |
| Accueillir les pollinisateurs (`accueillir-pollinisateurs`) | vert, 2 | Appropedia : [Making a bee hotel](https://www.appropedia.org/Making_a_bee_hotel) (499). |
| Apprendre à souder (`apprendre-souder`) | orange, 2 | Appropedia : [Soldering and Tinning:MOST](https://www.appropedia.org/Soldering_and_Tinning:MOST) (530), [Hard soldering](https://www.appropedia.org/Hard_soldering) (1 078). Compris ici comme la soudure électronique à l'étain ; à confirmer par Julien. |

## 3. Sources trop minces pour porter une fiche seules

À compléter par une autre source ouverte avant d'écrire.

- Lacto-fermenter ses légumes : Appropedia [Lacto-fermentation](https://www.appropedia.org/Lacto-fermentation) (249).
- Faire des conserves en bocaux (orange) : Appropedia, document de tiers, [Practical Action/Canning of foods](https://www.appropedia.org/Practical_Action/Canning_of_foods) (638).
- Régénérer un sol abîmé : Appropedia [Green manure](https://www.appropedia.org/Green_manure) (447).
- Petite éolienne de récupération (orange) : Appropedia [Small wind turbine](https://www.appropedia.org/Small_wind_turbine) (300) ; OSE [Wind Turbine](https://wiki.opensourceecology.org/wiki/Wind_Turbine).
- Stocker ses récoltes en cave ou en silo : Appropedia [Root cellar](https://www.appropedia.org/Root_cellar) (263).
- S'éclairer sans réseau, en sécurité : Appropedia [Lighting](https://www.appropedia.org/Lighting) (1 134) ; document de tiers [Practical Action/Rural lighting](https://www.appropedia.org/Practical_Action/Rural_lighting) (1 624).

## 4. Rien d'exploitable trouvé dans ces trois sources

Semences, poules, mare, haie champêtre, repair café, bibliothèque d'objets, vannerie, poterie, antenne Wi-Fi directionnelle. Ces fiches demandent d'autres sources.
