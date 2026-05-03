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
  ReadingItem,
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
  url: "https://www.praduman.com",
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

export const SOCIAL_STATS = {
  instagram: {
    followers: "14.2K",
    posts: "1,240",
    recentPosts: [
      { id: "1", type: "video", url: "https://www.instagram.com/praduman_khachar/", thumbnail: "https://images.unsplash.com/photo-1598453412537-8cfb8ab20b32?w=500&q=80" },
      { id: "2", type: "image", url: "https://www.instagram.com/praduman_khachar/", thumbnail: "https://images.unsplash.com/photo-1621213458641-729df9e3d8f3?w=500&q=80" },
      { id: "3", type: "image", url: "https://www.instagram.com/praduman_khachar/", thumbnail: "https://images.unsplash.com/photo-1622329381656-e9e9846b0a70?w=500&q=80" }
    ]
  },
  facebook: {
    followers: "28.5K",
    likes: "21.2K",
    recentPosts: [
      { id: "f1", text: "ડૉ. પ્રદ્યુમ્ન ખાચરનું નવું પુસ્તક: 'કાઠી ક્ષત્રિયોનો ઇતિહાસ' અને વઢવાણના ૨૨૨ રજવાડાઓની વાતો...", date: "2 days ago", likes: "1.2K", comments: "124" },
      { id: "f2", text: "New archival documents discovered regarding the 1881 Vadhvan administrative treaties and their impact on modern history...", date: "5 days ago", likes: "856", comments: "45" }
    ]
  }
};

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
    name: "Facebook (Personal)",
    url: "https://www.facebook.com/praduman.khachar.7",
    icon: "facebook",
  },
  {
    name: "Facebook (Page)",
    url: "https://www.facebook.com/Praduman.Khachar62/",
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
  { title: "Kathi Itihas Ane Sanskriti", titleGu: "કાઠી ઈતિહાસ અને સંસ્કૃતિ", year: "1997", category: "kathi", locSelected: true },
  { title: "Prachin Bharat Na Videshi Yatri", titleGu: "પ્રાચીન ભારતના વિદેશીયાત્રી", year: "2000", category: "history", locSelected: true },
  { title: "Bhuchar Mori Ni Ladai", titleGu: "ભૂચર મોરીની લડાઈ", year: "2000", category: "battles", locSelected: true },
  { title: "Itihas Suman", titleGu: "ઈતિહાસ સુમન", year: "2001", category: "history", locSelected: true },
  { title: "Bahauddin College: Ek Aitihasik Adhyayan", titleGu: "સોરઠની વિદ્યાપીઠ બહાઉદ્દીન કોલેજ", year: "2002", category: "institutional", locSelected: true },
  { title: "Itihas Etale ?", titleGu: "ઈતિહાસ એટલે ?", year: "2003", category: "history", locSelected: true },
  { title: "Grantho Ane Shilalekho", titleGu: "ગ્રંથો અને શિલાલેખો", year: "2003", category: "epigraphy", locSelected: true },
  { title: "Bhule Bisre Aaine", titleGu: "ભૂલે બિસરે આઈને", year: "2004", category: "history", locSelected: true },
  { title: "Tavarikh", titleGu: "તવારીખ", year: "2004", category: "essays", locSelected: true },
  { title: "Shashko Ni Vanshavalio", titleGu: "સૌરાષ્ટ્ર ગુજરાતના શાસકોની વંશાવળીઓ", year: "2005", category: "genealogy", locSelected: true },
  { title: "Kathiyavad Sarvasangrah", titleGu: "કાઠિયાવાડ સર્વસંગ્રહ", year: "2005", category: "history", locSelected: true },
  { title: "Kathiyavad Na Rajvio", titleGu: "કાઠિયાવાડના રાજવીઓ", year: "2005", category: "royals", locSelected: true },
  { title: "Swaminarayan Sampraday Ma Kathi Darbaro", titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન", year: "2006", category: "religion", locSelected: true },
  { title: "Kathio Ane Kathiyavad", titleGu: "કાઠીઓ અને કાઠિયાવાડ", year: "2006", category: "kathi", locSelected: true },
  { title: "Babi Rajvansh Na Gito", titleGu: "બાબી રાજવંશના ગીતો", year: "2007", category: "heritage", locSelected: true },
  { title: "Itihas Manjusha", titleGu: "ઈતિહાસ મંજૂષા", year: "2008", category: "essays", locSelected: true },
  { title: "Dr. Shambhuprasad Desai", titleGu: "શતદલ વ્યક્તિત્વ ડૉ.શંભુપ્રસાદ દેસાઈ", year: "2008", category: "biography", locSelected: true },
  { title: "Girnar No Itihas", titleGu: "ગિરનારનો ઈતિહાસ", year: "2009", category: "history", locSelected: true },
  { title: "Saurashtra No Gauravvanto Itihas", titleGu: "સૌરાષ્ટ્રનો ગૌરવવંતો ઈતિહાસ", year: "2010", category: "history", locSelected: true },
  { title: "Tasviroma Junagadh", titleGu: "તસવીરોમાં જૂનાગઢ", year: "2011", category: "history", locSelected: true },
  { title: "Sorath Sarkar", titleGu: "સોરઠ સરકાર નવાબ મહાબતખાનજી", year: "2012", category: "governance", locSelected: true },
  { title: "Sanshodhak Parichay", titleGu: "સંશોધક પરિચય", year: "2012", category: "history", locSelected: true },
  { title: "Gir Girnar Na Mandiro", titleGu: "ગિર ગિરનારના મંદિરો", year: "2013", category: "architecture", locSelected: true },
  { title: "Itihas Ni Ajani Vato", titleGu: "ઈતિહાસની અજાણી વાતો", year: "2015", category: "history" },
  { title: "Itihas Varidhi", titleGu: "ઈતિહાસ વારિધિ", year: "2016", category: "history" },
  { title: "Swaminarayan Sampraday (Revised)", titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન (સંવર્ધિત)", year: "2017", category: "religion" },
  { title: "Kathio No Itihas", titleGu: "કાઠીઓનો ઈતિહાસ (ગુજરાતી)", year: "2019", category: "kathi" },
  { title: "History of Kathi", titleGu: "હિસ્ટ્રી ઓફ કાઠી (અંગ્રેજી)", year: "2019", category: "kathi" },
  { title: "Saurashtra Na Prasiddh Rajvio", titleGu: "સૌરાષ્ટ્રના પ્રસિદ્ધ રાજવીઓ", year: "2020", category: "royals" },
  { title: "Gir Somnath Historical Places", titleGu: "ગિર સોમનાથ જીલ્લાના ઐતિહાસિક સ્થળો", year: "2020", category: "history" },
  { title: "Kathiyavad Ni Rasdhar", titleGu: "કાઠિયાવાડની રસધાર", year: "2021", category: "literature" },
  { title: "Sorath Ane Barda Region History", titleGu: "સોરઠ અને બરડા પ્રદેશનો ઈતિહાસ", year: "2022", category: "history" },
  { title: "Itihas Ni Atarie Thi", titleGu: "ઈતિહાસની અટારીએથી", year: "2024", category: "history" },
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


export const READING_LIST: ReadingItem[] = [
  {
    title: "The History of Kathiawad",
    author: "Wilberforce-Bell",
    category: "reference",
    note: "A foundational text for understanding the administrative history of Saurashtra states.",
    link: "https://archive.org/details/historyofkathiaw00wilb"
  },
  {
    title: "Ras Mala",
    author: "Alexander Kinloch Forbes",
    category: "literature",
    note: "A masterpiece that captures the folk traditions and royal chronicles of Gujarat.",
    link: "https://archive.org/details/rasmalahistorica01forb"
  },
  {
    title: "Gazetteer of the Bombay Presidency: Kathiawar",
    author: "James M. Campbell",
    category: "reference",
    note: "Essential data and geographical context for any researcher of the 19th-century Saurashtra.",
    link: "https://archive.org/details/gazetteerbombay01campgoog"
  },
  {
    title: "Saurashtrani Rasdhar",
    author: "Zaverchand Meghani",
    category: "literature",
    note: "The soul of Saurashtra's oral history and folk bravery.",
  }
];

export const READING_CATEGORIES: Record<string, string> = {
  reference: "Academic & Reference",
  literature: "Historical Literature",
  primary: "Primary Sources",
};
