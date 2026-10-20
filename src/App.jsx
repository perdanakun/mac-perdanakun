import { useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { projects } from './data/projects.js';
import { dockApps, notes, profile, skillDialogs } from './data/profile.js';
import { useMobile } from './hooks/useMobile.js';
import { useWindows } from './hooks/useWindows.js';
import { useProjectFiles } from './hooks/useProjectFiles.js';
import Wallpaper from './components/Wallpaper.jsx';
import MenuBar from './components/MenuBar.jsx';
import Desktop from './components/Desktop.jsx';
import Dock from './components/Dock.jsx';
import Window from './components/Window.jsx';
import Sheet from './components/Sheet.jsx';
import ProjectGallery from './components/ProjectGallery.jsx';
import GalleryApp from './components/GalleryApp.jsx';
import NotesApp from './components/NotesApp.jsx';
import MailApp from './components/MailApp.jsx';
import AlertDialog from './components/AlertDialog.jsx';
import FinderApp from './components/FinderApp.jsx';
import TrashApp from './components/TrashApp.jsx';

export default function App() {
  const mobile = useMobile();
  const manager = useWindows();
  const files = useProjectFiles(projects);
  const [skill, setSkill] = useState(null);
  const active = manager.windows.find(item => item.id === manager.activeId);
  const skillApp = dockApps.find(app => app.id === skill?.id);
  const openIds = new Set(manager.windows.filter(item => item.kind !== 'project').map(item => item.id));
  if (skill) openIds.add(skill.id);
  const apps = useMemo(() => dockApps.map(app => app.id === 'trash' && files.trashed.length
    ? { ...app, icon: app.fullIcon || app.icon } : app), [files.trashed.length]);

  function openProject(project, trigger) {
    if (!files.available.some(item => item.id === project.id)) return;
    manager.open({ id: `project-${project.id}`, kind: 'project', projectId: project.id, title: project.title }, trigger);
  }
  function moveToTrash(id) {
    files.trash(id);
    manager.close(`project-${id}`);
  }
  function openApp(app, trigger) {
    if (app.kind === 'skill') setSkill({ id: app.id, trigger });
    else manager.open({ id: app.id, kind: app.kind, title: app.label }, trigger);
  }
  function openContact() {
    const trigger = skill?.trigger;
    setSkill(null);
    openApp(dockApps.find(app => app.id === 'mail'), trigger);
  }
  function minimize(id) {
    manager.minimize(id);
    if (!manager.windows.some(item => item.id !== id && !item.minimized)) {
      const trigger = manager.windows.find(item => item.id === id)?.trigger;
      requestAnimationFrame(() => trigger?.focus({ preventScroll: true }));
    }
  }
  function content(record) {
    const trashProps = { projects: files.trashed, onRestore: files.restore, onRestoreAll: files.restoreAll, onEmpty: files.empty };
    if (record.kind === 'finder') return <FinderApp projects={files.available} apps={apps} mobile={mobile}
      onOpenProject={openProject} onOpenApp={openApp} onTrash={moveToTrash} trashProps={trashProps} />;
    if (record.kind === 'trash') return <TrashApp {...trashProps} />;
    if (record.kind === 'gallery') return <GalleryApp projects={files.available} config={profile.galleryApp} onOpenProject={openProject} />;
    if (record.kind === 'notes') return <NotesApp notes={notes} profile={profile} mobile={mobile} />;
    if (record.kind === 'mail') return <MailApp contact={profile.contact} />;
    const project = projects.find(item => item.id === record.projectId);
    return project ? <ProjectGallery project={project} /> : null;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio">
        <Wallpaper wallpaper={profile.wallpaper} />
        <div className="desktop-shell" inert={Boolean(skill || (mobile && active))}>
          <MenuBar profile={profile} />
          <Desktop projects={files.available} mobile={mobile} windows={manager.windows} onOpen={openProject} />
          <Dock apps={apps} mobile={mobile} openIds={openIds} onOpen={openApp} />
        </div>
        {mobile ? <AnimatePresence>
          {active && <Sheet key={active.id} record={active} blocked={Boolean(skill)} onClose={manager.close}>
            {content(active)}
          </Sheet>}
        </AnimatePresence> : <AnimatePresence>
          {manager.windows.map((record, order) => <Window key={record.id} record={record} order={order}
            focused={manager.activeId === record.id} blocked={Boolean(skill)}
            onFocus={manager.focus} onClose={manager.close} onMinimize={minimize}
            onZoom={manager.zoom} onMove={manager.move}>
            {content(record)}
          </Window>)}
        </AnimatePresence>}
        <AnimatePresence>
          {skillApp && <AlertDialog key={skillApp.id} app={skillApp} dialog={skillDialogs[skillApp.id]} trigger={skill.trigger}
            onClose={() => setSkill(null)} onContact={openContact} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
