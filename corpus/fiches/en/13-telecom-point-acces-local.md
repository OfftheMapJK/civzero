---
titre: "Local Wi-Fi access point"
temps: "half a day"
exige_avance: "the station set up; depending on the variant, a compatible Wi-Fi card or an off-the-shelf Wi-Fi router"
---

# Local Wi-Fi access point

> **Skill on hold.** The template was tested on this skill; its content is waiting for a trial on real hardware. The architecture decision below has not been made.

## 1. Principle

A local Wi-Fi network does not need the Internet: it lets nearby phones open the station in their browser. Two architectures are possible:

- **Built-in access point:** the station broadcasts the Wi-Fi itself with its card. A single power supply, and the station controls its address and name. Requires a card that supports access point mode.
- **External router:** an off-the-shelf router, connected to the station by cable. Better range, but two devices to power and an address that depends on the router.

## 2. Safety

> **LEVEL: ORANGE (triangle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Router variant on battery: short-circuit risk, fuse required (*Measuring and protecting a 12 V circuit* skill).
> - Read the connector's polarity before any connection (*Read a label* skill).

## 3. Step by step

[TO CHECK: full step-by-step to be written after the architecture choice and the trial on real hardware]

Points already established for the router variant:

### Step 1: Read the router's voltage and polarity

- **Action:** note the input on the router's label.
- **Check:** you know the exact voltage and polarity.
- **Source:** router manual

### Step 2: Plug nothing into the Internet port

- **Action:** connect the station to a LAN port, never to the WAN or Internet port.
- **Check:** the WAN port stays empty.
- **Source:** router manual

### Step 3: Make the station easy to find

- **Action:** [TO CHECK: local name or captive portal, to be tested on Android and iPhone]
- **Check:** a phone joining the network opens the station without typing a complicated address.
- **Source:** [SOURCE NEEDED]

## 4. If you get stuck

- **The phone disconnects from the Wi-Fi on its own.** Phones leave networks without Internet. [TO CHECK: exact setting on Android and iOS]
- **The operator's box is locked.** It is not covered: use an off-the-shelf router or the built-in variant.

## 5. Resources

### Possible sources (unchecked)

- [SOURCE NEEDED: hostapd and dnsmasq documentation for the built-in variant]
- [SOURCE NEEDED: manual of the chosen router]
