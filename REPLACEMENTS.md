# Replacement per file — fase 4

Baseline: mac-os-perdana.zip unggahan terbaru. File lengkap yang berubah tersedia dalam folder src/ dengan path yang sama.

- src/App.jsx
- src/assets/dock/finder.svg
- src/assets/dock/trash-full.svg
- src/assets/dock/trash.svg
- src/components/Dock.jsx
- src/components/FinderApp.jsx
- src/components/TrashApp.jsx
- src/components/Window.jsx
- src/data/profile.js
- src/hooks/usePointerDrag.js
- src/hooks/useProjectFiles.js
- src/hooks/useWindowResize.js
- src/hooks/useWindows.js
- src/styles.css
- src/utils/dockLayout.js
- src/utils/geometry.js
- LICENSE-THIRD-PARTY
- tests/interactions.mjs

## Diff untuk penggabungan manual

Jangan salin tanda +, -, header @@, atau marker No newline saat mengedit manual.

### src/App.jsx

```diff
--- a/src/App.jsx
+++ b/src/App.jsx
@@ -1,9 +1,10 @@
-import { useState } from 'react';
+import { useMemo, useState } from 'react';
 import { AnimatePresence, MotionConfig } from 'framer-motion';
 import { projects } from './data/projects.js';
 import { dockApps, notes, profile, skillDialogs } from './data/profile.js';
 import { useMobile } from './hooks/useMobile.js';
 import { useWindows } from './hooks/useWindows.js';
+import { useProjectFiles } from './hooks/useProjectFiles.js';
 import Wallpaper from './components/Wallpaper.jsx';
 import MenuBar from './components/MenuBar.jsx';
 import Desktop from './components/Desktop.jsx';
@@ -15,18 +16,28 @@
 import NotesApp from './components/NotesApp.jsx';
 import MailApp from './components/MailApp.jsx';
 import AlertDialog from './components/AlertDialog.jsx';
+import FinderApp from './components/FinderApp.jsx';
+import TrashApp from './components/TrashApp.jsx';
 
 export default function App() {
   const mobile = useMobile();
   const manager = useWindows();
+  const files = useProjectFiles(projects);
   const [skill, setSkill] = useState(null);
   const active = manager.windows.find(item => item.id === manager.activeId);
   const skillApp = dockApps.find(app => app.id === skill?.id);
   const openIds = new Set(manager.windows.filter(item => item.kind !== 'project').map(item => item.id));
   if (skill) openIds.add(skill.id);
+  const apps = useMemo(() => dockApps.map(app => app.id === 'trash' && files.trashed.length
+    ? { ...app, icon: app.fullIcon || app.icon } : app), [files.trashed.length]);
 
   function openProject(project, trigger) {
+    if (!files.available.some(item => item.id === project.id)) return;
     manager.open({ id: `project-${project.id}`, kind: 'project', projectId: project.id, title: project.title }, trigger);
+  }
+  function moveToTrash(id) {
+    files.trash(id);
+    manager.close(`project-${id}`);
   }
   function openApp(app, trigger) {
     if (app.kind === 'skill') setSkill({ id: app.id, trigger });
@@ -45,7 +56,11 @@
     }
   }
   function content(record) {
-    if (record.kind === 'gallery') return <GalleryApp projects={projects} config={profile.galleryApp} onOpenProject={openProject} />;
+    const trashProps = { projects: files.trashed, onRestore: files.restore, onRestoreAll: files.restoreAll, onEmpty: files.empty };
+    if (record.kind === 'finder') return <FinderApp projects={files.available} apps={apps} mobile={mobile}
+      onOpenProject={openProject} onOpenApp={openApp} onTrash={moveToTrash} trashProps={trashProps} />;
+    if (record.kind === 'trash') return <TrashApp {...trashProps} />;
+    if (record.kind === 'gallery') return <GalleryApp projects={files.available} config={profile.galleryApp} onOpenProject={openProject} />;
     if (record.kind === 'notes') return <NotesApp notes={notes} profile={profile} mobile={mobile} />;
     if (record.kind === 'mail') return <MailApp contact={profile.contact} />;
     const project = projects.find(item => item.id === record.projectId);
@@ -58,8 +73,8 @@
         <Wallpaper wallpaper={profile.wallpaper} />
         <div className="desktop-shell" inert={Boolean(skill || (mobile && active))}>
           <MenuBar profile={profile} />
-          <Desktop projects={projects} mobile={mobile} windows={manager.windows} onOpen={openProject} />
-          <Dock apps={dockApps} mobile={mobile} openIds={openIds} onOpen={openApp} />
+          <Desktop projects={files.available} mobile={mobile} windows={manager.windows} onOpen={openProject} />
+          <Dock apps={apps} mobile={mobile} openIds={openIds} onOpen={openApp} />
         </div>
         {mobile ? <AnimatePresence>
           {active && <Sheet key={active.id} record={active} blocked={Boolean(skill)} onClose={manager.close}>
```

### src/assets/dock/finder.svg

```diff
--- /dev/null
+++ b/src/assets/dock/finder.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>Original Finder placeholder</title><rect x="4" y="4" width="56" height="56" rx="14" fill="#71C1F4"/><path d="M32 4h14a14 14 0 0 1 14 14v28a14 14 0 0 1-14 14H32Z" fill="#CDEAFE"/><path d="M21 45V20h22M21 31h17" fill="none" stroke="#204B72" stroke-width="5" stroke-linecap="round"/></svg>
```

### src/assets/dock/trash-full.svg

```diff
--- /dev/null
+++ b/src/assets/dock/trash-full.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>Original full Trash placeholder</title><path d="m18 6 20-3 5 22-20 4Z" fill="#FFF" stroke="#9CA8B4" stroke-width="2"/><path d="m35 8 15 6-7 20-15-6Z" fill="#CDEAFE" stroke="#7193B4" stroke-width="2"/><path d="M15 21h34l-4 36H19Z" fill="#D3DCE7" stroke="#788694" stroke-width="2"/><path d="M25 28v20M32 28v20M39 28v20" fill="none" stroke="#788694" stroke-width="3" stroke-linecap="round"/></svg>
```

### src/assets/dock/trash.svg

```diff
--- /dev/null
+++ b/src/assets/dock/trash.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>Original empty Trash placeholder</title><path d="M15 17h34l-4 40H19Z" fill="#E0E4E9" stroke="#788694" stroke-width="2"/><path d="M12 14h40M25 13V8h14v5M25 25v23M32 25v23M39 25v23" fill="none" stroke="#788694" stroke-width="3" stroke-linecap="round"/></svg>
```

### src/components/Dock.jsx

