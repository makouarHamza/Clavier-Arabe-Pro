import React from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { soundManager } from '../utils/sound.ts';

interface TextSnippetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (snippet: string) => void;
}

export const TextSnippetsDrawer: React.FC<TextSnippetsDrawerProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
}) => {
  if (!isOpen) return null;

  const islamicPhrases = [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    'جَزَاكُمُ اللَّهُ خَيْرًا',
    'مَا شَاءَ اللَّهُ تَبَارَكَ اللَّهُ',
    'إِنْ شَاءَ اللَّهُ تَعَالَى',
    'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
  ];

  const businessPhrases = [
    'تحياتي الطيبة وتمنياتي لكم بالتوفيق والسداد،',
    'شكراً جزيلاً لتعاونكم المثمر والدائم،',
    'بناءً على تواصلنا الأخير، يرجى التكرم بالاطلاع على التفاصيل المرفقة.',
    'في انتظار ردكم الكريم مع خالص المودة والتقدير.',
    'تقبلوا منا فائق الاحترام والتقدير.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">عبارات ونصوص جاهزة سريعة</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-right">
          <div>
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              عبارات إسلامية مشكولة
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {islamicPhrases.map((phrase, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onInsertSnippet(phrase);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 text-sm font-medium transition-colors cursor-pointer text-right"
                >
                  <span className="font-arabic leading-relaxed">{phrase}</span>
                  <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              مقدمات وخواتيم مراسلات رسمية
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {businessPhrases.map((phrase, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onInsertSnippet(phrase);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-800 text-sm font-medium transition-colors cursor-pointer text-right"
                >
                  <span className="font-arabic leading-relaxed">{phrase}</span>
                  <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
