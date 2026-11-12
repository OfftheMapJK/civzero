---
id: reseau-wifi-maille-quartier
titre: Relier quelques maisons voisines en Wi-Fi maillé avec OpenWrt
accroche: "Elle explique comment relier quelques routeurs entre eux par radio, selon la norme 802.11s, pour partager la station entre plusieurs maisons sans opérateur."
socle: mycelium
savoirs: [partager-sans-internet]
horizon: hours
temps: "une journée pour deux ou trois routeurs"
vague: 3
milieu: [urbain, rural]
tier: [1]
exige_avance: "deux ou trois routeurs Wi-Fi compatibles avec OpenWrt, déjà passés sous OpenWrt ; un ordinateur et un câble Ethernet ; l'accord des voisins concernés"
origine_materiel: recuperation
variantes:
  - id: deux-ou-trois-noeuds
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "cartes électroniques"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "redonner un usage à de vieux routeurs ; relier la station du quartier"
prerequis: [nodule-zero, telecom-point-acces-local]
provenance:
  - id: s1
    titre: "IEEE 802.11s Wireless Mesh Networking (OpenWrt Wiki)"
    auteur: "Contributeurs du wiki OpenWrt"
    source: "https://openwrt.org/docs/guide-user/network/wifi/mesh/802-11s"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "802.11s - Introduction to Wireless Mesh Networking (OpenWrt Wiki)"
    auteur: "Contributeurs du wiki OpenWrt"
    source: "https://openwrt.org/docs/guide-user/network/wifi/mesh/80211s"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Wi-Fi Extender/Repeater with Bridged AP (OpenWrt Wiki)"
    auteur: "Contributeurs du wiki OpenWrt"
    source: "https://openwrt.org/docs/guide-user/network/wifi/wifiextenders/bridgedap"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
attestations: []
medias:
  - fichier: architecture-maillage-802-11s.svg
    type: image
    legende:
      fr: "Un maillage 802.11s. MP : routeur du maillage. MAP : routeur du maillage qui diffuse aussi un Wi-Fi ordinaire (AP) pour les appareils (STA). Portal : routeur relié à un réseau extérieur. Pointillés bleus : liens du maillage ; pointillés verts : Wi-Fi ordinaire ; trait plein : câble."
      en: "An 802.11s mesh. MP: mesh router. MAP: mesh router that also broadcasts ordinary Wi-Fi (AP) for user devices (STA). Portal: router connected to an external network. Blue dashes: mesh links; green dots: ordinary Wi-Fi; solid line: cable."
    titre: "802.11s Meshed Network Architecture"
    auteur: "Superspritz"
    source: "https://commons.wikimedia.org/wiki/File:802.11s_Meshed_Network_Architecture.svg"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/802.11s_Meshed_Network_Architecture.svg"
maj: 2026-11-12
---

# Relier quelques maisons voisines en Wi-Fi maillé avec OpenWrt

Quelques routeurs qui se parlent par radio suffisent à relier deux ou trois maisons voisines et à y partager la station CivicNode, sans box ni abonnement entre elles.

## 1. Principe

