(function() {
    const container = document.getElementById('acties-container');
    
    // VERVANG DEZE URL door jouw gepubliceerde Google Sheet CSV export URL
    // Voorbeeld: https://docs.google.com/spreadsheets/d/e/JOUW_SHEET_ID/pub?output=csv
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/1FAIpQLScVOt9dH2I4CIlIb3oQPn3Gvpmtv_X5kJzBUL6b5khhyFHUTA/pub?output=csv';
    
    // Voorbeeld testdata (wordt gebruikt tot Google Sheet geconfigureerd is)
    const DEMO_ACTIES = [
        {
            titel: 'Wafelenbak bij de kerk',
            datum: '2026-04-05',
            locatie: 'Kerkplein',
            organisator: 'Buren van de Kerkstraat',
            email: 'contact@voorbeeld.be',
            beschrijving: 'Verse wafels met koffie en thee. Alle opbrengst gaat naar Koen.'
        },
        {
            titel: 'Benefiet Quiz Avond',
            datum: '2025-04-19',
            locatie: 'Café De Vriendschap',
            organisator: 'Quizclub De Slimmeriken',
            email: 'quiz@voorbeeld.be',
            beschrijving: 'Gezellige quiz met hapjes en drankjes. Inschrijven per ploeg van 4 personen.'
        },
        {
            titel: 'Sponsorloop',
            datum: '2026-05-03',
            locatie: 'Sportcomplex',
            organisator: 'Atletiekclub Vooruit',
            email: 'atletiek@voorbeeld.be',
            beschrijving: 'Loop mee voor Koen! Per ronde krijgen we een donatie van sponsors.'
        }
    ];
    
    function loadActies() {
        console.log('loadActies() gestart, container:', container);
        // Check of Sheet URL al ingevuld is
        if (SHEET_CSV_URL.includes('JOUW_SHEET_ID')) {
            console.info('Google Sheet nog niet geconfigureerd, toon demo data');
            renderActies(DEMO_ACTIES);
            return;
        }
        
        container.innerHTML = '<p class="loading">Acties laden...</p>';
        
        fetch(SHEET_CSV_URL)
            .then(response => {
                if (!response.ok) throw new Error('Sheet niet bereikbaar');
                return response.text();
            })
            .then(csv => {
                const acties = parseCSV(csv);
                if(acties.length === 0)
                    renderActies(DEMO_ACTIES);        
                else
                    renderActies(acties);
            })
            .catch(err => {
                console.error('Fout bij laden acties:', err);
                container.innerHTML = '<p class="error">Kon acties niet laden. Controleer de Sheet URL in scripts/actions-remote.js</p>' +
                                     '<p class="hint">Toon <a href="#" onclick="location.reload()">demo data</a> of configureer Google Sheet volgens README.</p>';
            });
    }
    
    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        if (lines.length < 2) return [];
        
        // Verwacht headers: Timestamp, Naam van de actie, Datum, Locatie, Organisator, Contact e-mail, Korte beschrijving
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const acties = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length < 7) continue; // Skip incomplete rows
            
            acties.push({
                timestamp: values[0],
                titel: values[1],
                datum: values[2],
                locatie: values[3],
                organisator: values[4],
                email: values[5],
                beschrijving: values[6]
            });
        }
        
        return acties;
    }
    
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
    }
    
    function renderActies(acties) {
        // Filter verleden acties (alleen toekomstige/vandaag tonen)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const toekomstActies = acties.filter(a => {
            try {
                const actieDatum = new Date(a.datum);
                actieDatum.setHours(0, 0, 0, 0);
                return actieDatum >= today;
            } catch {
                return true; // Bij foutieve datum toch tonen
            }
        });
        
        // Sorteer op datum (eerstkomende eerst)
        toekomstActies.sort((a, b) => {
            try {
                return new Date(a.datum) - new Date(b.datum);
            } catch {
                return 0;
            }
        });
        
        if (!toekomstActies.length) {
            container.innerHTML = '<p>Geen geplande externe acties op dit moment.</p>';
            return;
        }
        
        container.innerHTML = toekomstActies.map(a => `
            <div class="actie-item">
                <h3>${escapeHtml(a.titel)} <small>(${formatDate(a.datum)})</small></h3>
                <p><strong>Locatie:</strong> ${escapeHtml(a.locatie)}</p>
                <p><strong>Organisator:</strong> ${escapeHtml(a.organisator)}</p>
                <p>${escapeHtml(a.beschrijving)}</p>
                <p class="contact">Contact: <a href="mailto:${escapeHtml(a.email)}">${escapeHtml(a.email)}</a></p>
            </div>
        `).join('');
    }
    
    function escapeHtml(str = '') {
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));
    }
    
    function formatDate(d) {
        try {
            return new Date(d).toLocaleDateString('nl-BE');
        } catch {
            return d;
        }
    }
    
    // Wacht tot DOM geladen is voordat we acties laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Actions script geïnitialiseerd');
        loadActies();
        // Auto-refresh elke 5 minuten (optioneel)
        setInterval(loadActies, 5 * 60 * 1000);
    }
})();
