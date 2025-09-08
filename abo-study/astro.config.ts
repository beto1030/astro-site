import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.CI ? '/astro-site/' : '/',
  site: 'https://beto1030.github.io/astro-site/',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});

