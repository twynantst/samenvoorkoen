
(function() {
    const container = document.getElementById('acties-container');
    
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSF_2Nly5sJj9rKJLGBL3eLNW6tGV7t5xFPqQLXfNzwgRhMjBr38G9OMxst4wnIcnvJGsBayGBwYvz1/pub?output=csv';

    // Voorbeeld testdata (wordt gebruikt tot Google Sheet geconfigureerd is)
    const DEMO_ACTIES = [
        // {
        //     titel: 'Wafelenbak bij de kerk',
        //     datum: '2026-01-05',
        //     locatie: 'Kerkplein',
        //     organisator: 'Buren van de Kerkstraat',
        //     email: 'contact@voorbeeld.be',
        //     beschrijving: 'Verse wafels met koffie en thee. Alle opbrengst gaat naar Koen.'
        // },
        // {
        //     titel: 'Benefiet Quiz Avond',
        //     datum: '2026-02-19',
        //     locatie: 'Café De Vriendschap',
        //     organisator: 'Quizclub De Slimmeriken',
        //     email: 'quiz@voorbeeld.be',
        //     beschrijving: 'Gezellige quiz met hapjes en drankjes. Inschrijven per ploeg van 4 personen.'
        // },
        // {
        //     titel: 'Sponsorloop',
        //     datum: '2026-05-03',
        //     locatie: 'Sportcomplex',
        //     organisator: 'Atletiekclub Vooruit',
        //     email: 'atletiek@voorbeeld.be',
        //     beschrijving: 'Loop mee voor Koen! Per ronde krijgen we een donatie van sponsors.'
        // }
    ];
    
    function loadActies() {
        console.log('loadActies() gestart, container:', container);
        
        // Converteer EIGEN_ACTIES naar formaat dat renderActies verwacht
        const eigenActiesVoorLijst = (window.EIGEN_ACTIES || []).map(actie => {
            // Maak een mooie beschrijving van de details
            const detailsText = actie.details
                .map(d => {
                    // Strip HTML tags voor tekstweergave
                    const cleanValue = d.value.replace(/<[^>]*>/g, '');
                    return `${d.label}: ${cleanValue}`;
                })
                .join(' | ');
            
            return {
                titel: `${actie.emoji} ${actie.titel}`,
                datum: actie.datum,
                datumFormatted: actie.datumFormatted,
                locatie: actie.locatie,
                organisator: 'Team SAMEN voor Koen TEGEN kanker',
                email: 'info@samenvoorkoen.be',
                beschrijving: detailsText,
                type: 'eigen'
            };
        });
        
        container.innerHTML = '<p class="loading">Acties laden...</p>';
        
        fetch(SHEET_CSV_URL)
            .then(response => {
                if (!response.ok) throw new Error('Sheet niet bereikbaar');
                return response.text();
            })
            .then(csv => {
                console.log('Acties geladen, CSV:', csv);
                const externeActies = parseCSV(csv);
                const alleActies = [...eigenActiesVoorLijst, ...(externeActies.length > 0 ? externeActies : DEMO_ACTIES)];
                console.log('Externe acties:', externeActies);
                renderActies(alleActies);
                window.alleExterneActies = externeActies.length > 0 ? externeActies : DEMO_ACTIES;
                if (typeof renderCalendar === 'function') renderCalendar();
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
                email: values[1],
                titel: values[2],
                datum: values[3],
                locatie: values[4],
                organisator: values[5],
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
        console.log('Externe acties:', acties);

        // Filter verleden acties (alleen toekomstige/vandaag tonen)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const toekomstActies = acties
            .map(a => {

                const [day, month, year] = a.datum.split("-").map(Number);
                actieDatum = new Date(year, month - 1, day); // month is 0-based
                actieDatum.setHours(0, 0, 0, 0);
                a.actieDatum = actieDatum;
                return a;
            })
            .filter(a => {
                try {
                    return a.actieDatum >= today;
                } catch {
                    console.log('Fout bij filteren actie datum:', a);
                    return true; // Bij foutieve datum toch tonen
                }
            });
        
        // Sorteer op datum (eerstkomende eerst)
        toekomstActies.sort((a, b) => {
            try {
                return a.actieDatum - b.actieDatum;
            } catch {
                return 0;
            }
        });
        
        if (!toekomstActies.length) {
            container.innerHTML = '<p>Geen geplande externe acties op dit moment.</p>';
            return;
        }
        
        container.innerHTML = toekomstActies.map(a => `
            <div class="actie-item ${a.type === 'eigen' ? 'eigen-actie-item' : ''}">
                ${a.type === 'eigen' ? '<span class="actie-badge">⭐ Onze Actie</span>' : ''}
                <h3>${escapeHtml(a.titel)} <small>(${a.datumFormatted || formatDate(a.actieDatum)})</small></h3>
                <p><strong>📍 Locatie:</strong> ${a.type === 'eigen' ? a.locatie : escapeHtml(a.locatie)}</p>
                <p><strong>👥 Organisator:</strong> ${escapeHtml(a.organisator)}</p>
                <p><strong>📝 Details:</strong> ${escapeHtml(a.beschrijving)}</p>
                <p class="contact">✉️ Contact: <a href="mailto:${escapeHtml(a.email)}">${escapeHtml(a.email)}</a></p>
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
    
    function formatDate(date) {
        try {
           
            const formatter = new Intl.DateTimeFormat('nl-NL', {
            weekday: 'short',   // "Vr"
            day: 'numeric',     // "6"
            month: 'long',      // "februari"
            year: 'numeric'     // "2026"
            });

            return formatter.format(date);
        } catch {
            return date;
        }
    }
    
    // Wacht tot DOM geladen is en EIGEN_ACTIES beschikbaar is
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Actions script geïnitialiseerd');
        // Wacht tot EIGEN_ACTIES beschikbaar is (gedefinieerd in index.html)
        const checkEigenActies = setInterval(() => {
            if (window.EIGEN_ACTIES) {
                clearInterval(checkEigenActies);
                loadActies();
                // Auto-refresh elke 5 minuten (optioneel)
                setInterval(loadActies, 5 * 60 * 1000);
            }
        }, 50);
    }
})();
