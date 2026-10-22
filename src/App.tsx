import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThemeId, PseoTab, AdminSettings, AdSlotId } from './types.ts';
import { THEMES } from './utils/themes.ts';
import { soundManager } from './utils/sound.ts';
import {
  getArabicCandidates,
  getArabicTextStats,
  CandidateResult,
} from './utils/transliteration.ts';
import {
  loadAdminSettings,
  saveAdminSettings,
  resetAdminSettings,
} from './utils/adminStorage.ts';

import { TopSearchBar } from './components/TopSearchBar.tsx';
import { ActionToolbar } from './components/ActionToolbar.tsx';
import { VirtualKeyboard } from './components/VirtualKeyboard.tsx';
import { ArabiziSuggestionsBar } from './components/ArabiziSuggestionsBar.tsx';
import { AdBanner } from './components/AdBanner.tsx';
import { ThemeSelector } from './components/ThemeSelector.tsx';
import { PseoContent } from './components/PseoContent.tsx';
import { ProModal } from './components/ProModal.tsx';
import { TextSnippetsDrawer } from './components/TextSnippetsDrawer.tsx';
import { AdminAdsManager } from './components/admin/AdminAdsManager.tsx';

import {
  Crown,
  Keyboard,
  Sparkles,
  Search,
  Globe,
  Share2,
  ChevronDown,
  ShieldAlert,
  Settings
} from 'lucide-react';

