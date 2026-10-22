import React, { useState } from 'react';
import {
  AdminSettings,
  AdSlotId,
  AdUnitConfig,
} from '../../types.ts';
import {
  PRESET_BANNER_IMAGES,
} from '../../utils/adminStorage.ts';
import { soundManager } from '../../utils/sound.ts';
import {
  Megaphone,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  RotateCcw,
  ExternalLink,
  Shield,
  Save,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sliders,
  Sparkles,
  Layout
} from 'lucide-react';

interface AdminAdsManagerProps {
  settings: AdminSettings;
  onSaveSettings: (newSettings: AdminSettings) => void;
  onResetSettings: () => void;
  onBackToApp: () => void;
}

export const AdminAdsManager: React.FC<AdminAdsManagerProps> = ({
  settings,
  onSaveSettings,
  onResetSettings,
  onBackToApp,
}) => {
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>(settings);
  const [selectedSlot, setSelectedSlot] = useState<AdSlotId>('leaderboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeUnit = currentSettings.adUnits[selectedSlot];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSave = () => {
    soundManager.playClick(1.2);
    onSaveSettings(currentSettings);
    showToast('تم حفظ تغييرات الإعلانات والصور بنجاح!');
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من استعادة إعدادات وصور الإعلانات الافتراضية؟')) {
      soundManager.playThud();
      onResetSettings();
      showToast('تمت استعادة الإعلانات والصور الافتراضية');
    }
  };

  const handleUpdateUnit = (updates: Partial<AdUnitConfig>) => {
    setCurrentSettings(prev => ({
      ...prev,
      adUnits: {
        ...prev.adUnits,
        [selectedSlot]: {
          ...prev.adUnits[selectedSlot],
          ...updates,
        },
      },
    }));
  };

  const handleSelectPresetImage = (url: string) => {
    soundManager.playClick();
    handleUpdateUnit({ imageUrl: url });
    showToast('تم تطبيق الصورة على الإعلان');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg">
            ض
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                إدارة الإعلانات والصور (Ads & Images Manager)
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                لوحة التحكم المباشرة
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              تخصيص صور البنرات، الروابط، النصوص الدعائية، ووحدات Google AdSense
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            title="استعادة الصور والإعلانات الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">استعادة الافتراضي</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ التغييرات</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer mr-2"
          >
            <span>معاينة الموقع المباشر</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Global Ads Toggle Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-semibold">حالة عرض الإعلانات في الموقع:</span>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setCurrentSettings(prev => ({ ...prev, globalAdsEnabled: !prev.globalAdsEnabled }));
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
              currentSettings.globalAdsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {currentSettings.globalAdsEnabled ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-400" />
                <span>الإعلانات نشطة</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-500" />
                <span>الإعلانات متوقفة</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">معرف ناشر Google AdSense:</span>
          <input
            type="text"
            dir="ltr"
            value={currentSettings.adsensePublisherId}
            onChange={(e) => setCurrentSettings(prev => ({ ...prev, adsensePublisherId: e.target.value }))}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-amber-300 font-mono text-xs w-48 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Ad Slot Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {(Object.keys(currentSettings.adUnits) as AdSlotId[]).map((slotId) => {
            const unit = currentSettings.adUnits[slotId];
            const isSelected = selectedSlot === slotId;

            return (
              <button
                key={slotId}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSlot(slotId);
                }}
                className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  <span>{unit.nameAr}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  unit.enabled
                    ? isSelected ? 'bg-slate-950 text-white font-bold' : 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {unit.enabled ? 'مفعل' : 'معطل'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Visual Editor & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Configuration Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>إعدادات: {activeUnit.nameAr}</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  المعرف: {activeUnit.id}
                </span>
              </div>

              {/* Individual Enable Toggle */}
              <button
                type="button"
                onClick={() => handleUpdateUnit({ enabled: !activeUnit.enabled })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeUnit.enabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {activeUnit.enabled ? <ToggleRight className="w-4 h-4 text-white" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{activeUnit.enabled ? 'الإعلان مفعل' : 'الإعلان معطل'}</span>
              </button>
            </div>

            {/* Provider: Custom Banner vs AdSense */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نوع الإعلان (Ad Provider):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateUnit({ provider: 'custom' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeUnit.provider === 'custom'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  بنر ترويجي مخصص بصورة (Custom Banner)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateUnit({ provider: 'adsense' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeUnit.provider === 'adsense'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Google AdSense كود تلقائي
                </button>
              </div>
            </div>

            {/* Image URL Input & Presets */}
            {activeUnit.provider === 'custom' && (
              <div className="space-y-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>رابط صورة البنر (Image URL):</span>
                  </label>
                  <span className="text-[11px] text-slate-400">يدعم أي رابط صورة مباشر</span>
                </div>

                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://example.com/banner.jpg"
                  value={activeUnit.imageUrl || ''}
                  onChange={(e) => handleUpdateUnit({ imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-300 font-mono focus:outline-none focus:border-amber-400"
                />

                {/* Preset Banner Images Gallery */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                    أو اختر صورة جاهزة عالية الدقة بنقرة واحدة:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_BANNER_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPresetImage(preset.url)}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border text-right transition-all cursor-pointer ${
                          activeUnit.imageUrl === preset.url
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-8 h-8 rounded object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] line-clamp-1">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ad Copy & Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  عنوان الإعلان (Headline):
                </label>
                <input
                  type="text"
                  value={activeUnit.customTitle}
                  onChange={(e) => handleUpdateUnit({ customTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  نص الزر التفاعلي (Button CTA):
                </label>
                <input
                  type="text"
                  value={activeUnit.customCta}
                  onChange={(e) => handleUpdateUnit({ customCta: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">
                  وصف الإعلان (Description):
                </label>
                <input
                  type="text"
                  value={activeUnit.customDescription}
                  onChange={(e) => handleUpdateUnit({ customDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>رابط الوجهة (Destination URL):</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={activeUnit.customLink}
                  onChange={(e) => handleUpdateUnit({ customLink: e.target.value })}
                  placeholder="https://your-product.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-blue-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  شارة الرعاية (Badge Text):
                </label>
                <input
                  type="text"
                  value={activeUnit.customBadge}
                  onChange={(e) => handleUpdateUnit({ customBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Real-Time Live Preview */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>المعاينة المباشرة (Live Real-Time Preview)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeUnit.id.toUpperCase()}
                </span>
              </div>

              {/* Render Preview according to slot */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-center min-h-[220px]">
                {selectedSlot === 'leaderboard' && (
                  <div className="w-full bg-gradient-to-r from-slate-100 via-amber-50/60 to-slate-100 border border-slate-300 rounded p-3 text-slate-900 flex items-center justify-between gap-3 shadow">
                    <div className="flex items-center gap-3">
                      {activeUnit.imageUrl ? (
                        <img
                          src={activeUnit.imageUrl}
                          alt={activeUnit.customTitle}
                          className="w-14 h-14 rounded-lg object-cover shadow border border-slate-300 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shrink-0">
                          ع
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{activeUnit.customTitle}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{activeUnit.customDescription}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded shrink-0">
                      {activeUnit.customCta}
                    </span>
                  </div>
                )}

                {selectedSlot === 'skyscraper' && (
                  <div className="w-48 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 text-center flex flex-col justify-between shadow min-h-[300px]">
                    <div className="space-y-2">
                      {activeUnit.imageUrl ? (
                        <img
                          src={activeUnit.imageUrl}
                          alt={activeUnit.customTitle}
                          className="w-full h-24 rounded-lg object-cover shadow border border-slate-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-amber-500 text-white rounded-xl mx-auto flex items-center justify-center font-bold">
                          ★
                        </div>
                      )}
                      <div className="text-xs font-bold">{activeUnit.customTitle}</div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{activeUnit.customDescription}</p>
                    </div>
                    <span className="w-full py-1.5 bg-amber-500 text-white text-xs font-bold rounded mt-3">
                      {activeUnit.customCta}
                    </span>
                  </div>
                )}

                {selectedSlot === 'native' && (
                  <div className="w-full bg-gradient-to-l from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-3 text-slate-900 flex items-center justify-between gap-3 shadow">
                    <div className="flex items-center gap-3">
                      {activeUnit.imageUrl ? (
                        <img
                          src={activeUnit.imageUrl}
                          alt={activeUnit.customTitle}
                          className="w-12 h-12 rounded-lg object-cover shadow border border-indigo-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900">{activeUnit.customTitle}</div>
                        <div className="text-[11px] text-slate-600">{activeUnit.customDescription}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded shrink-0">
                      {activeUnit.customCta}
                    </span>
                  </div>
                )}

                {selectedSlot === 'sticky_footer' && (
                  <div className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow">
                    <div className="flex items-center gap-2 truncate">
                      {activeUnit.imageUrl ? (
                        <img
                          src={activeUnit.imageUrl}
                          alt={activeUnit.customTitle}
                          className="w-8 h-8 rounded object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs rounded shrink-0">
                          ض
                        </div>
                      )}
                      <span className="text-xs font-bold truncate">{activeUnit.customTitle}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded shrink-0">
                      {activeUnit.customCta}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ جميع تغييرات الإعلانات والصور</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
