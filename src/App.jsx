import { useEffect, useMemo, useState } from 'react';
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
import FileInfo from './components/FileInfo.jsx';
import Notifications from './components/Notifications.jsx';
import Spotlight from './components/Spotlight.jsx';
import { useAssistantChat } from './hooks/useAssistantChat.js';

export default function App() {
  const mobile = useMobile();
  const manager = useWindows();
  const files = useProjectFiles(projects);
  const [skill, setSkill] = useState(null);
  const [spotlight, setSpotlight] = useState(null);
  const chat = useAssistantChat();
  const [noteRequest, setNoteRequest] = useState(null);
  const [notificationReplay, setNotificationReplay] = useState(0);
  const [desktopIconsVisible, setDesktopIconsVisible] = useState(true);
  const overlay = Boolean(skill || spotlight);
  const active = manager.windows.find(item => item.id === manager.activeId);
  const skillApp = dockApps.find(app => app.id === skill?.id);
  const openIds = new Set(manager.windows.filter(item => item.kind !== 'project').map(item => item.id));
  if (skill) openIds.add(skill.id);
  if (spotlight?.mode === 'ask') openIds.add('assistant');
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
  function inspectFile(entry, trigger) {
    manager.open({ id: `info-${entry.id}`, kind: 'info', entry,
      title: `${entry.title} — ${profile.finderApp.infoTitle}` }, trigger);
  }
  function openApp(app, trigger) {
    if (app.kind === 'assistant') { menuAction('assistant', trigger); return; }
    if (app.kind === 'skill') setSkill({ id: app.id, trigger });
    else manager.open({ id: app.id, kind: app.kind, title: app.label }, trigger);
  }
  function showBio(trigger, noteId = 'about') {
    setNoteRequest(current => ({ id: noteId, sequence: (current?.sequence || 0) + 1 }));
    openApp(dockApps.find(app => app.id === 'notes'), trigger);
  }
  function menuAction(action, trigger, extra) {
    if (action === 'assistant') { setSkill(null); setSpotlight({ trigger, mode: 'ask' }); return; }
    if (action === 'toggle-desktop-icons') { setDesktopIconsVisible(visible => !visible); return; }
    if (action === 'search') { setSkill(null); setSpotlight({ trigger, mode: 'search' }); return; }
    if (action === 'about') { showBio(trigger); return; }
    if (action === 'welcome') { setNotificationReplay(value => value + 1); return; }
    if (action === 'desktop') { manager.windows.filter(item => !item.minimized).forEach(item => manager.minimize(item.id)); return; }
    if (action === 'focus-window') {
      const record = manager.windows.find(item => item.id === extra);
      if (record) manager.open(record, trigger);
      return;
    }
    if (action === 'close' && active) { manager.close(active.id); return; }
    if (action === 'minimize' && active) { minimize(active.id); return; }
    if (action === 'zoom' && active) { manager.zoom(active.id); return; }
    const app = dockApps.find(app => app.id === action);
    if (app) openApp(app, trigger);
  }
  useEffect(() => {
    const keyboardSearch = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.isComposing) {
        event.preventDefault(); setSkill(null);
        setSpotlight(current => ({ trigger: current?.trigger || document.querySelector('[data-search-trigger]') || document.activeElement, mode: 'search' }));
      }
    };
    document.addEventListener('keydown', keyboardSearch);
    return () => document.removeEventListener('keydown', keyboardSearch);
  }, []);
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
      onOpenProject={openProject} onOpenApp={openApp} onInspect={inspectFile} onTrash={moveToTrash} trashProps={trashProps} />;
    if (record.kind === 'info') return <FileInfo entry={record.entry} />;
    if (record.kind === 'trash') return <TrashApp {...trashProps} />;
    if (record.kind === 'gallery') return <GalleryApp projects={files.available} config={profile.galleryApp} onOpenProject={openProject} />;
    if (record.kind === 'notes') return <NotesApp notes={notes} profile={profile} mobile={mobile} requestedNote={noteRequest} />;
    if (record.kind === 'mail') return <MailApp contact={profile.contact} />;
    const project = projects.find(item => item.id === record.projectId);
    return project ? <ProjectGallery key={project.id} project={project} /> : null;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio">
        <Wallpaper wallpaper={profile.wallpaper} />
        <div className="desktop-shell" inert={Boolean(overlay || (mobile && active))}>
          <MenuBar profile={profile} active={active} windows={manager.windows} mobile={mobile}
            desktopIconsVisible={desktopIconsVisible} onAction={menuAction} />
          <Desktop projects={files.available} mobile={mobile} windows={manager.windows} onOpen={openProject}
            iconsVisible={mobile || desktopIconsVisible} />
          <Dock apps={apps} mobile={mobile} openIds={openIds} onOpen={openApp} />
        </div>
        {mobile ? <AnimatePresence>
          {active && <Sheet key={active.id} record={active} blocked={overlay} onClose={manager.close}>
            {content(active)}
          </Sheet>}
        </AnimatePresence> : <AnimatePresence>
          {manager.windows.map((record, order) => <Window key={record.id} record={record} order={order}
            focused={manager.activeId === record.id} blocked={overlay}
            onFocus={manager.focus} onClose={manager.close} onMinimize={minimize}
            onZoom={manager.zoom} onMove={manager.move}>
            {content(record)}
          </Window>)}
        </AnimatePresence>}
        <Notifications hidden={Boolean(overlay || (mobile && active))} replay={notificationReplay}
          onActivate={(item, trigger) => {
            // The banner disappears after activation; retain a connected focus-return target.
            if (item.action === 'notes') showBio(document.querySelector('[data-dock-app="notes"]') || trigger, item.noteId);
          }} />
        <AnimatePresence>
          {spotlight && <Spotlight projects={files.available} apps={apps} trigger={spotlight.trigger} mode={spotlight.mode} chat={chat}
            onModeChange={mode => setSpotlight(current => ({ ...current, mode }))}
            onClose={() => setSpotlight(null)} onSelect={entry => {
              const trigger = spotlight.trigger;
              setSpotlight(null);
              if (entry.project) openProject(entry.project, trigger);
              else openApp(entry.app, trigger);
            }} />}
        </AnimatePresence>
        <AnimatePresence>
          {skillApp && <AlertDialog key={skillApp.id} app={skillApp} dialog={skillDialogs[skillApp.id]} trigger={skill.trigger}
            onClose={() => setSkill(null)} onContact={openContact} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
