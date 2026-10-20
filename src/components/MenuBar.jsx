import { useEffect, useMemo, useRef, useState } from 'react';
import UIIcon from './UIIcon.jsx';

const defaultClockOptions = { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false };

export default function MenuBar({ profile, appearance, active, windows = [], mobile, desktopIconsVisible = true, onAction }) {
  const [now, setNow] = useState(() => new Date());
  const [panel, setPanel] = useState(null);
  const root = useRef(null);
  const popover = useRef(null);
  const trigger = useRef(null);
  const config = profile.menuBar;
  const formatter = useMemo(() => new Intl.DateTimeFormat(config.locale, config.clockOptions || defaultClockOptions), [config]);
  const compactFormatter = useMemo(() => new Intl.DateTimeFormat(config.locale, config.mobileClockOptions), [config]);
  const menu = config.menus.find(item => item.id === panel);
  useEffect(() => {
    let timer;
    const refresh = () => {
      clearTimeout(timer); setNow(new Date());
      // Minute alignment follows the existing alanagoyal.com-inspired clock.
      timer = setTimeout(refresh, 60_000 - Date.now() % 60_000);
    };
    const visible = () => { if (!document.hidden) refresh(); };
    refresh(); document.addEventListener('visibilitychange', visible);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visible); };
  }, []);
  useEffect(() => {
    if (!panel) return;
    const frame = requestAnimationFrame(() => popover.current?.querySelector('[aria-pressed="true"], button:not(:disabled)')?.focus());
    const outside = event => { if (!root.current?.contains(event.target)) setPanel(null); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); };
  }, [panel]);
  function toggle(id, element) { trigger.current = element; setPanel(current => current === id ? null : id); }
  function action(id, extra) {
    if (id === 'appearance') { setPanel('appearance'); return; }
    setPanel(null);
    trigger.current?.focus({ preventScroll: true });
    onAction?.(id, trigger.current, extra);
  }
  function panelKeys(event) {
    if (event.key === 'Escape' && panel) {
      event.preventDefault(); event.stopPropagation(); setPanel(null); trigger.current?.focus(); return;
    }
    if (!popover.current?.contains(event.target) || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = [...popover.current.querySelectorAll('button:not(:disabled)')];
    if (!items.length) return;
    event.preventDefault(); event.stopPropagation();
    const current = items.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
      (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  }
  return <header ref={root} className="menu-bar" data-menu-bar onKeyDownCapture={panelKeys}>
    <div className="menu-bar__identity">
      <button type="button" className="menu-bar__brand menu-control" aria-label={config.brandLabel}
        onClick={event => onAction?.('about', event.currentTarget)}><UIIcon name={config.brandIcon} size={18} /></button>
      <strong className="menu-app-name">{active?.title || config.defaultApp}</strong>
      <nav className="desktop-menus" aria-label={config.menusLabel}>
        {config.menus.map(group => <div className={`desktop-menu ${group.secondary ? 'desktop-menu--secondary' : ''}`} key={group.id}
          onPointerEnter={event => {
            if (event.pointerType === 'mouse' && panel && panel !== 'appearance' && panel !== group.id) {
              trigger.current = event.currentTarget.querySelector('button'); setPanel(group.id);
            }
          }}>
          <button type="button" className="menu-control" aria-haspopup="menu" aria-expanded={panel === group.id}
            aria-controls={panel === group.id ? `desktop-menu-${group.id}` : undefined}
            onClick={event => toggle(group.id, event.currentTarget)} onKeyDown={event => {
              if (event.key === 'ArrowDown') { event.preventDefault(); toggle(group.id, event.currentTarget); }
              if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                const buttons = [...root.current.querySelectorAll('.desktop-menu > button')].filter(item => item.getClientRects().length);
                const next = (buttons.indexOf(event.currentTarget) + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
                event.preventDefault(); setPanel(null); buttons[next]?.focus();
              }
            }}>{group.label}</button>
          {panel === group.id && <div ref={popover} className="menu-popover" role="menu" id={`desktop-menu-${group.id}`} aria-label={group.label}>
            {menu.items.map(item => <button key={item.action} type="button" role="menuitem"
              aria-controls={item.action === 'toggle-desktop-icons' ? 'desktop-projects' : undefined}
              disabled={['minimize', 'zoom', 'close'].includes(item.action) && (!active || mobile)}
              onClick={() => action(item.action)}><span>{item.action === 'toggle-desktop-icons' && !desktopIconsVisible ? item.showLabel : item.label}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}</button>)}
            {group.id === 'window' && <><hr />{windows.length ? windows.map(record => <button key={record.id} type="button" role="menuitem"
              onClick={() => action('focus-window', record.id)}><UIIcon name={active?.id === record.id ? 'check' : 'file'} size={14} /><span>{record.title}</span></button>)
              : <p className="menu-empty">{config.noWindows}</p>}</>}
          </div>}
        </div>)}
      </nav>
    </div>
    <div className="menu-status">
      <span className="menu-indicator" role="img" aria-label={config.wifiLabel} title={config.wifiLabel}><UIIcon name="wifi" size={17} /></span>
      <span className="menu-indicator menu-indicator--battery" role="img" aria-label={config.batteryLabel} title={config.batteryLabel}><UIIcon name="battery" size={21} /></span>
      <button type="button" className="menu-control menu-status-button" aria-label={config.searchLabel} title={config.searchLabel}
        onClick={event => onAction?.('search', event.currentTarget)}><UIIcon name="search" size={16} /></button>
      <div className="appearance-anchor">
        <button type="button" className="menu-control menu-status-button" aria-label={config.controlsLabel} title={config.controlsLabel}
          aria-expanded={panel === 'appearance'} aria-haspopup="dialog" aria-controls={panel === 'appearance' ? 'appearance-panel' : undefined}
          onClick={event => toggle('appearance', event.currentTarget)}><UIIcon name="control-center" size={17} /></button>
        {panel === 'appearance' && <section ref={popover} className="menu-popover appearance-panel" id="appearance-panel" role="dialog" aria-label={profile.appearance.title}>
          <h2>{profile.appearance.title}</h2>
          <div className="appearance-options" role="group" aria-label={profile.appearance.title}>
            {profile.appearance.options.map(option => <button key={option.id} type="button" aria-pressed={appearance.mode === option.id}
              onClick={() => appearance.setMode(option.id)}><UIIcon name={option.icon} size={24} /><span>{option.label}</span></button>)}
          </div><p>{profile.appearance.description}</p>
        </section>}
      </div>
      <time dateTime={now.toISOString()} aria-label={formatter.format(now)}>
        <span className="clock-full">{formatter.format(now)}</span><span className="clock-compact" aria-hidden="true">{compactFormatter.format(now)}</span>
      </time>
    </div>
  </header>;
}
