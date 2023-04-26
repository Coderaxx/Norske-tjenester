# Norske tjenester

Tilbyr forskjellige Norske tjenester som Posten, renovasjon etc.

## INFO
#### Posten
Enheten viser neste levering av post på ditt postnummer. En nedtelling i dager kan settes som status på enheten.

#### Renovasjon
Enheten henter data om hvilke typer avfall som hentes på din adresse og når. Enheten lager sensorer som tilsvarer typen avfall, og viser dato. En nedtelling i dager og type avfall som hentes neste gang, kan settes som status på enheten.

## ROADMAP
*Per nå jobber jeg med dette:*

**Planlagt:**
- 🔴 HeltHjem pakkesporing
- 🔴 PostNord pakkesporing
- 🔴 Posten pakkesporing
- Kjøretøyopplysninger fra Vegvesenet
  - 🔴 Informasjon om neste EU
- 🔴 Norske flaggdager  

**I produksjon:**  

**Posten**  

- 🟠 Lage flows for Posten

**Renovasjon**  

- 🟢 Støtte for BIR
- 🟢 Støtte for ReMidt
- 🟢 Støtte for Glør
- 🟢 Støtte for Innherred Renovasjon
- 🟢 Støtte for Stavanger kommune
- 🟠 Støtte for Oslo kommune
- 🟠 Støtte for Avfall Sør
- 🟠 Lage flows for renovasjon

**Implementert:**
- 🟢 Posten
- 🟢 Renovasjon
  - 🟢 Støtte for Min Renovasjon

#### *VIKTIG INFO OM RENOVASJON*
*Per nå er ikke alle kommuner støttet. en komplett liste med støttede kommuner kommer snart.*
##### *STØTTEDE KOMMUNER*
- *Alle kommuner i Min Renovasjon*
- *Sola kommune*
- *Drammen kommune*
- *Sandefjord kommune*

*Mange flere kommuner er støttet, men kun disse er testet.*

##### *IKKE ENDA STØTTET*
- *ReMidt kommuner*
- *Glør kommuner*
- *BIR kommunner*
- *Stavanger kommune*
- *Bergen kommune*

**Gi gjerne tilbakemelding om kommuner du har testet, som enten funker, eller ikke.
Det kan du gjøre ved å åpne en issue her på GitHub. Trykk [her](https://github.com/Coderaxx/NorwegianServicesPublic/issues) for å åpne en issue.**


## Changelog:
### 1.0.0 - Initial release
```
1.0.1 - Fixed name
1.0.2 - Fixed wrong icon for app
1.0.3 - Fixed internationalization
1.0.4 - Fixed settings category
1.0.5 - Fixed wrong icon showing while pairing Posten
1.0.6 - Fixed polling
1.1.0 - Added garbage removal device
1.1.3 - Added renovation device
1.1.4 - Removed flow for Posten, because it is no longer used.
1.1.5 - Fixed app creashing when API response status doesn't return 200
1.1.6 - Changed some urls in the metadata of the app
1.1.7 - Fixed translations
1.1.8 - Fixed wrong spelling in code resulting in crash
1.1.9 - Added icons for waste type
1.1.10 - Removed some code in pairing state
1.1.11 - Fixed icons for renovation
1.1.12 - Removed the blank border around the renovation icons
1.1.13 - Added support for multiple waste types on same pickup date (Experimental!)
1.1.14 - Fixed waste type showing as "undefined"
1.1.15 - Tried to fix countdown sensor showing invalid result
1.1.16 - Tried to fix countdown sensor
1.1.17 - Trying yet another fix on countdown sensor
1.1.18 - Fixed invalid string
1.1.19 - Tried fixing countdown sensor
1.1.20 - Added missing capability "garden"
1.1.21 - Added missing capabilities"
1.1.22 - Fix multiple waste types showing correctly on sensor
1.1.23 - Removed old code
1.1.24 - General fixes
1.1.25 - General fixes
1.1.26 - Finally fixed the countdown sensor not displaying properly. It should now work flawlessly!
1.1.27 - Finally fixed the countdown sensor not displaying properly. It should now work flawlessly!
1.1.28 - Finally fixed the countdown sensor not displaying properly. It should now work flawlessly!
1.1.29 - Fixed bug where capabilities wouldn't be removed if unused
```


## Authors

- [@Coderaxx](https://www.github.com/coderaxx)
