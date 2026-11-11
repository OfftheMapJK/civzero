---
titre: "Link several LoRa stations into a network"
temps: "several weeks: sites, settings, trials"
exige_avance: "at least three configured modules (previous skill), a high location, power for the fixed node"
provenance:
  - id: s1
    titre: "Meshtastic — LoRa configuration"
    url: https://meshtastic.org/docs/configuration/radio/lora
  - id: s2
    titre: "Meshtastic — Choosing the right device role"
    url: https://meshtastic.org/blog/choosing-the-right-device-role/
---

# Link several LoRa stations into a network

Go from two modules to a neighbourhood network: messages hop from one module to the next until they reach their recipient. It is the rebuilding tool of wave 3.

## 1. Principle

In a mesh network, each module relays the messages it receives, within a hop limit. A fixed module placed high up covers a wide area and links the others. The group shares a private channel, protected by a common key.

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Outdoor node variant: working at height, risk of falling. No roof or ladder without safety measures. [TO CHECK: acceptable conditions]
> - Powering the fixed node: see the wave 3 skills.
> - Location: only at home or with the explicit agreement of the owner of the place.

## 3. Step by step

### Step 1: Plan on the map

- **Action:** mark on the neighbourhood map the homes of the group and the possible high points.
- **Check:** a central high point is identified, with the agreement of the place.
- **Source:** *Offline map of your region* skill

### Step 2: Create the group's channel

- **Action:** create a private channel with a name and a key, then share it offline, for example with the app's QR code.
- **Check:** all the group's modules show the same channel.
- **Source:** [SOURCE NEEDED: Meshtastic documentation on channels]

### Step 3: Install the fixed node

- **Action:** place a module at the high point, aerial in the clear, with continuous power. Role: `CLIENT_BASE` for a roof or attic node, `CLIENT` when in doubt. `ROUTER` only on a truly strategic site, such as a hilltop. Do not use `CLIENT_MUTE`, which relays nothing. [TO CHECK: roles available in the installed version]
- **Check:** the fixed node appears in every member's node list.
- **Source:** s2

### Step 4: Keep the default hop limit

- **Action:** leave the hop limit at 3, the default value, unless a need is proven. Raising it clogs the network.
- **Check:** the limit is 3 on all modules.
- **Source:** s1 (default 3, maximum 7)

### Step 5: Power the fixed node

- **Action:** plan a reliable power supply: mains with a backup battery, or a small solar installation. [TO CHECK: sizing]
- **Check:** the node stays on for a whole night without mains power.
- **Source:** *Charge a 12 V battery with a panel* skill

### Step 6: Test the coverage

- **Action:** from several points in the neighbourhood, send a test message and note on the map where it gets through.
- **Check:** the coverage map is drawn.
- **Source:** not applicable

### Step 7: Add it to the communication plan

- **Action:** add the channel and listening times to the group's communication plan.
- **Check:** the paper plan mentions the LoRa channel.
- **Source:** *Communication plan for family and neighbours* skill

## 4. If you get stuck

- **Step 2 — a module does not see the channel.** Check the key and the radio preset, identical everywhere.
- **Step 6 — an area is not covered.** Add a relay node between that area and the fixed node.
- **Messages arrive late or not at all.** Too much traffic or transmission limit reached: shorter, less frequent messages.

## 5. Resources

### What this skill is about

This network uses no one else's infrastructure: it belongs to those who build it. It is the first brick of a local community that connects itself.

### Possible sources (unchecked)

- s1 above, read for the hop limit; s2, read for the roles
- [SOURCE NEEDED: Meshtastic documentation on channels]
