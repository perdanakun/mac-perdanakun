import ui_wifi from '../assets/ui/wifi.svg?no-inline';
import ui_battery from '../assets/ui/battery.svg?no-inline';
import ui_control_center from '../assets/ui/control-center.svg?no-inline';
import ui_sun from '../assets/ui/sun.svg?no-inline';
import ui_moon from '../assets/ui/moon.svg?no-inline';
import ui_auto from '../assets/ui/auto.svg?no-inline';
import ui_message from '../assets/ui/message.svg?no-inline';
import ui_bell from '../assets/ui/bell.svg?no-inline';

import ui0 from '../assets/ui/folder.svg?no-inline';
import ui1 from '../assets/ui/file.svg?no-inline';
import ui2 from '../assets/ui/desktop.svg?no-inline';
import ui3 from '../assets/ui/apps.svg?no-inline';
import ui4 from '../assets/ui/trash.svg?no-inline';
import ui5 from '../assets/ui/gallery.svg?no-inline';
import ui6 from '../assets/ui/notes.svg?no-inline';
import ui7 from '../assets/ui/mail.svg?no-inline';
import ui8 from '../assets/ui/chevron-left.svg?no-inline';
import ui9 from '../assets/ui/chevron-right.svg?no-inline';
import ui10 from '../assets/ui/chevron-down.svg?no-inline';
import ui11 from '../assets/ui/grid.svg?no-inline';
import ui12 from '../assets/ui/list.svg?no-inline';
import ui13 from '../assets/ui/search.svg?no-inline';
import ui14 from '../assets/ui/info.svg?no-inline';
import ui15 from '../assets/ui/close.svg?no-inline';
import ui16 from '../assets/ui/external.svg?no-inline';
import ui17 from '../assets/ui/download.svg?no-inline';
import ui18 from '../assets/ui/send.svg?no-inline';
import ui19 from '../assets/ui/sidebar.svg?no-inline';
import ui20 from '../assets/ui/check.svg?no-inline';
import ui21 from '../assets/ui/person.svg?no-inline';
import ui22 from '../assets/ui/link.svg?no-inline';
import ui23 from '../assets/ui/restore.svg?no-inline';
import ui24 from '../assets/reference/brand.svg?no-inline';
import ui25 from '../assets/reference/folder.png?no-inline';

import desktopWallpaper from '../assets/wallpapers/desktop1.webp?no-inline';
import mobileWallpaper from '../assets/wallpapers/mobile.webp?no-inline';
import illustratorIcon from '../assets/dock/illustrator.svg?no-inline';
import photoshopIcon from '../assets/dock/photoshop.svg?no-inline';
import figmaIcon from '../assets/dock/figma.svg?no-inline';
import galleryIcon from '../assets/reference/gallery.png?no-inline';
import notesIcon from '../assets/reference/notes.png?no-inline';
import mailIcon from '../assets/reference/mail.png?no-inline';
import finderIcon from '../assets/reference/finder.png?no-inline';
import trashIcon from '../assets/reference/trash.png?no-inline';
import trashFullIcon from '../assets/dock/trash-full.png?no-inline';

const base = import.meta.env.BASE_URL;

