---
id: mesurer-niveau-cuve-esp32
titre: Mesurer le niveau d'une cuve avec un ESP32
accroche: "Elle explique comment mesurer, par ultrason et sans rien plonger dans l'eau, la hauteur d'eau d'une cuve de récupération, et en déduire ce qu'il reste."
socle: source
savoirs: [stocker-economiser-eau]
horizon: hours
temps: "une demi-journée, plus les essais"
vague: 3
milieu: [urbain, rural]
tier: [1]
exige_avance: "une carte ESP32, un capteur de distance à ultrason (étanche pour la cuve), des fils, un câble USB, un ordinateur avec l'Arduino IDE, un mètre ruban"
origine_materiel: neuf
variantes:
  - id: capteur-ultrason-5v-usb
    danger: vert
danger: vert
origine: creee
statut: brouillon
redaction: assistee-ia
reproductions: 0
impact:
  toxicite: "cartes électroniques"
  fin_de_vie: "voir fiche energie-fin-de-vie"
  passerelle: "savoir ce qu'il reste dans la cuve pour arroser sans tirer sur le réseau"
prerequis: [nodule-zero, recuperer-eau-pluie]
provenance:
  - id: s1
    titre: "Ping Ultrasonic Range Finder (Arduino Documentation)"
    auteur: "Arduino"
    source: "https://docs.arduino.cc/built-in-examples/sensors/Ping/"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "pulseIn() (Arduino Documentation, Language Reference)"
    auteur: "Arduino"
    source: "https://docs.arduino.cc/language-reference/en/functions/advanced-io/pulseIn/"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
attestations: []
medias:
  - fichier: capteur-ultrason-hc-sr04.jpg
    type: image
    etape: 1
    legende:
      fr: "Un capteur à ultrason HC-SR04, pour les essais sur table : deux cylindres (émetteur et récepteur) et quatre broches. Ce modèle n'est pas étanche."
      en: "An HC-SR04 ultrasonic sensor, for bench tests: two cylinders (transmitter and receiver) and four pins. This model is not waterproof."
    titre: "SparkFun HC-SR04 Ultrasonic-Sensor 13959-01a"
    auteur: "SparkFun"
    source: "https://commons.wikimedia.org/wiki/File:SparkFun_HC-SR04_Ultrasonic-Sensor_13959-01a.jpg"
    licence: "CC BY 2.0"
    verifie_le: "2026-11-12"
    telecharger: "https://commons.wikimedia.org/wiki/Special:FilePath/SparkFun_HC-SR04_Ultrasonic-Sensor_13959-01a.jpg"
  - fichier: niveau-cuve-ultrason.svg
    type: schema
    etape: 6
    legende:
      fr: "Mesure du niveau. 1 : tête du capteur, sous le couvercle. 2 : boîtier de la carte, hors de la cuve. 3 : hauteur entre le fond et le capteur. 4 : distance mesurée jusqu'à l'eau. 5 : hauteur d'eau, égale à la hauteur 3 moins la distance 4."
      en: "Measuring the level. 1: sensor head, under the lid. 2: board enclosure, outside the tank. 3: height between the bottom and the sensor. 4: measured distance to the water. 5: water height, equal to height 3 minus distance 4."
    titre: "Mesure du niveau d'une cuve par ultrason"
    auteur: "CivicNode"
    licence: "CC BY-SA 4.0"
    verifie_le: "2026-11-12"
    relu: false
maj: 2026-11-12
---

# Mesurer le niveau d'une cuve avec un ESP32

Savoir ce qu'il reste dans la cuve sans soulever le couvercle. Un petit capteur fixé sous le couvercle mesure la distance jusqu'à l'eau ; une carte ESP32 la convertit en hauteur d'eau. Cette fiche prolonge la fiche *Récupérer l'eau de pluie*.

## 1. Principe

Le capteur envoie une brève salve d'ultrasons vers le bas et écoute son écho sur la surface de l'eau. Le temps que met l'écho à revenir est celui d'un aller-retour : avec la vitesse du son, on en tire la distance entre le capteur et l'eau. La hauteur d'eau est la hauteur de la cuve moins cette distance. Rien ne trempe dans l'eau, et la cuve reste fermée.

## 2. Sécurité

