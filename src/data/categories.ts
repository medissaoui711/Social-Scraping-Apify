export interface PlatformCategory {
  id: string;
  name: string;
  nameAr: string;
  count: number;
  icon: string;
  color: string;
  bgGradient: string;
  badgeColor: string;
}

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    id: 'ALL',
    name: 'All Platforms',
    nameAr: 'جميع المنصات',
    count: 3268,
    icon: 'Layers',
    color: '#38BDF8',
    bgGradient: 'from-sky-500/20 to-blue-600/10',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    nameAr: 'إنستغرام',
    count: 488,
    icon: 'Instagram',
    color: '#E1306C',
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    nameAr: 'فيسبوك',
    count: 436,
    icon: 'Facebook',
    color: '#1877F2',
    bgGradient: 'from-blue-600/20 to-indigo-600/10',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    id: 'YouTube',
    name: 'YouTube',
    nameAr: 'يوتيوب',
    count: 374,
    icon: 'Youtube',
    color: '#FF0000',
    bgGradient: 'from-red-500/20 to-amber-600/10',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20'
  },
  {
    id: 'TikTok',
    name: 'TikTok / Douyin',
    nameAr: 'تيك توك / دوين',
    count: 318,
    icon: 'Video',
    color: '#00F2FE',
    bgGradient: 'from-cyan-500/20 to-fuchsia-600/10',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  {
    id: 'LinkedIn',
    name: 'LinkedIn',
    nameAr: 'لينكد إن',
    count: 262,
    icon: 'Linkedin',
    color: '#0A66C2',
    bgGradient: 'from-blue-500/20 to-cyan-600/10',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  },
  {
    id: 'Twitter / X',
    name: 'Twitter / X',
    nameAr: 'تويتر / إكس',
    count: 260,
    icon: 'Twitter',
    color: '#F43F5E',
    bgGradient: 'from-slate-700/30 to-slate-800/20',
    badgeColor: 'bg-slate-700/40 text-slate-300 border-slate-600/30'
  },
  {
    id: 'Reddit',
    name: 'Reddit',
    nameAr: 'ريديت',
    count: 93,
    icon: 'MessageSquare',
    color: '#FF4500',
    bgGradient: 'from-orange-500/20 to-amber-600/10',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  {
    id: 'Messaging',
    name: 'Messaging & Chat',
    nameAr: 'المراسلة والمحادثات',
    count: 61,
    icon: 'MessageCircle',
    color: '#25D366',
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'Media & Audio',
    name: 'Streaming & Podcasts',
    nameAr: 'البث والبودكاست',
    count: 52,
    icon: 'Radio',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 to-violet-600/10',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  {
    id: 'Snapchat',
    name: 'Snapchat',
    nameAr: 'سناب شات',
    count: 37,
    icon: 'Camera',
    color: '#FFFC00',
    bgGradient: 'from-yellow-500/20 to-amber-500/10',
    badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
  },
  {
    id: 'Pinterest',
    name: 'Pinterest',
    nameAr: 'بينتيريست',
    count: 35,
    icon: 'Pin',
    color: '#E60023',
    bgGradient: 'from-red-600/20 to-rose-600/10',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  },
  {
    id: 'Threads',
    name: 'Threads',
    nameAr: 'ثريدز',
    count: 34,
    icon: 'AtSign',
    color: '#A855F7',
    bgGradient: 'from-fuchsia-500/20 to-purple-600/10',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
  },
  {
    id: 'Jobs & Recruitment',
    name: 'Recruitment & Jobs',
    nameAr: 'التوظيف وفرص العمل',
    count: 17,
    icon: 'Briefcase',
    color: '#10B981',
    bgGradient: 'from-teal-500/20 to-emerald-600/10',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
  }
];

export const POPULAR_TAGS = [
  'Cookie-less',
  'Media Downloader',
  'Lead & Contact Extractor',
  'Transcript Extractor',
  'Profile & Bio',
  'Comments & Sentiment',
  'Bulk Processing',
  'Proxy Shield',
  'Ultra Fast',
  'AI Enhanced'
];
