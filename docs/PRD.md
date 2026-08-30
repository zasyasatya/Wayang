# Product Requirements Document (PRD) — Wayang Bali Learning Platform

## 1. Ringkasan Produk

**Nama produk:** Wayang Bali Learning Platform
**Kategori:** Edukasi budaya & seni (edTech)
**Target pengguna:** Masyarakat umum (orang awam) yang ingin belajar budaya dan seni wayang Bali, termasuk praktik menggambar.
**Platform:** Web (responsif, desktop & mobile).

### Tujuan
Memberikan pengalaman belajar budaya wayang Bali yang **mudah, terstruktur, dan terpercaya**, yang mencakup **pengetahuan** (jenis wayang, tokoh, sejarah) dan **keterampilan praktik** (menggambar pola & siluet dengan penilaian otomatis).

### Nilai Utama (Value Proposition)
- **Komprehensif**: mencakup 4 modul materi utama dalam satu platform.
- **Ramah pemula**: bahasa sederhana, panduan bertahap, UX intuitif.
- **Terpercaya**: setiap materi menyertakan sumber resmi/terakreditasi.
- **Interaktif & terukur**: kanvas menggambar dengan penilaian otomatis objektif.

---

## 2. Persona Pengguna

| Persona | Deskripsi | Kebutuhan |
| --- | --- | --- |
| **Pelajar / Siswa** | Ingin tugas atau belajar budaya. | Materi cepat, terstruktur, berbasis sumber. |
| **Pecinta Budaya** | Ingin memahami wayang Bali secara mendalam. | Konten kaya (jenis, tokoh, sejarah, filosofi). |
| **Pemula Menggambar** | Ingin mencoba menggambar wayang. | Panduan bertahap, garis bantuan, umpan balik. |
| **Guru / Pendamping** | Ingin media ajar. | Konten terpercaya + alat praktik + dokumentasi. |

---

## 3. Ruang Lingkup & Fitur

### 3.1 Fitur Utama (P0 — wajib)
1. **Menu / navigasi menuju platform** yang jelas (Beranda, Jenis Wayang, Tokoh, Sejarah, Belajar Menggambar).
2. **Modul Jenis Wayang** — daftar + detail berbagai jenis wayang Bali dengan sumber.
3. **Modul Tokoh** — profil tokoh, filter peran, wanda & watak, dengan tautan menggambar.
4. **Modul Sejarah** — artikel sejarah & filosofi dengan sumber.
5. **Modul Belajar Menggambar**:
   - Pilih siluet tokoh.
   - Kanvas gambar interaktif (pensil, penghapus, ketebalan, warna, garis panduan).
   - **Penilaian otomatis** dari gambar pengguna terhadap siluet referensi.
   - Umpan balik & nilai (skor, huruf, dimensi).
6. **Dokumentasi** — panduan penggunaan, API reference, design system, PRD, SDLC.
7. **Satu file `run.py`** untuk menjalankan backend+frontend sekaligus dengan cek env & instalasi.
8. **Deployment** via Dockerfile (dan docker-compose).

### 3.2 Fitur Pendukung (P1)
- Unduh gambar hasil gambar sebagai PNG.
- Filter & pencarian tokoh/materi.
- Halaman 404 yang ramah.
- SEO metadata per halaman.

---

## 4. Arsitektur

```
Browser (Next.js 16, App Router)
        │  GET /api/*  (proxy Next rewrites)
        ▼
Backend FastAPI (uvicorn, :8000)
   ├── /materials          → data/materials.json
   ├── /characters         → data/characters.json
   ├── /history            → data/history.json
   ├── /drawing            → data/drawing_lessons.json
   ├── /silhouettes        → data/silhouettes.json + assets/silhouettes/*.svg
   └── /grade              → services/grading_service.py (NumPy/SciPy/Pillow)
```

### Teknologi
- **Backend**: FastAPI 0.141, Uvicorn, Pydantic 2, NumPy, SciPy, Pillow.
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- **Deployment**: Docker, docker-compose.