export default function App() {
  // Admin settings & view router
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => loadAdminSettings());
  const [currentView, setCurrentView] = useState<'app' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'app';
  });

  // Main Text state
  const [text, setText] = useState<string>('مَرْحَبًا بِكُمْ فِي كِيبُورْدِ الْعَرَبِيَّةِ الذَّكِيِّ');

  // Theme & Layout personalization initialized from admin defaults
  const [themeId, setThemeId] = useState<ThemeId>(() => adminSettings.siteDefaults?.defaultTheme || 'classic');
  const activeTheme = THEMES[themeId] || THEMES.classic;

  // Modals & Drawers
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Keyboard toggles initialized from admin defaults
  const [isVirtualVisible, setIsVirtualVisible] = useState(() => adminSettings.siteDefaults?.defaultVirtualVisible ?? true);
  const [isTransliterationActive, setIsTransliterationActive] = useState(() => adminSettings.siteDefaults?.defaultTransliteration ?? true);

  // Font settings
  const [fontFamily, setFontFamily] = useState(() => adminSettings.siteDefaults?.defaultFont || 'font-cairo');
  const [fontSize, setFontSize] = useState(() => adminSettings.siteDefaults?.defaultFontSize || 20);
  const [soundEnabled, setSoundEnabled] = useState(() => adminSettings.siteDefaults?.defaultSound ?? true);

  // PSEO active tab
  const [activePseoTab, setActivePseoTab] = useState<PseoTab>('keyboard');

  // Transliteration current active word & candidates
  const [currentWord, setCurrentWord] = useState('');
  const [candidates, setCandidates] = useState<CandidateResult | null>(null);

  // Textarea ref for precise cursor insertion
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate live text metrics
  const textStats = getArabicTextStats(text);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('app');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync dynamic document title and description with admin SEO settings
  useEffect(() => {
    if (adminSettings.seo?.siteTitle) {
      document.title = adminSettings.seo.siteTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && adminSettings.seo?.metaDescription) {
      metaDesc.setAttribute('content', adminSettings.seo.metaDescription);
    }
  }, [adminSettings.seo]);

  // Handle saving new admin settings
  const handleSaveAdminSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    saveAdminSettings(newSettings);
  };

  // Handle resetting admin settings
  const handleResetAdminSettings = () => {
    const fresh = resetAdminSettings();
    setAdminSettings(fresh);
  };

  // Track ad click simulation
  const handleAdClick = (slotId: AdSlotId) => {
    setAdminSettings(prev => {
      const unit = prev.adUnits[slotId];
      if (!unit) return prev;
      const updated = {
        ...prev,
        adUnits: {
          ...prev.adUnits,
          [slotId]: {
            ...unit,
            clicks: unit.clicks + 1,
          },
        },
      };
      saveAdminSettings(updated);
      return updated;
    });
  };

  // Insert text at current cursor location with zero latency
  const insertAtCursor = useCallback((strToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(prev => prev + strToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const nextText = current.substring(0, start) + strToInsert + current.substring(end);
    setText(nextText);

    // Reposition cursor right after inserted text
    const newPos = start + strToInsert.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    });
  }, []);

  // Backspace at current cursor position
  const handleBackspace = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(prev => prev.slice(0, -1));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    if (start !== end) {
      const nextText = current.substring(0, start) + current.substring(end);
      setText(nextText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      });
    } else if (start > 0) {
      const nextText = current.substring(0, start - 1) + current.substring(end);
      setText(nextText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 1, start - 1);
      });
    }
  }, []);

  // Handle Space key with custom dictionary lookup
  const handleSpace = useCallback(() => {
    if (isTransliterationActive && currentWord && candidates && candidates.primary) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const current = textarea.value;
        const wordStart = start - currentWord.length;
        if (wordStart >= 0) {
          const next = current.substring(0, wordStart) + candidates.primary + ' ' + current.substring(start);
          setText(next);
          setCurrentWord('');
          setCandidates(null);
          requestAnimationFrame(() => {
            const newPos = wordStart + candidates.primary.length + 1;
            textarea.focus();
            textarea.setSelectionRange(newPos, newPos);
          });
          return;
        }
      }
    }

    insertAtCursor(' ');
    setCurrentWord('');
    setCandidates(null);
  }, [isTransliterationActive, currentWord, candidates, insertAtCursor]);

  // Handle Enter key
  const handleEnter = useCallback(() => {
    insertAtCursor('\n');
    setCurrentWord('');
    setCandidates(null);
  }, [insertAtCursor]);

  // Handle selecting a candidate from the suggestions bar
  const handleSelectCandidate = useCallback((chosenArabic: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(prev => prev + ' ' + chosenArabic);
      setCurrentWord('');
      setCandidates(null);
      return;
    }

    const start = textarea.selectionStart;
    const current = textarea.value;
    const wordStart = Math.max(0, start - currentWord.length);

    const next = current.substring(0, wordStart) + chosenArabic + ' ' + current.substring(start);
    setText(next);
    setCurrentWord('');
    setCandidates(null);

    requestAnimationFrame(() => {
      const newPos = wordStart + chosenArabic.length + 1;
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    });
  }, [currentWord]);

  // Direct searches
  const handleGoogleSearch = () => {
    const query = text.trim();
    if (!query) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=ar`, '_blank', 'noopener,noreferrer');
  };

  const handleYouTubeSearch = () => {
    const query = text.trim();
    if (!query) return;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  // Listen to physical keyboard events on textarea for Arabizi transliteration
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTransliterationActive) return;

    if (soundEnabled && !['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      soundManager.playClick();
    }

    // Number keys select candidate
    if (candidates && candidates.primary && ['1', '2', '3', '4', '5'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const choices = [candidates.primary, ...(candidates.alternatives || [])];
      if (choices[idx]) {
        e.preventDefault();
        handleSelectCandidate(choices[idx]);
        return;
      }
    }

    // Space key triggers conversion
    if (e.key === ' ' && currentWord && candidates && candidates.primary) {
      e.preventDefault();
      handleSelectCandidate(candidates.primary);
      return;
    }

    // Backspace updates current word
    if (e.key === 'Backspace') {
      if (currentWord.length > 0) {
        const nextWord = currentWord.slice(0, -1);
        setCurrentWord(nextWord);
        if (nextWord) {
          setCandidates(getArabicCandidates(nextWord, adminSettings.customDictionary));
        } else {
          setCandidates(null);
        }
      }
      return;
    }

    // Character key: track Latin/number token
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const isLatinOrDigit = /^[a-zA-Z0-9']$/.test(e.key);
      if (isLatinOrDigit) {
        const nextWord = currentWord + e.key;
        setCurrentWord(nextWord);
        setCandidates(getArabicCandidates(nextWord, adminSettings.customDictionary));
      } else {
        setCurrentWord('');
        setCandidates(null);
      }
    }
  };

  // If currently in Admin view, render AdminAdsManager
  if (currentView === 'admin') {
    return (
      <AdminAdsManager
        settings={adminSettings}
        onSaveSettings={handleSaveAdminSettings}
        onResetSettings={handleResetAdminSettings}
        onBackToApp={() => {
          setCurrentView('app');
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  // Regular App View
  return (
    <div className={`min-h-screen ${activeTheme.bgClass} flex flex-col transition-colors duration-200 font-sans`}>
      {/* Top SaaS Navigation Header */}
      <header className={`w-full py-2 px-3 sm:px-6 flex items-center justify-between border-b ${activeTheme.headerBgClass} shadow-sm select-none`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
            ض
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight font-arabic">
                Clavier Arabe Pro
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white hidden sm:inline">
                SaaS v2.4
              </span>
            </div>
            <p className="text-[11px] opacity-80 hidden md:block">
              أسرع لوحة مفاتيح عربية افتراضية مع محرك ياملي الفوري
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className="hidden lg:block">
            <ThemeSelector currentTheme={themeId} onSelectTheme={setThemeId} />
          </div>

          {/* Admin Dashboard Entry Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setCurrentView('admin');
              window.location.hash = '#admin';
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
            title="تخصيص صور الإعلانات والبنرات والروابط"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">إدارة الإعلانات والصور</span>
          </button>

          {/* Go Pro / SaaS Pricing Button */}
          <button
            type="button"
            onClick={() => setIsProModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isPro
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{isPro ? 'عضوية Pro نشطة' : 'ترقية Pro'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Theme Selector Drawer */}
      <div className="lg:hidden w-full bg-white/80 border-b border-slate-200 px-3 py-1 flex items-center justify-between">
        <ThemeSelector currentTheme={themeId} onSelectTheme={setThemeId} />
        <button
          type="button"
          onClick={() => {
            setCurrentView('admin');
            window.location.hash = '#admin';
          }}
          className="text-xs text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded font-bold whitespace-nowrap"
        >
          إدارة الإعلانات والصور
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 flex gap-4">
        {/* Left / Center Main Applet */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          {/* Top Leaderboard Ad Slot (728x90) configured via Admin */}
          <AdBanner
            slot="leaderboard"
            config={adminSettings.adUnits.leaderboard}
            globalEnabled={adminSettings.globalAdsEnabled}
            isPro={isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
            onAdClick={handleAdClick}
          />

          {/* The Main Keyboard & Editor Card */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden flex flex-col">
            {/* 1. Top Search Bar */}
            <TopSearchBar
              currentText={text}
              theme={activeTheme}
            />

            {/* 2. Action Toolbar */}
            <ActionToolbar
              text={text}
              setText={setText}
              isVirtualVisible={isVirtualVisible}
              setIsVirtualVisible={setIsVirtualVisible}
              isTransliterationActive={isTransliterationActive}
              setIsTransliterationActive={setIsTransliterationActive}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              fontSize={fontSize}
              setFontSize={setFontSize}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              onOpenSnippets={() => setIsSnippetsOpen(true)}
            />

            {/* 3. Live Arabizi Suggestions Bar */}
            <ArabiziSuggestionsBar
              currentWord={currentWord}
              candidates={candidates}
              onSelectCandidate={handleSelectCandidate}
              accentClass={activeTheme.accentClass}
            />

            {/* 4. Textarea Editor Box */}
            <div className="relative w-full bg-white">
              <textarea
                ref={textareaRef}
                dir="rtl"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="اكتب هنا بالعربية، أو استخدم لوحة المفاتيح الافتراضية بالأسفل، أو اكتب بالحروف اللاتينية (عربيزي/فرانكو) للتحويل التلقائي..."
                style={{ fontSize: `${fontSize}px` }}
                className={`w-full min-h-[170px] sm:min-h-[200px] p-4 text-slate-900 border-none focus:outline-none resize-y leading-relaxed ${fontFamily}`}
              />

              {/* Text Area Bottom Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-3 py-1 bg-slate-50 border-t border-slate-200 select-none">
                <div className="flex items-center gap-3">
                  <span>الكلمات: <strong className="text-slate-800">{textStats.words}</strong></span>
                  <span>الحروف: <strong className="text-slate-800">{textStats.characters}</strong></span>
                  <span>حركات التشكيل: <strong className="text-slate-800">{textStats.harakatCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  {isTransliterationActive && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>نظام ياملي نشط</span>
                    </span>
                  )}
                  <span>ترميز UTF-8</span>
                </div>
              </div>
            </div>

            {/* Resizing divider bar */}
            <div className="w-full bg-slate-200 h-2 flex items-center justify-center cursor-row-resize border-t border-b border-slate-300 select-none">
              <div className="w-8 h-1 bg-slate-400 rounded-full"></div>
            </div>

            {/* 5. Onscreen Virtual Keyboard */}
            {isVirtualVisible && (
              <VirtualKeyboard
                onInsertChar={insertAtCursor}
                onBackspace={handleBackspace}
                onEnter={handleEnter}
                onSpace={handleSpace}
                onGoogleSearch={handleGoogleSearch}
                onYouTubeSearch={handleYouTubeSearch}
                theme={activeTheme}
              />
            )}
          </div>

          {/* Native In-Feed Ad Slot configured via Admin */}
          <AdBanner
            slot="native"
            config={adminSettings.adUnits.native}
            globalEnabled={adminSettings.globalAdsEnabled}
            isPro={isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
            onAdClick={handleAdClick}
          />

          {/* Programmatic SEO (PSEO) Informational Content & Guides */}
          {adminSettings.seo.enablePseoTabs && (
            <PseoContent
              activeTab={activePseoTab}
              setActiveTab={setActivePseoTab}
            />
          )}
        </div>

        {/* Right Skyscraper Ad Slot configured via Admin */}
        <AdBanner
          slot="skyscraper"
          config={adminSettings.adUnits.skyscraper}
          globalEnabled={adminSettings.globalAdsEnabled}
          isPro={isPro}
          onOpenProModal={() => setIsProModalOpen(true)}
          onAdClick={handleAdClick}
        />
      </main>

      {/* Sticky Mobile Footer Ad Slot */}
      <AdBanner
        slot="sticky_footer"
        config={adminSettings.adUnits.sticky_footer}
        globalEnabled={adminSettings.globalAdsEnabled}
        isPro={isPro}
        onOpenProModal={() => setIsProModalOpen(true)}
        onAdClick={handleAdClick}
      />

      {/* SEO & Arabic Keyboard Information Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 text-xs py-8 mt-12 border-t border-slate-800 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div>
            <div className="font-bold text-white text-sm mb-1 font-arabic">
              Clavier Arabe Pro – لوحة مفاتيح عربية ذكية وسريعة
            </div>
            <p className="text-slate-400 text-[11px] max-w-xl">
              تطبيق الويب الأول لكتابة الحروف العربية وتشكيل النصوص والتحويل الفوري من لغة الشات (الفرانكو/عربيزي) بدون أي تأخير ومجاناً 100%.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-xs">
            <button
              type="button"
              onClick={() => setActivePseoTab('keyboard')}
              className="hover:text-white cursor-pointer"
            >
              الكيبورد العربي
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePseoTab('yamli')}
              className="hover:text-white cursor-pointer"
            >
              عربيزي ياملي
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePseoTab('tashkeel')}
              className="hover:text-white cursor-pointer"
            >
              حركات التشكيل
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePseoTab('faq')}
              className="hover:text-white cursor-pointer"
            >
              الأسئلة الشائعة
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = '#admin';
              }}
              className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              إدارة الإعلانات والصور
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={isPro}
        onTogglePro={() => setIsPro(!isPro)}
      />

      <TextSnippetsDrawer
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        onInsertSnippet={insertAtCursor}
      />
    </div>
  );
}
