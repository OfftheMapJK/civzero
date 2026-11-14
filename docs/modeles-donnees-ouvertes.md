# Modèles d'IA à données ouvertes pour l'assistant CivicNode : étude et classement

13/11/2026, conversation Chantier ; recopié du Project le 14/11/2026. Décision de Julien : tester des modèles dont les données d'entraînement sont ouvertes, les classer par pertinence pour CivicNode, puis lancer les tests. Le modèle final sera propre à CivicNode, affiné à partir de la base retenue (voir « Notre propre modèle »). Référence actuelle : Ministral 3 3B (Mistral AI, Apache 2.0), poids ouverts mais données non publiées.

Les informations viennent des fiches des modèles, des articles de leurs auteurs et de l'European Open Source AI Index, lus le 13/11/2026. Elles sont à confirmer sur chaque fiche avant usage (licence exacte de chaque version, fichier GGUF).

## Ce dont l'assistant a besoin

L'assistant (`assistant/classifieur.mjs`) fait deux choses : il choisit des passages des fiches proposés par la recherche (réponse contrainte en JSON), puis il rédige 2 à 4 phrases à partir de ces seuls passages, ou pose une question de précision. Il tourne avec llama-server (llama.cpp), sur le Mac et, à terme, sur un Raspberry Pi.

## Critères, par ordre d'importance

1. **Données ouvertes** : publiées et consultables, pas seulement décrites.
2. **Origine des données** : du domaine public ou sous licence ouverte, plutôt que du web aspiré. C'est la règle que CivicNode s'applique à lui-même.
3. **Licence du modèle** vraiment ouverte (Apache 2.0, MIT), sans restriction d'usage.
4. **Français** : part du français dans les données, qualité annoncée.
5. **Aptitude à répondre à partir de sources**, et à les citer.
6. **Taille** : tenir sur le Mac, idéalement sur un Raspberry Pi (8 Go).
7. **Fichier GGUF** pour llama.cpp, officiel de préférence.
8. **Aptitude à être affiné** (ajouté le 13/11/2026) : outils d'affinage disponibles, taille raisonnable, licence qui permet de publier le modèle dérivé. Critère secondaire : il ne change pas le classement, qui reste dominé par l'ouverture et l'origine des données.

## Classement des bases

| Rang | Modèle | Taille | Données | Licence | Français | Points forts | Limites |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Famille Pleias** (Pleias, France) : Pleias-RAG-1B et Pleias-RAG-350M (spécialisés, avril 2025), et les modèles de base Pleias 1.0 (décembre 2024, vérifiés ci-dessous) | 0,35 à 3 milliards | Common Corpus : uniquement du domaine public ou sous licence ouverte, sans aspiration du web (CommonCrawl exclu), entièrement consultable | Apache 2.0 (tous, vérifié) | oui (français parmi les langues pleinement prises en charge) | La base la plus ouverte et la plus « propre » de toutes. Pleias-RAG est conçu pour notre usage : répondre à partir de sources fournies, en les citant mot pour mot ; GGUF officiel ; testé par ses auteurs sur un Raspberry Pi 4 de 8 Go. | Les modèles de base sont des « préversions » : ni affinage pour converser, ni alignement de sécurité, et l'affinage léger (LoRA) y est déconseillé par leurs auteurs. Données historiques du domaine public : normes et biais parfois datés. Pleias-RAG a un format d'entrée particulier et raisonne en anglais ; ses bons résultats sont mesurés en anglais. |
| 2 | **SmolLM3-3B** (Hugging Face, France) | 3 milliards | Sources publiées en collection, recette complète, données d'affinage publiées (SmolTalk2) ; surtout du web filtré | Apache 2.0 | oui (6 langues dont le français) | Même taille que Ministral : la comparaison la plus juste. Généraliste, format de conversation standard, recette d'entraînement entièrement publiée : le plus simple à affiner (affinage léger possible). Plus récent (juillet 2025). Tient sur un Raspberry Pi. Pris en charge par llama.cpp. | Données majoritairement issues du web, moins « propres » que Common Corpus : c'est pourquoi il reste derrière Pleias. Mélange décrit par configuration plutôt que listé. |
| 3 | **Lucie-7B-Instruct-v1.1** (OpenLLM-France, Linagora) | 7 milliards | Lucie Training Dataset publié ; une partie des données d'affinage n'est pas partagée | Apache 2.0 | le plus français : 32 % du corpus | Modèle centré sur le français, entraîné sur le supercalculateur public Jean Zay. | 7 milliards : lent sur un Raspberry Pi. Publié en février 2025, moins performant que les modèles récents. GGUF seulement par la communauté. |
| 4 | **Apertus 8B v1.5** (EPFL, ETH Zurich, CSCS ; juillet 2026) | 8 milliards | Données, recettes, journaux et points de passage publiés | Apache 2.0 pour la v1 ; à vérifier pour la v1.5 | multilingue (40 % hors anglais) ; français non mesuré | Le plus récent et l'un des plus transparents ; respect des refus d'aspiration des sites ; lit aussi les images. | Trop lourd pour un Raspberry Pi. GGUF seulement en conversion communautaire, texte seul. Réputé en retrait sur ses concurrents. |
| 5 | **CroissantLLMChat** (consortium franco-européen) | 1,3 milliard | Corpus publié, licences permissives, moitié français | MIT | oui, à parité avec l'anglais | Très petit, très français, données exemplaires. | Ancien (connaissances arrêtées fin 2023), raisonnement faible. Utile comme plancher de comparaison. |
| 6 | **OLMo 3 7B Instruct** (Ai2, novembre 2025) ; OLMo 2 1B | 7 et 1 milliards | La référence de l'ouverture : données (Dolma 3), code, évaluations | Apache 2.0 | faible : OLMo 2 1B est annoncé en anglais seul | Le modèle le plus ouvert au monde à cette taille. | Centré sur l'anglais : peu adapté à des fiches en français. À garder comme étalon d'ouverture plutôt que comme candidat. |

