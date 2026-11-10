---
id: calcul-maj-usb
titre: Mettre à jour la station par clé USB
bloc: calcul
besoin: mettre-a-jour
horizon: hours
temps: "une heure"
vague: 2
milieu: [urbain, rural]
tier: [1]
exige_avance: "une clé USB, un accès Internet ailleurs pour télécharger la nouvelle version"
origine_materiel: mixte
variantes:
  - id: cle-usb
    danger: vert
danger: vert
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "aucune"
  fin_de_vie: "sans objet"
  passerelle: "la même clé ramène les rapports de reproduction"
prerequis: [calcul-station-minipc]
sources: []
maj: 2026-11-09
---

# Mettre à jour la station par clé USB

Le corpus n'est pas figé : quand la station n'a pas Internet, une clé USB lui apporte la nouvelle version et repart avec les rapports des testeurs.

## 1. Principe

On télécharge la nouvelle version là où il y a du réseau, on vérifie qu'elle n'a pas été abîmée pendant la copie grâce à une somme de contrôle, puis on remplace l'ancienne sur la station en gardant une sauvegarde.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche : n'utiliser que la version publiée par le dépôt officiel, et toujours vérifier la somme de contrôle.

## 3. Pas-à-pas

### Étape 1 : Télécharger la version et sa somme de contrôle

- **Action :** sur un ordinateur connecté, télécharger l'archive du corpus et le fichier de sommes de contrôle publié avec elle. [À VALIDER : emplacement du dépôt officiel]
- **Vérification :** vous avez les deux fichiers.
- **Source :** [SOURCE À TROUVER]

### Étape 2 : Vérifier la somme

- **Action :** sous Linux, `sha256sum -c` suivi du nom du fichier de sommes.
- **Vérification :** la commande répond « OK » pour l'archive.
- **Source :** [SOURCE À TROUVER]

### Étape 3 : Copier sur la clé

- **Action :** copier l'archive et le fichier de sommes sur la clé, puis éjecter proprement la clé.
- **Vérification :** les deux fichiers sont sur la clé.
- **Source :** sans objet

### Étape 4 : Vérifier de nouveau sur la station

- **Action :** brancher la clé sur la station et refaire la vérification de l'étape 2.
- **Vérification :** « OK » sur la station aussi.
- **Source :** sans objet

### Étape 5 : Remplacer en gardant une sauvegarde

- **Action :** renommer l'ancien dossier du corpus (par exemple en ajoutant sa date), puis décompresser la nouvelle version à sa place.
- **Vérification :** l'accueil affiche la nouvelle date de synchro, et l'ancien dossier existe toujours.
- **Source :** sans objet

### Étape 6 : Repartir avec les rapports

- **Action :** copier le dossier des rapports de reproduction de la station vers la clé, pour les remonter au dépôt.
- **Vérification :** les rapports sont sur la clé.
- **Source :** sans objet

## 4. Si ça coince

- **Étape 2 ou 4 — la somme ne correspond pas.** La copie est abîmée : recopiez le fichier. Ne l'installez jamais en l'état.
- **Étape 5 — la nouvelle version ne s'affiche pas correctement.** Remettez l'ancien dossier à sa place.
- **Étape 4 — la station ne voit pas la clé.** Essayez un autre port, ou formatez la clé en exFAT, lu par Linux, Windows, macOS et la plupart des téléphones Android. Évitez le FAT32 : il refuse les fichiers de plus de 4 Go, comme celui de Wikipédia.

## 5. Ressource

### Pistes de sources (non vérifiées)

- Wikipédia : « SHA-2 », « Somme de contrôle »
- [SOURCE À TROUVER : page de téléchargement officielle du corpus CivZero]
