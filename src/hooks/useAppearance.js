import { useEffect, useLayoutEffect, useState } from 'react';
import { appearanceModes, appearanceStorageKey, readAppearance, resolveAppearance } from '../utils/appearance.js';

export function useAppearance(config) {
  const [mode, setMode] = useState(() => { try { return typeof window === 'undefined' ? 'auto' : readAppearance(window.localStorage); } catch { return 'auto'; } });
  const [now, setNow] = useState(() => new Date());
  const theme = resolveAppearance(mode, now, config);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1e1e1e' : '#f6f6f6');
    try { window.localStorage.setItem(appearanceStorageKey, mode); } catch { /* Private browsing can disable storage. */ }
  }, [theme, mode]);
  useEffect(() => {
    let timer;
    const refresh = () => {
      setNow(new Date());
      clearTimeout(timer);
      timer = setTimeout(refresh, 60_000 - Date.now() % 60_000);
    };
    const visible = () => { if (!document.hidden) refresh(); };
    const sync = event => { if (event.key === appearanceStorageKey || event.key === null) setMode(appearanceModes.includes(event.newValue) ? event.newValue : 'auto'); };
    refresh();
    document.addEventListener('visibilitychange', visible);
    window.addEventListener('storage', sync);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visible); window.removeEventListener('storage', sync); };
  }, []);
  return { mode, theme, setMode };
}
