---
titre: "Send text messages over LoRa radio"
temps: "a day"
exige_avance: "two Meshtastic-compatible LoRa modules, 868 MHz aerials, two phones, Internet for setup"
provenance:
  - id: s1
    titre: "Meshtastic — LoRa configuration"
    url: https://meshtastic.org/docs/configuration/radio/lora
  - id: s2
    titre: "Meshtastic — Initial configuration"
    url: https://meshtastic.org/docs/getting-started/initial-config/
---

# Send text messages over LoRa radio

Exchange short messages over several kilometres, without an operator or the Internet, with low-power radio modules. The network belongs to those who use it.

## 1. Principle

LoRa is a long-range, low-data-rate radio technique. The free software Meshtastic turns a small LoRa module into a messaging system: you type on your phone, linked to the module by Bluetooth, and the module transmits by radio to the other modules. In Europe, the band used (EU_868) is free to use under conditions, in particular a limit on transmission time.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Never power a module without its aerial: transmitting without an aerial can destroy its transmitter stage. [TO CHECK: depending on the module]
> - Follow the regulations: EU_868 region required, limited transmission time. [TO CHECK: current French regulatory conditions]

## 3. Step by step

### Step 1: Choose two modules and their aerials

- **Action:** take two modules from the list of Meshtastic-compatible devices, with aerials designed for 868 MHz.
- **Check:** both modules and their aerials are marked 868 MHz.
- **Source:** [SOURCE NEEDED: official list of compatible devices]

### Step 2: Screw on the aerial before any power-up

- **Action:** fit the aerial on each module before plugging it in or switching it on.
- **Check:** both aerials are screwed on.
- **Source:** [TO CHECK: the module manufacturer's instructions]

### Step 3: Install the Meshtastic software

- **Action:** with the Internet, install the software on each module with the official installation tool, then the Meshtastic app on each phone.
- **Check:** the app sees the module over Bluetooth.
- **Source:** s2

### Step 4: Set the EU_868 region

- **Action:** in the app, set the region to EU_868. Until the region is set, the module does not transmit.
- **Check:** the region shown is EU_868 on both modules.
- **Source:** s1, s2

### Step 5: Set the same radio mode on both modules

- **Action:** check that both modules use the same radio preset: modules set differently do not understand each other.
- **Check:** same preset on both modules.
- **Source:** s2

### Step 6: Send a first message at close range

- **Action:** with both modules in the same room, send a message from one to the other.
- **Check:** the message arrives and the acknowledgement appears.
- **Source:** not applicable

### Step 7: Move further apart step by step

- **Action:** repeat while moving one module away, and note the distances reached on the map.
- **Check:** you know the real range in your surroundings.
- **Source:** not applicable

## 4. If you get stuck

- **Step 4 — the module sends nothing.** The region is not set: this is the most common case.
- **Step 6 — messages do not arrive.** Check the radio preset and the channel on both modules.
- **Step 7 — the range is very short.** Go higher, clear the aerial of obstacles, keep it away from your body.
- **Messages go out late.** The transmission time limit (10% over a rolling hour in EU_868) has been reached: write shorter, less frequent messages.

## 5. Resources

### What the documentation says

In EU_868, the range is 869.4 to 869.65 MHz, with a limit of 10% transmission time calculated over a rolling hour. A module that reaches the limit stops transmitting until it is allowed to again (source s1).

### Possible sources (unchecked)

- s1, s2 above, read for the region and the transmission limit
- [SOURCE NEEDED: French regulations on short-range devices]
