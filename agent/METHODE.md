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

## 6. Ce qui reste ouvert

- Le statut des œuvres fédérales américaines hors des États-Unis (voir 2.2).
- Embarquer des documents ND dans la station : en attendant, on y renvoie.
- Les licences des sources candidates du catalogue (Low-tech Lab, ADEME, CAWST, Eawag…), à vérifier une par une.
- Passer de cette méthode à un programme : un script qui lit une source, appelle un modèle puissant avec cette consigne, écrit la fiche et lance le vérificateur.
