// Defensive safeguard: Ensure window.fetch has both getter and setter for extensions and iframe environments
try {
  let realFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : null;
  const patchObj = (target: any) => {
    if (!target) return;
    try {
      Object.defineProperty(target, 'fetch', {
        get: () => realFetch,
        set: (fn: any) => {
          realFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    } catch {
      // ignore
    }
  };

  if (typeof window !== 'undefined') {
    patchObj(window);
    if ((window as any).__proto__) {
      patchObj((window as any).__proto__);
    }
    if (typeof Window !== 'undefined' && Window.prototype) {
      patchObj(Window.prototype);
    }
  }
} catch {
  // ignore
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
