// Replace an SVG import with your own WebP file; keep ?no-inline for separate, lazy-loaded assets.
import everydayIconsThumbnail from '../assets/projects/everyday-icons/thumbnail.svg?no-inline';
import everydayIconsVisual01 from '../assets/projects/everyday-icons/visual-01.svg?no-inline';
import everydayIconsVisual02 from '../assets/projects/everyday-icons/visual-02.svg?no-inline';

import scp1 from '../assets/projects/scp/scp2.webp?no-inline';
import scp2 from '../assets/projects/scp/scp1.webp?no-inline';
import scp3 from '../assets/projects/scp/scp3.webp?no-inline';
import scp4 from '../assets/projects/scp/scp4.webp?no-inline';
import scp5 from '../assets/projects/scp/scp5.webp?no-inline';
import scp6 from '../assets/projects/scp/scp6.webp?no-inline';
import scp7 from '../assets/projects/scp/scp7.webp?no-inline';
import scp8 from '../assets/projects/scp/scp8.webp?no-inline';

import mandiri1 from '../assets/projects/bank-mandiri/mandiri1.webp?no-inline';
import mandiri2 from '../assets/projects/bank-mandiri/mandiri2.webp?no-inline';
import mandiri3 from '../assets/projects/bank-mandiri/mandiri3.webp?no-inline';

import batavia1 from '../assets/projects/batavia/batavia-01.webp?no-inline';
import batavia2 from '../assets/projects/batavia/batavia-02.webp?no-inline';
import batavia3 from '../assets/projects/batavia/batavia-03.webp?no-inline';
import batavia4 from '../assets/projects/batavia/batavia-04.webp?no-inline';
import mariebiscuit1 from '../assets/projects/marie-biscuit/marie-biscuit-01.webp?no-inline';
import mariebiscuit2 from '../assets/projects/marie-biscuit/marie-biscuit-02.webp?no-inline';
import mariebiscuit3 from '../assets/projects/marie-biscuit/marie-biscuit-03.webp?no-inline';
import mariebiscuit4 from '../assets/projects/marie-biscuit/marie-biscuit-04.webp?no-inline';
import mariebiscuit5 from '../assets/projects/marie-biscuit/marie-biscuit-05.webp?no-inline';
import mariebiscuit6 from '../assets/projects/marie-biscuit/marie-biscuit-06.webp?no-inline';
import mariebiscuit7 from '../assets/projects/marie-biscuit/marie-biscuit-07.webp?no-inline';
import mariebiscuit8 from '../assets/projects/marie-biscuit/marie-biscuit-08.webp?no-inline';
import beyou1 from '../assets/projects/be-you/be-you-01.webp?no-inline';
import beyou2 from '../assets/projects/be-you/be-you-02.webp?no-inline';
import beyou3 from '../assets/projects/be-you/be-you-03.webp?no-inline';
import covid191 from '../assets/projects/covid-19/covid-19-01.webp?no-inline';
import covid192 from '../assets/projects/covid-19/covid-19-02.webp?no-inline';
import covid193 from '../assets/projects/covid-19/covid-19-03.webp?no-inline';
import visualdesign1 from '../assets/projects/visual-design/visual-design-01.webp?no-inline';
import visualdesign2 from '../assets/projects/visual-design/visual-design-02.webp?no-inline';
import visualdesign3 from '../assets/projects/visual-design/visual-design-03.webp?no-inline';
import visualdesign4 from '../assets/projects/visual-design/visual-design-04.webp?no-inline';
import visualdesign5 from '../assets/projects/visual-design/visual-design-05.webp?no-inline';
import visualdesign6 from '../assets/projects/visual-design/visual-design-06.webp?no-inline';
import visualdesign7 from '../assets/projects/visual-design/visual-design-07.webp?no-inline';

