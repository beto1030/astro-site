import { defineConfig } from 'astro/config';

export default defineConfig({
  // If deploying to https://USERNAME.github.io/REPO_NAME
  base: process.env.CI ? '/astro-site/' : '/',
  site: 'https://beto1030.github.io/astro-site/', // optional but recommended
  // Optional but recommended:
  // Astro defaults to SSG; no need to set output unless you changed it.
});

