# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server
npx ng serve            # http://localhost:4200 (defaults to the `development` configuration)

# Build
npm run build           # defaults to the `production` configuration → dist/
npx ng build --configuration development   # unoptimized build with source maps

# Unit tests (Jest)
npm test                # watch mode
npm run test:prod       # single run, no watch
npm test -- --testPathPattern=<file>   # single spec file
npm test -- --testNamePattern="<name>" # single test by name

# E2E tests (Playwright – auto-starts dev server)
npm run playwright:install  # one-time browser install
npm run e2e

# Lint
npm run lint

# Production server
npm start               # Express server (serves dist/)
```

Node 22.x — the version CI runs and the version the Heroku build targets.

## Architecture

Angular 20 SPA for collecting signatures on an open letter about climate policy ("Klimabürgerrat offener Brief"). The user-facing content and UI are in German.

**NgModule-based, not standalone.** Despite being on Angular 20, this app uses the classic module architecture: `src/main.ts` bootstraps via `platformBrowserDynamic().bootstrapModule(AppModule)`, with `src/app/app.module.ts` and `src/app/app-routing.module.ts`. No component sets `standalone: true`. New components must be declared in `AppModule` — do not generate standalone components or migrate to `bootstrapApplication` without a deliberate decision to convert the whole app.

**Content:** All editable content (the letter text, signees, privacy policy, legal notice) lives in Contentful (headless CMS). The `ContentfulService` (`src/app/contentful.service.ts`) fetches this data; environment files hold the space/access-token credentials.

**Credentials are committed on purpose.** `src/environments/environment.ts` and `environment.prod.ts` both contain the same Contentful space ID and access token. This is a read-only Content Delivery API token for a public website, not a leaked secret — removing it or moving it to an unset environment variable will break the build and the live site.

**Routing:** `src/app/app-routing.module.ts` defines `/impressum` (`ImpressumComponent`), `/datenschutz` (`DataprivacyComponent`), and a `**` wildcard mapping everything else to `LetterComponent` (letter + signature form). There is deliberately no 404 route — any unrecognized URL renders the letter.

**Signing flow:** The `sign-letter-modal` component collects user input and calls a mail service URL (configured in `environment.ts`) to persist a new signature. The mail service is a separate Heroku app, `open-letter-mailer`.

**Production serving:** `server.js` is an Express wrapper that serves `dist/`, enforces HTTPS on Heroku, and falls back to `index.html` for SPA routing.

**Styling:** Bootstrap 5 (via angular.json asset), ng-bootstrap for Angular components, FontAwesome icons, global `styles.css`.

**Testing:**
- Unit tests: `src/**/*.spec.ts` with Jest + jest-preset-angular (JSDOM)
- E2E tests: `e2e/app.spec.ts` with Playwright (Chromium, base URL `http://127.0.0.1:4200`)

## Deployment

The frontend deploys to the Heroku app **`open-letter-frontend`**, live at
[klima-rat.org](https://klima-rat.org) (and `open-letter-frontend.herokuapp.com`).

- Heroku's GitHub integration **auto-deploys on push to `master`** — merging a PR ships to
  production. There is no `main` branch in this repo.
- Heroku builds with the `heroku-postbuild` script (`ng build`) and serves the result via
  `server.js`.
- CI (`.github/workflows/node.js.yml`) runs build, `npm run test:prod`, and
  `npm audit --audit-level=high --omit=dev` on pushes and PRs to `master`. It has **no** deploy
  step, and Heroku deploys independently of whether CI passed.
- Roll back a bad release without touching git:
  `heroku releases:rollback --app open-letter-frontend`.