// Dock assets supplied by you. Both PNG and SVG imports are supported.
// Replace the imports above to swap them; UI placeholders are mapped in uiIcons below.
// Set an app's icon to '' below to use its inline fallback instead.
const makeIcon = (glyph, start, end, ink = '#FFFFFF') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${start}"/><stop offset="1" stop-color="${end}"/>
    </linearGradient></defs>
    <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#g)"/>
    <rect x="2.5" y="2.5" width="59" height="59" rx="14.5" fill="none" stroke="#FFFFFF" stroke-opacity=".35"/>
    <path d="M15 10h24" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>
    <text x="32" y="43" text-anchor="middle" fill="${ink}" font-family="Arial, sans-serif" font-size="31" font-weight="700">${glyph}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const profile = {
  name: 'Perdana Kurniawan Arta',
  displayName: 'Perdana',
  role: 'Graphic & Visual Designer',
  location: 'Salatiga, Indonesia',
  menuLabel: 'Portfolio',
  spotlight: {
    title: 'Search portfolio', placeholder: 'Search projects and apps', empty: 'No matching projects or apps.',
    resultsLabel: 'Search results', application: 'Application', hint: '↑ ↓ to browse · Enter to open · Esc to close',
  },
  notifications: {
    label: 'Portfolio notifications', close: 'Dismiss notification', now: 'now',
    items: [
      { id: 'welcome', appId: 'mail', title: 'Perdana', message: 'Welcome to my website! Feel free to explore.', delay: 900, duration: 12000 },
      { id: 'bio', appId: 'notes', title: 'A little about me', message: 'Open Notes to read my bio, experience, and services.', action: 'notes', noteId: 'about', delay: 2100, duration: 18000 },
    ],
  },
  menuBar: {
    menusLabel: 'Portfolio menu', defaultApp: 'Finder',
    wifiLabel: 'Wi-Fi icon (visual indicator)', batteryLabel: 'Battery icon (visual indicator)',
    searchLabel: 'Search portfolio',
    windowsLabel: 'Open windows', noWindows: 'No open windows',
    menus: [
      { id: 'file', label: 'File', items: [ { label: 'Open Finder', action: 'finder' }, { label: 'View Gallery', action: 'gallery' }, { label: 'Contact Perdana', action: 'mail' } ] },
      { id: 'edit', label: 'Edit', secondary: true, items: [ { label: 'Find…', action: 'search', shortcut: '⌘ / Ctrl K' } ] },
      { id: 'view', label: 'View', items: [ { label: 'Hide Desktop Icons', showLabel: 'Show Desktop Icons', action: 'toggle-desktop-icons' }, { label: 'Show Desktop', action: 'desktop' } ] },
      { id: 'window', label: 'Window', items: [ { label: 'Minimize', action: 'minimize' }, { label: 'Zoom', action: 'zoom' }, { label: 'Close Window', action: 'close' } ] },
      { id: 'help', label: 'Help', secondary: true, items: [ { label: 'About Perdana', action: 'about' }, { label: 'Get in touch', action: 'mail' }, { label: 'Show welcome', action: 'welcome' } ] },
    ],
    brandIcon: 'brand',
    brandLabel: 'Perdana’s portfolio',
    locale: 'en-US',
    clockOptions: { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true },
    mobileClockOptions: { hour: 'numeric', minute: '2-digit', hour12: true },
  },
  notesApp: {
    title: 'Notes',
    sectionLabel: 'Portfolio',
    documentLabel: 'CV & experience',
    listLabel: 'Profile notes',
    foldersLabel: 'Folders', folderLabel: 'All Notes', search: 'Search notes',
    noteSingular: 'note', notePlural: 'notes', emptyMessage: 'No matching notes.',
  },
  galleryApp: {
    title: 'Gallery',
    libraryLabel: 'Library',
    allLabel: 'All Projects',
    collectionsLabel: 'Collections',
    subtitle: 'Selected design work',
    projectSingular: 'project',
    projectPlural: 'projects',
    emptyMessage: 'No projects in this collection yet.',
  },
  finderApp: {
    nameColumn: 'Name', kindColumn: 'Kind', yearColumn: 'Year',
    info: 'Get Info', infoTitle: 'Info', general: 'General', preview: 'Preview',
    selected: 'selected', imageCount: 'Images', dimensions: 'Dimensions', source: 'Location',
    title: 'Finder', sidebarLabel: 'Finder locations', favorites: 'Favorites',
    locations: { desktop: 'Desktop', projects: 'Projects', applications: 'Applications', trash: 'Trash' },
    locationSymbols: { desktop: '▣', projects: '▱', applications: '⊞', trash: '⌑' },
    kinds: { folder: 'Folder', app: 'Application', project: 'Design project' },
    viewLabel: 'View options',
    back: 'Back', forward: 'Forward', grid: 'Icons', list: 'List', search: 'Search this folder',
    pathLabel: 'Folder path', filesLabel: 'Folder contents', item: 'item', items: 'items',
    open: 'Open', moveToTrash: 'Move to Trash', emptyMessage: 'No items in this folder.',
  },
  trashApp: {
    title: 'Trash', description: 'Portfolio files in this tab’s virtual Trash.',
    restore: 'Put Back', restoreAll: 'Put Back All', empty: 'Empty Trash',
    emptyTitle: 'Trash is empty', emptyMessage: 'Projects moved to Trash will appear here.',
    confirmMessage: 'Empty the virtual Trash? These items will stay hidden for this tab session. Your source files are never deleted.',
    cancel: 'Cancel', confirmEmpty: 'Empty Trash',
  },
  ui: {
    clearSearch: 'Clear search', done: 'Done', to: 'To', subject: 'Subject',
    contactOptions: 'Contact options', compose: 'Contact Perdana',
    desktop: 'Design projects',
    dock: 'Skills and information',
    openProject: 'Open project',
    close: 'Close',
    minimize: 'Minimize',
    zoom: 'Zoom window',
    restore: 'Restore window',
    category: 'Category',
    year: 'Year',
    client: 'Client',
    tools: 'Tools',
    gallery: 'Project images',
    imageError: 'Image unavailable',
    swipeHint: 'Drag down from the header to close',
    resizeEdges: { n: 'Resize top', ne: 'Resize top right', e: 'Resize right', se: 'Resize bottom right',
      s: 'Resize bottom', sw: 'Resize bottom left', w: 'Resize left', nw: 'Resize top left' },
  },
  intro: '10+ years in visual design, with a focus on icons, branding, illustration, packaging, and social media visuals.',

  wallpaper: {
    // Replace the two imports above with your own WebP portraits.
    desktop: desktopWallpaper,
    mobile: mobileWallpaper,
    desktopPosition: '50% 42%',
    mobilePosition: '50% 35%',
    placeholderColor: '#DDD5CB',
  },

  // Empty URLs are hidden or disabled by the components in stage 3.
  cv: {
    label: 'Download CV',
    href: '', // `${base}cv/perdana-cv.pdf`
  },

  contact: {
    title: 'Let’s make something good.',
    message: 'Tell me what you’re working on, what you need, and when you need it. We can take it from there.',
    email: '', // Add your real email here.
    emailLabel: 'Email me',
    emailPlaceholder: 'Email will be added soon.',
    subject: 'Let’s work together',
    links: [
      { id: 'website', label: 'Website', href: 'https://perdanakun.com' },
      { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/perdanakun/' },
      { id: 'fiverr', label: 'Fiverr', href: '' },
      { id: 'dribbble', label: 'Dribbble', href: '' },
      { id: 'instagram', label: 'Instagram', href: '' },
    ],
  },
};

export const dockApps = [
  { id: 'finder', label: 'Finder', kind: 'finder', icon: finderIcon, fallbackIcon: makeIcon('F', '#9FD8FA', '#508CCB') },
  { id: 'illustrator', label: 'Illustrator', kind: 'skill', icon: illustratorIcon, fallbackIcon: makeIcon('V', '#FFCB88', '#D77838', '#43281C') },
  { id: 'photoshop', label: 'Photoshop', kind: 'skill', icon: photoshopIcon, fallbackIcon: makeIcon('P', '#78BFF4', '#3458B1') },
  { id: 'figma', label: 'Figma', kind: 'skill', icon: figmaIcon, fallbackIcon: makeIcon('F', '#CAA8F4', '#7C5AB3') },
  { id: 'gallery', label: 'Gallery', kind: 'gallery', dividerBefore: true, icon: galleryIcon, fallbackIcon: makeIcon('G', '#C4D8F5', '#7398D1', '#243B61') },
  { id: 'notes', label: 'Notes', kind: 'notes', icon: notesIcon, fallbackIcon: makeIcon('≡', '#FFF0A2', '#EBC958', '#604F25') },
  { id: 'mail', label: 'Mail', kind: 'mail', icon: mailIcon, fallbackIcon: makeIcon('@', '#94DAD2', '#3B989E') },
  { id: 'trash', label: 'Trash', kind: 'trash', dividerBefore: true, icon: trashIcon, fullIcon: trashFullIcon, fallbackIcon: makeIcon('⌑', '#E4E8EC', '#A3ABB4', '#45505C') },
];

export const skillDialogs = {
  illustrator: {
    title: 'Let me handle the curves.',
    context: '10+ years in visual design. Icons are my specialty.',
    message: 'You bring the idea. I’ll bring the careful curves, consistent icons, and a healthy obsession with the details. Ready to make something together?',
    secondaryLabel: 'Maybe later',
    primaryLabel: 'Hire me',
  },
  photoshop: {
    title: 'Your layers deserve some love.',
    context: 'Campaign visuals, image editing, and composition.',
    message: 'Another evening moving pixels? Let me take care of the visuals while you focus on your thing. Tell me what you have in mind.',
    secondaryLabel: 'I’ll keep tinkering',
    primaryLabel: 'Let’s talk',
  },
  figma: {
    title: 'Good ideas need a clear layout.',
    context: 'Visual systems, interface layouts, and prototypes.',
    message: 'From the first frame to the little details that hold everything together, I can help give your idea a clear visual direction. Shall we start?',
    secondaryLabel: 'Just looking',
    primaryLabel: 'Work with me',
  },
};

// Notes accept paragraphs (strings or inline { text, href } fragments), optional
// item links, and a links list. Missing URLs render as plain text.
export const notes = [
  {
    id: 'about', title: 'About me', summary: 'Visual design, icons, and a little about me.',
    paragraphs: [
      'Hi, I’m Perdana, a visual designer based in Salatiga, Indonesia.',
      'I’ve spent 10+ years in visual design. Iconography is my specialty, alongside branding, illustration, packaging, and social media visuals.',
      ['Find me on ', { text: 'LinkedIn', href: 'https://www.linkedin.com/in/perdanakun/' }, ' or visit ',
        { text: 'my website', href: 'https://perdanakun.com' }, '.'],
    ], items: [],
  },
  {
    id: 'experience', title: 'Experience', summary: 'Selected roles in visual design.', paragraphs: [],
    items: [
      { title: 'Visual Designer — Conania', meta: '2016–2026', description: '' },
      { title: 'Social Media Designer — Sinidikara', meta: '2019–2022', description: '' },
    ],
  },
  {
    id: 'education', title: 'Education', summary: 'Institut Kesenian Jakarta.', paragraphs: [],
    items: [{ title: 'Institut Kesenian Jakarta', meta: '2017–2021',
      description: 'Bachelor of Design, Visual Communication Design.' }],
  },
  {
    id: 'services', title: 'Services', summary: 'Icons, branding, illustration, and more.', paragraphs: [],
    items: [
      { title: 'Icon Design', description: 'Custom icons and consistent icon families.' },
      { title: 'Branding', description: 'Visual identities and brand applications.' },
      { title: 'Illustration', description: 'Characters and visual storytelling.' },
      { title: 'Packaging', description: 'Labels and packaging graphics.' },
      { title: 'Social Media', description: 'Campaign visuals and adaptable ad layouts.' },
    ],
  },
  {
    id: 'links', title: 'Links', summary: 'Website and social profiles.', paragraphs: [], items: [],
    links: profile.contact.links.filter(link => link.href),
  },
];

export const uiIcons = {
  'wifi': ui_wifi,
  'battery': ui_battery,
  'control-center': ui_control_center,
  'sun': ui_sun,
  'moon': ui_moon,
  'auto': ui_auto,
  'message': ui_message,
  'bell': ui_bell,

  'folder': ui0,
  'file': ui1,
  'desktop': ui2,
  'apps': ui3,
  'trash': ui4,
  'gallery': ui5,
  'notes': ui6,
  'mail': ui7,
  'chevron-left': ui8,
  'chevron-right': ui9,
  'chevron-down': ui10,
  'grid': ui11,
  'list': ui12,
  'search': ui13,
  'info': ui14,
  'close': ui15,
  'external': ui16,
  'download': ui17,
  'send': ui18,
  'sidebar': ui19,
  'check': ui20,
  'person': ui21,
  'link': ui22,
  'restore': ui23,
  'brand': ui24,
  'folder-color': ui25,
};
