import React from 'react';
import { Sparkles } from 'lucide-react';
import { CandidateResult } from '../utils/transliteration.ts';
import { soundManager } from '../utils/sound.ts';

interface ArabiziSuggestionsBarProps {
  currentWord: string;
  candidates: CandidateResult | null;
  onSelectCandidate: (word: string) => void;
  accentClass: string;
}

export const ArabiziSuggestionsBar: React.FC<ArabiziSuggestionsBarProps> = ({
  currentWord,
  candidates,
  onSelectCandidate,
  accentClass,
}) => {
  if (!currentWord || !candidates || !candidates.primary) {
    return null;
  }

  const allChoices = [candidates.primary, ...(candidates.alternatives || [])].slice(0, 5);

  return (
    <div className="w-full bg-slate-900/90 text-white backdrop-blur px-3 py-1.5 flex items-center justify-between gap-2 shadow-lg border-b border-indigo-500/40 select-none animate-fadeIn">
      <div className="flex items-center gap-1.5 text-xs text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-bold">
          {currentWord}
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">← اختر الكلمة:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {allChoices.map((choice, index) => (
          <button
            key={`${choice}-${index}`}
            type="button"
            onClick={() => {
              soundManager.playClick(1.1);
              onSelectCandidate(choice);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-sm font-semibold transition-transform active:scale-95 cursor-pointer ${
              index === 0
                ? `${accentClass} shadow-md`
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">{index + 1}.</span>
            <span className="font-arabic">{choice}</span>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-slate-400 hidden md:block">
        اضغط <kbd className="bg-slate-800 px-1 rounded border border-slate-700">المسافة</kbd> أو الرقم
      </div>
    </div>
  );
};
