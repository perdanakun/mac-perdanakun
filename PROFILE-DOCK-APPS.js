// Replace only dockApps in src/data/profile.js; keep your imports, makeIcon, and other profile data.
export const dockApps = [
  { id: 'illustrator', label: 'Illustrator', kind: 'skill', icon: illustratorIcon, iconScale: 1, fallbackIcon: makeIcon('V', '#FFCB88', '#D77838', '#43281C') },
  { id: 'photoshop', label: 'Photoshop', kind: 'skill', icon: photoshopIcon, iconScale: 1, fallbackIcon: makeIcon('P', '#78BFF4', '#3458B1') },
  { id: 'figma', label: 'Figma', kind: 'skill', icon: figmaIcon, iconScale: 1, fallbackIcon: makeIcon('F', '#CAA8F4', '#7C5AB3') },
  { id: 'gallery', label: 'Gallery', kind: 'gallery', dividerBefore: true, icon: galleryIcon, iconScale: 1, fallbackIcon: makeIcon('G', '#C4D8F5', '#7398D1', '#243B61') },
  { id: 'notes', label: 'Notes', kind: 'notes', icon: notesIcon, iconScale: 1, fallbackIcon: makeIcon('≡', '#FFF0A2', '#EBC958', '#604F25') },
  { id: 'mail', label: 'Mail', kind: 'mail', icon: mailIcon, iconScale: 1, fallbackIcon: makeIcon('@', '#94DAD2', '#3B989E') },
];
