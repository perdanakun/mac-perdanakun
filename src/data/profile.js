import desktopWallpaper from '../assets/wallpapers/desktop.webp?no-inline';
import mobileWallpaper from '../assets/wallpapers/mobile.webp?no-inline';
import illustratorIcon from '../assets/dock/illustrator.svg?no-inline';
import photoshopIcon from '../assets/dock/photoshop.svg?no-inline';
import figmaIcon from '../assets/dock/figma.svg?no-inline';
import galleryIcon from '../assets/dock/gallery.svg?no-inline';
import notesIcon from '../assets/dock/notes.svg?no-inline';
import mailIcon from '../assets/dock/mail.png?no-inline';
import finderIcon from '../assets/dock/finder.png?no-inline';
import trashIcon from '../assets/dock/trash.png?no-inline';
import trashFullIcon from '../assets/dock/trash-full.png?no-inline';

const base = import.meta.env.BASE_URL;

// Original letter icons, not official product logos.
// Replace src/assets/dock/*.svg with your own icons using the same filenames.
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
  menuBar: {
    locale: 'en-GB',
    clockOptions: { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false },
  },
  notesApp: {
    title: 'Notes',
    sectionLabel: 'Portfolio',
    documentLabel: 'CV & experience',
    listLabel: 'Profile notes',
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
    title: 'Finder', sidebarLabel: 'Finder locations', favorites: 'Favorites',
    locations: { desktop: 'Desktop', projects: 'Projects', applications: 'Applications', trash: 'Trash' },
    locationSymbols: { desktop: '▣', projects: '▱', applications: '⊞', trash: '⌑' },
    kinds: { folder: 'Folder', app: 'Application', project: 'Design project' },
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

// A single note renderer can display paragraphs and optional structured items.
// Edit or replace this starter copy with your final portfolio text.
export const notes = [
  {
    id: 'about',
    title: 'About',
    paragraphs: [
      'Hi, I’m Perdana, a graphic and visual designer based in Salatiga, Indonesia.',
      'I’ve spent 10+ years working in visual design. Iconography is my specialty, alongside branding, illustration, packaging, and social media visuals.',
      'Add a short paragraph about how you work and the kinds of projects you want to take on.',
    ],
    items: [],
  },
  {
    id: 'experience',
    title: 'Experience',
    paragraphs: ['A few selected chapters from my design practice.'],
    items: [
      {
        title: 'Visual Designer — Conania',
        meta: '2016–2026',
        description: 'Add 2–3 specific responsibilities or achievements from your visual design work.',
      },
      {
        title: 'Social Media Designer — Sinidikara',
        meta: '2019–2022',
        description: 'Add the types of campaigns, content formats, or visual systems you worked on.',
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    paragraphs: [],
    items: [
      {
        title: 'Institut Kesenian Jakarta',
        meta: 'Visual Communication Design · 2017–2021',
        description: 'Bachelor of Design. Add relevant coursework or distinctions if useful.',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    paragraphs: ['Visual design support for brands, products, and campaigns.'],
    items: [
      { title: 'Icon Design', meta: '', description: 'Custom icons and consistent icon families.' },
      { title: 'Branding', meta: '', description: 'Visual identities and brand applications.' },
      { title: 'Illustration', meta: '', description: 'Characters, spot illustrations, and visual storytelling.' },
      { title: 'Packaging', meta: '', description: 'Labels, packaging graphics, and product families.' },
      { title: 'Social Media Ads', meta: '', description: 'Campaign visuals and adaptable ad layouts.' },
    ],
  },
  {
    id: 'clients',
    title: 'Clients',
    paragraphs: ['Add selected client names and a brief line about the work here.'],
    items: [],
  },
];
