# Contribuer à CivicNode

CivicNode grandit par la reproduction : une fiche ne vaut que si d'autres personnes l'ont refaite, ailleurs, avec un autre matériel.

## 1. Tester une fiche

1. **Lisez le Nodule Zéro** (`corpus/fiches/00-nodule-zero.md`), prérequis de toutes les fiches.
2. **Commencez par une fiche verte de la vague 1** : plan de communication, préparation d'une coupure de 72 heures, écoute radio, ressources du quartier. Elles ne demandent ni électricité ni achat.
3. **Suivez la fiche étape par étape**, sans improviser. Si une étape vous paraît fausse ou dangereuse, arrêtez-vous et signalez-la.
4. **Envoyez un rapport**, depuis le bouton « Faire un rapport » de chaque fiche :
   - sur GitHub, avec le modèle **Rapport de reproduction** ;
   - ou par e-mail, à hello@civicnode.eu, si vous n'avez pas de compte GitHub.

Un échec est aussi utile qu'une réussite. Dans un rapport, ne mettez ni nom de famille, ni adresse, ni information sur une autre personne.

## 2. Les statuts d'une fiche

**Principe : nous ne créons pas le savoir, nous le mettons en forme.** Une fiche *adaptée* reprend, en étapes, ce que dit une source qui fait autorité (CDC, Wikipédia, organismes publics). La vérifier, c'est d'abord vérifier qu'elle est **fidèle** à ses sources : pas mot pour mot, puisque nous reformulons, mais sans rien changer au sens, sans chiffre ni geste ajouté, sans précaution retirée. Une fiche *créée* par CivicNode, sans source qui fasse autorité, se vérifie par le test.

| Statut | Ce qu'il faut pour l'obtenir |
| --- | --- |
| `brouillon` | La fiche existe. Toute fiche rédigée avec une IA entre à ce statut. |
| `verifiee-ia` | Fiche adaptée seulement. Une **autre IA** que celle qui a rédigé l'a comparée, étape par étape, aux copies de ses sources, et sa relecture conclut « conforme ». |
| `fidele` | Une personne a confirmé la relecture IA et signé une attestation de fidélité. |
| `relue` | Fiche orange ou rouge : une personne compétente du domaine l'a relue (deux pour une fiche rouge). |
| `testee` | Quelqu'un d'autre que l'auteur l'a suivie en entier et a envoyé un rapport. |
| `reproduite` | Trois personnes distinctes l'ont reproduite, rapports à l'appui. |

### Le statut « vérifiée par IA »

C'est la troisième des quatre relectures d'une fiche adaptée, après la rédaction (qui liste chaque chiffre et sa source) et le vérificateur (qui contrôle la forme, les licences, la source de chaque étape et cherche chaque chiffre dans les copies des sources). Elle obéit à quatre règles :

1. **Une autre IA.** La relecture est faite par un autre modèle, ou au moins une autre conversation, que la rédaction, pour ne pas partager ses angles morts.
2. **Les copies des sources, rien d'autre.** Elle compare la fiche aux copies enregistrées dans `agent/sources/` (faites par `npm run sources`), sans s'appuyer sur ce qu'elle croit savoir. Sans copie, elle ne juge pas.
3. **Un verdict détaillé.** Pour chaque étape : conforme, écart, ajout ou sans source ; pour chaque chiffre : trouvé ou non ; et les précautions de la source absentes de la fiche. Un chiffre non trouvé mais marqué « À VALIDER » dans la même phrase est un manque déclaré, laissé à la personne qui confirme.
4. **Un verdict recalculé.** Le programme ne croit pas la conclusion du modèle : il la recalcule à partir du détail. Une seule réserve suffit pour « à corriger ».

La relecture IA est fiable sans être infaillible : elle peut manquer un glissement de sens subtil. Elle ne remplace donc pas la personne qui confirme, elle lui facilite le travail. Elle produit une liste (`agent/relectures/<fiche>.md`) : les points à trancher, puis chaque étape avec le passage de la source, à contrôler au hasard. Comptez un quart d'heure par fiche. La consigne complète est dans `agent/RELECTURE.md`, et le site l'explique au public sur la page « Nos sources et notre méthode ».

## 3. Sécurité

- Les libellés des niveaux de danger (vert, orange, rouge) sont définis une seule fois, dans le Nodule Zéro. Aucune fiche ne les réécrit.
- Les fiches orange se font à deux.
- Les fiches marquées **relecture obligatoire** touchent une batterie. Les valeurs notées « proposition reçue » dans leurs marqueurs `[À VALIDER : …]` sont des pistes pour le relecteur, **pas des consignes**.
- Pour signaler une étape dangereuse, utilisez le modèle GitHub **Signaler un problème de sécurité**. Ces signalements sont traités en premier.

## 4. Proposer ou corriger une fiche

- Gardez le gabarit : l'en-tête et les cinq sections (Principe, Sécurité, Pas-à-pas, Si ça coince, Ressource). Partez d'une fiche existante.
- Chaque étape porte une action, une vérification et une source.
- Laissez un trou marqué `[À VALIDER : …]` plutôt qu'un chiffre que vous n'avez pas vérifié.
- Rattachez la fiche à un ou plusieurs savoirs de `corpus/structure.yaml`, et indiquez son origine (`adaptee` ou `creee`).
- La méthode complète, licences comprises, est dans `agent/METHODE.md`.
- Lancez `npm test` avant d'envoyer : il signale les champs, sections, sources ou licences qui manquent. Puis `npm run build && npm run preview` pour voir la fiche dans le site.

## 5. Ce que le projet n'accepte pas

- Toute intervention sur le 230 V sous tension, l'ouverture d'un appareil branché ou d'un bloc d'alimentation.
- La pyrolyse, les gazogènes et toute combustion produisant des gaz.
- Les gestes médicaux.
- Tout accès aux réseaux électriques, aux réseaux de données ou aux fréquences d'autrui.
- Toute donnée personnelle sur une personne sans son accord.

## 6. Relecteurs recherchés

- **Bénévoles pour confirmer la fidélité** des fiches vérifiées par IA : aucune compétence technique n'est demandée, seulement de l'attention (voir la seconde partie de `agent/RELECTURE.md`).

- **Électricien ou formateur** connaissant les batteries et la très basse tension : Nodule Zéro et fiches de la vague 3.
- **Secouriste ou formateur aux premiers secours** : conduites à tenir du Nodule Zéro.

Le cahier `corpus/RELECTURE.md` liste chaque point à trancher.

## 7. Licences

En contribuant, vous acceptez que vos contributions aux fiches soient publiées sous CC BY-SA 4.0, et vos contributions au code sous AGPL-3.0.
