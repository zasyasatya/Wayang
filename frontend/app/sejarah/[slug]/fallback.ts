import type { HistorySection } from "@/lib/api";

/** Data sejarah cadangan bila backend tidak dapat dihubungi (SSR fallback). */
export const FALLBACK: HistorySection[] = [
  {
    id: "h1",
    slug: "asal-usul",
    title: "Asal Usul Wayang Kulit Bali",
    period: "Tradisi & Pengaruh Hindu-Buddha",
    summary:
      "Wayang kulit Bali berakar pada pengaruh budaya Hindu dari India yang masuk melalui Jawa dan kemudian diadaptasi menjadi gaya khas Bali.",
    content: [
      { heading: "Akar dari pengaruh Hindu", text: "Asal usul Wayang Kulit di Bali berakar pada pengaruh budaya Hindu dari India yang masuk melalui Jawa, terutama pada masa kerajaan Majapahit. Ajaran Hindu pertama kali tiba di Nusantara sekitar awal abad pertama Masehi dan berkembang pesat pada abad-abad berikutnya." },
      { heading: "Media penyebaran ajaran", text: "Pada zaman dahulu, wayang kulit digunakan sebagai media untuk menyebarkan ajaran Hindu, termasuk kisah epik Ramayana dan Mahabharata. Karena sifatnya yang mendidik dan menghibur, wayang menjadi cara efektif untuk menyampaikan ajaran agama dan nilai moral ke masyarakat luas." },
    ],
    key_points: [
      "Pengaruh Hindu masuk lewat Jawa pada awal abad Masehi.",
      "Wayang menjadi media penyebaran ajaran dan nilai moral.",
      "Para sarjana terbagi antara asal Jawa dan asal India.",
      "Wayang hanya berkembang besar di Jawa dan Bali.",
    ],
    sources: [
      { title: "Sejarah Wayang Kulit Bali — Bali Memo", url: "https://www.balimemo.com/artikel/138157/Sejarah-Wayang-Kulit-Bali/" },
      { title: "Sejarah Wayang Kulit — EduGoEdu", url: "https://www.edugoedu.com/sejarah-wayang-kulit-sebuah-kesenian/" },
    ],
  },
  {
    id: "h2",
    slug: "masa-majapahit",
    title: "Masa Majapahit dan Kedatangan ke Bali",
    period: "Abad ke-13 – ke-15",
    summary:
      "Wayang kulit Bali banyak dipengaruhi perkembangan di Jawa, terutama pada masa Majapahit; setelah keruntuhannya, seniman dan bangsawan Hindu-Jawa bermigrasi ke Bali membawa tradisi ini.",
    content: [
      { heading: "Puncak keemasan di Jawa", text: "Wayang kulit Bali juga dipengaruhi oleh perkembangan wayang kulit di Jawa, terutama pada masa Kerajaan Majapahit (abad ke-13 hingga ke-15). Pada masa ini seni wayang mendapat perhatian besar dan menjadi bagian penting dalam upacara adat serta kehidupan spiritual." },
      { heading: "Migrasi setelah runtuhnya Majapahit", text: "Setelah runtuhnya Majapahit, banyak bangsawan, seniman, dan pendeta Hindu-Jawa bermigrasi ke Bali, membawa serta tradisi seni dan budaya mereka, termasuk wayang kulit." },
      { heading: "Akulturasi yang harmonis", text: "Meskipun mengadopsi elemen dari Jawa, seni wayang kemudian diadaptasi dan diintegrasikan ke dalam budaya lokal Bali, menciptakan gaya yang unik. Akulturasi ini menghasilkan sintesa harmonis antara Hindu-Jawa dan Hindu-Bali." },
    ],
    key_points: [
      "Majapahit (abad 13–15) menjadi masa penting perkembangan.",
      "Setelah keruntuhannya, seniman Hindu-Jawa migrasi ke Bali.",
      "Bentuk wayang Bali dipengaruhi relief candi Jawa Tengah dan Timur.",
      "Terjadi akulturasi harmonis Hindu-Jawa dan Hindu-Bali.",
    ],
    sources: [
      { title: "Menelusuri Jejak Rupa Wayang Klasik Bali (penelitian)", url: "https://www.researchgate.net/publication/336213978_Menelusuri_Jejak_Rupa_Wayang_Klasik_Bali" },
      { title: "Wayang Kulit: Sejarah, Filosofi, dan Ragam — Indonesia Travel", url: "https://indonesia.travel/gb/en/travel-ideas/wayang-kuliit/" },
    ],
  },
  {
    id: "h4",
    slug: "pengakuan-unesco",
    title: "Pengakuan UNESCO sebagai Warisan Budaya Dunia",
    period: "2003 & 2008",
    summary:
      "Wayang kulit diakui UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity pada 2003, dan masuk Representative List pada 2008.",
    content: [
      { heading: "Pengakuan tahun 2003", text: "Pada 7 November 2003, UNESCO menetapkan wayang kulit sebagai Masterpiece of the Oral and Intangible Heritage of Humanity. Pengakuan ini menegaskan bahwa wayang bukan sekadar seni pertunjukan, melainkan warisan budaya hidup yang mengandung nilai pendidikan, filsafat, dan identitas budaya masyarakat Indonesia." },
      { heading: "Masuk Representative List 2008", text: "Pada 2008, wayang kembali ditetapkan dalam Representative List of the Intangible Cultural Heritage of Humanity. UNESCO menyebut wayang telah berkembang selama sepuluh abad di kerajaan Jawa dan Bali dan menyebar ke pulau-pulau lain di Indonesia." },
    ],
    key_points: [
      "UNESCO mengakui wayang pada 7 November 2003.",
      "Masuk Representative List pada 2008 (sesi 3.COM, Istanbul).",
      "Wayang menjadi budaya pertama di Indonesia yang diakui UNESCO bersama keris.",
      "Wayang telah berkembang sepuluh abad di Jawa dan Bali.",
    ],
    sources: [
      { title: "Wayang Puppet Theatre — UNESCO Intangible Cultural Heritage", url: "https://ich.unesco.org/en/RL/wayang-puppet-theatre-00063" },
      { title: "Wayang Kulit — Indonesia Travel (Kemenparekraf)", url: "https://www.indonesia.travel/gb/en/travel-ideas/culture/wayang-kulit" },
    ],
  },
  {
    id: "h5",
    slug: "filosofi-dan-simbol",
    title: "Filosofi dan Simbolisme Wayang Bali",
    period: "Nilai & Makna",
    summary:
      "Wayang Bali sarat dengan makna filosofis, dari gunungan (kayonan) hingga tata letak kiwa-tengen, yang mencerminkan keseimbangan alam dan manusia.",
    content: [
      { heading: "Gunungan / Kayonan", text: "Gunungan (kayonan) adalah boneka pembuka dan penutup dalam wayang. Berbentuk kerucut yang lancip ke atas, gunungan melambangkan kehidupan manusia: semakin tinggi ilmu dan tua usia, manusia harus semakin mengerucut dan semakin dekat dengan Sang Pencipta." },
      { heading: "Filsafat Kiwa-Tengen (kiri-kanan)", text: "Dalam tata panggung wayang Bali, boneka yang dipancangkan di sebelah kiri adalah golongan Kurawa dan raksasa, sedangkan yang di sebelah kanan adalah Pandawa, Dwarawati, Pancala, serta para dewa. Susunan ini melambangkan keseimbangan antara baik dan buruk." },
    ],
    key_points: [
      "Gunungan melambangkan perjalanan hidup menuju kesempurnaan.",
      "Posisi kiri (Kurawa/raksasa) vs kanan (Pandawa/dewa) melambangkan keseimbangan.",
      "Perlengkapan wayang merupakan simbol tubuh dan alam semesta.",
      "Dalang adalah simbol Tuhan Yang Maha Kuasa.",
    ],
    sources: [
      { title: "Aksara Bali dalam Gunungan Wayang — Dictionary Basa Bali", url: "https://dictionary.basabali.org/VisualArt_Aksara_Bali_dalam_Gunungan" },
      { title: "Gunungan Wayang dalam Wayang Kulit (Kartala Visual Studies — Univ. Budi Luhur)", url: "https://jurnal.budiluhur.ac.id/kartala/article/download/132/111" },
    ],
  },
];