**Écartés** : Salamandra (BSC) : licence Apache 2.0, mais ses données sont décrites sans être publiées. BLOOM : licence RAIL à restrictions d'usage, et modèle daté. Llama (Meta) : licence non ouverte.

**Ministral 3 3B reste la référence** des tests : c'est le modèle actuel, et tout candidat doit faire au moins aussi bien.

## Les modèles de Pleias, vérifiés le 13/11/2026

Collection « Common Models » de Pleias sur Hugging Face, et fiches de chaque modèle :

| Modèle | Taille | Nature | Licence | Date |
| --- | --- | --- | --- | --- |
| Pleias-350m-Preview | 350 millions | modèle de base (préversion) | Apache 2.0 | décembre 2024 (mise à jour février 2025) |
| Pleias-1.2b-Preview | 1,2 milliard | modèle de base (préversion) | Apache 2.0 | décembre 2024 |
| Pleias-3b-Preview | 3 milliards | modèle de base (préversion), entraîné sur environ 1 090 milliards de mots de Common Corpus filtré | Apache 2.0 | décembre 2024 |
| Pleias-Pico | 350 millions | spécialisé RAG (sources et citations), à partir de Pleias-350m | Apache 2.0 | février 2025 |
| Pleias-Nano | 1,2 milliard | spécialisé RAG, à partir de Pleias-1.2b-Preview | Apache 2.0 | décembre 2024 |
| Pleias-RAG-350M et Pleias-RAG-1B | 350 millions et 1,2 milliard | nouvelle génération RAG, avec raisonnement et citations ; GGUF officiel | Apache 2.0 | avril 2025 |

Langues pleinement prises en charge : anglais, français, espagnol, allemand, italien, néerlandais, latin, portugais (et polonais pour les modèles RAG).

**Ce que disent les fiches des modèles de base**, et qui compte pour nous :
- ils ne savent que **continuer un texte** : il n'y a pas de version conversationnelle générale (elle est annoncée, sans date) ;
- ils n'ont **aucun alignement de sécurité** : ils peuvent produire des réponses problématiques ;
- leurs données, en partie historiques, peuvent porter des **normes et des biais datés**, et des informations fausses ou périmées ;
- leurs auteurs **déconseillent l'affinage léger (LoRA)** et recommandent un entraînement prolongé ou un affinage complet.

