import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import UIIcon from './UIIcon.jsx';
import AssistantOrb from './AssistantOrb.jsx';
import menuApple from '../assets/ui/apple-home.svg?no-inline';
import menuWifi from '../assets/ui/wifi.svg?no-inline';
import menuSearch from '../assets/ui/search.svg?no-inline';
import menuProfile from '../assets/ui/profile.svg?no-inline';

// All menu artwork uses the same configurable box, including the assistant orb.
function MenuBarIcon({ src, name, config }) {
  const size = Math.min(28, Math.max(8, Number(config.iconSize) || 9.5));
  const scale = config.iconScales?.[name] ?? 1;
  return <img className="ui-icon" src={src} width={size} height={size}
    style={{ width: size, height: size, objectFit: 'contain', transform: `scale(${scale})` }} alt="" aria-hidden="true" draggable="false" />;
}

const defaultClockOptions = { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false };

export default function MenuBar({ profile, active, windows = [], mobile, desktopIconsVisible = true, onAction }) {
  const [now, setNow] = useState(() => new Date());
  const [panel, setPanel] = useState(null);
  const [position, setPosition] = useState({ left: 12, top: 33 });
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
  // Every menu uses one floating surface, independent of its trigger wrapper.
  useLayoutEffect(() => {
    if (!panel) return;
    const place = () => {
      const anchor = trigger.current?.getBoundingClientRect();
      const popup = popover.current?.getBoundingClientRect();
      if (!anchor || !popup) return;
      setPosition({ left: Math.max(12, Math.min(anchor.left, window.innerWidth - popup.width - 12)),
        top: Math.max(anchor.bottom, root.current.getBoundingClientRect().bottom) + 5 });
    };
    place(); window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [panel, windows.length]);
  function anchorTo(element) {
    trigger.current = element;
    const rect = element.getBoundingClientRect();
    setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - 252)),
      top: Math.max(rect.bottom, root.current.getBoundingClientRect().bottom) + 5 });
  }
  function toggle(id, element) { anchorTo(element); setPanel(current => current === id ? null : id); }
  function action(id, extra) {
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
        onClick={event => onAction?.('about', event.currentTarget)}><MenuBarIcon src={menuApple} name="apple" config={config} /></button>
      <strong className="menu-app-name">{active?.title || config.defaultApp}</strong>
      <nav className="desktop-menus" aria-label={config.menusLabel}>
        {config.menus.map(group => <div className={`desktop-menu ${group.secondary ? 'desktop-menu--secondary' : ''}`} key={group.id}
          onPointerEnter={event => {
            if (event.pointerType === 'mouse' && panel && panel !== group.id) {
              anchorTo(event.currentTarget.querySelector('button')); setPanel(group.id);
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

        </div>)}
      </nav>
    </div>
    <div className="menu-status">
      <span className="menu-indicator" role="img" aria-label={config.wifiLabel} title={config.wifiLabel}><MenuBarIcon src={menuWifi} name="wifi" config={config} /></span>
      <button type="button" className="menu-control menu-status-button menu-profile-button" aria-label="About Perdana" title="About Perdana"
        onClick={event => onAction?.('about', event.currentTarget)}><MenuBarIcon src={menuProfile} name="profile" config={config} /></button>
      <button type="button" className="menu-control menu-status-button" data-search-trigger aria-label={config.searchLabel} title={config.searchLabel}
        onClick={event => onAction?.('search', event.currentTarget)}><MenuBarIcon src={menuSearch} name="search" config={config} /></button>
      <button type="button" className="menu-control menu-status-button" aria-label="Ask perdana.ai" title="Ask perdana.ai"
        aria-haspopup="dialog" onClick={event => onAction?.('assistant', event.currentTarget)}><span className="menu-assistant-icon" style={{ width: Math.min(28, Math.max(8, Number(config.iconSize) || 9.5)), height: Math.min(28, Math.max(8, Number(config.iconSize) || 9.5)), transform: `scale(${config.iconScales?.assistant ?? 1})` }}><AssistantOrb small /></span></button>
      <time dateTime={now.toISOString()} aria-label={formatter.format(now)}>
        <span className="clock-full">{formatter.format(now)}</span><span className="clock-compact" aria-hidden="true">{compactFormatter.format(now)}</span>
      </time>
    </div>
          {menu && <div ref={popover} className="menu-popover" style={position} role="menu" id={`desktop-menu-${menu.id}`} aria-label={menu.label}>
            {menu.items.map(item => <button key={item.action} type="button" role="menuitem"
              aria-controls={item.action === 'toggle-desktop-icons' ? 'desktop-projects' : undefined}
              disabled={['minimize', 'zoom', 'close'].includes(item.action) && (!active || mobile)}
              onClick={() => action(item.action)}><span>{item.action === 'toggle-desktop-icons' && !desktopIconsVisible ? item.showLabel : item.label}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}</button>)}
            {menu.id === 'window' && <><hr />{windows.length ? windows.map(record => <button key={record.id} type="button" role="menuitem"
              onClick={() => action('focus-window', record.id)}><UIIcon name={active?.id === record.id ? 'check' : 'file'} size={14} /><span>{record.title}</span></button>)
              : <p className="menu-empty">{config.noWindows}</p>}</>}
          </div>}
  </header>;
}
