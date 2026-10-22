import type { AdminSettings, AdSlotId } from '../types.ts';

export const STORAGE_KEY_ADMIN_SETTINGS = 'clavier_arabe_admin_settings_v1';

export const PRESET_BANNER_IMAGES = [
  {
    name: 'تعليم وخط عربي (Arabic Learning)',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    category: 'education',
  },
  {
    name: 'برمجيات ومنصات سحابية (SaaS & Tech)',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    category: 'tech',
  },
  {
    name: 'تدقيق لغوي وقراءة (Books & Reading)',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    category: 'books',
  },
  {
    name: 'تطبيقات الهواتف الذكية (Mobile Apps)',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    category: 'mobile',
  },
  {
    name: 'فنون وتصميم إسلامي (Islamic Art)',
    url: 'https://images.unsplash.com/photo-1584281722572-886d34e6c27f?auto=format&fit=crop&w=600&q=80',
    category: 'culture',
  },
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adsensePublisherId: 'ca-pub-9842839201948271',
  globalAdsEnabled: true,
  adDensity: 'medium',
  adUnits: {
    leaderboard: {
      id: 'leaderboard',
      name: 'Header Leaderboard (728x90)',
      nameAr: 'بنر الترويسة العلوي الرئيسي (728x90)',
      enabled: true,
      provider: 'custom',
      adSenseSlotId: '1092837465',
      customTitle: 'تعلم اللغة العربية وقواعد النحو التفاعلية',
      customDescription: 'منصة رقمية لتعليم الإملاء والخط العربي للمحترفين بالذكاء الاصطناعي',
      customCta: 'اكتشف المزيد',
      customLink: 'https://example.com/arabic-mastery',
      customBadge: 'إعلان ممول / SPONSORED',
      badgeColor: 'amber',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      impressions: 14280,
      clicks: 342,
    },
    skyscraper: {
      id: 'skyscraper',
      name: 'Sidebar Skyscraper (160x600)',
      nameAr: 'إعلان البرج الجانبي (160x600)',
      enabled: true,
      provider: 'custom',
      adSenseSlotId: '4839201837',
      customTitle: 'Clavier Arabe SaaS Pro',
      customDescription: 'تجربة كتابة بدون إعلانات مع تشكيل آلي ذكي، وتصدير PDF منسق، ونسخ سحابي فوري.',
      customCta: 'جرّب النسخة الاحترافية',
      customLink: '#pro',
      customBadge: 'عضوية مميزة / PRO',
      badgeColor: 'indigo',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      impressions: 8940,
      clicks: 215,
    },
    native: {
      id: 'native',
      name: 'In-Feed Native Banner',
      nameAr: 'إعلان مدمج أسفل لوحة المفاتيح (Native)',
      enabled: true,
      provider: 'custom',
      adSenseSlotId: '7583920184',
      customTitle: 'أدوات الترجمة والتدقيق اللغوي الآلي',
      customDescription: 'دقّق مقالاتك ونصوصك العربية بنقرة زر واحدة وتخلّص من الأخطاء الإملائية.',
      customCta: 'تجربة مجانية',
      customLink: 'https://example.com/arabic-proofreader',
      customBadge: 'إعلان مدعوم / SPONSORED',
      badgeColor: 'emerald',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      impressions: 19830,
      clicks: 612,
    },
    sticky_footer: {
      id: 'sticky_footer',
      name: 'Sticky Mobile Footer (320x50)',
      nameAr: 'شريط الإعلانات الثابت أسفل الشاشة (320x50)',
      enabled: false,
      provider: 'custom',
      adSenseSlotId: '9847291038',
      customTitle: 'حمّل تطبيق لوحة المفاتيح العربية للهواتف',
      customDescription: 'تطبيق أندرويد و iOS مجاني مع لوحة تشكيل متطورة',
      customCta: 'تحميل مباشر',
      customLink: 'https://example.com/app-download',
      customBadge: 'تطبيق موصى به',
      badgeColor: 'blue',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80',
      impressions: 4300,
      clicks: 98,
    },
  },
  seo: {
    siteTitle: 'Clavier Arabe Pro – لوحة مفاتيح عربية ذكية وسريعة | Arabic Keyboard & Yamli Transliteration',
    metaDescription: 'أسرع لوحة مفاتيح عربية افتراضية للكتابة بالعربية وحروف العربيزي Yamli بدون تأخير. كيبورد عربي مع التشكيل، ثيمات مخصصة، والبحث السريع في جوجل ويوتيوب.',
    googleAnalyticsId: 'G-CLAVIERARABE24',
    enablePseoTabs: true,
    canonicalUrl: 'https://clavier-arabe-pro.com/',
  },
  siteDefaults: {
    defaultTheme: 'classic',
    defaultFont: 'font-cairo',
    defaultFontSize: 20,
    defaultSound: true,
    defaultVirtualVisible: true,
    defaultTransliteration: true,
  },
  customDictionary: [
    { id: '1', latin: 'choukrane', arabic: 'شكراً' },
    { id: '2', latin: 'labas', arabic: 'لاباس' },
    { id: '3', latin: 'finak', arabic: 'فينك' },
    { id: '4', latin: 'wesh', arabic: 'واش' },
    { id: '5', latin: 'bzaf', arabic: 'بزاف' },
  ],
  stats: {
    totalPageViews: 43250,
    totalWordsTyped: 128940,
    transliterationCount: 78430,
    estimatedRevenue: 124.60,
  },
};

/**
 * Calculates estimated revenue based on impressions, clicks, eCPM and CPC
 */
export function calculateEstimatedRevenue(
  impressions: number,
  clicks: number,
  ecpm = 1.85,
  avgCpc = 0.12
): number {
  const cpmRevenue = (impressions / 1000) * ecpm;
  const clickRevenue = clicks * avgCpc;
  return Number((cpmRevenue + clickRevenue).toFixed(2));
}

/**
 * Calculates click-through rate (CTR) percentage
 */
export function calculateCtr(clicks: number, impressions: number): string {
  if (!impressions || impressions === 0) return '0.00%';
  const ctr = (clicks / impressions) * 100;
  return ctr.toFixed(2) + '%';
}

/**
 * Loads admin settings from localStorage or returns default
 */
export function loadAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SETTINGS);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      adUnits: {
        ...DEFAULT_ADMIN_SETTINGS.adUnits,
        ...(parsed.adUnits || {}),
      },
      seo: {
        ...DEFAULT_ADMIN_SETTINGS.seo,
        ...(parsed.seo || {}),
      },
      siteDefaults: {
        ...DEFAULT_ADMIN_SETTINGS.siteDefaults,
        ...(parsed.siteDefaults || {}),
      },
      stats: {
        ...DEFAULT_ADMIN_SETTINGS.stats,
        ...(parsed.stats || {}),
      },
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

/**
 * Persists admin settings to localStorage
 */
export function saveAdminSettings(settings: AdminSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_SETTINGS, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

/**
 * Resets settings to default
 */
export function resetAdminSettings(): AdminSettings {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_SETTINGS);
    } catch {
      // ignore
    }
  }
  return DEFAULT_ADMIN_SETTINGS;
}
