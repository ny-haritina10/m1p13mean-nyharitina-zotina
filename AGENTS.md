# AGENTS.md

This file provides guidelines for agentic coding agents (like Kilo) working in this MEAN stack repository.
The project consists of a Node.js/Express backend, Angular 18 frontend, and MongoDB database.
Root directory: `/home/ny-haritina/Documents/Studies/ITU/S7/m1p13mean-nyharitina-zotina`.
Backend: `./backend/` (Express server with Mongoose).
Frontend: `./frontend/` (Angular SPA).
Database: `./database/setup.md` (MongoDB 7.0 setup on Ubuntu).

Use `cd backend` or `cd frontend` for directory-specific commands.
Always run `npm install` in each directory before running scripts.
No shared root package.json; dependencies are separate.

## 1. Build, Lint, and Test Commands

### Backend Commands (`./backend/`)
- **Installation**: `cd backend && npm install`
  - Installs dependencies: Express (^5.2.1), Mongoose (^9.2.1), CORS (^2.8.6), Dotenv (^17.3.1).
  - Dev: Nodemon (^3.1.11) for hot reload.

- **Start (Production)**: `cd backend && npm start`
  - Runs `node server.js`.
  - Starts Express server (default port likely 3000; check server.js).
  - Connects to MongoDB via Mongoose (URI in .env).

- **Development Server**: `cd backend && npm run dev`
  - Runs `nodemon server.js`.
  - Auto-restarts on file changes.
  - Ideal for backend development.

- **Build**: No explicit build step (Node.js runtime).
  - For production, use PM2 or similar (not configured).
  - To bundle/minify, add Webpack or esbuild if needed.

- **Linting**: No configuration or scripts found.
  - No .eslintrc or Prettier setup.
  - Recommendation: Add ESLint with `npm install --save-dev eslint` and create .eslintrc.json.
  - Suggested script: Add `"lint": "eslint ."` to package.json.
  - For JS: Use Airbnb style guide or StandardJS.

- **Testing**: No tests implemented.
  - Placeholder script: `npm test` echoes error and exits.
  - To add: Install Mocha/Jest (`npm install --save-dev mocha chai supertest`).
  - Suggested script: `"test": "mocha --recursive"`.
  - Run single test: `mocha tests/specific.test.js`.
  - Integrate with CI: Use GitHub Actions (no .github/workflows found).

