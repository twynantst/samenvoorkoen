// Donate dialog functies
function openDonateDialog() {
    const dialog = document.getElementById('donate-dialog');
    if (dialog) {
        dialog.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeDonateDialog() {
    const dialog = document.getElementById('donate-dialog');
    const qrSection = document.getElementById('qr-section');
    if (dialog) {
        dialog.style.display = 'none';
        document.body.style.overflow = '';
        if (qrSection) {
            qrSection.style.display = 'none';
            document.querySelector('.donate-options').style.display = 'flex';
        }
    }
}

function showQRCode() {
    const qrSection = document.getElementById('qr-section');
    const options = document.querySelector('.donate-options');
    if (qrSection && options) {
        options.style.display = 'none';
        qrSection.style.display = 'block';
    }
}

function hideQRCode() {
    const qrSection = document.getElementById('qr-section');
    const options = document.querySelector('.donate-options');
    if (qrSection && options) {
        qrSection.style.display = 'none';
        options.style.display = 'flex';
    }
}

// Close dialog on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDonateDialog();
    }
});

console.log('Donate component ready');
