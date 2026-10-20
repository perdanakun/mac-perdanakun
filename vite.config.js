import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const basePath = (env.VITE_BASE || '/').trim().replace(/^\/+|\/+$/g, '');

  return {
    plugins: [react()],
    // Accept both "designer" and "/designer/"; default to the subdomain root.
    base: basePath ? `/${basePath}/` : '/',
  };
});