```diff
--- a/src/components/Dock.jsx
+++ b/src/components/Dock.jsx
@@ -1,52 +1,66 @@
-import { useRef, useState } from 'react';
+import { useLayoutEffect, useRef, useState } from 'react';
 import { motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
 import { profile } from '../data/profile.js';
+import { dockLayout, dockMagnification } from '../utils/dockLayout.js';
 
-function DockItem({ app, mouseX, mobile, open, onOpen }) {
-  const ref = useRef(null);
+function DockItem({ app, pointer, geometry, iconSize, mobile, open, onOpen }) {
   const reduced = useReducedMotion();
   const bounce = useAnimationControls();
   const [failedIcon, setFailedIcon] = useState(null);
-  const customIcon = Boolean(app.icon && failedIcon !== app.icon);
-  const icon = customIcon ? app.icon : app.fallbackIcon;
-  const requestedScale = mobile ? app.iconScaleMobile ?? app.iconScale : app.iconScale;
-  // Optical sizing belongs to the artwork, not the hover animation or hit target.
-  const iconScale = customIcon && Number.isFinite(requestedScale) && requestedScale > 0 ? requestedScale : 1;
-  const targetScale = useTransform(mouseX, value => {
-    const rect = ref.current?.getBoundingClientRect();
-    if (!rect || !Number.isFinite(value)) return 1;
-    const distance = Math.abs(value - rect.left - rect.width / 2);
-    // A cosine falloff has no abrupt corner as adjacent icons enter the hover range.
-    return distance >= 120 ? 1 : 1 + .45 * (1 + Math.cos(Math.PI * distance / 120)) / 2;
-  });
-  const scale = useSpring(targetScale, { stiffness: 460, damping: 30, mass: .45 });
+  const custom = Boolean(app.icon && failedIcon !== app.icon);
+  const correction = mobile ? app.iconScaleMobile ?? app.iconScale : app.iconScale;
+  const artScale = custom && Number.isFinite(correction) && correction > 0 ? correction : 1;
+  const target = useTransform(pointer, value => mobile || reduced ? 1 : dockMagnification(value, geometry.center));
+  const magnification = useSpring(target, { stiffness: 460, damping: 30, mass: .45 });
+  const slotWidth = useTransform(magnification, value => geometry.slot * value);
+  const imageSize = useTransform(magnification, value => iconSize * value);
   return (
-    <li className="dock-item" data-divider={app.dividerBefore || undefined}>
-      <button ref={ref} type="button" className="dock-button" aria-label={app.label} aria-haspopup="dialog"
+    <li className="dock-item" data-divider={app.dividerBefore || undefined}
+      style={mobile ? { minWidth: Math.max(44, iconSize * artScale + 4) } : undefined}>
+      <motion.button type="button" className="dock-button" aria-label={app.label} aria-haspopup="dialog"
+        style={mobile ? undefined : { width: slotWidth }}
         onClick={event => {
           if (!reduced) void bounce.start({ y: [0, mobile ? -8 : -14, 0], transition: { duration: .38, ease: ['easeOut', 'easeIn'] } });
           onOpen(app, event.currentTarget);
         }}>
-        <motion.span className="dock-icon-scale" style={{ scale: mobile || reduced ? 1 : scale }}>
-          <span className="dock-icon-art" style={{ '--dock-art-scale': iconScale }}>
-            <motion.img src={icon} alt="" width={64} height={64} draggable="false" animate={bounce}
-              onError={() => setFailedIcon(app.icon)} />
+        <motion.span className="dock-icon-scale" style={mobile ? undefined : { width: imageSize, height: imageSize }}>
+          <span className="dock-icon-art" style={{ '--dock-art-scale': artScale }}>
+            <motion.img src={custom ? app.icon : app.fallbackIcon} alt="" width="64" height="64" draggable="false"
+              animate={bounce} onError={() => setFailedIcon(app.icon)} />
           </span>
         </motion.span>
         <span className="dock-label" aria-hidden="true">{app.label}</span>
         <span className="dock-dot" data-open={open} aria-hidden="true" />
-      </button>
+      </motion.button>
     </li>
   );
 }
 
 export default function Dock({ apps, mobile, openIds, onOpen }) {
-  const mouseX = useMotionValue(Infinity);
+  const ref = useRef(null);
+  const pointer = useMotionValue(Infinity);
+  const [metrics, setMetrics] = useState({ icon: 52, button: 60 });
+  useLayoutEffect(() => {
+    const update = () => {
+      pointer.set(Infinity);
+      const css = getComputedStyle(ref.current);
+      setMetrics({ icon: parseFloat(css.getPropertyValue('--dock-icon-size')) || 52,
+        button: parseFloat(css.getPropertyValue('--dock-button-width')) || 60 });
+    };
+    update();
+    window.addEventListener('resize', update);
+    return () => window.removeEventListener('resize', update);
+  }, [mobile, pointer]);
+  const layout = dockLayout(apps, metrics.icon, metrics.button);
   return (
-    <nav className="dock" data-dock aria-label={profile.ui.dock}
-      onPointerMove={event => { if (!mobile && event.pointerType === 'mouse') mouseX.set(event.clientX); }}
-      onPointerLeave={() => mouseX.set(Infinity)}>
-      <ul>{apps.map(app => <DockItem key={app.id} app={app} mouseX={mouseX} mobile={mobile}
+    <nav ref={ref} className="dock" data-dock aria-label={profile.ui.dock}
+      onPointerMove={event => {
+        if (mobile || event.pointerType !== 'mouse') return;
+        const rect = event.currentTarget.getBoundingClientRect();
+        pointer.set((event.clientX - rect.left) / rect.width * layout.width);
+      }} onPointerLeave={() => pointer.set(Infinity)}>
+      <ul>{apps.map((app, index) => <DockItem key={app.id} app={app} pointer={pointer}
+        geometry={layout.items[index]} iconSize={metrics.icon} mobile={mobile}
         open={openIds.has(app.id)} onOpen={onOpen} />)}</ul>
     </nav>
   );
```

### src/components/FinderApp.jsx

