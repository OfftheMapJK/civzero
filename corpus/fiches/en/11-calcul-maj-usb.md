---
titre: "Update the station with a USB stick"
temps: "an hour"
exige_avance: "a USB stick, Internet access elsewhere to download the new version"
---

# Update the station with a USB stick

The collection is not frozen: when the station has no Internet, a USB stick brings it the new version and leaves with the testers' reports.

## 1. Principle

Download the new version where there is a network, check with a checksum that it was not damaged while copying, then replace the old one on the station while keeping a backup.

## 2. Safety

> **LEVEL: GREEN (circle)** — [Official label shown from Nodule Zero]
>
> Risks specific to this skill: only use the version published by the official repository, and always check the checksum.

## 3. Step by step

### Step 1: Download the version and its checksum

- **Action:** on a connected computer, download the collection archive and the checksum file published with it. [TO CHECK: location of the official repository]
- **Check:** you have both files.
- **Source:** [SOURCE NEEDED]

### Step 2: Check the checksum

- **Action:** on Linux, `sha256sum -c` followed by the name of the checksum file.
- **Check:** the command answers “OK” for the archive.
- **Source:** [SOURCE NEEDED]

### Step 3: Copy to the stick

- **Action:** copy the archive and the checksum file to the stick, then eject the stick properly.
- **Check:** both files are on the stick.
- **Source:** not applicable

### Step 4: Check again on the station

- **Action:** plug the stick into the station and repeat the check from step 2.
- **Check:** “OK” on the station too.
- **Source:** not applicable

### Step 5: Replace while keeping a backup

- **Action:** rename the old collection folder (for example by adding its date), then unpack the new version in its place.
- **Check:** the home page shows the new sync date, and the old folder still exists.
- **Source:** not applicable

### Step 6: Leave with the reports

- **Action:** copy the station's folder of reproduction reports to the stick, to send them back to the repository.
- **Check:** the reports are on the stick.
- **Source:** not applicable

## 4. If you get stuck

- **Step 2 or 4 — the checksum does not match.** The copy is damaged: copy the file again. Never install it as it is.
- **Step 5 — the new version does not display correctly.** Put the old folder back in its place.
- **Step 4 — the station does not see the stick.** Try another port, or format the stick as exFAT, read by Linux, Windows, macOS and most Android phones. Avoid FAT32: it refuses files over 4 GB, such as the Wikipedia one.

## 5. Resources

### Possible sources (unchecked)

- Wikipedia: “SHA-2”, “Checksum”
- [SOURCE NEEDED: official download page of the CivicNode collection]
