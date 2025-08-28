# 🔄 Ubah QRIS Statis ke Dinamis

_Repository ini membantu mengubah QRIS statis menjadi QRIS dinamis._

---

## 🚀 Langkah-langkah

### 1. Scan QRIS
Scan QRIS statis menggunakan scanner atau aplikasi pembaca QR.  
Hasilnya berupa **Payload String** seperti contoh di bawah:

**QRIS Statis (sebelum di-scan):**

![QRIS statis](/image/image-1.png)

**Payload String:**

> 00020101021126610014COM.GO-JEK.WWW01189360091436271261480210G6271261480303UMI51440014ID.CO.QRIS.WWW0215ID10253896834060303UMI5204573253033605802ID5909aldo soft6013PASAMAN BARAT61052656662070703A0163042275

---

### 2. Ubah Payload String
Buka file **`script.js`**, lalu ganti **baris 14** dengan payload string hasil scan.

---

## 🎯 Demo
- [Coba di sini](https://byr.biz.id?pay=1000)  
- [Atau di sini](https://qris-six.vercel.app/?pay=1000)

---

⚠️ **Catatan:** Pastikan payload string yang digunakan valid agar transaksi QRIS berhasil.