```diff
--- /dev/null
+++ b/src/components/FinderApp.jsx
@@ -0,0 +1,95 @@
+import { useRef, useState } from 'react';
+import { profile } from '../data/profile.js';
+import TrashApp from './TrashApp.jsx';
+
+function FolderIcon() {
+  return <svg className="finder-folder" viewBox="0 0 64 52" aria-hidden="true"><path d="M3 10a4 4 0 0 1 4-4h19l6 6h25a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M3 19h58" /></svg>;
+}
+
+export default function FinderApp({ projects, apps, mobile, onOpenProject, onOpenApp, onTrash, trashProps }) {
+  const text = profile.finderApp;
+  const [history, setHistory] = useState({ paths: ['projects'], index: 0 });
+  const [view, setView] = useState('grid');
+  const [query, setQuery] = useState('');
+  const [selection, setSelection] = useState(null);
+  const list = useRef(null);
+  const path = history.paths[history.index];
+  const categories = [...new Set(projects.map(project => project.category))];
+  const category = path.startsWith('category:') ? path.slice(9) : null;
+  const navigate = next => {
+    if (next === path) return;
+    setHistory(current => ({ paths: [...current.paths.slice(0, current.index + 1), next], index: current.index + 1 }));
+    setSelection(null); setQuery('');
+  };
+  const go = direction => {
+    setHistory(current => ({ ...current, index: current.index + direction }));
+    setSelection(null); setQuery('');
+  };
+  const title = category || text.locations[path] || text.locations.projects;
+  const entries = path === 'applications' ? apps.map(app => ({ id: `app-${app.id}`, title: app.label, type: 'app', app, icon: app.icon || app.fallbackIcon }))
+    : path === 'projects' ? categories.map(name => ({ id: `folder-${name}`, title: name, type: 'folder', path: `category:${name}` }))
+    : projects.filter(project => !category || project.category === category).map(project => ({ id: project.id, title: project.title, type: 'project', project, icon: project.thumbnail }));
+  const visible = entries.filter(entry => entry.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
+  const selected = visible.find(entry => entry.id === selection);
+  const activate = (entry, trigger) => {
+    if (entry.type === 'folder') navigate(entry.path);
+    else if (entry.type === 'app') onOpenApp(entry.app, trigger);
+    else onOpenProject(entry.project, trigger);
+  };
+  const remove = entry => {
+    if (entry?.type !== 'project') return;
+    onTrash(entry.id); setSelection(null);
+    requestAnimationFrame(() => list.current?.focus());
+  };
+  return (
+    <div className="finder-app">
+      <aside className="finder-sidebar" aria-label={text.sidebarLabel}>
+        <p className="gallery-section-label">{text.favorites}</p>
+        {['desktop', 'projects', 'applications', 'trash'].map(location => <button key={location} type="button"
+          className="gallery-collection" aria-pressed={path === location || (location === 'projects' && Boolean(category))}
+          onClick={() => navigate(location)}><span aria-hidden="true">{text.locationSymbols[location]}</span>{text.locations[location]}</button>)}
+      </aside>
+      <section className="finder-main" aria-label={title}>
+        <header className="finder-toolbar">
+          <div className="finder-navigation files-actions">
+            <button type="button" aria-label={text.back} disabled={history.index === 0} onClick={() => go(-1)}>‹</button>
+            <button type="button" aria-label={text.forward} disabled={history.index === history.paths.length - 1} onClick={() => go(1)}>›</button>
+            <strong>{title}</strong>
+          </div>
+          {path !== 'trash' && <div className="finder-tools">
+            <div className="files-actions"><button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>{text.grid}</button>
+              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>{text.list}</button></div>
+            <input type="search" value={query} aria-label={text.search} placeholder={text.search} onChange={event => setQuery(event.target.value)} />
+          </div>}
+        </header>
+        {path === 'trash' ? <TrashApp {...trashProps} /> : <>
+          <nav className="finder-path" aria-label={text.pathLabel}>
+            <button type="button" onClick={() => navigate('projects')}>{profile.displayName}</button>
+            {category && <><span aria-hidden="true">›</span><button type="button" onClick={() => navigate('projects')}>{text.locations.projects}</button></>}
+            <span>› {title}</span>
+          </nav>
+          <div ref={list} className={`finder-entries finder-entries--${view}`} tabIndex={0} aria-label={text.filesLabel}>
+            {visible.map(entry => <button type="button" key={entry.id} className="finder-entry" aria-pressed={selection === entry.id}
+              aria-label={`${entry.title}, ${text.kinds[entry.type]}`} onClick={event => {
+                setSelection(entry.id);
+                if (mobile) activate(entry, event.currentTarget);
+              }} onDoubleClick={event => { if (!mobile) activate(entry, event.currentTarget); }}
+              onKeyDown={event => {
+                if (event.key === 'Enter') { event.preventDefault(); activate(entry, event.currentTarget); }
+                if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(entry); }
+              }}>
+              {entry.type === 'folder' ? <FolderIcon /> : <img src={entry.icon} alt="" width="64" height="64" loading="lazy" />}
+              <span className="finder-entry-name">{entry.title}</span>
+              <small>{entry.project?.category || text.kinds[entry.type]}</small>
+            </button>)}
+            {!visible.length && <p className="gallery-empty">{text.emptyMessage}</p>}
+          </div>
+          <footer className="finder-status"><span role="status">{visible.length} {visible.length === 1 ? text.item : text.items}</span>
+            <div className="files-actions"><button type="button" disabled={!selected} onClick={event => activate(selected, event.currentTarget)}>{text.open}</button>
+              <button type="button" disabled={selected?.type !== 'project'} onClick={() => remove(selected)}>{text.moveToTrash}</button></div>
+          </footer>
+        </>}
+      </section>
+    </div>
+  );
+}
```

### src/components/TrashApp.jsx

```diff
--- /dev/null
+++ b/src/components/TrashApp.jsx
@@ -0,0 +1,33 @@
+import { useRef, useState } from 'react';
+import { profile } from '../data/profile.js';
+
+export default function TrashApp({ projects, onRestore, onRestoreAll, onEmpty }) {
+  const [confirm, setConfirm] = useState(false);
+  const emptyButton = useRef(null);
+  const text = profile.trashApp;
+  return (
+    <section className="trash-app" aria-label={text.title} onKeyDown={event => {
+      if (confirm && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setConfirm(false); emptyButton.current?.focus(); }
+    }}>
+      <header className="files-toolbar"><div><h2>{text.title}</h2><p>{text.description}</p></div>
+        <div className="files-actions">
+          <button type="button" disabled={!projects.length} onClick={onRestoreAll}>{text.restoreAll}</button>
+          <button ref={emptyButton} type="button" disabled={!projects.length} onClick={() => setConfirm(true)}>{text.empty}</button>
+        </div>
+      </header>
+      {confirm && projects.length > 0 && <div className="trash-confirm" role="alert">
+        <p>{text.confirmMessage}</p><div className="files-actions">
+          <button type="button" onClick={() => { setConfirm(false); emptyButton.current?.focus(); }}>{text.cancel}</button>
+          <button type="button" className="files-danger" onClick={() => { onEmpty(); setConfirm(false); }}>{text.confirmEmpty}</button>
+        </div>
+      </div>}
+      <div className="trash-list">
+        {projects.length ? projects.map(project => <div className="trash-row" key={project.id}>
+          <img src={project.thumbnail} width="44" height="44" alt="" loading="lazy" />
+          <div><strong>{project.title}</strong><span>{project.category}</span></div>
+          <button type="button" aria-label={`${text.restore}: ${project.title}`} onClick={() => onRestore(project.id)}>{text.restore}</button>
+        </div>) : <div className="files-empty"><span aria-hidden="true">⌑</span><h3>{text.emptyTitle}</h3><p>{text.emptyMessage}</p></div>}
+      </div>
+    </section>
+  );
+}
```

