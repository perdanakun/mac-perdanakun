import { useRef, useState } from 'react';
import { profile } from '../data/profile.js';

export default function TrashApp({ projects, onRestore, onRestoreAll, onEmpty }) {
  const [confirm, setConfirm] = useState(false);
  const emptyButton = useRef(null);
  const text = profile.trashApp;
  return (
    <section className="trash-app" aria-label={text.title} onKeyDown={event => {
      if (confirm && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setConfirm(false); emptyButton.current?.focus(); }
    }}>
      <header className="files-toolbar"><div><h2>{text.title}</h2><p>{text.description}</p></div>
        <div className="files-actions">
          <button type="button" disabled={!projects.length} onClick={onRestoreAll}>{text.restoreAll}</button>
          <button ref={emptyButton} type="button" disabled={!projects.length} onClick={() => setConfirm(true)}>{text.empty}</button>
        </div>
      </header>
      {confirm && projects.length > 0 && <div className="trash-confirm" role="alert">
        <p>{text.confirmMessage}</p><div className="files-actions">
          <button type="button" onClick={() => { setConfirm(false); emptyButton.current?.focus(); }}>{text.cancel}</button>
          <button type="button" className="files-danger" onClick={() => { onEmpty(); setConfirm(false); }}>{text.confirmEmpty}</button>
        </div>
      </div>}
      <div className="trash-list">
        {projects.length ? projects.map(project => <div className="trash-row" key={project.id}>
          <img src={project.thumbnail} width="44" height="44" alt="" loading="lazy" />
          <div><strong>{project.title}</strong><span>{project.category}</span></div>
          <button type="button" aria-label={`${text.restore}: ${project.title}`} onClick={() => onRestore(project.id)}>{text.restore}</button>
        </div>) : <div className="files-empty"><span aria-hidden="true">⌑</span><h3>{text.emptyTitle}</h3><p>{text.emptyMessage}</p></div>}
      </div>
    </section>
  );
}
