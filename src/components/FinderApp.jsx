import { projectCategories } from '../data/projects.js';
import { useRef, useState } from 'react';
import { profile, uiIcons } from '../data/profile.js';
import TrashApp from './TrashApp.jsx';
import UIIcon from './UIIcon.jsx';
import { IconButton, SearchField } from './Controls.jsx';

const locations = ['desktop', 'projects', 'applications', 'trash'];
const locationIcons = { desktop: 'desktop', projects: 'folder', applications: 'apps', trash: 'trash' };

export default function FinderApp({ projects, apps, mobile, onOpenProject, onOpenApp, onInspect, onTrash, trashProps }) {
  const text = profile.finderApp;
  const [history, setHistory] = useState({ paths: ['projects'], index: 0 });
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(null);
  const list = useRef(null);
  const path = history.paths[history.index];
  const categories = [...new Set(projects.flatMap(projectCategories))];
  const category = path.startsWith('category:') ? path.slice(9) : null;
  const navigate = next => {
    if (next === path) return;
    setHistory(current => ({ paths: [...current.paths.slice(0, current.index + 1), next], index: current.index + 1 }));
    setSelection(null); setQuery('');
  };
  const go = direction => {
    setHistory(current => ({ ...current, index: Math.max(0, Math.min(current.index + direction, current.paths.length - 1)) }));
    setSelection(null); setQuery('');
  };
  const title = category || text.locations[path] || text.locations.projects;
  const entries = path === 'applications'
    ? apps.map(app => ({ id: `app-${app.id}`, title: app.label, type: 'app', app, icon: app.icon || app.fallbackIcon }))
    : path === 'projects'
      ? categories.map(name => ({ id: `folder-${name}`, title: name, type: 'folder', path: `category:${name}` }))
      : projects.filter(project => !category || projectCategories(project).includes(category))
        .map(project => ({ id: project.id, title: project.title, type: 'project', project, icon: project.thumbnail }));
  const visible = entries.filter(entry => entry.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));
  const selected = visible.find(entry => entry.id === selection);
  const activate = (entry, trigger) => {
    if (!entry) return;
    if (entry.type === 'folder') navigate(entry.path);
    else if (entry.type === 'app') onOpenApp(entry.app, trigger);
    else onOpenProject(entry.project, trigger);
  };
  const remove = entry => {
    if (entry?.type !== 'project') return;
    onTrash(entry.id); setSelection(null);
    requestAnimationFrame(() => list.current?.focus());
  };
  return <div className="finder-app">
    <aside className="finder-sidebar app-sidebar" aria-label={text.sidebarLabel}>
      <p className="sidebar-heading">{text.favorites}</p>
      {locations.map(location => <button key={location} type="button" className="sidebar-item"
        aria-pressed={path === location || (location === 'projects' && Boolean(category))}
        onClick={() => navigate(location)}>
        <UIIcon name={locationIcons[location]} /><span>{text.locations[location]}</span>
        {location === 'trash' && trashProps.projects.length > 0 && <small>{trashProps.projects.length}</small>}
      </button>)}
    </aside>
    <section className="finder-main" aria-label={title}>
      <header className="app-toolbar finder-toolbar">
        <div className="toolbar-navigation">
          <div className="control-group">
            <IconButton icon="chevron-left" label={text.back} disabled={history.index === 0} onClick={() => go(-1)} />
            <IconButton icon="chevron-right" label={text.forward} disabled={history.index === history.paths.length - 1} onClick={() => go(1)} />
          </div>
          <h2>{title}</h2>
        </div>
        {path !== 'trash' && <div className="toolbar-tools">
          <div className="control-group segmented-control" role="group" aria-label={text.viewLabel}>
            <IconButton icon="grid" label={text.grid} aria-pressed={view === 'grid'} onClick={() => setView('grid')} />
            <IconButton icon="list" label={text.list} aria-pressed={view === 'list'} onClick={() => setView('list')} />
          </div>
          <IconButton icon="info" label={text.info} disabled={!selected} onClick={event => onInspect(selected, event.currentTarget)} />
          <SearchField value={query} onChange={setQuery} label={text.search} />
        </div>}
      </header>
      {path === 'trash' ? <TrashApp {...trashProps} /> : <>
        {view === 'list' && <div className="finder-list-heading" aria-hidden="true">
          <span>{text.nameColumn}</span><span>{text.kindColumn}</span><span>{text.yearColumn}</span>
        </div>}
        <div ref={list} className={`finder-entries finder-entries--${view}`} tabIndex={0} aria-label={text.filesLabel}>
          {visible.map(entry => <button type="button" key={entry.id} className="finder-entry"
            aria-pressed={selection === entry.id} aria-label={`${entry.title}, ${text.kinds[entry.type]}`}
            onClick={event => { setSelection(entry.id); if (mobile) activate(entry, event.currentTarget); }}
            onDoubleClick={event => { if (!mobile) activate(entry, event.currentTarget); }}
            onKeyDown={event => {
              if (event.key === 'Enter') { event.preventDefault(); activate(entry, event.currentTarget); }
              if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(entry); }
            }}>
            <span className="finder-entry-art"><img src={entry.type === 'folder' ? uiIcons['folder-color'] : entry.icon}
              alt="" width="72" height="60" loading="lazy" draggable="false" /></span>
            <span className="finder-entry-name">{entry.title}</span>
            <small className="finder-entry-kind">{entry.project?.category || text.kinds[entry.type]}</small>
            <small className="finder-entry-year">{entry.project?.year || '—'}</small>
          </button>)}
          {!visible.length && <div className="files-empty"><UIIcon name="folder" size={48} /><p>{text.emptyMessage}</p></div>}
        </div>
        <nav className="finder-path" aria-label={text.pathLabel}>
          <UIIcon name="desktop" size={13} />
          <button type="button" onClick={() => navigate('projects')}>{profile.displayName}</button>
          {category && <><UIIcon name="chevron-right" size={10} /><button type="button" onClick={() => navigate('projects')}>{text.locations.projects}</button></>}
          <UIIcon name="chevron-right" size={10} /><span>{title}</span>
        </nav>
        <footer className="finder-status"><span role="status">{visible.length} {visible.length === 1 ? text.item : text.items}
          {selected && ` · 1 ${text.selected}`}</span>
          <div className="files-actions">
            <button type="button" disabled={!selected} onClick={event => activate(selected, event.currentTarget)}>{text.open}</button>
            <button type="button" disabled={selected?.type !== 'project'} onClick={() => remove(selected)}>
              <UIIcon name="trash" size={13} />{text.moveToTrash}</button>
          </div>
        </footer>
      </>}
    </section>
  </div>;
}
