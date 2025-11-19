# Help Koen – Donaties & Acties

Deze eenvoudige statische site ondersteunt het inzamelen van geld voor de behandeling van Koen. Doneren gebeurt via een externe GoFundMe pagina; externe supporters kunnen hun eigen acties lokaal registreren (client-side). Voor centrale opslag kun je een Google Form embedden.

## Structuur
```
my-donation-website/
  my-donation-website/
    README.md
    src/
      index.html
      components/donate-button.html
      scripts/actions.js
      scripts/donate.js
      styles/main.css
```

## Aanpassen

### 1. GoFundMe Link
Vervang in `components/donate-button.html` de URL `https://www.gofundme.com/f/JE-GOFUNDME-SLUG` door jullie echte GoFundMe link.

### 2. Eigen Acties
Pas de vaste lijst van "Onze Acties" in `index.html` aan (sectie `id="onze-acties"`).

### 3. Centrale Actieregistratie via Google Form + Sheet

**Stap 1: Google Form maken**
1. Ga naar [Google Forms](https://forms.google.com)
2. Maak een nieuw formulier met deze velden (exact deze volgorde):
   - **Naam van de actie** (Korte tekst)
   - **Datum** (Datum)
   - **Locatie** (Korte tekst)
   - **Organisator** (Korte tekst)
   - **Contact e-mail** (Korte tekst)
   - **Korte beschrijving** (Alinea)
3. Klik rechtsboven op de drie puntjes → **Insluiten ophalen**
4. Kopieer de iframe URL (bijv. `https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform?embedded=true`)

**Stap 2: Form embed in index.html**
1. Open `src/index.html`
2. Zoek sectie `id="registreer"`
3. Vervang `JOUW_FORM_ID` in de iframe `src` door jouw eigen Form embed URL

**Stap 3: Google Sheet publiceren**
1. Open je Google Form → **Antwoorden** tab → klik op groene Sheets icoon (antwoorden koppelen aan spreadsheet)
2. Open de gekoppelde Google Sheet
3. **Bestand** → **Delen** → **Publiceren op internet**
4. Kies **Gehele document** en formaat **CSV** → klik **Publiceren**
5. Kopieer de gepubliceerde URL (ziet eruit als `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`)

**Stap 4: Sheet URL in script**
1. Open `src/scripts/actions-remote.js`
2. Vervang `JOUW_SHEET_ID` in de `SHEET_CSV_URL` constante door jouw gepubliceerde CSV URL

**Klaar!** Externe acties worden nu centraal opgeslagen en automatisch getoond op de site (refresh elke 5 minuten).

## Lokale Test
Open `src/index.html` rechtstreeks in je browser (dubbelklik) of gebruik een eenvoudige lokale webserver:
```powershell
# Vanuit de src map
pwsh -Command "python -m http.server 8080"  # Vereist Python
# Ga naar http://localhost:8080
```

## Centrale Opslag (Actief)
Externe acties worden nu centraal opgeslagen via Google Form → Google Sheet. De site haalt elke 5 minuten nieuwe acties op via CSV export. Moderatie gebeurt door rijen te verwijderen/bewerken in de Sheet.

## Hosting Idee
Upload de `src` inhoud naar:
- GitHub Pages
- Netlify (drag & drop)
- Vercel (nieuw project, static).

## Privacy / GDPR
Verzamel via dit formulier geen gevoelige persoonsgegevens. Voor e-mailadressen: zorg voor toestemming als je later mailt.

## Moderatie & Privacy
- **Moderatie**: Open de Google Sheet en verwijder/bewerk rijen met ongepaste inzendingen.
- **Privacy**: Maak duidelijk in je privacybeleid dat e-mailadressen publiek zichtbaar zijn (of haal email veld uit de weergave in `actions-remote.js`).
- **Spam**: Schakel in Google Form in: **Instellingen** → **Antwoorden** → **Eén antwoord per persoon beperken** (vereist Google login).

## Verdere Uitbreiding
- Embed Google Calendar voor visuele agenda.
- Transparantie sectie automatiseren met GoFundMe API of handmatig bijwerken.
- E-mail notificaties bij nieuwe acties via Google Apps Script trigger.
- Foto uploads toevoegen (Google Form ondersteunt bestandsuploads → automatisch naar Drive).

Veel succes!
