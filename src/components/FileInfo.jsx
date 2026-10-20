import { profile, uiIcons } from '../data/profile.js';
import UIIcon from './UIIcon.jsx';

export default function FileInfo({ entry }) {
  const text = profile.finderApp;
  const project = entry.project;
  const details = [
    [text.nameColumn, entry.title], [text.kindColumn, text.kinds[entry.type]],
    [text.source, project ? `${text.locations.projects} / ${project.category}` : text.locations[entry.type === 'app' ? 'applications' : 'projects']],
    [profile.ui.category, project?.category], [profile.ui.year, project?.year],
    [profile.ui.client, project?.client], [profile.ui.tools, project?.tools?.join(', ')],
    [text.imageCount, project?.images?.length],
    [text.dimensions, project?.images?.[0] && `${project.images[0].width} × ${project.images[0].height}`],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  return <article className="file-info">
    <header className="file-info-heading">
      <img src={entry.type === 'folder' ? uiIcons['folder-color'] : entry.icon} width="48" height="48" alt="" />
      <div><h2>{entry.title}</h2><p>{text.kinds[entry.type]}</p></div>
    </header>
    <section><h3><UIIcon name="chevron-down" size={12} />{text.general}</h3>
      <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
    <section><h3><UIIcon name="chevron-down" size={12} />{text.preview}</h3>
      <img className="file-info-preview" src={entry.type === 'folder' ? uiIcons['folder-color'] : entry.icon}
        width="240" height="180" alt={entry.title} />
    </section>
  </article>;
}
