---
titre: "Build your CivicNode station on a Raspberry Pi"
accroche: "It explains how to install the system on a Raspberry Pi with no screen or keyboard, then serve the CivicNode skills and Wikipedia offline from it."
temps: "half a day, plus the Wikipedia download"
exige_avance: "a Raspberry Pi with Wi-Fi or Ethernet, its official power supply, a microSD card, a computer with a card reader, Internet access during installation"
provenance:
  - id: s1
    titre: "Getting started (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/getting-started.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Remote access (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/remote-access.html"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Raspberry Pi hardware, Power supply (Raspberry Pi Documentation)"
    auteur: "Raspberry Pi Ltd"
    source: "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html"
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
  - id: s5
    titre: "kiwix-serve (kiwix-tools documentation)"
    auteur: "kiwix-team"
    source: "https://kiwix-tools.readthedocs.io/en/latest/kiwix-serve.html"
    licence: "not stated (© 2024 kiwix-team)"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
---

# Build your CivicNode station on a Raspberry Pi

A Raspberry Pi uses little power, fits in your hand and is enough to serve the CivicNode skills and Wikipedia to a whole household. This skill adapts *Build your CivicNode station on a salvaged mini-PC* to this hardware. The assistant is not covered here.

## 1. Principle

The station runs “headless”: no screen and no keyboard; you control it from another computer over the network. You first prepare the microSD card on your computer with the Raspberry Pi Imager tool, which installs the system and sets in advance the machine's name, the account, the Wi-Fi and remote access. Then you install two services: Kiwix for Wikipedia, and a small web server for the skills, which are plain HTML pages. Everything is done while you have Internet; after that, nothing depends on it.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Power through the official, closed mains adapter: do not open it (red moratorium).
> - A bare Raspberry Pi set on a metal surface can short-circuit: put it in a case or on an insulating stand.
> - When writing the card, check the chosen storage device twice: a mistake erases another disk of the computer.
> - Cutting the power without shutting the system down can corrupt the card: always switch off with the shutdown command.

## 3. Step by step

The commands in steps 7 to 10 are indicative. [TO CHECK: exact commands on a real machine]

### Step 1: Gather the power supply and the card

- **Action:** take the official power supply intended for your model: 5 V and 3 A for a Raspberry Pi 4, 5 V and 5 A for a Raspberry Pi 5, 5 V and 2.5 A for a Raspberry Pi 3 or a Zero. Take a microSD card of at least 8 GB for the system alone; Wikipedia needs much more.
- **Check:** the power supply's label shows the voltage and current required by the model (*Read a label* skill).
- **Source:** s1 [TO CHECK: card capacity needed for French Wikipedia, no source read]

### Step 2: Install Raspberry Pi Imager on your computer

- **Action:** download Raspberry Pi Imager from the Raspberry Pi website and install it (Windows, Mac or Linux), then launch it.
- **Check:** the Raspberry Pi Imager window opens.
- **Source:** s1

### Step 3: Choose the model, the system and the card

- **Action:** in Imager, choose your Raspberry Pi model, then the Raspberry Pi OS Lite system (no desktop, recommended for a machine with no screen). Insert the microSD card into the computer and choose it as the storage device. Leave ticked the option that excludes system drives.
- **Check:** the storage device shown has the size of the microSD card, not that of the computer's disk.
- **Source:** s1

### Step 4: Set up the machine before writing

- **Action:** in the customisation tab, give the machine a name (for example `civicnode`, letters, digits and hyphens only), choose your capital city (it sets the time zone, the keyboard and the Wi-Fi country), create a lower-case username and a password, enter the name and password of the home Wi-Fi network, then enable SSH with password authentication.
- **Check:** the machine name, the account and the password are written down on paper.
- **Source:** s1

### Step 5: Write the card and start up

- **Action:** start writing and wait for it to finish. Slide the card into the Raspberry Pi's slot, label facing away from the board. Plug in the power last, on the port marked POWER IN or PWR: the Raspberry Pi starts as soon as it is powered.
- **Check:** the power or status light comes on.
- **Source:** s1 [TO CHECK: label of the write button, not read in the source]

### Step 6: Connect from your computer

