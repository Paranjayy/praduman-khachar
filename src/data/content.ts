import { Achievement, Book, BookCategory, CareerItem, EducationItem, MediaStatItem, Playlist, ReadingItem, SITE_INFO, StatItem } from "../types";

export const SITE: SITE_INFO = {
  name: "Dr. Praduman Khachar",
  title: "Historian, Author, Researcher",
  bio: "Chronicling the untold stories of Saurashtra and Gujarat — preserving heritage through scholarship, one chapter at a time.",
  location: "Junagadh, Gujarat",
  email: "pkhachar@gmail.com",
  designation: "Associate Professor & PhD Guide",
  institution: "Dr. Subhash Mahila Arts, Comm. & Home Science College, Junagadh",
  tagline: "Preserving the legacy of Saurashtra through scholarly research and storytelling.",
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
    publisher: "Devendrabhai B. Khachar, Sanosara", 
    price: "Out of print",
    isbn: "978-81-9005-01-1",
    pages: 420,
    description: "A comprehensive study of the history, culture, and traditions of the Kathi community of Saurashtra. This foundational work covers the origins, customs, and historical significance of the Kathi people.",
    themeColor: "#c5a55a",
    imageUrl: "/books/covers/kathi-itihas-ane-sanskriti.jpg"
  },
  { 
    title: "Prachin Bharat Na Videshi Yatri", 
    titleGu: "પ્રાચીન ભારતના વિદેશીયાત્રી", 
    year: "2000", 
    category: "history", 
    locSelected: true, 
    publisher: "Saurashtra University, Rajkot", 
    price: "Out of print",
    isbn: "978-93-8123-45-2",
    pages: 310,
    description: "An analysis of historical accounts of foreign travelers who visited ancient India. Examines the observations of Greek, Chinese, and Arab travelers about Indian civilization.",
    themeColor: "#8a7b5a",
    imageUrl: "/books/covers/prachin-bharat-na-videshi-yatri.jpg"
  },
  { 
    title: "Bhuchar Mori Ni Ladai", 
    titleGu: "ભૂચર મોરીની લડાઈ", 
    year: "2000", 
    category: "battles", 
    locSelected: true, 
    publisher: "J.B. Jadeja, Suki Sajdiyali", 
    price: "Out of print",
    isbn: "978-81-7654-12-3",
    pages: 185,
    description: "A detailed military and historical analysis of the Battle of Bhuchar Mori (1591), one of the most significant conflicts in Saurashtra's history.",
    themeColor: "#7a6a5a",
    imageUrl: "/books/covers/bhuchar-mori-ni-ladai.jpg"
  },
  { 
    title: "Itihas Suman", 
    titleGu: "ઈતિહાસ સુમન", 
    year: "2001", 
    category: "history", 
    locSelected: true, 
    publisher: "Gujarat Sahitya Akademi, Gandhinagar", 
    price: "₹40",
    isbn: "978-81-9005-02-4",
    pages: 250,
    description: "A collection of research articles on various aspects of Gujarat's regional history, published by the Gujarat Sahitya Akademi.",
    imageUrl: "/books/covers/itihas-suman.jpg"
  },
  { 
    title: "Bahauddin College: Ek Aitihasik Adhyayan", 
    titleGu: "સોરઠની વિદ્યાપીઠ બહાઉદ્દીન કોલેજ", 
    year: "2002", 
    category: "institutional", 
    locSelected: true, 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹111",
    isbn: "978-93-5123-11-5",
    pages: 340,
    description: "The historical legacy and academic impact of Bahauddin College, Junagadh. A comprehensive institutional history spanning decades.",
    imageUrl: "/books/covers/bahauddin-college.jpg"
  },
  { 
    title: "Itihas Etale ?", 
    titleGu: "ઈતિહાસ એટલે ?", 
    year: "2003", 
    category: "history", 
    locSelected: true, 
    publisher: "Pushparaj R. Dhadhal, Sanosara", 
    price: "₹150",
    description: "An accessible exploration of what history means and its relevance to contemporary society.",
    imageUrl: "/books/covers/itihas-etale.jpg" 
  },
  { 
    title: "Grantho Ane Shilalekho", 
    titleGu: "ગ્રંથો અને શિલાલેખો", 
    year: "2003", 
    category: "epigraphy", 
    locSelected: true, 
    publisher: "Saurashtra-Kutch Itihas Parishad, Junagadh", 
    price: "₹11",
    description: "A study of ancient manuscripts and inscriptions from the Saurashtra region, documenting historical texts and their significance.",
    imageUrl: "/books/covers/grantho-ane-shilalekho.jpg" 
  },
  { 
    title: "Bhule Bisre Aaine", 
    titleGu: "ભૂલે બિસરે આઈને", 
    year: "2004", 
    category: "history", 
    locSelected: true, 
    publisher: "Kathi Abhyudaya, Junagadh", 
    price: "Out of print",
    description: "Rediscovering forgotten historical narratives and cultural heritage of the Saurashtra region.",
    imageUrl: "/books/covers/bhule-bisre-aaine.jpg" 
  },
  { 
    title: "Tavarikh", 
    titleGu: "તવારીખ", 
    year: "2004", 
    category: "essays", 
    locSelected: true, 
    publisher: "Gujarat Sahitya Akademi, Gandhinagar", 
    price: "₹90",
    description: "A collection of essays on historical themes, published by the Gujarat Sahitya Akademi.",
    imageUrl: "/books/covers/tavarikh.jpg" 
  },
  { 
    title: "Shashko Ni Vanshavalio", 
    titleGu: "સૌરાષ્ટ્ર ગુજરાતના શાસકોની વંશાવળીઓ", 
    year: "2005", 
    category: "genealogy", 
    locSelected: true, 
    publisher: "Saurashtra-Kutch Itihas Parishad, Junagadh", 
    price: "₹56",
    description: "Genealogical records of rulers of Saurashtra and Gujarat, documenting royal lineages and succession.",
    imageUrl: "/books/covers/shashko-ni-vanshavalio.jpg" 
  },
  { 
    title: "Kathiyavad Sarvasangrah", 
    titleGu: "કાઠિયાવાડ સર્વસંગ્રહ - કર્નલ વોટસન કૃત", 
    year: "2005", 
    category: "history", 
    locSelected: true, 
    publisher: "Pr. Sureshbhai C. Parekh, Junagadh", 
    price: "₹500",
    description: "Gujarati translation/edition of Colonel Watson's comprehensive work on Kathiawad, a foundational historical text.",
    imageUrl: "/books/covers/kathiyavad-sarvasangrah.jpg" 
  },
  { 
    title: "Kathiyavad Na Rajvio", 
    titleGu: "કાઠિયાવાડના રાજવીઓ", 
    year: "2005", 
    category: "royals", 
    locSelected: true, 
    publisher: "Pushparaj R. Dhadhal, Sanosara", 
    price: "Out of print",
    description: "A study of the royals of Kathiawad, covering the princely states and their rulers.",
    imageUrl: "/books/covers/kathiyavad-na-rajvio.jpg" 
  },
  { 
    title: "Swaminarayan Sampraday Ma Kathi Darbaro", 
    titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન", 
    year: "2006", 
    category: "religion", 
    locSelected: true, 
    publisher: "Kathi Abhyudaya, Junagadh", 
    price: "Out of print",
    description: "The contribution of Kathi royals to the Swaminarayan tradition, documenting their patronage and involvement.",
    imageUrl: "/books/covers/swaminarayan-sampraday.jpg" 
  },
  { 
    title: "Kathio Ane Kathiyavad", 
    titleGu: "કાઠીઓ અને કાઠિયાવાડ (પીએચ.ડી.મહાનિબંધ)", 
    year: "2006", 
    category: "kathi", 
    locSelected: true, 
    publisher: "Pushparaj R. Dhadhal, Sanosara", 
    price: "₹400",
    description: "Dr. Khachar's PhD thesis — 'The Kathis and Kathiawad.' The foundational academic work on Kathi history and culture.",
    imageUrl: "/books/covers/kathio-ane-kathiyavad.jpg" 
  },
  { 
    title: "Babi Rajvansh Na Gito", 
    titleGu: "બાબી રાજવંશના ગીતો", 
    year: "2007", 
    category: "heritage", 
    locSelected: true, 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹40",
    description: "Songs of the Babi royal dynasty, preserving the musical and cultural heritage of the Babi rulers.",
    imageUrl: "/books/covers/babi-rajvansh-na-gito.jpg" 
  },
  { 
    title: "Itihas Manjusha", 
    titleGu: "ઈતિહાસ મંજૂષા", 
    year: "2008", 
    category: "essays", 
    locSelected: true, 
    publisher: "Gujarat Sahitya Akademi, Gandhinagar", 
    price: "₹70",
    description: "A collection of historical essays published by the Gujarat Sahitya Akademi.",
    imageUrl: "/books/covers/itihas-manjusha.jpg" 
  },
  { 
    title: "Dr. Shambhuprasad Desai", 
    titleGu: "શતદલ વ્યક્તિત્વ ડૉ.શંભુપ્રસાદ દેસાઈ", 
    year: "2008", 
    category: "biography", 
    locSelected: true, 
    publisher: "Saurashtra-Kutch Itihas Parishad, Junagadh", 
    price: "—",
    description: "A centenary tribute biography of Dr. Shambhuprasad Desai, documenting his contributions to scholarship.",
    imageUrl: "/books/covers/dr-shambhuprasad-desai.jpg" 
  },
  { 
    title: "Girnar No Itihas", 
    titleGu: "ગિરનારનો ઈતિહાસ", 
    year: "2009", 
    category: "history", 
    locSelected: true, 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹300",
    description: "The history of Mount Girnar, one of the most sacred and historically significant mountains in Gujarat.",
    imageUrl: "/books/covers/girnar-no-itihas.jpg",
    purchaseLinks: [
      { store: "GujaratBookshelf", url: "https://gujaratbookshelf.com", price: "₹540" }
    ]
  },
  { 
    title: "Saurashtra No Gauravvanto Itihas", 
    titleGu: "સૌરાષ્ટ્રનો ગૌરવવંતો ઈતિહાસ", 
    year: "2010", 
    category: "history", 
    locSelected: true, 
    publisher: "Pravin Prakashan, Rajkot", 
    price: "Out of print",
    description: "The glorious history of Saurashtra, covering major historical events and figures.",
    imageUrl: "/books/covers/saurashtra-no-gauravvanto-itihas.jpg"
  },
  { 
    title: "Tasviroma Junagadh", 
    titleGu: "તસવીરોમાં જૂનાગઢ", 
    year: "2011", 
    category: "history", 
    locSelected: true, 
    publisher: "Pravin Prakashan Pvt. Ltd, Rajkot", 
    price: "₹750",
    isbn: "978-81-7790-479-6",
    pages: 280,
    description: "A pictorial history of ancient and modern Junagadh. Co-authored with Dr. Dhirubhai Vala. Features 4 B/W illustrations.",
    imageUrl: "/books/covers/tasviroma-junagadh.jpg",
    purchaseLinks: [
      { store: "GujaratBookshelf", url: "https://gujaratbookshelf.com", price: "₹675" },
      { store: "Exotic India Art", url: "https://exoticindiaart.com", price: "$44" }
    ]
  },
  { 
    title: "Sorath Sarkar", 
    titleGu: "સોરઠ સરકાર નવાબ મહાબતખાનજી", 
    year: "2012", 
    category: "governance", 
    locSelected: true, 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹200",
    description: "Governance of the Sorath State under Nawab Mahabat Khanji, documenting administrative history.",
    imageUrl: "/books/covers/sorath-sarkar.jpg" 
  },
  { 
    title: "Sanshodhak Parichay", 
    titleGu: "સંશોધક પરિચય", 
    year: "2012", 
    category: "history", 
    locSelected: true, 
    publisher: "Saurashtra-Kutch Itihas Parishad, Junagadh", 
    price: "₹56",
    description: "Introduction to historical research methodology, a guide for aspiring historians.",
    imageUrl: "/books/covers/sanshodhak-parichay.jpg" 
  },
  { 
    title: "Gir Girnar Na Mandiro", 
    titleGu: "ગિર ગિરનારના મંદિરો", 
    year: "2013", 
    category: "architecture", 
    locSelected: true, 
    publisher: "Collector's Office, Junagadh", 
    price: "Priceless",
    description: "Temples of Girnar and Gir region, documenting the architectural heritage of the area.",
    imageUrl: "/books/covers/gir-girnar-na-mandiro.jpg" 
  },
  { 
    title: "Itihas Ni Ajani Vato", 
    titleGu: "ઈતિહાસની અજાણી વાતો", 
    year: "2015", 
    category: "history", 
    publisher: "Saurashtra University, Rajkot", 
    price: "Out of print",
    description: "Unknown facts and stories from history, revealing hidden narratives of the past.",
    imageUrl: "/books/covers/itihas-ni-ajani-vato.jpg" 
  },
  { 
    title: "Itihas Varidhi", 
    titleGu: "ઈતિહાસ વારિધિ", 
    year: "2016", 
    category: "history", 
    publisher: "Saurashtra University, Rajkot", 
    price: "₹70",
    description: "Ocean of History — a collection of historical essays covering diverse topics.",
    imageUrl: "/books/covers/itihas-varidhi.jpg" 
  },
  { 
    title: "Swaminarayan Sampraday (Revised)", 
    titleGu: "સ્વામિનારાયણ સંપ્રદાયમાં કાઠી દરબારોનું પ્રદાન (સંવર્ધિત આવૃત્તિ)", 
    year: "2017", 
    category: "religion", 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹120",
    description: "Revised and enlarged edition of the 2006 work on Kathi contributions to the Swaminarayan tradition.",
    imageUrl: "/books/covers/swaminarayan-sampraday-revised.jpg" 
  },
  { 
    title: "Kathio No Itihas", 
    titleGu: "કાઠીઓનો ઈતિહાસ (ગુજરાતી) કર્નલ વોટસન કૃત", 
    year: "2019", 
    category: "kathi", 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹150",
    description: "Gujarati translation of Colonel Watson's 'History of Kathi', a foundational text on Kathi history.",
    imageUrl: "/books/covers/kathio-no-itihas.jpg" 
  },
  { 
    title: "History of Kathi", 
    titleGu: "હિસ્ટ્રી ઓફ કાઠી (અંગ્રેજી) કર્નલ વોટસન કૃત", 
    year: "2019", 
    category: "kathi", 
    publisher: "Dr. Pradumankumar B. Khachar, Junagadh", 
    price: "₹200",
    description: "English translation/edition of Colonel Watson's 'History of Kathi', making this work accessible to English readers.",
    imageUrl: "/books/covers/history-of-kathi.jpg" 
  },
  { 
    title: "Saurashtra Na Prasiddh Rajvio", 
    titleGu: "સૌરાષ્ટ્રના પ્રસિદ્ધ રાજવીઓ", 
    year: "2020", 
    category: "royals", 
    publisher: "University Granth Nirman Board", 
    price: "₹160",
    description: "Famous royals of Saurashtra, documenting the lives and legacies of prominent rulers.",
    imageUrl: "/books/covers/saurashtra-na-prasiddh-rajvio.jpg" 
  },
  { 
    title: "Gir Somnath Historical Places", 
    titleGu: "ગિર સોમનાથ જીલ્લાના ઐતિહાસિક સ્થળો", 
    year: "2020", 
    category: "history", 
    publisher: "DIET Junagadh", 
    price: "Priceless",
    description: "Historical places of Gir Somnath district, a comprehensive guide to the region's heritage sites.",
    imageUrl: "/books/covers/gir-somnath-historical-places.jpg" 
  },
  { 
    title: "Kathiyavad Ni Rasdhar", 
    titleGu: "કાઠિયાવાડની રસધાર", 
    year: "2021", 
    category: "literature", 
    publisher: "Navayug Pustak Bhandar, Rajkot", 
    price: "₹400",
    pages: 320,
    asin: "B098M7HMYC",
    description: "99 stories covering love stories, valor tales, saint stories, historical narratives, and sacrifice tales of Kathiawad.",
    imageUrl: "/books/covers/kathiyavad-ni-rasdhar.jpg",
    purchaseLinks: [
      { store: "Amazon.in", url: "https://www.amazon.in/dp/B098M7HMYC", price: "₹455" },
      { store: "GujaratBookshelf", url: "https://gujaratbookshelf.com", price: "₹360" }
    ]
  },
  { 
    title: "Sorath Ane Barda Region History", 
    titleGu: "સોરઠ અને બરડા પ્રદેશનો ઈતિહાસ", 
    year: "2022", 
    category: "history", 
    publisher: "Prachyavidya Mandir, Vadodara", 
    price: "₹844",
    description: "History of the Sorath and Barda regions, documenting the historical development of these areas.",
    imageUrl: "/books/covers/sorath-ane-barda-region.jpg" 
  },
  { 
    title: "Itihas Ni Atarie Thi", 
    titleGu: "ઈતિહાસની અટારીએથી", 
    year: "2024", 
    category: "history", 
    publisher: "Navayug Pustak Bhandar, Rajkot", 
    price: "₹1,400",
    description: "From the Attic of History — uncovering hidden historical narratives and forgotten stories.",
    imageUrl: "/books/covers/itihas-ni-atarie-thi.jpg",
    purchaseLinks: [
      { store: "GujaratBookshelf", url: "https://gujaratbookshelf.com", price: "₹1,260" }
    ]
  },
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