### src/components/Window.jsx

```diff
--- a/src/components/Window.jsx
+++ b/src/components/Window.jsx
@@ -2,7 +2,8 @@
 import { animate, motion, useIsPresent, useMotionValue, useReducedMotion } from 'framer-motion';
 import { usePointerDrag } from '../hooks/usePointerDrag.js';
 import { useSurfaceFocus } from '../hooks/useSurfaceFocus.js';
-import { collapseTransform, desktopBounds, fitFrame, rectOf } from '../utils/geometry.js';
+import { resizeEdges, useWindowResize } from '../hooks/useWindowResize.js';
+import { collapseTransform, fitFrame, rectOf, viewportFrame } from '../utils/geometry.js';
 import { profile } from '../data/profile.js';
 
 const spring = { type: 'spring', stiffness: 420, damping: 36, mass: .8 };
@@ -16,7 +17,7 @@
   const ref = useRef(null);
   const present = useIsPresent();
   const reduced = useReducedMotion();
-  const [frame, setFrame] = useState(() => fitFrame(record.frame));
+  const [frame, setFrame] = useState(() => record.maximized ? viewportFrame() : fitFrame(record.frame));
   const left = useMotionValue(frame.x);
   const top = useMotionValue(frame.y);
   const width = useMotionValue(frame.width);
@@ -30,11 +31,7 @@
     const zoomChanged = previousZoom.current !== record.maximized;
     previousZoom.current = record.maximized;
     const update = (smooth = false) => {
-      const bounds = desktopBounds();
-      const next = record.maximized ? {
-        x: bounds.left, y: bounds.top,
-        width: bounds.right - bounds.left, height: bounds.bottom - bounds.top,
-      } : fitFrame(record.frame);
+      const next = record.maximized ? viewportFrame() : fitFrame(record.frame);
       setFrame(next);
       geometryAnimations.current.forEach(animation => animation.stop());
       const values = [[left, next.x], [top, next.y], [width, next.width], [height, next.height]];
@@ -54,8 +51,21 @@
 
   useSurfaceFocus(ref, {
     active: focused && present && !blocked && !record.minimized,
-    onClose: () => onClose(record.id),
+    modal: record.maximized,
+    onClose: () => record.maximized ? onZoom(record.id) : onClose(record.id),
     restoreTarget: record.trigger,
+  });
+  const readFrame = () => ({ x: left.get(), y: top.get(), width: width.get(), height: height.get() });
+  const applyFrame = next => { left.set(next.x); top.set(next.y); width.set(next.width); height.set(next.height); };
+  const settle = () => {
+    geometryAnimations.current.forEach(animation => animation.stop());
+    applyFrame(frame);
+  };
+  const resize = useWindowResize({
+    enabled: !record.maximized && present && !blocked && !record.minimized,
+    read: readFrame, apply: applyFrame, settle,
+    commit: next => onMove(record.id, next),
+    minimum: { width: ['notes', 'gallery', 'finder'].includes(record.kind) ? 480 : 360, height: 240 },
   });
   const drag = usePointerDrag({
     enabled: !record.maximized && present && !blocked && !record.minimized,
@@ -81,10 +91,10 @@
   const inactive = blocked || record.minimized || !present;
 
   return (
-    <motion.section ref={ref} role="dialog" aria-labelledby={`${record.id}-title`} tabIndex={-1}
+    <motion.section ref={ref} role="dialog" aria-modal={record.maximized || undefined} aria-labelledby={`${record.id}-title`} tabIndex={-1}
       aria-hidden={inactive || undefined} inert={inactive}
       className="window" data-kind={record.kind} data-focused={focused && !inactive} data-maximized={record.maximized}
-      style={{ left, top, width, height, zIndex: 20 + order,
+      style={{ left, top, width, height, zIndex: (record.maximized ? 600 : 20) + order,
         pointerEvents: inactive ? 'none' : 'auto', transformOrigin: '0 0' }}
       initial={reduced ? { opacity: 0 } : initial.current}
       animate={record.minimized ? (reduced ? { opacity: 0 } : away) : { x: 0, y: 0, scale: 1, opacity: 1 }}
@@ -120,6 +130,9 @@
         <span className="titlebar-spacer" aria-hidden="true" />
       </header>
       <div className={`window__content window__content--${record.kind}`}>{children}</div>
+      {!record.maximized && resizeEdges.map(edge => <button key={edge} type="button"
+        className={`window-resize window-resize--${edge}`} data-edge={edge}
+        aria-label={`${profile.ui.resizeEdges[edge]}: ${record.title}`} {...resize} />)}
     </motion.section>
   );
 }
```

### src/data/profile.js

