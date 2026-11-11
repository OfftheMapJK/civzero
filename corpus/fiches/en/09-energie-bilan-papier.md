---
titre: "Estimate your consumption and autonomy on paper"
temps: "an hour"
exige_avance: "paper, pencil, the labels of your devices"
---

# Estimate your consumption and autonomy on paper

Know how long a battery will run your devices, with four operations. Nothing is plugged in.

## 1. Principle

- **Energy used** (Wh) = power (W) × time in use (h).
- **Energy stored** in a battery (Wh) = capacity (Ah) × voltage (V).
- A battery is never fully emptied: only a fraction is usable.
- **Autonomy** (days) = usable energy ÷ consumption per day.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill: none, it is a calculation.

## 3. Step by step

### Step 1: List the devices and their power

- **Action:** for each device, note the power on the label (*Read a label* skill).
- **Check:** each line has a value in W.
- **Source:** *Read a label* skill

### Step 2: Estimate the time of use per day

- **Action:** write down how many hours a day each device runs.
- **Check:** each line has a duration in hours.
- **Source:** not applicable

### Step 3: Calculate the energy per device

- **Action:** power × duration. Illustrative example: an 8 W router switched on for 24 h uses 192 Wh per day.
- **Check:** each line has a value in Wh.
- **Source:** not applicable

### Step 4: Add up

- **Action:** add up the Wh of all the lines.
- **Check:** you have a total consumption per day.
- **Source:** not applicable

### Step 5: Calculate the usable energy of the battery

- **Action:** capacity × voltage × usable fraction. Commonly quoted orders of magnitude: about 50% for a lead-acid battery, 80 to 85% for a lithium iron phosphate (LFP) battery. Illustrative example: 12 V × 100 Ah = 1,200 Wh; for lead-acid, about 600 Wh usable.
- **Check:** you have a usable energy in Wh.
- **Source:** [SOURCE NEEDED]

### Step 6: Allow for losses

- **Action:** subtract the losses of the converters between the battery and the devices: count about 15% (order of magnitude).
- **Check:** the usable energy is corrected.
- **Source:** [SOURCE NEEDED]

### Step 7: Calculate the autonomy

- **Action:** corrected usable energy ÷ consumption per day.
- **Check:** you have an autonomy in days, rounded down.
- **Source:** not applicable

## 4. If you get stuck

- **Step 1 — the label gives amperes but not watts.** Multiply by the voltage.
- **Step 3 — the device does not always use its maximum power.** The label often gives the maximum: the calculation is cautious, which is good. Real measurement will come with wave 3.
- **Step 7 — the autonomy is too short.** First reduce the time of use of the most power-hungry devices before looking for a bigger battery.

## 5. Resources

### Table template

| Device | Power (W) | Hours per day | Energy (Wh/day) |
| --- | --- | --- | --- |
| … | … | … | … |
| **Total** | | | … |

### Possible sources (unchecked)

- Wikipedia: “Watt-hour”, “Ampere-hour”
- [SOURCE NEEDED: sizing guide for a low-voltage off-grid system]
