# Jadwal Sholat WebApp

![Jadwal Sholat WebApp](https://via.placeholder.com/800x400?text=Jadwal+Sholat+WebApp)

Aplikasi web jadwal sholat responsive yang dibuat dengan Google Apps Script, Tailwind CSS, dan Font Awesome. Aplikasi ini memungkinkan pengguna mencari jadwal sholat berdasarkan kota di Indonesia dengan tampilan yang menarik dan informatif.

## 🌟 Fitur

- ✅ Pencarian jadwal sholat berdasarkan nama kota
- ✅ Tampilan responsive untuk mobile dan desktop
- ✅ Autocomplete untuk nama kota
- ✅ Countdown menuju waktu sholat berikutnya
- ✅ Tampilan waktu sholat yang menarik dengan warna berbeda
- ✅ Informasi tambahan tentang keutamaan sholat
- ✅ Penanganan error yang informatif

## 🛠️ Teknologi

- **Google Apps Script** - Backend dan hosting
- **Tailwind CSS** - Styling dan responsiveness
- **Font Awesome** - Ikon
- **Vanilla JavaScript** - Interaksi pengguna

## 📸 Screenshot

### Tampilan Mobile
![Tampilan Mobile](https://via.placeholder.com/300x600?text=Mobile+View)

### Tampilan Desktop
![Tampilan Desktop](https://via.placeholder.com/800x450?text=Desktop+View)

### Hasil Pencarian
![Hasil Pencarian](https://via.placeholder.com/800x450?text=Search+Results)

## 🚀 Deployment

### 1. Clone Repository
```bash
git clone https://github.com/classyid/jadwal-sholat-webapp.git

### 2. Deployment ke Google Apps Script
1. Buka [Google Apps Script](https://script.google.com/)
2. Buat project baru
3. Salin kode dari file `Code.gs` ke editor
4. Klik Deploy > New Deployment
5. Pilih "Web app" sebagai type
6. Atur "Execute as" ke "Me"
7. Atur "Who has access" ke "Anyone" atau sesuai kebutuhan Anda
8. Klik "Deploy"

## 📊 API

### Endpoint Daftar Kota
```
https://script.google.com/macros/s/{SCRIPT_ID}/exec?action=daftar-kota
```

**Response:**
```json
{
  "status": "success",
  "total": 535,
  "data": [
    {
      "id": "317",
      "name": "acehbarat"
    },
    {
      "id": "307",
      "name": "yogyakarta"
    }
  ]
}
```

### Endpoint Jadwal Sholat
```
https://script.google.com/macros/s/{SCRIPT_ID}/exec?kota={NAMA_KOTA}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "kota": "Acehbarat",
    "tanggal": "Sabtu, 22 Maret 2025",
    "jadwal": {
      "imsyak": "05:14",
      "shubuh": "05:24",
      "terbit": "06:37",
      "dhuha": "07:01",
      "dzuhur": "12:45",
      "ashr": "15:52",
      "magrib": "18:48",
      "isya": "19:57"
    }
  }
}
```

## 📝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

## 🙏 Pengakuan

- Data jadwal sholat adalah data contoh. Untuk produksi, Anda disarankan untuk menggunakan sumber data yang akurat.
- Terima kasih kepada [Tailwind CSS](https://tailwindcss.com/) untuk styling yang luar biasa.
- Terima kasih kepada [Font Awesome](https://fontawesome.com/) untuk ikon-ikon yang indah.

## 📱 Kontak

Andri Wiratmono - kontak@classy.id
```
