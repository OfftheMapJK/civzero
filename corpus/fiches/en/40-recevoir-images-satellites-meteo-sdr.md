---
titre: "Receive weather satellite images with an SDR dongle"
accroche: "It explains how to capture, with a USB radio dongle and a two-element antenna, the images that the Meteor-M satellites broadcast freely as they pass overhead."
temps: "half a day of preparation, then a quarter of an hour per pass"
exige_avance: "a USB SDR dongle (RTL-SDR type), a dipole antenna with two adjustable elements and its cable, a computer with the SatDump software, pass times written down while you have Internet"
provenance:
  - id: s1
    titre: "Low-rate picture transmission"
    auteur: "Wikipedia contributors"
    source: "https://en.wikipedia.org/wiki/Low-rate_picture_transmission"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s2
    titre: "Meteor-M No.2-3"
    auteur: "Wikipedia contributors"
    source: "https://en.wikipedia.org/wiki/Meteor-M_No.2-3"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s3
    titre: "Meteor-M No.2-4"
    auteur: "Wikipedia contributors"
    source: "https://en.wikipedia.org/wiki/Meteor-M_No.2-4"
    licence: "CC BY-SA 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s4
    titre: "Basic usage (SatDump)"
    auteur: "zbychu (SatDump), post of 22/09/2022"
    source: "https://satdump.org/posts/basic-usage"
    licence: "CC BY 4.0"
    usage: adapte
    modifie: true
    verifie_le: 2026-11-12
  - id: s5
    titre: "Satellite list (SatDump)"
    auteur: "SatDump, list kept by Meti"
    source: "https://www.satdump.org/Satellite-List/"
    licence: "not stated on the page"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
  - id: s6
    titre: "SatDump (GitHub repository, README)"
    auteur: "SatDump"
    source: "https://github.com/SatDump/SatDump"
    licence: "GPL-3.0"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
  - id: s7
    titre: "Satellite: Meteor-M N2-3 (OSCAR)"
    auteur: "World Meteorological Organization"
    source: "https://space.oscar.wmo.int/satellites/view/meteor_m_n2_3"
    licence: "all rights reserved (© WMO)"
    usage: reference
    modifie: false
    verifie_le: 2026-11-12
---

# Receive weather satellite images with an SDR dongle

Several times a day, a weather satellite passes over your home and broadcasts, unencrypted, the image of what it is flying over. A USB radio dongle and a simple antenna are enough to receive it, without Internet.

## 1. Principle

The Russian Meteor-M satellites orbit the Earth passing close to the poles and continuously broadcast their images through a digital signal called LRPT, in the 137 MHz band. Most of these broadcasts are free and unencrypted: anyone can receive them. An SDR (software-defined radio) dongle turns the signal into data; the free SatDump software decodes it and rebuilds the image: three channels, at a resolution of one kilometre per pixel. The last American NOAA satellite broadcasting the old analogue signal (APT), NOAA-19, was decommissioned in 2025: many tutorials still describe it. You can only receive during a pass, a few minutes long, so you need to know its time in advance.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill:
> - Reception only: the SDR dongle transmits nothing. You listen to a public broadcast; you do not listen to other people's private communications. [TO CHECK: French legal framework for reception]
> - Antenna on the ground, on a balcony or held by hand. No antenna on a roof or a mast: risk of falling, outside the scope of this skill.
> - Never put an antenna outside in a thunderstorm, or near a power line.
> - An image received shows the clouds of the moment: it is not a forecast, and it does not replace an official alert.

## 3. Step by step

Frequencies, settings and menu names change with the satellites and software versions. [TO CHECK: each setting on a real pass]

### Step 1: Gather the equipment

- **Action:** take an RTL-SDR type USB SDR dongle, a two-element dipole antenna and its cable, and a computer. Check in the dongle's manual that it covers the 137 MHz band.
- **Check:** the computer recognises the dongle when you plug it in.
- **Source:** s2 (an SDR receiver and a simple dipole are enough); choosing the dongle: no open source (created step, to be tested)

### Step 2: Install SatDump

- **Action:** while you have Internet, install SatDump from the project's releases page (Windows, macOS), or build it on Linux following the repository's README file. Plug in the dongle, open SatDump, and check that it appears in the list of sources.
- **Check:** the dongle is offered as a source in SatDump.
- **Source:** no open source (created step, to be tested; the procedure is in s6, as a reference)

### Step 3: Set up the V antenna

- **Action:** set the two elements to the same length, close to a quarter of the wavelength, and open them into a V. Lay the antenna flat, horizontal, outdoors, with as clear a sky as possible, away from screens and chargers. [TO CHECK: element length, angle and orientation; common values, with no open source: about 53 cm per element, 120° angle, north–south axis]
- **Check:** the two elements have the same length with the tape measure and the antenna is horizontal.
- **Source:** no open source (created step, to be tested)

