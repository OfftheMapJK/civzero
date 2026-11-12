---
titre: "Measure a tank's water level with an ESP32"
accroche: "It explains how to measure, by ultrasound and without putting anything in the water, the water height in a rain tank, and work out what is left."
temps: "half a day, plus the tests"
exige_avance: "an ESP32 board, an ultrasonic distance sensor (waterproof for the tank), wires, a USB cable, a computer with the Arduino IDE, a tape measure"
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
---

# Measure a tank's water level with an ESP32

Know what is left in the tank without lifting the lid. A small sensor fixed under the lid measures the distance to the water; an ESP32 board turns it into a water height. This skill follows on from the *Harvest rainwater* skill.

## 1. Principle

The sensor sends a short burst of ultrasound downwards and listens for its echo on the water surface. The time the echo takes to come back is that of a round trip: with the speed of sound, you get the distance between the sensor and the water. The water height is the tank's height minus this distance. Nothing goes in the water, and the tank stays closed.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - 5 V power only, from a closed USB charger kept under shelter, or from a USB power bank. No 230 V device near the tank, no extension lead lying in wet grass.
> - The sensor and the board expect different voltages: wrong wiring destroys the board. Wire with the power off and check before plugging in the USB.
> - Drill the tank only in the lid, never in the wall. Seal around the sensor: an open tank becomes a mosquito breeding site (*Harvest rainwater* skill).
> - Do not lean into a large tank, do not climb into it.
> - The measurement informs, it controls nothing: this skill drives neither pump nor valve.

## 3. Step by step

The pins, timings and program given here are indicative. [TO CHECK: assembly and program to test on real equipment]

### Step 1: Choose the sensor

- **Action:** for bench tests, a common ultrasonic sensor is enough (for example an HC-SR04 module). For the tank, take a waterproof model, of which only the head goes under the lid. Note in its manual the supply voltage and the minimum and maximum distances it measures: a sensor of this type measures, for example, from 3 cm to 400 cm.
- **Check:** the sensor's maximum distance exceeds the tank's height, and the minimum distance is written down.
- **Source:** s1 (principle and 3 to 400 cm range of a sensor of this type); choosing a waterproof model: no open source (created step, to be tested)

### Step 2: Prepare the computer

- **Action:** install the Arduino IDE, then add support for ESP32 boards through the board manager, following Espressif's documentation. Plug the board in by USB and choose its model and port in the tools menu.
- **Check:** an empty program uploads to the board without error.
- **Source:** no open source read (created step, to be tested)

### Step 3: Wire on the bench, power off

- **Action:** with the board unplugged, connect the sensor's ground to a GND pin of the board, its power to the 5 V pin, its trigger pin (Trig) to an output of the board, and its echo pin (Echo) to an input. If the sensor is powered at 5 V, its echo pin outputs 5 V while the ESP32's inputs accept only 3.3 V: insert a voltage divider made of two resistors. [TO CHECK: resistor values and pins to use]
- **Check:** each wire has been traced with a finger from end to end and matches the paper diagram.
- **Source:** s1 (5 V power and ground; s1 describes a sensor with a single signal pin, used for both trigger and echo); wiring with two pins, Trig and Echo, and adapting to the ESP32: no open source (created step, to be tested)

### Step 4: Program the measurement

- **Action:** write a program that sends a short pulse on the trigger pin, then measures with `pulseIn()` the duration, in microseconds, of the pulse returned on the echo pin. This duration is that of the sound's round trip: the distance is half of this duration multiplied by the speed of sound. Show the result on the serial port. An example is given at the end of the skill.
- **Check:** the serial monitor shows a value every second.
- **Source:** s1 (measurement principle) and s2 (`pulseIn()` returns a duration in microseconds, or 0 with no echo) [TO CHECK: value of the speed of sound and duration of the trigger pulse]

### Step 5: Check the measurement against a tape measure

- **Action:** point the sensor at a wall, measure the distance with the tape measure and compare with the value shown, at three different distances.
- **Check:** the gap between the tape measure and the display is written down for each distance and stays of the same order.
- **Source:** no open source (created step, to be tested) [TO CHECK: acceptable gap]

### Step 6: Take the tank's dimensions

- **Action:** measure the height between the bottom of the tank and where the sensor head will be. Note the tank's capacity. The water height is this height minus the measured distance; for a tank with straight walls, the volume left is the capacity multiplied by the water height and divided by the height of the full tank.
- **Check:** height, capacity and formula are written down, and a hand calculation on an example gives a plausible result.
- **Source:** no open source (created step, to be tested) [TO CHECK: tanks with walls that are not straight]

### Step 7: Fit the sensor under the lid

- **Action:** drill the lid to the diameter of the sensor head, away from the water inlet and the walls. Fix the head straight up and down, facing downwards, and seal around it. Put the board in a closed enclosure, outside the tank, sheltered from the rain.
- **Check:** the lid closes as before, and nothing but the sensor head is in the tank.
- **Source:** no open source (created step, to be tested)

### Step 8: Power and read

- **Action:** power the board by USB and read the water height on a computer's serial port. Sending the measurement to the station over Wi-Fi is not described here.
- **Check:** the value shown matches, within the gap from step 5, a measurement made with a ruler through the open lid.
- **Source:** no open source (created step, to be tested)

### Step 9: Recalibrate each season

- **Action:** once a season, compare the display with a ruler measurement and clean the sensor head.
- **Check:** the date and the gap found are written down.
- **Source:** no open source (created step, to be tested)

## 4. If you get stuck

- **Step 4 — the value stays at zero.** `pulseIn()` returns 0 when no echo came back in time: check the wiring of the echo pin and the sensor's power.
- **Step 5 — the value is off by a constant factor.** Go back to the formula: the measured duration is a round trip, it must be divided by two.
- **Step 8 — the value jumps from one reading to the next.** The sensor sees a wall, the water inlet or condensation on its head: move it towards the centre, and average several readings.
- **The tank is almost full and the value becomes absurd.** The water is closer than the sensor's minimum distance: raise the head, or accept that the measurement is not reliable with a full tank.
- **The board no longer responds after wiring.** Unplug everything; an input may have received 5 V. Go back to step 3 with a new board.

## 5. Resources

### What the sources say

The Arduino documentation describes the principle: a short pulse triggers the sensor, which returns a pulse whose duration is that of the sound's round trip, converted into a distance using the speed of sound (source s1). It describes `pulseIn()`, which measures this duration in microseconds and returns 0 when there is no echo (source s2).

Everything else (waterproof sensor, adapting to the ESP32 and its 3.3 V inputs, fitting in the tank, volume calculation) relies on no open source: the skill is to be tested and reproduced. The ESPHome documentation, under a non-commercial licence, was not used.

### Example program (not tested)

```cpp
// Indicative pins and constants: TO CHECK on real equipment.
const int TRIG = 5;
const int ECHO = 18;   // through a voltage divider if the sensor runs at 5 V

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
  unsigned long duration = pulseIn(ECHO, HIGH, 30000);   // microseconds, 0 if no echo
  if (duration == 0) {
    Serial.println("no echo");
  } else {
    float distance_cm = duration * 0.0343 / 2.0;         // speed of sound: TO CHECK
    Serial.println(distance_cm);
  }
  delay(1000);
}
```

### Further reading

- *Harvest rainwater* skill.
- Espressif's documentation for the Arduino IDE: https://docs.espressif.com/projects/arduino-esp32/ (not opened for this skill).
