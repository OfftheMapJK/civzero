# Agent d'adaptation : méthode et périmètre

L'agent d'adaptation transforme une source ouverte en fiche CivicNode, au gabarit, en gardant le lien de chaque étape vers son passage source. Ce document est sa consigne : il vaut pour un humain qui adapte à la main comme pour un programme. Il applique le document de référence « Licences Creative Commons : référence CivicNode ». Ce n'est pas un avis juridique.

Version 1 (11/11/2026). Premier essai : les quatre fiches du savoir « Rendre l'eau potable » (28 à 31).

## 1. Le périmètre : droit d'auteur et copyleft

- **Le droit d'auteur protège une formulation, pas un savoir.** Un fait, une idée, une méthode, une durée d'ébullition ne sont pas protégés ; la phrase, le plan, les illustrations d'un document le sont.
- **Le copyleft (CC BY-SA, ODbL)** autorise à adapter, à condition que l'adaptation reste sous la même licence. C'est pourquoi les fiches sont sous CC BY-SA : elles peuvent reprendre Wikipédia, et tout ce qui en dérive reste ouvert.
- **Une fiche est une adaptation** dès qu'elle reprend, réorganise, découpe ou traduit le texte d'une source. Elle doit alors respecter la licence de cette source.

## 2. Ce que l'agent peut adapter

| Statut de la source | Dans le texte de la fiche | En provenance |
| --- | --- | --- |
| Domaine public, CC0 | oui | `usage: adapte`, licence « domaine public » ou « CC0 » |
| CC BY | oui | `usage: adapte`, TASL complet, `modifie: true` |
| CC BY-SA | oui (la fiche reste CC BY-SA) | `usage: adapte`, TASL complet, `modifie: true` |
| Licence Ouverte (Etalab), ODbL (données) | oui, pour les données | `usage: adapte`, source et date |
| CC BY-NC, BY-NC-SA (OMS, FAO, MIT, Khan Academy) | **non** | `usage: reference` seulement |
| CC BY-ND, BY-NC-ND | **non**, ni traduit ni résumé | `usage: reference` seulement |
| Tous droits réservés (la plupart des sites, livres, notices) | **non**, sauf une courte citation entre guillemets | `usage: reference` seulement |
| Licence inconnue ou non vérifiée | **non** | à vérifier avant tout |

Règles qui en découlent :

1. **Vérifier la licence sur la page elle-même**, pas de mémoire, et noter la date de vérification (`verifie_le`). Une licence qui n'est pas écrite n'est pas une licence ouverte.
2. **Œuvres du gouvernement fédéral américain (CDC, EPA, USGS…)** : elles ne sont pas protégées par le droit d'auteur aux États-Unis (17 U.S.C. § 105) et sont traitées comme domaine public. Leur statut hors des États-Unis n'est pas tranché : on les cite toujours, et on recoupe avec une seconde source quand c'est possible. Les images et documents de tiers repris sur ces sites gardent leur propre licence.
3. **Chaque média a sa propre licence**, à vérifier fichier par fichier, indépendamment du texte.
4. **Une source NC, ND ou tous droits réservés ne sert jamais de modèle.** On peut en tirer un fait que d'autres sources confirment, mais on n'en suit ni le plan, ni les formulations, ni l'ordre des étapes. On y renvoie dans « Pour aller plus loin ».
5. **Traduire, c'est adapter** : seules les sources des trois premières lignes du tableau se traduisent dans une fiche.

### Sources déjà vérifiées

La licence a été lue sur la page à la date indiquée ; le détail est dans `agent/sortie/licences-sources-ouvertes.rapport.md` et dans les rapports des fiches. « Sauf mention contraire » veut dire : relire le pied de page et les encadrés de chaque page avant de l'adapter. Ce tableau évite de refaire la recherche, il ne dispense pas de noter `verifie_le` dans chaque fiche.

