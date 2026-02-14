# Klimabürgerrat Offener Brief - AI Agent Coding Guide

## Project Overview
A climate citizen assembly open letter platform built with **Angular 20** frontend + **Express.js** backend. Content is managed via **Contentful CMS**, enabling non-technical updates to letters, signees, and legal pages without code changes.

**Key Architectural Pattern**: Contentful drives all dynamic content (letter, signees, data privacy, impressum) via entry IDs hardcoded in `contentful.service.ts`.

---

## Architecture & Data Flow

### Frontend (Angular)
- **Entry Point**: `src/app/app.component.ts` - minimal, routes all traffic
- **Routing** (`app-routing.module.ts`):
  - `/` → `LetterComponent` (default)
  - `/datenschutz` → `DataprivacyComponent`
  - `/impressum` → `ImpressumComponent`
  - Any other path → `LetterComponent` (catch-all)

### Content Management (Contentful Integration)
`contentful.service.ts` fetches entries via hardcoded IDs:
- `2aDDbb4AjEQdCo0IW7AnLm` - Letter (fields: text, richTextTitle, addressat, kontakthinweis, signees)
- `1RjJ8ucJJIekoeZ6Tz1ZLH` - Impressum
- `4rC21AGeBowVcfQKLnwBPk` - Data Privacy
- `1YkTzVK4KBzfmsMyBqKSo8` - Progress bar

**Key Detail**: All content is Promise-based (`getEntry()` returns Promise); components handle loading state manually with simple flags.

### Backend (Express)
`server.js` serves the Angular build with:
- HTTPS enforcement on production (Heroku-aware)
- Static asset serving from `dist/klimabuergerrat-offener-brief/browser`
- SPA fallback: all unknown routes redirect to `index.html` for Angular routing

---

## Critical Components & Patterns

### Letter Component
Displays main letter from Contentful with rich-text rendering:
- Imports `@contentful/rich-text-html-renderer` for Contentful rich text → HTML
- Method: `_returnHtmlFromRichText()` converts Contentful document nodes to HTML
- Renders list of signees (from `letter.fields.signees`)

### Signee Component  
Receives signee data as `@Input` properties from parent:
- Fields: `name`, `website`, `listOfSigningNames`, `logo` (Logo interface)
- **No service calls** - data flows down from parent (LetterComponent)
- Displays organization logo and name

### Sign-Letter-Modal Component
Handles petition signature submissions via HTTP:
- Uses `NgbModal` (ng-bootstrap) for modal UI
- **External API**: POSTs form data to `environment.mailService.url`
- Manages form state, validation, and loading/error states
- FormData encoding for file uploads (logo field)

---

## Development Workflows

### Build & Serve
```bash
npm start              # Run Express server (production mode)
ng serve              # Dev server with live reload (http://localhost:4200)
ng build              # Build for production → dist/
ng build --configuration=production  # Optimized prod build
```

### Testing
```bash
npm test              # Unit tests via Karma
npm run test:prod     # Headless Chrome tests (CI-friendly)
ng e2e                # End-to-end tests via Protractor
ng lint               # TSLint code style checks
```

### Environment Configuration
- **Development**: `src/environments/environment.ts` - dev keys + local API
- **Production**: `src/environments/environment.prod.ts` - minimal (keys injected at build time)
- Key configs: Contentful space/token, mail service URL

---

## Common Patterns & Conventions

### Component Structure
- **Standalone**: `standalone: false` (module-based; do not change)
- **Module Imports**: All declared in `app.module.ts` (no lazy loading)
- **Naming**: Use hyphenated filenames (`sign-letter-modal.component.ts`), PascalCase classes

### Contentful Integration
- Rich text from Contentful: Always use `documentToHtmlString()` before rendering
- Handling missing fields: Check with `if (letter.fields.xxx)` before assignment
- Entry IDs are **hardcoded** in service methods - do not parameterize without careful refactor

### Form Handling
- Modal form state: Plain object `form = {}` with property assignment
- Validation: `formSubmitted` boolean flag (not reactive forms)
- File uploads: Use `FormData` with `http.post()` for multipart encoding

### Styling
- **CSS Framework**: Bootstrap 5 (imported globally in `angular.json`)
- **Icons**: FontAwesome v5 solid icons only (`@fortawesome/free-solid-svg-icons`)
- **Component Styles**: Scoped CSS files per component (e.g., `letter.component.css`)

---

## Deployment & External Dependencies

- **Hosting**: Heroku (via `server.js` + `heroku-postbuild` npm script)
- **Mail Service**: External Heroku app at `environment.mailService.url` 
- **CMS**: Contentful hosted CMS (token in environment config)
- **HTTPS**: Auto-enforced on production by `server.js`

---

## When Adding Features

1. **New Content in Contentful**: Add entry ID to `contentful.service.ts` + method
2. **New Page/Route**: Add to `app-routing.module.ts`, create component, declare in `app.module.ts`
3. **New Form Field**: Update `SignLetterModalComponent` form object + validation logic
4. **Styling**: Create `.component.css` (scoped) or add to `src/assets/forms.css` (global)
5. **External API**: Use `environment` config, call via `HttpClient` injected in component

---

## Quick References

- **Main entry**: `src/index.html` + `src/main.ts`
- **Contentful types**: `src/app/*.interface.ts` (SigneeEntrySkeleton, Logo, Contact)
- **Global styles**: `src/styles.css` + `src/assets/forms.css`
- **Build output**: `dist/klimabuergerrat-offener-brief/browser/` (served by Express)
