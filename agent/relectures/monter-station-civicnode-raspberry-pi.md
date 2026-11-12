# Relecture de fidélité : monter-station-civicnode-raspberry-pi

Relecture IA du 2026-11-12 (claude-sonnet-5-5) : **conforme**.

## Points à vérifier

- [ ] Étape 7 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester) » : notée, ne compte pas comme un ajout et ne change pas le verdict. Rien dans s1 à s4 n'est cité pour elle ; je n'ai pas cherché Kiwix dans les copies.
- [ ] Étape 8 : sans_source, Étape déclarée « aucune source ouverte (étape créée, à tester ; les options viennent de s5, en référence) » : notée comme déclarée. s5 est en référence, sans copie : elle ne fonde aucune étape ici.
- [ ] Niveaux : Niveau vert, sans variante. Les quatre risques de la section Sécurité sont dans les sources : surface métallique et court-circuit (s1, à propos du boîtier), mauvais support effacé (s1, « Exclude system drives » et avertissement d'effacement), coupure de courant et corruption (s3 : « power dropouts can cause storage corruption » ; s1 : arrêt sûr). Le moratoire rouge sur l'ouverture du bloc secteur vient de la fiche, pas des sources.

## Étapes jugées conformes (en vérifier trois au hasard)

- [ ] Étape 1 (s1) : « Raspberry Pi 4 Model B and Raspberry Pi 400 | 5 V at 3 A ; Raspberry Pi 5 and Raspberry Pi 500 | 5 V at 5 A ; Raspberry Pi 3 (all models) | 5 V at 2.5 A ; Raspberry Pi Zero (all models) | 5 V at 2.5 A. For Raspberry Pi OS Lite ... at least 8 GB of storage. »
- [ ] Étape 2 (s1) : « Download and install Raspberry Pi Imager on to your computer (Windows, Mac, or Linux). On Windows and Mac, download the latest version from the Raspberry Pi website and run the installer. Launch the Raspberry Pi Imager application. »
- [ ] Étape 3 (s1) : « Tell Raspberry Pi Imager what combination of hardware and OS you want to use (Device tab, OS tab). ... we recommend choosing Raspberry Pi OS Lite as your operating system in Raspberry Pi Imager. In the Storage tab, select your storage device ... We strongly recommend that you keep Exclude system drives selected. ... You can often identify the correct storage device by size. »
- [ ] Étape 4 (s1) : « Hostname: enter a name ... that includes only letters, numbers, and hyphens. Localisation: choose your capital city. Imager autocompletes the time zone and keyboard layout ... also sets the Wi-Fi regulatory domain. User: The username must be lowercase and contain only letters, numbers, underscores, and hyphens. Wi-Fi: enter the SSID ... enter and confirm the password for the network. Remote Access: turn on Enable SSH ... Use password authentication. »
- [ ] Étape 5 (s1) : « Select Write ... I understand, erase and write ... When you've configured your microSD card ... insert it into the microSD slot with the label facing away from the Raspberry Pi. ... Connecting your Raspberry Pi to power is the last step ... plug your power supply into the port ... labelled either POWER IN, PWR IN, or PWR. Your Raspberry Pi turns on as soon as you connect it to power. ... indicated by the power or status LED lighting up. »
- [ ] Étape 6 (s2 et s1) : « s2 : ssh <username>@<ip address> ... When the connection works, you will see a security warning. Type yes to continue. You will only see this warning the first time you connect. Enter your account password when prompted. You now see the Raspberry Pi command prompt: <username>@<hostname> ~ $. s1 : other devices on that network can communicate with your Raspberry Pi using <hostname>.local. »
- [ ] Étape 9 (s2) : « To copy a folder and all of its contents, pass the folder name with the -r (recursive) flag: $ scp -r project/ <username>@<pi_ip_address>: »
- [ ] Étape 10 (s1) : « Reboot your Raspberry Pi | sudo reboot (Shutdown options from the command line) »
- [ ] Étape 11 (s1) : « Your Raspberry Pi broadcasts this hostname to the network using mDNS. ... other devices on that network can communicate with your Raspberry Pi using <hostname>.local or <hostname>.lan. »
- [ ] Étape 12 (s1) : « Shut down your Raspberry Pi | sudo poweroff. Raspberry Pi OS provides options for safely shutting down ... »

Puis suivre la liste de la seconde partie de agent/RELECTURE.md.
