import React from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeId } from '../types.ts';
import { THEMES } from '../utils/themes.ts';
import { soundManager } from '../utils/sound.ts';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium pl-1 select-none">
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">الثيم:</span>
      </div>

      <div className="flex items-center gap-1.5">
        {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
          const theme = THEMES[themeKey];
          const isActive = currentTheme === themeKey;

          return (
            <button
              key={themeKey}
              type="button"
              onClick={() => {
                soundManager.playClick();
                onSelectTheme(themeKey);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-indigo-400'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
              title={theme.name}
            >
              {isActive && <Check className="w-3 h-3 text-emerald-400" />}
              <span>{theme.nameAr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
