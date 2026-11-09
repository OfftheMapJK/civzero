# Contribuer à CivZero

CivZero grandit par la reproduction : une fiche ne vaut que si d'autres personnes l'ont refaite, ailleurs, avec un autre matériel.

## 1. Tester une fiche

1. **Lisez le Nodule Zéro** (`corpus/fiches/00-nodule-zero.md`), prérequis de toutes les fiches.
2. **Commencez par une fiche verte de la vague 1** : plan de communication, préparation d'une coupure de 72 heures, écoute radio, ressources du quartier. Elles ne demandent ni électricité ni achat.
3. **Suivez la fiche étape par étape**, sans improviser. Si une étape vous paraît fausse ou dangereuse, arrêtez-vous et signalez-la.
4. **Envoyez un rapport**, depuis le bouton « Faire un rapport » de chaque fiche :
   - sur GitHub, avec le modèle **Rapport de reproduction** ;
   - ou par e-mail, à l'adresse indiquée dans le site, si vous n'avez pas de compte GitHub.

Un échec est aussi utile qu'une réussite. Dans un rapport, ne mettez ni nom de famille, ni adresse, ni information sur une autre personne.

## 2. Les statuts d'une fiche

| Statut | Ce qu'il faut pour l'obtenir |
| --- | --- |
| `brouillon` | La fiche existe. Toute fiche rédigée ou assistée par une IA entre à ce statut. |
| `documentee` | Un humain a ouvert et vérifié chaque source, étape par étape. |
| `testee` | Quelqu'un l'a suivie en entier et a envoyé un rapport réussi. |
| `reproduite-x3` | Trois personnes distinctes l'ont reproduite, rapports à l'appui. |

## 3. Sécurité

- Les libellés des niveaux de danger (vert, orange, rouge) sont définis une seule fois, dans le Nodule Zéro. Aucune fiche ne les réécrit.
- Les fiches orange se font à deux.
- Les fiches marquées **relecture obligatoire** touchent une batterie. Les valeurs notées « proposition reçue » dans leurs marqueurs `[À VALIDER : …]` sont des pistes pour le relecteur, **pas des consignes**.
- Pour signaler une étape dangereuse, utilisez le modèle GitHub **Signaler un problème de sécurité**. Ces signalements sont traités en premier.

## 4. Proposer ou corriger une fiche

- Gardez le gabarit : l'en-tête et les cinq sections (Principe, Sécurité, Pas-à-pas, Si ça coince, Ressource). Partez d'une fiche existante.
- Chaque étape porte une action, une vérification et une source.
- Laissez un trou marqué `[À VALIDER : …]` plutôt qu'un chiffre que vous n'avez pas vérifié.
- Rattachez la fiche à un besoin de `corpus/besoins.yaml`, ou proposez-en un nouveau.
- Lancez `python3 outils/build.py corpus` avant d'envoyer : il signale les champs ou sections manquants. Puis `npm run build` pour voir la fiche dans le site.

## 5. Ce que le projet n'accepte pas

- Toute intervention sur le 230 V sous tension, l'ouverture d'un appareil branché ou d'un bloc d'alimentation.
- La pyrolyse, les gazogènes et toute combustion produisant des gaz.
- Les gestes médicaux.
- Tout accès aux réseaux électriques, aux réseaux de données ou aux fréquences d'autrui.
- Toute donnée personnelle sur une personne sans son accord.

## 6. Relecteurs recherchés

- **Électricien ou formateur** connaissant les batteries et la très basse tension : Nodule Zéro et fiches de la vague 3.
- **Secouriste ou formateur aux premiers secours** : conduites à tenir du Nodule Zéro.

Le cahier `corpus/RELECTURE.md` liste chaque point à trancher.

## 7. Licences

En contribuant, vous acceptez que vos contributions aux fiches soient publiées sous CC BY-SA 4.0, et vos contributions au code sous AGPL-3.0.
