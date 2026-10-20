import { useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useIsPresent, useMotionValue, useReducedMotion } from 'framer-motion';
import { usePointerDrag } from '../hooks/usePointerDrag.js';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
import { resizeEdges, useWindowResize } from '../hooks/useWindowResize.js';
import { collapseTransform, fitFrame, rectOf, viewportFrame } from '../utils/geometry.js';
import { profile } from '../data/profile.js';

const spring = { type: 'spring', stiffness: 420, damping: 36, mass: .8 };
const zoomTransition = { duration: .24, ease: [.2, .8, .2, 1] };
const minimizeTransition = { duration: .28, ease: [.4, 0, 1, 1] };

// Window focus treatment informed by alanagoyal.com (MIT); see LICENSE-THIRD-PARTY.
// Glyphs below are original inline SVGs, without Apple assets or font-dependent symbols.

export default function Window({ record, order, focused, blocked, onFocus, onClose, onMinimize, onZoom, onMove, children }) {
  const ref = useRef(null);
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(() => record.maximized ? viewportFrame() : fitFrame(record.frame));
  const left = useMotionValue(frame.x);
  const top = useMotionValue(frame.y);
  const width = useMotionValue(frame.width);
  const height = useMotionValue(frame.height);
  const geometryAnimations = useRef([]);
  const previousZoom = useRef(record.maximized);
  const initial = useRef(null);
  if (!initial.current) initial.current = collapseTransform(record.origin, frame);

  useLayoutEffect(() => {
    const zoomChanged = previousZoom.current !== record.maximized;
    previousZoom.current = record.maximized;
    const update = (smooth = false) => {
      const next = record.maximized ? viewportFrame() : fitFrame(record.frame);
      setFrame(next);
      geometryAnimations.current.forEach(animation => animation.stop());
      const values = [[left, next.x], [top, next.y], [width, next.width], [height, next.height]];
      geometryAnimations.current = smooth && !reduced
        ? values.map(([value, target]) => animate(value, target, zoomTransition))
        : [];
      if (!smooth || reduced) values.forEach(([value, target]) => value.set(target));
    };
    update(zoomChanged);
    const resize = () => update();
    window.addEventListener('resize', resize);
    return () => {
      geometryAnimations.current.forEach(animation => animation.stop());
      window.removeEventListener('resize', resize);
    };
  }, [record.frame, record.maximized, record.minimized, left, top, width, height, reduced]);

  useSurfaceFocus(ref, {
    active: focused && present && !blocked && !record.minimized,
    modal: record.maximized,
    onClose: () => record.maximized ? onZoom(record.id) : onClose(record.id),
    restoreTarget: record.trigger,
  });
  const readFrame = () => ({ x: left.get(), y: top.get(), width: width.get(), height: height.get() });
  const applyFrame = next => { left.set(next.x); top.set(next.y); width.set(next.width); height.set(next.height); };
  const settle = () => {
    geometryAnimations.current.forEach(animation => animation.stop());
    applyFrame(frame);
  };
  const resize = useWindowResize({
    enabled: !record.maximized && present && !blocked && !record.minimized,
    read: readFrame, apply: applyFrame, settle,
    commit: next => onMove(record.id, next),
    minimum: { width: ['notes', 'gallery', 'finder'].includes(record.kind) ? 480 : 360, height: 240 },
  });
  const drag = usePointerDrag({
    enabled: !record.maximized && present && !blocked && !record.minimized,
    start: () => {
      // Finish an interrupted restore before handing position over to pointer input.
      geometryAnimations.current.forEach(animation => animation.stop());
      left.set(frame.x); top.set(frame.y);
      width.set(frame.width); height.set(frame.height);
      return { x: left.get(), y: top.get() };
    },
    move: ({ dx, dy, origin }) => {
      const next = fitFrame({ ...frame, x: origin.x + dx, y: origin.y + dy });
      left.set(next.x); top.set(next.y);
    },
    end: ({ moved, cancelled, origin }) => {
      if (cancelled) { left.set(origin.x); top.set(origin.y); return; }
      if (moved) onMove(record.id, { ...frame, x: left.get(), y: top.get() });
    },
  });

  const source = rectOf(record.trigger) ?? record.origin;
  const away = collapseTransform(source, { x: left.get(), y: top.get(), width: width.get(), height: height.get() });
  const inactive = blocked || record.minimized || !present;

  return (
    <motion.section ref={ref} role="dialog" aria-modal={record.maximized || undefined} aria-labelledby={`${record.id}-title`} tabIndex={-1}
      aria-hidden={inactive || undefined} inert={inactive}
      className="window" data-kind={record.kind} data-focused={focused && !inactive} data-maximized={record.maximized}
      style={{ left, top, width, height, zIndex: (record.maximized ? 600 : 20) + order,
        pointerEvents: inactive ? 'none' : 'auto', transformOrigin: '0 0' }}
      initial={reduced ? { opacity: 0 } : initial.current}
      animate={record.minimized ? (reduced ? { opacity: 0 } : away) : { x: 0, y: 0, scale: 1, opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { ...away, transition: { duration: .16, ease: 'easeIn' } }}
      transition={reduced ? { duration: .12 } : record.minimized ? minimizeTransition : spring}
      onPointerDownCapture={() => onFocus(record.id)}
      onFocusCapture={() => onFocus(record.id)}>
      <header className="window__titlebar" {...drag.handlers}
        onPointerDown={event => {
          if (!event.target.closest('button, a')) drag.handlers.onPointerDown(event);
        }}
        onDoubleClick={event => {
          if (!event.target.closest('button, a') && !drag.dragged.current) onZoom(record.id);
        }}>
        <div className="traffic-lights">
          <button type="button" className="traffic-button traffic-button--close"
            aria-label={`${profile.ui.close}: ${record.title}`} onClick={() => onClose(record.id)}>
            <span aria-hidden="true"><svg viewBox="0 0 12 12" focusable="false"><path d="m3.5 3.5 5 5m0-5-5 5" /></svg></span>
          </button>
          <button type="button" className="traffic-button traffic-button--minimize"
            aria-label={`${profile.ui.minimize}: ${record.title}`} onClick={() => onMinimize(record.id)}>
            <span aria-hidden="true"><svg viewBox="0 0 12 12" focusable="false"><path d="M3 6h6" /></svg></span>
          </button>
          <button type="button" className="traffic-button traffic-button--zoom"
            aria-label={`${record.maximized ? profile.ui.restore : profile.ui.zoom}: ${record.title}`}
            aria-pressed={record.maximized} onClick={() => onZoom(record.id)}>
            <span aria-hidden="true"><svg viewBox="0 0 12 12" focusable="false" className="traffic-glyph--zoom">
              <path d={record.maximized ? 'M2 5h3V2zM10 7H7v3z' : 'M2.5 2.5h4l-4 4zM9.5 9.5h-4l4-4z'} />
            </svg></span>
          </button>
        </div>
        <h1 id={`${record.id}-title`}>{record.title}</h1>
        <span className="titlebar-spacer" aria-hidden="true" />
      </header>
      <div className={`window__content window__content--${record.kind}`}>{children}</div>
      {!record.maximized && resizeEdges.map(edge => <button key={edge} type="button"
        className={`window-resize window-resize--${edge}`} data-edge={edge}
        aria-label={`${profile.ui.resizeEdges[edge]}: ${record.title}`} {...resize} />)}
    </motion.section>
  );
}
