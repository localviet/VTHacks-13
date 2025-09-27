## Quick orientation

This repository is a small two-tier web app with a React + Vite frontend and an Express + Mongoose backend.

- Frontend: `frontend/` — Vite + React (ES modules). Key files: `frontend/package.json`, `frontend/vite.config.js`, `frontend/src/main.jsx`, `frontend/src/App.jsx`.
- Backend: `backend/` — Express + Mongoose (CommonJS). Key file: `backend/server.js` and `backend/package.json`.

Read these files first to see how the pieces connect.

## Big-picture architecture and data flow

- The frontend is a single-page React app built with Vite. It serves static assets and calls the backend API under the `/api/*` prefix.
- The backend implements an Express HTTP API and registers routes on `/api/workouts` (see `backend/server.js`). The backend uses Mongoose to connect to MongoDB.
- Data flow: frontend -> HTTP JSON -> backend Express routes -> Mongoose models -> MongoDB.

Why this shape: simple separation of concerns for a hackathon-style app — Vite handles dev HMR and bundling for UI, Express provides a lightweight JSON API backed by MongoDB.

## Important, discoverable details and examples

- Backend uses CommonJS (see `backend/package.json` "type": "commonjs"). Use `require()` when editing backend code.
- Frontend uses ES modules (`type: "module"` in `frontend/package.json`) and React 19; use `import` in frontend files.
- `backend/server.js`:
  - Registers JSON middleware: `app.use(express.json())` so endpoints expect/return JSON.
  - Logs requests with a simple middleware that prints `req.path` and `req.method`.
  - Mounts `workoutRoutes` at `/api/workouts` (import path: `./routes/workouts`). Note: the referenced route file(s) and models (e.g., `backend/routes/workouts.js`, `backend/models/*`) are not present in the repository — expect to add or restore them when implementing backend endpoints.
  - Connects to MongoDB using `mongoose.connect(process.env.MONGO_URI)` and listens on `process.env.PORT` — both env vars must be set before starting.

## Developer workflows (how to run and debug)

Run frontend (dev):

```powershell
cd frontend
npm install
npm run dev
```

Run backend (dev) — environment variables required:

```powershell
cd backend
npm install
# set env vars (PowerShell)
$env:MONGO_URI = 'mongodb://localhost:27017/<dbname>'
$env:PORT = '4000'
# start with node
node server.js
# or use nodemon for auto-restart
npx nodemon server.js
```

Notes:

- `backend/package.json` includes `dotenv` as a dependency but `server.js` does not call `require('dotenv').config()`. Either set environment variables in your shell or add `require('dotenv').config()` at the top of `server.js` to load a `.env` file.
- There is no `start`/`dev` script in `backend/package.json`. Use the explicit `node server.js` or `npx nodemon server.js` approach until scripts are added.
- Frontend linting is available: `npm run lint` from `frontend/` (ESLint is configured in `frontend/eslint.config.js`).

## Project-specific conventions and gotchas

- Backend expects route modules under `backend/routes/` and Mongoose models under `backend/models/` (standard Express/MVC-like layout). `server.js` imports `./routes/workouts` — adding new API resources should follow this same path layout.
- Backend is CommonJS; do not convert backend files to ES modules unless you also change `backend/package.json`.
- Frontend uses `@vitejs/plugin-react` and `@tailwindcss/vite` (see `frontend/vite.config.js`). Tailwind-related config may be present or expected in `frontend/` (not all files are included here).

## Integration points and external dependencies

- MongoDB: `MONGO_URI` env var used by Mongoose. Provide a connection string (local or cloud Atlas).
- NPM packages to know:
  - backend: `express`, `mongoose`, `dotenv` (installed but not wired), `nodemon` (dev)
  - frontend: `vite`, `react`, `react-dom`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`

## Concrete tasks an AI agent can do right away

- Add missing backend route and model files referenced by `server.js` (e.g., `backend/routes/workouts.js` and `backend/models/workout.js`) following Express + Mongoose patterns.
  - Example: route module should export an Express router and implement JSON handlers mounted at `/api/workouts`.
- Add `require('dotenv').config()` to `backend/server.js` (or add clear instructions / script for env management) so `.env` files are supported.
- Add `scripts` to `backend/package.json` (e.g., `start`, `dev`) to standardize startup.

## Files to open when working on a change

- `backend/server.js` — entrypoint, middleware, route mounts, DB connect
- `frontend/src/main.jsx` and `frontend/src/App.jsx` — UI entry and top-level component
- `frontend/package.json`, `frontend/vite.config.js` — build/dev tooling

## If you get stuck

- If the backend fails to start, check that `MONGO_URI` and `PORT` are set. If you see a missing module error for routes/models, search for `workouts` import sites and add the missing files.

---

If you want, I can also:

- create skeleton `backend/routes/workouts.js` and `backend/models/workout.js` consistent with `server.js` so the backend can start out-of-the-box, or
- add a small `backend` npm script set and a `.env.example` file.

Please review and tell me which follow-up you'd like (skeleton files, scripts, or changes to `server.js`).
