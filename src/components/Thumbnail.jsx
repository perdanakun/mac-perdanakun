import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { usePointerDrag } from '../hooks/usePointerDrag.js';
import { clamp, desktopBounds } from '../utils/geometry.js';
import { profile } from '../data/profile.js';
import LazyImage from './LazyImage.jsx';

const prefetched = new Set();
function preload(project) {
  if (navigator.connection?.saveData) return;
  // Warm the first two full images, leaving larger galleries lazy-loaded.
  for (const { src } of project.images.slice(0, 2)) {
    if (prefetched.has(src)) continue;
    prefetched.add(src);
    const image = new Image();
    image.decoding = 'async';
    image.onerror = () => prefetched.delete(src);
    image.src = src;
  }
}

export default function Thumbnail({ project, position, index, mobile, open, onOpen, onPosition }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const hoverTimer = useRef(null);

  const constrain = (x, y) => {
    const bounds = desktopBounds();
    return {
      x: clamp(x, bounds.left, bounds.right - ref.current.offsetWidth),
      y: clamp(y, bounds.top, bounds.bottom - ref.current.offsetHeight),
    };
  };
  useLayoutEffect(() => {
    if (mobile) return;
    const place = () => {
      const point = constrain(window.innerWidth * position.x / 100 - ref.current.offsetWidth / 2,
        window.innerHeight * position.y / 100 - ref.current.offsetHeight / 2);
      left.set(point.x); top.set(point.y);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(ref.current);
    window.addEventListener('resize', place);
    return () => { observer.disconnect(); window.removeEventListener('resize', place); };
  }, [mobile, position.x, position.y, left, top]);

  const drag = usePointerDrag({
    enabled: !mobile,
    start: () => ({ x: left.get(), y: top.get() }),
    move: ({ dx, dy, origin }) => {
      const point = constrain(origin.x + dx, origin.y + dy);
      left.set(point.x); top.set(point.y);
    },
    end: ({ moved, cancelled, origin }) => {
      if (cancelled) { left.set(origin.x); top.set(origin.y); return; }
      if (moved) onPosition(project.id, {
        x: (left.get() + ref.current.offsetWidth / 2) / window.innerWidth * 100,
        y: (top.get() + ref.current.offsetHeight / 2) / window.innerHeight * 100,
      });
    },
  });
  useLayoutEffect(() => () => clearTimeout(hoverTimer.current), []);

  return (
    <motion.div ref={ref} className={`thumbnail thumbnail--${project.size || 'm'}`}
      style={mobile ? { left: 0, top: 0 } : { left, top }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: .82, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={reduced ? { duration: .12 } : { type: 'spring', stiffness: 380, damping: 26, delay: index * .045 }}>
      <motion.button type="button" className="thumbnail__button" {...drag.handlers}
        aria-label={`${profile.ui.openProject}: ${project.title} — ${project.category}`} aria-expanded={open} aria-haspopup="dialog"
        style={{ '--thumbnail-rotation': `${mobile ? 0 : project.rotate || 0}deg` }}
        whileHover={reduced || mobile ? undefined : { y: -5, scale: 1.04 }}
        whileTap={reduced ? undefined : { scale: .97 }}
        onPointerEnter={event => {
          if (!mobile && event.pointerType === 'mouse') hoverTimer.current = setTimeout(() => preload(project), 120);
        }}
        onPointerLeave={() => clearTimeout(hoverTimer.current)}
        onFocus={() => { if (!mobile) preload(project); }}
        onClick={event => {
          if (!mobile && event.detail !== 0 && drag.dragged.current) { event.preventDefault(); return; }
          onOpen(project, event.currentTarget);
        }}>
        <div className="thumbnail__preview">
          <LazyImage src={project.thumbnail} alt="" width={480} height={360} thumbnail />
        </div>
        <span className="thumbnail__label">{project.title}</span>
      </motion.button>
    </motion.div>
  );
}
