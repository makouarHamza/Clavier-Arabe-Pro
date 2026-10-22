/**
 * Pure logic engine for Arabizi / Franco-Arabic to Arabic transliteration,
 * word lookup, candidate suggestions, and Tashkeel helpers.
 */

export interface CandidateResult {
  primary: string;
  alternatives: string[];
}

// Common dictionary for instant exact high-frequency matches
export const ARABIC_DICTIONARY: Record<string, string[]> = {
  salam: ['سلام', 'السلام'],
  slm: ['سلام', 'سلم'],
  marhaba: ['مرحبا', 'مرحباً'],
  mrhba: ['مرحبا'],
  ahlan: ['أهلاً', 'اهلا'],
  shukran: ['شكراً', 'شكرا'],
  chokran: ['شكراً', 'شكرا'],
  choukrane: ['شكراً', 'شكرا'],
  habibi: ['حبيبي', 'حبيبتي'],
  inshallah: ['إن شاء الله', 'انشاءالله'],
  nchallah: ['إن شاء الله'],
  mashallah: ['ما شاء الله'],
  alhamdulillah: ['الحمد لله', 'الحمدلله'],
  lhamdullah: ['الحمد لله'],
  sabah: ['صباح', 'الصباح'],
  kheir: ['خير', 'الخير'],
  alkhair: ['الخير'],
  alkheir: ['الخير'],
  noor: ['نور', 'النور'],
  masa2: ['مساء', 'المساء'],
  masaa: ['مساء'],
  kifak: ['كيفك', 'كيف حالك'],
  kayfa: ['كيف'],
  halak: ['حالك'],
  labas: ['لاباس', 'لا بأس'],
  wesh: ['واش', 'وش'],
  fin: ['فين', 'أين'],
  wein: ['وين', 'أين'],
  ezayak: ['إزيك', 'إزيك يا'],
  momken: ['ممكن'],
  la: ['لا'],
  naam: ['نعم'],
  aywa: ['أيوه', 'ايوة'],
  behi: ['باهي'],
  mezyan: ['مزيان'],
  bzaf: ['بزاف'],
  ktir: ['كتير', 'كثير'],
  ktira: ['كتيرة', 'كثيرة'],
  kitab: ['كتاب', 'الكتاب'],
  qalam: ['قلم', 'القلم'],
  madrasa: ['مدرسة', 'المدرسة'],
  jami3a: ['جامعة', 'الجامعة'],
  bayt: ['بيت', 'البيت'],
  dar: ['دار', 'الدار'],
  shams: ['شمس', 'الشمس'],
  qamar: ['قمر', 'القمر'],
  '3arab': ['عرب', 'العرب'],
  '3arabi': ['عربي', 'العربي'],
  '3arabiya': ['عربية', 'العربية'],
  maghreb: ['المغرب', 'مغرب'],
  tounes: ['تونس'],
  djazair: ['الجزائر', 'جزائر'],
  masr: ['مصر', 'المصر'],
  lubnan: ['لبنان'],
  ourdoun: ['الأردن'],
  saudiya: ['السعودية'],
  imarat: ['الإمارات'],
  qatar: ['قطر'],
  kuwait: ['الكويت'],
  bahrain: ['البحرين'],
  filastin: ['فلسطين'],
  souriya: ['سوريا'],
  iraq: ['العراق', 'عراق'],
  yaman: ['اليمن'],
  sudan: ['السودان'],
  om: ['أم', 'أمي'],
  ab: ['أب', 'أبي'],
  akh: ['أخ', 'أخي'],
  okht: ['أخت', 'أختي'],
  sahbi: ['صاحبي', 'صديقي'],
  habibti: ['حبيبتي'],
  ya: ['يا'],
  min: ['من'],
  fi: ['في'],
  '3la': ['على'],
  ila: ['إلى'],
  ma3a: ['مع'],
  b: ['بـ'],
  wa: ['و'],
  aw: ['أو'],
  li: ['لـ'],
  kol: ['كل'],
  youm: ['يوم', 'اليوم'],
  sa3a: ['ساعة', 'الساعة'],
  waqt: ['وقت', 'الوقت'],
};

