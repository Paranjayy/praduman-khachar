import { Achievement, Book, BookCategory, CareerItem, EducationItem, MediaStatItem, Playlist, ReadingItem, SITE_INFO, StatItem } from "../types";

export const SITE: SITE_INFO = {
  name: "Dr. Praduman Khachar",
  title: "Historian, Author, Researcher",
  bio: "Chronicling the untold stories of Saurashtra and Gujarat — preserving heritage through scholarship, one chapter at a time.",
  location: "Junagadh, Gujarat",
  email: "pkhachar@gmail.com",
  designation: "Associate Professor & PhD Guide",
  institution: "Dr. Subhash Mahila Arts, Comm. & Home Science College, Junagadh",
};

export const SOCIAL_STATS = {
  instagram: {
    posts: "1.2k+",
    followers: "45k+",
    recentPosts: [
      { id: "1", type: "photo", url: "https://instagram.com", preview: "https://picsum.photos/300/300?random=11" },
      { id: "2", type: "video", url: "https://instagram.com", preview: "https://picsum.photos/300/300?random=12" },
      { id: "3", type: "photo", url: "https://instagram.com", preview: "https://picsum.photos/300/300?random=13" },
    ]
  },
  facebook: {
    followers: "120k+",
    likes: "98k+",
    recentPosts: [
      { id: "1", text: "New lecture series on the history of Saurashtra is now live.", date: "2 days ago" },
      { id: "2", text: "Discussing the architecture of the Palitana temples.", date: "1 week ago" },
    ]
  }
};