**Conséquence pour notre propre modèle** :
- partir d'un **modèle de base Pleias** donne la lignée la plus propre, mais c'est un vrai chantier : un affinage complet, qui doit lui apprendre à la fois à converser, à rester prudent et la manière CivicNode, avec beaucoup plus de données et de calcul qu'un affinage léger ;
- partir de **Pleias-RAG-1B** est plus réaliste : il sait déjà répondre à partir de sources et les citer, avec la même lignée Common Corpus ; un affinage complet d'un modèle de 1,2 milliard de paramètres tient sur le Mac mini de Julien (voir « Où affiner ») ;
- **SmolLM3-3B** reste le plus simple (affinage léger possible), avec une base moins propre.

## Ce qu'on retient

- **La famille Pleias est la première base** : la plus ouverte et la plus propre (Common Corpus), la plus cohérente avec la philosophie de CivicNode. **Pleias-RAG-1B** est à la fois le premier modèle à tester tel quel et la base la plus réaliste pour notre propre modèle. Les modèles de base Pleias sont une option de long terme.
- **SmolLM3-3B est la solution de secours** : plus simple à affiner, plus récent et plus proche de Ministral, mais avec une base moins propre (web filtré).
- Lucie et Apertus se testent sur le Mac, pour la qualité du français, sans viser le Raspberry Pi.
- Les modèles à données ouvertes restent un peu en retrait sur la qualité brute : le test dira si l'écart est acceptable pour notre usage, très encadré, et l'affinage pourra le réduire. Si Pleias-RAG répond bien en français, la famille Pleias s'impose.

## Plan de tests des bases (Claude Code, sur le Mac)

Pour chaque modèle, avec llama-server et les mêmes réglages :
1. `npm run mesurer` sur les questions types (`assistant/questions.json`) : bonne réponse en premier, réponse « rien » juste pour les questions hors corpus.
2. Rédaction : sur 10 questions, la réponse n'invente rien hors des passages ; qualité du français (lue par Julien).
3. Ressources : mémoire utilisée, vitesse (mots par seconde), temps de réponse.
4. Pour Pleias-RAG : adapter l'appel à son format de sources (température 0, pas de pénalité de répétition, comme le recommandent ses auteurs), et vérifier que ses citations renvoient bien aux passages des fiches.
5. Ordre : Ministral (référence), Pleias-RAG-1B, SmolLM3-3B, puis Lucie, Apertus, CroissantLLMChat si le temps le permet.
6. Résultats dans `assistant/mesures/` et un tableau récapitulatif dans `docs/modeles-assistant.md`. Aucun changement du modèle par défaut sans décision de Julien.
7. Ajouté par la feuille de route du 13/11/2026 : refaire les mêmes tests sur le Raspberry Pi (vitesse, mémoire, consommation) ; c'est le Pi qui décide de la taille réaliste.

## Notre propre modèle : un modèle CivicNode, à la lignée connue (décidé le 13/11/2026)

Décision de Julien : le modèle de l'assistant sera **propre à CivicNode**, affiné (« entraîné ») pour le projet. Le modèle de base est choisi parce qu'on connaît ses données. Le classement ci-dessus sert donc à choisir **la base**, pas le modèle final.

- **La lignée entière est connue et publiée** : les données de la base (par exemple Common Corpus pour Pleias), puis nos données d'affinage (les fiches, sous CC BY-SA, et les questions types). C'est le sens de la « bataille de l'espace latent » (Christophe Payet, *Guérillia*) : on sait ce que le modèle a lu, de bout en bout.
- **Ce que l'affinage apporte** : la manière de répondre de CivicNode (le panorama, les niveaux cités tels quels, la question de précision, le « rien » quand le corpus ne couvre pas la question), le français, la sobriété du ton.
- **Ce qu'il ne doit pas faire** : apprendre les faits par cœur. Les doses, les durées et les consignes de sécurité restent lues dans les fiches au moment de répondre, comme aujourd'hui. Un modèle qui les aurait mémorisées pourrait répéter une version périmée après la correction d'une fiche. C'est d'autant plus important avec une base en partie historique.
- **Méthode envisagée** : selon la base, un affinage léger (LoRA, pour SmolLM3) ou complet (pour Pleias, comme le recommandent ses auteurs) ; données d'affinage tirées des fiches et des questions types, avec des exemples de refus hors corpus. Toute donnée générée par une IA pour l'affinage est marquée comme telle et relue. L'essentiel de l'effort est la préparation et la relecture de ces exemples, pas le calcul.
- **Publication** : le modèle, ses données d'affinage et sa recette sont publiés, sous licence ouverte compatible avec la base (Apache 2.0) ; les fiches gardent leur licence CC BY-SA et sont créditées. Le statut juridique d'un modèle entraîné sur des textes sous CC BY-SA n'est pas tranché : on publie tout, et on crédite.
- **Nom** : un nom du type « CivicNode-1B », couvert par la politique de marque.

