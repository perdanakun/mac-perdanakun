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

import studioIdentityThumbnail from '../assets/projects/studio-identity/thumbnail.svg?no-inline';
import studioIdentityVisual01 from '../assets/projects/studio-identity/visual-01.svg?no-inline';
import studioIdentityVisual02 from '../assets/projects/studio-identity/visual-02.svg?no-inline';

import coffeeIdentityThumbnail from '../assets/projects/coffee-identity/thumbnail.svg?no-inline';
import coffeeIdentityVisual01 from '../assets/projects/coffee-identity/visual-01.svg?no-inline';
import coffeeIdentityVisual02 from '../assets/projects/coffee-identity/visual-02.svg?no-inline';

import characterStudiesThumbnail from '../assets/projects/character-studies/beyou3.webp?no-inline';
import characterStudiesVisual01 from '../assets/projects/character-studies/beyou1.webp?no-inline';
import characterStudiesVisual02 from '../assets/projects/character-studies/beyou2.webp?no-inline';

import mandiri1 from '../assets/projects/bank-mandiri/mandiri1.webp?no-inline';
import mandiri2 from '../assets/projects/bank-mandiri/mandiri2.webp?no-inline';
import mandiri3 from '../assets/projects/bank-mandiri/mandiri3.webp?no-inline';

import campaignVisualsThumbnail from '../assets/projects/campaign-visuals/thumbnail.svg?no-inline';
import campaignVisualsVisual01 from '../assets/projects/campaign-visuals/visual-01.svg?no-inline';
import campaignVisualsVisual02 from '../assets/projects/campaign-visuals/visual-02.svg?no-inline';

import launchAdsThumbnail from '../assets/projects/launch-ads/thumbnail.svg?no-inline';
import launchAdsVisual01 from '../assets/projects/launch-ads/visual-01.svg?no-inline';
import launchAdsVisual02 from '../assets/projects/launch-ads/visual-02.svg?no-inline';

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
    title: 'Studio Identity',
    category: 'Branding',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    description: 'Placeholder for a brand identity. Summarize the business, the visual direction, and your role in one or two sentences.',
    thumbnail: studioIdentityThumbnail,
    images: [
      { src: studioIdentityVisual01, alt: 'Placeholder for a brand identity overview', width: 1600, height: 1200 },
      { src: studioIdentityVisual02, alt: 'Placeholder for brand identity applications', width: 1600, height: 1000 },
    ],
    position: { x: 12, y: 58 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'coffee-identity',
    title: 'Coffee Identity',
    category: 'Branding',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    description: 'Placeholder for a coffee brand identity. Replace with the concept and the visual assets you designed.',
    thumbnail: coffeeIdentityThumbnail,
    images: [
      { src: coffeeIdentityVisual01, alt: 'Placeholder for a coffee brand identity', width: 1600, height: 1200 },
      { src: coffeeIdentityVisual02, alt: 'Placeholder for typography, color, and brand details', width: 1600, height: 1000 },
    ],
    position: { x: 12, y: 78 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'character-studies',
    title: 'Character Studies',
    category: 'Illustration',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator'],
    description: 'Placeholder for a character illustration collection. Describe the personality, style, and intended use.',
    thumbnail: characterStudiesThumbnail,
    images: [
      { src: characterStudiesVisual01, alt: 'Placeholder for a collection of character illustrations', width: 1600, height: 1200 },
      { src: characterStudiesVisual02, alt: 'Placeholder for a portrait-format character expression sheet', width: 1200, height: 1500 },
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
    title: 'Campaign Visuals',
    category: 'Social Media Ads',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    description: 'Placeholder for a social campaign. Describe the message, audience, and visual system across placements.',
    thumbnail: campaignVisualsThumbnail,
    images: [
      { src: campaignVisualsVisual01, alt: 'Placeholder for a social media campaign overview', width: 1600, height: 1200 },
      { src: campaignVisualsVisual02, alt: 'Placeholder for portrait-format social ad variations', width: 1200, height: 1500 },
    ],
    position: { x: 88, y: 58 },
    rotate: 0,
    size: 'm',
  },
  {
    id: 'launch-ads',
    title: 'Launch Ads',
    category: 'Social Media Ads',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Photoshop', 'Figma'],
    description: 'Placeholder for a product launch campaign. Replace with the brief and your contribution to the launch visuals.',
    thumbnail: launchAdsThumbnail,
    images: [
      { src: launchAdsVisual01, alt: 'Placeholder for product launch advertising visuals', width: 1600, height: 1200 },
      { src: launchAdsVisual02, alt: 'Placeholder for launch campaign layout variations', width: 1600, height: 1000 },
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
