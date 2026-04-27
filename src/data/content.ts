import type {
  SiteConfig,
  StatItem,
  Achievement,
  EducationItem,
  CareerItem,
  MediaStatItem,
  Social,
  Book,
  BookCategory,
  Playlist,
} from "../types";

export const SITE: SiteConfig = {
  name: "Dr. Praduman Khachar",
  title: "Dr. Pradumankumar B. Khachar",
  role: "Historian · Author · Researcher",
  tagline:
    "Chronicling the untold stories of Saurashtra and Gujarat — preserving heritage through scholarship, one chapter at a time.",
  location: "Junagadh, Gujarat, India",
  email: "pkhachar@gmail.com",
  designation: "Associate Professor",
  institution:
    "Dr. Subhash Mahila Arts, Commerce & Home Science College, Junagadh",
  url: "https://praduman-khachar.vercel.app",
};

export const STATS: StatItem[] = [
  { number: "33", label: "Books Published" },
  { number: "23", label: "Selected by Library of Congress, USA" },
  { number: "575+", label: "Historical Videos on YouTube" },
  { number: "33+", label: "Years in Education" },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    icon: "🏛️",
    text: "Honored by **Government of Gujarat** as a Distinguished Person of Sorath District",
  },
  {
    icon: "🏆",
    text: "**Kalatirth Surat Sanskruti Savardhan Award 2025** — for outstanding cultural contribution",
  },
  {
    icon: "🌍",
    text: "**23 books selected by Library of Congress, USA** — a rare honor for any Indian regional historian",
  },
  {
    icon: "🎖️",
    text: "**Dedicated Personality Award** from the International Human Rights Association",
  },
  {
    icon: "⚖️",
    text: "Books cited in **11 legal cases** in Gujarat courts — establishing historical precedent through scholarship",
  },
  {
    icon: "📡",
    text: "Convener, **INTACH** (Indian National Trust for Art and Cultural Heritage) — Junagadh chapter",
  },
  {
    icon: "📺",
    text: "Featured **12 times on All India Radio** and **6 times on Doordarshan** national television",
  },
  {
    icon: "✍️",
    text: "Historical columnist for **Mumbai Samachar** (2 years) and **Fulchhab** (3 years)",
  },
];

export const EDUCATION: EducationItem[] = [
  { degree: "Ph.D.", university: "M. K. Bhavnagar University", year: "2006" },
  {
    degree: "M.A. (History)",
    university: "Saurashtra University",
    year: "1991",
    grade: "First Class — 66%",
  },
  {
    degree: "B.A.",
    university: "Saurashtra University",
    year: "1989",
    grade: "First Class — 60%",
  },
];

export const CAREER: CareerItem[] = [
  {
    period: "1992 – Present",
    title: "Associate Professor",
    place: "Dr. Subhash Mahila Arts, Comm. & H. Sc. College, Junagadh",
    desc: "33+ years of undergraduate teaching in History, shaping generations of students while pursuing prolific research and authorship.",
  },
  {
    period: "1998 – 2006",
    title: "Postgraduate Faculty",
    place: "Bahauddin College, Junagadh (Government of Gujarat)",
    desc: "8 years of postgraduate-level instruction. During this time, began doctoral research and expanded publication work.",
  },
  {
    period: "2010 – Present",
    title: "Ph.D. Research Guide",
    place: "Saurashtra University",
    desc: "Guiding doctoral scholars — 4 students have successfully defended their theses, with 3 currently in progress.",
  },
  {
    period: "2013",
    title: "Minor Research Project",
    place: "Funded by University Grants Commission, Pune",
    desc: "Completed a UGC-funded research project exploring regional historical narratives of Saurashtra.",
  },
];

export const MEDIA_STATS: MediaStatItem[] = [
  { number: "575+", label: "Historical Videos Archived" },
  { number: "15+", label: "Research Articles Published" },
  { number: "25+", label: "Keynote Speeches Across India" },
];

export const SOCIALS: Social[] = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/c/PradumanKhachar",
    icon: "youtube",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/praduman_khachar/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/praduman.khachar.7",
    icon: "facebook",
  },
  {
    name: "X / Twitter",
    url: "https://x.com/KhacharPraduman",
    icon: "twitter",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/show/3QezwwyZYMk9PlSXsX0Erf",
    icon: "spotify",
  },
  {
    name: "Blog",
    url: "https://khacharpraduman6.blogspot.com/",
    icon: "blog",
  },
];

