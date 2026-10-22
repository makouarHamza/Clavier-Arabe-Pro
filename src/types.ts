export type ThemeId =
  | 'classic'   // Classic Yamli / Clavier Arabe 2000s retro bevel keys
  | 'modern'    // Apple / Slate Minimalist
  | 'dark'      // OLED Deep Midnight
  | 'desert'    // Desert Sand & Calligraphy Gold
  | 'emerald'   // Emerald Islamic Heritage
  | 'cyberpunk'; // Neon Cyberpunk

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameAr: string;
  bgClass: string;
  cardBgClass: string;
  keyBgClass: string;
  keyTextArabicClass: string;
  keyTextLatinClass: string;
  keyBorderClass: string;
  keyShadowClass: string;
  headerBgClass: string;
  accentClass: string;
}

export type KeyboardLayout = 'arabic-101' | 'arabic-azerty' | 'arabizi-yamli';

export interface KeyboardKeyItem {
  ar: string;
  lat?: string;
  shiftAr?: string;
  width?: string;
  isSpecial?: boolean;
  type?: 'char' | 'action' | 'space' | 'backspace' | 'enter' | 'tab' | 'caps' | 'shift' | 'google' | 'youtube' | 'search';
  actionName?: string;
}

export type PseoTab =
  | 'keyboard'
  | 'yamli'
  | 'tashkeel'
  | 'search'
  | 'shortcuts'
  | 'faq';

export type AdSlotId = 'leaderboard' | 'skyscraper' | 'native' | 'sticky_footer';

export interface AdUnitConfig {
  id: AdSlotId;
  name: string;
  nameAr: string;
  enabled: boolean;
  provider: 'adsense' | 'custom' | 'direct_sponsor';
  adSenseSlotId: string;
  customTitle: string;
  customDescription: string;
  customCta: string;
  customLink: string;
  customBadge: string;
  badgeColor?: string;
  imageUrl?: string;
  impressions: number;
  clicks: number;
}

export interface AdminSettings {
  adsensePublisherId: string;
  globalAdsEnabled: boolean;
  adDensity: 'low' | 'medium' | 'high';
  adUnits: Record<AdSlotId, AdUnitConfig>;
  seo: {
    siteTitle: string;
    metaDescription: string;
    googleAnalyticsId: string;
    enablePseoTabs: boolean;
    canonicalUrl: string;
  };
  siteDefaults: {
    defaultTheme: ThemeId;
    defaultFont: string;
    defaultFontSize: number;
    defaultSound: boolean;
    defaultVirtualVisible: boolean;
    defaultTransliteration: boolean;
  };
  customDictionary: Array<{
    id: string;
    latin: string;
    arabic: string;
  }>;
  stats: {
    totalPageViews: number;
    totalWordsTyped: number;
    transliterationCount: number;
    estimatedRevenue: number;
  };
}
