import { useEffect, useRef } from 'react';
import AssistantOrb from './AssistantOrb.jsx';

// The conversation lives inside Spotlight; no second dialog or focus trap.
export default function SiriAssistant({ chat }) {
  const log = useRef(null);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [chat.messages, chat.pending, chat.error]);
  return <>
    <div ref={log} className="assistant-conversation" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
      {chat.messages.map((message, index) => <div className={`assistant-message assistant-message--${message.sender}`} key={index}>
        <span className="sr-only">{message.sender === 'user' ? 'You' : 'perdana.ai'}: </span><p>{message.text}</p>
      </div>)}
      {chat.pending && <div className="assistant-thinking" role="status"><AssistantOrb active small /><span>Thinking…</span></div>}
    </div>
    {chat.error && <div className="assistant-error"><p role="alert">{chat.error}</p>
      {chat.canRetry && <button type="button" onClick={chat.retry} disabled={chat.pending}>Try again</button>}</div>}
  </>;
}