---

## 5. API (Ringkasan)

Base path: `/api`, dokumentasi Swagger di `/api/docs`.

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | `/health` | Status layanan. |
| GET | `/materials` | Daftar materi jenis wayang. |
| GET | `/materials/{category}` | Filter materi per kategori. |
| GET | `/materials/detail/{slug}` | Detail materi. |
| GET | `/characters` | Daftar tokoh (opsional `?role=`). |
| GET | `/characters/{slug}` | Detail tokoh. |
| GET | `/history` | Daftar artikel sejarah. |
| GET | `/history/{slug}` | Detail artikel sejarah. |
| GET | `/drawing` | Daftar pelajaran menggambar. |
| GET | `/drawing/{slug}` | Detail pelajaran. |
| GET | `/silhouettes` | Daftar siluet. |
| GET | `/silhouettes/{id}/image` | SVG siluet. |
| POST | `/grade` | Menilai gambar pengguna (body: `{image, silhouette_id}`). |

---

## 6. Aturan Penilaian Menggambar

```
merit     = proporsi tinta pengguna dalam jarak toleransi dari kontur referensi
coverage  = proporsi titik kontur referensi yang diikuti pengguna
total     = (merit_w * merit + coverage_w * coverage) / penalti tingkat kesulitan
skor      = total * 100  →  huruf A–E
```

Bobot default: `merit_w=0.55`, `coverage_w=0.45`, toleransi `0.03 × kanvas`. Dapat diatur via env `WAYANG_MERIT_WEIGHT`, `WAYANG_COVERAGE_WEIGHT`, `WAYANG_GRADING_TOLERANCE`.

---

## 7. Kriteria Penerimaan (Acceptance Criteria)

1. **M1** — Halaman Beranda memuat menu menuju 4 modul belajar.
2. **M2** — Halaman Jenis Wayang menampilkan ≥ 10 jenis, tiap detail punya ≥ 1 sumber.
3. **M3** — Halaman Tokoh dapat difilter per peran dan menampilkan ≥ 15 tokoh.
4. **M4** — Modul Sejarah menampilkan ≥ 5 artikel dengan sumber.
5. **M5** — Kanvas menggambar mendukung pensil/penghapus, ketebalan, warna, garis panduan.
6. **M6** — Menilai gambar mengembalikan skor + huruf + dimensi + umpan balik; gambar kosong memberikan pesan ramah.
7. **M7** — `run.py` dapat menyalakan backend & frontend sekaligus dengan cek env & instalasi otomatis.
8. **M8** — Build frontend (`npm run build`) sukses; backend lulus ≥ 20 test.
9. **M9** — Dockerfile dapat membangun image & menjalankan kedua layanan.

---

## 8. Metrik Keberhasilan

- Jumlah modul materi terisi penuh (jenis, tokoh, sejarah, menggambar).
- Rata-rata waktu pengguna menyelesaikan satu latihan menggambar.
- Skor kepuasan UX (pemula menemukan cara menggambar tanpa bantuan).
- Ketersediaan sumber terpercaya di setiap halaman materi.

---

## 9. Batasan & Iterasi Berikutnya

**Iterasi saat ini:** v1.0, fokus pada konten & alat praktik inti.

**Roadmap berikutnya:**
- Registrasi akun & penyimpanan riwayat gambar.
- Galeri karya pengguna & kurasi.
- Mode kuis/kuis materi.
- Peningkatan akurasi model penilaian (mis. deteksi bentuk SSIM/contour matching lanjutan).
- Dukungan mobile first penuh & PWA offline.

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Akurasi penilaian terlalu ketat/longgar | Toleransi configurable; umpan balik mendidik, bukan menghakimi. |
| Konten tidak akurat | Hanya pakai sumber resmi/terakreditasi; tiap halaman mencantumkan sumber. |
| Ketergantungan backend saat demo | Frontend punya fallback konten statis bila API tak tersedia. |
