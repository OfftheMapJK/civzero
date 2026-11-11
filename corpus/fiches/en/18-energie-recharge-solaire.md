---
titre: "Charge a 12 V battery with a panel and a controller"
temps: "one to two days in the workshop"
exige_avance: "solar panel, charge controller suited to the battery, cables, fuses, multimeter"
---

# Charge a 12 V battery with a panel and a controller

Generate your own energy for the station's battery. **No figure in this skill should be applied before review.**

## 1. Principle

The panel is never connected directly to the battery: a **charge controller** goes between the two and adapts the charge to the type of battery. There are two families of controllers: PWM, which are simple, and MPPT, which get more out of the panel. A panel produces a voltage as soon as it receives light, even with its cables disconnected.

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - All those of the *Measuring and protecting a 12 V circuit* skill.
> - The panel is live in the light: cover it during wiring.
> - Mounting at height or on a roof: risk of falling. Outside the scope of the beta. [TO CHECK: acceptable mounting conditions]

## 3. Step by step

### Step 1: Read the panel and the controller

- **Action:** note on the panel the open-circuit voltage (Voc), the short-circuit current (Isc) and the power; on the controller, the battery voltage, the maximum current and the maximum voltage allowed on the panel side.
- **Check:** the panel's open-circuit voltage stays below the controller's maximum, with a margin. [TO CHECK: margin in cold weather; suggestion received: increase the open-circuit voltage by 15 to 20%]
- **Source:** manuals of the panel and the controller

### Step 2: Set the battery type

- **Action:** configure the controller for your battery's technology (lead-acid, lithium iron phosphate…).
- **Check:** the controller shows the right type.
- **Source:** controller manual

### Step 3: Cover the panel

- **Action:** put an opaque cover over the panel, or turn it face down.
- **Check:** the multimeter measures almost no voltage at the panel's terminals.
- **Source:** *Use a multimeter* skill

### Step 4: Connect in the order of the manual

- **Action:** follow the connection order given by the controller's manual, often the battery first, then the panel. [TO CHECK: order depending on the model; suggestion received: battery first, panel next, and the reverse when disconnecting]
- **Check:** each connection is made in the planned order, with a fuse on the battery side.
- **Source:** controller manual

### Step 5: Uncover and point the panel

- **Action:** remove the cover and point the panel towards the south (in the northern hemisphere). [TO CHECK: recommended tilt according to latitude and season]
- **Check:** the panel is in the sun, with no shadow cast on it.
- **Source:** [SOURCE NEEDED]

### Step 6: Check the charging

- **Action:** read the controller's display and measure the battery voltage.
- **Check:** the controller shows that charging is in progress.
- **Source:** controller manual

## 4. If you get stuck

- **Step 1 — the salvaged panel has no readable label.** Measure its open-circuit voltage in full sun with the multimeter. [TO CHECK: method for testing a salvaged panel]
- **Step 6 — no charging in the sun.** Check the fuses, the polarity on the panel side and shading.
- **Step 6 — the battery never fills up.** The panel is too small for the consumption: redo the assessment.

## 5. Resources

### Salvaged panels

Decommissioned panels are plentiful and often still usable: a typical resource of the interstices. Their real power is often lower than the label's.

### Possible sources (unchecked)

- [SOURCE NEEDED: guide to low-voltage off-grid solar installation]
- Wikipedia: “Charge controller”, “Maximum power point tracking”
