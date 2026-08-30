# API Reference — Wayang Bali Learning Platform

Base URL: `http://localhost:8000/api`
Dokumentasi interaktif (Swagger): `GET /api/docs`
Semua respons berupa JSON (kecuali SVG siluet).

> Frontend mengakses API ini melalui proxy relatif `/api/*` (Next rewrites). Jadi di browser cukup `fetch('/api/...')`.

---

## 1. Health

### `GET /api/health`
Menunjukkan layanan berjalan.

```json
{
  "status": "ok",
  "service": "Wayang Bali Learning Platform API",
  "version": "1.0.0",
  "endpoints": { "health": "/api/health", "...": "..." }
}
```

---

## 2. Materials (Jenis Wayang)

### `GET /api/materials`
Daftar seluruh materi.

```json
{ "items": [{ "id": "m1", "slug": "wayang-parwa", "name": "Wayang Parwa", "category": "jenis-wayang", "summary": "...", "description": "...", "key_points": ["..."], "details": { "...": "..." }, "sources": [{ "title": "...", "url": "..." }] }], "total": 13 }
```

### `GET /api/materials/{category}`
Filter berdasarkan kategori (mis. `jenis-wayang`).

### `GET /api/materials/detail/{slug}`
Detail satu materi. Contoh: `GET /api/materials/detail/wayang-parwa`.
→ `404` bila tidak ada.

---

## 3. Characters (Tokoh)

### `GET /api/characters?role=panasar`
Daftar tokoh; `role` opsional (string, case-insensitive, substring match).
Contoh: `?role=panasar` mengembalikan Tualen, Merdah, Delem, Sangut.

### `GET /api/characters/{slug}`
Detail tokoh. Contoh: `GET /api/characters/arjuna`.

---

## 4. History (Sejarah)

### `GET /api/history`
Daftar artikel sejarah.

### `GET /api/history/{slug}`
Detail satu artikel sejarah.

---

## 5. Drawing (Pelajaran Menggambar)

### `GET /api/drawing`
Daftar pelajaran menggambar.

### `GET /api/drawing/{slug}`
Detail satu pelajaran.

---

## 6. Silhouettes (Siluet)

### `GET /api/silhouettes`
Daftar siluet untuk latihan.

```json
{ "items": [{ "id": "arjuna", "slug": "arjuna", "name": "Arjuna", "character_id": "arjuna", "difficulty": "mudah", "wanda": "alus", "description": "...", "tips": ["..."], "ref_points": [[126,8], ...], "construction": { "view": [220, 340], "axis": {}, "gesture": [], "proportion_lines": [], "blocks": [], "landmarks": [] } }], "total": 6 }
```

`construction` dipakai studio atelir untuk garis gestur, nawa sanga, blocking, dan landmark yang **diturunkan dari lembar acuan** (bukan overlay generik).

### `GET /api/silhouettes/{id}/image`
Mengembalikan **SVG** siluet (`image/svg+xml`). Contoh: `/api/silhouettes/arjuna/image`.

---

## 7. Grading (Penilaian Menggambar)

### `POST /api/grade`

**Request body**
```json
{
  "image": "data:image/png;base64,....",
  "silhouette_id": "arjuna",
  "opacity": 1.0
}
```
- `image` (wajib): data-URL base64 PNG dari kanvas gambar pengguna.
- `silhouette_id` (wajib): ID siluet referensi.
- `opacity` (opsional, 0–1): info opasitas goresan.

**Response 200**
```json
{
  "silhouette_id": "arjuna",
  "silhouette_name": "Arjuna",
  "total_score": 60.7,
  "grade": "D",
  "grade_label": "Cukup",
  "feedback": ["Bentuk garis Anda sangat dekat...", "..."],
  "dimensions": [
    { "name": "Ketepatan Bentuk (Merit)", "score": 39.1, "percentage": 0.391, "label": "Kurang", "note": "..." },
    { "name": "Kelengkapan Kontur (Coverage)", "score": 73.5, "percentage": 0.735, "label": "Baik", "note": "..." },
    { "name": "Ketekunan Menggambar", "score": 3.8, "percentage": 0.038, "label": "Perlu Latihan", "note": "..." }
  ],
  "metrics": { "merit": 0.391, "coverage": 0.735, "density": 0.038, "avg_distance_ink_to_ref": 10.2, "avg_distance_ref_to_ink": 8.7, "ink_pixels": 6420 }
}
```

**Error**
- `404` bila `silhouette_id` tidak ada.
- `200` (graceful) bila gambar tidak dapat dibaca → `grade="E"`, `total_score=0`, dengan feedback penjelas.

**Grading scale** → `A (≥90), B (≥80), C (≥70), D (≥55), D- (≥40), E (<40)`.

---

## 8. Environment Variables

| Variabel | Default | Deskripsi |
| --- | --- | --- |
| `WAYANG_BACKEND_URL` | `http://localhost:8000/api` | URL API untuk proxy frontend. |
| `WAYANG_CORS_ORIGINS` | `http://localhost:3000,...` | Daftar origin CORS (pisah koma). |
| `WAYANG_DATA_DIR` | `backend/app/data` | Direktori data materi. |
| `WAYANG_ASSETS_DIR` | `backend/app/assets` | Direktori aset siluet. |
| `WAYANG_GRADING_TOLERANCE` | `0.03` | Toleransi penilaian (fraksi kanvas). |
| `WAYANG_MERIT_WEIGHT` | `0.55` | Bobot dimensi merit. |
| `WAYANG_COVERAGE_WEIGHT` | `0.45` | Bobot dimensi coverage. |
| `WAYANG_GRADING_CANVAS` | `512` | Ukuran kanvas normalisasi penilaian. |
