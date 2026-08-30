# Wayang Bali — Platform Belajar Budaya & Menggambar

> Platform pembelajaran budaya **wayang Bali** untuk semua orang. Kenali **jenis-jenis wayang**, **tokoh yang berperan**, pelajari **sejarahnya**, lalu **berlatih menggambar pola & siluet** yang dinilai otomatis. Dibangun dengan **FastAPI** (backend) dan **Next.js** (frontend).

![stack](https://img.shields.io/badge/Backend-FastAPI-0b8a5a) ![stack](https://img.shields.io/badge/Frontend-Next.js-black) ![stack](https://img.shields.io/badge/CSS-Tailwind%204-06b6d4) ![build](https://img.shields.io/badge/Test-24%20passed-success)

---

## ✨ Fitur

| Modul | Deskripsi |
| --- | --- |
| **Jenis Wayang** | Wayang Parwa, Ramayana, Wong (Orang), Gambuh, Calonarang, Cupak, Sasak, Arja, Tantri, Sapuh Leger, wayang Lemah, hingga Seni Lukis Kamasan. Setiap halaman menyertakan sumber terpercaya. |
| **Tokoh yang Berperan** | Profil tokoh dengan wanda & watak: Rama, Sita, Arjuna, Bima, Gatotkaca, Kresna, Hanoman, Rahwana, Sumbadra, Abimanyu, Srikandi, panasar Tualen/Merdah/Delem/Sangut, Betara Guru, Kalantaka. |
| **Sejarah & Filosofi** | Asal-usul, masa Majapahit, Bali Hindu Klasik, pengakuan UNESCO, simbolisme gunungan & kiwa-tengen, dan perkembangan kontemporer. |
| **Belajar Menggambar** | Panduan proporsi/wanda, menggambar muka & badan, hiasan & tatahan, lalu **latihan siluet interaktif** dengan kanvas gambar (pensil, penghapus, ketebalan, warna) dan **penilaian otomatis**. |

**Penilaian otomatis menggambar** menghitung dua dimensi utama:
1. **Ketepatan Bentuk (Merit)** — seberapa dekat garis Anda dengan siluet referensi.
2. **Kelengkapan Kontur (Coverage)** — seberapa besar kontur yang sudah digambar.

Lengkap dengan umpan balik berbahasa Indonesia yang ramah untuk pemula.

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
# 24 passed
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
│   │   ├── data/           # Konten materi (JSON)
│   │   ├── assets/silhouettes/  # SVG siluet
│   │   ├── routers/        # API routers
│   │   └── services/       # Data store & mesin penilaian gambar
│   ├── tests/              # Unit & integration tests
│   ├── scripts/generate_silhouettes.py
│   └── requirements.txt
├── frontend/
│   ├── app/                # Pages (App Router)
│   ├── components/         # UI components
│   ├── lib/                # API client & design tokens
│   └── public/fonts/       # Font self-hosted
└── docs/                   # Dokumentasi (PRD, SDLC, Design System, dll)
```