export const BOOKS: Book[] = [
  { title: "Bahauddin College: Ek Aitihasik Adhyayan", titleGu: "બહાઉદ્દીન કોલેજ", year: "2017", category: "institutional" },
  { title: "Itihas Etale Dr. Khachar", titleGu: "ઈતિહાસ એટલે ડૉ. ખાચર", category: "history" },
  { title: "Bhuchar Mori Ni Ladai", titleGu: "ભૂચર મોરીની લડાઈ", category: "battles" },
  { title: "Itihas No Aaradhak", titleGu: "ઈતિહાસનો આરાધક", category: "history" },
  { title: "Kathio Ane Kathiyavad (Vol. 3)", titleGu: "કાઠીઓ અને કાઠિયાવાડ – ભા. ૩", category: "kathi" },
  { title: "Kathio Ane Kathiyavad (Vol. 9)", titleGu: "કાઠીઓ અને કાઠિયાવાડ – ભા. ૯", category: "kathi" },
  { title: "Grantho Ane Shilalekho", titleGu: "ગ્રંથો અને શિલાલેખો", category: "epigraphy" },
  { title: "Girnar No Itihas", titleGu: "ગિરનારનો ઈતિહાસ", category: "history" },
  { title: "Kathiyavad Na Rajvio", titleGu: "કાઠિયાવાડના રાજવીઓ", category: "royals" },
  { title: "Kathiyavad Na Kathi Rajvada", titleGu: "કાઠિયાવાડના કાઠી રાજવાડા", category: "kathi" },
  { title: "Kathi Itihas Ane Sanskriti", titleGu: "કાઠી ઈતિહાસ અને સંસ્કૃતિ", category: "kathi" },
  { title: "Kathi Darbargadho", titleGu: "કાઠી દરબારગઢો", category: "kathi" },
  { title: "Kathi Darbaroni Vato", titleGu: "કાઠી દરબારોની વાતો", category: "kathi" },
  { title: "Kathio Na Anya Rajyo Sathe Sambandho", titleGu: "કાઠીઓના અન્ય રાજ્યો સાથે સંબંધો", category: "kathi" },
  { title: "Kathio Nu Sanskrutik Pradan", titleGu: "કાઠીઓનું સાંસ્કૃતિક પ્રદાન", category: "kathi" },
  { title: "Kathio Ma Pratham Kon", titleGu: "કાઠીઓમાં પ્રથમ કોણ", category: "kathi" },
  { title: "Sorath Sarkar", titleGu: "સોરઠ સરકાર", category: "governance" },
  { title: "Itihas Manjusha (Lekh Sangrah)", titleGu: "ઈતિહાસ મંજૂષા (લેખ સંગ્રહ)", category: "essays" },
  { title: "Itihas Varidhi", titleGu: "ઈતિહાસ વારિધિ", category: "history" },
  { title: "Itihas Ni Ajani Vato", titleGu: "ઈતિહાસની અજાણી વાતો", category: "history" },
  { title: "Babi Rajvansh Na Gito", titleGu: "બાબી રાજવંશના ગીતો", category: "heritage" },
  { title: "Bhule Bisre Aaine", titleGu: "ભૂલે બિસરે આઈને", category: "history" },
  { title: "Shashko Ni Vanshavalio", titleGu: "શાસકોની વંશાવળીઓ", category: "genealogy" },
  { title: "Swaminarayan Ane Kathi Darbaro", titleGu: "સ્વામિનારાયણ અને કાઠી દરબારો", category: "religion" },
  { title: "Tavarikh (Lekh Sangrah)", titleGu: "તવારીખ (લેખ સંગ્રહ)", category: "essays" },
  { title: "Prachin Bharat Na Videshi Yatri", titleGu: "પ્રાચીન ભારતના વિદેશી યાત્રી", category: "history" },
  { title: "Darbar Gopaldas", titleGu: "દરબાર ગોપાળદાસ", category: "biography" },
  { title: "Gir Somnath", titleGu: "ગીર સોમનાથ", category: "history" },
  { title: "Sahitya Ne Itihas", titleGu: "સાહિત્ય ને ઈતિહાસ", category: "literature" },
  { title: "Sardar And Junagadh", titleGu: "સરદાર અને જૂનાગઢ", category: "freedom" },
  { title: "Zulta Minara", titleGu: "ઝૂલતા મિનારા", category: "architecture" },
  { title: "Rajputo Ni Vato", titleGu: "રાજપૂતોની વાતો", category: "royals" },
  { title: "Muslim Samaj Ni Vato", titleGu: "મુસ્લિમ સમાજની વાતો", category: "society" },
];

export const BOOK_CATEGORIES: BookCategory = {
  kathi: "Kathi History",
  history: "Regional History",
  royals: "Royal Heritage",
  battles: "Historical Battles",
  governance: "Governance & State",
  heritage: "Cultural Heritage",
  epigraphy: "Inscriptions & Texts",
  essays: "Essay Collections",
  biography: "Biographical",
  genealogy: "Genealogy",
  religion: "Religion & Society",
  literature: "Literature & History",
  freedom: "Freedom Movement",
  architecture: "Architecture",
  society: "Social History",
  institutional: "Institutional History",
};

