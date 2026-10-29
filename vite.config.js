import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioApi } from './server/dev-api.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = (env.VITE_BASE || '/').trim().replace(/^\/+|\/+$/g, '');

  return {
    plugins: [react(), portfolioApi(env)],
    // Accept both "designer" and "/designer/"; default to the subdomain root.
    base: basePath ? `/${basePath}/` : '/',
  };
});
