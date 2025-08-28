let currentQRData = null;

// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const payAmount = Number(urlParams.get('pay'));

// Auto generate QR saat page load
document.addEventListener('DOMContentLoaded', function() {
    if (!payAmount || payAmount < 1) {
        window.location.href = '404.html';
        return;
    }

    const qrisUtama = '00020101021126610014COM.GO-JEK.WWW01189360091436271261480210G6271261480303UMI51440014ID.CO.QRIS.WWW0215ID10253896834060303UMI5204573253033605802ID5909aldo soft6013PASAMAN BARAT61052656662070703A0163042275';

    localStorage.setItem('QRIS_Utama', qrisUtama);

    generateQRIS();
});

// Format ke Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Notifikasi
function showMessage(text, type = 'danger') {
    const alertClass = type === 'success' ? 'alert-success' :
                      type === 'warning' ? 'alert-warning' : 'alert-danger';
    const messageHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.getElementById('messageContainer').innerHTML = messageHtml;
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) alert.remove();
    }, 5000);
}

// Panggil API QRIS
async function qris(id, harga) {
    try {
        const response = await fetch(`https://api-mininxd.vercel.app/qris?qris=${id}&nominal=${harga}`);
        const data = await response.json();
        console.log("API Response:", data);
        return data;
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
            document.getElementById('merchantDisplay').style.display = 'block';
        }

        // Render QR
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, qrString, {
            width: 280,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
            errorCorrectionLevel: 'H'
        });

        document.getElementById('qrContainer').innerHTML = '';
        document.getElementById('qrContainer').appendChild(canvas);
        document.getElementById('actionButtons').style.display = 'block';

        console.log('QR Generated successfully');
    } catch (error) {
        document.getElementById('qrContainer').innerHTML = `
            <div class="text-center text-danger">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <p>Gagal membuat QR Code</p>
                <small>${error.message}</small>
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
            title: 'QRIS Payment',
            text: `Pembayaran ${formatCurrency(payAmount)} via QRIS`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('Link pembayaran berhasil disalin!', 'success');
        });
    }
}
