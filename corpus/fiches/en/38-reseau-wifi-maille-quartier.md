---
titre: "Link a few neighbouring homes with mesh Wi-Fi using OpenWrt"
accroche: "It explains how to link a few routers together by radio, using the 802.11s standard, to share the station between several homes without an operator."
temps: "one day for two or three routers"
exige_avance: "two or three OpenWrt-compatible Wi-Fi routers, already running OpenWrt; a computer and an Ethernet cable; the agreement of the neighbours involved"
provenance:
  - id: s1
    titre: "IEEE 802.11s Wireless Mesh Networking (OpenWrt Wiki)"
    auteur: "OpenWrt wiki contributors"
    source: "https://openwrt.org/docs/guide-user/network/wifi/mesh/802-11s"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "802.11s - Introduction to Wireless Mesh Networking (OpenWrt Wiki)"
    auteur: "OpenWrt wiki contributors"
    source: "https://openwrt.org/docs/guide-user/network/wifi/mesh/80211s"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Wi-Fi Extender/Repeater with Bridged AP (OpenWrt Wiki)"
    auteur: "OpenWrt wiki contributors"
    source: "https://openwrt.org/docs/guide-user/network/wifi/wifiextenders/bridgedap"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
---

# Link a few neighbouring homes with mesh Wi-Fi using OpenWrt

A few routers talking to each other by radio are enough to link two or three neighbouring homes and share the CivicNode station between them, with no internet box or subscription in between.

## 1. Principle

A mesh network links routers to each other, not phones: it is a radio backbone. The open IEEE 802.11s standard makes all the routers of the mesh see each other as if they were plugged into the same switch. A phone or a computer cannot join the mesh itself: it connects to the ordinary Wi-Fi that each router broadcasts as well. This is not the roaming between access points that some internet boxes sell as “mesh”. OpenWrt, a free system for routers, supports 802.11s, encryption included. A simple configuration is enough for two or three routers fairly close together; beyond that, extra settings are needed that this skill does not cover.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Routers powered by their original, closed mains adapter; open neither the adapter nor the router (red moratorium).
> - No router or antenna on a roof or a mast: risk of falling and of lightning, outside the scope of this skill. Routers go indoors, near a window.
> - Link only your own devices and those of neighbours who decided it with you. No access to other people's networks.
> - Set each router to its country: the allowed power and channels depend on it. [TO CHECK: French rules for using Wi-Fi between buildings]
> - A mesh without encryption lets anyone read what passes through it: always choose a password.

## 3. Step by step

### Step 1: Check that a mesh is really what you need

- **Action:** draw on paper the homes to link, where each router goes and where the station goes. If the aim is only to cover a house that is already cabled better, a simple access point is enough (*Local Wi-Fi access point* skill).
- **Check:** the diagram shows at least two routers that cannot be linked by a cable.
- **Source:** s1

### Step 2: Prepare routers running OpenWrt

- **Action:** gather routers supported by OpenWrt and install OpenWrt on them following, for each model, its page in the project's table of hardware. This installation is not described here: it differs from one model to another.
- **Check:** each router shows the LuCI interface at the address `http://192.168.1.1` from a computer connected by cable to one of its LAN ports.
- **Source:** s3 (default address and cable access); installation: no open source read (created step, to be tested)

### Step 3: Check that the radio can mesh

- **Action:** in a terminal on the router, type `iw list | grep "Supported interface modes" -A 9`. Most OpenWrt Wi-Fi drivers can mesh; Broadcom chips and most USB Wi-Fi dongles are the exception.
- **Check:** the list shown contains the line `mesh point`.
- **Source:** s2, cross-checked with s1; access to the router's terminal (over SSH): no open source read

### Step 4: Install the version of wpad that encrypts the mesh

- **Action:** find the installed wpad package with `opkg list-installed wpad*`. If it is a “basic” version, remove it and install the matching “mesh” version, for example `wpad-mesh-mbedtls`, from LuCI (System → Software, filter `wpad`) or with opkg. Then restart the router.
- **Check:** `opkg list-installed wpad*` shows a package whose name contains `mesh`, or the full version.
- **Source:** s1

