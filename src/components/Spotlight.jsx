import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { searchPortfolio } from '../utils/search.js';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
import UIIcon from './UIIcon.jsx';
import AssistantOrb from './AssistantOrb.jsx';
import SiriAssistant from './SiriAssistant.jsx';
import './SiriAssistant.css';

// Search and Ask share a single modal and focus lifecycle, regardless of opener.
export default function Spotlight({ projects, apps, trigger, mode = 'search', chat, onModeChange, onClose, onSelect }) {
  const ref = useRef(null);
  const input = useRef(null);
  const id = useId();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(0);
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const asking = mode === 'ask';
  const conversation = asking && chat.messages.length > 0;
  const value = asking ? chat.draft : query;
  const results = useMemo(() => query.trim() ? [
    ...searchPortfolio(query, projects, apps),
    { id: 'ask-question', title: query.trim(), subtitle: 'Ask perdana.ai', type: 'ask' },
  ] : [], [query, projects, apps]);
  const index = Math.min(selection, Math.max(results.length - 1, 0));
  useSurfaceFocus(ref, { active: present, modal: true, onClose, restoreTarget: trigger });
  useEffect(() => {
    ref.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [index, query]);
  useEffect(() => { input.current?.focus({ preventScroll: true }); }, [mode]);
  function changeMode(next) {
    if (next === 'ask' && query.trim()) { chat.setDraft(query); setQuery(''); }
    onModeChange(next); setSelection(0);
  }
  function choose(entry) {
    if (entry.type === 'ask') { onModeChange('ask'); chat.send(query); setQuery(''); }
    else onSelect(entry);
  }
  function submit(event) {
    event.preventDefault();
    if (asking) chat.send(value);
    else if (results[index]) choose(results[index]);
  }
  return <motion.div className="spotlight-backdrop ask-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: .14 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={ref} role="dialog" aria-modal="true" aria-label="Search or Ask" tabIndex={-1} inert={!present}
      className={`ask-surface${conversation ? ' ask-surface--conversation' : ''}`}
      initial={reduced ? undefined : { y: -8, scale: .98 }} animate={{ y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 430, damping: 34 }}>
      <div className="ask-controls">
        <div className="ask-modes" role="group" aria-label="Search or Ask mode">
          <button type="button" aria-pressed={!asking} onClick={() => changeMode('search')}>Search</button>
          <button type="button" aria-pressed={asking} onClick={() => changeMode('ask')}>Ask</button>
        </div>
        <div className="ask-actions">
          {asking && chat.messages.length > 0 && <button type="button" className="ask-icon-button" aria-label="New chat" title="New chat" onClick={() => { chat.clear(); input.current?.focus(); }}><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
          <button type="button" className="ask-icon-button" aria-label="Close Search or Ask" onClick={onClose}><UIIcon name="close" size={16} /></button>
        </div>
      </div>
      {conversation && <SiriAssistant chat={chat} />}
      <form className="ask-field" onSubmit={submit}>
        {asking ? <AssistantOrb active={chat.pending} small /> : <UIIcon name="search" size={23} />}
        <input ref={input} data-autofocus value={value} maxLength={4000} autoComplete="off"
          aria-label={asking ? 'Ask about Perdana' : 'Search portfolio'} placeholder={asking ? 'Ask about Perdana…' : 'Search or Ask'}
          role={asking ? undefined : 'combobox'} aria-autocomplete={asking ? undefined : 'list'}
          aria-expanded={asking ? undefined : results.length > 0} aria-controls={asking ? undefined : `${id}-results`}
          aria-activedescendant={!asking && results.length ? `${id}-${index}` : undefined}
          onChange={event => { asking ? chat.setDraft(event.target.value) : setQuery(event.target.value); setSelection(0); }}
          onKeyDown={event => {
            if (event.nativeEvent.isComposing || event.repeat) { if (event.key === 'Enter') event.preventDefault(); return; }
            if (!asking && ['ArrowDown', 'ArrowUp'].includes(event.key) && results.length) {
              event.preventDefault(); setSelection((index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
            }
          }} />
        {asking && chat.pending ? <button type="button" className="ask-icon-button" aria-label="Stop response" onClick={chat.stop}><span className="assistant-stop" /></button>
          : <button type="submit" className="ask-icon-button ask-send" aria-label={asking ? 'Send question' : 'Open result'} disabled={!value.trim()}><span aria-hidden="true">↑</span></button>}
      </form>
      {!asking && results.length > 0 && <div className="ask-results" id={`${id}-results`} role="listbox" aria-label="Search results">
        {results.map((entry, itemIndex) => <button key={entry.id} id={`${id}-${itemIndex}`} type="button" role="option" tabIndex={-1}
          aria-selected={index === itemIndex} className="ask-result" onMouseMove={() => setSelection(itemIndex)} onClick={() => choose(entry)}>
          {entry.type === 'ask' ? <AssistantOrb small /> : <img src={entry.icon} width="30" height="30" alt="" />}
          <span><strong>{entry.title}</strong><small>{entry.subtitle || 'Application'}</small></span><UIIcon name="chevron-right" size={12} />
        </button>)}
      </div>}
    </motion.section>
  </motion.div>;
}
