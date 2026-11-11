---
titre: "Build a pedal generator for charging"
accroche: "It describes how a bike on a stand, a salvaged motor and a 12 V battery make a small workshop power plant, to be built as a group and reviewed before any trial."
temps: "several weeks to a few months, as a group"
exige_avance: "a bike and a roller trainer, a salvaged permanent-magnet DC motor, a power diode, a charge controller, a 12 V battery, fuses, cables, a 12 V to USB converter, a multimeter"
---

# Build a pedal generator for charging

The most ambitious project of the series: turning leg power into stored energy. It is meant for a group, in a workshop, not for one person alone during an outage. **No figure in this skill should be applied before review.**

## 1. Principle

The bike's rear tyre, resting on a roller stand, drives a DC motor that then works as a generator. The current goes through a **diode**, which stops it from flowing back to the motor, then through a **charge controller**, which protects the battery, as with a solar panel. The battery stores the energy, and a USB converter charges the phones. You never pedal directly for a phone: you pedal for the battery. [TO CHECK: power a person can supply for a long time, and whether a solar charge controller works with a generator]

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - All those of the *Measuring and protecting a 12 V circuit* skill.
> - Rotating parts: wheel, roller, belt. Protect fingers, long hair and loose clothing; no one comes close while someone is pedalling.
> - A motor driven fast with no load can produce a higher voltage than expected: never pedal with the circuit open. [TO CHECK: overvoltage protection]
> - A lead-acid battery gives off a flammable gas while charging: ventilated room, no flame or spark nearby.

## 3. Step by step

### Step 1: Gather and read the parts

- **Action:** note the motor's rated voltage and current, the controller's input range and the battery type (*Read a label* skill). Have a competent person approve the choice of parts before any assembly.
- **Check:** the voltages of the motor, the controller and the battery are compatible, and a reviewer has confirmed it.
- **Source:** [SOURCE NEEDED]

### Step 2: Fix the motor to the stand

- **Action:** fix the motor so that its shaft is driven by the tyre or the roller, without play, and put a cover over the rotating parts.
- **Check:** when you turn the wheel by hand, the motor's shaft turns without slipping or vibrating.
- **Source:** [SOURCE NEEDED]

### Step 3: Measure the no-load voltage, at low speed

- **Action:** with nothing connected, pedal gently and measure the voltage at the motor's terminals with the multimeter (*Use a multimeter* skill). Do not pedal hard with the circuit open.
- **Check:** the measured voltage stays within the controller's input range.
- **Source:** [SOURCE NEEDED]

### Step 4: Wire with protection

- **Action:** motor, then diode, then controller, then battery, with a fuse near the battery (*Measuring and protecting a 12 V circuit* skill). Connect in the order given by the controller's manual, usually the battery first.
- **Check:** a reviewer has checked the wiring before the first trial.
- **Source:** controller manual

### Step 5: First trial

- **Action:** pedal at a moderate pace and watch the controller's charging light. Stop at the slightest heating or smell.
- **Check:** the controller shows that the battery is charging; nothing heats up abnormally.
- **Source:** controller manual

### Step 6: Charge the phones from the battery

- **Action:** connect the 12 V to USB converter to the battery, protected by a fuse (*Power the station from a 12 V battery* skill).
- **Check:** the phones charge, including when no one is pedalling.
- **Source:** converter manual

## 4. If you get stuck

- **Step 5 — the controller does not charge.** The motor's voltage is too low at this speed: pedal faster or rethink the ratio between the wheel and the motor shaft with the reviewer.
- **Step 2 — the tyre slips on the shaft.** Increase the tyre pressure and the tightening of the stand, or add a suitable roller.
- **Step 3 — the voltage climbs very high.** Stop pedalling: the motor is not suited to this controller without extra protection.

## 5. Resources

### Possible sources (unchecked)

- “Bike generator” build guides from self-build workshops and low-tech labs.
- Manuals of charge controllers.
