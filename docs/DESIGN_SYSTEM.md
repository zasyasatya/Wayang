# Design System — Wayang Bali Learning Platform

Design system ini adalah **fondasi visual tunggal** untuk seluruh aplikasi. Semua nilai (warna, tipografi, radius, bayangan, spacing) didefinisikan terpusat sebagai **CSS custom properties** di `frontend/app/globals.css` dan dicerminkan di `frontend/lib/designTokens.ts`. Untuk mengubah tema (mis. menyesuaikan dengan screenshot referensi), cukup ubah nilai di `:root` — tidak perlu menyentuh komponen.

---

## 1. Filosofi Desain

Desain mengambil **nilai budaya wayang kulit Bali** tetapi diterjemahkan secara **modern, bersih, dan mudah digunakan** (menghindari *AI slop* / ornamen berlebihan):

- **Warm, earthy palette** — krem (latar), cokelat cocoa (teks/gelap), emas (aksen), merah batik (bahaya), hijau teal (sukses). Mengingatkan bahan kulit, kayu, dan warna *prada (emas)*.
- **Rounded & friendly** — sudut membulat, komponen *pill*, memberi kesan ramah untuk pemula.
- **Tipografi ganda** — serif *display* untuk judul (kesan klasik/budaya) + sans untuk tubuh (keterbacaan).
- **Fokus pada konten** — warna aksen dipakai hemat (aksi/CTA); banyak ruang putih (krem) agar nyaman dibaca.
- **Aksesibilitas** — kontras cukup, ukuran teks nyaman, dukungan *prefers-reduced-motion*.

---

## 2. Prinsip Desain (Prinsip UX)

1. **Sederhana** — satu halaman satu fokus; navigasi jelas.
2. **Ramah pemula** — CTA selalu jelas ("Mulai Belajar", "Coba Menggambar"); panduan bertahap.
3. **Konsisten** — seluruh elemen memakai token yang sama.
4. **Berbasis budaya, tanpa jargon** — istilah budaya diberi penjelasan ringan.
5. **Terukur & memotivasi** — penilaian menggambar memberi umpan balik membangun.

---

## 3. Palet Warna

Didefinisikan di `:root` dan `@theme` (Tailwind 4) di `globals.css`.

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--bg` | `#fdf9f1` | Latar utama (krem). |
| `--bg-alt` | `#faf3e6` | Latar sekunder (band/section). |
| `--surface` | `#ffffff` | Kartu/panel. |
| `--surface-muted` | `#f7efe1` | Panel/netral. |
| `--border` | `#e8dcc6` | Garis batas. |
| `--border-strong` | `#d8c6a6` | Border penting. |
| `--text` | `#2a2019` | Teks utama (cocoa gelap). |
| `--text-muted` | `#6b5b4a` | Teks sekunder. |
| `--text-soft` | `#8a7a68` | Teks/eyebrow. |
| `--accent` | `#c9942f` | **Aksen utama** (emas). CTA/aktif. |
| `--accent-hover` | `#a97a24` | Aksen saat hover. |
| `--accent-soft` | `#f6e7c6` | Latar aksen lembut (chip/badge). |
| `--danger` | `#b03a2e` | Bahaya / penghapus / error (merah batik). |
| `--danger-soft` | `#f8e4e0` | Latar danger lembut. |
| `--success` | `#2f8f78` | Sukses / sehat (teal). |
| `--batik-400/500/600` | `#b03a2e/#97281c/#7c1e14` | Nuansa merah batik. |
| `--gold-300/400/500/600` | `#e5c47a/#d8ad54/#c9942f/#a97a24` | Nuansa emas. |
| `--cocoa-500..900` | `#7c5a3d..` | Nuansa cokelat. |

> Ini semua tersedia juga sebagai class Tailwind via `@theme` (mis. `bg-[var(--accent)]`, `text-[var(--text-muted)]`).

---

## 4. Tipografi

| Peran | Font | Fallback | Kapan |
| --- | --- | --- | --- |
| **Display / Judul** | Marcellus (serif) | ui-serif, Georgia | `h1`, `h2`, `.font-display` |
| **Body** | Plus Jakarta Sans | ui-sans-serif, system-ui | Seluruh teks |