// Existing IDs keep desktop positions and session references stable.
const starterProjects = [
  {
    id: 'mayora',
    title: 'Mayora',
    category: 'Social Media Design, Graphic Design, Branding',
    categories: ['Social Media Design', 'Graphic Design', 'Branding'],
    year: '',
    client: 'Mayora',
    tools: [],
    description: '',
    thumbnail: everydayIconsThumbnail,
    images: [
      { src: everydayIconsVisual01, alt: 'Placeholder for an overview of the icon family', width: 1600, height: 1200 },
      { src: everydayIconsVisual02, alt: 'Placeholder for icon details and small-size examples', width: 1600, height: 1000 },
    ],
    // Center of the thumbnail, as a percentage of the viewport.
    // Desktop clamps the whole thumbnail to the viewport edges.
    position: { x: 12, y: 18 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'sustainability-coconut-partnership',
    title: 'Sustainability Coconut Partnership',
    category: 'Event Graphic Design, Merchandise, Brand Identity',
    categories: ['Event Graphic Design', 'Merchandise', 'Brand Identity'],
    year: '',
    client: 'Sustainability Coconut Partnership',
    tools: [],
    description: '',
    thumbnail: scp1,
    images: [
      { src: scp1, alt: 'Sustainability Coconut Partnership — slide 1', width: 1920, height: 1080 },
      { src: scp2, alt: 'Sustainability Coconut Partnership — slide 2', width: 1920, height: 1080 },
      { src: scp3, alt: 'Sustainability Coconut Partnership — slide 3', width: 1920, height: 1080 },
      { src: scp4, alt: 'Sustainability Coconut Partnership — slide 4', width: 1920, height: 1080 },
      { src: scp5, alt: 'Sustainability Coconut Partnership — slide 5', width: 1920, height: 1080 },
      { src: scp6, alt: 'Sustainability Coconut Partnership — slide 6', width: 1920, height: 1080 },
      { src: scp7, alt: 'Sustainability Coconut Partnership — slide 7', width: 1920, height: 1080 },
      { src: scp8, alt: 'Sustainability Coconut Partnership — slide 8', width: 1920, height: 1080 },
    ],
    position: { x: 12, y: 38 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'studio-identity',
    title: 'Batavia',
    category: 'Editorial Design, Graphic Design',
    categories: ['Editorial Design', 'Graphic Design'],
    year: '',
    client: '',
    tools: [],
    description: 'Editorial layouts and photographic spreads for the Batavia book.',
    thumbnail: batavia1,
    images: [
      { src: batavia1, alt: 'Batavia — slide 1', width: 1920, height: 1080 },
      { src: batavia2, alt: 'Batavia — slide 2', width: 1920, height: 1080 },
      { src: batavia3, alt: 'Batavia — slide 3', width: 1920, height: 1080 },
      { src: batavia4, alt: 'Batavia — slide 4', width: 1920, height: 1080 },
    ],
    position: { x: 12, y: 58 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'coffee-identity',
    title: 'Marie Biscuit',
    category: 'Character Design, Branding, Packaging Design',
    categories: ['Character Design', 'Branding', 'Packaging Design'],
    year: '',
    client: '',
    tools: [],
    description: 'Character designs and their applications across packaging, merchandise, and campaign visuals.',
    thumbnail: mariebiscuit1,
    images: [
      { src: mariebiscuit1, alt: 'Marie Biscuit — slide 1', width: 1920, height: 1080 },
      { src: mariebiscuit2, alt: 'Marie Biscuit — slide 2', width: 1920, height: 1080 },
      { src: mariebiscuit3, alt: 'Marie Biscuit — slide 3', width: 1920, height: 1080 },
      { src: mariebiscuit4, alt: 'Marie Biscuit — slide 4', width: 1920, height: 1080 },
      { src: mariebiscuit5, alt: 'Marie Biscuit — slide 5', width: 1920, height: 1080 },
      { src: mariebiscuit6, alt: 'Marie Biscuit — slide 6', width: 1920, height: 1080 },
      { src: mariebiscuit7, alt: 'Marie Biscuit — slide 7', width: 1920, height: 1080 },
      { src: mariebiscuit8, alt: 'Marie Biscuit — slide 8', width: 1920, height: 1080 },
    ],
    position: { x: 12, y: 78 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'character-studies',
    title: 'Be You',
    category: 'Campaign Design, Graphic Design',
    categories: ['Campaign Design', 'Graphic Design'],
    year: '',
    client: '',
    tools: [],
    description: 'A campaign presented through posters and public transit advertising mockups.',
    thumbnail: beyou1,
    images: [
      { src: beyou1, alt: 'Be You — slide 1', width: 1920, height: 1080 },
      { src: beyou2, alt: 'Be You — slide 2', width: 1920, height: 1080 },
      { src: beyou3, alt: 'Be You — slide 3', width: 1920, height: 1080 },
    ],
    position: { x: 88, y: 18 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'bank-mandiri',
    title: 'Bank Mandiri',
    category: 'Environment Graphic Design',
    categories: ['Environment Graphic Design'],
    year: '',
    client: 'Bank Mandiri',
    tools: [],
    description: '',
    thumbnail: mandiri1,
    images: [
      { src: mandiri1, alt: 'Bank Mandiri — slide 1', width: 1920, height: 1080 },
      { src: mandiri2, alt: 'Bank Mandiri — slide 2', width: 1920, height: 1080 },
      { src: mandiri3, alt: 'Bank Mandiri — slide 3', width: 1920, height: 1080 },
    ],
    position: { x: 88, y: 38 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'campaign-visuals',
    title: 'COVID-19 Campaign',
    category: 'Campaign Design, Graphic Design',
    categories: ['Campaign Design', 'Graphic Design'],
    year: '',
    client: '',
    tools: [],
    description: 'Public health campaign visuals, outdoor advertising, and supporting collateral.',
    thumbnail: covid191,
    images: [
      { src: covid191, alt: 'COVID-19 Campaign — slide 1', width: 1920, height: 1080 },
      { src: covid192, alt: 'COVID-19 Campaign — slide 2', width: 1920, height: 1080 },
      { src: covid193, alt: 'COVID-19 Campaign — slide 3', width: 1920, height: 1080 },
    ],
    position: { x: 88, y: 58 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'launch-ads',
    title: 'Visual Design Collection',
    category: 'Graphic Design, Illustration',
    categories: ['Graphic Design', 'Illustration'],
    year: '',
    client: '',
    tools: [],
    description: 'A collection of posters, illustrations, social media visuals, and layout studies.',
    thumbnail: visualdesign1,
    images: [
      { src: visualdesign1, alt: 'Visual Design Collection — slide 1', width: 1920, height: 1080 },
      { src: visualdesign2, alt: 'Visual Design Collection — slide 2', width: 1920, height: 1080 },
      { src: visualdesign3, alt: 'Visual Design Collection — slide 3', width: 1920, height: 1080 },
      { src: visualdesign4, alt: 'Visual Design Collection — slide 4', width: 1920, height: 1080 },
      { src: visualdesign5, alt: 'Visual Design Collection — slide 5', width: 1920, height: 1080 },
      { src: visualdesign6, alt: 'Visual Design Collection — slide 6', width: 1920, height: 1080 },
      { src: visualdesign7, alt: 'Visual Design Collection — slide 7', width: 1920, height: 1080 },
    ],
    position: { x: 88, y: 78 },
    rotate: 0,
    size: 'm',
  },
];

// Drop mayora (0).webp … mayora (8).webp anywhere under src/assets.
// URLs are emitted by Vite and respect VITE_BASE. No missing-file requests.
const webpAssets = import.meta.glob('../assets/**/*.webp', {
  eager: true, query: '?url&no-inline', import: 'default',
});
const mayoraSlides = Object.entries(webpAssets)
  .map(([path, src]) => ({ match: path.match(/(?:^|\/)mayora\s*\((\d+)\)\.webp$/i), src }))
  .filter(item => item.match)
  .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
  .map(({ src, match }) => ({ src, alt: `Mayora — page ${Number(match[1]) + 1}`, width: 1920, height: 1080 }));

export const projectCategories = project => project.categories || [project.category];

// Replace Mayora's starter artwork in place; never add a duplicate desktop item.
export const projects = starterProjects.map(project => project.id === 'mayora' && mayoraSlides.length
  ? { ...project, thumbnail: mayoraSlides[0].src, images: mayoraSlides }
  : project);
