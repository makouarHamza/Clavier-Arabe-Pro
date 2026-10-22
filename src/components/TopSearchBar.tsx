import React, { useState } from 'react';
import { Search, ExternalLink, Globe } from 'lucide-react';
import { ThemeConfig } from '../types.ts';

interface TopSearchBarProps {
  currentText: string;
  theme: ThemeConfig;
  onSetText?: (text: string) => void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({ currentText, theme }) => {
  const [searchTarget, setSearchTarget] = useState<'google' | 'youtube' | 'images' | 'yahoo'>('google');
  const [exactPhrase, setExactPhrase] = useState(false);

  const handleSearch = (target?: 'google' | 'youtube' | 'images' | 'yahoo') => {
    const activeTarget = target || searchTarget;
    const query = currentText.trim();
    if (!query) return;

    const formattedQuery = exactPhrase ? `"${query}"` : query;
    let url = '';

    switch (activeTarget) {
      case 'google':
        url = `https://www.google.com/search?q=${encodeURIComponent(formattedQuery)}&hl=ar&lr=lang_ar`;
        break;
      case 'youtube':
        url = `https://www.youtube.com/results?search_query=${encodeURIComponent(formattedQuery)}`;
        break;
      case 'images':
        url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(formattedQuery)}`;
        break;
      case 'yahoo':
        url = `https://search.yahoo.com/search?p=${encodeURIComponent(formattedQuery)}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(formattedQuery)}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full select-none">
      {/* Top Search Engines Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-700 bg-slate-200/80 px-2 py-1.5 border-b border-slate-300">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => { setSearchTarget('google'); handleSearch('google'); }}
            className={`font-semibold transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded ${
              searchTarget === 'google' ? 'text-blue-600 bg-white/70' : 'hover:text-blue-600'
            }`}
          >
            <span className="text-blue-600">G</span>
            <span className="text-red-500">o</span>
            <span className="text-amber-500">o</span>
            <span className="text-blue-600">g</span>
            <span className="text-green-600">l</span>
            <span className="text-red-500">e</span>
          </button>

          <span className="text-slate-400">|</span>

          <button
            type="button"
            onClick={() => { setSearchTarget('youtube'); handleSearch('youtube'); }}
            className={`font-semibold transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded ${
              searchTarget === 'youtube' ? 'text-red-600 bg-white/70' : 'hover:text-red-600'
            }`}
          >
            <span className="text-slate-900">You</span>
            <span className="bg-red-600 text-white text-[10px] px-1 rounded font-bold">Tube</span>
          </button>

          <span className="text-slate-400">|</span>

          <button
            type="button"
            onClick={() => { setSearchTarget('images'); handleSearch('images'); }}
            className={`font-medium transition-colors px-1.5 py-0.5 rounded ${
              searchTarget === 'images' ? 'text-blue-700 bg-white/70 font-semibold' : 'hover:text-blue-700'
            }`}
          >
            صور (Images)
          </button>

          <span className="text-slate-400">|</span>

          <button
            type="button"
            onClick={() => { setSearchTarget('yahoo'); handleSearch('yahoo'); }}
            className={`font-bold transition-colors text-purple-700 px-1.5 py-0.5 rounded ${
              searchTarget === 'yahoo' ? 'bg-white/70' : 'hover:text-purple-800'
            }`}
          >
            Yahoo!
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">محرك البحث المباشر</span>
        </div>
      </div>

      {/* Main Search Input Form with Direct Google/بحث Button */}
      <div className="flex items-center gap-2 p-2 bg-gradient-to-b from-[#f8f9fa] to-[#e8ecef] border-b border-[#c8d0d8]">
        {/* Google / Brand Logo Marker */}
        <div className="hidden sm:flex items-center gap-1 font-bold text-base select-none px-1">
          <span className="text-blue-600 text-lg">G</span>
          <span className="text-red-500 text-lg">o</span>
          <span className="text-amber-500 text-lg">o</span>
          <span className="text-blue-600 text-lg">g</span>
          <span className="text-green-600 text-lg">l</span>
          <span className="text-red-500 text-lg">e</span>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={exactPhrase}
            onChange={(e) => setExactPhrase(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
            title="بحث عن العبارة بدقة"
          />
          <span className="text-[11px] text-slate-500 hidden md:inline">عبارة دقيقة</span>
        </label>

        {/* Search Input Box */}
        <div className="flex-1 relative">
          <input
            type="text"
            dir="rtl"
            value={currentText}
            readOnly
            placeholder="النص المكتوب سيظهر هنا للبحث المباشر..."
            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-sm text-slate-800 shadow-inner focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Orange/Red Classic Search Button */}
        <button
          type="button"
          onClick={() => handleSearch()}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded bg-gradient-to-b from-[#ff7a22] to-[#d64a00] hover:from-[#ff8838] hover:to-[#e05000] text-white font-bold text-xs sm:text-sm shadow active:translate-y-0.5 border border-[#ba3b00] transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Search</span>
          <span className="font-arabic font-extrabold">بحث</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </button>
      </div>

      {/* Decorative Ribbon from screenshot */}
      <div className="h-2 w-full bg-gradient-to-r from-[#1c4b82] via-[#3d7fc4] to-[#1a4477] shadow-sm"></div>
    </div>
  );
};