Un réseau maillé relie des routeurs entre eux, pas des téléphones : c'est une dorsale radio. La norme ouverte IEEE 802.11s fait que tous les routeurs du maillage se voient comme s'ils étaient branchés sur le même commutateur. Un téléphone ou un ordinateur ne peut pas entrer dans le maillage lui-même : il se connecte au Wi-Fi ordinaire que chaque routeur diffuse en plus. Ce n'est pas l'itinérance entre bornes que vendent certaines box sous le nom de « mesh ». OpenWrt, un système libre pour routeurs, prend en charge le 802.11s, chiffrement compris. Une configuration simple suffit pour deux ou trois routeurs assez proches ; au-delà, il faut des réglages supplémentaires que cette fiche ne couvre pas.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Routeurs alimentés par leur bloc secteur d'origine, fermé ; on n'ouvre ni le bloc ni le routeur (moratoire rouge).
> - Pas de routeur ni d'antenne sur un toit ou un mât : risque de chute et de foudre, hors du périmètre de cette fiche. Les routeurs se posent à l'intérieur, près d'une fenêtre.
> - On ne relie que ses propres appareils et ceux de voisins qui l'ont décidé avec soi. Aucun accès au réseau d'autrui.
> - Régler chaque routeur sur son pays : la puissance et les canaux autorisés en dépendent. [À VALIDER : règles françaises d'usage du Wi-Fi entre bâtiments]
> - Un maillage sans chiffrement laisse lire ce qui y circule : toujours choisir un mot de passe.

## 3. Pas-à-pas

### Étape 1 : Vérifier que c'est bien un maillage qu'il faut

- **Action :** dessiner sur papier les maisons à relier, la place de chaque routeur et celle de la station. Si le but est seulement de mieux couvrir une maison déjà câblée, un simple point d'accès suffit (fiche *Point d'accès Wi-Fi local*).
- **Vérification :** le schéma montre au moins deux routeurs qui ne peuvent pas être reliés par un câble.
- **Source :** s1

### Étape 2 : Préparer des routeurs sous OpenWrt

- **Action :** réunir des routeurs pris en charge par OpenWrt et y installer OpenWrt en suivant, pour chaque modèle, sa page dans la table du matériel du projet. Cette installation n'est pas décrite ici : elle diffère d'un modèle à l'autre.
- **Vérification :** chaque routeur affiche l'interface LuCI à l'adresse `http://192.168.1.1` depuis un ordinateur relié par câble à l'un de ses ports LAN.
- **Source :** s3 (adresse par défaut et accès par câble) ; l'installation : aucune source ouverte lue (étape créée, à tester)

### Étape 3 : Vérifier que la radio sait mailler

- **Action :** dans un terminal du routeur, taper `iw list | grep "Supported interface modes" -A 9`. La plupart des pilotes Wi-Fi d'OpenWrt savent mailler ; les puces Broadcom et la plupart des clés Wi-Fi USB font exception.
- **Vérification :** la liste affichée contient la ligne `mesh point`.
- **Source :** s2, recoupée par s1 ; l'accès au terminal du routeur (par SSH) : aucune source ouverte lue

### Étape 4 : Installer la version de wpad qui chiffre le maillage

- **Action :** repérer le paquet wpad installé avec `opkg list-installed wpad*`. Si c'est une version « basic », la retirer et installer la version « mesh » correspondante, par exemple `wpad-mesh-mbedtls`, depuis LuCI (System → Software, filtre `wpad`) ou avec opkg. Redémarrer ensuite le routeur.
- **Vérification :** `opkg list-installed wpad*` affiche un paquet dont le nom contient `mesh`, ou la version complète.
- **Source :** s1

### Étape 5 : Créer le maillage sur le premier routeur

