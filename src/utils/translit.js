// Deterministic Uzbek Lotin -> Kirill transliteration for auto-derived labels
// (used for content we author directly in Lotin, e.g. the road-sign catalog).
const MULTI = [
  [/o['ʻʼ`]/g, "ў"],
  [/O['ʻʼ`]/g, "Ў"],
  [/g['ʻʼ`]/g, "ғ"],
  [/G['ʻʼ`]/g, "Ғ"],
  [/sh/g, "ш"],
  [/Sh/g, "Ш"],
  [/SH/g, "Ш"],
  [/ch/g, "ч"],
  [/Ch/g, "Ч"],
  [/CH/g, "Ч"],
  [/ng/g, "нг"],
  [/Ng/g, "Нг"],
  [/yo/g, "ё"],
  [/Yo/g, "Ё"],
  [/yu/g, "ю"],
  [/Yu/g, "Ю"],
  [/ya/g, "я"],
  [/Ya/g, "Я"],
];

const SINGLE = {
  a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и",
  j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ",
  r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з",
  A: "А", B: "Б", D: "Д", E: "Е", F: "Ф", G: "Г", H: "Ҳ", I: "И",
  J: "Ж", K: "К", L: "Л", M: "М", N: "Н", O: "О", P: "П", Q: "Қ",
  R: "Р", S: "С", T: "Т", U: "У", V: "В", X: "Х", Y: "Й", Z: "З",
  "'": "ъ", "ʻ": "ъ",
};

export function latinToCyrillicUz(text) {
  let result = text;
  for (const [pattern, replacement] of MULTI) {
    result = result.replace(pattern, replacement);
  }
  return result
    .split("")
    .map((ch) => SINGLE[ch] ?? ch)
    .join("");
}
