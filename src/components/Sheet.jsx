import { useRef } from 'react';
import { motion, useDragControls, useIsPresent, useReducedMotion } from 'framer-motion';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
import { profile } from '../data/profile.js';

export default function Sheet({ record, blocked, onClose, children }) {
  const ref = useRef(null);
  const controls = useDragControls();
  const reduced = useReducedMotion();
  const present = useIsPresent();
  useSurfaceFocus(ref, { active: present && !blocked, modal: true,
    onClose: () => onClose(record.id), restoreTarget: record.trigger });
  return (
    <motion.section ref={ref} role="dialog" aria-modal="true" tabIndex={-1}
      aria-labelledby={`${record.id}-sheet-title`} aria-hidden={!present || blocked || undefined}
      inert={!present || blocked} className="sheet"
      initial={reduced ? { opacity: 0 } : { y: '100%' }}
      animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: '100%' }}
      transition={reduced ? { duration: .12 } : { type: 'spring', stiffness: 380, damping: 36 }}
      drag="y" dragControls={controls} dragListener={false} dragMomentum={false}
      dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .5 }}
      dragTransition={{ bounceStiffness: 700, bounceDamping: 45 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 110 || (info.offset.y > 30 && info.velocity.y > 700)) onClose(record.id);
      }}>
      <header className="sheet__header" title={profile.ui.swipeHint}
        onPointerDown={event => { if (!event.target.closest('button, a')) controls.start(event); }}>
        <span className="sheet__grabber" aria-hidden="true" />
        <h1 id={`${record.id}-sheet-title`}>{record.title}</h1>
        <button type="button" className="sheet__close" aria-label={`${profile.ui.close}: ${record.title}`}
          onClick={() => onClose(record.id)}>
          <span aria-hidden="true"><svg viewBox="0 0 12 12" focusable="false"><path d="m3.5 3.5 5 5m0-5-5 5" /></svg></span>
        </button>
      </header>
      <div className={`sheet__content window__content--${record.kind}`}>{children}</div>
    </motion.section>
  );
}
