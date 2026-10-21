import { useState } from 'react';
import { profile } from '../data/profile.js';
import LazyImage from './LazyImage.jsx';
import UIIcon from './UIIcon.jsx';

export default function GalleryApp({ projects, config, onOpenProject }) {
  const [category, setCategory] = useState(null);
  const categories = [...new Set(projects.map(project => project.category))];
  const selected = categories.includes(category) ? category : null;
  const visible = selected ? projects.filter(project => project.category === selected) : projects;
  const title = selected || config.allLabel;
  const count = `${visible.length} ${visible.length === 1 ? config.projectSingular : config.projectPlural}`;
  return <div className="gallery-app">
    <aside className="gallery-sidebar app-sidebar" aria-label={config.collectionsLabel}>
      <p className="sidebar-heading">{config.libraryLabel}</p>
      <button type="button" className="sidebar-item" aria-pressed={!selected} onClick={() => setCategory(null)}>
        <UIIcon name="gallery" /><span>{config.allLabel}</span>
      </button>
      <p className="sidebar-heading">{config.collectionsLabel}</p>
      <div className="gallery-categories">{categories.map(name => <button key={name} type="button" className="sidebar-item"
        aria-pressed={selected === name} onClick={() => setCategory(name)}><UIIcon name="folder" /><span>{name}</span></button>)}</div>
    </aside>
    <section className="gallery-library" aria-label={title}>
      <header className="app-toolbar gallery-toolbar"><div className="gallery-heading"><h2>{title}</h2>
        <span className="gallery-count" role="status" aria-live="polite">{count}</span></div></header>
      <div className="gallery-grid">{visible.map(project => <button key={project.id} type="button" className="gallery-tile"
        aria-label={`${profile.ui.openProject}: ${project.title} — ${project.category}`} aria-haspopup="dialog"
        onClick={event => onOpenProject(project, event.currentTarget)}>
        <LazyImage src={project.thumbnail} alt="" width={480} height={360} thumbnail />
        <span className="gallery-tile-label">{project.title}</span>
      </button>)}{!visible.length && <p className="gallery-empty">{config.emptyMessage}</p>}</div>
    </section>
  </div>;
}
