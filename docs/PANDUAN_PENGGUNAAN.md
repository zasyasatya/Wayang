# Panduan Penggunaan — Platform Wayang Bali

Dokumen ini menjelaskan cara menggunakan platform langkah demi langkah, dirancang agar **orang awam** (yang baru mengenal budaya wayang) langsung paham.

---

## 1. Menyalakan Aplikasi

1. Pastikan sudah menginstal **Python 3.10+** dan **Node.js 18+** (termasuk `npm`).
2. Buka terminal di folder proyek dan jalankan:
   ```bash
   python3 run.py
   ```
3. Tunggu sampai muncul info bahwa server berjalan. Buka browser:
   - **Situs utama**: `http://localhost:3000`
   - **Dokumentasi API (opsional, untuk developer)**: `http://localhost:8000/api/docs`

> Jika instalasi otomatis ingin dilewati, gunakan `python3 run.py --skip-install`.

---

## 2. Menjelajahi Materi

Di bagian atas situs ada **menu navigasi** dengan 5 bagian utama:

| Menu | Isi |
| --- | --- |
| **Beranda** | Pengenalan singkat platform. |
| **Jenis Wayang** | Daftar jenis wayang Bali. Klik salah satu untuk membaca detail + sumber. |
| **Tokoh** | Profil tokoh wayang. Ada tombol filter per peran (Satria, Panasar, Raksasa, dll). |
| **Sejarah** | Artikel sejarah & filosofi wayang Bali. |
| **Belajar Menggambar** | **Bagian praktik** — menggambar siluet dan dinilai otomatis. |

Setiap halaman materi mencantumkan **sumber terpercaya/terakreditasi** di bagian bawah, tinggal klik untuk membuka tautan aslinya.

---

## 3. Belajar Menggambar (Praktik)

Ini bagian yang paling menarik. Ikuti langkah berikut:

1. Dari menu pilih **Belajar Menggambar**.
2. Di panel kiri, **pilih siluet tokoh** (mis. Arjuna, Bima, Rama, Hanoman, Gatotkaca, atau Tualen).
3. **Atur alat gambar**:
   - **Pensil** / **Penghapus** — pilih mode goresan.
   - **Ketebalan goresan** — geser slider (1–14px).
   - **Warna tinta** — pilih dari palet atau *color picker*.
   - **Tampilkan garis panduan** — centang untuk menampilkan siluet samar (panduan) di atas kanvas.
4. **Gambar** langsung dengan menekan dan menggeser pada kanvas. Gunakan **Urungkan** untuk membatalkan goresan terakhir, atau **Bersihkan** untuk memulai ulang.
5. Saat selesai, klik **Nilai Hasil Gambar**.
6. Sistem menampilkan:
   - **Nilai huruf** (A–E) dan **skor total** (0–100).
   - **Tiga dimensi**: Ketepatan Bentuk (Merit), Kelengkapan Kontur (Coverage), dan Ketekunan Menggambar.
   - **Umpan balik bahasa Indonesia** yang membimbing Anda memperbaiki gambar.
7. Klik **Unduh** untuk menyimpan gambar Anda, atau **Gambar Ulang** untuk mencoba lagi.

> **Tips**: Nyalakan *garis panduan* saat pertama kali berlatih agar lebih mudah menelusuri kontur. Semakin sering berlatih, semakin tinggi skor Anda.

---

## 4. Troubleshooting Ringan

| Masalah | Solusi |
| --- | --- |
| Halaman kosong / backend tidak muncul | Pastikan backend berjalan. Cek `python3 run.py` atau lihat `backend/run.backend.log`. |
| Skor selalu 0 / "Gambar kosong" | Gambar dulu di kanvas sebelum menilai. |
| npm/pip error saat `run.py` | Coba `python3 run.py --reinstall` untuk menginstal ulang dependensi. |
| Halaman tidak ditemukan | Kembali ke Beranda, atau pastikan URL benar. |
```
