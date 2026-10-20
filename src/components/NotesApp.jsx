import { useEffect, useRef, useState } from 'react';
import UIIcon from './UIIcon.jsx';
import { SearchField } from './Controls.jsx';

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
  const visible = notes.filter(note => [note.title, ...note.paragraphs, ...note.items.map(item => item.title)].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
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
    <aside className="notes-sidebar app-sidebar">
      <div className="notes-list-heading"><UIIcon name="notes" /><strong>{text.sectionLabel}</strong><span>{notes.length}</span></div>
      <div className="notes-search"><SearchField value={query} onChange={setQuery} label={text.search} /></div>
      <div role="tablist" aria-label={text.listLabel} aria-orientation={mobile ? 'horizontal' : 'vertical'} ref={sidebar} className="notes-tabs">
        {visible.map((note, index) => <button key={note.id} type="button" role="tab"
          id={`note-tab-${note.id}`} aria-controls={`note-panel-${note.id}`}
          aria-label={note.title} aria-selected={active?.id === note.id} tabIndex={active?.id === note.id ? 0 : -1}
          onKeyDown={event => navigate(event, index)} onClick={() => setSelected(note.id)}>
          <span className="note-row-title">{note.title}</span>
          <span className="note-row-preview">{note.summary || note.paragraphs[0] || note.items[0]?.title}</span>
          <span className="note-row-folder"><UIIcon name="folder" size={11} />{text.folderLabel}</span>
        </button>)}
      </div>
      <div className="notes-sidebar-footer">{visible.length} {visible.length === 1 ? text.noteSingular : text.notePlural}</div>
    </aside>
    <div className="notes-editor">
      <div className="app-toolbar notes-toolbar"><span><UIIcon name="file" size={16} />{text.documentLabel}</span>
        {profile.cv.href && <a className="button button--glass" href={profile.cv.href} download><UIIcon name="download" size={16} />{profile.cv.label}</a>}
      </div>
      {active ? visible.map(note => <article key={note.id} role="tabpanel" tabIndex={0} className="note-content"
        hidden={note.id !== active.id} id={`note-panel-${note.id}`} aria-labelledby={`note-tab-${note.id}`}>
        <p className="note-document-label">{text.documentLabel}</p>
        <h2>{note.title}</h2>
        {note.id === 'about' && <p className="note-meta">{profile.role} · {profile.location}</p>}
        {note.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {note.items.length > 0 && <ul className="note-items">{note.items.map((item, index) => <li key={index}>
          <h3>{item.title}</h3>{item.meta && <p className="note-meta">{item.meta}</p>}<p>{item.description}</p>
        </li>)}</ul>}
      </article>) : <div className="files-empty"><UIIcon name="search" size={40} /><p>{text.emptyMessage}</p></div>}
    </div>
  </div>;
}
