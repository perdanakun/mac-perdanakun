import { profile } from '../data/profile.js';
import LazyImage from './LazyImage.jsx';

export default function ProjectGallery({ project }) {
  const info = [
    [profile.ui.category, project.category], [profile.ui.year, project.year],
    [profile.ui.client, project.client], [profile.ui.tools, project.tools.join(', ')],
  ].filter(([, value]) => value);
  return (
    <article className="project-gallery">
      <header className="project-info">
        <h2>{project.title}</h2>
        <dl>{info.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>{project.description}</p>
      </header>
      <div className="project-images" aria-label={profile.ui.gallery}>
        {project.images.map((image, index) => <LazyImage key={`${image.src}-${index}`} {...image} />)}
      </div>
    </article>
  );
}
