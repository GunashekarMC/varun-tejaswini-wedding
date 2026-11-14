# Varun & Tejaswini — Auto-Deploy Wedding Website

This project merges your **Sprint CI/CD demo** with the latest **Varun & Tejaswini wedding invitation**.

## Folder to edit

`site/` is the source of the live wedding website.

- `site/index.html` — main wedding page
- `site/styles.css` — styles
- `site/script.js` — browser interactions
- `site/data/photos/` — photography
- `site/data/videos/` — all wedding videos, including the lakeside opening
- `site/data/posters/` — video poster images
- `site/assets/` — icons and calendar invites

Keep the contents **directly inside** `site/`. Do not put a second nested `varun-tejaswini-wedding/` folder inside `site/`.

## Important

The original demo's `scripts/build.mjs` generated a placeholder page.
The updated `scripts/build.mjs` now **copies `site/` to `dist/`** so the full wedding website is published instead.
Both original GitHub Actions workflows are retained, including `.github/workflows/deploy-pages.yml`.

## Deploy to your existing GitHub repo

1. Extract this ZIP.
2. Open your existing `sprint-cicd-demo` Git repository (the one connected to GitHub).
3. Copy from this ZIP into that repository:
   - The entire `site/` folder
   - `scripts/build.mjs` (replace the old file)
   - `test/wedding.test.mjs` (optional additional validation)
   - Ensure `.github/workflows/deploy-pages.yml`, `package.json`, and `package-lock.json` are present.
4. In GitHub, open your repository's **Settings > Pages > Build and deployment > Source > GitHub Actions**. You only need to configure this once.
5. From the repository folder on your laptop, run:

   ```bash
   npm ci
   npm test
   npm run build
   git add site scripts/build.mjs test/wedding.test.mjs
   git commit -m "Publish Varun and Tejaswini wedding website"
   git push origin main
   ```

6. In GitHub, open **Actions**. The `Demo CD - Deploy to GitHub Pages` workflow should run on every push to `main` and publish the site if the checks pass.
7. After successful deployment, find the live link in **Settings > Pages**. For a normal project repository, the address resembles `https://YOUR_USERNAME.github.io/sprint-cicd-demo/`.

Do not upload the ZIP itself into your GitHub repository; upload the extracted contents.
If using the website upload UI, retain the exact nested folder structure.

## First-time repository setup

If no GitHub repository exists yet, create a **public** GitHub repository, create a new local folder from the contents of this ZIP (not a parent wrapper), then:

```bash
git init
git branch -M main
git add .
git commit -m "Initial wedding website and GitHub Pages CI CD"
git remote add origin https://github.com/YOUR_USERNAME/sprint-cicd-demo.git
git push -u origin main
```

Enable **Settings > Pages > Source: GitHub Actions**. On first setup you may need to rerun the `Demo CD - Deploy to GitHub Pages` workflow after enabling Pages.

## Automatic future updates

Any future change committed and pushed to `main` triggers the existing deployment workflow, which builds `dist/`, runs the tests, and publishes a new version. Editing files only on your laptop does not trigger online deployment.

## Local test

Run `npm ci && npm test && npm run build`. Preview `dist/index.html` with a local static server, for example `python -m http.server 8080 --directory dist` and visit `http://localhost:8080/`.

## Note on sharing

Visitors can view this public website and all photos/videos on it. Review media for privacy before you share the link broadly.
