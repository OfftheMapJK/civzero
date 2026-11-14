# CivicNode : dossier pour la recherche de logo

*A knowledge station for the interstices · Une station de savoirs pour les interstices.*
État au 12 novembre 2026. Préparé par la conversation Chantier pour la conversation Design.

## En une phrase

CivicNode est une station de savoirs hors-ligne : des fiches pratiques, sourcées et vérifiées, pour boire, se chauffer, se soigner, communiquer et s'organiser quand les réseaux manquent. Elles sont servies par un petit ordinateur (un Raspberry Pi, un vieux portable) à tout un quartier, par son propre Wi-Fi.

## Cinq mots clés

1. **Interstice** : vivre et agir dans les espaces que les grands systèmes laissent vides, et quand ils flanchent.
2. **Hors-ligne** : tout marche sans Internet, sans compte et sans abonnement.
3. **Communs** : le savoir est libre (CC BY-SA), partagé, amélioré par ceux qui l'utilisent.
4. **Vérifié** : chaque geste cite sa source, est relu, puis testé par des humains.
5. **Vivant** : un réseau sans centre, qui pousse par le bas, comme un mycélium.

## Philosophie

CivicNode part d'un constat simple : le savoir qui permet de tenir, comme rendre l'eau potable, garder du courant, soigner une plaie ou joindre ses voisins, est aujourd'hui rangé dans des serveurs lointains. Il disparaît précisément au moment où l'on en a besoin. Nous ne créons pas ce savoir, nous le mettons en forme. Nous allons le chercher dans les sources ouvertes qui font autorité, nous le rendons faisable par n'importe qui, étape par étape, avec ses précautions, et nous le gardons au plus près des gens, dans une boîte qui tient dans la main. Rien n'est caché : chaque fiche dit d'où elle vient, ce qui reste à vérifier et qui l'a relue. La technique y est sobre, libre et réparable, au service du geste et jamais l'inverse.

## Ambition

Faire de chaque quartier, chaque village, chaque tiers-lieu un nœud autonome de savoir : une station qui sert les fiches, une encyclopédie, des cartes, un assistant qui répond sans Internet et les logiciels libres pour passer à l'action. Les stations se relient entre elles par radio et par Wi-Fi, comme les filaments d'un mycélium. Elles s'enrichissent des essais de chacun et passent d'une main à l'autre sur une clé USB. CivicNode veut devenir l'infrastructure civique minimale d'une époque instable : un commun européen, ouvert, que n'importe qui peut copier, monter et améliorer, et qui rend chaque personne un peu plus capable, et chaque collectif un peu moins dépendant.

## Ce qu'il y a dans le projet aujourd'hui

- **41 fiches** écrites, en français et en anglais, et une centaine de fiches prévues.
- **Thèmes :** l'eau (bouillir, chlorer, filtrer, stocker, récupérer la pluie), l'énergie (recharger un téléphone, batterie 12 V, solaire), les réseaux (radio, LoRa, Wi-Fi maillé), la station elle-même (Raspberry Pi), la mesure (cuve avec un ESP32), la réception des satellites météo.
- **Une chaîne de vérification :** brouillon, vérifiée par IA, fidèle à ses sources, testée, puis reproduite par d'autres.
- **Un assistant local** qui répond à partir des fiches, sans Internet.
- **Un bouton « Écouter »** sur les fiches : lecture à voix haute par le navigateur, pour ceux qui lisent mal ou ont les mains occupées.
- **Nouveau, la logithèque hors-ligne :** la station proposera aussi au téléchargement les logiciels libres qu'utilisent les fiches (Kiwix, Briar, Meshtastic, Organic Maps, KeePassXC, LibreOffice…), avec de quoi vérifier qu'ils sont authentiques.
- **Collaboration envisagée avec Kiwix** (Wikipédia hors-ligne) : collaborer plutôt que dupliquer.
- **Site :** https://civicnode-eu.github.io/civicnode/

## L'univers des socles

Le savoir est rangé en onze « socles » aux noms tirés du vivant. C'est le vocabulaire visuel naturel du projet.

| Famille | Socle | Domaine | Ce que dit le nom |
| --- | --- | --- | --- |
| Le sol | **Lichen** | Le vivant, la régénération | Un champignon et une algue qui ne vivent bien qu'ensemble ; pionnier sur la roche nue |
| Subsister | **Ambre** | Énergie | *Êlektron*, l'ambre : la première électricité observée |
| Subsister | **Source** | Eau, hygiène | Ce qui jaillit, se partage et se protège |
| Subsister | **Graine** | Alimentation | Elle contient la récolte suivante, si on la garde |
| Subsister | **Écorce** | Habitat | Protège du froid, du chaud, parfois du feu |
| Subsister | **Baume** | Soins, entraide | Ce qui apaise et répare ; le geste de l'autre |
| Relier | **Mycélium** | Réseaux, télécoms | Le réseau souterrain qui relie les arbres ; un réseau sans centre |
| Relier | **Humus** | Communs | Le sol fertile fait de ce que chacun dépose ; « humain » et « humus », même racine |
| Relier | **Pollen** | Culture, arts | Ce qui passe de l'un à l'autre et féconde |
| Transmettre | **Strate** | Savoirs, archive | Les couches qui gardent la mémoire de la Terre |
| Explorer | **Spore** | Pistes, recherches | Minuscule, portée par le vent, elle attend le bon endroit pour germer |

## Codes visuels déjà en place

- **Niveaux de danger :** vert (cercle), orange (triangle), rouge (moratoire). Ils sont doublés par une forme, pour ne jamais reposer sur la couleur seule.
- **Statuts :** brouillon et « vérifiée par IA » sont affichés en hachuré ; les statuts confirmés par des humains en plein.
- **Mode sombre** pris en charge ; schémas en traits noirs sur fond blanc, avec des numéros plutôt que des mots.

## Contraintes pour le logo

- **Lisible en très petit** (icône d'onglet de 16 px, écran de station) et en très grand (affiche, autocollant sur la boîte).
- **Fonctionne en une seule couleur**, en noir et blanc, à l'imprimante de bureau comme au pochoir ou à la gravure : il doit pouvoir être reproduit à la main.
- **Tient en SVG simple**, sans dégradé indispensable, pour peser quelques kilo-octets et s'afficher hors-ligne sur un vieil appareil.
- **Polices libres** seulement (licence OFL ou équivalente), embarquées dans la station.
- **Bilingue** : le nom CivicNode ne se traduit pas, mais la devise existe en français et en anglais.
- **Ni militaire, ni survivaliste, ni « tech start-up » :** chaleureux, civique, vivant, sérieux sans être austère.
- **Statut : une marque** (décidé le 12/11/2026). Les contenus du projet sont en CC BY-SA 4.0, mais le nom et le logo seront protégés comme une marque, avec une politique d'usage généreuse : ils garantissent que les fiches ont été vérifiées. Le logo doit donc être net, distinctif et déposable (INPI, puis EUIPO), pas une simple forme générique.

## Pistes de symboles, à explorer et non imposées

- **Le nœud** (le *node* de CivicNode) : un point d'où partent des filaments, qui évoque à la fois le mycélium et le réseau maillé.
- **La station** : une petite boîte, une lampe, un abri, un point d'eau sur une carte.
- **La strate et la graine :** le savoir qu'on garde et qu'on transmet.
- **L'interstice :** une forme qui pousse dans une fente, entre deux blocs.
