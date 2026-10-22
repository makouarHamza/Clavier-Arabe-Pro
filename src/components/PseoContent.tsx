import React, { useState } from 'react';
import { PseoTab } from '../types.ts';
import {
  BookOpen,
  Keyboard,
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PseoContentProps {
  activeTab: PseoTab;
  setActiveTab: (tab: PseoTab) => void;
  onApplySampleText?: (sample: string) => void;
}

export const PseoContent: React.FC<PseoContentProps> = ({
  activeTab,
  setActiveTab,
  onApplySampleText,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما هو كيبورد Clavier Arabe Pro وكيف يعمل؟',
      a: 'Clavier Arabe Pro هو تطبيق ويب متطور يحاكي لوحة المفاتيح العربية الكلاسيكية والذكية. يتيح لك الكتابة باللغة العربية عبر النقر على الشاشة أو عبر الكتابة الصوتية أو عبر ميزة "ياملي / يملي" للتحويل الفوري من الحروف اللاتينية والأرقام (عربيزي / فرانكو) إلى لغة عربية فصيحة بدقة فائقة وبدون أي تأخير.',
    },
    {
      q: 'كيف أكتب الحروف العربية باستخدام الأرقام (عربيزي Yamli)؟',
      a: 'تستخدم ميزة Transliteration نظام الترميز الصوتي الشائع: الرقم 3 يمثل حرف (ع)، الرقم 7 يمثل حرف (ح)، الرقم 5 أو kh يمثل حرف (خ)، الرقم 2 يمثل الهمزة (ء/أ)، الرقم 6 يمثل حرف (ط)، والرقم 9 يمثل حرف (ق). بمجرد كتابة الكلمة باللاتينية، يقترح النظام الكلمة العربية المقابلة فوراً.',
    },
    {
      q: 'هل يعمل الكيبورد العربي على الهواتف الذكية (iOS و Android) بسلاسة؟',
      a: 'نعم، تم تصميم التطبيق وفق معايير PSEO والأداء الفائق مع زمن استجابة صفري (Zero Latency) وأزرار لمس مريحة متوافقة تماماً مع شاشات الهواتف والأجهزة اللوحية دون الحاجة لتثبيت أي برامج إضافية.',
    },
    {
      q: 'كيف يمكنني تشكيل النصوص العربية وإضافة الحركات؟',
      a: 'يحتوي التطبيق على شريط تشكيل كامل يضم الحركات الثمانية الرئيسية: الفتحة (َ)، الضمة (ُ)، الكسرة (ِ)، السكون (ْ)، وتنوين الفتح والضم والكسر، بالإضافة للشدة (ّ) وتطويل الكشيدة (ـ). يمكنك وضع المؤشر بعد الحرف والضغط على الحركة المطلوبة.',
    },
    {
      q: 'هل يمكنني البحث مباشرة في Google ويوتيوب من خلال الكيبورد؟',
      a: 'نعم، بمجرد كتابة الكلمة أو الجملة العربية، يمكنك النقر على زر Search البرتقالي أو أزرار Google و YouTube للبحث المباشر بضغطة زر واحدة دون الحاجة لإعادة نسخ النص.',
    },
  ];

  const arabiziRules = [
    { num: '2', ar: 'ء / أ', example: '2akbar → أكبر', desc: 'الهمزة بأنواعها' },
    { num: '3', ar: 'ع', example: '3arab → عرب', desc: 'حرف العين' },
    { num: "3' / 8", ar: 'غ', example: "3'orfa → غرفة", desc: 'حرف الغين' },
    { num: '5 / kh', ar: 'خ', example: '5obz → خبز', desc: 'حرف الخاء' },
    { num: '6', ar: 'ط', example: '6aleb → طالب', desc: 'حرف الطاء' },
    { num: "6' / 4", ar: 'ظ', example: "6'el → ظل", desc: 'حرف الظاء' },
    { num: '7', ar: 'ح', example: '7alwa → حلوة', desc: 'حرف الحاء' },
    { num: '9 / q', ar: 'ق', example: '9amar → قمر', desc: 'حرف القاف' },
    { num: 'sh / ch', ar: 'ش', example: 'chams → شمس', desc: 'حرف الشين' },
    { num: 'th', ar: 'ث', example: 'thalathah → ثلاثة', desc: 'حرف الثاء' },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mt-4 select-text">
      {/* PSEO Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setActiveTab('keyboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'keyboard'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>لوحة المفاتيح العربية (Clavier Arabe)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('yamli')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'yamli'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>العربيزي إلى عربي (Yamli)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tashkeel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tashkeel'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>كيبورد التشكيل والحركات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shortcuts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'shortcuts'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مقارنة AZERTY و QWERTY</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>الأسئلة الشائعة FAQ</span>
        </button>
      </div>

      {/* Tab 1: Clavier Arabe General Guide */}
      {activeTab === 'keyboard' && (
        <article className="pt-4 space-y-4 text-slate-700 leading-relaxed">
          <header>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              لوحة مفاتيح عربية افتراضية للكتابة السريعة عبر الإنترنت (Clavier Arabe en Ligne)
            </h1>
            <p className="text-sm text-slate-600">
              أفضل أداة مجانية تتيح لك كتابة النصوص باللغة العربية بدقة وسرعة حتى لو لم يكن جهاز الكمبيوتر أو الهاتف الخاص بك يحتوي على لوحة مفاتيح باللغة العربية (Arabic Keyboard Layout).
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-1">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>سرعة استجابة فائقة (Zero Latency)</span>
              </div>
              <p className="text-xs text-slate-600">
                محرك كتابة فوري خفيف الوزن ومُحسّن للهواتف النقالة لضمان تجربة كتابة سلسة دون أي تقطيع.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>دعم نظام ياملي (Yamli Engine)</span>
              </div>
              <p className="text-xs text-slate-600">
                اكتب بحروف الفرانكو أو أرقام العربيزي (مثل salam أو 3arab) وستتحول تلقائياً إلى لغة عربية.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-1">
                <Search className="w-4 h-4 text-blue-600" />
                <span>بحث فوري بضغطة زر</span>
              </div>
              <p className="text-xs text-slate-600">
                ابحث فوراً في محرك بحث جوجل ويوتيوب وموقع الصور دون الحاجة لنسخ ولصق العبارات يدوياً.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              لماذا يستخدم الملايين موقع Clavier Arabe؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              يواجه الكثير من مستخدمي أجهزة الحاسوب في المهجر والبلدان غير الناطقة بالعربية صعوبة في كتابة الرسائل والبحوث بالعربية لعدم توفر الحروف العربية مطبوعة على أزرار أجهزتهم. يقدم لك Clavier Arabe Pro الحل المثالي عبر واجهة تفاعلية كاملة مع إمكانية النسخ والحفظ والطباعة ونطق النص الصوتي.
            </p>
          </section>
        </article>
      )}

      {/* Tab 2: Yamli Arabizi */}
      {activeTab === 'yamli' && (
        <article className="pt-4 space-y-4 text-slate-700 leading-relaxed">
          <header>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              دليل الكتابة بالعربيزي والفرانكو وتحويلها إلى عربي (Yamli Transliteration)
            </h2>
            <p className="text-sm text-slate-600">
              جدول قواعد التحويل الذكي لكتابة الكلمات العربية باستخدام الأرقام والحروف اللاتينية:
            </p>
          </header>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs sm:text-sm text-right">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">الرمز / الرقم</th>
                  <th className="p-2.5">الحرف العربي المقابل</th>
                  <th className="p-2.5">مثال حي</th>
                  <th className="p-2.5">الوصف الصوتي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {arabiziRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-indigo-600">{rule.num}</td>
                    <td className="p-2.5 font-bold text-red-600 text-base">{rule.ar}</td>
                    <td className="p-2.5 font-medium">{rule.example}</td>
                    <td className="p-2.5 text-slate-500">{rule.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
            <strong>نصيحة سريعة:</strong> فعّل خيار &quot;عربيزي Transliteration&quot; من الشريط العلوي، ثم اكتب في المربع النصي مباشرة بالإنجليزية (مثلاً <code>marhaba</code> أو <code>shukran</code>) وشاهد الكلمات تتحول تلقائياً إلى العربية!
          </div>
        </article>
      )}

      {/* Tab 3: Tashkeel */}
      {activeTab === 'tashkeel' && (
        <article className="pt-4 space-y-4 text-slate-700 leading-relaxed">
          <header>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              كيبورد التشكيل وحركات الإعراب في اللغة العربية
            </h2>
            <p className="text-sm text-slate-600">
              دليل حركات التشكيل الأساسية وأهميتها في ضبط النطق والمعنى الصحيح:
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">َ</div>
              <div className="font-bold text-slate-800 text-sm">الفتحة (Fatha)</div>
              <div className="text-[11px] text-slate-500">حركة الفتح القصيرة</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ُ</div>
              <div className="font-bold text-slate-800 text-sm">الضمة (Damma)</div>
              <div className="text-[11px] text-slate-500">حركة الضم القصيرة</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ِ</div>
              <div className="font-bold text-slate-800 text-sm">الكسرة (Kasra)</div>
              <div className="text-[11px] text-slate-500">حركة الكسر القصيرة</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ْ</div>
              <div className="font-bold text-slate-800 text-sm">السكون (Sukun)</div>
              <div className="text-[11px] text-slate-500">سكون الحرف وانعدام الحركة</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ّ</div>
              <div className="font-bold text-slate-800 text-sm">الشدة (Shadda)</div>
              <div className="text-[11px] text-slate-500">تضعيف وتشديد نطق الحرف</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ً</div>
              <div className="font-bold text-slate-800 text-sm">تنوين الفتح</div>
              <div className="text-[11px] text-slate-500">فتحتان فوق آخر الحرف</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ٌ</div>
              <div className="font-bold text-slate-800 text-sm">تنوين الضم</div>
              <div className="text-[11px] text-slate-500">ضمتان فوق آخر الحرف</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
              <div className="text-3xl text-red-600 font-bold mb-1">ٍ</div>
              <div className="font-bold text-slate-800 text-sm">تنوين الكسر</div>
              <div className="text-[11px] text-slate-500">كسرتان تحت آخر الحرف</div>
            </div>
          </div>
        </article>
      )}

      {/* Tab 4: AZERTY vs QWERTY Shortcuts */}
      {activeTab === 'shortcuts' && (
        <article className="pt-4 space-y-4 text-slate-700 leading-relaxed">
          <header>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              دليل اختصارات لوحة المفاتيح وتوافق AZERTY و QWERTY
            </h2>
            <p className="text-sm text-slate-600">
              كيف تكتب باللغة العربية باستخدام الكيبورد الفرنسي أو الإنجليزي:
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm mb-2">لوحة مفاتيح AZERTY الفرنسية</h3>
              <p className="text-xs text-slate-600 mb-2">
                شائعة جداً في فرنسا والمغرب والجزائر وتونس. الأزرار متوافقة مع الحروف الصوتية باللغة الفرنسية:
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
                <li>حرف A يقابل حرف (ض) أو الألف حسب النمط.</li>
                <li>حرف Z يقابل حرف (ص).</li>
                <li>حرف Q يقابل حرف (ش).</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm mb-2">لوحة مفاتيح QWERTY القياسية</h3>
              <p className="text-xs text-slate-600 mb-2">
                تعتمد توزيع الحروف العربي القياسي (Arabic 101):
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
                <li>السطر الأول يبدأ بحرف (ض) ثم (ص) ثم (ث).</li>
                <li>السطر الأوسط يبدأ بحرف (ش) ثم (س) ثم (ي).</li>
                <li>السطر السفلي يبدأ بحرف (ئ) ثم (ء) ثم (ؤ).</li>
              </ul>
            </div>
          </div>
        </article>
      )}

      {/* Tab 5: FAQ Accordion with Schema.org alignment */}
      {activeTab === 'faq' && (
        <div className="pt-4 space-y-2">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            الأسئلة الشائعة حول كيبورد Clavier Arabe (FAQ)
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-right font-bold text-slate-800 text-sm cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-200 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
