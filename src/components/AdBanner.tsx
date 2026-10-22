import React, { useState } from 'react';
import { Sparkles, Crown, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { AdSlotId, AdUnitConfig } from '../types.ts';

interface AdBannerProps {
  slot: AdSlotId;
  config?: AdUnitConfig;
  globalEnabled?: boolean;
  isPro?: boolean;
  onOpenProModal?: () => void;
  onAdClick?: (slotId: AdSlotId) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  config,
  globalEnabled = true,
  isPro = false,
  onOpenProModal,
  onAdClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // If user upgraded to Pro or global ads are disabled or this unit is disabled
  if (isPro || !globalEnabled || (config && !config.enabled)) {
    return null;
  }

  const handleBannerClick = () => {
    if (onAdClick) {
      onAdClick(slot);
    }
    if (config?.customLink) {
      if (config.customLink === '#pro' && onOpenProModal) {
        onOpenProModal();
      } else {
        window.open(config.customLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // 1. LEADERBOARD (728x90)
  if (slot === 'leaderboard') {
    const title = config?.customTitle || 'تعلم اللغة العربية وقواعد النحو التفاعلية';
    const desc = config?.customDescription || 'منصة رقمية لتعليم الإملاء والخط العربي للمحترفين بالذكاء الاصطناعي';
    const cta = config?.customCta || 'اكتشف المزيد';
    const badge = config?.customBadge || 'إعلان ممول / SPONSORED';
    const imageUrl = config?.imageUrl;
    const isAdSense = config?.provider === 'adsense';

    return (
      <div className="w-full flex flex-col items-center my-2 select-none">
        <div className="flex items-center justify-between w-full max-w-[728px] text-[10px] text-slate-400 px-1 mb-0.5">
          <span className="flex items-center gap-1 font-mono uppercase tracking-wider">
            {badge} {isAdSense && '• Google AdSense'}
          </span>
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>إزالة الإعلانات مع Pro</span>
            </button>
          )}
        </div>

        <div
          onClick={handleBannerClick}
          className="w-full max-w-[728px] min-h-[90px] bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100 hover:from-amber-50/60 hover:to-indigo-50/60 border border-slate-300 rounded flex items-center justify-between p-3 sm:px-4 shadow-xs overflow-hidden relative cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shadow border border-slate-300 shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow shrink-0 group-hover:scale-105 transition-transform">
                ع
              </div>
            )}
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {title}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                {desc}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 mr-2">
            <span className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm whitespace-nowrap transition-colors flex items-center gap-1">
              <span>{cta}</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. SKYSCRAPER (160x600)
  if (slot === 'skyscraper') {
    const title = config?.customTitle || 'Clavier Arabe SaaS Pro';
    const desc = config?.customDescription || 'تجربة كتابة بدون إعلانات مع تشكيل آلي ذكي، وتصدير PDF منسق، ونسخ سحابي فوري.';
    const cta = config?.customCta || 'جرّب النسخة الاحترافية';
    const badge = config?.customBadge || 'عضوية مميزة / PRO';
    const imageUrl = config?.imageUrl;

    return (
      <div className="hidden xl:flex flex-col items-center w-[160px] 2xl:w-[280px] select-none sticky top-4">
        <div className="flex items-center justify-between w-full text-[10px] text-slate-400 px-1 mb-0.5">
          <span>{badge}</span>
          {onOpenProModal && (
            <button
              type="button"
              onClick={onOpenProModal}
              className="text-amber-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Pro</span>
            </button>
          )}
        </div>

        <div
          onClick={handleBannerClick}
          className="w-full min-h-[580px] bg-slate-50 hover:bg-amber-50/30 border border-slate-300 rounded p-4 flex flex-col justify-between items-center text-center shadow-xs cursor-pointer transition-colors overflow-hidden"
        >
          <div className="space-y-3 w-full">
            {imageUrl && !imageError ? (
              <div className="w-full h-36 rounded-xl overflow-hidden shadow-sm border border-slate-300">
                <img
                  src={imageUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Crown className="w-7 h-7" />
              </div>
            )}
            <div className="font-bold text-slate-800 text-sm">
              {title}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {desc}
            </p>
          </div>

          <div className="w-full space-y-2 mt-4">
            <span className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded shadow flex items-center justify-center gap-1">
              <span>{cta}</span>
              <ExternalLink className="w-3 h-3" />
            </span>
            <div className="text-[10px] text-slate-400">
              مخصص للأفراد والشركات
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. NATIVE IN-FEED
  if (slot === 'native') {
    const title = config?.customTitle || 'أدوات الترجمة والتدقيق اللغوي الآلي';
    const desc = config?.customDescription || 'دقّق مقالاتك ونصوصك العربية بنقرة زر واحدة وتخلّص من الأخطاء الإملائية.';
    const cta = config?.customCta || 'تجربة مجانية';
    const badge = config?.customBadge || 'إعلان مدعوم / SPONSORED';
    const imageUrl = config?.imageUrl;

    return (
      <div className="w-full my-4 select-none">
        <div className="text-[10px] text-slate-400 mb-1 text-center font-mono uppercase tracking-wider">
          {badge}
        </div>
        <div
          onClick={handleBannerClick}
          className="bg-gradient-to-l from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100/70 hover:to-purple-100/70 border border-indigo-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-12 h-12 rounded-lg object-cover shadow border border-indigo-200 shrink-0"
              />
            ) : (
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="font-bold text-slate-800 text-sm">
                {title}
              </div>
              <div className="text-xs text-slate-600">
                {desc}
              </div>
            </div>
          </div>
          <span className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow flex items-center gap-1 shrink-0">
            <span>{cta}</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  }

  // 4. STICKY MOBILE FOOTER (320x50)
  if (slot === 'sticky_footer') {
    const title = config?.customTitle || 'حمّل تطبيق لوحة المفاتيح العربية للهواتف';
    const cta = config?.customCta || 'تحميل مباشر';
    const imageUrl = config?.imageUrl;

    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 text-white border-t border-slate-700 p-2 sm:hidden flex items-center justify-between shadow-2xl backdrop-blur select-none">
        <div className="flex items-center gap-2 truncate pr-2">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-8 h-8 rounded-md object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
              ض
            </div>
          )}
          <div className="text-xs font-bold truncate">
            {title}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleBannerClick}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded shadow cursor-pointer whitespace-nowrap"
          >
            {cta}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
