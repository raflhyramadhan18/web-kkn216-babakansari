export interface Member {
  id: number;
  name: string;
  nim: string;
  role: string;
  faculty: string;
  major: string;
  photo: string;
  instagram?: string;
  pin: string; // PIN rahasia anti-joki (4 digit)
}

export interface Program {
  id: number;
  title: string;
  description: string;
  category: ProgramCategory;
  icon: string;
  status: 'selesai' | 'berjalan' | 'direncanakan';
  image?: string;
  highlights?: string[];
}

export type ProgramCategory =
  | 'Pendidikan & Literasi'
  | 'Lingkungan & Pertanian'
  | 'Kesehatan Masyarakat'
  | 'Digitalisasi & Teknologi'
  | 'Ekonomi & UMKM'
  | 'Keagamaan'
  | 'Sosial & Kebudayaan'
  | 'Infrastruktur Desa';

export interface TimelineEvent {
  id: number;
  date: string;
  week: number;
  title: string;
  description: string;
  category: ProgramCategory | 'Umum';
  image?: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: ProgramCategory | 'Umum';
  caption?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  photo: string;
  quote: string;
}

export interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
}

export interface AbsensiRecord {
  nama: string;
  nim: string;
  tanggal: string;
  waktu: string;
  hariKe: number;
}
