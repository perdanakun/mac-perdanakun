import { useRef, useState } from 'react';

export default function NotesApp({ notes, profile, mobile }) {
  const [selected, setSelected] = useState(notes[0]?.id);
  const sidebar = useRef(null);
  const active = notes.find(note => note.id === selected) ?? notes[0];
  if (!active) return null;
  function navigate(event, index) {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? notes.length - 1 :
      (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + notes.length) % notes.length;
    setSelected(notes[next].id);
    sidebar.current.querySelectorAll('[role="tab"]')[next].focus();
  }
  return (
    <div className="notes-app">
      <aside className="notes-sidebar">
        <div className="notes-list-heading"><strong>{profile.notesApp.sectionLabel}</strong><span>{notes.length}</span></div>
        <div role="tablist" aria-label={profile.notesApp.listLabel} aria-orientation={mobile ? 'horizontal' : 'vertical'} ref={sidebar} className="notes-tabs">
          {notes.map((note, index) => <button key={note.id} type="button" role="tab"
            id={`note-tab-${note.id}`} aria-controls={`note-panel-${note.id}`}
            aria-label={note.title} aria-selected={active.id === note.id} tabIndex={active.id === note.id ? 0 : -1}
            onKeyDown={event => navigate(event, index)} onClick={() => setSelected(note.id)}>
            <span className="note-row-title">{note.title}</span>
            <span className="note-row-preview">{note.summary || note.paragraphs[0] || note.items[0]?.title}</span>
          </button>)}
        </div>
        {profile.cv.href && <a className="cv-link" href={profile.cv.href} download>{profile.cv.label}</a>}
      </aside>
      {notes.map(note => <article key={note.id} role="tabpanel" tabIndex={0} className="note-content"
        hidden={note.id !== active.id} id={`note-panel-${note.id}`} aria-labelledby={`note-tab-${note.id}`}>
        <p className="note-document-label">{profile.notesApp.documentLabel}</p>
        <h2>{note.title}</h2>
        {note.id === 'about' && <p className="note-meta">{profile.role} · {profile.location}</p>}
        {note.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
        {note.items.length > 0 && <ul className="note-items">
          {note.items.map((item, index) => <li key={index}>
            <h3>{item.title}</h3>{item.meta && <p className="note-meta">{item.meta}</p>}
            <p>{item.description}</p>
          </li>)}
        </ul>}
      </article>)}
    </div>
  );
}
