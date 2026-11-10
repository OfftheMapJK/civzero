# L'assistant d'atelier

L'assistant converse à partir des fiches, et seulement d'elles.

1. Une recherche locale propose des passages des fiches ; le modèle choisit parmi eux, sa réponse étant limitée à leurs identifiants.
2. Le modèle rédige une courte réponse (2 à 4 phrases) à partir des seuls passages choisis, ou pose une question de précision si la demande est trop vague. La station propose alors les fiches possibles, chacune résumée.
3. Un garde-fou écarte toute rédaction qui cite un chiffre absent des fiches ou qui contient un lien : la station affiche alors une phrase fixe.
4. Sous la réponse rédigée, marquée « à vérifier », la station cite tels quels la fiche, ses risques, l'étape ou la solution utile, puis d'autres fiches à voir.

Sans modèle, la recherche seule répond, sans texte rédigé. `REDACTION=0 npm run station` coupe la rédaction et garde le choix des passages.

L'assistant se souvient de toute la conversation, dans la limite des 10 dernières questions. Sur une station sobre (peu d'énergie), on réduit cette mémoire, ce qui accélère les réponses :

    MEMOIRE=4 npm run station

et l'on peut alors lancer le modèle avec `-c 4096` au lieu de `-c 8192`. Les conversations disparaissent quand on arrête la station.

| Fichier | Rôle |
| --- | --- |
| `classifieur.mjs` | Recherche des candidats, choix par le modèle, rédaction encadrée et garde-fou, repli |
| `station.mjs` | Serveur de la station : le site et la conversation `/assistant`, sans JavaScript |
| `questions.json` | Questions types avec la réponse attendue |
| `mesurer.mjs` | Note un modèle sur les questions types |

## Lancer la station

    npm run station

Construit le site en version station (avec les accès à l'assistant), puis l'ouvre sur http://localhost:8000. Les autres appareils du réseau local l'ouvrent à l'adresse de l'ordinateur, port 8000.

Sans modèle, la page de l'assistant fonctionne en recherche seule.

## Ajouter le modèle

Le moteur est `llama-server`, de llama.cpp. Dans un deuxième Terminal :

    llama-server -hf mistralai/Ministral-3-3B-Instruct-2512-GGUF --port 8080 -c 8192 --jinja --no-mmproj

Au premier lancement, le modèle Ministral 3 3B (Mistral AI, licence Apache 2.0) est téléchargé. La station le détecte en moins de 30 secondes.

## Mesurer

    npm run mesurer                         # avec le modèle
    node assistant/mesurer.mjs --sans-modele # recherche seule, pour comparer
    node assistant/mesurer.mjs --redaction   # affiche ce que l'assistant rédige pour chaque question

Le garde-fou ne voit que les chiffres et les liens : une consigne inventée sans chiffre passe. Avant de montrer la station à quelqu'un, lisez toutes les rédactions de `--redaction`.

Un modèle mérite sa place s'il fait mieux que la recherche seule, surtout sur les questions hors du corpus, où la bonne réponse est « rien ».

## Ce qui est enregistré

Chaque question posée est ajoutée à `donnees/questions.jsonl`, sur la station uniquement. Ce dossier n'est pas envoyé sur GitHub. Les questions sans réponse indiquent les fiches à écrire.
