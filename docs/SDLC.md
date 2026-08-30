# Software Development Life Cycle (SDLC) — Wayang Bali Learning Platform

Dokumen ini mendeskripsikan siklus pengembangan perangkat lunak yang digunakan untuk membangun platform, dari analisis hingga pemeliharaan. Model yang dipakai adalah **iteratif-incremental (agile)** dengan rilis fase.

---

## 1. Fase Analisis Kebutuhan (Requirements)

### 1.1 Kebutuhan Fungsional
- Platform edukasi wayang Bali dengan 4 modul: jenis wayang, tokoh, sejarah, menggambar.
- Navigasi menu menuju platform dan antar modul.
- Kanvas menggambar interaktif dengan penilaian otomatis.
- API terpisah (backend) dan aplikasi web (frontend).
- Dokumentasi lengkap (panduan penggunaan, PRD, SDLC, design system).
- Satu entrypoint `run.py` untuk menjalankan backend + frontend.
- Deployment via Docker.

### 1.2 Kebutuhan Non-fungsional (NFR)
| Aspek | Kebutuhan |
| --- | --- |
| **Usability** | Ramah untuk orang awam; bahasa Indonesia; alur menggambar dipandu. |
| **Performance** | Response API cepat; build frontend < 30s; halaman SSR ringan. |
| **Scalability** | Backend stateless, siap di-scale/container. |
| **Maintainability** | Desain token terpusat; kode berstruktur (routers/services); test. |
| **Portability** | Berjalan di lokal, Docker, dan environment preview. |
| **Accessibility** | Kontras warna cukup; aria-label; pengurangan gerak; navigasi keyboard. |
| **Reliability** | Backend menangani gambar tidak valid secara *graceful*. |

### 1.3 Risiko Awal
- Kebutuhan "design system mengikuti screenshot" belum tersedia → dibangun sistem token terpusat agar mudah di-reskin, dan UX diuji semantik antar-halaman.
- Ketergantungan sumber → dipilih sumber resmi/terakreditasi.

---

## 2. Fase Perancangan (Design)

### 2.1 Arsitektur
- **Client-Server**: frontend Next.js sebagai SPA/SSR + proxy; backend FastAPI sebagai REST API.
- **Data**: konten materi disimpan sebagai file JSON statis (mudah dikurasi); grading memakai komputasi NumPy/SciPy.

### 2.2 Desain Database / Data
Tidak ada database relasional pada v1. Konten berbasis file JSON:
```
data/
  materials.json
  characters.json
  history.json
  drawing_lessons.json
  silhouettes.json
assets/silhouettes/*.svg
```

### 2.3 Desain UI/UX
- **Design system terpusat** (CSS variables di `app/globals.css` + `lib/designTokens.ts`).
- Alur **Belajar Menggambar**: pilih tokoh → atur alat → gambar → nilai → umpan balik.
- Fallback konten statis bila backend mati.

### 2.4 Desain API
- RESTful, base path `/api`, dokumentasi OpenAPI otomatis (Swagger di `/api/docs`).
- Endpoint grading `POST /api/grade` menerima data-URL base64 PNG.

---

## 3. Fase Implementasi (Implementation)

- **Backend**: FastAPI app di `backend/app/main.py`; routers per domain; service `DataStore` & `grading_service`.
- **Frontend**: Next.js App Router; halaman per modul; komponen reusable; klien API di `lib/api.ts`.
- **Disiplin**: TypeScript strict; lint via build; versi package di-pin (requirements.txt, package.json).
- **Content**: konten dikurasi berdasar riset sumber resmi/akademik (UNESCO, UNIMA, Kemenparekraf, jurnal terakreditasi, blog ISI Denpasar).
- **Siluet**: generator Python `backend/scripts/generate_silhouettes.py` menghasilkan SVG + `ref_points` yang sinkron untuk grading.

