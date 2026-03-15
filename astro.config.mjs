// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  build: {
    // This tells Astro to inline small CSS files (usually < 4kb, 
    // but you can adjust or set to 'always' to force it)
    inlineStylesheets: 'auto', 
  },
  vite: {
    ssr: {
      noExternal: ['piccolore'],
    },
  },
});