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

export function createSimulation({ seed = "BALLS-2026", count = 4, map = "neon", width = 360, height = 640 } = {}) {
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
      alive: true, hits: 0, health: 100, damageFlash: 0, eliminatedAt: null
    });
  }
  const obstacles = map === "orbit"
    ? [{ x: width * 0.5, y: height * 0.5, r: width * 0.105, kind: "ring" }]
    : map === "neon"
      ? [{ x: width * 0.28, y: height * 0.38, w: width * 0.25, h: 7 }, { x: width * 0.72, y: height * 0.62, w: width * 0.25, h: 7 }]
      : [];
  return { seed: String(seed), map, width, height, balls, obstacles, elapsed: 0, collisions: 0, finished: false, winner: null, damageMultiplier: 1, suddenDeath: false };
}

function eliminate(ball, elapsed) {
  ball.health = 0;
  ball.alive = false;
  ball.eliminatedAt = elapsed;
  ball.damageFlash = 0;
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
    ball.x += ball.vx * movementStep;
    ball.y += ball.vy * movementStep;
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
        const nearestX = Math.max(obstacle.x - obstacle.w / 2, Math.min(ball.x, obstacle.x + obstacle.w / 2));
        const nearestY = Math.max(obstacle.y - obstacle.h / 2, Math.min(ball.y, obstacle.y + obstacle.h / 2));
        const dx = ball.x - nearestX, dy = ball.y - nearestY;
        if (dx * dx + dy * dy < ball.r * ball.r) {
          if (Math.abs(dx) > Math.abs(dy)) ball.vx = Math.sign(dx || 1) * Math.abs(ball.vx);
          else ball.vy = Math.sign(dy || 1) * Math.abs(ball.vy);
          ball.x += Math.sign(dx || 1) * 2;
          ball.y += Math.sign(dy || 1) * 2;
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
        a.health = Math.max(0, a.health - damage);
        b.health = Math.max(0, b.health - damage);
        a.damageFlash = 0.16; b.damageFlash = 0.16;
        if (a.health <= 0) eliminate(a, sim.elapsed);
        if (b.health <= 0) eliminate(b, sim.elapsed);
      }
      a.hits++; b.hits++; sim.collisions++;
    }
  }
  const survivors = sim.balls.filter((ball) => ball.alive);
  if (survivors.length === 1) {
    sim.finished = true;
    sim.winner = survivors[0].id;
  } else if (sim.elapsed >= 65) {
    resolveSuddenDeath(sim);
  }
  return sim;
}
