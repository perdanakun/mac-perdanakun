import { useRef, useState } from 'react';
import { profile } from '../data/profile.js';
import TrashApp from './TrashApp.jsx';

function FolderIcon() {
  return <svg className="finder-folder" viewBox="0 0 64 52" aria-hidden="true"><path d="M3 10a4 4 0 0 1 4-4h19l6 6h25a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M3 19h58" /></svg>;
}

export default function FinderApp({ projects, apps, mobile, onOpenProject, onOpenApp, onTrash, trashProps }) {
  const text = profile.finderApp;
  const [history, setHistory] = useState({ paths: ['projects'], index: 0 });
  const [view, setView] = useState('grid');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(null);
  const list = useRef(null);
  const path = history.paths[history.index];
  const categories = [...new Set(projects.map(project => project.category))];
  const category = path.startsWith('category:') ? path.slice(9) : null;
  const navigate = next => {
    if (next === path) return;
    setHistory(current => ({ paths: [...current.paths.slice(0, current.index + 1), next], index: current.index + 1 }));
    setSelection(null); setQuery('');
  };
  const go = direction => {
    setHistory(current => ({ ...current, index: current.index + direction }));
    setSelection(null); setQuery('');
  };
  const title = category || text.locations[path] || text.locations.projects;
  const entries = path === 'applications' ? apps.map(app => ({ id: `app-${app.id}`, title: app.label, type: 'app', app, icon: app.icon || app.fallbackIcon }))
    : path === 'projects' ? categories.map(name => ({ id: `folder-${name}`, title: name, type: 'folder', path: `category:${name}` }))
    : projects.filter(project => !category || project.category === category).map(project => ({ id: project.id, title: project.title, type: 'project', project, icon: project.thumbnail }));
  const visible = entries.filter(entry => entry.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
  const selected = visible.find(entry => entry.id === selection);
  const activate = (entry, trigger) => {
    if (entry.type === 'folder') navigate(entry.path);
    else if (entry.type === 'app') onOpenApp(entry.app, trigger);
    else onOpenProject(entry.project, trigger);
  };
  const remove = entry => {
    if (entry?.type !== 'project') return;
    onTrash(entry.id); setSelection(null);
    requestAnimationFrame(() => list.current?.focus());
  };
  return (
    <div className="finder-app">
      <aside className="finder-sidebar" aria-label={text.sidebarLabel}>
        <p className="gallery-section-label">{text.favorites}</p>
        {['desktop', 'projects', 'applications', 'trash'].map(location => <button key={location} type="button"
          className="gallery-collection" aria-pressed={path === location || (location === 'projects' && Boolean(category))}
          onClick={() => navigate(location)}><span aria-hidden="true">{text.locationSymbols[location]}</span>{text.locations[location]}</button>)}
      </aside>
      <section className="finder-main" aria-label={title}>
        <header className="finder-toolbar">
          <div className="finder-navigation files-actions">
            <button type="button" aria-label={text.back} disabled={history.index === 0} onClick={() => go(-1)}>‹</button>
            <button type="button" aria-label={text.forward} disabled={history.index === history.paths.length - 1} onClick={() => go(1)}>›</button>
            <strong>{title}</strong>
          </div>
          {path !== 'trash' && <div className="finder-tools">
            <div className="files-actions"><button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>{text.grid}</button>
              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>{text.list}</button></div>
            <input type="search" value={query} aria-label={text.search} placeholder={text.search} onChange={event => setQuery(event.target.value)} />
          </div>}
        </header>
        {path === 'trash' ? <TrashApp {...trashProps} /> : <>
          <nav className="finder-path" aria-label={text.pathLabel}>
            <button type="button" onClick={() => navigate('projects')}>{profile.displayName}</button>
            {category && <><span aria-hidden="true">›</span><button type="button" onClick={() => navigate('projects')}>{text.locations.projects}</button></>}
            <span>› {title}</span>
          </nav>
          <div ref={list} className={`finder-entries finder-entries--${view}`} tabIndex={0} aria-label={text.filesLabel}>
            {visible.map(entry => <button type="button" key={entry.id} className="finder-entry" aria-pressed={selection === entry.id}
              aria-label={`${entry.title}, ${text.kinds[entry.type]}`} onClick={event => {
                setSelection(entry.id);
                if (mobile) activate(entry, event.currentTarget);
              }} onDoubleClick={event => { if (!mobile) activate(entry, event.currentTarget); }}
              onKeyDown={event => {
                if (event.key === 'Enter') { event.preventDefault(); activate(entry, event.currentTarget); }
                if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(entry); }
              }}>
              {entry.type === 'folder' ? <FolderIcon /> : <img src={entry.icon} alt="" width="64" height="64" loading="lazy" />}
              <span className="finder-entry-name">{entry.title}</span>
              <small>{entry.project?.category || text.kinds[entry.type]}</small>
            </button>)}
            {!visible.length && <p className="gallery-empty">{text.emptyMessage}</p>}
          </div>
          <footer className="finder-status"><span role="status">{visible.length} {visible.length === 1 ? text.item : text.items}</span>
            <div className="files-actions"><button type="button" disabled={!selected} onClick={event => activate(selected, event.currentTarget)}>{text.open}</button>
              <button type="button" disabled={selected?.type !== 'project'} onClick={() => remove(selected)}>{text.moveToTrash}</button></div>
          </footer>
        </>}
      </section>
    </div>
  );
}
