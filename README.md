# BallsGame

Prototype web app for configuring and watching short vertical ball-combat simulations.

## Requirements
- Node.js 20 or newer
- No runtime npm dependencies

## Run locally
Run `npm start`, then open http://127.0.0.1:4173.

## Checks
Run `npm run check` and `npm test`.

## Current prototype
- Vertical 9:16 canvas arena.
- Three visual maps: Néon Grid, classic arena, and central orbit.
- 2–8 colored balls, configurable speed and deterministic seed.
- Start, pause, reset, wall/ball/obstacle collisions, ball health, impact damage and elimination.
- Damage doubles at 50 seconds; sudden-death mode starts at 58 seconds and resolves a single winner no later than 65 seconds.
- Health rings, impact flashes, and a double-damage / sudden-death banner.
- Browser recording through MediaRecorder when supported; current export format is WebM, not MP4.
- No third-party runtime dependencies.

This is an initial functional foundation, not a complete implementation of STATE.md acceptance criteria.
