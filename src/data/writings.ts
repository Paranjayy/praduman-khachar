/**
 * src/data/writings.ts
 *
 * Dr. Praduman Khachar's own authored articles, notes, and essays.
 * To add a new entry, copy an existing item and edit.
 *
 * Fields:
 *   id        — unique slug (kebab-case, no spaces)
 *   title     — Gujarati or Hindi title (primary language of the piece)
 *   titleEn   — English translation of the title
 *   date      — "YYYY-MM-DD"
 *   category  — one of the CATEGORIES keys below
 *   tags      — freeform labels
 *   excerpt   — ~2 sentence summary shown in the card
 *   content   — full article as plain paragraphs (array of strings = one per paragraph)
 *   featured  — true = show in hero strip on home
 *   lang      — primary language: "gu" | "hi" | "en"
 */

export interface Writing {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string[];
  featured?: boolean;
  lang: "gu" | "hi" | "en";
}

export const WRITING_CATEGORIES: Record<string, { label: string; labelGu?: string; color: string }> = {
  history:     { label: "History",       labelGu: "ઈતિહાસ",         color: "oklch(.72 .14 40)" },
  kathi:       { label: "Kathi Culture", labelGu: "કાઠી સંસ્કૃતિ",   color: "oklch(.68 .18 55)" },
  royals:      { label: "Royals",        labelGu: "રાજવીઓ",          color: "oklch(.65 .15 30)" },
  saurashtra:  { label: "Saurashtra",    labelGu: "સૌરાષ્ટ્ર",        color: "oklch(.70 .16 175)" },
  epigraphy:   { label: "Epigraphy",     labelGu: "શિલાલેખ",          color: "oklch(.65 .12 240)" },
  essay:       { label: "Essay",         labelGu: "નિબંધ",            color: "oklch(.72 .10 310)" },
  note:        { label: "Short Note",    labelGu: "ટૂંકી નોંધ",       color: "oklch(.70 .08 150)" },
};

// ─── SAMPLE CONTENT ── Add your own articles here ─────────────────────────────
export const WRITINGS: Writing[] = [
  {
    id: "kathiyawad-222-rajya",
    title: "કાઠિયાવાડના ૨૨૨ રાજ્યો",
    titleEn: "The 222 Princely States of Kathiyawad",
    date: "2024-01-15",
    category: "kathi",
    tags: ["Kathiyawad", "Princely States", "Kathi", "Saurashtra"],
    featured: true,
    lang: "gu",
    excerpt:
      "ભારતની સ્વતંત્રતા પૂર્વે કાઠિયાવાડ (સૌરાષ્ટ્ર)માં ૨૨૨ નાનાં-મોટાં રાજ્યો અસ્તિત્વ ધરાવતાં હતાં. આ રાજ્યોનો ઈતિહાસ, તેઓની વ્યવસ્થા અને કાઠી શૌર્ય-સંસ્કૃતિ વિષે એક ઊંડાણભર્યો અભ્યાસ.",
    content: [
      "ભારતની સ્વતંત્રતા (1947) પૂર્વે સૌરાષ્ટ્ર-કાઠિયાવાડ ભૂ-ભાગ 222 નાનાં-મોટાં દેશી રાજ્યોનો સ્વાધીન પ્રદેશ હતો. કેટલાંક રાજ્ય ૧૦,000 ચો.મી.ના વિસ્તારવાળાં હતાં, જ્યારે અમુક ફક્ત ચારેક ગામડાં ધરાવતાં હતાં.",
      "આ ૨૨૨ રાજ્યોમાં ૧૪ મુખ્ય 'સલ્ય'ત (Salute states) – એટલે કે બ્રિટિશ ક્રાઉન તરફ થી 'ગન સેલ્યૂટ' ઝઈ મળ્યો – ગોંઢળ, ભાવનગર, નવાનગર (જામ), ધ્રાંગધ્રા, પ્રભાસ-સોમનાથ, ઈ.ત. સ્તે. આ ઉપરાંત અનેક નાનાં રાજ્ય-ઠાસણો (ઠાકોર ગ્રામ) હતાં.",
      "કાઠી સમાજ ઘોડેસ્વાર, ભૂ-સ્વામી અને સ્વતંત્ર-ચેતા રહ્યો છે. ૧૮ મી સદીના મધ્ય ભાગ સુધી ૭ 'ઝૂઝ'ઓ (Zuz/Zula) — ઝાળા, ઝાડ, ખુમ, કોળ, ભઢ, અઠ, ઢઢ — ઈ.ત. ઉપ-સ્ત્ ઓળખ ધરાવ. ← (સ્ ○ add more historical research here)",
      "ભૂચર મોરી (1591)ના યુદ્ ·ʰ ‌ × ⁿ  — જ્યાં કત, છ_th, ith ···  (placeholder: add chapter on major battles)",
      "—— ✍️ આ લેખ ટૂ.ક.  (ઉ. પ્ ○ Dr. Khachar — please expand this section with your research notes)",
    ],
  },
  {
    id: "bhuchar-mori-battle",
    title: "ભૂચર મોરીની ઐતિહાસિક લડાઈ",
    titleEn: "The Historic Battle of Bhuchar Mori (1591)",
    date: "2023-09-20",
    category: "history",
    tags: ["Bhuchar Mori", "Battle", "Kathi", "Mughal", "1591"],
    featured: true,
    lang: "gu",
    excerpt:
      "ઈ.સ. ૧૫૯૧ – સૌરાષ્ટ્રનો એ ઐતિહાસિક પ્રસંગ જ્યારે કાઠી-કળ સૈન્ yek ↟ (placeholder excerpt — fill in)",
    content: [
      "ઈ.સ. ૧૫૯૧ (સં. ૧૬૪૭) ────── (Add full research content here, Dr. Khachar)",
    ],
  },
  {
    id: "girnar-history-note",
    title: "ગિરનારનો ઈતિહાસ — સૌથી ઊંચો ડુંગર",
    titleEn: "Girnar: The Tallest Mountain of Saurashtra",
    date: "2023-06-05",
    category: "saurashtra",
    tags: ["Girnar", "Junagadh", "Saurashtra", "Ashoka", "Pillar"],
    lang: "gu",
    excerpt:
      "ગિરનારની ટોચ ૩,666 ફૂટ — ગુજ.ની સૌ.ïŧ ‌ ઉ.ïŧ ····  (Add excerpt here)",
    content: [
      "(Add your full notes on Girnar here, Dr. Khachar — from the book Girnar No Itihas)",
    ],
  },
];