| Source | Licence lue | Verdict | Vérifiée le |
| --- | --- | --- | --- |
| Appropedia | CC BY-SA 4.0, sauf mention contraire | adaptable, page par page | 2026-11-12 |
| Open Source Ecology (wiki) | CC BY-SA 4.0 et GFDL (double licence), sauf mention contraire | adaptable (on retient CC BY-SA 4.0) | 2026-11-12 |
| Precious Plastic (page « Open source », Academy) | CC BY-SA 4.0 ; le pied de page du site est moins précis | adaptable, en citant ces deux pages | 2026-11-12 |
| Documentation Raspberry Pi | CC BY-SA 4.0 | adaptable | 2026-11-12 |
| Wiki OpenWrt | CC BY-SA 4.0, sauf mention contraire | adaptable | 2026-11-12 |
| Documentation Arduino (docs.arduino.cc) | CC BY-SA 4.0 | adaptable | 2026-11-12 |
| Wikipédia | CC BY-SA 4.0 | adaptable | 2026-11-12 |
| Service-Public.fr, Légifrance | Licence Ouverte 2.0 (etalab-2.0), sauf mention contraire | adaptable | 2026-11-11 |
| Billets de satdump.org | CC BY 4.0, mention en fin de billet | adaptable | 2026-11-12 |
| CDC, EPA, FEMA, Ready.gov | aucune mention : œuvres fédérales américaines | adaptable par la règle 2 ci-dessus | 2026-11-11 |
| Akvopedia | CC BY-SA 3.0 pour tout le texte (page « Trademarks and copyright », lue à la main par Julien ; détails sur akvopedia.org/wiki/Akvopedia:Copyrights) ; images : « most », pas toutes | adaptable pour le texte, publié sous CC BY-SA 4.0 (la 3.0 autorise une version ultérieure) ; images à lire fichier par fichier ; « Akvopedia » et « Akvo » sont des marques : citer la source, sans logo ni laisser croire à un partenariat | 2026-11-12 |
| ESPHome, Low-tech Lab, iFixit | NC | référence seulement | voir `CLAUDE.md` |
| Kiwix (documentation), SatDump (dépôt, GPL-3.0), Espressif (Apache 2.0), info.gouv.fr, ARS, OMM | aucune licence, ou licence hors de la liste acceptée | référence seulement | 2026-11-12 |

## 3. Comment l'agent écrit une fiche

1. **Choisir une méthode, une seule** (une fiche, une méthode). Les variantes d'un même geste restent dans la même fiche.
2. **Lire la ou les sources adaptables** et relever les passages utiles, avec leur lien.
3. **Écrire au gabarit** : principe, sécurité, pas-à-pas, « Si ça coince », ressources. Phrases courtes, un geste par action, une vérification observable par étape.
4. **Relier chaque étape à sa source** : la ligne `- **Source :**` d'une étape donne l'identifiant d'une entrée de provenance (`s1`, `s2`…) ou « sans objet » quand l'étape n'apprend rien (ranger, noter). Jamais de source inventée.
5. **Aucun chiffre qui ne figure pas dans une source adaptée.** Une durée, une dose, une distance sans source devient `[À VALIDER : …]`. Un chiffre converti (unités, autre concentration) est marqué `[À VALIDER : conversion]` jusqu'à relecture.
6. **Les niveaux** : l'agent propose l'horizon, le tier et le danger du geste principal ; une variante plus risquée garde son niveau. Les libellés de danger viennent du seul Nodule Zéro.
7. **Le moratoire rouge s'applique** : pas de 230 V sous tension, pas d'appareil ouvert, pas de combustion qui dégage des gaz à l'intérieur, pas de geste médical.
8. **Statut** : toute fiche produite par l'agent entre en `statut: brouillon`, `redaction: adaptee-ia`. Elle ne devient « documentée » que lorsqu'un humain a ouvert chaque source et vérifié chaque chiffre.
9. **Traduction** : la version anglaise suit la version française, même nombre d'étapes et d'entrées « Si ça coince ».

## 4. Le format de la provenance

```yaml
provenance:
  - id: s1
    titre: "How to Make Water Safe in an Emergency"
    auteur: "Centers for Disease Control and Prevention (CDC)"
    source: "https://www.cdc.gov/water-emergency/about/"
    licence: "domaine public"
    usage: adapte          # adapte : le texte de la fiche en dérive ; reference : seulement cité ou renvoyé
    modifie: true          # adapté, traduit ou réorganisé
    verifie_le: 2026-11-11 # date où la licence et le contenu ont été lus
```

Le vérificateur refuse une source `adapte` sans licence ou sous une licence qui ne permet pas l'adaptation, et une ligne `Source` qui renvoie à un identifiant absent de la provenance.

## 5. Ce que l'assistant de la station peut faire de chaque contenu

