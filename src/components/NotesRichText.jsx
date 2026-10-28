import { Fragment } from 'react';

// Data stays plain text / structured fragments. Never inject HTML from notes.
export function safeNoteHref(value) {
  if (typeof value !== 'string') return null;
  const href = value.trim();
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) ? href : null;
}

export function plainNoteText(value) {
  if (Array.isArray(value)) return value.map(plainNoteText).join('');
  if (value && typeof value === 'object') return String(value.text ?? value.label ?? '');
  return String(value ?? '');
}

export function NoteLink({ href, children, ...props }) {
  const safe = safeNoteHref(href);
  if (!safe) return <span>{children}</span>;
  const external = /^https?:\/\//i.test(safe);
  return <a {...props} href={safe} target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
}

export default function RichText({ value }) {
  if (Array.isArray(value)) return value.map((part, index) => <Fragment key={index}><RichText value={part} /></Fragment>);
  if (value && typeof value === 'object') {
    const label = plainNoteText(value);
    let content = value.href ? <NoteLink href={value.href}>{label}</NoteLink> : label;
    if (value.bold) content = <strong>{content}</strong>;
    if (value.italic) content = <em>{content}</em>;
    return content;
  }
  const text = plainNoteText(value);
  return text.split(/(https?:\/\/[^\s<>"']+|mailto:[^\s<>"']+)/gi).map((part, index) => {
    if (!/^(https?:\/\/|mailto:)/i.test(part)) return <Fragment key={index}>{part}</Fragment>;
    const href = part.replace(/[.,;:!?\])]+$/, '');
    const punctuation = part.slice(href.length);
    return <Fragment key={index}><NoteLink href={href}>{href}</NoteLink>{punctuation}</Fragment>;
  });
}
