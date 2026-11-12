---
titre: "Power a Raspberry Pi with solar all year round"
accroche: "It explains how to size and assemble a panel, a charge controller, a battery and a 5 V converter so that a Raspberry Pi keeps running in winter too."
temps: "one to two days of workshop, then a week of observation"
exige_avance: "a solar panel, a charge controller adjustable for lithium iron phosphate, a 12 V lithium iron phosphate battery with built-in protection, a 12 V to 5 V converter, fuses and fuse holders, cables, a multimeter"
provenance:
  - id: s1
    titre: "Raspberry Pi hardware, Power supply (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Getting started (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/getting-started.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Lithium iron phosphate battery"
    auteur: "Wikipedia contributors"
    source: "https://en.wikipedia.org/wiki/Lithium_iron_phosphate_battery"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s4
    titre: "Configuration (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/configuration.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
---

# Power a Raspberry Pi with solar all year round

Run the station with no mains socket, summer and winter. **No figure in this skill is to be applied before review by a competent person and a test on real equipment.**

## 1. Principle

The chain has five links: the panel, the charge controller, the 12 V battery, a fuse, then a converter that lowers the battery's 12 V to the 5 V the Raspberry Pi needs. This skill puts together three existing skills (*Measuring and protecting a 12 V circuit*, *Power the station from a 12 V battery*, *Charge a 12 V battery with a panel and a controller*) and adds what is specific to the Raspberry Pi. “All year round” decides everything: the panel and the battery are sized for the least sunny month, not for summer. A four-cell lithium iron phosphate (LFP) battery has a nominal voltage of 12.8 V, close to that of a lead-acid battery.

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - All those of the *Measuring and protecting a 12 V circuit* and *Charge a 12 V battery with a panel and a controller* skills: short circuit, arcing, fire; a panel is live as soon as it gets light.
> - Lithium battery: use only a closed, commercial 12 V battery with its built-in protection. Never open it or assemble salvaged cells yourself: that is outside the scope of this skill.
> - A controller set for lead-acid can damage an LFP battery with too high a charging voltage: set the battery type before connecting anything.
> - A badly set converter output destroys the Raspberry Pi: measure it with no load before connecting.
> - Panel on a roof or high up: risk of falling, outside the scope of this skill. The panel goes on the ground or on a low stand, firmly weighted down.

## 3. Step by step

### Step 1: Know the Raspberry Pi's consumption

- **Action:** look up your model's current. As a guide, the bare board draws in operation around 350 mA for a Zero 2 W, 500 mA for a 3B+, 600 mA for a 4B and 800 mA for a 5, at 5.1 V; anything you plug into it adds to this. Then measure your own station over a day (*Estimate your consumption and autonomy on paper* skill).
- **Check:** a consumption in watts is written down, measured and not read off a label.
- **Source:** s1 (typical currents of the bare board; 5.1 V voltage) [TO CHECK: how to measure the current, outside the scope of the multimeter skill]

### Step 2: Work out the energy for one day

- **Action:** multiply the consumption in watts by 24 hours to get watt-hours per day, then add the losses of the converter and the controller. [TO CHECK: losses to allow for]
- **Check:** a number of watt-hours per day is written down.
- **Source:** no open source (created step, to be tested); method of the *Estimate your consumption and autonomy on paper* skill

### Step 3: Choose the battery

- **Action:** choose a 12 V lithium iron phosphate battery whose energy covers several days without sun. [TO CHECK: number of days of autonomy to aim for, and share of the capacity actually usable] Check in its manual that it contains its own protection, and the temperature range in which it accepts charging. [TO CHECK: charging in freezing weather]
- **Check:** battery energy (in watt-hours) divided by the energy for one day: the number of days obtained is written down.
- **Source:** s3 (nominal voltage of 12.8 V for four cells; chargers must suit LFP); sizing: no open source (created step, to be tested)

### Step 4: Choose the panel for the darkest month

- **Action:** look up, for your location, a panel's output in the least sunny month, for example with the European Commission's public PVGIS tool. Choose a panel power whose output that month exceeds the consumption from step 2. [TO CHECK: margin to allow]
- **Check:** the estimated output of the weakest month and the consumption for the same month are written side by side.
- **Source:** no open source (created step, to be tested)

### Step 5: Choose and set the controller