### Où affiner (13/11/2026)

- **Sur le Mac mini de Julien (Apple M4 Pro, 64 Go de mémoire unifiée), avec MLX** (bibliothèque libre d'Apple, licence MIT, module `mlx-lm` : affinage léger ou complet). La mémoire partagée avec le processeur graphique suffit pour un affinage complet d'un modèle de 1,2 milliard de paramètres (de l'ordre de 20 à 30 Go) et pour un affinage léger d'un modèle de 3 milliards. Durée estimée : quelques heures à une nuit, à mesurer par un premier essai. Le Mac doit rester allumé, sans mise en veille. Coût : l'électricité. C'est l'option retenue.
- **En secours** : un processeur graphique loué à l'heure chez un hébergeur européen (Scaleway, OVHcloud), de l'ordre de quelques dizaines d'euros, tarifs à vérifier.
- **Écarté pour l'instant** : le serveur OVH dédié de pam-project (8 cœurs, 24 Go, sans processeur graphique) : trop lent et trop juste en mémoire pour affiner, et c'est un autre projet ; Julien a dit « pas pour le moment ».
- **Après l'affinage** : conversion au format GGUF pour llama-server, puis les mêmes tests que les autres modèles.

**Ordre de travail** : (1) tester les bases (plan ci-dessus) et en choisir une ; (2) constituer les données d'affinage à partir des fiches ; (3) un essai d'affinage à petite échelle sur le Mac (Pleias-RAG-350M, une centaine d'exemples) pour mesurer le temps ; (4) affiner la base choisie ; (5) mesurer le modèle affiné contre sa base et contre Ministral, avec les mêmes tests ; (6) publier le modèle, ses données et sa recette.

## Sources

- Pleias : collection « Common Models » https://huggingface.co/collections/PleIAs/common-models-674cd0667951ab7c4ef84cc4 ; Pleias-3b-Preview https://huggingface.co/PleIAs/Pleias-3b-Preview ; Pleias-Nano https://huggingface.co/PleIAs/Pleias-Nano ; Pleias-Pico https://huggingface.co/PleIAs/Pleias-Pico ; annonce des modèles de base https://huggingface.co/blog/Pclanglais/common-models ; Pleias-RAG https://huggingface.co/PleIAs/Pleias-RAG-1B et article https://arxiv.org/abs/2504.18225
- SmolLM3 : https://huggingface.co/blog/smollm3 ; European Open Source AI Index https://osai-index.eu/model/smollm
- Lucie : https://huggingface.co/OpenLLM-France/Lucie-7B ; https://huggingface.co/OpenLLM-France/Lucie-7B-Instruct-v1.1 ; https://osai-index.eu/model/lucie ; https://arxiv.org/abs/2503.12294
- Apertus : https://publicai.co/stories/apertus ; https://publicai.co/stories/apertus-1-5 ; https://blog.nlp-lab.ai/2026/10/01/Apertus15GettingStarted.html
- CroissantLLM : https://arxiv.org/abs/2402.00786
- OLMo : https://thenewstack.io/ai2s-olmo-3-pushes-the-envelope-for-open-source-llm-performance/ ; https://huggingface.co/allenai/Olmo-2-0425-1B
- Salamandra : https://huggingface.co/BSC-LT/salamandra-2b-instruct
- European Open Source AI Index, guide éducation : https://osai-index.eu/guides/open-llms-education/
- Christophe Payet, *Guérillia* (Seuil, 2026), présenté par L'ADN : https://www.ladn.eu/?p=723267
