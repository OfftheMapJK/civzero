# L'assistant d'atelier

L'assistant choisit, il n'écrit pas. Une recherche locale propose des passages des fiches ; le modèle choisit parmi eux, sa réponse étant limitée à leurs identifiants ; la station affiche le texte des fiches tel quel. Sans modèle, la recherche seule répond.

| Fichier | Rôle |
| --- | --- |
| `classifieur.mjs` | Recherche des candidats, appel au modèle, vérification des identifiants, repli |
| `station.mjs` | Serveur de la station : le site et la page `/assistant`, sans JavaScript |
| `questions.json` | Questions types avec la réponse attendue |
| `mesurer.mjs` | Note un modèle sur les questions types |

## Lancer la station

    npm run station

Construit le site en version station (avec les accès à l'assistant), puis l'ouvre sur http://localhost:8000. Les autres appareils du réseau local l'ouvrent à l'adresse de l'ordinateur, port 8000.

Sans modèle, la page de l'assistant fonctionne en recherche seule.

## Ajouter le modèle

Le moteur est `llama-server`, de llama.cpp. Dans un deuxième Terminal :

    llama-server -hf ggml-org/Qwen3-4B-GGUF:Q4_K_M --port 8080

Au premier lancement, le modèle (environ 2,5 Go, licence Apache 2.0) est téléchargé. La station le détecte en moins de 30 secondes.

## Mesurer

    npm run mesurer                         # avec le modèle
    node assistant/mesurer.mjs --sans-modele # recherche seule, pour comparer

Un modèle mérite sa place s'il fait mieux que la recherche seule, surtout sur les questions hors du corpus, où la bonne réponse est « rien ».

## Ce qui est enregistré

Chaque question posée est ajoutée à `donnees/questions.jsonl`, sur la station uniquement. Ce dossier n'est pas envoyé sur GitHub. Les questions sans réponse indiquent les fiches à écrire.
