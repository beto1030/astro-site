# 🚀 Astro + GitHub Pages Workflow Guide

This guide shows step by step how to create an **Astro project** from scratch, configure it for **GitHub Pages**, and use tools like **grep**, **sed**, and **gh** (GitHub CLI) to debug and verify your build.

---

## 🧪 Daily Dev Mode Workflow (Local)

Use this flow while actively building features locally. It keeps links correct in dev **and** on GitHub Pages.

### 0) Start the dev server
```bash
npm --prefix abo-study run dev
# open http://localhost:4321
```

### 1) Verify base-aware links
You're using a `<base>` tag in the main layout to make relative links work under `/` locally and `/REPO_NAME/` in CI:

`abo-study/src/layouts/BaseLayout.astro`
```astro
<head>
  <base href={import.meta.env.BASE_URL} />
</head>
```
Navigation uses **relative links** (no leading `/`):
```astro
<a href="">Home</a>
<a href="topics/">Topics</a>
<a href="about/">About</a>
```
- Dev (local): resolves to `/`, `/topics/`, `/about/`
- GitHub Pages: resolves to `/astro-site/`, `/astro-site/topics/`, `/astro-site/about/`

### 2) Check for root-absolute links in source (catch early)
```bash
grep -RIn --include='*.astro' --include='*.md' 'href="/' abo-study/src
grep -RIn --include='*.astro' --include='*.md' 'src="/'  abo-study/src
# If any results appear, fix to relative: href="topics/", src="images/logo.svg", etc.
```

### 3) Hot-reload, console checks, and 404s
- Keep the browser console open while developing.
- If you see 404s for assets or pages, it’s almost always a leading `/` in a URL.
- Fix the source and the dev server hot-reloads automatically.

### 4) Optional: simulate production locally during dev
If you want to preview exactly what GitHub Pages will serve (without pushing):
```bash
CI=1 npm --prefix abo-study run build
npx --yes serve abo-study/dist
```
Now check navigation and assets in the static build.

### 5) Commit as you go (clean history)
```bash
git add -A
git commit -m "feat: add Topics page and nav"
```

### 6) Run a quick checklist before pushing
```bash
# Search for any leftover dangerous links
grep -RIn --include='*.astro' --include='*.md' 'href="/' abo-study/src || echo "OK"
grep -RIn --include='*.astro' --include='*.md' 'src="/'  abo-study/src || echo "OK"

# (If skipping <base> and using BASE_URL in .astro)
grep -RIn '\{`import.meta.env.BASE_URL`' abo-study/src && echo "Fix these!" || echo "OK"
```

---

## 0) Prereqs (one-time)

```bash
node -v             # v20+ recommended
gh --version        # GitHub CLI
gh auth login       # log in to GitHub.com
```

---

## 1) Create the project (monorepo-style: root + `abo-study/`)

```bash
mkdir astro-site && cd astro-site
git init -b main

# Create Astro app in subfolder
npm create astro@latest abo-study -- --template minimal
cd abo-study
npm install
cd ..
```

---

## 2) Add Tailwind (official integration)

```bash
cd abo-study
npx astro add tailwind
cd ..
```

---

## 3) Add a base-safe layout + nav

`abo-study/src/layouts/BaseLayout.astro`

```astro
---
import '../styles/global.css';
const { title = 'My Astro Site' } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <base href={import.meta.env.BASE_URL} />
  </head>
  <body class="max-w-3xl mx-auto p-6">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">My Astro Site</h1>
      <nav class="flex gap-4 mt-2">
        <a href="">Home</a>
        <a href="topics/">Topics</a>
        <a href="about/">About</a>
      </nav>
    </header>
    <main><slot /></main>
    <footer class="mt-10 text-sm text-zinc-500">© You</footer>
  </body>
</html>
```

---

## 4) Astro config for GitHub Pages

`abo-study/astro.config.ts`

```ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.CI ? '/astro-site/' : '/',
  site: 'https://<YOUR_USERNAME>.github.io/astro-site/',
  trailingSlash: 'always',
});
```

---

## 5) Sanity checks while you develop

```bash
npm --prefix abo-study run dev
```

Check for root-absolute links (should be none):

```bash
grep -RIn --include='*.astro' --include='*.md' 'href="/' abo-study/src
grep -RIn --include='*.astro' --include='*.md' 'src="/'  abo-study/src
```

---

## 6) Simulate the CI/Pages build locally

```bash
CI=1 npm --prefix abo-study run build
npx --yes serve abo-study/dist
```

Inspect links:

```bash
grep -oRIn 'href="[^"]*topics[^"]*"' abo-study/dist | head -n 20 | sed G
```

---

## 7) Commit and create the GitHub repo with `gh`

```bash
git add -A
git commit -m "Initial Astro site with base-safe layout"

USER="$(gh api user --jq .login)"
gh repo create astro-site --public --source=. --push

git remote -v
gh repo view --web
```

---

## 8) GitHub Actions workflow for Pages

`.github/workflows/deploy.yml`

```yaml
name: Deploy abo-study to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: abo-study/package-lock.json

      - name: Install deps
        working-directory: abo-study
        run: npm ci

      - name: Build (SSG)
        working-directory: abo-study
        env:
          NODE_ENV: production
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: abo-study/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 9) Enable Pages + trigger the deploy

- Repo **Settings → Pages → Source = GitHub Actions**
- Push a change:

```bash
echo "<!-- redeploy -->" >> abo-study/src/pages/index.astro
git add -A && git commit -m "Trigger deploy" && git push
```

Watch the run:

```bash
gh run list --limit 1
gh run view --log
```

---

## 10) Inspect deployed artifact (if needed)

```bash
RUN_ID="$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')"
gh run download "$RUN_ID" -n github-pages -D /tmp/pages-artifact

grep -RIn 'href="[^"]*topics' /tmp/pages-artifact | head -n 20 | sed G
```

---

## 11) Bulk-fix helpers

```bash
# Add blank lines between results
grep -RIn 'href="[^"]*topics' abo-study/dist | head -n 10 | sed G

# Wrap long lines
grep -RIn 'href="[^"]*topics' abo-study/dist | fold -s -w 120 | sed G
```

For `.astro/.html` only, auto-replace root-absolute links:

```bash
find abo-study/src -type f \( -name "*.astro" -o -name "*.html" \) -exec \
  sed -i '' 's|href="/|href={`${import.meta.env.BASE_URL}|g' {} +

find abo-study/src -type f \( -name "*.astro" -o -name "*.html" \) -exec \
  sed -i '' 's|src="/|src={`${import.meta.env.BASE_URL}|g' {} +
```

---

## 🔄 Debugging Playbook

1. **Build like CI**
   ```bash
   CI=1 npm --prefix abo-study run build
   ```

2. **Check for bad links**
   ```bash
   grep -RIn '\{`import.meta.env.BASE_URL`' abo-study/dist | head -n 20 | sed G
   ```

3. **Check expected /astro-site/ links**
   ```bash
   grep -RIn 'href="[^"]*topics' abo-study/dist | head -n 10 | sed G
   ```

4. **Preview dist locally**
   ```bash
   npx --yes serve abo-study/dist
   ```

5. **Commit & push to deploy**
   ```bash
   git add -A
   git commit -m "Fix links for GitHub Pages"
   git push
   ```

6. **Inspect Actions logs**
   ```bash
   gh run list --limit 1
   gh run view --log
   gh run rerun --failed
   ```

