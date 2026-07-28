# klimabuergerrat-offener-brief

Eine simple Website für die Darstellung und Verbreitung des offenen Briefs für einen
Klimabürgerrat in Deutschland.

Live at **[klima-rat.org](https://klima-rat.org)**.

An Angular single-page app that presents an open letter on climate policy and collects
signatures for it. The letter text, the list of signees, and the legal pages are maintained in
[Contentful](https://www.contentful.com/) rather than in this repository, so the content can be
edited without a deploy.

## Prerequisites

- Node.js 22.x (the version used by CI and by the production build)
- npm

## Setup

```bash
npm ci
```

## Development server

```bash
npx ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically when you change a source
file. `ng serve` uses the `development` configuration (source maps, no optimization).

## Build

```bash
npm run build
```

Build artifacts are written to `dist/`. `npm run build` uses the `production` configuration by
default. For an unoptimized build with source maps:

```bash
npx ng build --configuration development
```

## Running unit tests

Unit tests run on [Jest](https://jestjs.io/) (via jest-preset-angular):

```bash
npm test          # watch mode
npm run test:prod # single run, used by CI
```

## Running end-to-end tests

End-to-end tests run on [Playwright](https://playwright.dev/) and start the dev server
automatically:

```bash
npm run playwright:install  # one-time browser download
npm run e2e
```

## Deployment

The app is hosted on Heroku and deploys automatically when commits land on `master`. Heroku
builds via the `heroku-postbuild` script and serves the result through `server.js`, a small
Express wrapper that enforces HTTPS and handles SPA routing.

Continuous integration (`.github/workflows/node.js.yml`) builds the app, runs the unit tests, and
audits production dependencies on every push and pull request to `master`.

## Editing content

The letter, the signees, the privacy policy, and the legal notice all live in Contentful and are
fetched at runtime by `ContentfulService` (`src/app/contentful.service.ts`). Changes made in
Contentful appear on the live site without a redeploy.

## Contributing

Issues and pull requests are welcome. Please see [SECURITY.md](SECURITY.md) for how to report a
vulnerability.

## Further help

For help with the Angular CLI, run `ng help` or see the
[Angular CLI documentation](https://angular.dev/cli).
