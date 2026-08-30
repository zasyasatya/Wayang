# Design System — Wayang Bali Learning Platform

Design system ini adalah **fondasi visual tunggal** untuk seluruh aplikasi. Semua nilai (warna, tipografi, radius, bayangan, spacing) didefinisikan terpusat sebagai **CSS custom properties** di `frontend/app/globals.css` dan dicerminkan di `frontend/lib/designTokens.ts`. Untuk mengubah tema, cukup ubah nilai di `:root` — tidak perlu menyentuh komponen.

> **Catatan versi:** v1.1 — diadaptasi agar **sama persis dengan referensi desain "Mondays"** (dashboard modern SaaS). Sebelumnya menggunakan palet hangat kecokelatan; kini diganti menjadi tema bersih, terang, aksen biru, dengan badge status berwarna, sidebar putih, dan topbar pencarian.

---

## 1. Filosofi Desain

Mengadopsi estetika **dashboard SaaS modern** yang bersih, terang, dan mudah dibaca (referensi "Mondays"):

- **Terang & lapang** — latar abu-abu kebiruan sangat muda (`#f6f8fb`), kartu putih.
- **Aksen biru** (`#2563eb`) untuk aksi utama, navigasi aktif, dan status "Completed".
- **Badge status berwarna** — hijau (In-progress), ungu (Pending), biru (Completed) — memudahkan pemindaian.
- **Sidebar putih** dengan item aktif berbentuk pil biru; **topbar** dengan pencarian & tombol aksi.
- **Rounded & ramah** — sudut membulat, tombol dan badge berbentuk pil.
- **Fokus konten** — aksen dipakai hemat; banyak ruang putih.

---

## 2. Prinsip Desain (Prinsip UX)

1. **Sederhana** — satu halaman satu fokus; navigasi jelas.
2. **Ramah pemula** — CTA jelas; panduan bertahap.
3. **Konsisten** — semua elemen memakai token yang sama.
4. **Terukur & memotivasi** — penilaian menggambar memberi umpan balik membangun.
5. **Tanpa teks tumpang tindih** — semua baris memakai grid responsif + `min-w-0`/`truncate`.

---

## 3. Palet Warna

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--bg` | `#f6f8fb` | Latar utama (abu kebiruan muda). |
| `--bg-alt` | `#eef2f7` | Latar sekunder. |
| `--surface` | `#ffffff` | Kartu/panel/sidebar. |
| `--surface-muted` | `#f8fafc` | Panel/netral. |
| `--border` | `#eceff3` | Garis batas. |
| `--border-strong` | `#e2e8f0` | Border penting. |
| `--text` | `#0f172a` | Teks utama (gelap). |
| `--text-muted` | `#64748b` | Teks sekunder. |
| `--text-soft` | `#94a3b8` | Teks/eyebrow. |
| `--accent` | `#2563eb` | **Aksen utama** (biru). CTA/aktif. |
| `--accent-hover` | `#1d4ed8` | Aksen saat hover. |
| `--accent-soft` | `#eff4ff` | Latar aksen lembut. |
| `--success` | `#16a34a` | Status "In-progress" (hijau). |
| `--success-soft` | `#e7f6ec` | Latar hijau lembut. |
| `--pending` | `#9333ea` | Status "Pending" (ungu). |
| `--pending-soft` | `#f5e9ff` | Latar ungu lembut. |
| `--danger` | `#c026d3` | Bahaya / penghapus (mawar). |
| `--danger-soft` | `#fae8ff` | Latar danger lembut. |
| `--info` | `#2563eb` | Status "Completed" / info. |
| `--info-soft` | `#eff4ff` | Latar info lembut. |

---

## 4. Tipografi

| Peran | Font | Kapan |
| --- | --- | --- |
| **Seluruh teks** | **Inter Variable** (self-hosted via `@fontsource-variable/inter`) | Body & heading. |