// Multi-character token replacements (longer patterns first)
const MULTI_CHAR_MAP: [RegExp, string][] = [
  [/inshallah/gi, 'إن شاء الله'],
  [/mashallah/gi, 'ما شاء الله'],
  [/alhamdulillah/gi, 'الحمد لله'],
  [/kh|5/gi, 'خ'],
  [/gh|3'/gi, 'غ'],
  [/sh|ch/gi, 'ش'],
  [/th/gi, 'ث'],
  [/dh/gi, 'ذ'],
  [/ou/gi, 'و'],
  [/ee/gi, 'ي'],
  [/aa/gi, 'ا'],
  [/laa/gi, 'لا'],
  [/la/gi, 'لا'],
  [/2a|2o|2i/gi, 'أ'],
  [/3a|3o|3i|3/gi, 'ع'],
  [/7/gi, 'ح'],
  [/6'/gi, 'ظ'],
  [/6/gi, 'ط'],
  [/9/gi, 'ق'],
  [/8/gi, 'غ'],
  [/2/gi, 'ء'],
];

// Single letter phonetic fallback mapping
const SINGLE_CHAR_MAP: Record<string, string> = {
  a: 'ا',
  A: 'أ',
  b: 'ب',
  B: 'ب',
  t: 'ت',
  T: 'ط',
  c: 'ث',
  C: 'ص',
  j: 'ج',
  J: 'ج',
  H: 'ح',
  h: 'ه',
  d: 'د',
  D: 'ض',
  r: 'ر',
  R: 'ر',
  z: 'ز',
  Z: 'ظ',
  s: 'س',
  S: 'ص',
  q: 'ق',
  Q: 'ق',
  k: 'ك',
  K: 'ك',
  l: 'ل',
  L: 'ل',
  m: 'م',
  M: 'م',
  n: 'ن',
  N: 'ن',
  w: 'و',
  W: 'و',
  y: 'ي',
  Y: 'ى',
  i: 'ي',
  I: 'إ',
  o: 'و',
  O: 'و',
  u: 'و',
  U: 'و',
  e: 'ي',
  E: 'إ',
  p: 'ب',
  P: 'ب',
  v: 'ف',
  V: 'ف',
  f: 'ف',
  F: 'ف',
  x: 'خ',
  X: 'خ',
  g: 'ج',
  G: 'غ',
  '?': '؟',
  ',': '،',
  ';': '؛',
};

/**
 * Transliterates a single Franco/Arabizi token into an Arabic phonetic candidate
 */
export function phoneticTransliterate(token: string): string {
  if (!token) return '';
  
  // Keep non-latin/number characters intact
  if (/^[\u0600-\u06FF\s\d.,!?;:()]+$/.test(token)) {
    return token;
  }

  let text = token;

  // Process multi-char patterns
  for (const [regex, replacement] of MULTI_CHAR_MAP) {
    text = text.replace(regex, replacement);
  }

  // Handle remaining single chars
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (SINGLE_CHAR_MAP[char]) {
      result += SINGLE_CHAR_MAP[char];
    } else {
      result += char;
    }
  }

  // Common Arabic grammatical cleanup: trailing 'a' or 'ah' on nouns is often 'ة'
  if (token.length > 2 && (token.toLowerCase().endsWith('ah') || token.toLowerCase().endsWith('at'))) {
    if (result.endsWith('ه') || result.endsWith('ات')) {
      result = result.replace(/ه$/, 'ة');
    }
  }

  return result;
}

export function getArabicCandidates(
  rawWord: string,
  customWords?: Array<{ latin: string; arabic: string }>
): CandidateResult {
  const cleanWord = rawWord.trim().toLowerCase();
  if (!cleanWord) {
    return { primary: '', alternatives: [] };
  }

  // 0. Check custom admin dictionary first
  if (customWords && customWords.length > 0) {
    const customMatch = customWords.find(w => w.latin.trim().toLowerCase() === cleanWord);
    if (customMatch && customMatch.arabic) {
      const phonetic = phoneticTransliterate(cleanWord);
      const alts = phonetic && phonetic !== customMatch.arabic ? [phonetic] : [];
      return {
        primary: customMatch.arabic,
        alternatives: alts,
      };
    }
  }

  // 1. Direct dictionary match
  const dictMatches = ARABIC_DICTIONARY[cleanWord];
  if (dictMatches && dictMatches.length > 0) {
    const primary = dictMatches[0];
    const alts = dictMatches.slice(1);
    const phonetic = phoneticTransliterate(cleanWord);
    if (phonetic && phonetic !== primary && !alts.includes(phonetic)) {
      alts.push(phonetic);
    }
    return {
      primary,
      alternatives: alts,
    };
  }

  // 2. Phonetic computation
  const primary = phoneticTransliterate(rawWord);
  const alternatives: string[] = [];

  // Generate plausible variations (e.g. Alif with Hamza vs plain, Ta Marbuta vs Haa)
  if (primary.startsWith('ا') && !primary.startsWith('ال')) {
    alternatives.push('أ' + primary.slice(1));
    alternatives.push('إ' + primary.slice(1));
  }
  if (primary.endsWith('ه')) {
    alternatives.push(primary.slice(0, -1) + 'ة');
  }
  if (primary.endsWith('ي')) {
    alternatives.push(primary.slice(0, -1) + 'ى');
  }
  if (primary.includes('ي')) {
    alternatives.push(primary.replace(/ي/g, 'ئ'));
  }

  return {
    primary,
    alternatives: alternatives.filter(a => a !== primary).slice(0, 4),
  };
}

/**
 * Tashkeel / Harakat constants and helpers
 */
export const HARAKAT = {
  FATHA: '\u064E', // َ
  DAMMA: '\u064F', // ُ
  KASRA: '\u0650', // ِ
  SUKUN: '\u0652', // ْ
  TANWIN_FATH: '\u064B', // ً
  TANWIN_DAMM: '\u064C', // ٌ
  TANWIN_KASR: '\u064D', // ٍ
  SHADDA: '\u0651', // ّ
  MADDA: '\u0653', // ٓ
  TATWEEL: '\u0640', // ـ (kashida)
  BISMILLAH: '﷽',
  SALLALLAH: 'ﷺ',
};

/**
 * Strips all Arabic diacritics / Harakat from a string
 */
export function removeTashkeel(text: string): string {
  return text.replace(/[\u064B-\u0652\u0653\u0670]/g, '');
}

/**
 * Fast word and character counter
 */
export function getArabicTextStats(text: string) {
  const characters = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const harakatCount = (text.match(/[\u064B-\u0652]/g) || []).length;

  return {
    characters,
    charsNoSpaces,
    words,
    lines,
    harakatCount,
  };
}
