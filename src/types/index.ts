// ── Shared domain types ──────────────────────────────────────────

export interface Book {
  title: string;
  titleGu?: string;
  year?: string;
  category: string;
  locSelected?: boolean; // true = selected by Library of Congress
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
  title: string;       // Gujarati/original title
  titleEn: string;     // English translation
  count: number;       // video count
  emoji: string;
  category: string;    // thematic grouping
  // id only available for some — links to channel playlists page if missing
  id?: string;
}