L'assistant ne rédige qu'à partir de ce qui est sur la station, et dit toujours sur quoi il s'appuie.

| Contenu | L'assistant peut |
| --- | --- |
| Fiches CivicNode (CC BY-SA) | les résumer, les combiner, les citer ; niveaux, règles, étapes et risques restent cités tels quels |
| Références ouvertes embarquées (Wikipédia, CC BY-SA ; domaine public) | les chercher, les résumer, les citer, en nommant la source et la licence |
| Documents NC embarqués à part (s'ils le sont un jour) | les chercher, citer de courts passages, résumer pour orienter, en affichant source et licence ; jamais en tirer une fiche |
| Documents ND | y renvoyer, citer mot pour mot de courts passages, sans les reformuler |
| Tous droits réservés | y renvoyer par un lien, rien de plus |

Aujourd'hui, l'assistant ne lit que les fiches. Les références externes (Wikipédia par Kiwix, documents à part) viendront avec la station complète.

## 6. Le programme

`agent/adapter.mjs` applique cette méthode. On lui donne une **commande** : un fichier `agent/travaux/<id>.yaml` qui nomme une fiche prévue et ses sources (identifiant, titre, auteur, lien, licence vérifiée, date de vérification, et au besoin un fichier texte copié).

    MODELE=claude ANTHROPIC_API_KEY=… npm run adapter -- agent/travaux/stocker-eau-potable-trois-jours.yaml
    MODELE=local npm run adapter -- agent/travaux/…      # llama-server sur le Mac (un modèle de 3B est trop petit pour bien rédiger)

Il refuse la commande si une source n'est pas adaptable ou n'a pas de date de vérification ; lit les sources ; envoie la méthode, une fiche modèle et les sources au modèle ; remplace l'en-tête par des valeurs sûres (la provenance vient de la commande, jamais du modèle ; statut brouillon ; `redaction: adaptee-ia`) ; contrôle le gabarit, les sources citées par chaque étape et **les chiffres absents des sources** ; écrit la fiche et son rapport dans `agent/sortie/`, qui n'est pas publié. Un humain lit le rapport et relit la fiche contre ses sources. Ensuite `npm run integrer -- agent/sortie/NN-id.md` la range dans le corpus avec le premier numéro libre, la retire des fiches prévues, met à jour sa ligne du catalogue, l'ouvre dans la démo si sa traduction anglaise existe, range l'original dans `agent/sortie/integrees/` et lance le vérificateur (`--essai` pour voir sans rien changer).

Premier résultat du garde-fou : sur la fiche 30, il a relevé une conversion (gallon en litres) écrite sans marque À VALIDER.

## 7. Schémas, photos et vidéos

**Règle d'or : réutiliser d'abord, dessiner seulement s'il n'existe rien.** Pour chaque fiche, l'agent se demande, étape par étape, si une image aide à faire le geste. Si oui :

1. **Chercher un média existant sous licence acceptée** : domaine public, CC0, CC BY ou CC BY-SA. Wikimedia Commons d'abord, puis les sites publics qui affichent une licence. La licence se lit sur la page du fichier lui-même, pas sur l'article qui l'affiche ; chaque fichier a la sienne. NC, ND, tous droits réservés ou licence inconnue : refusé, même pour une simple illustration.
2. **Seulement si rien ne convient, dessiner un schéma** en SVG : traits noirs sur fond blanc (lisible en mode sombre), numéros plutôt que mots dans l'image, la légende bilingue expliquant chaque numéro. Auteur « CivicNode », licence CC BY-SA 4.0, `relu: false` jusqu'à ce qu'un humain l'ait vérifié : un schéma faux est aussi dangereux qu'une phrase fausse.
3. **Photos** seulement pour reconnaître quelque chose (une plante, un symbole, une batterie gonflée). Pour une plante, toujours aussi la plante avec laquelle on la confond ; une photo ne suffit jamais à identifier ce qui se mange.
4. **Vidéos** en dernier recours, pour un geste qu'aucun schéma ne montre, courtes : la station a peu de place.
5. **Poids** : 600 Ko au plus par fichier (le vérificateur avertit au-delà) ; une photo de 1 200 pixels de large suffit.

**Où et comment.** Les fichiers vont dans `public/medias/<id de la fiche>/`. Chaque média est décrit dans l'en-tête de la fiche :

```yaml
medias:
  - fichier: pictogrammes-sodis.jpg        # nom du fichier dans public/medias/<id>/
    type: image                            # image, schema ou video
    etape: 4                               # facultatif : le média s'affiche sur cette étape, sinon sur la présentation
    legende: { fr: "…", en: "…" }
    titre: "Pictograms SODIS"
    auteur: "Samuel Luzi ; Fundación SODIS"
    source: "https://commons.wikimedia.org/wiki/File:Pictograms_SODIS.jpg"   # la page du fichier, pour un média existant
    licence: "domaine public"
    verifie_le: 2026-11-11
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/Pictograms_SODIS.jpg"  # si le fichier n'est pas encore là
    relu: false                            # pour un schéma dessiné par l'agent, jusqu'à relecture humaine
```

**Pour l'atelier de rédaction**, qui n'écrit que dans `agent/sortie/` :
- une **nouvelle fiche** porte ses médias dans son en-tête ; ses fichiers vont dans `agent/sortie/medias/<id>/` ;
- pour une **fiche déjà dans le corpus**, il prépare `agent/sortie/medias/<id>/medias.yaml` (la liste des médias à ajouter, au format ci-dessus) et les fichiers à côté ;
- un média existant qu'il ne peut pas télécharger lui-même garde son lien `telecharger` : `npm run medias`, lancé sur un ordinateur relié à Internet, le récupère ;
- le rapport liste chaque média : trouvé (page, licence lue) ou dessiné (pourquoi rien n'existait).

`npm run integrer` copie les fichiers dans `public/medias/`, ajoute les médias à l'en-tête des fiches existantes et refuse toute licence non acceptée. Le vérificateur refuse un média sans auteur, sans légende bilingue, sous une licence non acceptée ou dont le fichier manque.

## 8. Statuts et relectures

**Principe : nous ne créons pas le savoir, nous le mettons en forme.** Le chemin d'une fiche dépend de son origine (champ `origine`) :

| Origine | Statuts successifs | Ce que chaque statut exige (contrôlé par le vérificateur) |
| --- | --- | --- |
| `adaptee` (d'une source qui fait autorité) | brouillon → `verifiee-ia` → `fidele` → `testee` → `reproduite` | `verifiee-ia` : copies des sources (`npm run sources`) et relecture IA « conforme » (`agent/relectures/<id>.yaml`) ; `fidele` : en plus, une attestation `fidélité` signée par une personne |
| `creee` (par CivicNode, sans source qui fasse autorité) | brouillon → `testee` → `reproduite` | `testee` : une attestation de test par quelqu'un d'autre que l'auteur ; `reproduite` : trois |
| Fiche orange, quelle que soit l'origine | en plus, `relue` avant `testee` | une attestation `relue` d'une personne compétente, avec sa compétence |
| Fiche rouge | brouillon tant que deux professionnels ne l'ont pas relue | deux attestations `relue` avec compétence |

**Les quatre relectures** d'une fiche adaptée, avant toute diffusion : la rédaction (qui liste chaque chiffre et sa source), le vérificateur (forme, licences, sources des étapes, chiffres cherchés dans les copies des sources), la relecture IA par un autre modèle ou une autre conversation que la rédaction (`npm run relire -- <id>`, ou la conversation « Relecture » qui applique `agent/RELECTURE.md`), puis la confirmation humaine, guidée par la liste que produit la relecture IA. Le détail est dans `agent/RELECTURE.md`.

La relecture IA est fiable sans être infaillible : elle peut manquer un glissement de sens subtil, surtout si elle partage les angles morts du modèle qui a rédigé. D'où trois garde-fous : un autre modèle, des copies des sources plutôt que sa mémoire, et un verdict recalculé à partir du détail (une seule réserve suffit pour « à corriger »). La personne qui confirme n'a plus qu'à vérifier les points signalés et quelques autres au hasard.

## 9. Ce qui reste ouvert

- Le statut des œuvres fédérales américaines hors des États-Unis (voir 2.2).
- Embarquer des documents ND dans la station : en attendant, on y renvoie.
- Les licences des sources candidates du catalogue encore non vérifiées (ADEME, CAWST, Eawag…), à vérifier une par une ; celles qui le sont figurent en section 2, « Sources déjà vérifiées ».
- Le garde-fou des chiffres compare des nombres, pas leur sens : un chiffre présent dans la source mais pour autre chose passe. La relecture humaine reste indispensable.
