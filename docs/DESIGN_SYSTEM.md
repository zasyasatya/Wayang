# Design System — Wayang Bali Learning Platform

Design system ini adalah **fondasi visual tunggal** untuk seluruh aplikasi. Semua nilai (warna, tipografi, radius, bayangan, spacing) didefinisikan terpusat sebagai **CSS custom properties** di `frontend/app/globals.css` dan dicerminkan di `frontend/lib/designTokens.ts` (nilai default).

> **Catatan versi:** v2.0 — palet **budaya Bali** menggantikan tema dashboard SaaS lama (aksen biru "AI slop"). Ditambah **4 tema aksen** (Kamasan, Samudra, Alas, Senja), **mode terang/gelap** yang diatur pengguna, dan aturan **responsif mobile-first** agar tidak ada teks yang bertumpuk.

---

## 1. Filosofi Desain

- **Hangat & budaya** — netral hangat seperti kertas (`#f6f3ee`), bukan abu kebiruan SaaS. Aksen diambil dari konteks Bali: terra cotta lukisan **Kamasan**, tehali **samudra**, hijau **alas** (hutan/sawah), ambar **senja**.
- **Dinamis** — pengguna mengganti tema warna & mode terang/gelap lewat halaman **Pengaturan** (`/pengaturan`) atau tombol cepat di topbar; pilihan disimpan di `localStorage`.
- **Ramah & lapang** — kartu membulat, tombol/badge berbentuk pil, aksen dipakai hemat.
- **Fokus konten** — materi budaya & studio menggambar adalah raja; dekorasi minimal.

---

## 2. Prinsip Desain (Prinsip UX)

1. **Sederhana** — satu halaman satu fokus; navigasi jelas.
2. **Ramah pemula** — CTA jelas; panduan bertahap.
3. **Konsisten** — semua elemen memakai token yang sama.
4. **Terukur & memotivasi** — penilaian menggambar memberi umpan balik membangun.
5. **Tanpa teks tumpang tindih** — semua baris memakai grid responsif + `min-w-0`/`truncate`; header kartu boleh turun baris (`flex-wrap`) di layar sempit.
6. **Mobile-first** — layout dasar dirancang untuk 320–430 px, lalu diperluas di `sm/md/lg/xl`.

---

## 3. Token Warna

### 3.1 Netral (mode terang — default)

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--bg` | `#f6f3ee` | Latar utama (hangat, seperti kertas). |
| `--bg-alt` | `#efeae2` | Latar sekunder. |
| `--surface` | `#fffdfa` | Kartu/panel/sidebar. |
| `--surface-muted` | `#f3efe8` | Panel/netral. |
| `--border` | `#e7e1d6` | Garis batas. |
| `--border-strong` | `#d7cfc0` | Border penting. |
| `--text` | `#262019` | Teks utama. |
| `--text-muted` | `#6d6459` | Teks sekunder. |
| `--text-soft` | `#9a8f81` | Teks/eyebrow. |
| `--success` | `#2e7d4f` (+`-soft #e2efe6`) | Status selesai/berhasil. |
| `--pending` | `#8a6a1c` (+`-soft #f4ecd6`) | Status menunggu. |
| `--danger` | `#a02c2c` (+`-soft #f6e4e1`) | Bahaya / penghapus. |

`--info` / `--info-soft` **mengikuti aksen tema** (`var(--accent)`) agar status "info" selalu selaras.

### 3.2 Netral (mode gelap)

Dinyalakan dengan `html[data-theme-mode="dark"]` (diletakkan paling akhir di CSS agar menang dari tema aksen):

| Token | Nilai |
| --- | --- |
| `--bg` | `#17130e` |
| `--bg-alt` | `#1d1812` |
| `--surface` | `#201b14` |
| `--surface-muted` | `#282219` |
| `--border` | `#352d22` |
| `--border-strong` | `#4a3f30` |
| `--text` | `#f1ebdf` |
| `--text-muted` | `#b5a998` |
| `--text-soft` | `#8b7f6f` |

Status & aksen-soft pada mode gelap memakai `color-mix()` sehingga **otomatis menyesuaikan** tema aksen yang aktif (mis. `--accent-soft: color-mix(in srgb, var(--accent) 22%, transparent)`). Bayangan diperdalam (`rgba(0,0,0, 0.4–0.65)`).

### 3.3 Tema aksen (pengguna memilih)

