import { useRef } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';

export default function AlertDialog({ app, dialog, trigger, onClose, onContact }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const present = useIsPresent();
  useSurfaceFocus(ref, { active: present, modal: true, onClose, restoreTarget: trigger });
  return (
    <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: .12 }}
      onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section ref={ref} role="alertdialog" aria-modal="true" tabIndex={-1}
        aria-labelledby={`skill-${app.id}-title`} aria-describedby={`skill-${app.id}-message`}
        inert={!present} className="alert-dialog"
        initial={reduced ? undefined : { scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 440, damping: 30 }}>
        <img src={app.icon} alt="" width={64} height={64} />
        <h2 id={`skill-${app.id}-title`}>{dialog.title}</h2>
        <p className="skill-context">{dialog.context}</p>
        <p id={`skill-${app.id}-message`}>{dialog.message}</p>
        <div className="dialog-actions">
          <button type="button" className="button button--secondary" onClick={onClose}>{dialog.secondaryLabel}</button>
          <button type="button" className="button button--primary" data-autofocus onClick={onContact}>{dialog.primaryLabel}</button>
        </div>
      </motion.section>
    </motion.div>
  );
}
