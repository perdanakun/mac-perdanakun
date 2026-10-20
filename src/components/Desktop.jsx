import { useState } from 'react';
import Thumbnail from './Thumbnail.jsx';
import { profile } from '../data/profile.js';

export default function Desktop({ projects, mobile, windows, onOpen }) {
  const [positions, setPositions] = useState({});
  const updatePosition = (id, position) => setPositions(current => ({ ...current, [id]: position }));
  return (
    <main className="desktop" aria-label={profile.ui.desktop}>
      {projects.map((project, index) => <Thumbnail key={project.id} project={project} index={index}
        position={positions[project.id] ?? project.position} mobile={mobile}
        open={windows.some(item => item.id === `project-${project.id}` && !item.minimized)}
        onOpen={onOpen} onPosition={updatePosition} />)}
    </main>
  );
}
