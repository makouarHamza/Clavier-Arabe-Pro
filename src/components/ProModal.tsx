import React from 'react';
import { X, Check, Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/sound.ts';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onTogglePro: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onTogglePro,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Crown className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Clavier Arabe SaaS Pro</h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            تجربة كتابة عربية احترافية بدون إعلانات مع مزايا حصرية للمبدعين
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Free */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-right">
              <div className="font-bold text-slate-800 text-sm">الخطة المجانية</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">$0</div>
              <div className="text-[10px] text-slate-500">مدى الحياة</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>كيبورد عربي افتراضي</span>
                </li>
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>محرك عربيزي ياملي</span>
                </li>
                <li className="flex items-center gap-1 text-slate-400">
                  <span>• يتضمن إعلانات Google</span>
                </li>
              </ul>
            </div>

            {/* Pro */}
            <div className="border-2 border-amber-500 rounded-xl p-3 bg-amber-50/40 text-right relative shadow-md">
              <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                الأكثر طلباً
              </div>
              <div className="font-bold text-amber-900 text-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>عضوية Pro</span>
              </div>
              <div className="text-xl font-extrabold text-amber-900 mt-1">
                $3.99 <span className="text-xs font-normal text-amber-700">/شهرياً</span>
              </div>
              <div className="text-[10px] text-amber-700">تجديد تلقائي أو إلغاء في أي وقت</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-amber-950 font-medium">
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-600" />
                  <span>حذف تام لجميع الإعلانات</span>
                </li>
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-600" />
                  <span>جميع الثيمات الحصرية</span>
                </li>
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-600" />
                  <span>تصدير PDF عالي الدقة</span>
                </li>
                <li className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-600" />
                  <span>تشكيل النصوص الذكي</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Toggle Button for Pro Simulation */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onTogglePro();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              {isPro ? 'إلغاء تفعيل وضع Pro (العودة للمجاني)' : 'تفعيل وضع Pro الآن (بدون إعلانات)'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تجربة آمنة 100% مع ضمان استرداد فوري</span>
          </div>
        </div>
      </div>
    </div>
  );
};
