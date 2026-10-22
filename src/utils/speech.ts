/**
 * Dual-layer Arabic Speech Pronunciation Engine:
 * 1. Native Web Speech API with Arabic voice auto-binding and Chrome GC fix.
 * 2. Automated fallback to Google Arabic TTS audio stream if system lacks Arabic voices.
 */

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: unknown) => void;
}

// Module-level references to prevent garbage collection mid-speech in Chrome/Safari
let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Initialize and cache available voices
 */
export function initSpeechVoices(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  initSpeechVoices();
}

/**
 * Finds the best available Arabic voice in the browser
 */
export function getArabicVoice(): SpeechSynthesisVoice | null {
  if (!cachedVoices || cachedVoices.length === 0) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }

  // 1. Prefer explicit Arabic regional voices
  const arabicVoice = cachedVoices.find(
    v => v.lang.toLowerCase().startsWith('ar-') || v.lang.toLowerCase() === 'ar'
  );
  if (arabicVoice) return arabicVoice;

  // 2. Search by name containing Arabic or Arab
  const namedArabic = cachedVoices.find(
    v => /arabic|arabe|عربي|maged|tarik|laila|mariam/i.test(v.name)
  );
  return namedArabic || null;
}

/**
 * Builds Google Arabic TTS audio URL for fallback streaming
 */
export function getFallbackTtsUrl(text: string): string {
  const clean = text.trim().slice(0, 200); // URL limit
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(clean)}`;
}

/**
 * Plays speech using Web Speech API with fallback to HTML5 Audio element
 */
export function playArabicSpeech(text: string, callbacks?: SpeechCallbacks): void {
  const cleanText = text.trim();
  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  // Stop any currently active speech
  stopArabicSpeech();

  const arabicVoice = getArabicVoice();

  // Primary Path: Native SpeechSynthesis with an available Arabic voice
  if (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    arabicVoice
  ) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtterance = utterance;

      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang || 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        activeUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        activeUtterance = null;
        // If native synthesis fails, gracefully attempt audio fallback
        playFallbackAudio(cleanText, callbacks);
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // Fall through to audio fallback
    }
  }

  // Secondary Fallback Path: Google Arabic TTS stream
  playFallbackAudio(cleanText, callbacks);
}

/**
 * Plays audio via Google TTS stream as fallback
 */
function playFallbackAudio(cleanText: string, callbacks?: SpeechCallbacks): void {
  try {
    const audioUrl = getFallbackTtsUrl(cleanText);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    callbacks?.onStart?.();

    audio.onended = () => {
      activeAudio = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = (err) => {
      activeAudio = null;
      callbacks?.onError?.(err);
      callbacks?.onEnd?.();
    };

    audio.play().catch((err) => {
      activeAudio = null;
      callbacks?.onError?.(err);
      callbacks?.onEnd?.();
    });
  } catch (err) {
    activeAudio = null;
    callbacks?.onError?.(err);
    callbacks?.onEnd?.();
  }
}

/**
 * Stops any active speech playback
 */
export function stopArabicSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  activeUtterance = null;

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudio = null;
  }
}
