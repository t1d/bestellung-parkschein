# Antrag Parkplatz & Mobilitätsbonus

Webbasiertes Formular für den Bestellschein Parkplatz und Mobilitätsbonus der Psychiatrie St.Gallen (PSG).

Basiert auf dem internen Dokument `1.8_FO_Bestellschein_Parkplatz_und_Mobilitätsbonus`.

---

## Projektstruktur

```
parkplatz-bestellschein/
├── index.html   # Markup & Formularstruktur
├── style.css    # Styling (CSS Custom Properties, responsive)
├── script.js    # Logik, Validierung, Checkbox-Sync
└── README.md
```

---

## Funktionsumfang

| Antragsart | Felder |
|---|---|
| **Neu** | Standort(e), Datum, Beschäftigungsgrad, Name/Vorname, E-Mail, Funktion, Abteilung, Autokennzeichen (bis 3) |
| **Verlängerung** | identisch wie Neu |
| **Mutation** | identisch wie Neu |
| **Kein Parkplatz** | Mobilitätsbonus-Bestätigung |

- Clientseitige Validierung aller Pflichtfelder
- E-Mail-Formatvalidierung
- Responsive (mobile-first)

---

## Lokale Nutzung

Kein Build-Schritt nötig — einfach `index.html` im Browser öffnen:

```bash
# Option 1: Doppelklick auf index.html
# Option 2: Via Terminal
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

---

## GitHub Pages

Das Formular kann direkt über GitHub Pages gehostet werden:

1. Repository auf GitHub erstellen
2. Dateien pushen
3. **Settings → Pages → Branch: `main` / Folder: `/ (root)`** aktivieren
4. Formular ist erreichbar unter `https://<user>.github.io/<repo>/`

---

## Hinweise

- Das Formular sendet **keine Daten automatisch** ab — nach Validierung erscheint eine Bestätigungsmeldung.
- Für produktiven Einsatz ist ein Backend oder ein mailto-Link (`parking@psychiatrie-sg.ch`) zu ergänzen.