```diff
--- a/src/data/profile.js
+++ b/src/data/profile.js
@@ -6,6 +6,9 @@
 import galleryIcon from '../assets/dock/gallery.svg?no-inline';
 import notesIcon from '../assets/dock/notes.svg?no-inline';
 import mailIcon from '../assets/dock/mail.svg?no-inline';
+import finderIcon from '../assets/dock/finder.svg?no-inline';
+import trashIcon from '../assets/dock/trash.svg?no-inline';
+import trashFullIcon from '../assets/dock/trash-full.svg?no-inline';
 
 const base = import.meta.env.BASE_URL;
 
@@ -51,6 +54,22 @@
     projectSingular: 'project',
     projectPlural: 'projects',
     emptyMessage: 'No projects in this collection yet.',
+  },
+  finderApp: {
+    title: 'Finder', sidebarLabel: 'Finder locations', favorites: 'Favorites',
+    locations: { desktop: 'Desktop', projects: 'Projects', applications: 'Applications', trash: 'Trash' },
+    locationSymbols: { desktop: '▣', projects: '▱', applications: '⊞', trash: '⌑' },
+    kinds: { folder: 'Folder', app: 'Application', project: 'Design project' },
+    back: 'Back', forward: 'Forward', grid: 'Icons', list: 'List', search: 'Search this folder',
+    pathLabel: 'Folder path', filesLabel: 'Folder contents', item: 'item', items: 'items',
+    open: 'Open', moveToTrash: 'Move to Trash', emptyMessage: 'No items in this folder.',
+  },
+  trashApp: {
+    title: 'Trash', description: 'Portfolio files in this tab’s virtual Trash.',
+    restore: 'Put Back', restoreAll: 'Put Back All', empty: 'Empty Trash',
+    emptyTitle: 'Trash is empty', emptyMessage: 'Projects moved to Trash will appear here.',
+    confirmMessage: 'Empty the virtual Trash? These items will stay hidden for this tab session. Your source files are never deleted.',
+    cancel: 'Cancel', confirmEmpty: 'Empty Trash',
   },
   ui: {
     desktop: 'Design projects',
@@ -67,6 +86,8 @@
     gallery: 'Project images',
     imageError: 'Image unavailable',
     swipeHint: 'Drag down from the header to close',
+    resizeEdges: { n: 'Resize top', ne: 'Resize top right', e: 'Resize right', se: 'Resize bottom right',
+      s: 'Resize bottom', sw: 'Resize bottom left', w: 'Resize left', nw: 'Resize top left' },
   },
   intro: '10+ years in visual design, with a focus on icons, branding, illustration, packaging, and social media visuals.',
 
@@ -103,12 +124,14 @@
 };
 
 export const dockApps = [
+  { id: 'finder', label: 'Finder', kind: 'finder', icon: finderIcon, fallbackIcon: makeIcon('F', '#9FD8FA', '#508CCB') },
   { id: 'illustrator', label: 'Illustrator', kind: 'skill', icon: illustratorIcon, fallbackIcon: makeIcon('V', '#FFCB88', '#D77838', '#43281C') },
   { id: 'photoshop', label: 'Photoshop', kind: 'skill', icon: photoshopIcon, fallbackIcon: makeIcon('P', '#78BFF4', '#3458B1') },
   { id: 'figma', label: 'Figma', kind: 'skill', icon: figmaIcon, fallbackIcon: makeIcon('F', '#CAA8F4', '#7C5AB3') },
   { id: 'gallery', label: 'Gallery', kind: 'gallery', dividerBefore: true, icon: galleryIcon, fallbackIcon: makeIcon('G', '#C4D8F5', '#7398D1', '#243B61') },
   { id: 'notes', label: 'Notes', kind: 'notes', icon: notesIcon, fallbackIcon: makeIcon('≡', '#FFF0A2', '#EBC958', '#604F25') },
   { id: 'mail', label: 'Mail', kind: 'mail', icon: mailIcon, fallbackIcon: makeIcon('@', '#94DAD2', '#3B989E') },
+  { id: 'trash', label: 'Trash', kind: 'trash', dividerBefore: true, icon: trashIcon, fullIcon: trashFullIcon, fallbackIcon: makeIcon('⌑', '#E4E8EC', '#A3ABB4', '#45505C') },
 ];
 
 export const skillDialogs = {
```

### src/hooks/usePointerDrag.js

```diff
--- a/src/hooks/usePointerDrag.js
+++ b/src/hooks/usePointerDrag.js
@@ -19,7 +19,7 @@
     dragged,
     handlers: {
       onPointerDown(event) {
-        if (!enabled || event.button !== 0) return;
+        if (!enabled || event.button !== 0 || gesture.current) return;
         dragged.current = false;
         gesture.current = {
           id: event.pointerId, x: event.clientX, y: event.clientY,
```

### src/hooks/useProjectFiles.js

```diff
--- /dev/null
+++ b/src/hooks/useProjectFiles.js
@@ -0,0 +1,41 @@
+import { useCallback, useEffect, useReducer } from 'react';
+
+export const fileSessionKey = 'perdana.files.v1';
+export const emptyFileState = { trashed: [], removed: [] };
+
+export function projectFilesReducer(state, action) {
+  if (action.type === 'trash') {
+    if (state.trashed.includes(action.id) || state.removed.includes(action.id)) return state;
+    return { ...state, trashed: [...state.trashed, action.id] };
+  }
+  if (action.type === 'restore') return { ...state, trashed: state.trashed.filter(id => id !== action.id) };
+  if (action.type === 'restore-all') return { ...state, trashed: [] };
+  if (action.type === 'empty') return { trashed: [], removed: [...new Set([...state.removed, ...state.trashed])] };
+  return state;
+}
+
+export function useProjectFiles(projects) {
+  const [state, dispatch] = useReducer(projectFilesReducer, projects, items => {
+    try {
+      const stored = JSON.parse(sessionStorage.getItem(fileSessionKey));
+      const valid = new Set(items.map(item => item.id));
+      if (stored && Array.isArray(stored.trashed) && Array.isArray(stored.removed)) {
+        const removed = [...new Set(stored.removed.filter(id => valid.has(id)))];
+        return { removed, trashed: [...new Set(stored.trashed.filter(id => valid.has(id) && !removed.includes(id)))] };
+      }
+    } catch { /* Storage may be unavailable; memory-only operation still works. */ }
+    return emptyFileState;
+  });
+  useEffect(() => {
+    try { sessionStorage.setItem(fileSessionKey, JSON.stringify(state)); } catch { /* Memory fallback. */ }
+  }, [state]);
+  const trash = useCallback(id => { if (projects.some(item => item.id === id)) dispatch({ type: 'trash', id }); }, [projects]);
+  const restore = useCallback(id => dispatch({ type: 'restore', id }), []);
+  const restoreAll = useCallback(() => dispatch({ type: 'restore-all' }), []);
+  const empty = useCallback(() => dispatch({ type: 'empty' }), []);
+  return {
+    available: projects.filter(item => !state.trashed.includes(item.id) && !state.removed.includes(item.id)),
+    trashed: projects.filter(item => state.trashed.includes(item.id)),
+    trash, restore, restoreAll, empty,
+  };
+}
```

### src/hooks/useWindowResize.js

```diff
--- /dev/null
+++ b/src/hooks/useWindowResize.js
@@ -0,0 +1,33 @@
+import { usePointerDrag } from './usePointerDrag.js';
+import { desktopBounds, resizeFrame } from '../utils/geometry.js';
+
+export const resizeEdges = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
+
+export function useWindowResize({ enabled, read, apply, settle, commit, minimum }) {
+  const drag = usePointerDrag({
+    enabled,
+    start: event => {
+      settle();
+      return { frame: read(), edge: event.currentTarget.dataset.edge };
+    },
+    move: ({ dx, dy, origin }) => apply(resizeFrame(origin.frame, origin.edge, dx, dy, desktopBounds(), minimum)),
+    end: ({ moved, cancelled, origin }) => {
+      if (cancelled) apply(origin.frame);
+      else if (moved) commit(read());
+    },
+  });
+  return {
+    ...drag.handlers,
+    onKeyDown(event) {
+      if (!enabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
+      event.preventDefault();
+      event.stopPropagation();
+      settle();
+      const amount = event.shiftKey ? 40 : 10;
+      const dx = event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
+      const dy = event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
+      const next = resizeFrame(read(), event.currentTarget.dataset.edge, dx, dy, desktopBounds(), minimum);
+      apply(next); commit(next);
+    },
+  };
+}
```

### src/hooks/useWindows.js

