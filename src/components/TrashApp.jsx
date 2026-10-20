import { useRef, useState } from 'react';
import { profile } from '../data/profile.js';
import UIIcon from './UIIcon.jsx';

export default function TrashApp({ projects, onRestore, onRestoreAll, onEmpty }) {
  const [confirm, setConfirm] = useState(false);
  const emptyButton = useRef(null);
  const text = profile.trashApp;
  return <section className="trash-app" aria-label={text.title} onKeyDown={event => {
    if (confirm && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setConfirm(false); emptyButton.current?.focus(); }
  }}>
    <header className="app-toolbar files-toolbar"><h2>{text.title}</h2><div className="files-actions">
      <button type="button" disabled={!projects.length} onClick={onRestoreAll}><UIIcon name="restore" size={14} />{text.restoreAll}</button>
      <button ref={emptyButton} type="button" disabled={!projects.length} onClick={() => setConfirm(true)}>{text.empty}</button>
    </div></header>
    {confirm && projects.length > 0 && <div className="trash-confirm" role="alert">
      <UIIcon name="trash" size={36} /><div><h3>{text.empty}</h3><p>{text.confirmMessage}</p></div>
      <div className="files-actions"><button type="button" onClick={() => { setConfirm(false); emptyButton.current?.focus(); }}>{text.cancel}</button>
        <button type="button" className="files-danger" onClick={() => { onEmpty(); setConfirm(false); }}>{text.confirmEmpty}</button></div>
    </div>}
    <div className="trash-list">{projects.length ? projects.map(project => <div className="trash-row" key={project.id}>
      <img src={project.thumbnail} width="44" height="44" alt="" loading="lazy" />
      <div><strong>{project.title}</strong><span>{project.category}</span></div>
      <button type="button" aria-label={`${text.restore}: ${project.title}`} onClick={() => onRestore(project.id)}>{text.restore}</button>
    </div>) : <div className="files-empty"><UIIcon name="trash" size={52} /><h3>{text.emptyTitle}</h3><p>{text.emptyMessage}</p></div>}</div>
    <footer className="trash-status">{projects.length} {projects.length === 1 ? profile.finderApp.item : profile.finderApp.items}</footer>
  </section>;
}
