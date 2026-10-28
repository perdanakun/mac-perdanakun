import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSlideshowFullscreen } from '../hooks/useSlideshowFullscreen.js';
import UIIcon from './UIIcon.jsx';
import './ProjectGallery.css';

export default function ProjectGallery({ project }) {
  const root = useRef(null);
  const slideshow = useSlideshowFullscreen(root);
  const [index, setIndex] = useState(0);
  const [navigator, setNavigator] = useState(true);
  const [info, setInfo] = useState(false);
  const [failed, setFailed] = useState(null);
  const thumbnails = useRef(null);
  const touch = useRef(null);
  const reduced = useReducedMotion();
  const id = useId();
  const slides = project.images;
  const current = Math.min(index, Math.max(0, slides.length - 1));
  const slide = slides[current];
  const go = next => setIndex(Math.max(0, Math.min(next, slides.length - 1)));
  useEffect(() => {
    thumbnails.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [current, navigator]);
  useEffect(() => {
    if (globalThis.navigator.connection?.saveData) return;
    const next = slides[current + 1];
    if (next) { const image = new Image(); image.src = next.src; }
  }, [current, slides]);
  const details = [['Category', project.category], ['Year', project.year], ['Client', project.client], ['Tools', project.tools?.join(', ')]].filter(([, value]) => value);
  return <article ref={root} className="keynote" data-navigator={navigator} data-info={info}
    data-presenting={slideshow.presenting || undefined}
    onKeyDown={event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (slideshow.presenting && event.key === 'Tab') {
        event.preventDefault(); event.stopPropagation();
        root.current.querySelector('.keynote-stage')?.focus();
        return;
      }
      if (event.key === ' ' && event.target.closest('button')) return;
      if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End', ...(slideshow.presenting ? [' ', 'ArrowDown', 'ArrowUp'] : [])].includes(event.key)) {
        // The navigator handles its own roving keyboard focus.
        if (event.target.closest('.keynote-navigator')) return;
        event.preventDefault(); event.stopPropagation();
        go(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (['ArrowRight', 'PageDown', ' ', 'ArrowDown'].includes(event.key) ? 1 : -1));
      }
    }}>
    <header className="keynote-toolbar">
      <div className="keynote-toolbar-group">
        <button type="button" className="keynote-tool" aria-label={navigator ? 'Hide slide navigator' : 'Show slide navigator'}
          aria-expanded={navigator} aria-controls={`${id}-navigator`} onClick={() => setNavigator(value => !value)}>
          <UIIcon name="sidebar" size={19} /><span>View</span>
        </button>
        <span className="keynote-toolbar-divider" />
        <button type="button" className="keynote-step" aria-label="Previous slide" disabled={current === 0} onClick={() => go(current - 1)}><UIIcon name="chevron-left" /></button>
        <button type="button" className="keynote-step" aria-label="Next slide" disabled={current === slides.length - 1 || !slides.length} onClick={() => go(current + 1)}><UIIcon name="chevron-right" /></button>
      </div>
      <div className="keynote-toolbar-group">
        <button type="button" className="keynote-tool" aria-label="Start fullscreen slideshow" onClick={event => slideshow.enter(event.currentTarget)}>
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4" /></svg><span>Full screen</span>
        </button>
        <button type="button" className="keynote-tool" aria-label="Project information" aria-expanded={info} aria-controls={`${id}-info`} onClick={() => setInfo(value => !value)}><UIIcon name="info" size={19} /><span>Info</span></button>
      </div>
    </header>
    {slideshow.error && <p className="keynote-fullscreen-error" role="alert">{slideshow.error}</p>}
    <div className="keynote-workspace">
      <nav ref={thumbnails} id={`${id}-navigator`} className="keynote-navigator" aria-label="Slides" hidden={!navigator}>
        {slides.map((image, itemIndex) => <button type="button" key={`${image.src}-${itemIndex}`} className="keynote-slide"
          aria-label={`Slide ${itemIndex + 1} of ${slides.length}`} aria-current={current === itemIndex ? 'true' : undefined}
          tabIndex={current === itemIndex ? 0 : -1} onClick={() => go(itemIndex)}
          onKeyDown={event => {
            if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault(); event.stopPropagation();
            const next = Math.max(0, Math.min(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : itemIndex + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1), slides.length - 1));
            go(next); thumbnails.current.querySelectorAll('button')[next]?.focus({ preventScroll: true });
          }}>
          <span className="keynote-slide-number">{itemIndex + 1}</span>
          <span className="keynote-slide-preview"><img src={image.src} alt="" loading="lazy" decoding="async" draggable="false" /></span>
        </button>)}
      </nav>
      <div className="keynote-main">
        <div className="keynote-stage"
          onDoubleClick={event => {
            if (slideshow.presenting) { event.preventDefault(); event.stopPropagation(); void slideshow.exit(); }
          }} tabIndex={0} role="region" aria-label={`${project.title} slide viewer. Use left and right arrow keys.`}
          onTouchStart={event => { const t = event.touches[0]; touch.current = event.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null; }}
          onTouchCancel={() => { touch.current = null; }}
          onTouchEnd={event => {
            const start = touch.current; touch.current = null;
            if (!start || !event.changedTouches.length) return;
            const end = event.changedTouches[0], dx = end.clientX - start.x, dy = end.clientY - start.y;
            if (slideshow.presenting && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
              if (event.cancelable) event.preventDefault();
              void slideshow.exit();
              return;
            }
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(current + (dx < 0 ? 1 : -1));
          }}>
          {slide ? failed === slide.src ? <div className="keynote-error" role="status">Image unavailable<button type="button" onClick={() => setFailed(null)}>Try again</button></div>
            : <div className="keynote-canvas"><motion.img key={slide.src} className="keynote-master" src={slide.src} alt={slide.alt || `${project.title}, slide ${current + 1}`}
              draggable="false" decoding="async" onError={() => setFailed(slide.src)}
              initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: .16 }} /></div>
            : <p className="keynote-error">No slides available.</p>}
        </div>
      </div>
      <aside id={`${id}-info`} className="keynote-inspector" hidden={!info} aria-label="Project information">
        <h2>{project.title}</h2>{project.description && <p>{project.description}</p>}
        <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </aside>
    </div>
    {slideshow.presenting && slideshow.hint && <div className="keynote-fullscreen-hint" role="status">
      {globalThis.matchMedia?.('(pointer: coarse)').matches
        ? 'tap anywhere to exit'
        : <>double-click or press <kbd>esc</kbd> to exit</>}
    </div>}
  </article>;
}