- **H1** `clamp(2rem, 5vw, 3.25rem)` — judul halaman.
- **H2** `clamp(1.5rem, 3vw, 2.25rem)` — seksi.
- **H3** `1.25rem` — judul kartu.
- **Eyebrow** `0.72rem`, `uppercase`, `letter-spacing .14em`, bold, warna aksen.

**Catatan**: Font di-*self-host* (`public/fonts/*.ttf`) via `next/font/local` agar build offline & deterministik. Ganti file font tanpa mengubah kode.

---

## 5. Spacing, Radius, Bayangan

Dipakai secara terukur (skala 4px).

| Token | Nilai | |
| --- | --- | --- |
| `--space-1..6` | 0.25 → 1.5rem | Spasi kecil-menengah. |
| `--space-8..20` | 2 → 5rem | Spasi seksi. |
| `--radius-sm` | `0.5rem` | Input kecil. |
| `--radius-md` | `0.875rem` | Panel kecil. |
| `--radius-lg` | `1.375rem` | Kartu. |
| `--radius-xl` | `2rem` | Band besar. |
| `--shadow-sm/md/lg` | makin dalam | Elevasi kartu. |

---

## 6. Komponen

### Buttons (`.btn`, `.btn-primary/outline/ghost/danger`)
- Bentuk **pill** (radius penuh), padding nyaman.
- **Primary**: emas, teks gelap — untuk aksi utama.
- **Outline**: transparan, border emas — aksi sekunder.
- **Ghost**: tenang — aksi minimal.
- **Danger**: merah — aksi destruktif (penghapus).

### Chips / Badges (`.chip`, `.chip-muted`, `.chip-danger`)
- Tag kecil untuk kategori, peran, peringkat, dll.

### Cards (`.card`, `.card-hover`)
- Kartu permukaan putih, border halus, bayangan lembut; hover terangkat.

### Navigation (SiteHeader)
- Header sticky dengan backdrop blur; menu kanan; burger di mobile.
- Aktif ditandai dengan `accent-soft`.

### Canvas (`.canvas-frame`, `.canvas-board`)
- Panel kanvas menggambar dengan latar krem lembut, border, bayangan menengah.
- Kanvas bersifat `touch-action: none` agar mendukung menggambar dengan jari/stylus di mobile.

### Result Panel
- Menampilkan nilai huruf, skor, bar dimensi, dan daftar umpan balik.

---

## 7. Ikonografi

Menggunakan **lucide-react** (ikon garis tipis, konsisten, mudah di-skin). Ikon dipakai hemat dan diberi `aria-hidden` untuk aksesibilitas.

---

## 8. Aksesibilitas (Accessibility)

- **Kontras**: teks utama `#2a2019` di atas `#fdf9f1` → rasio kontras tinggi.
- **Sizing**: target sentuh minimal (tombol, input) nyaman.
- **Navigasi keyboard**: tombol & link standar; canvas mendukung pointer (mouse, touch, stylus).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` mematikan transisi.
- **Label**: setiap input punya label/aria-label; ikon `aria-hidden`.
- **Semantik**: `header`, `nav`, `main`, `footer`.

---

## 9. Cara Mengganti Tema (Reskin)

Untuk menyesuaikan tampilan agar sama persis dengan referensi (mis. screenshot), ubah **hanya**:
1. Nilai `--*` di `:root` pada `frontend/app/globals.css`.
2. (Opsional) nilai kembar di `frontend/lib/designTokens.ts` untuk yang dipakai di JS.
3. (Opsional) file font di `frontend/public/fonts/`.

Tidak perlu mengubah komponen — seluruh komponen merujuk token.

---

## 10. Pedoman "No AI Slop"

- Warna aksen & dekorasi **tidak berlebihan**; gunakan `accent` hanya untuk CTA/poin.
- Tidak ada gradien mencolok di seluruh halaman (hanya radial lembut tak mencolok pada hero).
- Tipografi & spacing konsisten; tidak ada elemen "mengambang" tanpa alasan.
- Konten adalah raja; dekorasi minimal.
