import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profile, dockApps } from '../data/profile.js';
import UIIcon from './UIIcon.jsx';

function Notification({ item, hidden, onDismiss, onActivate }) {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const app = dockApps.find(app => app.id === item.appId);
  useEffect(() => {
    if (paused || hidden || !item.duration) return;
    const timer = setTimeout(() => {
      if (!ref.current?.contains(document.activeElement)) onDismiss(item.id);
    }, item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, paused, hidden, onDismiss]);
  return <motion.article ref={ref} className="notification" layout={!reduced}
    initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={reduced ? { opacity: 0 } : { opacity: 0, x: 48 }}
    transition={reduced ? { duration: .12 } : { type: 'spring', stiffness: 420, damping: 34 }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onDismiss(item.id); document.querySelector('.dock-button')?.focus(); }
    }}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <button type="button" className="notification-body" onClick={event => {
      onActivate(item, event.currentTarget); onDismiss(item.id);
    }}>
      <img src={app?.icon || app?.fallbackIcon} width="32" height="32" alt="" />
      <span className="notification-copy"><strong>{item.title}</strong><span>{item.message}</span></span>
      <span className="notification-time">{profile.notifications.now}</span>
    </button>
    <button type="button" className="notification-close" aria-label={`${profile.notifications.close}: ${item.title}`}
      onClick={() => onDismiss(item.id)}><UIIcon name="close" size={12} /></button>
  </motion.article>;
}

export default function Notifications({ hidden, onActivate, replay = 0 }) {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    setVisible([]);
    const timers = profile.notifications.items.map(item => setTimeout(() => setVisible(current => [...current.filter(i => i.id !== item.id), item]), item.delay));
    return () => timers.forEach(clearTimeout);
  }, [replay]);
  // Stable handler keeps countdowns from resetting when unrelated windows change.
  const dismiss = useRef(id => setVisible(current => current.filter(item => item.id !== id))).current;
  return <aside className="notification-center" aria-label={profile.notifications.label} aria-live={hidden ? 'off' : 'polite'} aria-relevant="additions"
    aria-hidden={hidden || undefined} inert={hidden} data-hidden={hidden}>
    <AnimatePresence>{visible.map(item => <Notification key={item.id} item={item} hidden={hidden} onDismiss={dismiss} onActivate={onActivate} />)}</AnimatePresence>
  </aside>;
}
