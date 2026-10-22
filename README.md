# BallsGame

Prototype web app for configuring and watching short vertical ball-combat simulations.

## Requirements
- Node.js 20 or newer
- No runtime npm dependencies

## Run locally
Run `npm start`, then open http://127.0.0.1:4173.

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
