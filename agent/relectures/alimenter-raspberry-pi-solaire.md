# Relecture de fidélité : alimenter-raspberry-pi-solaire

Relecture IA du 2026-11-12 (claude-sonnet-5-5) : **conforme**.

## Points à vérifier

- [ ] Étape 2 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, sans effet sur le verdict.
- [ ] Étape 4 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, sans effet sur le verdict. PVGIS n'est pas dans la provenance.
- [ ] Étape 8 : sans_source, Cette étape ne cite que des fiches de CivicNode, aucune source adaptée : pas jugée. Elle n'est pas non plus marquée « aucune source ouverte »; elle renvoie aux fiches *Mesure et protection d'un circuit 12 V* et *Recharger une batterie 12 V…*.
- [ ] Étape 11 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, sans effet sur le verdict.
- [ ] Niveaux : Niveau orange, sans variante. Dans les sources : régulateur adapté au LFP, car une tension de charge trop élevée abîme les éléments (s3, « excessive charging voltages ») ; protection de la batterie (s3) ; seuil de sous-tension (s1). Sans source, et dites comme telles par la fiche : court-circuit, arc, incendie, panneau sous tension, chute en hauteur, mesure à vide du convertisseur.

## Étapes jugées conformes (en vérifier trois au hasard)

- [ ] Étape 1 (s1) : « Typical bare-board active current consumption : Zero 2 W 350mA ; Raspberry Pi 3 Model B+ 500mA ; Raspberry Pi 4 Model B 600mA ; Raspberry Pi 5 800mA. All models require a 5.1V supply. »
- [ ] Étape 3 (s3) : « Because of the nominal 3.2 V output, four cells can be connected in series for a nominal 12.8 V. ... provided the charging systems are adapted not to damage the LFP cells through excessive charging voltages (beyond 3.6 volts DC per cell while under charge) ... a protection system also needs to be implemented to ensure no cell can be discharged below a voltage of 2.5 V. »
- [ ] Étape 5 (s3) : « ... provided the charging systems are adapted not to damage the LFP cells through excessive charging voltages ... »
- [ ] Étape 6 (s2 et s1) : « s2 : Raspberry Pi 4 Model B and Raspberry Pi 400 | 5 V at 3 A ; Raspberry Pi 5 and Raspberry Pi 500 | 5 V at 5 A; 5 V at 3 A limits peripherals to 600 mA ; Raspberry Pi 3 (all models) | 5 V at 2.5 A ; Raspberry Pi Zero (all models) | 5 V at 2.5 A. s1 : All models up to the Raspberry Pi 3 require a micro USB power connector, while Raspberry Pi 4, Raspberry Pi 400, and Raspberry Pi 5 use a USB-C connector. »
- [ ] Étape 7 (s1) : « All models require a 5.1V supply, but the current required generally increases according to model. »
- [ ] Étape 9 (s1) : « On all models of Raspberry Pi since the Raspberry Pi B+ (2014) except the Zero range, there is low-voltage detection circuitry that will detect if the supply voltage drops below 4.63 V (±5%). This will result in an entry being added to the kernel log. »
- [ ] Étape 10 (s4 et s1) : « s4 : Set the root file system to read-only. This uses a temporary overlay stored in RAM. Overlay File System (4 Performance Options > P2 Overlay File System). s1 : As with any computing device, power dropouts can cause storage corruption. »

Puis suivre la liste de la seconde partie de agent/RELECTURE.md.
