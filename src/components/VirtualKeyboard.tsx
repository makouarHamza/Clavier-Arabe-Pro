import React, { useState } from 'react';
import { ThemeConfig } from '../types.ts';
import { soundManager } from '../utils/sound.ts';
import { HARAKAT } from '../utils/transliteration.ts';
import { Search, Delete } from 'lucide-react';

interface VirtualKeyboardProps {
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  onGoogleSearch: () => void;
  onYouTubeSearch: () => void;
  theme: ThemeConfig;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onInsertChar,
  onBackspace,
  onEnter,
  onSpace,
  onGoogleSearch,
  onYouTubeSearch,
  theme,
}) => {
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);

  const handleKeyPress = (char: string) => {
    soundManager.playClick();
    onInsertChar(char);
    if (isShift) {
      setIsShift(false);
    }
  };

  const handleSpace = () => {
    soundManager.playThud();
    onSpace();
  };

  const handleBackspace = () => {
    soundManager.playThud();
    onBackspace();
  };

  const toggleShift = () => {
    soundManager.playClick(1.3);
    setIsShift(!isShift);
  };

  // Keyboard Rows definition matching the user's reference image
  const row1 = [
    { ar: 'ذ', lat: 'd*', shiftAr: 'ّ' },
    { ar: '١', lat: '1', shiftAr: '!' },
    { ar: '٢', lat: '2', shiftAr: '@' },
    { ar: '٣', lat: '3', shiftAr: '#' },
    { ar: '٤', lat: '4', shiftAr: '$' },
    { ar: '٥', lat: '5', shiftAr: '%' },
    { ar: '٦', lat: '6', shiftAr: '^' },
    { ar: '٧', lat: '7', shiftAr: '&' },
    { ar: '٨', lat: '8', shiftAr: '*' },
    { ar: '٩', lat: '9', shiftAr: ')' },
    { ar: '٠', lat: '0', shiftAr: '(' },
    { ar: 'ّ', lat: '~', shiftAr: 'ـ' },
    { ar: '؟', lat: '!', shiftAr: '?' },
  ];

  const row2 = [
    { ar: 'ض', lat: 'D', shiftAr: 'َ' },
    { ar: 'ص', lat: 'S', shiftAr: 'ً' },
    { ar: 'ث', lat: 'c', shiftAr: 'ُ' },
    { ar: 'ق', lat: 'q', shiftAr: 'ٌ' },
    { ar: 'ف', lat: 'f', shiftAr: 'لإ' },
    { ar: 'غ', lat: "3'", shiftAr: 'إ' },
    { ar: 'ع', lat: '3', shiftAr: '‘' },
    { ar: 'ه', lat: 'h', shiftAr: '÷' },
    { ar: 'خ', lat: 'x', shiftAr: '×' },
    { ar: 'ح', lat: '7', shiftAr: '؛' },
    { ar: 'ج', lat: 'j', shiftAr: '<' },
    { ar: 'د', lat: 'd', shiftAr: '>' },
  ];

  const row3 = [
    { ar: 'ش', lat: 'ch', shiftAr: 'ِ' },
    { ar: 'س', lat: 's', shiftAr: 'ٍ' },
    { ar: 'ي', lat: 'y', shiftAr: ']' },
    { ar: 'ب', lat: 'b', shiftAr: '[' },
    { ar: 'ل', lat: 'L', shiftAr: 'لأ' },
    { ar: 'ا', lat: 'a', shiftAr: 'أ' },
    { ar: 'ت', lat: 't', shiftAr: 'ـ' },
    { ar: 'ن', lat: 'n', shiftAr: '،' },
    { ar: 'م', lat: 'm', shiftAr: '/' },
    { ar: 'ك', lat: 'k', shiftAr: ':' },
    { ar: 'ط', lat: 'T', shiftAr: '"' },
  ];

  const row4 = [
    { ar: 'ئ', lat: "i'", shiftAr: '~' },
    { ar: 'ء', lat: '2', shiftAr: 'ْ' },
    { ar: 'ؤ', lat: "w'", shiftAr: '}' },
    { ar: 'ر', lat: 'r', shiftAr: '{' },
    { ar: 'لا', lat: 'la', shiftAr: 'لآ' },
    { ar: 'ى', lat: 'N', shiftAr: 'آ' },
    { ar: 'ة', lat: 'H', shiftAr: "'" },
    { ar: 'و', lat: 'W', shiftAr: ',' },
    { ar: 'ز', lat: 'z', shiftAr: '.' },
    { ar: 'ظ', lat: "T'", shiftAr: '؟' },
  ];

  // Tashkeel / Harakat collection directly from bottom screenshot box
  const harakatList = [
    { label: 'َ', name: 'فتحة Fatha', char: HARAKAT.FATHA },
    { label: 'ُ', name: 'ضمة Damma', char: HARAKAT.DAMMA },
    { label: 'ِ', name: 'كسرة Kasra', char: HARAKAT.KASRA },
    { label: 'ْ', name: 'سكون Sukun', char: HARAKAT.SUKUN },
    { label: 'ً', name: 'تنوين فتح Tanwin Fath', char: HARAKAT.TANWIN_FATH },
    { label: 'ٌ', name: 'تنوين ضم Tanwin Damm', char: HARAKAT.TANWIN_DAMM },
    { label: 'ٍ', name: 'تنوين كسر Tanwin Kasr', char: HARAKAT.TANWIN_KASR },
    { label: 'ّ', name: 'شدة Shadda', char: HARAKAT.SHADDA },
  ];

  // Bottom ligatures and symbols row from screenshot
  const ligaturesList = [
    { ar: 'لأ', lat: 'le' },
    { ar: 'إ', lat: 'e' },
    { ar: '،', lat: "'" },
    { ar: '.', lat: '.' },
    { ar: '؟', lat: '?' },
    { ar: 'لإ', lat: "la'" },
    { ar: 'آ', lat: "a'" },
    { ar: 'ـ', lat: '-' },
    { ar: '؛', lat: ':' },
    { ar: '!', lat: 'A' },
  ];

  return (
    <div className={`w-full p-2 sm:p-3 select-none ${theme.cardBgClass} transition-colors duration-200`}>
      {/* Keyboard Container */}
      <div className="flex flex-col gap-1 sm:gap-1.5 max-w-4xl mx-auto">
        {/* ROW 1 */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 w-full">
          {row1.map((key, i) => {
            const displayChar = isShift && key.shiftAr ? key.shiftAr : key.ar;
            return (
              <button
                key={`r1-${i}`}
                type="button"
                onClick={() => handleKeyPress(displayChar)}
                className={`flex-1 min-w-0 h-10 sm:h-12 flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
                title={`عربي: ${displayChar} | لاتيني: ${key.lat}`}
              >
                <span className={`self-start ${theme.keyTextLatinClass}`}>
                  {key.lat}
                </span>
                <span className={`self-center ${theme.keyTextArabicClass}`}>
                  {displayChar}
                </span>
              </button>
            );
          })}

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            className={`px-2 sm:px-3 h-10 sm:h-12 flex items-center justify-center gap-1 font-bold text-xs sm:text-sm text-red-600 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="حذف الحرف السابق (Backspace)"
          >
            <Delete className="w-3.5 h-3.5 text-red-600 rotate-180" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* ROW 2 */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 w-full">
          {/* Tab Button */}
          <button
            type="button"
            onClick={() => handleKeyPress('  ')}
            className={`px-2 sm:px-3 h-10 sm:h-12 flex items-center justify-center font-medium text-[11px] sm:text-xs text-slate-700 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="علامة جدولة (Tab)"
          >
            Tab
          </button>

          {row2.map((key, i) => {
            const displayChar = isShift && key.shiftAr ? key.shiftAr : key.ar;
            return (
              <button
                key={`r2-${i}`}
                type="button"
                onClick={() => handleKeyPress(displayChar)}
                className={`flex-1 min-w-0 h-10 sm:h-12 flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
                title={`عربي: ${displayChar} | لاتيني: ${key.lat}`}
              >
                <span className={`self-start ${theme.keyTextLatinClass}`}>
                  {key.lat}
                </span>
                <span className={`self-center ${theme.keyTextArabicClass}`}>
                  {displayChar}
                </span>
              </button>
            );
          })}

          {/* Enter Top Section */}
          <button
            type="button"
            onClick={() => {
              soundManager.playThud();
              onEnter();
            }}
            className={`px-2 sm:px-4 h-10 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm text-red-600 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="سطر جديد (Enter)"
          >
            <span className="text-red-600 font-extrabold text-sm sm:text-base">↵ Enter</span>
          </button>
        </div>

        {/* ROW 3 */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 w-full">
          {/* YouTube shortcut key from screenshot */}
          <button
            type="button"
            onClick={onYouTubeSearch}
            className={`px-2 sm:px-3 h-10 sm:h-12 flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="بحث مباشر في يوتيوب"
          >
            <span className="text-slate-800 text-[10px]">You</span>
            <span className="bg-red-600 text-white px-1 py-0.2 rounded text-[9px] font-black">Tube</span>
          </button>

          {row3.map((key, i) => {
            const displayChar = isShift && key.shiftAr ? key.shiftAr : key.ar;
            return (
              <button
                key={`r3-${i}`}
                type="button"
                onClick={() => handleKeyPress(displayChar)}
                className={`flex-1 min-w-0 h-10 sm:h-12 flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
                title={`عربي: ${displayChar} | لاتيني: ${key.lat}`}
              >
                <span className={`self-start ${theme.keyTextLatinClass}`}>
                  {key.lat}
                </span>
                <span className={`self-center ${theme.keyTextArabicClass}`}>
                  {displayChar}
                </span>
              </button>
            );
          })}

          {/* Enter continuation */}
          <button
            type="button"
            onClick={() => {
              soundManager.playThud();
              onEnter();
            }}
            className={`px-2 sm:px-4 h-10 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm text-slate-700 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
          >
            <span className="hidden sm:inline">إدخال</span>
          </button>
        </div>

        {/* ROW 4 */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 w-full">
          {/* Google shortcut key from screenshot */}
          <button
            type="button"
            onClick={onGoogleSearch}
            className={`px-2 sm:px-3 h-10 sm:h-12 flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="بحث مباشر في جوجل"
          >
            <span className="text-blue-600 font-bold">G</span>
            <span className="text-red-500 font-bold">o</span>
            <span className="text-amber-500 font-bold">o</span>
          </button>

          {/* Shift Toggle */}
          <button
            type="button"
            onClick={toggleShift}
            className={`px-2 sm:px-2.5 h-10 sm:h-12 flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
              isShift ? 'bg-amber-300 text-amber-950 font-black' : `${theme.keyBgClass} text-slate-700`
            } ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="تبديل الحركات والرموز (Shift)"
          >
            Shift
          </button>

          {row4.map((key, i) => {
            const displayChar = isShift && key.shiftAr ? key.shiftAr : key.ar;
            return (
              <button
                key={`r4-${i}`}
                type="button"
                onClick={() => handleKeyPress(displayChar)}
                className={`flex-1 min-w-0 h-10 sm:h-12 flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
                title={`عربي: ${displayChar} | لاتيني: ${key.lat}`}
              >
                <span className={`self-start ${theme.keyTextLatinClass}`}>
                  {key.lat}
                </span>
                <span className={`self-center ${theme.keyTextArabicClass}`}>
                  {displayChar}
                </span>
              </button>
            );
          })}

          {/* Search Shortcut */}
          <button
            type="button"
            onClick={onGoogleSearch}
            className={`px-2 sm:px-3 h-10 sm:h-12 flex items-center justify-center gap-1 font-bold text-xs text-red-600 transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="بحث"
          >
            <Search className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* ROW 5 (Spacebar & modifiers) */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 w-full">
          <button
            type="button"
            className={`px-2.5 sm:px-4 h-9 sm:h-10 text-[11px] font-medium text-slate-600 ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
          >
            Ctrl
          </button>
          <button
            type="button"
            className={`px-2 sm:px-3 h-9 sm:h-10 text-[11px] font-medium text-slate-600 ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
          >
            Alt
          </button>

          {/* Big Spacebar */}
          <button
            type="button"
            onClick={handleSpace}
            className={`flex-1 h-9 sm:h-10 flex items-center justify-center transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="مسافة (Space)"
          >
            <span className="text-xs text-slate-400 select-none tracking-widest font-mono">
              ═══════ مسافة Space ═══════
            </span>
          </button>

          <button
            type="button"
            className={`px-2 sm:px-3 h-9 sm:h-10 text-[11px] font-medium text-slate-600 ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
          >
            AltGr
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('ـ')}
            className={`px-2 sm:px-3 h-9 sm:h-10 text-xs font-bold text-slate-700 ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyShadowClass}`}
            title="تطويل الكشيدة (ـ)"
          >
            ـ تمديد
          </button>
        </div>

        {/* BOTTOM HARAKAT & LIGATURES ROW (Directly matching the two boxes under keyboard in image) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-400/30">
          {/* Box 1: 8 Harakat / Tashkeel box from image */}
          <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-black/40 rounded border border-black/10 shadow-inner">
            <span className={`text-[10px] font-semibold px-1 border-l border-black/10 ${theme.keyTextLatinClass}`}>
              التشكيل:
            </span>
            <div className="grid grid-flow-col grid-rows-2 gap-1">
              {harakatList.map((item, idx) => (
                <button
                  key={`harakat-${idx}`}
                  type="button"
                  onClick={() => handleKeyPress(item.char)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-lg rounded transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} ${theme.keyTextArabicClass} hover:scale-105`}
                  title={item.name}
                >
                  <span className="relative -top-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Box 2: Special Arabic ligatures & punctuation from image */}
          <div className="flex-1 flex items-center gap-1 p-1 bg-black/10 dark:bg-black/40 rounded border border-black/10 shadow-inner overflow-x-auto">
            <span className={`text-[10px] font-semibold px-1 border-l border-black/10 ${theme.keyTextLatinClass}`}>
              رموز وحروف خاصة:
            </span>
            <div className="flex items-center gap-1">
              {ligaturesList.map((item, idx) => (
                <button
                  key={`lig-${idx}`}
                  type="button"
                  onClick={() => handleKeyPress(item.ar)}
                  className={`min-w-8 h-8 px-1.5 flex flex-col items-center justify-center rounded transition-all cursor-pointer ${theme.keyBgClass} ${theme.keyBorderClass} hover:scale-105`}
                  title={`${item.ar} (${item.lat})`}
                >
                  <span className={`text-[9px] font-mono leading-none ${theme.keyTextLatinClass}`}>{item.lat}</span>
                  <span className={`font-bold text-sm leading-none ${theme.keyTextArabicClass}`}>{item.ar}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
