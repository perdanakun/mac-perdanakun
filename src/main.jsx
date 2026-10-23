import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './design-tokens.css';
import './styles.css';
import './reference-ui.css';

// Apply the only supported palette before React's first frame.
document.documentElement.dataset.theme = 'light';
document.documentElement.style.colorScheme = 'light';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f6f6f6');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