```diff
--- a/src/hooks/useWindows.js
+++ b/src/hooks/useWindows.js
@@ -6,7 +6,7 @@
   const target = windows.find(item => item.id === action.id);
   switch (action.type) {
     case 'open':
-      return [...windows.filter(item => item.id !== action.item.id), {
+      return [...windows.filter(item => item.id !== action.item.id).map(item => item.maximized && !item.minimized ? { ...item, maximized: false } : item), {
         ...(windows.find(item => item.id === action.item.id) ?? action.item),
         origin: action.item.origin,
         trigger: action.item.trigger,
@@ -14,7 +14,7 @@
       }];
     case 'focus':
       if (!target || windows.at(-1)?.id === action.id) return windows;
-      return [...windows.filter(item => item.id !== action.id), target];
+      return [...windows.filter(item => item.id !== action.id).map(item => item.maximized && !item.minimized ? { ...item, maximized: false } : item), target];
     case 'close':
       return windows.filter(item => item.id !== action.id);
     case 'minimize':
```

### src/styles.css

```diff
--- a/src/styles.css
+++ b/src/styles.css
@@ -364,6 +364,7 @@
   z-index: 500;
   bottom: calc(var(--dock-bottom) + var(--safe-bottom));
   left: 50%;
+  width: max-content;
   max-width: calc(100% - 24px - var(--safe-left) - var(--safe-right));
   padding: 6px 8px;
   border: 1px solid var(--glass-border);
@@ -373,13 +374,13 @@
   transform: translateX(-50%);
 }
 .dock ul { display: flex; align-items: flex-end; gap: 4px; margin: 0; padding: 0; list-style: none; }
-.dock-item { position: relative; min-width: 0; }
+.dock-item { position: relative; flex: 0 0 auto; min-width: 0; }
 .dock-item[data-divider="true"] { margin-left: 7px; padding-left: 9px; }
 .dock-item[data-divider="true"]::before { content: ''; position: absolute; left: 0; top: 8px; width: 1px; height: 40px; background: rgb(60 60 67 / 0.2); }
 .dock-button {
   position: relative;
   display: flex;
-  align-items: flex-start;
+  align-items: flex-end;
   justify-content: center;
   width: var(--dock-button-width);
   height: 60px;
@@ -389,8 +390,9 @@
   background: transparent;
   transition: background-color var(--duration-fast) ease;
 }
-.dock-icon-scale { display: block; flex: 0 0 auto; transform-origin: 50% 100%; }
-.dock-icon-scale img { display: block; width: var(--dock-icon-size); height: var(--dock-icon-size); object-fit: contain; filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.16)); }
+.dock-icon-scale { display: block; flex: 0 0 auto; width: var(--dock-icon-size); height: var(--dock-icon-size); }
+.dock-icon-art { display: block; width: 100%; height: 100%; transform: scale(var(--dock-art-scale, 1)); transform-origin: center; pointer-events: none; }
+.dock-icon-scale img { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.16)); }
 .dock-label {
   position: absolute;
   bottom: calc(var(--dock-icon-size) * 1.45 + 14px);
@@ -642,8 +644,9 @@
   .thumbnail__preview { transform: none; }
   .thumbnail__label { font-size: var(--text-sm); }
   .dock { width: min(440px, calc(100% - 16px - var(--safe-left) - var(--safe-right))); max-width: calc(100% - 16px - var(--safe-left) - var(--safe-right)); padding: 6px 4px; border-radius: 22px; }
-  .dock ul { width: 100%; gap: 2px; }
-  .dock-item { flex: 1; }
+  .dock ul { width: 100%; gap: 2px; overflow-x: auto; overflow-y: hidden; padding-top: 8px; scrollbar-width: none; }
+  .dock ul::-webkit-scrollbar { display: none; }
+  .dock-item { flex: 1 0 44px; }
   .dock-item[data-divider="true"] { margin: 0; padding: 0; }
   .dock-item[data-divider="true"]::before { display: none; }
   .dock-button { width: 100%; min-width: 44px; height: 70px; padding-top: 2px; }
@@ -732,4 +735,90 @@
 .menu-bar {
   color: #fff;
   text-shadow: 0 1px 3px rgb(0 0 0 / 0.65);
-}
\ No newline at end of file
+}
+
+/* Phase 4 interactions: keep the uploaded theme, wallpaper and app styles. */
+.window[data-maximized="true"] { border: 0; border-radius: 0; box-shadow: none; }
+.window-resize { position: absolute; z-index: 5; padding: 0; border: 0; border-radius: 0; background: transparent; touch-action: none; }
+.window-resize--n, .window-resize--s { left: 14px; right: 14px; height: 6px; cursor: ns-resize; }
+.window-resize--n { top: 0; }
+.window-resize--s { bottom: 0; }
+.window-resize--e, .window-resize--w { top: 14px; bottom: 14px; width: 6px; cursor: ew-resize; }
+.window-resize--e { right: 0; }
+.window-resize--w { left: 0; }
+.window-resize--ne, .window-resize--nw, .window-resize--se, .window-resize--sw { width: 14px; height: 14px; }
+.window-resize--ne { top: 0; right: 0; cursor: nesw-resize; }
+.window-resize--nw { top: 0; left: 0; cursor: nwse-resize; }
+.window-resize--se { bottom: 0; right: 0; cursor: nwse-resize; }
+.window-resize--sw { bottom: 0; left: 0; cursor: nesw-resize; }
+.window-resize:focus-visible { outline: 3px solid var(--color-focus); outline-offset: -3px; background: rgb(40 91 213 / .15); }
+.window__content--finder, .window__content--trash { overflow: hidden; }
+.finder-app { display: flex; height: 100%; min-height: 0; }
+.finder-sidebar { flex: 0 0 180px; min-width: 0; padding: 10px 8px; overflow: auto; border-right: 1px solid var(--color-divider); background: var(--app-sidebar); }
+.finder-sidebar .gallery-collection > span { flex: 0 0 18px; color: var(--color-accent); text-align: center; }
+.finder-main { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; background: var(--color-surface); }
+.finder-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--color-divider); background: var(--window-toolbar-inactive); }
+.finder-navigation { min-width: 0; }
+.finder-navigation strong { margin-left: 6px; overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
+.finder-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
+.finder-tools input { width: 160px; min-width: 0; height: 32px; padding: 5px 10px; border: 1px solid var(--color-border); border-radius: 7px; background: var(--color-surface); color: var(--color-text); font-size: 12px; }
+.files-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
+.files-actions button, .trash-row > button { min-height: 32px; padding: 5px 10px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-surface); color: var(--color-text); font-size: 12px; line-height: 18px; }
+.files-actions button:disabled { opacity: .45; }
+.files-actions button[aria-pressed="true"] { background: var(--gallery-selection); color: #174b9d; }
+.files-actions .files-danger { background: #b42318; border-color: #b42318; color: #fff; }
+.finder-path { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 34px; padding: 3px 12px; border-bottom: 1px solid var(--color-divider); color: var(--color-muted); font-size: 11px; }
+.finder-path button { min-height: 28px; padding: 0 4px; border: 0; border-radius: 3px; background: none; color: inherit; font-size: inherit; }
+.finder-entries { flex: 1; min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 14px; }
+.finder-entries--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); align-content: start; gap: 12px; }
+.finder-entry { min-width: 0; padding: 10px 6px; border: 1px solid transparent; border-radius: 7px; background: transparent; color: var(--color-text); text-align: center; }
+.finder-entry img, .finder-folder { display: block; width: 64px; height: 58px; margin: 0 auto 7px; object-fit: contain; }
+.finder-folder { fill: #79c7f4; stroke: #4596ca; stroke-width: 1.4; }
+.finder-entry-name { display: block; font-size: 12px; line-height: 17px; overflow-wrap: anywhere; }
+.finder-entry small { display: block; margin-top: 3px; color: var(--color-muted); font-size: 10px; line-height: 15px; }
+.finder-entry[aria-pressed="true"] { border-color: rgb(40 91 213 / .25); background: var(--gallery-selection); }
+.finder-entries--list .finder-entry { display: grid; grid-template-columns: 30px minmax(0, 1fr) minmax(90px, .6fr); align-items: center; gap: 10px; width: 100%; padding: 8px; border-radius: 4px; text-align: left; }
+.finder-entries--list .finder-entry img, .finder-entries--list .finder-folder { width: 28px; height: 28px; margin: 0; }
+.finder-entries--list .finder-entry small { margin: 0; }
+.finder-status { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--color-divider); background: var(--window-toolbar-inactive); }
+.finder-status > span { color: var(--color-muted); font-size: 11px; }
+.trash-app { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; height: 100%; background: var(--color-surface); }
+.files-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 18px; border-bottom: 1px solid var(--color-divider); }
+.files-toolbar h2 { margin: 0 0 4px; font-size: 19px; line-height: 24px; }
+.files-toolbar p { margin: 0; color: var(--color-muted); font-size: 11px; line-height: 17px; }
+.trash-confirm { padding: 14px 18px; border-bottom: 1px solid #ead6a8; background: #fff7e2; }
+.trash-confirm p { margin-bottom: 10px; font-size: 13px; }
+.trash-list { flex: 1; min-height: 0; overflow: auto; padding: 10px 18px; }
+.trash-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--color-divider); }
+.trash-row img { flex: 0 0 44px; object-fit: contain; }
+.trash-row > div { flex: 1; min-width: 0; }
+.trash-row strong, .trash-row span { display: block; overflow-wrap: anywhere; }
+.trash-row strong { font-size: 13px; line-height: 19px; }
+.trash-row span { margin-top: 3px; color: var(--color-muted); font-size: 11px; }
+.files-empty { padding: 48px 20px; color: var(--color-muted); text-align: center; }
+.files-empty > span { font-size: 48px; }
+.files-empty h3 { margin: 16px 0 8px; color: var(--color-text); font-size: 18px; }
+.files-empty p { font-size: 13px; }
+@media (hover: hover) and (pointer: fine) {
+  .finder-entry:not([aria-pressed="true"]):hover, .files-actions button:not(:disabled):hover, .trash-row > button:hover { background: var(--color-hover); }
+  .files-actions .files-danger:hover { background: #912018; }
+}
+@media (max-width: 768px) {
+  :root { --dock-height: 92px; }
+  .finder-app { flex-direction: column; }
+  .finder-sidebar { display: flex; flex: 0 0 auto; gap: 4px; overflow-x: auto; padding: 8px; border-right: 0; border-bottom: 1px solid var(--color-divider); }
+  .finder-sidebar > p { display: none; }
+  .finder-sidebar .gallery-collection { flex-shrink: 0; }
+  .finder-toolbar { padding: 10px; }
+  .finder-tools { width: 100%; }
+  .finder-tools input { flex: 1; height: 44px; }
+  .files-actions button, .trash-row > button, .finder-path button { min-height: 44px; }
+  .finder-entries--grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
+  .finder-entries--list .finder-entry { grid-template-columns: 28px minmax(0, 1fr); min-height: 44px; }
+  .finder-entries--list .finder-entry small { display: none; }
+  .trash-row { gap: 8px; }
+}
+@media (forced-colors: active) {
+  .finder-sidebar, .finder-toolbar, .finder-status, .trash-confirm { background: Canvas; color: CanvasText; }
+  .finder-entry[aria-pressed="true"] { background: Highlight; color: HighlightText; }
+}
```

