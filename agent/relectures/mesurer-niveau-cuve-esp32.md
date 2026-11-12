# Relecture de fidélité : mesurer-niveau-cuve-esp32

Relecture IA du 2026-11-12 (claude-sonnet-5-5) : **conforme**.

## Points à vérifier

- [ ] Étape 2 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Étape 5 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Étape 6 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Étape 7 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Étape 8 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Étape 9 : sans_source, Étape déclarée « aucune source ouverte (lue) (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict.
- [ ] Niveaux : Niveau vert, sans variante. Aucun risque de la section Sécurité n'est tiré des deux sources (5 V seulement, tension de l'ESP32, percer le couvercle, moustiques, cuve) : tous viennent de la fiche, sans attribution à une source.

## Étapes jugées conformes (en vérifier trois au hasard)

- [ ] Étape 1 (s1) : « The SEN136B5B is an ultrasonic range finder from Seeedstudio. It detects the distance of the closest object in front of the sensor (from 3 cm up to 400 cm). It works by sending out a burst of ultrasound and listening for the echo when it bounces off of an object. »
- [ ] Étape 3 (s1) : « The 5V pin of the SEN136B5B is connected to the 5V pin on the board, the GND pin is connected to the GND pin, and the SIG (signal) pin is connected to digital pin 7 on the board. »
- [ ] Étape 4 (s1 et s2) : « s1 : The Arduino board sends a short pulse to trigger the detection, then listens for a pulse on the same pin using the pulseIn() function. The duration of this second pulse is equal to the time taken by the ultrasound to travel to the object and back to the sensor. Using the speed of sound, this time can be converted to distance. s2 : Returns the length of the pulse in microseconds or gives up and returns 0 if no complete pulse was received within the timeout. »

Puis suivre la liste de la seconde partie de agent/RELECTURE.md.
