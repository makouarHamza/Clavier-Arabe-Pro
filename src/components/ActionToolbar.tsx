import React, { useState } from 'react';
import {
  Copy,
  Download,
  Printer,
  Languages,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  Share2,
  Sparkles,
  VolumeX,
  Check,
  Type,
  FileText
} from 'lucide-react';
import { soundManager } from '../utils/sound.ts';
import { removeTashkeel, HARAKAT } from '../utils/transliteration.ts';
import { playArabicSpeech, stopArabicSpeech } from '../utils/speech.ts';

interface ActionToolbarProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  isVirtualVisible: boolean;
  setIsVirtualVisible: (val: boolean) => void;
  isTransliterationActive: boolean;
  setIsTransliterationActive: (val: boolean) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenSnippets: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  text,
  setText,
  isVirtualVisible,
  setIsVirtualVisible,
  isTransliterationActive,
  setIsTransliterationActive,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  soundEnabled,
  setSoundEnabled,
  onOpenSnippets,
}) => {
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window));
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // 1. Copy to clipboard
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      soundManager.playClick(1.2);
      setCopied(true);
      showToast('تم نسخ النص بنجاح!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('تعذر النسخ التلقائي');
    }
  };

  // 2. Save file
  const handleSave = () => {
    if (!text) return;
    soundManager.playClick();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clavier-arabe-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم حفظ الملف النصي');
  };

  // 3. Print
  const handlePrint = () => {
    if (!text) return;
    soundManager.playClick();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>طباعة - Clavier Arabe Pro</title>
            <style>
              body { font-family: 'Amiri', 'Cairo', Tahoma, sans-serif; padding: 40px; font-size: 20px; line-height: 2; direction: rtl; }
              .header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 30px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">مطبوع بواسطة Clavier Arabe Pro (${new Date().toLocaleDateString('ar-EG')})</div>
            <div style="white-space: pre-wrap;">${text}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // 4. Translate via Google Translate
  const handleTranslate = () => {
    if (!text.trim()) return;
    soundManager.playClick();
    const url = `https://translate.google.com/?sl=ar&tl=en&text=${encodeURIComponent(text)}&op=translate`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 5. Speech to text dictation (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      showToast('خاصية الإملاء الصوتي غير مدعومة في هذا المتصفح');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('تحدث الآن بالعربية...');
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText(prev => (prev ? prev + ' ' + transcript : transcript));
          showToast('تمت إضافة النص المنطوق');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // 6. Text to speech playback
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text.trim()) {
      showToast('يرجى كتابة نص أولاً للاستماع إليه');
      return;
    }

    soundManager.playClick();

    if (isSpeaking) {
      stopArabicSpeech();
      setIsSpeaking(false);
      showToast('تم إيقاف النطق');
      return;
    }

    playArabicSpeech(text, {
      onStart: () => {
        setIsSpeaking(true);
        showToast('جاري نطق النص...');
      },
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
        showToast('تعذر تشغيل الصوت في هذا المتصفح');
      },
    });
  };

  // 7. Remove Tashkeel
  const handleRemoveTashkeel = () => {
    if (!text) return;
    soundManager.playClick();
    const clean = removeTashkeel(text);
    setText(clean);
    showToast('تم إزالة حركات التشكيل');
  };

  // 8. Share to WhatsApp
  const handleShareWhatsApp = () => {
    if (!text.trim()) return;
    soundManager.playClick();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 9. Clear
  const handleClear = () => {
    if (!text) return;
    if (window.confirm('هل تريد مسح النص بالكامل؟')) {
      setText('');
      soundManager.playThud();
    }
  };

  return (
    <div className="w-full bg-[#f1f4f8] border-b border-[#c2cedd] px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 select-none relative">
      {/* Toast notification */}
      {toastMsg && (
        <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Primary Actions Matching Image */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {/* Copy (Green in screenshot) */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs sm:text-sm font-semibold rounded border transition-all cursor-pointer shadow-sm ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100'
          }`}
          title="نسخ النص إلى الحافظة (Ctrl+C)"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
          <span>نسخ Copy</span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm cursor-pointer"
          title="حفظ النص في ملف نصي (TXT)"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>حفظ Save</span>
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm cursor-pointer"
          title="طباعة النص"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>طباعة Print</span>
        </button>

        {/* Translate */}
        <button
          type="button"
          onClick={handleTranslate}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-blue-700 shadow-sm cursor-pointer"
          title="ترجمة النص في Google Translate"
        >
          <Languages className="w-3.5 h-3.5 text-blue-600" />
          <span>ترجمة Translate</span>
        </button>

        {/* Voice Dictation */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded border transition-colors shadow-sm cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white border-red-600 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
          title="إملاء صوتي باللغة العربية"
        >
          {isListening ? <Mic className="w-3.5 h-3.5 text-white" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden sm:inline">إملاء صوتي</span>
        </button>

        {/* Text to Speech (Pronunciation) */}
        <button
          type="button"
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-semibold rounded border transition-all shadow-sm cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse font-bold'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
          }`}
          title={isSpeaking ? 'إيقاف نطق النص' : 'استمع إلى نطق النص باللغة العربية'}
        >
          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-slate-950 animate-bounce' : 'text-slate-600'}`} />
          <span>{isSpeaking ? 'إيقاف النطق' : 'نطق'}</span>
        </button>

        {/* Snippets */}
        <button
          type="button"
          onClick={onOpenSnippets}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 shadow-sm cursor-pointer"
          title="عبارات إسلامية وجاهزة"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">عبارات جاهزة</span>
        </button>

        {/* Remove Tashkeel */}
        <button
          type="button"
          onClick={handleRemoveTashkeel}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 shadow-sm cursor-pointer"
          title="إزالة حركات التشكيل من النص"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>حذف التشكيل</span>
        </button>

        {/* WhatsApp Share */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer"
          title="مشاركة عبر واتساب"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden lg:inline">واتساب</span>
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-red-50 text-red-600 shadow-sm cursor-pointer"
          title="مسح كل النص"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      {/* Right Side: Toggles Matching Screenshot (Virtual [x] | Transliteration [x]) + Font controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Font Family selector */}
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
            title="نوع الخط العربي"
          >
            <option value="font-cairo">خط كايرو (Cairo)</option>
            <option value="font-amiri">خط أميري للنسخ (Amiri)</option>
            <option value="font-tajawal">خط تجوال (Tajawal)</option>
            <option value="font-sans">خط النظام (System Sans)</option>
          </select>
        </div>

        {/* Font size adjustment */}
        <div className="flex items-center border border-slate-300 rounded bg-white text-xs">
          <button
            type="button"
            onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
            title="تصغير حجم الخط"
          >
            A-
          </button>
          <span className="px-1 text-[11px] text-slate-500">{fontSize}px</span>
          <button
            type="button"
            onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
            title="تكبير حجم الخط"
          >
            A+
          </button>
        </div>

        {/* Audio click feedback toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundManager.setEnabled(next);
            if (next) soundManager.playClick();
          }}
          className={`p-1 rounded border text-xs cursor-pointer ${
            soundEnabled
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-white border-slate-300 text-slate-400'
          }`}
          title={soundEnabled ? 'صوت نقر المفاتيح: مفعل' : 'صوت نقر المفاتيح: معطل'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Screenshot's exact toggles */}
        <div className="flex items-center gap-2 border border-slate-300 rounded bg-white px-2 py-0.5 text-xs text-slate-700 shadow-sm">
          {/* Virtual Keyboard Toggle */}
          <label className="flex items-center gap-1 cursor-pointer font-medium hover:text-blue-600">
            <span>لوحة المفاتيح Virtual</span>
            <input
              type="checkbox"
              checked={isVirtualVisible}
              onChange={(e) => setIsVirtualVisible(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 cursor-pointer"
            />
          </label>

          <span className="text-slate-300">|</span>

          {/* Transliteration (Yamli) Toggle */}
          <label className="flex items-center gap-1 cursor-pointer font-medium hover:text-blue-600">
            <span>عربيزي Transliteration</span>
            <input
              type="checkbox"
              checked={isTransliterationActive}
              onChange={(e) => setIsTransliterationActive(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
