import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { profile } from '../data/profile.js';
import { searchPortfolio } from '../utils/search.js';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
import UIIcon from './UIIcon.jsx';

export default function Spotlight({ projects, apps, trigger, onClose, onSelect }) {
  const ref = useRef(null);
  const id = useId();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(0);
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const text = profile.spotlight;
  const results = useMemo(() => searchPortfolio(query, projects, apps), [query, projects, apps]);
  const index = Math.min(selection, Math.max(results.length - 1, 0));
  useSurfaceFocus(ref, { active: present, modal: true, onClose, restoreTarget: trigger });
  useEffect(() => {
    ref.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [index, query]);
  return <motion.div className="spotlight-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}
    onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={ref} role="dialog" aria-modal="true" aria-label={text.title} tabIndex={-1} inert={!present} className="spotlight"
      initial={reduced ? undefined : { y: -8, scale: .98 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 440, damping: 34 }}>
      <div className="spotlight-field"><UIIcon name="search" size={25} />
        <input data-autofocus role="combobox" aria-label={text.title} aria-autocomplete="list" aria-expanded={results.length > 0}
          aria-controls={`${id}-results`} aria-activedescendant={results.length ? `${id}-${index}` : undefined}
          value={query} placeholder={text.placeholder} onChange={event => { setQuery(event.target.value); setSelection(0); }}
          onKeyDown={event => {
            if (['ArrowDown', 'ArrowUp'].includes(event.key) && results.length) {
              event.preventDefault(); setSelection((index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
            }
            if (event.key === 'Enter' && results[index]) { event.preventDefault(); onSelect(results[index]); }
          }} />
        <button type="button" className="spotlight-close" aria-label={profile.ui.close} onClick={onClose}><UIIcon name="close" size={16} /></button>
      </div>
      <div className="spotlight-results" id={`${id}-results`} role="listbox" aria-label={text.resultsLabel}>
        {results.map((entry, itemIndex) => <button key={entry.id} id={`${id}-${itemIndex}`} type="button" role="option" tabIndex={-1}
          aria-selected={index === itemIndex} className="spotlight-result" onMouseMove={() => setSelection(itemIndex)} onClick={() => onSelect(entry)}>
          <img src={entry.icon} width="32" height="32" alt="" /><span><strong>{entry.title}</strong><small>{entry.subtitle || text.application}</small></span>
          <UIIcon name="chevron-right" size={14} />
        </button>)}
      </div>
      {!results.length && <p className="spotlight-empty" role="status">{text.empty}</p>}
      <footer>{text.hint}</footer>
    </motion.section>
  </motion.div>;
}