### src/utils/dockLayout.js

```diff
--- /dev/null
+++ b/src/utils/dockLayout.js
@@ -0,0 +1,20 @@
+// Width-growing magnification informed by alanagoyal.com (MIT).
+// Resting centers keep the animation from chasing its own moving targets.
+export function dockLayout(apps, iconSize = 52, buttonSize = 60) {
+  let cursor = 9;
+  const items = apps.map((app, index) => {
+    if (index) cursor += 4;
+    if (app.dividerBefore) cursor += 16;
+    const correction = Number.isFinite(app.iconScale) && app.iconScale > 0 ? app.iconScale : 1;
+    const slot = Math.max(buttonSize, iconSize * Math.max(1, correction) + 8);
+    const center = cursor + slot / 2;
+    cursor += slot;
+    return { slot, center };
+  });
+  return { items, width: cursor + 9 };
+}
+
+export function dockMagnification(pointer, center) {
+  const distance = Math.abs(pointer - center);
+  return !Number.isFinite(pointer) || distance >= 120 ? 1 : 1 + .45 * (1 + Math.cos(Math.PI * distance / 120)) / 2;
+}
```

### src/utils/geometry.js

```diff
--- a/src/utils/geometry.js
+++ b/src/utils/geometry.js
@@ -24,7 +24,7 @@
 
 export function initialFrame(kind, index) {
   const bounds = desktopBounds();
-  const width = Math.min(kind === 'mail' ? 520 : kind === 'notes' ? 860 : kind === 'gallery' ? 980 : 900, bounds.right - bounds.left);
+  const width = Math.min(kind === 'mail' ? 520 : kind === 'notes' ? 860 : kind === 'gallery' ? 980 : kind === 'trash' ? 720 : 900, bounds.right - bounds.left);
   const height = Math.min(kind === 'mail' ? 440 : kind === 'gallery' ? 680 : 650, bounds.bottom - bounds.top);
   const offset = (index % 4) * 22;
   return fitFrame({
@@ -32,6 +32,26 @@
     y: bounds.top + 12 + offset,
     width, height,
   });
+}
+
+export const viewportFrame = () => ({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });
+
+// Fixed opposite edges; the minimum shrinks when the viewport itself is smaller.
+export function resizeFrame(frame, edge, dx, dy, bounds, minimum = { width: 360, height: 240 }) {
+  const minW = Math.min(minimum.width, bounds.right - bounds.left);
+  const minH = Math.min(minimum.height, bounds.bottom - bounds.top);
+  const base = {
+    width: clamp(frame.width, minW, bounds.right - bounds.left),
+    height: clamp(frame.height, minH, bounds.bottom - bounds.top),
+  };
+  base.x = clamp(frame.x, bounds.left, bounds.right - base.width);
+  base.y = clamp(frame.y, bounds.top, bounds.bottom - base.height);
+  let left = base.x, top = base.y, right = left + base.width, bottom = top + base.height;
+  if (edge.includes('w')) left = clamp(left + dx, bounds.left, right - minW);
+  if (edge.includes('e')) right = clamp(right + dx, left + minW, bounds.right);
+  if (edge.includes('n')) top = clamp(top + dy, bounds.top, bottom - minH);
+  if (edge.includes('s')) bottom = clamp(bottom + dy, top + minH, bounds.bottom);
+  return { x: left, y: top, width: right - left, height: bottom - top };
 }
 
 export function rectOf(element) {
```