- **Environment**: Load .env with Dotenv (e.g., DB_URI=mongodb://localhost:27017/myapp).
  - Never commit .env (already in .gitignore).

### Frontend Commands (`./frontend/`)
- **Installation**: `cd frontend && npm install`
  - Installs Angular 18 deps: @angular/core (^18.2.0), RxJS (~7.8.0), Zone.js (~0.14.10).
  - Dev: @angular/cli (^18.2.20), TypeScript (~5.5.2), Karma/Jasmine for testing.

- **Start (Development Server)**: `cd frontend && npm start`
  - Runs `ng serve`.
  - Serves at http://localhost:4200 with live reload.
  - Uses development config (no optimization, source maps enabled).

- **Build (Production)**: `cd frontend && npm run build`
  - Runs `ng build`.
  - Outputs to `./dist/frontend/` (optimized bundle, hashing for cache-busting).
  - Budgets: Initial <1MB, styles <4kB (enforced in production).
  - For dev build: `ng build --configuration development`.

- **Watch Mode**: `cd frontend && npm run watch`
  - Runs `ng build --watch --configuration development`.
  - Rebuilds on changes (useful for integration with backend).

- **Linting**: No explicit ESLint/Prettier config (Angular CLI uses built-in).
  - Angular 18 includes basic linting via ng lint (not in scripts).
  - Run: `cd frontend && ng lint`.
  - Config: Check angular.json for lint target (none explicit; uses default).
  - Recommendation: Add ESLint extension for VS Code.
  - No .prettierrc; use editor formatting (2-space indent, single quotes).

- **Testing (Unit Tests)**: `cd frontend && npm test`
  - Runs `ng test` with Karma/Jasmine.
  - Opens browser in watch mode (auto-rerun on changes).
  - Coverage: Add `--code-coverage` for reports in coverage/.
  - Config: tsconfig.spec.json (isolatedModules: true, etc.).
  - End-to-End: No e2e setup (add with `ng add @angular/e2e`).

- **Running a Single Test**:
  - Filter by file: `cd frontend && ng test --include=src/app/app.component.spec.ts`.
  - Or by pattern: `ng test --include=**/*component*.spec.ts`.
  - One-time run (no watch): Add `--watch=false`.
  - Example: `ng test --include=src/app/app.component.spec.ts --watch=false --browsers=ChromeHeadless`.
  - For specific test: Use `fdescribe` or `fit` in spec files (Jasmine focus).
  - Coverage for single: `ng test --include=... --code-coverage`.

- **Proxy to Backend**: For dev, add proxy.conf.json to route API calls (e.g., /api -> http://localhost:3000).
  - Run: `ng serve --proxy-config proxy.conf.json`.

### Full-Stack Development
- **Run Both**: Terminal 1: `cd backend && npm run dev`. Terminal 2: `cd frontend && npm start`.
- **Database Setup**: Follow `./database/setup.md` for MongoDB install/start.
  - Test connection: `mongosh` then `show dbs`.
- **Type Checking**: `cd frontend && ng build` (enforces tsconfig.json strict mode).
- **No Global Lint/Test**: Run separately per directory.

## 2. Code Style Guidelines

Follow Angular and Node.js best practices. No custom rules (no .eslintrc, .prettierrc, or Cursor/Copilot files found).
Use strict TypeScript (frontend tsconfig.json: strict: true). Backend is plain JS.

### General Conventions
- **Indentation**: 2 spaces (Angular default).
- **Quotes**: Single quotes for strings (unless template literals).
- **Semicolons**: Required (ASI can cause issues).
- **Line Length**: 100-120 characters max.
- **Comments**: JSDoc for public APIs; inline for complex logic. No TODOs without assignee.
- **Commits**: Conventional Commits (e.g., feat: add user login, fix: resolve CORS error).
- **File Encoding**: UTF-8.
- **Security**: Never log/hardcode secrets. Use .env. Sanitize inputs (Express: helmet, Angular: DomSanitizer).

### Imports and Exports
- **Frontend (Angular/TS)**:
  - Prefer direct imports: `import { Component } from '@angular/core';`.
  - Barrel exports: Use index.ts for modules (e.g., export * from './service';).
  - Order: Angular core, RxJS, internal, third-party.
  - Avoid relative paths >3 levels; use path aliases if added (tsconfig paths).
  - Lazy loading: Use `loadChildren` in routes for feature modules.

- **Backend (Node/JS)**:
  - Use ONLY JavaScript in the backend , no TypeScript 
  - Use require(): `const express = require('express');` (CommonJS, per package.json).
  - For ES modules: Switch to import if adding &quot;type&quot;: &quot;module&quot;.
  - Order: Built-ins (fs, path), third-party (express, mongoose), local (./routes).
  - Export: module.exports = router; or named exports.

### Formatting and Structure
- **Frontend**:
  - Components: File naming kebab-case (app.component.ts). Class: PascalCase.
  - Templates: Inline in .html or external. Use *ngIf, *ngFor over [hidden].
  - Styles: Tailwind CSS v4 for utility classes, Google Material Icons for icons. Scoped CSS (.scss if added). Global in styles.css.
  - Services: Injectable singleton. Use HttpClient for APIs.

- **Backend**:
  - Files: camelCase (userRoutes.js). Functions: camelCase.
  - Structure: MVC-like (routes/, models/, controllers/).
  - Routes: RESTful (/api/users, POST /api/users/:id).

### Types and Typing
- **Frontend (TypeScript)**:
  - Strict mode: No implicit any. Use interfaces/types for props/services.
  - Example: interface User { id: string; name: string; }
  - Generics: Use for components/services (e.g., Observable&lt;User&gt;).
  - Null/Undefined: Use ? for optional, ! for non-null assertion sparingly.
  - Enums: For constants (enum UserRole { Admin, User }).

- **Backend (JavaScript)**:
  - Add JSDoc types: /** @param {string} id */
  - Consider migrating to TypeScript for models (e.g., mongoose schemas with types).
  - Validate inputs: Use Joi or express-validator.

### Naming Conventions
- **Variables/Functions**: camelCase (userService, getUsers()).
- **Classes/Interfaces**: PascalCase (UserComponent, IUser).
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL).
- **Files**:
  - Frontend: app.component.ts, user.service.ts.
  - Backend: server.js, user.model.js, auth.middleware.js.
- **Components**: Prefix 'app' (per angular.json).

### Error Handling
- **Frontend**:
  - Services: Catch HttpErrorResponse, use RxJS catchError.
  - Components: Use ErrorHandler or global error service.
  - User-facing: Toasts/notifications (add ng-bootstrap or similar).
  - Example:
    ```ts
    this.http.get&lt;User&gt;('/api/users').pipe(
      catchError(err => this.handleError(err))
    );
    private handleError(err: any): Observable&lt;never&gt; {
      console.error(err);
      return throwError(() => new Error('Something went wrong'));
    }
    ```

- **Backend**:
  - Middleware: Global error handler at end of app.use().
  - Mongoose: Handle validation errors (e.g., res.status(400).json(err)).
  - Async: Use try-catch in routes or async middleware.
  - Example:
    ```js
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something broke!' });
    });
    ```
  - Validate: 400 for bad request, 404 for not found, 500 for server error.

### Additional Guidelines
- **Dependencies**: Check package.json before adding. No assuming libs.
- **Testing**: Aim 80% coverage. Mock HTTP in frontend (HttpClientTestingModule).
- **Performance**: Frontend: OnPush change detection, trackBy in ngFor.
  Backend: Index MongoDB fields, limit queries.
- **Accessibility**: ARIA labels in templates, semantic HTML.
- **No Malicious Code**: Refuse edits to harmful files.
- **Proactivity**: Ask before commits/pushes. Run tests/lint after changes.
- **Cursor/Copilot Rules**: None found (.cursor/rules/ empty, no .github/copilot-instructions.md).

When editing, read files first (use Read tool). Mimic existing patterns (e.g., Angular standalone components).
For questions, reference Angular docs (angular.dev) or Express (expressjs.com).

(Approximately 150 lines; expand as needed for specific tasks.)