### Catatan Teknis
- Font di-*self-host* (`next/font/local`) agar build offline/deterministik.
- Proksi Next (`rewrites`) untuk `/api/*` agar browser tidak memanggil `localhost` langsung (penting di environment preview berbasis host/origin).

---

## 4. Fase Pengujian (Testing)

### 4.1 Backend — Unit & Integration (pytest)
File: `backend/tests/`. Cakupan:
- Endpoint health, root, materials (list/detail/404), characters (list/filter/detail/404).
- History, drawing, silhouettes, SVG image.
- Grading: skor valid, gambar kosong, base64 invalid, siluet tidak ditemukan.
- Grading service unit: ink_mask, normalize/center, ref_points, grade output.

Hasil: **24 test passed**.

### 4.2 Frontend — Build & Type Check
- `npm run build` memverifikasi kompilasi TypeScript + pratinjau semua route (9 route).
- Tidak ada error tipe/route.

### 4.3 Uji Integrasi End-to-End (dijalankan manual)
- `backend` + `frontend` via `run.py`.
- `GET /api/materials`, `GET /api/silhouettes`, dan `POST /api/grade` melalui **proxy Next** → semua 200.
- Halaman utama & modul dirender dengan benar (HTTP 200, title sesuai).

### 4.4 Uji UX (subjektif)
- Alur menggambar dipandu dengan garis bantuan & umpan balik bahasa Indonesia.
- Fallback konten statis saat backend tidak aktif.

### Defect Log (contoh perbaikan)
- `materials.json` mengandung karakter kontrol → diperbaiki; validasi JSON ditambahkan.
- Import `silhouettes` yang tidak diekspor → diperbaiki.
- Akses Google Fonts gagl saat build → self-host lokal.

---

## 5. Fase Deployment

### Opsi 1 — Lokal
```bash
python3 run.py
```

### Opsi 2 — Docker
```bash
docker build -t wayang-bali .
docker run -p 8000:8000 -p 3000:3000 wayang-bali
```

### Opsi 3 — docker compose
```bash
docker compose up --build
```

Konfigurasi environment:
| Variabel | Default | Deskripsi |
| --- | --- | --- |
| `WAYANG_BACKEND_URL` | `http://localhost:8000/api` | URL API untuk proxy frontend. |
| `WAYANG_CORS_ORIGINS` | `http://localhost:3000,...` | Origin CORS. |
| `WAYANG_GRADING_TOLERANCE` | `0.03` | Toleransi penilaian. |
| `WAYANG_MERIT_WEIGHT` / `WAYANG_COVERAGE_WEIGHT` | `0.55` / `0.45` | Bobot dimensi. |
| `BACKEND_PORT` / `FRONTEND_PORT` | `8000` / `3000` | Port saat kontainer. |

---

## 6. Fase Pemeliharaan (Maintenance)

- **Monitoring**: healthcheck `/api/health`; log di `run.*.log`.
- **Pemeliharaan konten**: update file JSON di `backend/app/data/`.
- **Update dependensi**: pin versi di `requirements.txt` / `package.json`; jalankan ulang test.
- **Regenerasi siluet**: jalankan `python backend/scripts/generate_silhouettes.py` bila mengubah bentuk siluet.
- **Rotasi design system**: ubah CSS variables & design tokens (bukan komponen) untuk re-skin bila perlu.

---

## 7. Rincian Sumber yang Digunakan
| Kategori | Sumber |
| --- | --- |
| Warisan dunia | UNESCO — Wayang Puppet Theatre (2003/2008). |
| Ensiklopedia seni | UNIMA — World Encyclopedia of Puppetry Arts. |
| Pariwisata & budaya | Indonesia Travel (Kemenparekraf); balimemo.com. |
| Akademik/terakreditasi | Jurnal Penelitian Agama Hindu (Jayapangus); Acintya (ISI Surakarta); blog ISI Denpasar; Kartala Visual Studies (Univ. Budi Luhur). |
| Ensiklopedia | Wikipedia (Wayang kulit Bali; Wayang wong). |
