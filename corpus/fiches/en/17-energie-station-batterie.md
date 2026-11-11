---
titre: "Power the station from a 12 V battery"
temps: "a day in the workshop"
exige_avance: "12 V battery, suitable DC-DC converter, connector that fits the station, fuse"
---

# Power the station from a 12 V battery

Run the station without mains power, without going through a 230 V inverter. **No figure in this skill should be applied before review and a trial on real hardware.**

## 1. Principle

Many mini-PCs expect a DC voltage higher than 12 V (often around 19 or 20 V: read the label). A DC-DC converter raises the battery voltage to the required value. A battery's voltage varies with its charge: the converter must accept that whole range. Some manufacturers also check the charger's identity through a pin of the connector.

A boost converter cannot lower a voltage: if the battery exceeds the set voltage, it passes through almost unchanged. This is not a problem for a station that expects 19 V, since the battery never reaches it. For a device that expects a voltage close to the battery's, you need a buck-boost converter.

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - All those of the *Measuring and protecting a 12 V circuit* skill.
> - A wrongly set output voltage can destroy the station: set it with no load, with the multimeter, before connecting.
> - Discharging too deeply damages the battery.

## 3. Step by step

### Step 1: Read the station's input

- **Action:** note on the original adapter the output voltage, current and polarity, and identify the connector.
- **Check:** voltage, current, polarity and connector type noted.
- **Source:** *Read a label* skill

### Step 2: Choose the converter

- **Action:** a converter that supplies the required voltage, with a power margin, and accepts the whole voltage range of the battery. [TO CHECK: power margin and input voltage range]
- **Check:** the converter's specifications cover the needs noted in step 1.
- **Source:** [SOURCE NEEDED]

### Step 3: Check the connector question

- **Action:** find out whether your mini-PC model requires a connector with an identification pin. [TO CHECK: trial on real hardware, model by model]
- **Check:** you know whether a standard connector is enough.
- **Source:** [SOURCE NEEDED]

### Step 4: Set the output with no load

- **Action:** connect the converter to the battery (with a fuse), **without the station**, and set the output with the multimeter.
- **Check:** the multimeter shows the voltage required by the station, with the correct polarity.
- **Source:** *Use a multimeter* skill

### Step 5: Wire with protection

- **Action:** apply the *Measuring and protecting a 12 V circuit* skill between the battery and the converter.
- **Check:** fuse as close as possible to the + terminal, continuity check done.
- **Source:** *Measuring and protecting a 12 V circuit* skill

### Step 6: Protect the battery against deep discharge

- **Action:** add an automatic low-voltage cut-off, or shut the station down at a threshold. [TO CHECK: threshold according to the technology; suggestion received: 11.8 V for lead-acid, 12.0 V for LFP, which corresponds to an almost empty LFP battery; many LFP batteries have their own protection]
- **Check:** the station stops before the battery goes below the threshold.
- **Source:** [SOURCE NEEDED]

### Step 7: Measure the real consumption

- **Action:** note the station's consumption at rest and under load, then redo the assessment (*Estimate your consumption* skill).
- **Check:** the calculated autonomy is based on measurements, not on the label.
- **Source:** [TO CHECK: method for measuring current, outside the scope of the multimeter skill]

## 4. If you get stuck

- **Step 4 — the output cannot be set to the right value.** The converter is not suitable: do not connect the station.
- **Step 3 — the station refuses to start on the converter.** Probably an identification pin problem. [TO CHECK: known solutions depending on the model]
- **Step 6 — the station shuts down too early.** Redo the autonomy assessment and reduce what is running.

## 5. Resources

### Possible sources (unchecked)

- [SOURCE NEEDED: manual of the chosen converter]
- Wikipedia: “Boost converter”