- Menggunakan satu keluarga sans yang bersih dan modern (Inter), sesuai referensi.
- **H1** `clamp(1.75rem, 3vw, 2.4rem)` — judul halaman.
- **H2** `clamp(1.35rem, 2.2vw, 1.8rem)` — seksi.
- **H3** `1.05rem` — judul kartu.
- **Eyebrow** `0.72rem`, `uppercase`, `letter-spacing .1em`, bold, warna aksen.

> Font dimuat via `@fontsource-variable/inter` dan CSS variable `--font-sans`, tanpa ketergantungan CDN saat runtime.

---

## 5. Spacing, Radius, Bayangan

Dipakai secara terukur (skala 4px).

| Token | Nilai |
| --- | --- |
| `--radius-sm..xl` | `0.6/0.9/1.15/1.5rem` |
| `--radius-full` | `999px` (tombol/badge pil) |
| `--shadow-sm/md/lg` | makin dalam (elevasi kartu) |

---

## 6. Komponen

### App Shell (Sidebar + Topbar)
- **Sidebar** (desktop ≥1024px): putih, lebar `15rem`, item nav aktif berbentuk **pil biru**.
- **Topbar**: pencarian (kotak pil, dengan hint `⌘F`), tombol **"Mulai Menggambar"** (biru), ikon lonceng, avatar.
- **Mobile (<1024px):** sidebar disembunyikan, diganti **drawer** yang muncul saat tombol menu ditekan; topbar menyisakan tombol aksi ringkas.

### Buttons (`.btn`, `.btn-primary/outline/ghost/danger/soft`)
- **Primary**: biru, teks putih — aksi utama.
- **Outline**: putih, border terang — aksi sekunder.
- **Ghost**: tenang.
- **Danger**: mawar — aksi destruktif (penghapus).
- **Soft**: biru muda berteks biru (mis. "Lihat Semua").

### Chips / Badge status (`.chip`, `.chip-success/pending/info/muted/danger`)
- Pil kecil untuk status, kategori, peran.

### Cards (`.card`, `.card-hover`)
- Kartu putih, border halus, bayangan lembut; hover terangkat.

### Tabel (`.table-row`, `.table-head`)
- Baris grid responsif; kolom "Bagian" & "Status" hanya tampil di ≥768px agar **tidak tumpang tindih di mobile**; teks memakai `truncate` + `min-w-0`.

### Stat chips
- Kartu kecil dengan ikon berwarna + nilai besar + label (contoh: 13 Jenis Wayang).

### Canvas gambar (`.canvas-board`)
- Panel kanvas dengan latar lembut, mendukung pointer (mouse/touch/stylus).

---

## 7. Ikonografi

Menggunakan **lucide-react** (ikon garis tipis, konsisten). Ikon diberi `aria-hidden`.

---

## 8. Aksesibilitas (Accessibility)

- **Kontras**: teks `#0f172a` di atas `#ffffff` / `#f6f8fb` — rasio tinggi.
- **Navigasi keyboard**: tombol & link standar.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` mematikan transisi.
- **Label**: setiap input punya label/aria-label.
- **Responsif**: tidak ada elemen tetap yang menyebabkan overflow; grid responsif + `min-w-0`/`truncate`.

---

## 9. Cara Mengganti Tema (Reskin)

Ubah **hanya**:
1. Nilai `--*` di `:root` pada `frontend/app/globals.css`.
2. Nilai kembar di `frontend/lib/designTokens.ts`.
3. (Opsional) file font.

Tidak perlu mengubah komponen.

---

## 10. Pedoman "No AI Slop"

- Aksen & dekorasi tidak berlebihan; biru dipakai hanya untuk CTA/poin.
- Tanpa gradien mencolok; tipografi & spacing konsisten.
- Konten adalah raja; dekorasi minimal.
- Status menggunakan warna makna (hijau/ungu/biru), bukan hiasan acak.
