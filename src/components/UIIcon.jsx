import { uiIcons } from '../data/profile.js';

// Asset names and imports live in profile.js so every placeholder can be swapped.
export default function UIIcon({ name, size = 18, className = '' }) {
  const src = uiIcons[name] || uiIcons.file;
  return <img className={`ui-icon ${className}`} src={src} width={size} height={size}
    alt="" aria-hidden="true" draggable="false" />;
}
