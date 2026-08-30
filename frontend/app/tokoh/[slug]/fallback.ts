import type { Character } from "@/lib/api";

/** Data tokoh cadangan bila backend tidak dapat dihubungi (SSR fallback). */
export const FALLBACK: Character[] = [
  {
    id: "c1",
    slug: "rama",
    name: "Rama",
    role: "Satria",
    wanda: "Alus",
    type: "Tokoh utama & titisan Wisnu",
    summary: "Pangeran Ayodhya dan titisan Dewa Wisnu yang menegakkan dharma.",
    description:
      "Rama (Ramawijaya) adalah putra Prabu Dasarata dari Ayodhya dan dianggap sebagai titisan Dewa Wisnu. Ia menjadi tokoh sentral Ramayana, berjuang menyelamatkan istrinya Sita dari Rahwana.",
    traits: ["Bijaksana", "Berani", "Setia", "Menegakkan dharma", "Tenang"],
    origin: { epic: "Ramayana", side: "Satria / Pendharma" },
    related_stories: ["Pembebasan Sita", "Peperangan Alengka"],
    sources: [
      { title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)", url: "https://wepa.unima.org/en/wayang/" },
    ],
  },
  {
    id: "c3",
    slug: "arjuna",
    name: "Arjuna (Janaka)",
    role: "Satria",
    wanda: "Alus",
    type: "Pandawa",
    summary: "Kesatria Pandawa yang tampan, sakti, dan menjadi tokoh favorit.",
    description:
      "Arjuna (Janaka, Permadi) adalah putra Prabu Pandu dan dewi Kunti, penggambaran kesatria halus yang paling dikenal dalam pewayangan Bali. Dengan wanda alus, ia tampan, bijak, dan memiliki banyak kesaktian.",
    traits: ["Tampan", "Sakti", "Bijaksana", "Berwatak halus (alus)"],
    origin: { epic: "Mahabharata", side: "Pandawa" },
    related_stories: ["Arjunawiwaha", "Bharatayudha"],
    sources: [
      { title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)", url: "https://wepa.unima.org/en/wayang/" },
    ],
  },
  {
    id: "c4",
    slug: "bima",
    name: "Bima (Werkudara)",
    role: "Satria",
    wanda: "Gagah",
    type: "Pandawa",
    summary: "Kesatria Pandawa kedua yang kuat, jujur, dan berwanda gagah.",
    description:
      "Bima (Werkudara, Bayusuta) adalah putra kedua Pandawa, digambarkan besar, kuat, dan berwajah gagah. Kisahnya dalam 'Bhima Swarga' sangat populer di Bali dan sering dipentaskan dalam upacara yadnya.",
    traits: ["Kuat", "Jujur", "Setia", "Tegas", "Berani"],
    origin: { epic: "Mahabharata", side: "Pandawa" },
    related_stories: ["Bhima Swarga", "Bharatayudha"],
    sources: [
      { title: "Fungsi Seni Pertunjukan Wayang Kulit Bali Lakon Bhima Swarga — Jurnal Terakreditasi", url: "https://www.academia.edu/71848754/" },
    ],
  },
  {
    id: "c7",
    slug: "hanoman",
    name: "Hanoman",
    role: "Satria",
    wanda: "Gagah",
    type: "Kesatria kera",
    summary: "Kesatria kera sakti yang setia kepada Rama.",
    description:
      "Hanoman adalah kesatria berkepala kera yang sakti dan setia kepada Rama, membantu membebaskan Sita dari Alengka. Digambarkan dengan wanda gagah, ia gesit, kuat, dan cerdik.",
    traits: ["Sakti", "Setia", "Cerdik", "Gesit", "Kuat"],
    origin: { epic: "Ramayana", side: "Satria / Rama" },
    related_stories: ["Pembakaran Alengka", "Perang Ramayana"],
    sources: [
      { title: "Wayang wong — Wikipedia", url: "https://en.wikipedia.org/wiki/Wayang_wong" },
    ],
  },
  {
    id: "c11",
    slug: "tualen",
    name: "Tualen (Twalen)",
    role: "Panasar",
    wanda: "Panasar",
    type: "Pengasuh satria (punakawan Bali)",
    summary: "Punakawan Bali yang mengasuh para kesatria, penerjemah dan pelawak.",
    description:
      "Tualen adalah punakawan (panasar) dalam pewayangan Bali yang mengasuh para kesatria, setara dengan Semar dalam wayang Jawa. Meski berstatus pelayan, ia berasal dari kedudukan dewa yang turun ke bumi.",
    traits: ["Bijak", "Lucu", "Setia", "Rendah hati", "Berpengalaman"],
    origin: { epic: "Mahabharata & Ramayana", side: "Punakawan (pengasuh satria)" },
    related_stories: ["Berbagai lakon Parwa"],
    sources: [
      { title: "PUNAKAWAN TUALEN — Blog ISI Denpasar", url: "https://blog.isi-dps.ac.id/punakawan-tualen-asal-usul-dan-peranannya-dalam-pewayangan/" },
    ],
  },
  {
    id: "c8",
    slug: "rahwana",
    name: "Rahwana (Rawana)",
    role: "Raksasa",
    wanda: "Denawa",
    type: "Antagonis Ramayana",
    summary: "Raja raksasa Alengka yang menculik Sita.",
    description:
      "Rahwana adalah raja raksasa dari Alengka, berwanda denawa yang gagah dan besar. Ia menculik Sita dan menjadi antagonis utama Ramayana. Meski sakti, keserakahannya membuatnya akhirnya kalah melawan Rama.",
    traits: ["Sakti", "Angkuh", "Serakah", "Gagah", "Cerdik"],
    origin: { epic: "Ramayana", side: "Raksasa" },
    related_stories: ["Peperangan Alengka", "Penculikan Sita"],
    sources: [
      { title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)", url: "https://wepa.unima.org/en/wayang/" },
    ],
  },
];