| Tema | `--accent` | `--accent-hover` | `--accent-soft` | Nuansa |
| --- | --- | --- | --- | --- |
| **Kamasan** (default) | `#a8431f` | `#8a3418` | `#f5e8e0` | Terra cotta lukisan Kamasan. |
| **Samudra** | `#0e6e68` | `#0a5550` | `#e1efec` | Tehali laut pesisir. |
| **Alas** | `#4a6d2c` | `#3a5722` | `#e9efdf` | Hijau hutan & sawah. |
| **Senja** | `#b45309` | `#92400e` | `#f7ecdd` | Ambar matahari terbenam. |

Penerapan: atribut `data-theme="<id>"` di `<html>`; definisi lengkap di `[data-theme="…"]` pada `globals.css`, deskripsi UI di `frontend/lib/themes.ts`.

---

## 4. Mode Terang / Gelap

| Mode | Perilaku | Penyimpanan |
| --- | --- | --- |
| `auto` (default) | Mengikuti `prefers-color-scheme` perangkat (reaktif via `matchMedia`). | `wayang.themeMode = "auto"` |
| `light` | Selalu terang. | `wayang.themeMode = "light"` |
| `dark` | Selalu gelap. | `wayang.themeMode = "dark"` |

Alur teknis:
1. **Script pre-paint** di `<head>` (`app/layout.tsx`) membaca `localStorage` dan menyetel `data-theme`/`data-theme-mode` di `<html>` **sebelum** render pertama → tanpa kilatan tema (FOUC).
2. `ThemeProvider` (`components/theme/ThemeProvider.tsx`) menyinkronkan state React setelah mount, menerapkan atribut, dan mendengarkan perubahan preferensi sistem.
3. Tombol ☀/☾ di topbar membalik mode; pilihan lengkap ada di halaman **Pengaturan**.

---

## 5. Tipografi

| Peran | Font | Kapan |
| --- | --- | --- |
| **Seluruh teks** | **Inter Variable** (self-hosted via `@fontsource-variable/inter`) | Body & heading. |

- **H1** `clamp(1.6rem, 4.5vw, 2.4rem)` — judul halaman (turun ukuran mulus di layar kecil).
- **H2** `clamp(1.3rem, 3vw, 1.8rem)` — seksi.
- **H3** `1.05rem` — judul kartu.
- **Eyebrow** `0.72rem`, `uppercase`, `letter-spacing .1em`, bold, warna aksen.
- Semua heading memakai `overflow-wrap: break-word` agar kata panjang tidak meluber.

---

## 6. Spacing, Radius, Bayangan

| Token | Nilai |
| --- | --- |
| `--space-1..16` | skala `0.25 → 4rem` (basis 4px). |
| `--radius-sm..xl` | `0.6 / 0.9 / 1.15 / 1.5rem`; `--radius-full: 999px` (tombol/badge pil). |
| `--shadow-sm/md/lg` | elevasi kartu; versi mode gelap lebih pekat. |

---

## 7. Komponen

### App Shell (Sidebar + Topbar + Footer)
- **Sidebar** (desktop ≥1024px): lebar `15rem`, item nav aktif memakai warna aksen; grup "Lainnya" berisi **Pengaturan**, Dokumentasi, Sejarah & Sumber.
- **Topbar**: pencarian (≥768px), tombol **Mulai Menggambar** (≥768px), tombol **mode gelap/terang** (ikon ☀/☾), tombol **Pengaturan** (ikon palette), avatar awal huruf (berwarna aksen bila admin masuk).
- **Mobile (<1024px)**: sidebar menjadi **drawer** (tombol ☰), CTA disembunyikan agar topbar muat di 320 px.
- **Footer** ringkas di setiap halaman.

### Halaman Pengaturan (`/pengaturan`)
- Kartu **Mode terang/gelap**: 3 pilihan (Sistem/Terang/Gelap), grid 1 kolom di mobile.
- Kartu **Tema warna**: 4 kartu tema (swatch + nama + deskripsi), grid 1 kolom di mobile / 2 kolom ≥640px; baris **pratinjau** (tombol + chip + avatar) untuk melihat efek langsung.
- Kartu **Akun admin**: login (username/password) / profil + keluar.
- Kartu **Tentang**.

