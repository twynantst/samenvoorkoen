# SAMEN voor Koen TEGEN kanker

Fundraising website voor Koens PIPAC-behandeling. Statische site met donatie integratie (4Fund), event registratie (Google Forms), foto galerij, en analytics.

🌐 **Live:** https://twynantst.github.io/helpkvh/  
📊 **Analytics:** Cloudflare Web Analytics  
💰 **Donaties:** 4Fund.com  
📧 **Email:** ImprovMX (email forwarding)  
🌐 **Domain:** Xenius (domain registration)

## Features

- ✅ Responsief design (mobile-first)
- ✅ Donatie dialog met 4Fund integratie + QR code
- ✅ Foto galerij met lightbox (24 foto's + 2 grote foto's)
- ✅ Random foto selectie op elke page load
- ✅ Collapsible verhaal sectie
- ✅ Event kalender met eigen + externe acties
- ✅ Google Forms integratie voor event registratie
- ✅ Instagram integratie
- ✅ Privacy policy pagina (GDPR)
- ✅ Cloudflare Web Analytics (cookie-less)
- ✅ Favicon (oranje hart)
- ✅ Versienummering voor deployment tracking

## Structuur
```
samen-voor-koen-tegen-kanker/
├── README.md
├── src/                          # Development files
│   ├── index.html               # Main page
│   ├── privacy.html             # Privacy policy
│   ├── favicon.svg              # Browser icon
│   ├── assets/                  # Photos
│   │   ├── samen-voor-koen (1-24).jpg
│   │   └── big-samen-voor-koen (15-16).jpg
│   ├── components/
│   │   └── donate-button.html   # Donate dialog component
│   ├── scripts/
│   │   ├── actions.js           # Form handling & calendar
│   │   ├── actions-remote.js    # Google Sheets integration
│   │   └── donate.js            # Donate dialog logic
│   └── styles/
│       └── main.css             # All styling
└── docs/                         # Production (GitHub Pages)
    └── [same structure as src/]
```

## Development Workflow

### Lokale Test
```powershell
# Start local server vanuit docs/ of src/ folder
cd docs
python -m http.server 8081
# Open: http://localhost:8081
```

### Deployment
1. Maak wijzigingen in `src/` folder
2. Kopieer naar `docs/` folder:
   ```powershell
   Copy-Item src/* docs/ -Recurse -Force
   ```
3. Update versienummer in footer (v1.0.x)
4. Commit en push:
   ```powershell
   git add .
   git commit -m "Description (v1.0.x)"
   git push origin master
   ```
5. GitHub Pages deploy duurt 1-3 minuten
6. Hard refresh browser: `Ctrl + Shift + R`

### Versioning
Versienummer staat in footer van `index.html`:
```html
<span style="color: #666; font-size: 0.75rem; opacity: 0.7;">v1.0.x</span>
```
Update bij elke deployment om cache issues te detecteren.

## Eigen Acties Beheer

Eigen acties worden gedefinieerd in `index.html`:
```javascript
window.EIGEN_ACTIES = [
    {
        datum: '2026-01-24',
        datumFormatted: 'Vr 24 januari 2026',
        emoji: '🧀',
        titel: 'Kaas- & Wijnavond',
        locatie: 'Parochiezaal Sint-Pieter',
        details: [
            { label: 'Tijd', value: '19:00 - 23:00' },
            // ...
        ]
    }
];
```
Deze array wordt gebruikt voor:
- "Onze Acties" cards
- Kalender markers
- "Alle Acties" chronologische lijst

## Externe Acties (Google Forms/Sheets)

### Setup
1. Google Form voor event registratie (embedded in site)
2. Responses gaan naar Google Sheet
3. Publiceer Sheet als CSV:
   - **File** → **Share** → **Publish to web** → **CSV**
4. Update `SHEET_CSV_URL` in `scripts/actions-remote.js`

### Moderatie
- Open Google Sheet
- Verwijder/bewerk ongepaste inzendingen
- Site refresht automatisch elke 5 minuten

## Analytics

**Cloudflare Web Analytics** is geïnstalleerd:
- Cookie-less tracking (GDPR-compliant)
- Dashboard: https://dash.cloudflare.com → Analytics & Logs → Web Analytics
- Geen consent banner nodig

## Privacy / GDPR
- Geen tracking cookies (Cloudflare Web Analytics is cookie-less)
- Privacy policy beschikbaar op `/privacy.html`
- Contact info: info@samenvoorkoen.be
- Feitelijke vereniging: Houthoek 33, Laakdal

## Foto's Toevoegen

1. Voeg foto's toe aan `src/assets/` en `docs/assets/`
2. Gebruik naming: `samen-voor-koen (nummer).jpg`
3. Voor grote foto's (2x2 grid): `big-samen-voor-koen (nummer).jpg`
4. Update arrays in `index.html`:
   ```javascript
   const allPhotos = ['samen-voor-koen (1).jpg', ...];
   const bigPhotos = ['big-samen-voor-koen (15).jpg', ...];
   ```

## Social Media

- **Instagram:** https://www.instagram.com/samenvoorkoen
- Links in header en footer
- Gradient button styling met Instagram kleuren

## Donatie Platform

**4Fund.com** integratie:
- Dialog opent met link naar 4Fund
- QR code voor mobiele donaties
- Foto collage van 4 random foto's in donate button

## Known Issues & Solutions

### iPhone/Safari
- ✅ Photo grid overlap → Fixed met padding-bottom trick
- ✅ Scroll performance → Added `-webkit-overflow-scrolling: touch`
- ✅ Form toggle overflow → Added flex-wrap

### Browser Cache
- Update versienummer bij elke deployment
- Hard refresh: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
- Test in incognito mode

### GitHub Pages Deploy
- Takes 1-3 minutes after push
- Check status: Repository → Actions tab
- If stuck: Settings → Pages → check source is set to `/docs`

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 12+)
- ✅ Mobile browsers (responsive design)

## Performance

- Lazy loading images
- Deferred Cloudflare script
- Minimal JavaScript
- Optimized CSS (no frameworks)
- SVG favicon (scalable, small)

## Tech Stack

- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks)
- **Hosting:** GitHub Pages
- **Domain:** Xenius (domain registration & DNS)
- **Email:** ImprovMX (free email forwarding to info@samenvoorkoen.be)
- **Analytics:** Cloudflare Web Analytics
- **Forms:** Google Forms
- **Donations:** 4Fund.com
- **Icons:** Inline SVG
- **Fonts:** System fonts (no web fonts)

## Support

Voor vragen of problemen:
- Email: info@samenvoorkoen.be
- Instagram: @samenvoorkoen

---

**Current Version:** v1.0.2  
**Last Updated:** November 2025  
**License:** Private (not open source)

Veel succes met de fundraising! 💪🧡
