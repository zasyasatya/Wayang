/** Langkah atelir — standar mahasiswa seni rupa, disesuaikan wayang Bali. */

export type GuideKind =
  | "gesture"
  | "bbox"
  | "axis"
  | "proportion"
  | "blocks"
  | "contour"
  | "landmarks"
  | "face";

export type StudioLayer = "construct" | "ink";
export type StudyMode = "observasi" | "konstruksi" | "jiplak";
export type FocusZone = "full" | "head" | "body" | "none";

export type StudioStep = {
  id: string;
  n: number;
  title: string;
  subtitle: string;
  layer: StudioLayer;
  guides: GuideKind[];
  focus: FocusZone;
  instruction: string;
  doList: string[];
  caution: string;
  suggestedWidth: number;
  suggestedColor: string;
};

export const CONSTRUCT_BLUE = "#3d5a80";
export const INK_BLACK = "#1a140e";

export const STUDIO_STEPS: StudioStep[] = [
  {
    id: "observasi",
    n: 1,
    title: "Observasi",
    subtitle: "Lihat keseluruhan",
    layer: "construct",
    guides: ["gesture", "bbox"],
    focus: "full",
    instruction:
      "Amati lembar acuan 20–30 detik tanpa detail. Cari arah hadap, kemiringan tubuh, dan garis gerak. Baru kemudian tarik satu gestur tipis dari puncak mahkota ke telapak.",
    doList: [
      "Lihat acuan di kiri — jangan menebak dari ingatan.",
      "Satu kurva S (line of action) dari mahkota ke kaki depan.",
      "Goresan biru tipis; ini kerangka, bukan gambar jadi.",
    ],
    caution: "Jangan mulai dari mata atau mahkota. Detail di awal mengunci proporsi yang salah.",
    suggestedWidth: 2,
    suggestedColor: CONSTRUCT_BLUE,
  },
  {
    id: "proporsi",
    n: 2,
    title: "Proporsi",
    subtitle: "Nawa sanga",
    layer: "construct",
    guides: ["axis", "proportion", "bbox"],
    focus: "full",
    instruction:
      "Bagi tinggi tokoh menjadi sembilan unit. Salin garis horizontal acuan ke kanvas pada ketinggian yang sama (sight-size). Tandai mahkota, dagu, bahu, pinggang, lutut, telapak.",
    doList: [
      "Tali sipat (garis tegak) dari puncak ke tanah.",
      "Sembilan garis: 0 puncak … 9 telapak.",
      "Bandingkan: dagu di unit 3, lutut di unit 7.",
    ],
    caution: "Panasar (Tualen) sengaja menyimpang — perutnya memakan lebih banyak unit. Itu ciri wanda, bukan kesalahan.",
    suggestedWidth: 1.5,
    suggestedColor: CONSTRUCT_BLUE,
  },
  {
    id: "blocking",
    n: 3,
    title: "Blocking-in",
    subtitle: "Bentuk dasar",
    layer: "construct",
    guides: ["axis", "blocks", "gesture"],
    focus: "full",
    instruction:
      "Isi kerangka dengan oval kepala, oval badan, dan kapsul anggota gerak. Mahkota = kerucut di atas oval. Belum ada muka, belum ada jari.",
    doList: [
      "Oval kepala miring mengikuti gestur.",
      "Oval badan dari bahu ke pinggul (ramping untuk alus, gemuk untuk gagah).",
      "Kapsul bahu–siku–pergelangan dan pinggul–lutut–telapak.",
    ],
    caution: "Kalau blocking salah, hapus. Jangan 'memperbaiki' dengan detail.",
    suggestedWidth: 3,
    suggestedColor: CONSTRUCT_BLUE,
  },
  {
    id: "kontur",
    n: 4,
    title: "Kontur",
    subtitle: "Garis luar",
    layer: "ink",
    guides: ["contour", "axis"],
    focus: "full",
    instruction:
      "Beralih ke tinta. Telusuri siluet luar mengikuti blocking: mahkota → muka → tangan → badan → kaki. Kontur wayang adalah lengkung yang bertemu di puncak tajam.",
    doList: [
      "Tinta hitam di atas konstruksi biru yang masih kelihatan.",
      "Urutan tetap: mahkota, hidung, tangan, kain, kaki.",
      "Lihat acuan setiap dua-tiga goresan.",
    ],
    caution: "Jangan mengarsir berkali-kali. Satu garis, satu napas; sambung di sendi bila putus.",
    suggestedWidth: 3,
    suggestedColor: INK_BLACK,
  },
  {
    id: "landmark",
    n: 5,
    title: "Landmark",
    subtitle: "Struktur dalam",
    layer: "ink",
    guides: ["landmarks", "contour"],
    focus: "full",
    instruction:
      "Tandai titik acuan di dalam siluet — mata, dagu, bahu, siku, pinggang, lutut — lalu hubungkan agar tulang terasa di bawah kain.",
    doList: [
      "Setiap titik di acuan punya padanan di kanvas.",
      "Mata di unit 2, bukan di tengah kepala.",
      "Kain dan sayap di-block sebagai massa, bukan garis hias.",
    ],
    caution: "Jangan mengisi tatahan sebelum sendi terbaca.",
    suggestedWidth: 2.5,
    suggestedColor: INK_BLACK,
  },
  {
    id: "detail",
    n: 6,
    title: "Detail",
    subtitle: "Muka & tatahan",
    layer: "ink",
    guides: ["face", "landmarks"],
    focus: "head",
    instruction:
      "Baru sekarang muka, gelung, perhiasan, dan lipatan kain. Wanda terbaca dari profil: hidung mancung (alus), jamang rendah (gagah), kepala polos (panasar).",
    doList: [
      "Dahi mundur, hidung panjang, dagu receding.",
      "Hiasan kepala = identitas tokoh, dikerjakan setelah oval benar.",
      "Kelat bahu, kalung, sabuk, lipatan kain mengikuti arah massa.",
    ],
    caution: "Detail yang digambar sebelum proporsi selesai akan mengunci kesalahan.",
    suggestedWidth: 2,
    suggestedColor: INK_BLACK,
  },
  {
    id: "perhalus",
    n: 7,
    title: "Perhalus",
    subtitle: "Kualitas garis",
    layer: "ink",
    guides: [],
    focus: "none",
    instruction:
      "Sembunyikan konstruksi. Variasikan ketebalan: kontur luar lebih tebal, tatahan lebih tipis. Bandingkan dengan acuan, perbaiki dua-tiga kesalahan terbesar, lalu nilai.",
    doList: [
      "Matikan lapisan konstruksi atau hapus goresan biru yang menembus tinta.",
      "Tekanan di puncak tajam (hidung, ujung kain) memberi nyawa.",
      "Mode Bandingkan: tumpuk acuan samar untuk melihat penyimpangan.",
    ],
    caution: "Jangan mengoreksi semuanya sampai kaku. Dua-tiga koreksi besar cukup.",
    suggestedWidth: 2.5,
    suggestedColor: INK_BLACK,
  },
];

export const STUDY_MODES: {
  id: StudyMode;
  title: string;
  hint: string;
}[] = [
  {
    id: "observasi",
    title: "Observasi",
    hint: "Acuan di kiri, kanvas kosong. Standar atelir — gambar dengan mata, bukan menjiplak.",
  },
  {
    id: "konstruksi",
    title: "Konstruksi",
    hint: "Garis bantu yang sama muncul di acuan dan kanvas (sight-size). Direkomendasikan untuk mahasiswa.",
  },
  {
    id: "jiplak",
    title: "Jiplak pemula",
    hint: "Siluet samar di kanvas. Hanya untuk melatih koordinasi mata-tangan, bukan metode seni rupa.",
  },
];
