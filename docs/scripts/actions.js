(function() {
    const form = document.getElementById('actie-form');
    const container = document.getElementById('acties-container');

    function loadActies() {
        const data = JSON.parse(localStorage.getItem('ext_acties') || '[]');
        if (!data.length) {
            container.innerHTML = '<p>Nog geen geregistreerde externe acties.</p>';
            return;
        }
        data.sort((a,b) => new Date(a.datum) - new Date(b.datum));
        container.innerHTML = data.map(a => `
            <div class="actie-item">
                <h3>${escapeHtml(a.titel)} <small>(${formatDate(a.datum)})</small></h3>
                <p><strong>Locatie:</strong> ${escapeHtml(a.locatie)}</p>
                <p><strong>Organisator:</strong> ${escapeHtml(a.organisator)}</p>
                <p>${escapeHtml(a.beschrijving)}</p>
                <p class="contact">Contact: <a href="mailto:${escapeHtml(a.email)}">${escapeHtml(a.email)}</a></p>
            </div>
        `).join('');
    }

    function escapeHtml(str='') {
        return str.replace(/[&<>"']/g, c => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
        }[c]));
    }

    function formatDate(d) {
        try { return new Date(d).toLocaleDateString('nl-BE'); }
        catch { return d; }
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const actie = {
            titel: fd.get('titel').trim(),
            datum: fd.get('datum'),
            locatie: fd.get('locatie').trim(),
            organisator: fd.get('organisator').trim(),
            email: fd.get('email').trim(),
            beschrijving: fd.get('beschrijving').trim()
        };
        const data = JSON.parse(localStorage.getItem('ext_acties') || '[]');
        data.push(actie);
        localStorage.setItem('ext_acties', JSON.stringify(data));
        form.reset();
        loadActies();
    });

    loadActies();
})();