- **Action:** on the computer, connected to the same network, open a terminal and type `ssh <username>@civicnode.local`, replacing it with your username. On the first connection, answer `yes` to the security warning, then enter the password.
- **Check:** the prompt `<username>@civicnode` appears: commands now run on the Raspberry Pi.
- **Source:** s2 (`ssh` command) and s1 (`<hostname>.local` name)

### Step 7: Install Kiwix and download Wikipedia

- **Action:** install the Kiwix tools (`sudo apt update`, then `sudo apt install kiwix-tools`). Create a `zim` folder and download into it a French Wikipedia `.zim` file from the Kiwix library; the version without images is much lighter.
- **Check:** the `.zim` file is in the folder and its size matches the one announced by the library.
- **Source:** no open source (created step, to be tested)

### Step 8: Serve Wikipedia

- **Action:** run `kiwix-serve --port=8080 zim`: given a folder, the server serves all the `.zim` files it contains.
- **Check:** on the computer, the address `http://civicnode.local:8080` shows the Kiwix home page.
- **Source:** no open source (created step, to be tested; the options come from s5, as a reference)

### Step 9: Copy and serve the CivicNode skills

- **Action:** from the computer, copy the site folder to the Raspberry Pi with `scp -r dist/ <username>@civicnode.local:`. On the Raspberry Pi, install a light web server (`sudo apt install darkhttpd`) and run it on this folder: `darkhttpd dist --port 8000`.
- **Check:** the address `http://civicnode.local:8000` shows the CivicNode home page.
- **Source:** s2 (copying a folder with `scp -r`); the web server: no open source (created step, to be tested)

### Step 10: Start both services at boot

- **Action:** create a systemd service for each of the two commands, so that they start with the machine. [TO CHECK: service files to write and test]
- **Check:** after `sudo reboot`, both addresses answer without any command.
- **Source:** s1 (`sudo reboot` command); the services: no open source (created step, to be tested)

### Step 11: Test from a phone

- **Action:** connect a phone to the same network and open both addresses in its browser.
- **Check:** the skills and Wikipedia show on the phone.
- **Source:** s1 (the `<hostname>.local` name is announced on the network) [TO CHECK: some phones do not resolve `.local` names; have the IP address ready]

### Step 12: Shut down properly, write down the date

- **Action:** before unplugging, always type `sudo poweroff` and wait for it to switch off. Write down on the station the date of the corpus version and of Wikipedia.
- **Check:** the activity light no longer blinks when you unplug.
- **Source:** s1 [TO CHECK: behaviour of the lights at shutdown depending on the model]

## 4. If you get stuck

- **Step 5 — nothing lights up.** Check the power supply with the *Read a label* skill and the port used: on a Raspberry Pi Zero, only one of the two micro-USB ports is for power.
- **Step 6 — `civicnode.local` cannot be found.** Wait a few minutes on the first start, check that the computer is on the same network, then look for the Raspberry Pi's IP address in the list of devices on the internet box and use it instead of the name.
- **Step 6 — the connection times out.** The address is probably wrong, or the Wi-Fi entered in step 4 is incorrect: rewrite the card, checking the network name and password.
- **Step 7 — the card is too small.** Take the version of Wikipedia without images or a thematic selection, or a bigger card.
- **The station restarts by itself or the card gets corrupted.** Too low a voltage is often the cause: change the power supply and the cable. If the station has to go through power cuts, enable the read-only file system (`sudo raspi-config`, performance options, *Overlay File System*) once installation is finished.

## 5. Resources

### What the sources say

The Raspberry Pi documentation recommends Raspberry Pi Imager and the Raspberry Pi OS Lite system for a machine with no screen, and gives the recommended power supply for each model (source s1). It describes connecting over SSH and copying folders (source s2), warns that a poor-quality power supply can corrupt storage (source s3) and describes the read-only file system (source s4).

Steps 7 to 10 (Kiwix, web server, automatic start) rely on no open source: they take up the mini-PC skill and remain to be tested on a real machine.

### Further reading

- *Local Wi-Fi access point* skill, so the station creates its own network.
- *Power a Raspberry Pi with solar all year round* skill.
- kiwix-serve documentation (source s5) and the Kiwix library: https://library.kiwix.org
