// Replace an SVG import with your own WebP file; keep ?no-inline for separate, lazy-loaded assets.
import everydayIconsThumbnail from '../assets/projects/everyday-icons/thumbnail.svg?no-inline';
import everydayIconsVisual01 from '../assets/projects/everyday-icons/visual-01.svg?no-inline';
import everydayIconsVisual02 from '../assets/projects/everyday-icons/visual-02.svg?no-inline';

import wayfindingIconsThumbnail from '../assets/projects/wayfinding-icons/thumbnail.svg?no-inline';
import wayfindingIconsVisual01 from '../assets/projects/wayfinding-icons/visual-01.svg?no-inline';
import wayfindingIconsVisual02 from '../assets/projects/wayfinding-icons/visual-02.svg?no-inline';

import studioIdentityThumbnail from '../assets/projects/studio-identity/thumbnail.svg?no-inline';
import studioIdentityVisual01 from '../assets/projects/studio-identity/visual-01.svg?no-inline';
import studioIdentityVisual02 from '../assets/projects/studio-identity/visual-02.svg?no-inline';

import coffeeIdentityThumbnail from '../assets/projects/coffee-identity/thumbnail.svg?no-inline';
import coffeeIdentityVisual01 from '../assets/projects/coffee-identity/visual-01.svg?no-inline';
import coffeeIdentityVisual02 from '../assets/projects/coffee-identity/visual-02.svg?no-inline';

import characterStudiesThumbnail from '../assets/projects/character-studies/thumbnail.svg?no-inline';
import characterStudiesVisual01 from '../assets/projects/character-studies/visual-01.svg?no-inline';
import characterStudiesVisual02 from '../assets/projects/character-studies/visual-02.svg?no-inline';

import pantryPackagingThumbnail from '../assets/projects/pantry-packaging/thumbnail.svg?no-inline';
import pantryPackagingVisual01 from '../assets/projects/pantry-packaging/visual-01.svg?no-inline';
import pantryPackagingVisual02 from '../assets/projects/pantry-packaging/visual-02.svg?no-inline';

import campaignVisualsThumbnail from '../assets/projects/campaign-visuals/thumbnail.svg?no-inline';
import campaignVisualsVisual01 from '../assets/projects/campaign-visuals/visual-01.svg?no-inline';
import campaignVisualsVisual02 from '../assets/projects/campaign-visuals/visual-02.svg?no-inline';

import launchAdsThumbnail from '../assets/projects/launch-ads/thumbnail.svg?no-inline';
import launchAdsVisual01 from '../assets/projects/launch-ads/visual-01.svg?no-inline';
import launchAdsVisual02 from '../assets/projects/launch-ads/visual-02.svg?no-inline';

export const projects = [
  {
    id: 'everyday-icons',
    title: 'Everyday Icons',
    category: 'Icon Design',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator'],
    description: 'Placeholder for a cohesive icon family. Replace with a short description of the brief and your contribution.',
    thumbnail: everydayIconsThumbnail,
    images: [
      { src: everydayIconsVisual01, alt: 'Placeholder for an overview of the icon family', width: 1600, height: 1200 },
      { src: everydayIconsVisual02, alt: 'Placeholder for icon details and small-size examples', width: 1600, height: 1000 },
    ],
    // Center of the thumbnail, as a percentage of the viewport.
    // Desktop clamps the whole thumbnail between the menu bar and dock.
    position: { x: 13, y: 20 },
    rotate: -3,
    size: 'm',
  },
  {
    id: 'wayfinding-icons',
    title: 'Wayfinding Icons',
    category: 'Icon Design',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator'],
    description: 'Placeholder for a wayfinding symbol system. Add the intended setting, design approach, and deliverables.',
    thumbnail: wayfindingIconsThumbnail,
    images: [
      { src: wayfindingIconsVisual01, alt: 'Placeholder for a wayfinding symbol system', width: 1600, height: 1200 },
      { src: wayfindingIconsVisual02, alt: 'Placeholder for symbols applied to signs', width: 1600, height: 1000 },
    ],
    position: { x: 28, y: 43 },
    rotate: 2,
    size: 's',
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
    position: { x: 12, y: 67 },
    rotate: -2,
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
    position: { x: 29, y: 79 },
    rotate: 3,
    size: 's',
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
    position: { x: 74, y: 20 },
    rotate: 3,
    size: 'm',
  },
  {
    id: 'pantry-packaging',
    title: 'Pantry Packaging',
    category: 'Packaging',
    year: '2026',
    client: 'Placeholder project',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    description: 'Placeholder for a packaging family. Add the product, design concept, and packaging formats you delivered.',
    thumbnail: pantryPackagingThumbnail,
    images: [
      { src: pantryPackagingVisual01, alt: 'Placeholder for a packaging family presentation', width: 1600, height: 1200 },
      { src: pantryPackagingVisual02, alt: 'Placeholder for packaging labels and typography details', width: 1600, height: 1000 },
    ],
    position: { x: 88, y: 43 },
    rotate: -3,
    size: 's',
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
    position: { x: 73, y: 65 },
    rotate: 2,
    size: 'l',
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
    position: { x: 89, y: 79 },
    rotate: -2,
    size: 'm',
  },
];
