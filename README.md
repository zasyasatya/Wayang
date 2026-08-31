# Wayang Bali — Platform Belajar Budaya & Menggambar

> Platform pembelajaran budaya **wayang Bali** untuk semua orang. Kenali **jenis-jenis wayang**, **tokoh yang berperan**, pelajari **sejarahnya**, lalu **berlatih menggambar pola & siluet** yang dinilai otomatis. Dibangun dengan **FastAPI** (backend) dan **Next.js** (frontend).

![stack](https://img.shields.io/badge/Backend-FastAPI-0b8a5a) ![stack](https://img.shields.io/badge/Frontend-Next.js-black) ![stack](https://img.shields.io/badge/CSS-Tailwind%204-06b6d4) ![build](https://img.shields.io/badge/Test-42%20passed-success) ![theme](https://img.shields.io/badge/Design-Tema%20Kamasan%20%2B%20Dark%20Mode-a8431f)

> **Desain** memakai token warna terpusat di `frontend/app/globals.css` dengan **4 tema aksen budaya Bali** (Kamasan, Samudra, Alas, Senja) + **mode terang/gelap** yang bisa diatur pengguna. Semua tampilan responsif (mobile → desktop). Token, tema, dan mode tersimpan di `localStorage` perangkat.

---

## ✨ Fitur

| Modul | Deskripsi |
| --- | --- |
| **Jenis Wayang** | Wayang Parwa, Ramayana, Wong (Orang), Gambuh, Calonarang, Cupak, Sasak, Arja, Tantri, Sapuh Leger, wayang Lemah, hingga Seni Lukis Kamasan. Setiap halaman menyertakan sumber terpercaya. |
| **Tokoh yang Berperan** | Profil tokoh dengan wanda & watak: Rama, Sita, Arjuna, Bima, Gatotkaca, Kresna, Hanoman, Rahwana, Sumbadra, Abimanyu, Srikandi, panasar Tualen/Merdah/Delem/Sangut, Betara Guru, Kalantaka. |
| **Sejarah & Filosofi** | Asal-usul, masa Majapahit, Bali Hindu Klasik, pengakuan UNESCO, simbolisme gunungan & kiwa-tengen, dan perkembangan kontemporer. |
| **Belajar Menggambar** | Studio atelir: lembar acuan profil wayang di kiri, kanvas seukuran di kanan. Tujuh langkah seni rupa (observasi → nawa sanga → blocking-in → kontur → landmark → detail → perhalus), dua lapisan (konstruksi + tinta), lalu **penilaian otomatis**. |
| **Pengaturan Tema & Dark Mode** | Halaman `/pengaturan` untuk mengganti **tema warna** (Kamasan, Samudra, Alas, Senja) dan **mode terang/gelap** (Sistem/Terang/Gelap). Pilihan tersimpan di perangkat dan diterapkan ke seluruh halaman tanpa reload. Ada tombol cepat mode gelap di topbar. |
| **Akun Admin** | Login admin (token Bearer 8 jam) di halaman Pengaturan; endpoint terproteksi `GET /api/admin/profile`. Kredensial bawaan: lihat bagian **Akun admin** di bawah. |
| **Responsif** | Seluruh halaman (beranda, materi, studio menggambar, pengaturan) dirancang mobile-first: drawer navigasi, filter & rel langkah yang bisa di-gulir horizontal, tanpa teks bertumpuk di layar 320–430 px. |

**Penilaian otomatis menggambar** menghitung dua dimensi utama:
1. **Ketepatan Bentuk (Merit)** — seberapa dekat garis Anda dengan siluet referensi.
2. **Kelengkapan Kontur (Coverage)** — seberapa besar kontur yang sudah digambar.

Lengkap dengan umpan balik berbahasa Indonesia yang ramah untuk pemula.

---

## 🔐 Akun Admin

| | |
| --- | --- |
| **Username** | `admin` |
| **Password** | `wayang2026` |

Login tersedia di **Pengaturan → Akun admin** (frontend) atau langsung ke API:

```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wayang2026"}'
# → { "token": "...", "user": { "username": "admin", "name": "Admin Wayang", "role": "admin" } }

curl -s http://localhost:8000/api/admin/profile \
  -H "Authorization: Bearer <token>"
```

**Mengamankan / mengganti kredensial** (production):

```bash
cd backend
python scripts/seed_admin.py -u admin -p 'PasswordKu-YangRahasia'   # tulis data/users.json (hash PBKDF2)
export WAYANG_AUTH_SECRET='acak-sekret-panjang'                     # tanda tangan token
# atau tanpa file: export WAYANG_ADMIN_USERNAME / WAYANG_ADMIN_PASSWORD / WAYANG_ADMIN_NAME
```

Detail endpoint: `docs/API_REFERENCE.md` (bagian Autentikasi).

---

## 🧱 Stack

| Bagian | Teknologi | Versi |
| --- | --- | --- |
| Backend | FastAPI · Uvicorn · Pydantic | 0.141.x |
| Penilaian gambar | NumPy · SciPy · Pillow | 2.4 / 1.17 / 12.x |
| Frontend | Next.js · React · TypeScript | 16.3 / 19.2 / 5.x |
| Styling | Tailwind CSS + design token (CSS variables) | 4.3 |
| Deployment | Docker / docker-compose | — |

---

## 🚀 Menjalankan Aplikasi

### Cara termudah — satu file `run.py`

```bash
cd Wayang
python3 run.py
```

`run.py` akan:
- **Memeriksa environment** (Python ≥ 3.10, Node ≥ 18, npm ≥ 9).
- **Menginstal dependensi otomatis** backend (`requirements.txt`) & frontend (`package.json`).
- **Menjalankan backend & frontend sekaligus** secara paralel.
- Menampilkan log di `backend/run.backend.log` dan `frontend/run.frontend.log`.
- **Shutdown bersih** saat tekan Ctrl+C.

**Flag yang tersedia:**

```bash
python3 run.py --skip-install        # lewati pemeriksaan & instalasi package
python3 run.py --no-frontend         # hanya jalankan backend
python3 run.py --no-backend          # hanya jalankan frontend
python3 run.py --backend-port 8001 --frontend-port 3001
python3 run.py --reinstall           # paksa instal ulang dependensi
```

> `run.py` otomatis memakai *virtual environment* `.venv` bila ada; jika belum, ia membuatnya.

### Menjalankan secara manual

**Backend**

```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate        # Windows: ..\\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
→ Dokumentasi API (Swagger): <http://localhost:8000/api/docs>

**Frontend**

```bash
cd frontend
npm install
npm run dev
```
→ Buka <http://localhost:3000>

Frontend memakai **proksi** bawaan Next.js (`/api/*` → `http://localhost:8000/api`), sehingga browser tidak pernah memanggil `localhost` secara langsung. Atur URL backend via env bila berbeda:

```bash
WAYANG_BACKEND_URL=http://127.0.0.1:8000/api npm run dev
```

---

## 🐳 Deployment dengan Docker

```bash
# build image
docker build -t wayang-bali .

# jalankan
docker run -p 8000:8000 -p 3000:3000 wayang-bali

# atau lebih mudah
docker compose up --build
```

Akses:
- Frontend: <http://localhost:3000>
- API/docs: <http://localhost:8000/api/docs>

---

## 🧪 Menjalankan Test

**Backend (pytest)**

```bash
cd backend
python -m pytest -q
# 42 passed
```

**Frontend** — lint & build (untuk memastikan tidak ada error TypeScript/route):

```bash
cd frontend
npm run build
```

---

## 📚 Dokumentasi Lengkap

| Dokumen | Path | Isi |
| --- | --- | --- |
| **Tata Cara Penggunaan** | `docs/PANDUAN_PENGGUNAAN.md` | Langkah mengoperasikan aplikasi untuk pengguna akhir. |
| **PRD** | `docs/PRD.md` | Product Requirements Document — visi, fitur, API, acceptance criteria. |
| **SDLC** | `docs/SDLC.md` | Siklus pengembangan (analisis, desain, implementasi, pengujian, deployment, pemeliharaan). |
| **Design System** | `docs/DESIGN_SYSTEM.md` | Filosofi desain, palet warna, tipografi, komponen, aturan aksesibilitas. |
| **API Reference** | `docs/API_REFERENCE.md` | Daftar endpoint API beserta contoh request/response. |

---

## 🔗 Sumber Referensi (trusted)

Materi disusun dari sumber resmi & akademik, antara lain:
- **UNESCO** Intangible Cultural Heritage — *Wayang Puppet Theatre*
- **UNIMA** — World Encyclopedia of Puppetry Arts
- **Kementerian Pariwisata & Ekonomi Kreatif** (Indonesia Travel)
- Jurnal **terakreditasi** (mis. *Jurnal Penelitian Agama Hindu* — Jayapangus; *Acintya* ISI Surakarta; **blog ISI Denpasar**)
- Ensiklopedia (Wikipedia) & situs edukasi budaya Bali

Setiap bagian materi menyertakan tautan sumber langsung di halaman terkait.

---

## 🗂 Struktur Repositori

```
Wayang/
├── run.py                  # Jalankan backend+frontend sekaligus + cek env & instalasi
├── Dockerfile              # Deployment single-image
├── docker-compose.yml
├── docker/start.sh         # Entrypoint container
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── config.py       # Pengaturan environment
│   │   ├── schemas.py      # Model request/response
│   │   ├── security.py     # Hash password (PBKDF2) & token HMAC
│   │   ├── data/           # Konten materi (JSON) [+ users.json bila di-seed]
│   │   ├── assets/silhouettes/  # SVG siluet
│   │   ├── routers/        # API routers (termasuk auth.py)
│   │   └── services/       # Data store, penilaian gambar & auth_service
│   ├── tests/              # Unit & integration tests (termasuk test_auth.py)
│   ├── scripts/generate_silhouettes.py
│   ├── scripts/seed_admin.py  # Buat/rotasi kredensial admin
│   └── requirements.txt
├── frontend/
│   ├── app/                # Pages (App Router, termasuk pengaturan/)
│   ├── components/         # UI components (theme/, auth/, studio/)
│   ├── lib/                # API client, design tokens & themes.ts
│   └── public/fonts/       # Font self-hosted
└── docs/                   # Dokumentasi (PRD, SDLC, Design System, dll)
```
