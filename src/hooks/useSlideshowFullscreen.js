import { useEffect, useRef, useState } from 'react';

export function useSlideshowFullscreen(root) {
  const [presenting, setPresenting] = useState(false);
  const [hint, setHint] = useState(false);
  const [error, setError] = useState('');
  const opener = useRef(null);
  const hintTimer = useRef(null);
  const pending = useRef(false);
  const getFullscreen = () => document.fullscreenElement || document.webkitFullscreenElement;
  useEffect(() => {
    let wasPresenting = false;
    const change = () => {
      const active = getFullscreen() === root.current;
      setPresenting(active);
      clearTimeout(hintTimer.current);
      setHint(active);
      if (active) {
        root.current?.querySelector('.keynote-stage')?.focus({ preventScroll: true });
        hintTimer.current = setTimeout(() => setHint(false), 3200);
      } else if (wasPresenting) {
        opener.current?.isConnected && opener.current.focus({ preventScroll: true });
      }
      wasPresenting = active;
    };
    document.addEventListener('fullscreenchange', change);
    document.addEventListener('webkitfullscreenchange', change);
    return () => {
      document.removeEventListener('fullscreenchange', change);
      document.removeEventListener('webkitfullscreenchange', change);
      clearTimeout(hintTimer.current);
    };
  }, [root]);
  async function enter(trigger) {
    if (pending.current) return;
    const element = root.current;
    const request = element?.requestFullscreen || element?.webkitRequestFullscreen;
    setError('');
    if (!request) { setError('Fullscreen slideshows are not supported by this browser.'); return; }
    opener.current = trigger;
    pending.current = true;
    try { await request.call(element, { navigationUI: 'hide' }); }
    catch { setError('Could not start fullscreen. Please try again in a browser that allows fullscreen.'); }
    finally { pending.current = false; }
  }
  async function exit() {
    if (getFullscreen() !== root.current) return;
    try {
      const leave = document.exitFullscreen || document.webkitExitFullscreen;
      await leave?.call(document);
    } catch { setError('Press Esc to exit fullscreen.'); }
  }
  return { presenting, hint, error, enter, exit };
}