> **NIVEAU : VERT (cercle)** — [Libellé officiel affiché depuis le Nodule Zéro]
>
> Risques propres à cette fiche :
> - Alimentation en 5 V seulement, par un chargeur USB fermé placé à l'abri, ou par une batterie USB. Aucun appareil en 230 V près de la cuve, aucune rallonge qui traîne dans l'herbe mouillée.
> - Le capteur et la carte attendent des tensions différentes : un mauvais branchement détruit la carte. Câbler hors tension et vérifier avant de brancher l'USB.
> - Ne percer la cuve que dans le couvercle, jamais dans la paroi. Reboucher autour du capteur : une cuve ouverte devient un gîte à moustiques (fiche *Récupérer l'eau de pluie*).
> - Ne pas se pencher dans une grande cuve, ne pas y descendre.
> - La mesure renseigne, elle ne commande rien : cette fiche ne pilote ni pompe ni vanne.

## 3. Pas-à-pas

Les broches, les durées et le programme donnés ici sont indicatifs. [À VALIDER : montage et programme à tester sur matériel réel]

### Étape 1 : Choisir le capteur

- **Action :** pour les essais sur table, un capteur à ultrason courant suffit (par exemple un module HC-SR04). Pour la cuve, prendre un modèle étanche, dont seule la tête va sous le couvercle. Relever sur sa notice la tension d'alimentation et les distances minimale et maximale qu'il mesure : un capteur de ce type mesure, par exemple, de 3 cm à 400 cm.
- **Vérification :** la distance maximale du capteur dépasse la hauteur de la cuve, et la distance minimale est notée.
- **Source :** s1 (principe et plage de 3 à 400 cm d'un capteur de ce type) ; le choix d'un modèle étanche : aucune source ouverte (étape créée, à tester)

### Étape 2 : Préparer l'ordinateur

- **Action :** installer l'Arduino IDE, puis y ajouter la prise en charge des cartes ESP32 par le gestionnaire de cartes, en suivant la documentation d'Espressif. Brancher la carte en USB et choisir son modèle et son port dans le menu des outils.
- **Vérification :** un programme vide se téléverse sur la carte sans erreur.
- **Source :** aucune source ouverte lue (étape créée, à tester)

### Étape 3 : Câbler sur table, hors tension

- **Action :** carte débranchée, relier la masse du capteur à une broche GND de la carte, son alimentation à la broche 5 V, sa broche de déclenchement (Trig) à une sortie de la carte, et sa broche d'écho (Echo) à une entrée. Si le capteur est alimenté en 5 V, sa broche d'écho sort du 5 V alors que les entrées de l'ESP32 n'acceptent que 3,3 V : intercaler un pont diviseur de deux résistances. [À VALIDER : valeurs des résistances et broches à utiliser]
- **Vérification :** chaque fil a été suivi du doigt d'un bout à l'autre et correspond au schéma papier.
- **Source :** s1 (alimentation en 5 V et masse ; s1 décrit un capteur à une seule broche de signal, qui sert au déclenchement et à l'écho) ; le câblage à deux broches Trig et Echo et l'adaptation à l'ESP32 : aucune source ouverte (étape créée, à tester)

### Étape 4 : Programmer la mesure

- **Action :** écrire un programme qui envoie une brève impulsion sur la broche de déclenchement, puis mesure avec `pulseIn()` la durée, en microsecondes, de l'impulsion renvoyée sur la broche d'écho. Cette durée est celle de l'aller-retour du son : la distance est la moitié de cette durée multipliée par la vitesse du son. Afficher le résultat sur le port série. Un exemple est donné en fin de fiche.
- **Vérification :** le moniteur série affiche une valeur chaque seconde.
- **Source :** s1 (principe de la mesure) et s2 (`pulseIn()` renvoie une durée en microsecondes, ou 0 sans écho) [À VALIDER : valeur de la vitesse du son et durée de l'impulsion de déclenchement]

### Étape 5 : Vérifier la mesure contre un mètre

- **Action :** pointer le capteur vers un mur, mesurer la distance au mètre ruban et comparer avec la valeur affichée, à trois distances différentes.
- **Vérification :** l'écart entre le mètre et l'affichage est noté pour chaque distance et reste du même ordre.
- **Source :** aucune source ouverte (étape créée, à tester) [À VALIDER : écart acceptable]

### Étape 6 : Relever les dimensions de la cuve

- **Action :** mesurer la hauteur entre le fond de la cuve et l'endroit où sera la tête du capteur. Noter la capacité de la cuve. La hauteur d'eau est cette hauteur moins la distance mesurée ; pour une cuve aux parois droites, le volume restant est la capacité multipliée par la hauteur d'eau et divisée par la hauteur de la cuve pleine.
- **Vérification :** hauteur, capacité et formule sont écrites, et un calcul à la main sur un exemple donne un résultat plausible.
- **Source :** aucune source ouverte (étape créée, à tester) [À VALIDER : cuves aux parois non droites]

### Étape 7 : Poser le capteur sous le couvercle

- **Action :** percer le couvercle au diamètre de la tête du capteur, loin de l'arrivée d'eau et des parois. Fixer la tête bien à la verticale, tournée vers le bas, et reboucher autour. Placer la carte dans un boîtier fermé, hors de la cuve, à l'abri de la pluie.
- **Vérification :** le couvercle ferme comme avant, et rien d'autre que la tête du capteur n'est dans la cuve.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 8 : Alimenter et lire

- **Action :** alimenter la carte en USB et lire la hauteur d'eau sur le port série d'un ordinateur. L'envoi de la mesure à la station par Wi-Fi n'est pas décrit ici.
- **Vérification :** la valeur affichée correspond, à l'écart de l'étape 5 près, à une mesure faite à la règle par le couvercle ouvert.
- **Source :** aucune source ouverte (étape créée, à tester)

### Étape 9 : Recaler chaque saison

- **Action :** une fois par saison, comparer l'affichage à une mesure à la règle et nettoyer la tête du capteur.
- **Vérification :** la date et l'écart relevé sont notés.
- **Source :** aucune source ouverte (étape créée, à tester)

## 4. Si ça coince

- **Étape 4 — la valeur reste à zéro.** `pulseIn()` renvoie 0 quand aucun écho n'est revenu à temps : vérifiez le câblage de la broche d'écho et l'alimentation du capteur.
- **Étape 5 — la valeur est fausse d'un facteur constant.** Reprenez la formule : la durée mesurée est un aller-retour, il faut la diviser par deux.
- **Étape 8 — la valeur saute d'une mesure à l'autre.** Le capteur voit une paroi, l'arrivée d'eau ou de la condensation sur sa tête : déplacez-le vers le centre, et faites la moyenne de plusieurs mesures.
- **La cuve est presque pleine et la valeur devient absurde.** L'eau est plus près que la distance minimale du capteur : surélevez la tête, ou acceptez que la mesure ne soit pas fiable cuve pleine.
- **La carte ne répond plus après le câblage.** Débranchez tout ; une entrée a peut-être reçu du 5 V. Reprenez l'étape 3 avec une carte neuve.

## 5. Ressource

### Ce que disent les sources

La documentation Arduino décrit le principe : une brève impulsion déclenche le capteur, qui renvoie une impulsion dont la durée est celle de l'aller-retour du son, convertie en distance grâce à la vitesse du son (source s1). Elle décrit `pulseIn()`, qui mesure cette durée en microsecondes et renvoie 0 faute d'écho (source s2).

Tout le reste (capteur étanche, adaptation à l'ESP32 et à ses entrées en 3,3 V, pose dans la cuve, calcul du volume) ne s'appuie sur aucune source ouverte : la fiche est à tester et à reproduire. La documentation d'ESPHome, sous licence non commerciale, n'a pas été utilisée.

### Exemple de programme (non testé)

```cpp
// Broches et constantes indicatives : À VALIDER sur matériel réel.
const int TRIG = 5;
const int ECHO = 18;   // à travers un pont diviseur si le capteur est en 5 V

void setup() {
  Serial.begin(115200);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  unsigned long duree = pulseIn(ECHO, HIGH, 30000);   // microsecondes, 0 si pas d'écho
  if (duree == 0) {
    Serial.println("pas d'echo");
  } else {
    float distance_cm = duree * 0.0343 / 2.0;         // vitesse du son : À VALIDER
    Serial.println(distance_cm);
  }
  delay(1000);
}
```

### Pour aller plus loin

- Fiche *Récupérer l'eau de pluie*.
- Documentation d'Espressif pour l'Arduino IDE : https://docs.espressif.com/projects/arduino-esp32/ (non ouverte pour cette fiche).