// All playlists from @PradumanKhachar YouTube channel
// Playlist IDs to be added when available — currently links go to /playlists page
export const PLAYLISTS: Playlist[] = [
  // ── Royal Dynasties & States ──────────────────────
  { title: "જૂનાગઢ રાજ્ય", titleEn: "Junagadh State", count: 43, emoji: "🏰", category: "states" },
  { title: "ભાવનગર રાજ્ય સંગ્રહ", titleEn: "Bhavnagar State Archives", count: 59, emoji: "📜", category: "states" },
  { title: "ગોહેલ રાજ્ય", titleEn: "Gohel Dynasty", count: 26, emoji: "⚔️", category: "states" },
  { title: "જોડેજ રાજ્ય", titleEn: "Jodej State", count: 14, emoji: "🏯", category: "states" },
  { title: "પોરબંદર રાજ્ય — જેઠવા સ્ટેટ", titleEn: "Porbandar – Jethva State", count: 12, emoji: "🌊", category: "states" },
  { title: "ઝાલા રાજ્ય", titleEn: "Zala State", count: 5, emoji: "⚜️", category: "states" },
  { title: "પાળિતાણા", titleEn: "Palitana", count: 2, emoji: "🕌", category: "states" },
  { title: "માળાવ‌દ‌ર સ્ટેટ", titleEn: "Manavadar State", count: 7, emoji: "🏛️", category: "states" },
  { title: "વળવાળ વિશે", titleEn: "About Valval", count: 6, emoji: "🏘️", category: "states" },

  // ── Kathi History ──────────────────────────────────
  { title: "કાઠી દરબારો", titleEn: "Kathi Darbars", count: 73, emoji: "🛡️", category: "kathi" },
  { title: "કઠિ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ — અ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ સ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Kathiyavad Na Raj Satta", count: 7, emoji: "👑", category: "kathi" },

  // ── Sacred Sites & Heritage ────────────────────────
  { title: "ગિરનારનો ઈતિહાસ", titleEn: "History of Girnar", count: 16, emoji: "⛰️", category: "heritage" },
  { title: "ચૂ‌‌‌‌‌‌ ચૂ‌‌‌‌‌‌ ‌‌ સ‌‌‌‌‌‌ — ‌‌‌‌‌‌‌‌‌‌‌ સ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Yug Yugin Somnath", count: 14, emoji: "🕉️", category: "heritage" },
  { title: "ધ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ સ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Dharm Sthano (Religion)", count: 21, emoji: "🙏", category: "heritage" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ (Jadeshwar Mahadev)", titleEn: "Jadeshwar Mahadev", count: 27, emoji: "📿", category: "heritage" },

  // ── Freedom Movement ───────────────────────────────
  { title: "ભ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ — ‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "India's Freedom Struggle", count: 20, emoji: "🏳️", category: "freedom" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Maha Gujarat Aandolan", count: 2, emoji: "✊", category: "freedom" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Non-Cooperation Movement", count: 20, emoji: "🕊️", category: "freedom" },

  // ── Social & Regional History ──────────────────────
  { title: "ગ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Gam Namno Itihas (Village Histories)", count: 14, emoji: "🏡", category: "regional" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ — ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "125 Varsh Pahelanu Rajkot", count: 87, emoji: "🏙️", category: "regional" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Aitihasik Kafodio (Historical Anecdotes)", count: 10, emoji: "📖", category: "regional" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌ ‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Vaar Ramvada – Vavda", count: 6, emoji: "🎶", category: "regional" },

  // ── Research & Academia ────────────────────────────
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Itihas na Mavar se (History Beyond)", count: 16, emoji: "🔬", category: "academic" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Ph.D. Resources", count: 12, emoji: "🎓", category: "academic" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Pustik Parichay (Book Reviews)", count: 6, emoji: "📚", category: "academic" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Itihas nu Parichay Historian", count: 6, emoji: "🧑‍🏫", category: "academic" },

  // ── Folk Culture & Media ───────────────────────────
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Lokkalani Vato – Mumbai Samachar", count: 31, emoji: "🎨", category: "folk" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Interview by Praduman Khachar", count: 7, emoji: "🎤", category: "folk" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Mamami ane Korona (Society & COVID)", count: 4, emoji: "🦠", category: "folk" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Maro Parichay / My Information", count: 5, emoji: "👤", category: "folk" },

  // ── Special ────────────────────────────────────────
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Kanda Bhu — Major Historical Series", count: 38, emoji: "🗺️", category: "special" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Sardar Patel's Jamnagar Pravachan", count: 9, emoji: "🎙️", category: "special" },
  { title: "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌", titleEn: "Prashashtak Pramasho", count: 6, emoji: "📜", category: "special" },
];

export const PLAYLIST_CATEGORIES: Record<string, string> = {
  states: "Royal States & Dynasties",
  kathi: "Kathi History",
  heritage: "Sacred Sites & Heritage",
  freedom: "Freedom Movement",
  regional: "Regional & Social History",
  academic: "Research & Academia",
  folk: "Folk Culture & Media",
  special: "Special Series",
};