- **Action:** apply the *Charge a 12 V battery with a panel and a controller* skill: a controller compatible with the panel, set to the lithium iron phosphate battery type.
- **Check:** the controller shows the LFP battery type.
- **Source:** *Charge a 12 V battery with a panel and a controller* skill; s3 (charger suited to LFP)

### Step 6: Choose the 12 V to 5 V converter

- **Action:** choose a step-down converter that accepts the battery's whole voltage range and supplies 5 V with at least the current recommended for your model: 2.5 A for a Raspberry Pi 3 or a Zero, 3 A for a 4. The Raspberry Pi 5 needs 5 A; with 3 A, it limits its USB ports to 600 mA. Get the right connector: USB-C for the Raspberry Pi 4 and 5, micro-USB for older models.
- **Check:** the converter's voltage, current and connector cover what the model needs.
- **Source:** s2 (recommended power supply by model) and s1 (connectors) [TO CHECK: input voltage range of the converter]

### Step 7: Check the converter output with no load

- **Action:** power the converter from the battery, through its fuse, **without the Raspberry Pi**, and measure its output with the multimeter (*Power the station from a 12 V battery* skill, step 4).
- **Check:** the multimeter shows about 5.1 V, correct polarity.
- **Source:** s1 (all models need 5.1 V); *Power the station from a 12 V battery* skill [TO CHECK: acceptable tolerance]

### Step 8: Wire in order, panel covered

- **Action:** wire the chain following the *Measuring and protecting a 12 V circuit* and *Charge a 12 V battery with a panel and a controller* skills: a fuse as close as possible to the battery's + terminal on each outgoing line, panel covered during wiring, connection order from the controller's manual.
- **Check:** the paper diagram of the chain shows each fuse, and each connection has been checked with the multimeter.
- **Source:** *Measuring and protecting a 12 V circuit* and *Charge a 12 V battery with a panel and a controller* skills

### Step 9: Connect the Raspberry Pi and look for voltage warnings

- **Action:** connect the Raspberry Pi to the converter and let it start. The system writes a warning in the kernel log when the supply voltage drops below 4.63 V: look for this warning after an hour of operation [TO CHECK: observation time, and exact command to read the log].
- **Check:** no under-voltage warning in the log.
- **Source:** s1 (4.63 V threshold, within 5%; absent on Zero models)

### Step 10: Protect the card against power cuts

- **Action:** once the station is installed, enable the read-only file system (`sudo raspi-config`, performance options, *Overlay File System*): files are no longer changed during operation, and a power cut is less likely to damage the card.
- **Check:** after a restart, create a file and restart again: the file has gone.
- **Source:** s4 (read-only file system) and s1 (power cuts can corrupt storage)

### Step 11: Observe for a week

- **Action:** every morning for a week, before sunrise, note the battery voltage and the state shown by the controller. Do this again in December.
- **Check:** the morning voltage does not drop from day to day.
- **Source:** no open source (created step, to be tested)

## 4. If you get stuck

- **Step 9 — under-voltage warnings.** The cable between the converter and the Raspberry Pi is often too thin or too long: shorten it, then check the current the converter can supply.
- **Step 11 — the morning voltage drops every day.** The station uses more than the panel produces: first reduce consumption (a more frugal model, Wi-Fi off at night), then enlarge the panel.
- **The station stops at night.** The battery's protection has cut it off: the battery is too small for the season, or the panel does not recharge it enough.
- **The controller offers no lithium setting.** Do not connect the LFP battery to it: change controller.
- **The battery swells, heats up or smells.** Stop everything and apply the *What to do with a dead battery or device* skill.

## 5. Resources

### What the sources say

The Raspberry Pi documentation gives the supply voltage (5.1 V), the recommended current and the typical consumption of each model, and the under-voltage warning threshold (sources s1 and s2). Wikipedia gives the nominal voltage of a four-cell LFP battery and recalls that charging must suit this chemistry (source s3).

Sizing (steps 2 to 4) and observation (step 11) rely on no open source: they are to be tested, and the whole skill awaits review by a person competent in electricity.

### Further reading

- PVGIS, the European Commission's photovoltaic output estimation tool: https://re.jrc.ec.europa.eu/pvg_tools/en/ (not opened for this skill).
- *Build your CivicNode station on a Raspberry Pi* skill.
