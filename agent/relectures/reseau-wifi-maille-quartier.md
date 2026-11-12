# Relecture de fidélité : reseau-wifi-maille-quartier

Relecture IA du 2026-11-12 (claude-sonnet-5-5) : **conforme**.

## Points à vérifier

- [ ] Étape 9 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, sans effet sur le verdict. Elle réutilise la commande de l'étape 8 (s1), ce qui est exact.
- [ ] Étape 10 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, sans effet sur le verdict.
- [ ] Niveaux : Niveau vert, sans variante. Seul le risque « maillage sans chiffrement » rejoint une source (s1 : `encryption 'sae'` ou `none` si l'on ne veut pas chiffrer; chiffrement par wpad-mesh). Les autres risques (bloc secteur, toit et foudre, accès au réseau d'autrui, règles du pays pour la puissance et les canaux) viennent de la fiche, sans source; la dernière est marquée À VALIDER.

## Étapes jugées conformes (en vérifier trois au hasard)

- [ ] Étape 1 (s1) : « A mesh network is a multi point to multi point layer 2 mac-routing backhaul used to interconnect mesh peers. Mesh peers are generally non-user devices, such as routers, access points ... Are you sure you want a mesh? If you are looking for a solution to enable your user devices to seamlessly roam from one access point to another in your home, you are looking for roaming ..., not 802.11s. »
- [ ] Étape 2 (s3) : « Open the router GUI : From a browser, navigate to LuCI by going to http://192.168.1.1 ... Use an Ethernet cable to connect your computer to one of the LAN ports (not the Internet / WAN port). »
- [ ] Étape 3 (s2 et s1) : « Use the following to determine if your hardware supports 802.11s mesh. iw list | grep "Supported interface modes" -A 9 ... Supported interface modes: ... * mesh point ... Apart from a few exceptions, most wireless drivers used by OpenWrt support 802.11s mesh. Exceptions are Broadcom wireless chipsets and most usb wireless dongles. (s2) ; Most up to date open source drivers work. (s1) »
- [ ] Étape 4 (s1) : « If you want to run an encrypted mesh, you must install a version of wpad that supports mesh encryption. ... You can find out which one you have in the Luci Web Interface with the System→Software Menu, Update Lists..., then type in the Filter: 'wpad'. ... Remove it and then Install.. the -mesh variant. Or with the following commands: opkg list-installed wpad * ... Examples: wpad-mesh-mbedtls ... WARNING: You must reboot or restart the wpad service before the new wpad version will become active. »
- [ ] Étape 5 (s1) : « Go to Network→Wireless Click 'Add' on either the 2.4 or 5gz Wifi bands ... Mode Select: '802.11s', and put in a 'Mesh ID' ... Select LAN for the Network. ... Wireless Security, choose 'WPA3-SAE' and put in a password to be shared among your mesh nodes. Save Now Save & Apply ... iw dev mesh0 info ... type mesh point »
- [ ] Étape 6 (s1 et s3) : « s1 : Every device you want to participate in the mesh must be configured in the same way ie same mesh_id, same channel, same key. s3 : use 192.168.1.2/24 ... outside the DHCP range ... When adding multiple wireless APs, you could use 192.168.1.3/24, 192.168.1.4/24 ... Disable DHCPv4: ... The wireless AP will not provide DHCP addresses, but will defer to the main router. »
- [ ] Étape 7 (s1) : « A normal user device, such as a phone, tablet, laptop etc., cannot connect to a mesh network. Instead, connection is achieved via a mesh gateway, a special type of mesh peer. »
- [ ] Étape 8 (s1) : « Use the iw command to display peer links ... iw dev $MESH_IFACE station dump ... signal: -61 dBm ... mesh plink: ESTAB »

Puis suivre la liste de la seconde partie de agent/RELECTURE.md.
