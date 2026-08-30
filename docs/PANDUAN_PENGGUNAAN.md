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

## 3. Belajar Menggambar (Studio Atelir)

Studio ini meniru cara mahasiswa seni rupa menggambar **dari acuan** (bukan menjiplak). Lembar acuan di kiri, kanvas Anda di kanan — keduanya seukuran (**sight-size**).

1. Dari menu pilih **Belajar Menggambar**.
2. Pilih **lembar acuan tokoh** (Arjuna, Rama, Bima, Gatotkaca, Hanoman, atau Tualen). Acuan adalah profil wayang, sesuai konvensi Kamasan.
3. Ikuti **tujuh langkah** di rel atas (pintasan papan ketik `1`–`7`):
   1. **Observasi** — amati keseluruhan; tarik satu garis gestur.
   2. **Proporsi** — bagi tinggi menjadi sembilan unit (nawa sanga).
   3. **Blocking-in** — oval kepala, oval badan, kapsul anggota gerak.
   4. **Kontur** — beralih ke tinta; telusuri garis luar.
   5. **Landmark** — mata, sendi, pinggang, lutut.
   6. **Detail** — muka, gelung, tatahan.
   7. **Perhalus** — kualitas garis, bandingkan, lalu nilai.
4. **Cara memakai acuan**:
   - **Konstruksi** (disarankan) — garis bantu yang sama muncul di acuan dan kanvas.
   - **Observasi** — kanvas kosong; gambar hanya dengan mata.
   - **Jiplak pemula** — siluet samar di kanvas (latihan koordinasi, bukan metode seni rupa).
5. Ada **dua lapisan**: pensil konstruksi (biru) dan tinta. Penilaian otomatis memakai **lapisan tinta** (kontur).
6. Saat selesai langkah 4+, klik **Nilai kontur**. Sistem menampilkan huruf A–E, skor, tiga dimensi, dan umpan balik.
7. **Bandingkan dengan acuan** menumpuk siluet samar di atas gambar Anda — teknik koreksi atelir. **Unduh** menyimpan gabungan lapisan.

> **Tips:** Jangan mulai dari mata. Gestur dan proporsi dulu; detail di akhir. `Ctrl+Z` mengurungkan goresan pada lapisan aktif.

---

## 4. Troubleshooting Ringan

| Masalah | Solusi |
| --- | --- |
| Halaman kosong / backend tidak muncul | Pastikan backend berjalan. Cek `python3 run.py` atau lihat `backend/run.backend.log`. |
| Skor selalu 0 / "Gambar kosong" | Gambar dulu di kanvas sebelum menilai. |
| npm/pip error saat `run.py` | Coba `python3 run.py --reinstall` untuk menginstal ulang dependensi. |
| Halaman tidak ditemukan | Kembali ke Beranda, atau pastikan URL benar. |
```
