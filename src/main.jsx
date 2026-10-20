import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { profile } from './data/profile.js';
import { readAppearance, resolveAppearance } from './utils/appearance.js';
import './styles.css';

// Resolve before mounting so the first app frame uses the correct palette.
let appearanceMode = 'auto';
try { appearanceMode = readAppearance(window.localStorage); } catch { /* Storage may be unavailable. */ }
document.documentElement.dataset.theme = resolveAppearance(appearanceMode, new Date(), profile.appearance);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
