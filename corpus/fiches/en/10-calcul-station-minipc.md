---
titre: "Build your station on a salvaged mini-PC"
temps: "a day"
exige_avance: "a salvaged mini-PC or laptop, an installation USB stick, Internet access during installation"
---

# Build your station on a salvaged mini-PC

Turn a small second-hand computer into an offline library: the CivicNode skills and Wikipedia, readable from a browser. The assistant is not covered here.

## 1. Principle

The station is an ordinary computer running two services: an offline content reader (Kiwix) for Wikipedia, and a small web server for the CivicNode skills, which are plain HTML pages. Everything is installed while you have the Internet; afterwards, nothing depends on it.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Power through the original, closed mains adapter: do not open it (red moratorium).
> - Do not open the machine while it is plugged in.

## 3. Step by step

The commands given are indicative. [TO CHECK: exact commands on a real machine]

### Step 1: Check the machine

- **Action:** switch it on with its original adapter, enter the boot menu, note the memory and storage. [TO CHECK: reference minimum configuration, for example 8 GB of memory and 256 GB of storage]
- **Check:** the machine starts and you have noted its configuration.
- **Source:** [SOURCE NEEDED]

### Step 2: Install a stable Linux system

- **Action:** prepare a Debian installation stick and install it on the machine.
- **Check:** the machine starts on Debian without the stick.
- **Source:** Debian installation documentation (see sources)

### Step 3: Install Kiwix and download Wikipedia

- **Action:** install the Kiwix tools package (`sudo apt install kiwix-tools`), then download a Wikipedia `.zim` file in your language. Choose a `nopic` version (for example `wikipedia_en_all_nopic`), without images, which is much lighter; its size is shown in the Kiwix library.
- **Check:** the `.zim` file is there and its size matches the announced size.
- **Source:** Kiwix library (see sources)

### Step 4: Serve Wikipedia locally

- **Action:** start the Kiwix server, for example `kiwix-serve --port=8080 /path/to/wikipedia.zim`.
- **Check:** from the station, `http://localhost:8080` shows the Kiwix home page.
- **Source:** Kiwix documentation

### Step 5: Copy and serve the CivicNode skills

- **Action:** copy the skills folder (HTML site) to the station and serve it with a light web server such as `darkhttpd`, a single program available as a Debian package: for example `darkhttpd /path/to/site --port 8000`. [TO CHECK: exact command on the real machine]
- **Check:** the CivicNode home page appears in the station's browser.
- **Source:** [SOURCE NEEDED]

### Step 6: Automatic start

- **Action:** set up both services to start with the machine. [TO CHECK: systemd service files]
- **Check:** after a restart, both addresses respond without intervention.
- **Source:** [SOURCE NEEDED]

### Step 7: Test from another device

- **Action:** connect a phone or a computer to the same local network and open the station's address.
- **Check:** the skills and Wikipedia appear on the other device.
- **Source:** *Local Wi-Fi access point* skill

### Step 8: Note the sync date

- **Action:** enter the date of the collection version so that it appears in the status bar.
- **Check:** the date appears on the home page.
- **Source:** not applicable

## 4. If you get stuck

- **Step 1 — the machine does not start.** Check the adapter with the *Read a label* skill. A machine that does not start is outside the scope of this skill.
- **Step 3 — there is not enough storage.** Take the version of Wikipedia without images, or a themed selection.
- **Step 7 — the other device cannot find the station.** Check that they are on the same network; the access point question is covered in its own skill.

## 5. Resources

### Possible sources (unchecked)

- Debian, installation guide: https://www.debian.org/releases/stable/installmanual
- Kiwix, content library: https://library.kiwix.org
- Kiwix, server tools: https://kiwix.org