### Step 5: Create the mesh on the first router

- **Action:** in LuCI, go to Network → Wireless and click Add on one of the two bands. Choose the “802.11s” mode, give a mesh identifier (Mesh ID), choose the LAN network, then in Wireless Security choose “WPA3-SAE” and a password. Click Save, then Save & Apply.
- **Check:** the command `iw dev mesh0 info` shows `type mesh point`. [TO CHECK: the interface name may differ when it is created by LuCI]
- **Source:** s1

### Step 6: Set up the other routers the same way

- **Action:** on each other router, create the same interface: same mesh identifier, same channel, same password. Before that, give it a different fixed address on the same network (for example `192.168.1.2`, then `192.168.1.3`), outside the range handed out by the first router, and turn off its DHCP service: only one router on the network hands out addresses.
- **Check:** each router answers at its own address, and only one hands out addresses.
- **Source:** s1 (same identifier, same channel, same key); s3 (fixed address and DHCP turned off, described for an access point connected by cable) [TO CHECK: applying this rule to a router linked through the mesh]

### Step 7: Add ordinary Wi-Fi for the phones

- **Action:** on each router, keep or create in addition an ordinary Wi-Fi network (Access Point mode) attached to the same LAN network, with its own name and password: this is what the phones connect to.
- **Check:** a phone sees the network name near each router and connects to it.
- **Source:** s1 (user devices do not join the mesh); access point settings: no open source read (created step, to be tested)

### Step 8: Check that the routers see each other

- **Action:** on a router, type `iw dev mesh0 station dump`, replacing `mesh0` with the name of its mesh interface.
- **Check:** each neighbouring router appears with the mention `mesh plink: ESTAB`.
- **Source:** s1

### Step 9: Place the routers

- **Action:** put each router in its place, indoors, near a window facing the neighbouring router. Note the `signal` line of the command from step 8 and move the router until you get the best value. [TO CHECK: signal level to aim for]
- **Check:** the link stays established for an hour, routers in place.
- **Source:** no open source (created step, to be tested)

### Step 10: Connect the station and test

- **Action:** plug the CivicNode station by cable into a LAN port of one of the routers. From a phone connected to another router's Wi-Fi, open the station's address.
- **Check:** the skills show on the phone, through the mesh.
- **Source:** no open source (created step, to be tested)

## 4. If you get stuck

- **Step 3 — no `mesh point` line.** This radio cannot mesh: use this router as a simple access point, connected by cable.
- **Step 8 — no neighbour appears.** Check, in order: same mesh identifier, same channel, same password, then the wpad package from step 4 on each router.
- **The whole network freezes after adding a cable or a second band.** It is a loop: a mesh must have neither a cable link between two of its routers nor two meshes in parallel (2.4 GHz and 5 GHz), without the mesh11sd package or special rules. Remove the cable or the second mesh.
- **Links drop for no reason with more than three routers.** The simple configuration is no longer enough: the OpenWrt wiki points to the mesh11sd package, which this skill does not cover.
- **Two devices get the same address.** Two routers are handing out addresses: turn off DHCP on all but one (step 6).

## 5. Resources

### What the sources say

The OpenWrt wiki distinguishes the 802.11s mesh from roaming between access points, names the wpad package needed for encryption, describes configuration through LuCI or the `/etc/config/wireless` file, says it is enough for two or three routers close together, and warns about loops (source s1). It gives the command that checks the radio's support (source s2) and the principle of a secondary router that does not hand out addresses (source s3).

Installing OpenWrt (step 2), the access point for phones (step 7), placement (step 9) and connecting the station (step 10) rely on no open source read: they are to be tested.

### Further reading

- OpenWrt's table of supported hardware: https://openwrt.org/toh/start (not opened for this skill).
- mesh11sd package, for a mesh of more than three routers: described on the OpenWrt wiki.
- *Local Wi-Fi access point* skill.
