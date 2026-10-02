import {
  Mic2,
  Disc,
  Music,
  Headphones,
  GraduationCap,
  Palette,
  Film,
  PenLine,
  Code2,
  Shirt,
  Briefcase,
  Compass,
  type LucideIcon
} from 'lucide-react';

export interface CategoryStyle {
  icon: LucideIcon;
  gradient: string;
  pillBg: string;
  pillText: string;
}

export const getCategoryConfig = (category: string): CategoryStyle => {
  const cat = (category || '').toLowerCase().trim();

  if (cat === 'all' || cat === 'all gigs' || cat === 'all categories') {
    return {
      icon: Compass,
      gradient: 'from-purple-500/20 via-indigo-600/15 to-brand-purple/25 text-brand-purple dark:text-brand-purple-light',
      pillBg: 'bg-brand-purple/10 dark:bg-brand-purple/20 border-brand-purple/20',
      pillText: 'text-brand-purple dark:text-brand-purple-light'
    };
  }

  if (cat.includes('performance') || cat.includes('live')) {
    return {
      icon: Mic2,
      gradient: 'from-purple-500/20 via-purple-600/15 to-indigo-500/25 text-purple-600 dark:text-purple-400',
      pillBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/50 dark:border-purple-800/40',
      pillText: 'text-purple-700 dark:text-purple-300'
    };
  }

  if (cat.includes('studio')) {
    return {
      icon: Disc,
      gradient: 'from-blue-500/20 via-indigo-600/15 to-violet-500/25 text-blue-600 dark:text-blue-400',
      pillBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/50 dark:border-blue-800/40',
      pillText: 'text-blue-700 dark:text-blue-300'
    };
  }

  if (cat.includes('production') || cat.includes('producer')) {
    return {
      icon: Disc,
      gradient: 'from-fuchsia-500/20 via-pink-600/15 to-purple-500/25 text-fuchsia-600 dark:text-fuchsia-400',
      pillBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-200/50 dark:border-fuchsia-800/40',
      pillText: 'text-fuchsia-700 dark:text-fuchsia-300'
    };
  }

  if (cat.includes('songwriting') || cat.includes('writer')) {
    return {
      icon: Music,
      gradient: 'from-rose-500/20 via-pink-600/15 to-red-500/25 text-rose-600 dark:text-rose-400',
      pillBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/50 dark:border-rose-800/40',
      pillText: 'text-rose-700 dark:text-rose-300'
    };
  }

  if (cat.includes('mixing') || cat.includes('mastering')) {
    return {
      icon: Headphones,
      gradient: 'from-cyan-500/20 via-sky-600/15 to-blue-500/25 text-cyan-600 dark:text-cyan-400',
      pillBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/50 dark:border-cyan-800/40',
      pillText: 'text-cyan-700 dark:text-cyan-300'
    };
  }

  if (cat.includes('lesson') || cat.includes('teach')) {
    return {
      icon: GraduationCap,
      gradient: 'from-emerald-500/20 via-green-600/15 to-teal-500/25 text-emerald-600 dark:text-emerald-400',
      pillBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-800/40',
      pillText: 'text-emerald-700 dark:text-emerald-300'
    };
  }

  if (cat.includes('design')) {
    return {
      icon: Palette,
      gradient: 'from-amber-500/20 via-orange-600/15 to-yellow-500/25 text-amber-600 dark:text-amber-400',
      pillBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/50 dark:border-amber-800/40',
      pillText: 'text-amber-700 dark:text-amber-300'
    };
  }

  if (cat.includes('film') || cat.includes('video')) {
    return {
      icon: Film,
      gradient: 'from-red-500/20 via-rose-600/15 to-orange-500/25 text-red-600 dark:text-red-400',
      pillBg: 'bg-red-50 dark:bg-red-950/40 border-red-200/50 dark:border-red-800/40',
      pillText: 'text-red-700 dark:text-red-300'
    };
  }

  if (cat.includes('writing') || cat.includes('script')) {
    return {
      icon: PenLine,
      gradient: 'from-teal-500/20 via-emerald-600/15 to-cyan-500/25 text-teal-600 dark:text-teal-400',
      pillBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/50 dark:border-teal-800/40',
      pillText: 'text-teal-700 dark:text-teal-300'
    };
  }

  if (cat.includes('tech') || cat.includes('programming') || cat.includes('developer')) {
    return {
      icon: Code2,
      gradient: 'from-sky-500/20 via-blue-600/15 to-indigo-500/25 text-sky-600 dark:text-sky-400',
      pillBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/50 dark:border-sky-800/40',
      pillText: 'text-sky-700 dark:text-sky-300'
    };
  }

  if (cat.includes('fashion')) {
    return {
      icon: Shirt,
      gradient: 'from-pink-500/20 via-rose-600/15 to-purple-500/25 text-pink-600 dark:text-pink-400',
      pillBg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200/50 dark:border-pink-800/40',
      pillText: 'text-pink-700 dark:text-pink-300'
    };
  }

  // Other or unknown -> Briefcase icon (consistent soft purple gradient)
  return {
    icon: Briefcase,
    gradient: 'from-purple-500/20 via-indigo-600/15 to-brand-purple/25 text-brand-purple dark:text-brand-purple-light',
    pillBg: 'bg-brand-purple/10 dark:bg-brand-purple/20 border-brand-purple/20',
    pillText: 'text-brand-purple dark:text-brand-purple-light'
  };
};
