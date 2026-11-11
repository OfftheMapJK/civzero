# Relecture de fidélité : consigne pour l'IA, liste pour les bénévoles

Une fiche adaptée d'une source doit lui être **fidèle** : pas mot pour mot (on reformule simplement), mais sans rien changer au sens. Ce document sert deux fois : à l'IA qui relit (première partie) et à la personne qui confirme (seconde partie). Voir aussi `agent/METHODE.md`, section 8.

## Les quatre relectures, dans l'ordre

1. **La rédaction** (agent ou atelier de rédaction) applique la méthode et liste dans son rapport chaque chiffre et sa source.
2. **Le vérificateur** (`npm test`) contrôle la forme : gabarit, sources citées par chaque étape, licences, et chiffres absents des copies des sources (`npm run sources`).
3. **La relecture IA** compare la fiche, étape par étape, aux copies des sources. Elle est faite par un **autre modèle ou une autre conversation** que la rédaction, pour ne pas partager ses angles morts. Résultat : `agent/relectures/<id>.yaml`. Une fiche dont la relecture conclut « conforme » passe au statut **vérifiée par IA**.
4. **La confirmation humaine** : une personne ouvre la fiche et la liste produite par la relecture IA, vérifie les points signalés et quelques autres au hasard, puis signe une attestation de fidélité. La fiche passe au statut **fidèle aux sources**. Une fiche orange demande en plus une relecture par une personne compétente du domaine (statut **relue**).

## Première partie : consigne pour l'IA qui relit

Tu relis une fiche CivicNode pour vérifier qu'elle est fidèle à ses sources. Tu ne la réécris pas. Tu n'as que la fiche et les copies de ses sources (s1, s2…). Tu ne t'appuies sur aucune connaissance extérieure : si une affirmation n'est pas dans les copies, elle est « sans source », même si tu la crois vraie.

Pour **chaque étape** : retrouve dans la source citée le passage qui la fonde. Verdicts :
- `conforme` : le geste et ses conditions sont dans la source, avec le même sens ;
- `ecart` : la source dit autre chose (durée, dose, ordre, condition, public) ;
- `ajout` : la fiche ajoute un geste, une condition ou une promesse absents de la source ;
- `sans_source` : l'étape dit « sans objet » ou « À VALIDER », ou le passage est introuvable.

Pour **chaque chiffre** de la fiche (durée, dose, quantité, température, distance, pourcentage) : trouvé dans quelle source, oui ou non. Un chiffre non trouvé mais marqué « À VALIDER » dans la même phrase de la fiche est un manque déclaré, pas une infidélité : note-le avec `a_valider: true`. Une conversion d'unités sans cette marque compte comme non trouvée.

Liste aussi les **précautions de la source absentes de la fiche** (un avertissement, un public à risque, une limite de la méthode), et les **niveaux** qui te semblent sous-estimés au regard de la source.

Réponds uniquement en YAML, au format :

```yaml
etapes:
  - n: 1
    verdict: conforme        # conforme, ecart, ajout ou sans_source
    source: s1
    passage: "le passage de la source, cité court"
    remarque: ""
chiffres:
  - valeur: "30 minutes"
    trouve: true
    source: s1
  - valeur: "2 000 mètres"
    trouve: false
    a_valider: true        # marqué À VALIDER dans la même phrase de la fiche
precautions_absentes:
  - "…"
niveaux: ""                  # vide si rien à signaler
remarques: ""
```

## Seconde partie : liste pour la personne qui confirme

Avec la fiche, ses sources ouvertes à côté, et le fichier de relecture IA :

1. Pour chaque point signalé par la relecture IA (écart, ajout, chiffre non trouvé, précaution absente) : est-ce vrai ? Corrigez la fiche, ou notez pourquoi ce n'est pas un problème.
2. Prenez trois étapes au hasard parmi celles jugées conformes, et retrouvez vous-même le passage dans la source.
3. Vérifiez que chaque chiffre de l'encadré de sécurité est dans la source.
4. Vérifiez que rien de la source n'est contredit, même dans « Si ça coince ».
5. Si tout va bien, ajoutez une attestation à la fiche : `type: fidélité`, votre nom ou pseudonyme (publié seulement avec votre accord), la date. Puis passez son statut à `fidele`.

Vous n'avez pas besoin d'être spécialiste : vous vérifiez que la fiche dit ce que dit la source. Le jugement technique, pour les fiches orange, revient au relecteur professionnel.