### Buttons (`.btn`, `.btn-primary/outline/ghost/danger/soft`)
- **Primary**: aksen, teks putih — aksi utama. **Outline**: permukaan, border. **Ghost**: tenang. **Danger**: merah tua — aksi destruktif (penghapus). **Soft**: aksen-soft, teks aksen.
- `white-space: nowrap` + `:disabled` opacity; label panjang disembunyikan di layar sempit bila perlu (mis. "Urungkan"/"Bersihkan" jadi ikon-only <640px).

### Chips / Badge status (`.chip`, `.chip-success/pending/danger/info/muted`)
- Pil kecil untuk status, kategori, peran; `white-space: nowrap`.

### Cards (`.card`, `.card-hover`, `.card-head`)
- `.card-head` memakai `flex-wrap` sehingga judul + aksi **turun baris** (bukan menumpuk) di layar sempit.

### Tabel (`.table-row`, `.table-head`)
- Baris grid responsif; padding & gap mengecil di <768px; kolom sekunder ("Bagian") hanya tampil ≥768px; teks memakai `truncate` + `min-w-0`.

### Studio atelir
- `.studio-plate` aspect 220/340; rel 7 langkah (`.studio-step-rail`) menjadi **scroll horizontal** di ≤960px; thumb tokoh juga scroll horizontal; header kanvas ringkas di mobile.
- Overlay konstruksi memakai biru pensil senada (`#3d5a80`) — warna fungsional seni rupa, bukan aksen UI.

### Stat chips (beranda)
- Grid 2 kolom di mobile / 4 kolom ≥640px; label `truncate` agar tidak meluber.

---

## 8. Ikonografi

Menggunakan **lucide-react** (ikon garis tipis, konsisten). Ikon diberi `aria-hidden`; tombol ikon punya `aria-label`/`title`.

---

## 9. Aksesibilitas (Accessibility)

- **Kontras**: teks `#262019` di atas `#f6f3ee`/`#fffdfa` (rasio ~13:1); mode gelap `#f1ebdf` di atas `#17130e`.
- **Navigasi keyboard**: tombol & link standar; `focus` input memakai ring aksen.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` mematikan transisi.
- **Label**: setiap input punya label/aria-label; drawer memakai `role="dialog"`.
- **Responsif**: tidak ada elemen tetap yang menyebabkan overflow; grid responsif + `min-w-0`/`truncate` + `flex-wrap` pada header.

---

## 10. Aturan Responsif (anti-tumpang-tindih)

| Aturan | Penerapan |
| --- | --- |
| Kontainer | `.container-wrap`: padding `1rem` (mobile) → `1.5rem` (≥640px) → `2rem` (≥1024px). |
| Heading | `clamp()` berbasis `vw` agar judul mengecil mulus. |
| Header kartu | `flex-wrap: wrap` + gap; aksi opsional disembunyikan di mobile (`hidden md:inline-flex`). |
| Baris tabel | 2 kolom di mobile, 3 kolom ≥768px; `truncate` + `min-w-0`. |
| Filter/rel langkah | `overflow-x-auto` dengan item `shrink-0`/`flex: 0 0 …` (mobile) → `flex-wrap`/grid (desktop). |
| Topbar | CTA & pencarian ≥768px; hanya ikon di layar kecil; total elemen ≤ 200 px di 320 px. |
| Gambar/kanvas | `aspect-ratio` tetap + `width: 100%`; tidak pernah menimpa teks. |

---

## 11. Cara Mengganti Tema

**Oleh pengguna (runtime):** halaman `/pengaturan` — pilih tema aksen & mode terang/gelap; tersimpan di `localStorage` (`wayang.theme`, `wayang.themeMode`).

**Oleh developer (reskin):**
1. Ubah nilai `[data-theme="…"]` dan `html[data-theme-mode="dark"]` di `frontend/app/globals.css`.
2. Perbarui deskripsi/swatch di `frontend/lib/themes.ts` dan nilai default di `frontend/lib/designTokens.ts`.
3. (Opsional) file font.

Tidak perlu mengubah komponen — semua elemen membaca CSS variables.

---

## 12. Pedoman "No AI Slop"

- **Tanpa palet SaaS generik** (biru `#2563eb` dst.) — aksen memakai warna budaya Bali yang dipilih per tema.
- Tanpa gradien mencolok; tipografi & spacing konsisten.
- Konten adalah raja; dekorasi minimal.
- Status memakai warna makna (hijau/okir/merah tua), bukan hiasan acak; warna hardcode di komponen dilarang (pakai `var(--*)`).
- Sapaan & identitas memakai data nyata (sesi admin), bukan placeholder ("John" dst.).