export const SOCIALS = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@PradumanKhachar",
    icon: "youtube",
    stats: "485+ Videos",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/dr_pradumankhachar/",
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
  { 
    title: "Kathi Itihas Ane Sanskriti", 
    titleGu: "કાઠી ઈતિહાસ અને સંસ્કૃતિ", 
    year: "1997", 
    category: "kathi", 
    locSelected: true, 
    publisher: "દેવેન્દ્રભાઈ બી. ખાચર, સણોસરા", 
    price: "અપ્રાપ્ય",
    isbn: "978-81-9005-01-1",
    pages: 420,
    description: "A comprehensive study of the history, culture, and traditions of the Kathi community of Saurashtra."
  },
  { 
    title: "Prachin Bharat Na Videshi Yatri", 
    titleGu: "પ્રાચીન ભારતના વિદેશીયાત્રી", 
    year: "2000", 
    category: "history", 
    locSelected: true, 
    publisher: "સૌરાષ્ટ્ર યુનિવર્સિટી, રાજકોટ", 
    price: "અપ્રાપ્ય",
    isbn: "978-93-8123-45-2",
    pages: 310,
    description: "An analysis of historical accounts of foreign travelers who visited ancient India."
  },
  { 
    title: "Bhuchar Mori Ni Ladai", 
    titleGu: "ભૂચર મોરીની લડાઈ", 
    year: "2000", 
    category: "battles", 
    locSelected: true, 
    publisher: "જે. બી.જાડેજા, સુકી સાજડીયાળી", 
    price: "અપ્રાપ્ય",
    isbn: "978-81-7654-12-3",
    pages: 185,
    description: "A detailed military and historical analysis of the Battle of Bhuchar Mori (1591)."
  },
  { 
    title: "Itihas Suman", 
    titleGu: "ઈતિહાસ સુમન", 
    year: "2001", 
    category: "history", 
    locSelected: true, 
    publisher: "ગુ. સાહિત્ય અકાદમી, ગાંધીનગર", 
    price: "રૂ.૪૦",
    isbn: "978-81-9005-02-4",
    pages: 250,
    description: "A collection of research articles on various aspects of Gujarat's regional history."
  },
  { 
    title: "Bahauddin College: Ek Aitihasik Adhyayan", 
    titleGu: "સોરઠની વિદ્યાપીઠ બહાઉદ્દીન કોલેજ", 
    year: "2002", 
    category: "institutional", 
    locSelected: true, 
    publisher: "ડો.પ્રદ્યુમ્ન ભ.ખાચર, જૂનાગઢ", 
    price: "રૂ.૧૧૧",
    isbn: "978-93-5123-11-5",
    pages: 340,
    description: "The historical legacy and academic impact of Bahauddin College, Junagadh."
  },
  { title: "Itihas Etale ?", titleGu: "ઈતિહાસ એટલે ?", year: "2003", category: "history", locSelected: true, publisher: "પુષ્પરાજ આર. ધાધલ, સણોસરા", price: "રૂ.૧૫૦" },
  { title: "Grantho Ane Shilalekho", titleGu: "ગ્રંથો અને શિલાલેખો", year: "2003", category: "epigraphy", locSelected: true, publisher: "સૌ. કચ્છ ઈતિહાસ પરિષદ, જૂનાગઢ", price: "રૂ.૧૧" },
  { title: "Bhule Bisre Aaine", titleGu: "ભૂલે બિસરે આઈને", year: "2004", category: "history", locSelected: true, publisher: "કાઠી અભ્યુદય, જૂનાગઢ", price: "અપ્રાપ્ય" },
  { title: "Tavarikh", titleGu: "તવારીખ", year: "2004", category: "essays", locSelected: true, publisher: "ગુ. સાહિત્ય અકાદમી, ગાંધીનગર", price: "રૂ.૯૦" },
  { title: "Shashko Ni Vanshavalio", titleGu: "સૌરાષ્ટ્ર ગુજરાતના શાસકોની વંશાવળીઓ", year: "2005", category: "genealogy", locSelected: true, publisher: "સૌ. કચ્છ ઈતિહાસ પરિષદ, જૂનાગઢ", price: "રૂ.૫૬" },
  { title: "Kathiyavad Sarvasangrah", titleGu: "કાઠિયાવાડ સર્વસંગ્રહ - કર્નલ વોટસન કૃત", year: "2005", category: "history", locSelected: true, publisher: "પ્રા.સુરેશભાઈ સી.પારેખ, જૂનાગઢ", price: "રૂ.૫૦૦" },
  { title: "Kathiyavad Na Rajvio", titleGu: "કાઠિયાવાડના રાજવીઓ", year: "2005", category: "royals", locSelected: true, publisher: "પુષ્પરાજ આર. ધાધલ, સણોસરા", price: "અપ્રાપ્ય" },
  { title: "Swaminarayan Sampraday Ma Kathi Darbaro", titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન", year: "2006", category: "religion", locSelected: true, publisher: "કાઠી અભ્યુદય, જૂનાગઢ", price: "અપ્રાપ્ય" },
  { title: "Kathio Ane Kathiyavad", titleGu: "કાઠીઓ અને કાઠિયાવાડ (પીએચ.ડી.મહાનિબંધ)", year: "2006", category: "kathi", locSelected: true, publisher: "પુષ્પરાજ આર. ધાધલ, સણોસરા", price: "રૂ.૪૦૦" },
  { title: "Babi Rajvansh Na Gito", titleGu: "બાબી રાજવંશના ગીતો", year: "2007", category: "heritage", locSelected: true, publisher: "ડો.પ્રદ્યુમ્ન ભ.ખાચર, જૂનાગઢ", price: "રૂ.૪૦" },
  { title: "Itihas Manjusha", titleGu: "ઈતિહાસ મંજૂષા", year: "2008", category: "essays", locSelected: true, publisher: "ગુ. સાહિત્ય અકાદમી, ગાંધીનગર", price: "રૂ.૭૦" },
  { title: "Dr. Shambhuprasad Desai", titleGu: "શતદલ વ્યક્તિત્વ ડૉ.શંભુપ્રસાદ દેસાઈ", year: "2008", category: "biography", locSelected: true, publisher: "સૌ. કચ્છ ઈતિહાસ પરિષદ, જૂનાગઢ", price: "—" },
  { title: "Girnar No Itihas", titleGu: "ગિરનારનો ઈતિહાસ", year: "2009", category: "history", locSelected: true, publisher: "ડો.પ્રદ્યુમ્ન ભ.ખાચર, જૂનાગઢ", price: "રૂ.૩૦૦" },
  { title: "Saurashtra No Gauravvanto Itihas", titleGu: "સૌરાષ્ટ્રનો ગૌરવવંતો ઈતિહાસ", year: "2010", category: "history", locSelected: true, publisher: "પ્રવીણ પ્રકાશન, રાજકોટ", price: "અપ્રાપ્ય" },
  { title: "Tasviroma Junagadh", titleGu: "તસવીરોમાં જૂનાગઢ", year: "2011", category: "history", locSelected: true, publisher: "પ્રવીણ પ્રકાશન, રાજકોટ", price: "રૂ.૭૫૦" },
  { title: "Sorath Sarkar", titleGu: "સોરઠ સરકાર નવાબ મહાબતખાનજી", year: "2012", category: "governance", locSelected: true, publisher: "ડો.પ્રદ્યુમ્ન ભ.ખાચર, જૂનાગઢ", price: "રૂ.૨૦૦" },
  { title: "Sanshodhak Parichay", titleGu: "સંશોધક પરિચય", year: "2012", category: "history", locSelected: true, publisher: "સૌ. કચ્છ ઈતિહાસ પરિષદ, જૂનાગઢ", price: "રૂ.૫૬" },
  { title: "Gir Girnar Na Mandiro", titleGu: "ગિર ગિરનારના મંદિરો", year: "2013", category: "architecture", locSelected: true, publisher: "કલેકટર કચેરી, જૂનાગઢ", price: "અમૂલ્ય" },
  { title: "Itihas Ni Ajani Vato", titleGu: "ઈતિહાસની અજાણી વાતો", year: "2015", category: "history", publisher: "સૌરાષ્ટ્ર યુનિવર્સિટી, રાજકોટ", price: "અપ્રાપ્ય" },
  { title: "Itihas Varidhi", titleGu: "ઈતિહાસ વારિધિ", year: "2016", category: "history", publisher: "સૌરાષ્ટ્ર યુનિવર્સિટી, રાજકોટ", price: "રૂ.૭૦" },
  { title: "Swaminarayan Sampraday (Revised)", titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન (સંવર્ધિત આવૃત્તિ)", year: "2017", category: "religion", publisher: "ડો.પ્રદ્યુમ્ન ભ.ખાચર, જૂનાગઢ", price: "રૂ.૧૨૦" },
  { title: "Kathio No Itihas", titleGu: "કાઠીઓનો ઈતિહાસ (ગુજરાતી) કર્નલ વોટસન કૃત", year: "2019", category: "kathi", publisher: "ડૉ.પ્રદ્યુમ્ન ખાચર જૂનાગઢ", price: "રૂ. ૧૫૦" },
  { title: "History of Kathi", titleGu: "હિસ્ટ્રી ઓફ કાઠી (અંગ્રેજી) કર્નલ વોટસન કૃત", year: "2019", category: "kathi", publisher: "ડૉ.પ્રદ્યુમ્ન ખાચર જૂનાગઢ", price: "રૂ. ૨૦૦" },
  { title: "Saurashtra Na Prasiddh Rajvio", titleGu: "સૌરાષ્ટ્રના પ્રસિદ્ધ રાજવીઓ", year: "2020", category: "royals", publisher: "યુનિવર્સીટી ગ્રંથ નિર્માણ બોર્ડ", price: "રૂ.૧૬૦" },
  { title: "Gir Somnath Historical Places", titleGu: "ગિર સોમનાથ જીલ્લાના ઐતિહાસિક સ્થળો", year: "2020", category: "history", publisher: "ડાયેટ જૂનાગઢ", price: "અમૂલ્ય" },
  { title: "Kathiyavad Ni Rasdhar", titleGu: "કાઠિયાવાડની રસધાર", year: "2021", category: "literature", publisher: "નવયુગ પુસ્તક ભંડાર રાજકોટ", price: "રૂ.૪૦૦" },
  { title: "Sorath Ane Barda Region History", titleGu: "સોરઠ અને બરડા પ્રદેશનો ઈતિહાસ", year: "2022", category: "history", publisher: "પ્રાચ્યવિદ્યા મંદિર વડોદરા", price: "રૂ.૮૪૪" },
  { title: "Itihas Ni Atarie Thi", titleGu: "ઈતિહાસની અટારીએથી", year: "2024", category: "history", publisher: "નવયુગ પુસ્તક ભંડાર રાજકોટ", price: "રૂ.૧૪૦૦" },
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

export const PLAYLISTS: Playlist[] = [
  { title: "જૂનાગઢ રાજ્ય", titleEn: "Junagadh State", count: 43, emoji: "🏰", category: "states" },
  { title: "ભાવનગર રાજ્ય સંગ્રહ", titleEn: "Bhavnagar State Archives", count: 59, emoji: "📜", category: "states" },
  { title: "ગોહેલ રાજ્ય", titleEn: "Gohel Dynasty", count: 26, emoji: "⚔️", category: "states" },
  { title: "જોડેજ રાજ્ય", titleEn: "Jodej State", count: 14, emoji: "🏯", category: "states" },
  { title: "પોરબંદર રાજ્ય — જેઠવા સ્ટેટ", titleEn: "Porbandar – Jethva State", count: 12, emoji: "🌊", category: "states" },
  { title: "ઝાલા રાજ્ય", titleEn: "Zala State", count: 5, emoji: "⚜️", category: "states" },
  { title: "પાળિતાણા", titleEn: "Palitana", count: 2, emoji: "🕌", category: "states" },
  { title: "માળાવ‌દ‌ર સ્ટેટ", titleEn: "Manavadar State", count: 7, emoji: "🏛️", category: "states" },
  { title: "વળવાળ વિશે", titleEn: "About Valval", count: 6, emoji: "🏘️", category: "states" },
  { title: "કાઠી દરબારો", titleEn: "Kathi Darbars", count: 73, emoji: "🛡️", category: "kathi" },
  { title: "ગિરનારનો ઈતિહાસ", titleEn: "History of Girnar", count: 16, emoji: "⛰️", category: "heritage" },
  { title: "યુગ યુગીન સોમનાથ", titleEn: "Yug Yugin Somnath", count: 14, emoji: "🕉️", category: "heritage" },
  { title: "ધર્મ સ્થાનો", titleEn: "Dharm Sthano (Religion)", count: 21, emoji: "🙏", category: "heritage" },
  { title: "જડેશ્વર મહાદેવ", titleEn: "Jadeshwar Mahadev", count: 27, emoji: "📿", category: "heritage" },
  { title: "ભારતનો સ્વતંત્ર સંગ્રામ", titleEn: "India's Freedom Struggle", count: 20, emoji: "🏳️", category: "freedom" },
  { title: "મહા ગુજરાત આંદોલન", titleEn: "Maha Gujarat Aandolan", count: 2, emoji: "✊", category: "freedom" },
  { title: "અસહકાર આંદોલન", titleEn: "Non-Cooperation Movement", count: 20, emoji: "🕊️", category: "freedom" },
  { title: "ગામ નામનો ઈતિહાસ", titleEn: "Village Histories", count: 14, emoji: "🏡", category: "regional" },
  { title: "૧૨૫ વર્ષ પહેલાનું રાજકોટ", titleEn: "125 Varsh Pahelanu Rajkot", count: 87, emoji: "🏙️", category: "regional" },
  { title: "ઐતિહાસિક કડિયો", titleEn: "Historical Anecdotes", count: 10, emoji: "📖", category: "regional" },
  { title: "વાર રામવડા - વાવડા", titleEn: "Vaar Ramvada - Vavda", count: 6, emoji: "🎶", category: "regional" },
  { title: "ઇતિહાસ ના મૌખિક સ્ત્રોતો", titleEn: "Oral Sources of History", count: 16, emoji: "🔬", category: "academic" },
  { title: "પી.એચ.ડી. માર્ગદર્શન", titleEn: "Ph.D. Guidance", count: 12, emoji: "🎓", category: "academic" },
  { title: "પુસ્તક પરિચય", titleEn: "Book Reviews", count: 6, emoji: "📚", category: "academic" },
  { title: "ઇતિહાસ નો પરિચય", titleEn: "Introduction to History", count: 6, emoji: "🧑‍🏫", category: "academic" },
  { title: "લોકકલાની વાતો - મુંબઈ સમાચાર", titleEn: "Folk Arts - Mumbai Samachar", count: 31, emoji: "🎨", category: "folk" },
  { title: "મુલાકાત - પ્રદ્યુમ્ન ખાચર", titleEn: "Interview - Praduman Khachar", count: 7, emoji: "🎤", category: "folk" },
  { title: "મામા અને કોરોના", titleEn: "Mama and Corona", count: 4, emoji: "🦠", category: "folk" },
  { title: "મારો પરિચય", titleEn: "My Introduction", count: 5, emoji: "👤", category: "folk" },
  { title: "કંડા ભૂલ્યા", titleEn: "Major Historical Series", count: 38, emoji: "🗺️", category: "special" },
  { title: "સરદાર પટેલનું જામનગર પ્રવચન", titleEn: "Sardar Patel's Jamnagar Speech", count: 9, emoji: "🎙️", category: "special" },
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

export const STATS: StatItem[] = [
  { number: "33", label: "Published Books" },
  { number: "575+", label: "Academic Videos" },
  { number: "33+", label: "Years Experience" },
  { number: "11", label: "Court Cases Cited" },
];

export const MEDIA_STATS: MediaStatItem[] = [
  { number: "42k+", label: "Subscribers" },
  { number: "575+", label: "Videos" },
  { number: "3.5M+", label: "Total Views" },
];

export const EDUCATION: EducationItem[] = [
  { degree: "Ph.D. in History", university: "M. K. Uni. Bhavnagar", year: "2006", grade: "Awarded" },
  { degree: "M.A. in History", university: "Saurashtra University", year: "1991", grade: "First Class (66%)" },
  { degree: "B.A. in History", university: "Saurashtra University", year: "1989", grade: "First Class (60%)" },
];

export const CAREER: CareerItem[] = [
  { period: "1992 – Present", title: "Associate Professor", place: "Dr. Subhash Mahila Arts, Comm. & Home Science College, Junagadh", desc: "U.G. Level Teaching (33 Years)" },
  { period: "1998 – 2006", title: "P.G. Lecturer", place: "Bahauddin College, Junagadh (Govt. of Gujarat)", desc: "P.G. Level Teaching (8 Years)" },
  { period: "2010 – Present", title: "Convener", place: "INTACH Junagadh Chapter", desc: "Heritage Conservation & Documentation" },
  { period: "Present", title: "Ph.D. Guide", place: "Saurashtra University", desc: "Guided 4 Ph.D. scholars, 3 currently under guidance" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { icon: "🏛️", text: "Convener of **INTACH** Junagadh Chapter" },
  { icon: "📜", text: "Author of **33+ Books** and **15 Research Articles** on Gujarat History" },
  { icon: "⚖️", text: "Books cited in **11 High Court cases** involving historical heritage" },
  { icon: "🌍", text: "Recognized by **Library of Congress**, USA (23 Books Selected)" },
  { icon: "🏆", text: "Recipient of **Kalatirth Surat Sanskruti Savardhan** Award 2025" },
  { icon: "🎓", text: "Honored by **Govt. of Gujarat** as a Distinguished person of Sorath District" },
  { icon: "❤️", text: "Dedicated Personality Award from **International Human Rights Association**" },
  { icon: "🎙️", text: "Expert Speaker at **AIR (12 times)** and **Doordarshan (6 times)**" },
  { icon: "✍️", text: "Regular Columnist for **Mumbai Samachar** and **Fulchhab**" },
  { icon: "🎨", text: "Curator of **Exhibitions** showcasing historical pictures across Gujarat" },
];
