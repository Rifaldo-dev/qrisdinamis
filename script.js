let currentQRData = null;
let countdownInterval = null;
let timeLeft = 900; // 15 minutes

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const payAmount = Number(urlParams.get('pay'));

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    if (!payAmount || payAmount < 1) {
        window.location.href = '404.html';
        return;
    }

    const qrisUtama = '00020101021126610014COM.GO-JEK.WWW01189360091436271261480210G6271261480303UMI51440014ID.CO.QRIS.WWW0215ID10253896834060303UMI5204573253033605802ID5909aldo soft6013PASAMAN BARAT61052656662070703A0163042275';
    localStorage.setItem('QRIS_Utama', qrisUtama);

    generateQRIS();
    startCountdown();
});

// Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Countdown
function startCountdown() {
    updateCountdownDisplay();
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            showMessage('QR Code telah kedaluwarsa. Silakan refresh halaman.', 'warning');
            document.getElementById('qrContainer').innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-clock" style="font-size: 3rem; color: var(--warning); margin-bottom: 16px;"></i>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">QR Code Kedaluwarsa</p>
                    <button onclick="location.reload()" class="btn-action btn-download">
                        <i class="fas fa-redo"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            `;
            document.getElementById('actionButtons').style.display = 'none';
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerSection = document.getElementById('timerSection');
    if (timeLeft <= 60) {
        timerSection.style.background = '#FFE6E6';
        timerSection.style.color = '#D63031';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            timerSection.style.background = 'rgba(255, 107, 107, 0.15)';
            timerSection.style.color = '#FF6B6B';
        }
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Show Message
function showMessage(text, type = 'danger') {
    const alertClass = type === 'success' ? 'alert-success' :
                      type === 'warning' ? 'alert-warning' : 'alert-danger';
    const icon = type === 'success' ? 'check-circle' :
                type === 'warning' ? 'exclamation-triangle' : 'times-circle';
    
    document.getElementById('messageContainer').innerHTML = `
        <div class="alert ${alertClass}" role="alert">
            <i class="fas fa-${icon}" style="margin-right: 8px;"></i>${text}
        </div>
    `;
    
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 4000);
}

// QRIS API
async function qris(id, harga) {
    try {
        const response = await fetch(`https://api-mininxd.vercel.app/qris?qris=${id}&nominal=${harga}`);
        return await response.json();
    } catch(e) {
        return { error: e.message };
    }
}

// Generate QRIS
async function generateQRIS() {
    const qrisUtama = localStorage.getItem('QRIS_Utama');
    
    try {
        document.getElementById('amountDisplay').textContent = formatCurrency(payAmount);

        const data = await qris(qrisUtama, payAmount);

        if (!data || (!data.QR && !data.qr)) {
            throw new Error('Gagal generate QRIS dari API');
        }

        const qrString = data.QR || data.qr || data.qris;
        currentQRData = qrString;

        if (data.merchant) {
            document.getElementById('displayMerchantName').textContent = data.merchant;
            document.getElementById('merchantDisplay').style.display = 'flex';
        }

        // Render QR
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, qrString, {
            width: 240,
            margin: 2,
            color: { dark: '#1A1D3D', light: '#FFFFFF' },
            errorCorrectionLevel: 'H'
        });

        const qrContainer = document.getElementById('qrContainer');
        qrContainer.style.opacity = '0';
        qrContainer.innerHTML = '';
        qrContainer.appendChild(canvas);
        
        requestAnimationFrame(() => {
            qrContainer.style.transition = 'opacity 0.4s ease';
            qrContainer.style.opacity = '1';
        });

        document.getElementById('actionButtons').style.display = 'grid';

    } catch (error) {
        document.getElementById('qrContainer').innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--danger); margin-bottom: 16px;"></i>
                <p style="color: var(--text-secondary); margin-bottom: 8px;">Gagal membuat QR Code</p>
                <small style="color: var(--danger);">${error.message}</small>
                <button onclick="location.reload()" class="btn-action btn-download" style="margin-top: 16px;">
                    <i class="fas fa-redo"></i>
                    <span>Coba Lagi</span>
                </button>
            </div>
        `;
        showMessage('Terjadi kesalahan: ' + error.message);
    }
}

// Download QR
function downloadQR() {
    const canvas = document.querySelector('#qrContainer canvas');
    if (canvas) {
        const merchant = document.getElementById('displayMerchantName').textContent || "Merchant";
        const link = document.createElement('a');
        link.download = `QRIS-${merchant}-${payAmount}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showMessage('QR Code berhasil didownload!', 'success');
    }
}

// Copy QR
function copyQRCode() {
    if (currentQRData) {
        navigator.clipboard.writeText(currentQRData)
            .then(() => showMessage('Kode QRIS berhasil disalin!', 'success'))
            .catch(() => showMessage('Gagal menyalin kode QRIS'));
    }
}

// Share QR
function shareQR() {
    if (navigator.share && currentQRData) {
        navigator.share({
            title: 'QRIS Payment - Aldo Soft',
            text: `Pembayaran ${formatCurrency(payAmount)} via QRIS`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('Link pembayaran berhasil disalin!', 'success');
        });
    }
}
