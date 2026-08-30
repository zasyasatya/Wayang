import type { Material } from "@/lib/api";

/** Data materi cadangan bila backend tidak dapat dihubungi (SSR fallback). */
export const MATERIAL_FALLBACK: Material[] = [
  {
    id: "m1",
    slug: "wayang-parwa",
    name: "Wayang Parwa",
    category: "jenis-wayang",
    summary:
      "Pertunjukan wayang kulit paling populer di Bali yang bersumber dari wiracarita Mahabharata.",
    description:
      "Wayang Parwa merupakan pertunjukan wayang kulit paling terkenal di seluruh Pulau Dewata. Sesuai namanya, lakonnya bersumber dari Astadasa Parwa — 18 kitab wiracarita Mahabharata. Biasanya dipentaskan pada malam hari sebagai hiburan, namun ada juga ragam siang hari yang bersifat spiritual untuk upacara agama.",
    key_points: [
      "Sumber lakon: Mahabharata (Astadasa Parwa).",
      "Paling populer dan paling sering dipentaskan di Bali.",
      "Dipentaskan malam hari (hiburan) atau siang hari (ritual).",
      "Diiringi empat buah gender wayang.",
    ],
    details: {
      sumber_lakon: "Mahabharata (Astadasa Parwa)",
      waktu_pementasan: "Malam / siang (ritual)",
      musik_pengiring: "Gender wayang",
      durasi: "3–4 jam",
    },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
      { title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)", url: "https://wepa.unima.org/en/wayang/" },
    ],
    images: [],
  },
  {
    id: "m2",
    slug: "wayang-ramayana",
    name: "Wayang Ramayana",
    category: "jenis-wayang",
    summary: "Membawakan kisah Ramayana, sering disebut wayang ngrameyana di Bali.",
    description:
      "Wayang Ramayana membawakan tokoh serta alur dari kakawin/epos Ramayana, terutama kisah Rama yang menyelamatkan Sita dari Rahwana. Di Bali, wayang ini juga dikenal dengan sebutan 'wayang ngrameyana'. Pementasannya umumnya bermotif hiburan dan digelar pada malam hari.",
    key_points: [
      "Sumber lakon: sastra Ramayana (kakawin Ramayana).",
      "Disebut juga wayang ngrameyana di Bali.",
      "Motif hiburan, dipentaskan pada malam hari.",
      "Iringan dilengkapi kendang untuk adegan perang.",
    ],
    details: {
      sumber_lakon: "Kakawin Ramayana",
      waktu_pementasan: "Malam hari",
      tokoh_utama: "Rama, Sita, Rahwana, Hanoman, Laksmana",
    },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
      { title: "Sejarah Wayang Kulit Bali — Bali Memo", url: "https://www.balimemo.com/artikel/138157/Sejarah-Wayang-Kulit-Bali/" },
    ],
    images: [],
  },
  {
    id: "m3",
    slug: "wayang-wong",
    name: "Wayang Wong (Wayang Orang Bali)",
    category: "jenis-wayang",
    summary: "Wayang yang diperankan oleh aktor manusia, langka dan historis di Bali.",
    description:
      "Wayang wong adalah satu-satunya jenis wayang yang tidak menggunakan boneka: tokoh-tokohnya diperankan langsung oleh aktor manusia dengan tarian dan kostum. Referensi tertulisnya dapat ditelusuri hingga prasasti Jawa Timur (Wimalarama) bertahun 930 M.",
    key_points: [
      "Diperankan aktor manusia, bukan boneka kulit.",
      "Rujukan tertulis pertama: prasasti Wimalarama (930 M).",
      "Di Bali umumnya terkait dengan Buleleng dan penampilan Ramayana.",
      "Sangat langka dan sudah jarang dipentaskan.",
    ],
    details: {
      sumber_lakon: "Ramayana dan Mahabharata",
      aktor: "Manusia (penari)",
      keterkaitan_daerah: "Buleleng, Bali",
    },
    sources: [
      { title: "Wayang wong — Wikipedia", url: "https://en.wikipedia.org/wiki/Wayang_wong" },
    ],
    images: [],
  },
  {
    id: "m4",
    slug: "wayang-gambuh",
    name: "Wayang Gambuh",
    category: "jenis-wayang",
    summary: "Wayang kulit Bali yang mengisahkan cerita Panji dengan iringan gamelan khas gambuh.",
    description:
      "Wayang Gambuh adalah wayang kulit asli Bali yang langka dan bersumber dari kisah Panji. Iringannya menggunakan gamelan gambuh yang terdiri atas suling besar, kendang, rehab, cengceng, kajar, kelenang, dan kempur.",
    key_points: [
      "Bersumber dari kisah Panji.",
      "Menggunakan gamelan gambuh yang khas.",
      "Termasuk jenis wayang langka di Bali.",
    ],
    details: { sumber_lakon: "Kisah Panji", gamelan: "Gamelan gambuh" },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
    ],
    images: [],
  },
  {
    id: "m5",
    slug: "wayang-calonarang",
    name: "Wayang Calonarang",
    category: "jenis-wayang",
    summary: "Wayang yang menceritakan kisah Calonarang, ratu sihir dari Dirah, dengan tema spiritual dan magis.",
    description:
      "Wayang Calonarang mengisahkan tokoh Calonarang, seorang janda sakti dari Dirah, yang berkonflik dengan Kerajaan Daha. Lakon ini sarat tema spiritual dan magis, serta ditampilkan untuk keperluan upacara pembersihan.",
    key_points: [
      "Tokoh utama: Calonarang dari Dirah.",
      "Bertemakan spiritual dan magis.",
      "Sering dipentaskan untuk upacara pembersihan (tawur).",
    ],
    details: { sumber_lakon: "Cerita Calonarang", fungsi: "Ritual, pembersihan, hiburan" },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
    ],
    images: [],
  },
  {
    id: "m6",
    slug: "wayang-cupak",
    name: "Wayang Cupak",
    category: "jenis-wayang",
    summary: "Wayang yang mengisahkan Cupak Grantang, dua putra Bhatara Brahma yang berbeda watak.",
    description:
      "Wayang Cupak, juga disebut Wayang Cupak Grantang, mengisahkan perjalanan hidup dua putra Bhatara Brahma yang sangat berbeda watak: Cupak (serakah) dan Grantang (baik hati). Struktur pementasannya mengikuti pola wayang kulit tradisional Bali.",
    key_points: [
      "Lakon utama: Cupak dan Grantang.",
      "Bersumber dari cerita rakyat bernuansa moral.",
      "Mengikuti struktur pementasan wayang Parwa.",
    ],
    details: { sumber_lakon: "Cupak Grantang", struktur: "Mengikuti pola wayang kulit tradisional Bali" },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
    ],
    images: [],
  },
  {
    id: "m7",
    slug: "wayang-sasak",
    name: "Wayang Sasak",
    category: "jenis-wayang",
    summary: "Wayang berakulturasi Bali–Sasak dari Lombok yang membawakan kisah Islam.",
    description:
      "Wayang Sasak tumbuh dan berkembang di daerah Sasak (Lombok, Nusa Tenggara Barat) dan menjadi bukti akulturasi seni budaya Bali dengan Sasak. Lakonnya bertemakan Islam — biasanya menceritakan perjalanan tokoh Amir Hamzah. Boneka wayang terbuat dari kulit kerbau.",
    key_points: [
      "Berasal dari daerah Sasak (Lombok, NTB).",
      "Boneka terbuat dari kulit kerbau.",
      "Lakon bertema Islam: perjuangan Amir Hamzah.",
      "Terancam punah karena kurangnya regenerasi dalang.",
    ],
    details: { asal: "Lombok, Nusa Tenggara Barat", bahan_boneka: "Kulit kerbau", bahasa: "Kawi, Bali, Sasak" },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
    ],
    images: [],
  },
  {
    id: "m9",
    slug: "wayang-tantri",
    name: "Wayang Tantri",
    category: "jenis-wayang",
    summary: "Wayang inovasi I Wayan Wija yang membawakan cerita hewan Hindu.",
    description:
      "Wayang Tantri adalah inovasi dari I Wayan Wija pada tahun 1980-an. Wayang ini menggunakan boneka kulit untuk menceritakan kisah-kisah hewan (fabel) yang bernuansa Hindu, terinspirasi dari naskah Tantri Kamandaka.",
    key_points: [
      "Inovasi oleh I Wayan Wija pada 1980-an.",
      "Membawakan cerita hewan (fabel) Hindu.",
      "Terinspirasi naskah Tantri Kamandaka.",
    ],
    details: { tokoh_inovator: "I Wayan Wija", tahun: "1980-an", karakter: "Cerita fabel / sasatwa" },
    sources: [
      { title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)", url: "https://wepa.unima.org/en/wayang/" },
    ],
    images: [],
  },
  {
    id: "m11",
    slug: "wayang-sapuh-leger",
    name: "Wayang Sapuh Leger",
    category: "jenis-wayang",
    summary: "Wayang ruwatan yang dipentaskan untuk upacara penyucian.",
    description:
      "Wayang Sapuh Leger adalah varian Wayang Parwa yang dipentaskan pada siang hari dan memiliki tema spiritual atau berkaitan dengan upacara agama. Fungsi utamanya adalah ruwatan/pembersihan.",
    key_points: [
      "Varian Wayang Parwa untuk ritual.",
      "Dipentaskan pada siang hari.",
      "Fungsi: ruwatan dan penyucian.",
    ],
    details: { induk: "Wayang Parwa", waktu: "Siang hari", fungsi: "Ruwatan / penyucian" },
    sources: [
      { title: "Wayang kulit Bali — Wikipedia", url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali" },
    ],
    images: [],
  },
  {
    id: "m13",
    slug: "wayang-kamasan",
    name: "Seni Lukis Wayang Kamasan",
    category: "jenis-wayang",
    summary: "Gaya lukis klasik Bali yang meniru bentuk wayang kulit, lahir dari desa Kamasan, Klungkung.",
    description:
      "Seni lukis Wayang Kamasan adalah salah satu gaya lukis Bali klasik yang paling populer. Disebut Kamasan karena lahir dari desa Kamasan, Klungkung. Bentuk lukisannya mengikuti bentuk wayang kulit. Karya I Nyoman Mandra menjadi contoh penting revitalisasi tradisi ini.",
    key_points: [
      "Lahir dari desa Kamasan, Klungkung.",
      "Bentuk mengikuti figur wayang kulit.",
      "Palet terbatas: cokelat, merah oker, hitam, putih, emas.",
      "I Nyoman Mandra adalah maestro revitalisasi gaya ini.",
    ],
    details: { asal: "Desa Kamasan, Klungkung, Bali", gaya: "Wayang Kamasan / Klasik Bali", tokoh: "I Nyoman Mandra" },
    sources: [
      { title: "Teknik Seni Lukis Klasik Bali Gaya Kamasan — Jurnal ISI Surakarta (Acintya)", url: "https://jurnal.isi-ska.ac.id/index.php/acintya/article/view/1987" },
      { title: "Balinese Art Guide — TravJoy", url: "https://travjoy.com/blog/balinese-art-from-woodcarving-to-batik-a-visual-guide" },
    ],
    images: [],
  },
];
