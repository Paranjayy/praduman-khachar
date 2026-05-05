// ── Shared domain types ──────────────────────────────────────────

export interface Book {
  title: string;
  titleGu?: string;
  year?: string;
  category: string;
  locSelected?: boolean; // true = selected by Library of Congress
  isbn?: string;
  pages?: number;
  imageUrl?: string;
  description?: string;
  publisher?: string;
  price?: string;
  themeColor?: string;
  fontFamily?: string;
}

export interface SITE_INFO {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  designation: string;
  institution: string;
  tagline?: string;
}

export interface Achievement {
  icon: string;
  text: string;
}

export interface CareerItem {
  period: string;
  title: string;
  place: string;
  desc?: string;
}

export interface EducationItem {
  degree: string;
  university: string;
  year: string;
  grade?: string;
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface MediaStatItem {
  number: string;
  label: string;
}

export interface BookCategory {
  [key: string]: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  designation: string;
  institution: string;
  url: string;
}

export interface Playlist {
  title: string;
  titleEn: string;
  count: number;
  emoji: string;
  category: string;
  id?: string;           // YouTube playlist ID (PLxxxxxxxx)
  thumbVideoId?: string; // Video ID for thumbnail (i.ytimg.com/vi/{id}/mqdefault.jpg)
}
export interface ReadingItem {
  title: string;
  author: string;
  note?: string;      // Personal recommendation note from Dr. Khachar
  link?: string;      // Link to Archive.org or Google Books
  category: string;  // e.g. "Primary Sources", "Reference", "Literature"
}
