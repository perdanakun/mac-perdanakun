import { useEffect, useMemo, useState } from 'react';


const defaultClockOptions = { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false };

export default function MenuBar({ profile }) {
  const locale = profile.menuBar?.locale || 'en-GB';
  const clockOptions = profile.menuBar?.clockOptions || defaultClockOptions;
  const formatter = useMemo(() => new Intl.DateTimeFormat(locale, clockOptions), [locale, clockOptions]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      setNow(new Date());
      // Minute-aligned refresh inspired by alanagoyal.com (MIT). See LICENSE-THIRD-PARTY.
      timer = setTimeout(refresh, 60_000 - (Date.now() % 60_000));
    };
    const onVisible = () => { if (!document.hidden) refresh(); };

    refresh();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <header className="menu-bar" data-menu-bar>
      <div className="menu-bar__identity">
      <strong>{profile.displayName}</strong>
      <span>{profile.menuLabel}</span>
    </div>
      <time dateTime={now.toISOString()}>{formatter.format(now)}</time>
    </header>
  );
}
