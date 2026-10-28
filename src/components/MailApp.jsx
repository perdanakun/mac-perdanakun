import { useId, useRef, useState } from 'react';
import { profile } from '../data/profile.js';
import { postPortfolio, readAttachment } from '../services/portfolioApi.js';
import UIIcon from './UIIcon.jsx';
import './MailApp.css';

export default function MailApp({ contact }) {
  const id = useId();
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState(contact.subject);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const fileInput = useRef(null);
  const honeypot = useRef(null);
  const busy = useRef(false);
  const attempt = useRef(null);

  function selectAttachment(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) { setError('Choose an attachment smaller than 1.5 MB.'); return; }
    if (file.name.length > 120 || /[\x00-\x1f/\\]/.test(file.name) || !file.size) {
      setError('Choose a non-empty file with a shorter filename.'); return;
    }
    setAttachment(file); setError(''); setSent(false);
  }
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true; setPending(true); setError(''); setSent(false);
    try {
      const body = { name: name.trim(), from: from.trim(), subject: subject.trim(), message: message.trim(),
        website: honeypot.current?.value || '', attachments: attachment ? [await readAttachment(attachment)] : [] };
      const signature = JSON.stringify(body);
      if (attempt.current?.signature !== signature) attempt.current = { signature, requestId: crypto.randomUUID() };
      const result = await postPortfolio('send-email', { ...body, requestId: attempt.current.requestId });
      if (result.success !== true || !result.id) throw new Error('We could not confirm sending. Please try again.');
      setSent(true); setMessage(''); setAttachment(null); attempt.current = null;
    } catch (failure) { setError(failure.message || 'Could not send. Please try again.'); }
    finally { busy.current = false; setPending(false); }
  }
  return <article className="mail-app">
    <form onSubmit={submit} aria-label="Compose email to Perdana" aria-busy={pending}
      onChange={event => { if (event.target.type !== 'file') { setSent(false); setError(''); } }}>
      <div className="mail-compose-header">
      <header className="app-toolbar mail-toolbar"><span><UIIcon name="mail" />{profile.ui.compose}</span>
        <button type="submit" className="button button--primary" disabled={pending || !from.trim() || !subject.trim() || !message.trim()}>
          <UIIcon name="send" size={15} />{pending ? 'Sending…' : 'Send'}</button>
      </header>
        {pending && <p className="mail-feedback" role="status">Sending your message…</p>}
        {error && <p className="mail-feedback mail-feedback--error" role="alert">{error}</p>}
        {sent && <p className="mail-feedback mail-feedback--success" role="status">Message sent.</p>}
      </div>
      <fieldset className="mail-compose-fields" disabled={pending}>
        <legend className="sr-only">Email details</legend>
        <div className="mail-compose-row"><span>To</span><span className="mail-recipient">Perdana</span></div>
        <label className="mail-compose-row"><span>Name</span><input name="name" autoComplete="name" maxLength={100}
          value={name} onChange={event => setName(event.target.value)} placeholder="Your name (optional)" /></label>
        <label className="mail-compose-row"><span>From</span><input name="email" type="email" autoComplete="email" required maxLength={254}
          value={from} onChange={event => setFrom(event.target.value)} placeholder="Your email address" /></label>
        <label className="mail-compose-row"><span>Subject</span><input name="subject" required maxLength={160}
          value={subject} onChange={event => setSubject(event.target.value)} /></label>
      </fieldset>
      <div className="mail-compose-body">
        <label className="sr-only" htmlFor={`${id}-message`}>Message</label>
        <textarea id={`${id}-message`} name="message" required maxLength={10_000} disabled={pending}
          value={message} onChange={event => setMessage(event.target.value)} placeholder="Write your message…" rows={3} />
        <div className="mail-honeypot" aria-hidden="true"><label>Leave this blank<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="mail-attachment-actions">
          <input ref={fileInput} type="file" className="sr-only" tabIndex={-1} aria-label="Choose attachment" onChange={selectAttachment} disabled={pending} />
          <button type="button" className="button button--secondary" onClick={() => fileInput.current?.click()} disabled={pending}>Attach file</button>
          {attachment ? <span className="mail-attachment"><span>{attachment.name}</span>
            <button type="button" aria-label="Remove attachment" disabled={pending} onClick={() => setAttachment(null)}><UIIcon name="close" size={12} /></button></span>
            : <small>One file · up to 1.5 MB</small>}
        </div>

      </div>
    </form>

  </article>;
}