- **Action :** dans LuCI, aller dans Network → Wireless et cliquer sur Add sur l'une des deux bandes. Choisir le mode « 802.11s », donner un identifiant de maillage (Mesh ID), choisir le réseau LAN, puis dans Wireless Security choisir « WPA3-SAE » et un mot de passe. Cliquer sur Save, puis Save & Apply.
- **Vérification :** la commande `iw dev mesh0 info` affiche `type mesh point`. [À VALIDER : le nom de l'interface peut différer quand elle est créée par LuCI]
- **Source :** s1

### Étape 6 : Régler les autres routeurs de la même façon

- **Action :** sur chaque autre routeur, créer la même interface : même identifiant de maillage, même canal, même mot de passe. Avant cela, lui donner une adresse fixe différente sur le même réseau (par exemple `192.168.1.2`, puis `192.168.1.3`), hors de la plage distribuée par le premier routeur, et y désactiver le service DHCP : un seul routeur du réseau distribue les adresses.
- **Vérification :** chaque routeur répond à sa propre adresse, et un seul distribue des adresses.
- **Source :** s1 (même identifiant, même canal, même clé) ; s3 (adresse fixe et DHCP désactivé, décrits pour un point d'accès relié par câble) [À VALIDER : application de cette règle à un routeur relié par le maillage]

### Étape 7 : Ajouter le Wi-Fi ordinaire pour les téléphones

- **Action :** sur chaque routeur, garder ou créer en plus un réseau Wi-Fi ordinaire (mode Access Point) rattaché au même réseau LAN, avec son propre nom et son mot de passe : c'est à lui que les téléphones se connectent.
- **Vérification :** un téléphone voit le nom du réseau près de chaque routeur et s'y connecte.
- **Source :** s1 (les appareils des utilisateurs n'entrent pas dans le maillage) ; le réglage du point d'accès : aucune source ouverte lue (étape créée, à tester)

### Étape 8 : Vérifier que les routeurs se voient

- **Action :** sur un routeur, taper `iw dev mesh0 station dump`, en remplaçant `mesh0` par le nom de son interface de maillage.
- **Vérification :** chaque routeur voisin apparaît avec la mention `mesh plink: ESTAB`.
- **Source :** s1

### Étape 9 : Placer les routeurs

- **Action :** poser chaque routeur à sa place, à l'intérieur, près d'une fenêtre tournée vers le routeur voisin. Relever la ligne `signal` de la commande de l'étape 8 et déplacer le routeur jusqu'à obtenir la meilleure valeur. [À VALIDER : niveau de signal à viser]
- **Vérification :** le lien reste établi pendant une heure, routeurs en place.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 10 : Relier la station et tester

- **Action :** brancher la station CivicNode par câble sur un port LAN d'un des routeurs. Depuis un téléphone connecté au Wi-Fi d'un autre routeur, ouvrir l'adresse de la station.
- **Vérification :** les fiches s'affichent sur le téléphone, à travers le maillage.
- **Source :** aucune source ouverte (étape créée, à tester)

## 4. Si ça coince

- **Étape 3 — pas de ligne `mesh point`.** Cette radio ne sait pas mailler : utilisez ce routeur comme simple point d'accès, relié par câble.
- **Étape 8 — aucun voisin n'apparaît.** Vérifiez, dans l'ordre : même identifiant de maillage, même canal, même mot de passe, puis le paquet wpad de l'étape 4 sur chaque routeur.
- **Le réseau entier se fige après l'ajout d'un câble ou d'une seconde bande.** C'est une boucle : un maillage ne doit avoir ni liaison par câble entre deux de ses routeurs, ni deux maillages en parallèle (2,4 GHz et 5 GHz), sans le paquet mesh11sd ou des règles spéciales. Retirez le câble ou le second maillage.
- **Les liens tombent sans raison avec plus de trois routeurs.** La configuration simple ne suffit plus : le wiki OpenWrt renvoie au paquet mesh11sd, que cette fiche ne couvre pas.
- **Deux appareils reçoivent la même adresse.** Deux routeurs distribuent des adresses : désactivez le DHCP sur tous sauf un (étape 6).

## 5. Ressource

### Ce que disent les sources

Le wiki OpenWrt distingue le maillage 802.11s de l'itinérance entre bornes, indique le paquet wpad nécessaire au chiffrement, décrit la configuration par LuCI ou par le fichier `/etc/config/wireless`, précise qu'elle suffit pour deux ou trois routeurs proches, et avertit des boucles (source s1). Il donne la commande qui vérifie la prise en charge par la radio (source s2) et le principe d'un routeur secondaire qui ne distribue pas d'adresses (source s3).

L'installation d'OpenWrt (étape 2), le point d'accès pour les téléphones (étape 7), le placement (étape 9) et le raccordement de la station (étape 10) ne s'appuient sur aucune source ouverte lue : ils sont à tester.

### Pour aller plus loin

- Table du matériel pris en charge par OpenWrt : https://openwrt.org/toh/start (non ouverte pour cette fiche).
- Paquet mesh11sd, pour un maillage de plus de trois routeurs : décrit sur le wiki OpenWrt.
- Fiche *Point d'accès Wi-Fi local*.
