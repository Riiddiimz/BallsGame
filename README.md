# BallsGame

Prototype web app for configuring and watching short vertical ball-combat simulations.

## Requirements
- Node.js 20 or newer for local development and tests
- No runtime npm dependencies

## Run locally
Run `npm start`, then open http://127.0.0.1:4173.

## Deploy to Vercel
1. Import `Riiddiimz/BallsGame` from GitHub at https://vercel.com/new.
2. Select the repository's `main` branch.
3. The repository's `vercel.json` explicitly configures the project as a static site (`framework: null`), with no build or install command and the repository root as the output directory.
4. Keep the project Root Directory at `./`. If the dashboard displays overrides, choose **Other** and clear the Build Command and Install Command. The `.vercelignore` file excludes tests, documentation, the local Node development server and the package manifest from the published output.
5. Deploy. Subsequent pushes to `main` should trigger production deployments automatically when the Git integration is connected.

The production page runs the simulation in the browser; `server.mjs` is only for local development and is not a long-running Vercel server. Browser recording depends on the formats supported by that browser: MP4 is used when native MediaRecorder support exists, otherwise the exported file is WebM.

## Checks
Run `npm run check`, `npm test`, and `npm run test:e2e` (Playwright + Chromium).

## Current prototype
- Vertical 9:16 canvas arena.
- Four visual maps: Néon Grid, classic arena, central orbit, and Magma Pit. Layouts are seed-reproducible; Neon Grid has damaging spikes and Magma Pit has a central lava hazard.
- 2–8 colored balls, configurable speed, 0–10 obstacles, deterministic seed, and a switch to enable or disable power-ups.
- Start, pause, reset, wall/ball/obstacle collisions, ball health, impact damage and elimination.
- Winner reveal is held until 58 seconds when only one survivor remains; a deterministic fallback resolves a winner by 65 seconds.
- Damage doubles at 50 seconds; sudden-death mode starts at 58 seconds and resolves a single winner no later than 65 seconds.
- Collectible Surge (temporary speed), Shield (damage reduction), and Nova (radial damage/knockback) power-ups, with distinct pickup and active-effect visuals.
- Health rings, impact flashes, and a double-damage / sudden-death banner.
- Browser recording starts the selected-seed combat automatically and stops at the end. Native MP4 is preferred when the browser supports it; WebM is the fallback.
- No third-party runtime dependencies.

This is an initial functional foundation, not a complete implementation of STATE.md acceptance criteria.
