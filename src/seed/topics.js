export const TOPICS = [
  {
    key: "yol-belgilari",
    icon: "sign",
    order: 1,
    name: { lotin: "Yo'l belgilari", krill: "Йўл белгилари", rus: "Дорожные знаки" }
  },
  {
    key: "harakat-tartibi",
    icon: "priority",
    order: 2,
    name: {
      lotin: "Harakatlanish va ustunlik tartibi",
      krill: "Ҳаракатланиш ва устунлик тартиби",
      rus: "Порядок движения и преимущество"
    }
  },
  {
    key: "toxtash-turish",
    icon: "parking",
    order: 3,
    name: { lotin: "To'xtash va turish", krill: "Тўхташ ва туриш", rus: "Остановка и стоянка" }
  },
  {
    key: "transport-talablari",
    icon: "truck",
    order: 4,
    name: {
      lotin: "Transport vositalariga talablar",
      krill: "Транспорт воситаларига талаблар",
      rus: "Требования к транспортным средствам"
    }
  },
  {
    key: "yhq-asoslari",
    icon: "book",
    order: 5,
    name: { lotin: "YHQ asoslari", krill: "ЙҲҚ асослари", rus: "Основы ПДД" }
  },
  {
    key: "tibbiy-yordam",
    icon: "medkit",
    order: 6,
    name: {
      lotin: "Birinchi tibbiy yordam",
      krill: "Биринчи тиббий ёрдам",
      rus: "Первая медицинская помощь"
    }
  },
  {
    key: "maxsus-signal",
    icon: "siren",
    order: 7,
    name: {
      lotin: "Maxsus signal va imtiyozli transport",
      krill: "Махсус сигнал ва имтиёзли транспорт",
      rus: "Спецсигналы и приоритетный транспорт"
    }
  },
  {
    key: "piyoda-velosiped",
    icon: "walk",
    order: 8,
    name: {
      lotin: "Piyodalar va velosipedchilar",
      krill: "Пиёдалар ва велосипедчилар",
      rus: "Пешеходы и велосипедисты"
    }
  }
];

// Ordered most-specific-first: the whole 1120-question bank is classified by
// keyword match against the Lotin question text, not hand-picked per id.
const RULES = [
  {
    topic: "tibbiy-yordam",
    keywords: ["tibbiy", "jarohat", "shikast", "singan", "qon ketish", "aptechka", "qutichasi", "kuygan", "shina qo'yish"]
  },
  {
    topic: "piyoda-velosiped",
    keywords: ["piyoda", "velosiped", "skuter", "moped"]
  },
  {
    topic: "maxsus-signal",
    keywords: ["mayoqcha", "maxsus signal", "imtiyozli transport", "taniqlik belgisi", "operativ xizmat", "yorug'lik signali"]
  },
  {
    topic: "transport-talablari",
    keywords: [
      "texnik holat", "shina", "protektor", "tirkama", "gabarit", "yukxona", "yuk avtomobili",
      "o'rindiq", "nosozlik", "mos kelmaydi", "tormoz tizimi", "rul boshqaruvi"
    ]
  },
  {
    topic: "toxtash-turish",
    keywords: ["to'xtash", "to'xtab turish", "to'xtaydimi", "parkovka", "to'xtashga ruxsat", "to'xtab turishga"]
  },
  {
    topic: "harakat-tartibi",
    keywords: [
      "chorraha", "ustunlik", "burilish", "manyovr", "yo'l ber", "orqaga harakat", "bo'lib o'tadi",
      "kesib o'tadi", "aylanma harakat", "qatnov qismi", "tasma", "yo'nalish"
    ]
  },
  {
    topic: "yol-belgilari",
    keywords: ["belgi", "chiziq"]
  }
];

export function classifyTopic(text) {
  const lower = (text || "").toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some(keyword => lower.includes(keyword.toLowerCase()))) {
      return rule.topic;
    }
  }
  return "yhq-asoslari";
}
