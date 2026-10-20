import { useState } from 'react';
import { profile } from '../data/profile.js';
import LazyImage from './LazyImage.jsx';

function CollectionIcon({ library = false }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      {library ? <><rect x="5" y="3" width="12" height="12" rx="2" /><path d="M3 6v10a1 1 0 0 0 1 1h10M7 12l3-3 4 4" /><circle cx="13" cy="6.5" r=".7" /></>
        : <path d="M2 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />}
    </svg>
  );
}

export default function GalleryApp({ projects, config, onOpenProject }) {
  const [category, setCategory] = useState(null);
  const categories = [...new Set(projects.map(project => project.category))];
  const selected = categories.includes(category) ? category : null;
  const visible = selected ? projects.filter(project => project.category === selected) : projects;
  const title = selected || config.allLabel;
  const count = `${visible.length} ${visible.length === 1 ? config.projectSingular : config.projectPlural}`;

  return (
    <div className="gallery-app">
      <aside className="gallery-sidebar" aria-label={config.collectionsLabel}>
        <p className="gallery-section-label">{config.libraryLabel}</p>
        <button type="button" className="gallery-collection" aria-pressed={!selected} onClick={() => setCategory(null)}>
          <CollectionIcon library /><span>{config.allLabel}</span><small>{projects.length}</small>
        </button>
        <p className="gallery-section-label">{config.collectionsLabel}</p>
        <div className="gallery-categories">
          {categories.map(name => <button key={name} type="button" className="gallery-collection"
            aria-pressed={selected === name} onClick={() => setCategory(name)}>
            <CollectionIcon /><span>{name}</span>
          </button>)}
        </div>
      </aside>
      <section className="gallery-library" aria-label={title}>
        <header className="gallery-toolbar"><div><h2>{title}</h2><p>{config.subtitle}</p></div>
          <span className="gallery-count" role="status" aria-live="polite">{count}</span>
        </header>
        <div className="gallery-grid">
          {visible.map(project => <button key={project.id} type="button" className="gallery-tile"
            aria-label={`${profile.ui.openProject}: ${project.title} — ${project.category}`} aria-haspopup="dialog"
            onClick={event => onOpenProject(project, event.currentTarget)}>
            <LazyImage src={project.thumbnail} alt="" width={480} height={360} thumbnail />
            <span className="gallery-tile-label">{project.title}</span>
          </button>)}
          {!visible.length && <p className="gallery-empty">{config.emptyMessage}</p>}
        </div>
      </section>
    </div>
  );
}
