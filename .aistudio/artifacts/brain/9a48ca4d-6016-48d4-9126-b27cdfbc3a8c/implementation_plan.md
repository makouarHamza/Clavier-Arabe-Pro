# Fix Window Fetch Error, Arabic Speech Pronunciation, and Streamline Admin Ads & Images

This plan addresses:
1. **Window Fetch Property Error**: Resolving the extension / iframe error (`TypeError: Cannot set property fetch of #<Window> which has only a getter`) by making `window.fetch` cleanly configurable and writable before extension hooks execute.
2. **Arabic Pronunciation ("نطق 🔊")**: Replacing the broken single-threaded speech call with a resilient dual-layer Arabic audio engine (`SpeechSynthesis` voice auto-binding + Google Arabic TTS fallback stream).
3. **Streamlined Admin Page**: Transforming the Admin page into a focused **Ads & Images Manager** to configure banner images, image URLs, destination links, CTAs, and Google AdSense units with live visual previews.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Extension / IFrame Fetch Fix**: A defensive initialization script will be inserted at the top of `<head>` in `index.html` ensuring `window.fetch` has `{ writable: true, configurable: true }`, preventing browser extension proxies from crashing.
> - **Pronunciation Audio**: Implemented via `src/utils/speech.ts` with explicit Arabic voice selection, speech state tracking (`isSpeaking`), and an automatic fallback to Google Arabic TTS audio if no Arabic voice is installed on the user's operating system.
> - **Focused Admin Page**: Removal of cluttered extra tabs (SEO/analytics/dictionary) in favor of a clean, dedicated visual studio for the 4 ad slots: Top Leaderboard, Sidebar Skyscraper, In-Feed Native, and Mobile Sticky Footer.

---

## 1. Overview & Core Concept

### What It Does
- **Error-Free Execution**: Prevents browser extensions and embedded preview frames from failing when accessing or wrapping `fetch`.
- **Crystal Clear Arabic Pronunciation**: When the user clicks `نطق 🔊`, the app vocalizes the typed text aloud in authentic Arabic, showing an active animation while speaking.
- **Visual Ads & Images Studio**: An intuitive admin interface where users can paste image URLs, select high-quality banner presets, set click-through links, customize CTA buttons, and preview how each banner will look on desktop and mobile.

---

## 2. Technical Architecture & Changes

### A. Window Fetch Property Safeguard (`index.html`)
```html
<script>
  // Ensure window.fetch is writable and configurable for browser extensions and frame wrappers
  (function() {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        var originalFetch = window.fetch;
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      }
    } catch (e) {}
  })();
</script>
```

### B. Dual-Layer Arabic Speech Engine (`src/utils/speech.ts`)
```
┌─────────────────────────────────────────────────────────────┐
│                   playArabicSpeech(text)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
               Can browser speak Arabic locally?
                               │
               ┌───────────────┴───────────────┐
              YES                              NO
               │                               │
               ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│ Web Speech Synthesis          │ │ Fallback Audio Stream     │
│ - Voice: 'ar-SA' / 'ar-EG'    │ │ - Google Arabic TTS CDN   │
│ - Rate: 0.9, Pitch: 1.0       │ │ - HTMLAudioElement        │
│ - Chrome GC bug prevention    │ │ - Instant playback        │
└───────────────────────────────┘ └───────────────────────────┘
```

### C. Visual Ads & Images Manager (`src/components/admin/AdminAdsManager.tsx`)
- Replaces the multi-tab `AdminDashboard.tsx`.
- Provides tabbed selector for the 4 slots:
  - `بنر الترويسة العلوي (728x90 Leaderboard)`
  - `البرج الإعلاني الجانبي (160x600 Skyscraper)`
  - `الإعلان المدمج (Native In-Feed)`
  - `شريط الجوال الثابت (Mobile Sticky Footer)`
- For each slot:
  - **Banner Image**: Image URL input + quick selection from curated banner presets + file URL preview.
  - **Ad Copy**: Title, Description, CTA text ("اكتشف المزيد", "تسوق الآن").
  - **Links**: Target destination URL (`https://...`).
  - **Provider**: Custom Banner vs Google AdSense.
  - **Live Preview Panel**: Shows the exact banner with image and typography in real time.
- Action bar with **"حفظ التغييرات" (Save)**, **"معاينة الموقع" (View Live Site)**, and **"استعادة الافتراضي" (Reset)**.

---

## 3. Implementation Steps

1. **`index.html`**: Add the inline `<script>` at the top of `<head>` ensuring `window.fetch` is configurable and writable.
2. **`src/utils/speech.ts`**: Create the robust Arabic speech synthesis utility with voice detection, error recovery, and Google Arabic TTS fallback.
3. **`src/types.ts`**: Update `AdUnitConfig` with `imageUrl` and image customization attributes.
4. **`src/utils/adminStorage.ts`**: Update defaults to include default banner images and custom image presets.
5. **`src/components/admin/AdminAdsManager.tsx`**: Create the focused Ads & Images visual editor.
6. **`src/components/ActionToolbar.tsx`**: Connect the new `playArabicSpeech` function with active state and toggle playback.
7. **`src/components/AdBanner.tsx`**: Render banner images with graceful fallbacks.
8. **`src/App.tsx`**: Route to `AdminAdsManager` when entering Admin mode.
9. **Verification**: Run unit tests (`node:test`), compile (`compile_applet`), restart dev server, and visually verify with Playwright.
