export const BALL_COLORS = ["#ff5e78", "#54a7ff", "#61f0b0", "#ffdc66", "#b48aff", "#ff9d55", "#5ce8e8", "#f28bd8"];

export function hashSeed(seed) {
  let hash = 2166136261;
  for (const char of String(seed ?? "")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRandom(seed) {
  let state = hashSeed(seed) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSimulation({ seed = "BALLS-2026", count = 4, map = "neon", obstacleCount = 2, powersEnabled = true, width = 360, height = 640 } = {}) {
  const random = createRandom(seed);
  const radius = Math.max(8, Math.min(width, height) * 0.023);
  const balls = [];
  const safeCount = Math.max(2, Math.min(8, Math.floor(Number(count) || 4)));
  for (let i = 0; i < safeCount; i++) {
    const angle = (Math.PI * 2 * i) / safeCount + random() * 0.4;
    const speed = 72 + random() * 55;
    balls.push({
      id: i, color: BALL_COLORS[i], r: radius,
      x: width * (0.28 + random() * 0.44),
      y: height * (0.28 + random() * 0.44),
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      alive: true, hits: 0, health: 100, damageFlash: 0, eliminatedAt: null, speedBoostUntil: 0, shieldUntil: 0, powerFlash: 0
    });
  }
  const safeObstacleCount = Math.max(0, Math.min(10, Math.floor(Number(obstacleCount) || 0)));
  const obstacles = [];
  for (let i = 0; i < safeObstacleCount; i++) {
    if (map === "orbit" && i === 0) {
      obstacles.push({ x: width * 0.5, y: height * 0.5, r: width * 0.105, kind: "ring" });
      continue;
    }
    const w = width * (0.14 + random() * 0.17);
    const h = 5 + random() * 5;
    obstacles.push({
      x: width * (0.18 + random() * 0.64),
      y: height * (0.18 + random() * 0.64),
      w, h , kind: "platform"
    });
  }
  const powerups = Array.from({ length: 7 }, (_, id) => {
    const roll = random();
    return {
      id,
      type: roll < 0.34 ? "surge" : roll < 0.67 ? "shield" : "nova",
      x: width * (0.18 + random() * 0.64),
      y: height * (0.18 + random() * 0.64),
      spawnAt: 6 + id * 7.5,
      expiresAt: 11 + id * 7.5,
      collected: false
    };
  });
  return { seed: String(seed), map, width, height, balls, obstacles, obstacleCount: safeObstacleCount, powersEnabled: Boolean(powersEnabled), powerups, elapsed: 0, collisions: 0, finished: false, winner: null, damageMultiplier: 1, suddenDeath: false };
}

function eliminate(ball, elapsed) {
  ball.health = 0;
  ball.alive = false;
  ball.eliminatedAt = elapsed;
  ball.damageFlash = 0;
}

function applyPowerups(sim) {
  if (!sim.powersEnabled) return;
  for (const pickup of sim.powerups) {
    if (pickup.collected) continue;
    if (sim.elapsed > pickup.expiresAt) { pickup.collected = true; continue; }
    if (sim.elapsed < pickup.spawnAt) continue;
    for (const ball of sim.balls) {
      if (!ball.alive || Math.hypot(ball.x - pickup.x, ball.y - pickup.y) > ball.r + 12) continue;
      pickup.collected = true;
      ball.powerFlash = 0.55;
      if (pickup.type === "surge") {
        ball.speedBoostUntil = sim.elapsed + 4;
      } else if (pickup.type === "shield") {
        ball.shieldUntil = sim.elapsed + 5;
      } else if (pickup.type === "nova") {
        for (const target of sim.balls) {
          if (!target.alive || target.id === ball.id) continue;
          const dx = target.x - ball.x, dy = target.y - ball.y;
          const distance = Math.hypot(dx, dy);
          if (distance >= 165) continue;
          const nx = dx / (distance || 1), ny = dy / (distance || 1);
          const force = 210 * (1 - distance / 165);
          target.vx += nx * force;
          target.vy += ny * force;
          target.health = Math.max(0, target.health - 12 * sim.damageMultiplier);
          target.damageFlash = 0.2;
          if (target.health <= 0) eliminate(target, sim.elapsed);
        }
      }
      break;
    }
  }
}

function resolveSuddenDeath(sim) {
  const alive = sim.balls.filter((ball) => ball.alive);
  const candidates = alive.length ? alive : sim.balls;
  const winner = [...candidates].sort((a, b) =>
    b.health - a.health || b.hits - a.hits || a.id - b.id
  )[0];
  for (const ball of sim.balls) {
    if (ball !== winner && ball.alive) eliminate(ball, sim.elapsed);
  }
  if (winner) {
    winner.alive = true;
    winner.health = Math.max(1, winner.health);
    sim.winner = winner.id;
  }
  sim.finished = true;
}

export function stepSimulation(sim, dt, speed = 1) {
  if (!sim || sim.finished || !Number.isFinite(dt) || dt <= 0) return sim;
  const step = Math.min(dt, 1 / 20);
  const { width, height } = sim;
  sim.elapsed += step;
  sim.damageMultiplier = sim.elapsed >= 50 ? 2 : 1;
  sim.suddenDeath = sim.elapsed >= 58;
  const movementStep = step * Math.max(0.1, Math.min(3, Number.isFinite(speed) ? speed : 1));
  for (const ball of sim.balls) {
    if (!ball.alive) continue;
    ball.damageFlash = Math.max(0, ball.damageFlash - step);
    ball.powerFlash = Math.max(0, ball.powerFlash - step);
    const ballMovementStep = movementStep * (ball.speedBoostUntil > sim.elapsed ? 1.45 : 1);
    ball.x += ball.vx * ballMovementStep;
    ball.y += ball.vy * ballMovementStep;
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); ball.hits++; sim.collisions++; }
    if (ball.x + ball.r > width) { ball.x = width - ball.r; ball.vx = -Math.abs(ball.vx); ball.hits++; sim.collisions++; }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); ball.hits++; sim.collisions++; }
    if (ball.y + ball.r > height) { ball.y = height - ball.r; ball.vy = -Math.abs(ball.vy); ball.hits++; sim.collisions++; }
    for (const obstacle of sim.obstacles) {
      if (obstacle.kind === "ring") {
        const dx = ball.x - obstacle.x, dy = ball.y - obstacle.y;
        const distance = Math.hypot(dx, dy) || 1;
        const min = obstacle.r + ball.r;
        if (distance < min) {
          const nx = dx / distance, ny = dy / distance;
          ball.x = obstacle.x + nx * min;
          ball.y = obstacle.y + ny * min;
          const dot = ball.vx * nx + ball.vy * ny;
          if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; ball.hits++; sim.collisions++; }
        }
      } else {
        const left = obstacle.x - obstacle.w / 2, right = obstacle.x + obstacle.w / 2;
        const top = obstacle.y - obstacle.h / 2, bottom = obstacle.y + obstacle.h / 2;
        const nearestX = Math.max(left, Math.min(ball.x, right));
        const nearestY = Math.max(top, Math.min(ball.y, bottom));
        let dx = ball.x - nearestX, dy = ball.y - nearestY;
        const distance = Math.hypot(dx, dy);
        if (distance < ball.r) {
          if (distance > 0.0001) {
            const nx = dx / distance, ny = dy / distance;
            ball.x += nx * (ball.r - distance);
            ball.y += ny * (ball.r - distance);
            const dot = ball.vx * nx + ball.vy * ny;
            if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; }
          } else {
            const exits = [
              { distance: ball.x - left, x: left - ball.r, y: ball.y, nx: -1, ny: 0 },
              { distance: right - ball.x, x: right + ball.r, y: ball.y, nx: 1, ny: 0 },
              { distance: ball.y - top, x: ball.x, y: top - ball.r, nx: 0, ny: -1 },
              { distance: bottom - ball.y, x: ball.x, y: bottom + ball.r, nx: 0, ny: 1 }
            ].sort((a, b) => a.distance - b.distance);
            const exit = exits[0];
            ball.x = exit.x; ball.y = exit.y;
            const dot = ball.vx * exit.nx + ball.vy * exit.ny;
            if (dot < 0) { ball.vx -= 2 * dot * exit.nx; ball.vy -= 2 * dot * exit.ny; }
          }
          ball.hits++; sim.collisions++;
        }
      }
    }
  }
  for (let i = 0; i < sim.balls.length; i++) {
    const a = sim.balls[i];
    if (!a.alive) continue;
    for (let j = i + 1; j < sim.balls.length; j++) {
      const b = sim.balls[j];
      if (!b.alive) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.001;
      const minDistance = a.r + b.r;
      if (distance >= minDistance) continue;
      const nx = dx / distance, ny = dy / distance;
      const overlap = minDistance - distance;
      a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
      const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (relative < 0) {
        const impactSpeed = Math.abs(relative);
        const damage = Math.min(18, 6 + impactSpeed * 0.05) * sim.damageMultiplier;
        a.vx += relative * nx; a.vy += relative * ny;
        b.vx -= relative * nx; b.vy -= relative * ny;
        a.health = Math.max(0, a.health - damage * (a.shieldUntil > sim.elapsed ? 0.35 : 1));
        b.health = Math.max(0, b.health - damage * (b.shieldUntil > sim.elapsed ? 0.35 : 1));
        a.damageFlash = 0.16; b.damageFlash = 0.16;
        if (a.health <= 0) eliminate(a, sim.elapsed);
        if (b.health <= 0) eliminate(b, sim.elapsed);
      }
      a.hits++; b.hits++; sim.collisions++;
      if (!a.alive) break;
    }
  }
  applyPowerups(sim);
  const survivors = sim.balls.filter((ball) => ball.alive);
  if (survivors.length === 1 && sim.elapsed >= 58) {
    sim.finished = true;
    sim.winner = survivors[0].id;
  } else if (sim.elapsed >= 65) {
    resolveSuddenDeath(sim);
  }
  return sim;
}
