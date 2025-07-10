// filepath: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/1forall/', // Set this to your repo name for GitHub Pages
});