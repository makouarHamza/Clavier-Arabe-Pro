import React, { useState } from 'react';
import {
  AdminSettings,
  AdSlotId,
  AdUnitConfig,
  ThemeId,
} from '../../types.ts';
import { THEMES } from '../../utils/themes.ts';
import {
  calculateCtr,
  calculateEstimatedRevenue,
} from '../../utils/adminStorage.ts';
import { soundManager } from '../../utils/sound.ts';
import {
  LayoutDashboard,
  Megaphone,
  Search,
  BookA,
  Sliders,
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Eye,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  Monitor,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  settings: AdminSettings;
  onSaveSettings: (newSettings: AdminSettings) => void;
  onResetSettings: () => void;
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onSaveSettings,
  onResetSettings,
  onBackToApp,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'ads' | 'seo' | 'dictionary' | 'defaults'>('analytics');
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New word form state
  const [newLatin, setNewLatin] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [testInput, setTestInput] = useState('');

  // Revenue simulator settings
  const [simEcpm, setSimEcpm] = useState(1.85);
  const [simCpc, setSimCpc] = useState(0.12);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSave = () => {
    soundManager.playClick(1.2);
    onSaveSettings(currentSettings);
    showToast('تم حفظ جميع الإعدادات بنجاح!');
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط كافة الإعدادات إلى القيم الافتراضية؟')) {
      soundManager.playThud();
      onResetSettings();
      showToast('تمت استعادة الإعدادات الافتراضية');
    }
  };

  // Toggle specific ad unit
  const handleToggleAdUnit = (slotId: AdSlotId) => {
    soundManager.playClick();
    setCurrentSettings(prev => ({
      ...prev,
      adUnits: {
        ...prev.adUnits,
        [slotId]: {
          ...prev.adUnits[slotId],
          enabled: !prev.adUnits[slotId].enabled,
        },
      },
    }));
  };

  // Update specific ad unit configuration
  const handleUpdateAdUnit = (slotId: AdSlotId, updates: Partial<AdUnitConfig>) => {
    setCurrentSettings(prev => ({
      ...prev,
      adUnits: {
        ...prev.adUnits,
        [slotId]: {
          ...prev.adUnits[slotId],
          ...updates,
        },
      },
    }));
  };

  // Add custom dictionary word
  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLatin.trim() || !newArabic.trim()) return;

    soundManager.playClick(1.1);
    const newEntry = {
      id: Date.now().toString(),
      latin: newLatin.trim().toLowerCase(),
      arabic: newArabic.trim(),
    };

    setCurrentSettings(prev => ({
      ...prev,
      customDictionary: [newEntry, ...prev.customDictionary],
    }));

    setNewLatin('');
    setNewArabic('');
    showToast(`تمت إضافة "${newEntry.latin}" ← "${newEntry.arabic}"`);
  };

  // Remove custom word
  const handleRemoveWord = (id: string) => {
    soundManager.playThud();
    setCurrentSettings(prev => ({
      ...prev,
      customDictionary: prev.customDictionary.filter(w => w.id !== id),
    }));
    showToast('تم حذف الكلمة من القاموس');
  };

  // Aggregate stats
  const totalImpressions = Object.values(currentSettings.adUnits).reduce((sum, u) => sum + u.impressions, 0);
  const totalClicks = Object.values(currentSettings.adUnits).reduce((sum, u) => sum + u.clicks, 0);
  const totalRevenue = calculateEstimatedRevenue(totalImpressions, totalClicks, simEcpm, simCpc);
  const overallCtr = calculateCtr(totalClicks, totalImpressions);

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
                لوحة تحكم المشرف (Admin Suite)
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                إدارة الإعلانات والمحتوى
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              التحكم في وحدات Google AdSense، السيو PSEO، القواميس المخصصة، والمظهر الافتراضي
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            title="إعادة ضبط المصنع"
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
            <span>حفظ الإعدادات</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer mr-2"
          >
            <span>معاينة الموقع</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>نظرة عامة والأرباح</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ads'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>إدارة الإعلانات (Ads)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'seo'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>السيو والظهور في Google</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dictionary'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookA className="w-4 h-4" />
            <span>قاموس الفرانكو وعربيزي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('defaults')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'defaults'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>المظهر الافتراضي للموقع</span>
          </button>
        </aside>

        {/* Tab Content Panes */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: ANALYTICS & REVENUE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>الأرباح المقدرة</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>محسوبة وفق eCPM و CPC</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>مرات الظهور (Impressions)</span>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {totalImpressions.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    عبر 4 وحدات إعلانية مفعلة
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>النقرات (Clicks)</span>
                    <MousePointerClick className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">
                    {totalClicks.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    معدل النقر CTR: <strong className="text-white">{overallCtr}</strong>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>الكلمات المكتوبة</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-400">
                    {currentSettings.stats.totalWordsTyped.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    تحويلات ياملي: {currentSettings.stats.transliterationCount.toLocaleString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Ad Slots Performance Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>أداء الوحدات الإعلانية ومصادر الدخل</span>
                  </h2>
                  <span className="text-xs text-slate-400">مباشر ومحاكى</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">الوحدة الإعلانية</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">المزود</th>
                        <th className="p-3">الظهور</th>
                        <th className="p-3">النقرات</th>
                        <th className="p-3">CTR</th>
                        <th className="p-3">الدخل المقدر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {(Object.keys(currentSettings.adUnits) as AdSlotId[]).map((slotKey) => {
                        const unit = currentSettings.adUnits[slotKey];
                        const unitRev = calculateEstimatedRevenue(unit.impressions, unit.clicks, simEcpm, simCpc);
                        const unitCtr = calculateCtr(unit.clicks, unit.impressions);

                        return (
                          <tr key={slotKey} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-semibold text-white">
                              {unit.nameAr}
                            </td>
                            <td className="p-3">
                              {unit.enabled ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  نشط
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                  معطل
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-slate-300">
                              {unit.provider === 'adsense' ? 'Google AdSense' : 'Direct / Custom'}
                            </td>
                            <td className="p-3 text-slate-300">
                              {unit.impressions.toLocaleString('ar-EG')}
                            </td>
                            <td className="p-3 text-amber-300 font-bold">
                              {unit.clicks.toLocaleString('ar-EG')}
                            </td>
                            <td className="p-3 font-mono text-slate-300">
                              {unitCtr}
                            </td>
                            <td className="p-3 text-emerald-400 font-black">
                              ${unitRev.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revenue Simulation Inputs */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>محاكي تسعير وتوقعات الأرباح (eCPM / CPC Calculator)</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  يمكنك تعديل متوسط سعر الألف ظهور (eCPM) وتكلفة النقرة (CPC) لمعاينة الأرباح الشهرية المتوقعة بحسب كثافة الزيارات.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      متوسط سعر الألف ظهور eCPM ($):
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      value={simEcpm}
                      onChange={(e) => setSimEcpm(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      متوسط تكلفة النقرة CPC ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={simCpc}
                      onChange={(e) => setSimCpc(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AD MANAGEMENT & ADSENSE */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              {/* Global Ad Controls Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span>المفتاح الرئيسي للإعلانات (Global Ads Master Toggle)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      تشغيل أو إيقاف كافة الإعلانات بضغطة زر واحدة عبر جميع الصفحات والأجهزة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentSettings(prev => ({
                        ...prev,
                        globalAdsEnabled: !prev.globalAdsEnabled,
                      }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentSettings.globalAdsEnabled
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {currentSettings.globalAdsEnabled ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-300" />
                        <span>الإعلانات مفعلة عاماً</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                        <span>الإعلانات معطلة بالكامل</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      معرف ناشر Google AdSense (Publisher ID):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={currentSettings.adsensePublisherId}
                      onChange={(e) => setCurrentSettings(prev => ({ ...prev, adsensePublisherId: e.target.value }))}
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      كثافة عرض الإعلانات (Ad Density):
                    </label>
                    <select
                      value={currentSettings.adDensity}
                      onChange={(e) => setCurrentSettings(prev => ({ ...prev, adDensity: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="low">منخفضة (Low - تجربة مستخدم سريعة جداً)</option>
                      <option value="medium">متوازنة (Medium - الخيار الموصى به)</option>
                      <option value="high">مرتفعة (High - أقصى عائد إعلاني)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ad Slots Individual Config */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>تخصيص الوحدات الإعلانية ومحتوى البنرات</span>
                </h3>

                {(Object.keys(currentSettings.adUnits) as AdSlotId[]).map((slotId) => {
                  const unit = currentSettings.adUnits[slotId];

                  return (
                    <div
                      key={slotId}
                      className={`bg-slate-950 border rounded-2xl p-5 transition-all ${
                        unit.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleAdUnit(slotId)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              unit.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {unit.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {unit.nameAr}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Slot Key: {unit.id}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={unit.provider}
                            onChange={(e) => handleUpdateAdUnit(slotId, { provider: e.target.value as 'adsense' | 'custom' | 'direct_sponsor' })}
                            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200"
                          >
                            <option value="custom">بنر ترويجي مخصص (Custom Banner)</option>
                            <option value="adsense">Google AdSense تلقائي</option>
                            <option value="direct_sponsor">راعي مباشر (Direct Sponsor)</option>
                          </select>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">عنوان الإعلان (Title):</label>
                          <input
                            type="text"
                            value={unit.customTitle}
                            onChange={(e) => handleUpdateAdUnit(slotId, { customTitle: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">نص الزر التفاعلي (CTA):</label>
                          <input
                            type="text"
                            value={unit.customCta}
                            onChange={(e) => handleUpdateAdUnit(slotId, { customCta: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 mb-1">وصف الإعلان (Description):</label>
                          <input
                            type="text"
                            value={unit.customDescription}
                            onChange={(e) => handleUpdateAdUnit(slotId, { customDescription: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">رابط الوجهة (Target Link):</label>
                          <input
                            type="text"
                            dir="ltr"
                            value={unit.customLink}
                            onChange={(e) => handleUpdateAdUnit(slotId, { customLink: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-blue-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">شارة الرعاية (Badge Label):</label>
                          <input
                            type="text"
                            value={unit.customBadge}
                            onChange={(e) => handleUpdateAdUnit(slotId, { customBadge: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SEO & GOOGLE VISIBILITY */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    <span>إعدادات تحسين محركات البحث (PSEO & Meta Tags)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    ضبط العنوان والوصف والوسوم التي تظهر في نتائج بحث Google ومشاركات وسائل التواصل
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      عنوان الصفحة الرئيسي (&lt;title&gt;):
                    </label>
                    <input
                      type="text"
                      value={currentSettings.seo.siteTitle}
                      onChange={(e) => setCurrentSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, siteTitle: e.target.value },
                      }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                    <span className="text-[10px] text-slate-500">الطول الموصى به: 50-60 حرفاً</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      الوصف التعريفي (&lt;meta name=&quot;description&quot;&gt;):
                    </label>
                    <textarea
                      rows={3}
                      value={currentSettings.seo.metaDescription}
                      onChange={(e) => setCurrentSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value },
                      }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white leading-relaxed"
                    />
                    <span className="text-[10px] text-slate-500">الطول الموصى به: 120-160 حرفاً</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        معرف Google Analytics (GA4 Tag ID):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={currentSettings.seo.googleAnalyticsId}
                        onChange={(e) => setCurrentSettings(prev => ({
                          ...prev,
                          seo: { ...prev.seo, googleAnalyticsId: e.target.value },
                        }))}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        الرابط الدائم الكانونيكال (Canonical URL):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={currentSettings.seo.canonicalUrl}
                        onChange={(e) => setCurrentSettings(prev => ({
                          ...prev,
                          seo: { ...prev.seo, canonicalUrl: e.target.value },
                        }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-blue-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        إظهار محتوى المقالات والأسئلة الشائعة (PSEO Tabbed Sections)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        يعزز ظهور الموقع في الكلمات المفتاحية مثل &quot;clavier arabe&quot; و &quot;كيبورد التشكيل&quot;
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, enablePseoTabs: !prev.seo.enablePseoTabs },
                      }))}
                      className={`p-1.5 rounded-lg cursor-pointer ${
                        currentSettings.seo.enablePseoTabs
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {currentSettings.seo.enablePseoTabs ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM ARABIZI DICTIONARY */}
          {activeTab === 'dictionary' && (
            <div className="space-y-6">
              {/* Add New Word Form */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <BookA className="w-5 h-5 text-amber-400" />
                  <span>إضافة كلمة فرانكو/عربيزي جديدة للقاموس الذكي</span>
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  أضف الكلمات واللهجات الدارجة (المغاربية، الشامية، الخليجية، المصرية) لترجمتها فورياً إلى العربية أثناء الكتابة
                </p>

                <form onSubmit={handleAddWord} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      الكلمة باللاتيني / الفرانكو:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      placeholder="e.g. 3afak, finak, zwin"
                      value={newLatin}
                      onChange={(e) => setNewLatin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      المقابل باللغة العربية:
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      required
                      placeholder="مثال: عافاك، فينك، زوين"
                      value={newArabic}
                      onChange={(e) => setNewArabic(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة إلى القاموس</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Test Sandbox */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>مختبر الفحص الحي للكلمات المخصصة (Live Sandbox)</span>
                </h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="جرّب كتابة كلمة بالفرانكو لاختبار تحويلها (مثلاً: labas أو 3arab)..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                {testInput && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">النتيجة المقترحة:</span>
                    <span className="text-base font-bold text-emerald-400 font-arabic">
                      {currentSettings.customDictionary.find(w => w.latin === testInput.trim().toLowerCase())?.arabic ||
                        'التحويل الصوتي القياسي'}
                    </span>
                  </div>
                )}
              </div>

              {/* Dictionary List */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">
                    قائمة الكلمات المخصصة الحالية ({currentSettings.customDictionary.length})
                  </h3>
                </div>

                <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                  {currentSettings.customDictionary.map((entry) => (
                    <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {entry.latin}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 rotate-180" />
                        <span className="font-arabic font-bold text-base text-white">
                          {entry.arabic}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveWord(entry.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 cursor-pointer"
                        title="حذف الكلمة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SITE DEFAULTS */}
          {activeTab === 'defaults' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <span>تخصيص الإعدادات الافتراضية للزوار الجدد</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  اختر المظهر والحجم ونمط الكتابة الذي يظهر عند فتح الموقع لأول مرة
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Default Theme */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    الثيم الافتراضي للواجهة:
                  </label>
                  <select
                    value={currentSettings.siteDefaults.defaultTheme}
                    onChange={(e) => setCurrentSettings(prev => ({
                      ...prev,
                      siteDefaults: {
                        ...prev.siteDefaults,
                        defaultTheme: e.target.value as ThemeId,
                      },
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => (
                      <option key={themeKey} value={themeKey}>
                        {THEMES[themeKey].nameAr} ({THEMES[themeKey].name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Default Font */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    الخط العربي الافتراضي:
                  </label>
                  <select
                    value={currentSettings.siteDefaults.defaultFont}
                    onChange={(e) => setCurrentSettings(prev => ({
                      ...prev,
                      siteDefaults: {
                        ...prev.siteDefaults,
                        defaultFont: e.target.value,
                      },
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="font-cairo">خط كايرو (Cairo)</option>
                    <option value="font-amiri">خط أميري للنسخ (Amiri)</option>
                    <option value="font-tajawal">خط تجوال (Tajawal)</option>
                    <option value="font-sans">خط النظام الافتراضي (System Sans)</option>
                  </select>
                </div>

                {/* Default Font Size */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    حجم الخط الافتراضي ({currentSettings.siteDefaults.defaultFontSize}px):
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    step="2"
                    value={currentSettings.siteDefaults.defaultFontSize}
                    onChange={(e) => setCurrentSettings(prev => ({
                      ...prev,
                      siteDefaults: {
                        ...prev.siteDefaults,
                        defaultFontSize: parseInt(e.target.value, 10),
                      },
                    }))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={currentSettings.siteDefaults.defaultSound}
                      onChange={(e) => setCurrentSettings(prev => ({
                        ...prev,
                        siteDefaults: {
                          ...prev.siteDefaults,
                          defaultSound: e.target.checked,
                        },
                      }))}
                      className="rounded border-slate-700 text-amber-500"
                    />
                    <span>تفعيل صوت نقر المفاتيح افتراضياً</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={currentSettings.siteDefaults.defaultTransliteration}
                      onChange={(e) => setCurrentSettings(prev => ({
                        ...prev,
                        siteDefaults: {
                          ...prev.siteDefaults,
                          defaultTransliteration: e.target.checked,
                        },
                      }))}
                      className="rounded border-slate-700 text-amber-500"
                    />
                    <span>تفعيل محرك ياملي (عربيزي) افتراضياً</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={currentSettings.siteDefaults.defaultVirtualVisible}
                      onChange={(e) => setCurrentSettings(prev => ({
                        ...prev,
                        siteDefaults: {
                          ...prev.siteDefaults,
                          defaultVirtualVisible: e.target.checked,
                        },
                      }))}
                      className="rounded border-slate-700 text-amber-500"
                    />
                    <span>إظهار لوحة المفاتيح الافتراضية على الشاشة افتراضياً</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
