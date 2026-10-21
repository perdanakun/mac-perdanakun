import { useEffect, useRef, useState } from 'react';
import UIIcon from './UIIcon.jsx';
import { SearchField } from './Controls.jsx';
import RichText, { NoteLink, plainNoteText } from './RichText.jsx';

export default function NotesApp({ notes, profile, mobile, requestedNote }) {
  const [selected, setSelected] = useState(notes[0]?.id);
  const [query, setQuery] = useState('');
  const sidebar = useRef(null);
  const text = profile.notesApp;
  useEffect(() => {
    if (requestedNote && notes.some(note => note.id === requestedNote.id)) {
      setSelected(requestedNote.id); setQuery('');
    }
  }, [requestedNote, notes]);
  const visible = notes.filter(note => [note.title, ...(note.paragraphs || []).map(plainNoteText),
    ...(note.items || []).map(item => `${item.title} ${plainNoteText(item.description)}`),
    ...(note.links || []).map(link => link.label)].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const active = visible.find(note => note.id === selected) ?? visible[0];
  function navigate(event, index) {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key) || !visible.length) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 :
      (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + visible.length) % visible.length;
    setSelected(visible[next].id);
    sidebar.current.querySelectorAll('[role="tab"]')[next].focus();
  }
  return <div className="notes-app">
    <aside className="notes-sidebar app-sidebar" aria-label={text.listLabel}>
      <div className="notes-search"><SearchField value={query} onChange={setQuery} label={text.search} /></div>
      <div role="tablist" aria-label={text.listLabel} aria-orientation={mobile ? 'horizontal' : 'vertical'} ref={sidebar} className="notes-tabs">
        {visible.map((note, index) => <button key={note.id} type="button" role="tab"
          id={`note-tab-${note.id}`} aria-controls={`note-panel-${note.id}`}
          aria-label={note.title} aria-selected={active?.id === note.id} tabIndex={active?.id === note.id ? 0 : -1}
          onKeyDown={event => navigate(event, index)} onClick={() => setSelected(note.id)}>
          <span className="note-row-title">{note.title}</span>
          <span className="note-row-preview">{plainNoteText(note.summary || note.paragraphs?.[0] || note.items?.[0]?.title || note.links?.[0]?.label)}</span>
        </button>)}
      </div>
    </aside>
    <div className="notes-editor">
      <header className="app-toolbar notes-toolbar" aria-label={text.documentLabel}>
        {profile.cv.href && <a className="button button--glass" href={profile.cv.href} download>
          <UIIcon name="download" size={16} />{profile.cv.label}</a>}
      </header>
      {active ? visible.map(note => <article key={note.id} role="tabpanel" tabIndex={0} className="note-content"
        hidden={note.id !== active.id} id={`note-panel-${note.id}`} aria-labelledby={`note-tab-${note.id}`}>
        <h2>{note.title}</h2>
        {(note.paragraphs || []).map((paragraph, index) => <p key={index}><RichText value={paragraph} /></p>)}
        {note.items?.length > 0 && <ul className="note-items">{note.items.map((item, index) => <li key={index}>
          <h3>{item.href ? <NoteLink href={item.href}>{item.title}</NoteLink> : item.title}</h3>
          {item.meta && <p className="note-meta">{item.meta}</p>}
          {item.description && <p><RichText value={item.description} /></p>}
        </li>)}</ul>}
        {note.links?.length > 0 && <ul className="note-links">{note.links.map(link => <li key={link.id || link.href}>
          <NoteLink href={link.href}>{link.label}</NoteLink>
        </li>)}</ul>}
      </article>) : <div className="files-empty"><UIIcon name="search" size={40} /><p>{text.emptyMessage}</p></div>}
    </div>
  </div>;
}
