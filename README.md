# � QRIS DiInamis Payment Gateway

Website pembayaran QRIS dinamis dengan desain modern dan responsif.

---

## ✨ Fitur

- 🎨 Desain modern dengan warna solid (tanpa gradient)
- 🌙 Dark mode / Light mode toggle
- ⏱️ Countdown timer 15 menit
- 📱 Fully responsive (mobile, tablet, desktop)
- 📥 Download, Copy, Share QR Code
- 🔒 Pembayaran aman via QRIS
- 💫 Animasi smooth dan floating shapes

---

## 🚀 Cara Penggunaan

### 1. Scan QRIS Statis
Scan QRIS statis menggunakan scanner atau aplikasi pembaca QR.

**QRIS Statis (sebelum di-scan):**

![QRIS statis](/image/image-1.png)

**Payload String:**
```
00020101021126610014COM.GO-JEK.WWW01189360091436271261480210G6271261480303UMI51440014ID.CO.QRIS.WWW0215ID10253896834060303UMI5204573253033605802ID5909aldo soft6013PASAMAN BARAT61052656662070703A0163042275
```

### 2. Ubah Payload String
Buka file `script.js`, lalu ganti **baris 14** dengan payload string hasil scan.

### 3. Akses Halaman Pembayaran
Buka URL dengan parameter `?pay=nominal`:
```
https://domain.com/?pay=10000
```

---

## 🎯 Demo

- [Demo 1](https://byr.biz.id?pay=1000)
- [Demo 2](https://qris-six.vercel.app/?pay=1000)

---

## 📁 Struktur File

```
├── index.html      # Halaman utama pembayaran
├── style.css       # Styling dengan CSS variables
├── script.js       # Logic QRIS & fitur
├── 404.html        # Halaman error
└── image/          # Assets gambar
```

---

## 🛠️ Teknologi

- HTML5, CSS3, JavaScript
- Bootstrap 5
- Font Awesome 6
- QRCode.js
- Google Fonts (Inter)

---

## 💡 Supported Payment

GoPay • OVO • DANA • ShopeePay • LinkAja • dan semua e-wallet/bank yang mendukung QRIS

---

⚠️ **Catatan:** Pastikan payload string yang digunakan valid agar transaksi QRIS berhasil.
