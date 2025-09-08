import { defineConfig } from 'astro/config';

export default defineConfig({
  // If deploying to https://USERNAME.github.io/REPO_NAME
  base: process.env.CI ? '/astro-site/' : '/',
  // Optional but recommended:
  // site: 'https://USERNAME.github.io/REPO_NAME',
  // Astro defaults to SSG; no need to set output unless you changed it.
});

