export interface Category {
  id: string;
  name: string;
  tagline: string;
  gradient: string;
  textCol: string;
  bgDecorative: string; // Tailwinds classes for pattern
  icon: string;
  image?: string; // Realistic category flatlay / book representation
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  categoryId: string;
  shortDesc: string;
  longDesc: string;
  pages: number;
  rating: number;
  year: string;
  coverGradient: string;
  published: string;
  coverImage?: string; // High-resolution rich cover image
}

export interface Author {
  id: string;
  name: string;
  genre: string;
  shortBio: string;
  longBio: string;
  avatar: string; // Initial or placeholder
  achievement: string;
  featuredBook: string;
  image?: string; // Professional portrait
}

export interface EventSession {
  id: string;
  time: string;
  title: string;
  speaker: string;
  role: string;
  location: string;
  desc: string;
}