### LICENSE-THIRD-PARTY

```diff
--- a/LICENSE-THIRD-PARTY
+++ b/LICENSE-THIRD-PARTY
@@ -1,6 +1,6 @@
 Reference: alanagoyal.com
 Source: https://github.com/alanagoyal/alanagoyal
-Menu bar proportions, minute-aligned clock scheduling, and window focus treatment informed by this MIT-licensed project. Window controls are original inline SVG drawings.
+Menu bar proportions, minute-aligned clock scheduling, and window focus treatment informed by this MIT-licensed project. Width-growing Dock slots and viewport-fullscreen window behavior are also informed by the reference. Finder/Trash use original portfolio-specific logic. Window controls are original inline SVG drawings.
 
 MIT License
 
```

### tests/interactions.mjs

```diff
--- /dev/null
+++ b/tests/interactions.mjs
@@ -0,0 +1,75 @@
+import assert from 'node:assert/strict';
+import { resizeFrame, viewportFrame, fitFrame, desktopBounds } from '../src/utils/geometry.js';
+import { dockLayout, dockMagnification } from '../src/utils/dockLayout.js';
+import { windowsReducer } from '../src/hooks/useWindows.js';
+import { projectFilesReducer } from '../src/hooks/useProjectFiles.js';
+
+globalThis.window = { innerWidth: 1440, innerHeight: 900 };
+globalThis.document = { querySelector: () => null };
+assert.deepEqual(viewportFrame(), { x: 0, y: 0, width: 1440, height: 900 });
+const bounds = { left: 12, top: 40, right: 1428, bottom: 790 };
+const original = { x: 300, y: 120, width: 720, height: 500 };
+for (const edge of ['n','ne','e','se','s','sw','w','nw']) {
+  for (const dx of [-9999,-50,0,50,9999]) for (const dy of [-9999,-50,0,50,9999]) {
+    const next = resizeFrame(original,edge,dx,dy,bounds);
+    assert.ok(next.x >= bounds.left && next.y >= bounds.top);
+    assert.ok(next.x + next.width <= bounds.right && next.y + next.height <= bounds.bottom);
+    assert.ok(next.width >= 360 && next.height >= 240);
+    if(edge.includes('w')) assert.equal(next.x + next.width,original.x + original.width);
+    if(edge.includes('n')) assert.equal(next.y + next.height,original.y + original.height);
+  }
+}
+assert.equal(resizeFrame(original,'w',40,0,bounds).width,680);
+assert.equal(resizeFrame(original,'e',40,0,bounds).width,760);
+assert.deepEqual(resizeFrame(original,'se',9999,9999,{left:0,top:0,right:200,bottom:120}),{x:0,y:0,width:200,height:120});
+assert.ok(resizeFrame({x:12,y:40,width:300,height:200},'se',0,0,bounds,{width:480,height:240}).width>=480);
+
+const a={id:'a',frame:original,maximized:true,minimized:false};
+const b={id:'b',frame:{...original,x:50},maximized:false,minimized:false};
+let windows=windowsReducer([a],{type:'open',item:b});
+assert.equal(windows[0].maximized,false);
+assert.deepEqual(windows[0].frame,original);
+windows=windowsReducer(windows,{type:'zoom',id:'b'});
+windows=windowsReducer(windows,{type:'move',id:'a',frame:resizeFrame(original,'se',30,40,bounds)});
+windows=windowsReducer(windows,{type:'focus',id:'a'});
+assert.equal(windows.at(-1).id,'a');
+assert.equal(windows.find(w=>w.id==='b').maximized,false);
+assert.equal(windows.at(-1).frame.width,750);
+windows=windowsReducer(windows,{type:'zoom',id:'a'});
+windows=windowsReducer(windows,{type:'minimize',id:'a'});
+windows=windowsReducer(windows,{type:'open',item:{...a,origin:{x:1},trigger:null}});
+assert.equal(windows.at(-1).maximized,true);
+assert.equal(windows.at(-1).minimized,false);
+assert.equal(windows.at(-1).frame.width,750);
+
+let files={trashed:[],removed:[]};
+files=projectFilesReducer(files,{type:'trash',id:'one'});
+files=projectFilesReducer(files,{type:'trash',id:'one'});
+assert.deepEqual(files.trashed,['one']);
+files=projectFilesReducer(files,{type:'restore',id:'one'});
+assert.deepEqual(files.trashed,[]);
+files=projectFilesReducer(files,{type:'trash',id:'one'});
+files=projectFilesReducer(files,{type:'empty'});
+assert.deepEqual(files,{trashed:[],removed:['one']});
+assert.deepEqual(projectFilesReducer(files,{type:'trash',id:'one'}),files);
+assert.deepEqual(projectFilesReducer({trashed:['a','b'],removed:['c']},{type:'restore-all'}),{trashed:[],removed:['c']});
+
+const apps=Array.from({length:8},(_,index)=>({dividerBefore:index===4||index===7,iconScale:index===1?1.2:1}));
+const layout=dockLayout(apps);
+let maximum=0;
+for(let pointer=0;pointer<=layout.width;pointer+=5){
+  let width=18+7*4+2*16;
+  layout.items.forEach((item,index)=>{
+    const scale=dockMagnification(pointer,item.center);
+    assert.ok(scale>=1&&scale<=1.45);
+    const art=52*Math.max(1,apps[index].iconScale)*scale;
+    assert.ok(item.slot*scale-art>=7.99,'Optically enlarged artwork still has layout room');
+    width+=item.slot*scale;
+  });
+  maximum=Math.max(maximum,width);
+}
+assert.ok(maximum>layout.width,'Glass must widen');
+assert.ok(maximum<769-24,'Eight normal slots fit the smallest desktop');
+assert.equal(dockMagnification(Infinity,10),1);
+assert.equal(dockMagnification(10,10),1.45);
+console.log('PASS: 200 resize cases, fullscreen/restore/focus transitions, Trash lifecycle, and width-growing non-overlapping Dock geometry.');
```

