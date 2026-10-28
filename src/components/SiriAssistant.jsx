import { useEffect, useRef } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
import AssistantOrb from './AssistantOrb.jsx';
import UIIcon from './UIIcon.jsx';
import './SiriAssistant.css';

const suggestions = ['Tell me about Perdana', 'What kind of work does he do?', 'How can we work together?'];

export default function SiriAssistant({ chat, trigger, onClose, onContact }) {
  const ref = useRef(null);
  const log = useRef(null);
  const present = useIsPresent();
  const reduced = useReducedMotion();
  useSurfaceFocus(ref, { active: present, modal: true, onClose, restoreTarget: trigger });
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [chat.messages, chat.pending, chat.error]);
  return <motion.div className="assistant-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: .14 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={ref} role="dialog" aria-modal="true" aria-label="perdana.ai assistant" tabIndex={-1} inert={!present}
      className="siri-assistant" initial={reduced ? undefined : { y: -8, scale: .97 }} animate={{ y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 430, damping: 34 }}>
      <header className="assistant-toolbar"><span>Portfolio assistant</span><div>
        <button type="button" className="assistant-text-button" onClick={chat.clear} disabled={!chat.messages.length && !chat.draft}>New chat</button>
        <button type="button" className="assistant-icon-button" aria-label="Close assistant" onClick={onClose}><UIIcon name="close" size={14} /></button>
      </div></header>
      <div className="assistant-identity"><AssistantOrb active={chat.pending} /><div><h2>perdana.ai</h2><p>Ask a little. Get to know Perdana.</p></div></div>
      <div ref={log} className="assistant-conversation" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
        {!chat.messages.length && <div className="assistant-welcome"><h3>What would you like to know?</h3>
          <p>His work, experience, or the story behind this portfolio.</p>
          <div className="assistant-suggestions">{suggestions.map(question => <button type="button" key={question} onClick={() => chat.send(question)}>
            {question}<UIIcon name="chevron-right" size={12} /></button>)}</div>
        </div>}
        {chat.messages.map((message, index) => <div className={`assistant-message assistant-message--${message.sender}`} key={index}>
          <span className="assistant-message-author">{message.sender === 'user' ? 'You' : 'perdana.ai'}</span><p>{message.text}</p>
        </div>)}
        {chat.pending && <p className="assistant-thinking" role="status"><span className="assistant-thinking-dots" aria-hidden="true">•••</span>Thinking…</p>}
      </div>
      {chat.error && <div className="assistant-error"><p role="alert">{chat.error}</p>
        {chat.canRetry && <button type="button" onClick={chat.retry} disabled={chat.pending}>Try again</button>}</div>}
      <form className="assistant-composer" onSubmit={event => { event.preventDefault(); chat.send(chat.draft); }}>
        <label className="sr-only" htmlFor="assistant-prompt">Ask about Perdana</label>
        <textarea id="assistant-prompt" data-autofocus value={chat.draft} onChange={event => chat.setDraft(event.target.value)}
          placeholder="Ask about Perdana…" rows={2} maxLength={4000} onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !event.repeat) {
              event.preventDefault(); chat.send(chat.draft);
            }
          }} />
        {chat.pending ? <button type="button" className="assistant-send" aria-label="Stop response" onClick={chat.stop}><span className="assistant-stop" /></button>
          : <button type="submit" className="assistant-send" aria-label="Send question" disabled={!chat.draft.trim()}><UIIcon name="send" size={17} /></button>}
      </form>
      <footer className="assistant-footer"><span>AI answers may be imperfect. Messages go to Google Gemini.</span>
        <button type="button" onClick={onContact}>Contact Perdana<UIIcon name="external" size={11} /></button></footer>
    </motion.section>
  </motion.div>;
}