### Step 4: Write down the passes in advance

- **Action:** while you have Internet, use a pass prediction tool to note the times when Meteor-M N2-3 and N2-4 pass high in the sky over your location for the coming days. Without updates, these predictions get worse over the weeks. [TO CHECK: recommended tool, and how long offline predictions stay valid]
- **Check:** a list of passes (date, start and end time, maximum elevation) is written down.
- **Source:** no open source (created step, to be tested)

### Step 5: Set up reception

- **Action:** a few minutes before the pass, open SatDump's Recorder tab. In the source settings, choose the dongle, then set the frequency, the sample rate and the gain. Set the frequency to 137.9 MHz; these satellites broadcast on 137.9 or 137.1 MHz, and the frequency in use can change. Start the source.
- **Check:** the spectrum comes alive on screen.
- **Source:** s4 (Recorder tab, source settings: frequency, sample rate, gain) and s3 (LRPT on 137.9 MHz); “start the source”: no open source read; 137.1 MHz: s5, as a reference [TO CHECK: sample rate and gain; the SatDump 2 interface differs from the one described by s4]

### Step 6: Start decoding

- **Action:** in the Processing part of the Recorder tab, choose the processing chain (“pipeline”) for the Meteor-M satellites in LRPT and set its options, then click Start before the pass begins. The folder where the images are saved is set in Settings. [TO CHECK: exact name of the chain; the rate in use is 72,000 symbols per second according to s5, as a reference; s1 gives 80 kBaud for LRPT in general]
- **Check:** decoding is shown as in progress.
- **Source:** s4 (Processing part, choosing the chain, Start button; output folder in Settings)

### Step 7: Follow the pass

- **Action:** during the pass, keep the antenna still and watch the screen: the signal appears as a wide bump in the spectrum, rises, then falls back. If the display slows the computer down, lighten the spectrum and waterfall display.
- **Check:** a clear bump stands out from the noise at the set frequency for several minutes.
- **Source:** s4 (the spectrum display, especially the waterfall, is demanding); what the signal looks like and adjusting the display: no open source (created step, to be tested)

### Step 8: Stop and open the image

- **Action:** at the end of the pass, stop decoding, then the source. Open the output folder: it contains the images of the channels received and colour composites.
- **Check:** at least one image shows recognisable clouds, coastlines or relief.
- **Source:** s4 (output folder set in Settings) and s1 (three channels at 1 km per pixel); the stopping order: no open source (created step, to be tested)

### Step 9: Read the image and date it

- **Action:** find your region on the image, then the cloud masses and their position. Write on the image the date, the time and the satellite. From one pass to the next, compare: what is approaching, what is moving away.
- **Check:** the image is filed with its date and time.
- **Source:** no open source (created step, to be tested)

## 4. If you get stuck

- **Step 5 — the dongle does not appear.** Refresh the list of sources (arrow next to the list), then plug the dongle back in.
- **Step 7 — no signal.** Check the pass time and the frequency (137.9 or 137.1 MHz), then raise the gain. A pass low on the horizon rarely gives an image.
- **Step 7 — weak signal with Meteor-M N2-3.** This satellite's antenna did not fully deploy: its signal is weaker. Try an N2-4 pass.
- **Step 8 — image in stripes or big squares.** Reception dropped out at times: move the antenna away from electrical devices, clear the sky, wait for a higher pass.
- **A tutorial talks about NOAA and APT.** It is out of date: NOAA-19, the last satellite broadcasting APT, was switched off in 2025.

## 5. Resources

### What the sources say

Wikipedia describes LRPT: a digital image broadcast in the 137 MHz band, with three channels and 1 km per pixel, which replaces the old analogue APT signal; the article says that NOAA-19, the last satellite carrying APT, was decommissioned on 13 August 2025, and that the antenna of Meteor-M N2-3 did not fully deploy (source s1). The articles on the satellites state that their broadcasts are free and can be received with an SDR receiver and a dipole (source s2), and that Meteor-M N2-4 broadcasts LRPT on 137.9 MHz (source s3). The SatDump post describes the Recorder tab and the Processing menu (source s4).

The satellite list kept by SatDump (source s5, as a reference) gives the two frequencies and the rate in use, and the dates NOAA 15, 18 and 19 were switched off; only NOAA-19's switch-off is in an adapted source (s1). Choosing the dongle, the antenna, predicting passes and reading the image rely on no open source: the skill is to be tested and reproduced.

### Further reading

- List of satellites and their signals, kept by SatDump (source s5): check it before each campaign, frequencies change.
- SatDump repository (source s6): installation and command line.
- Meteor-M N2-3 entry in the World Meteorological Organization's OSCAR database (source s7).
- *Listen to the radio to stay informed* skill.
