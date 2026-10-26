import test from "node:test";
import assert from "node:assert/strict";
import { createSimulation, createRandom, hashSeed, stepSimulation } from "../src/simulation.js";

test("same seed and options produce identical starting states", () => {
  const a = createSimulation({ powersEnabled: false, seed: "repeatable", count: 5, map: "neon" });
  const b = createSimulation({ powersEnabled: false, seed: "repeatable", count: 5, map: "neon" });
  assert.deepEqual(a.balls, b.balls);
  assert.equal(a.seed, b.seed);
});
test("different seeds produce different starting states", () => {
  assert.notDeepEqual(createSimulation({ powersEnabled: false,seed:"alpha"}).balls, createSimulation({ powersEnabled: false,seed:"beta"}).balls);
});
test("participant count is clamped to supported range", () => {
  assert.equal(createSimulation({ powersEnabled: false,count:1}).balls.length, 2);
  assert.equal(createSimulation({ powersEnabled: false,count:100}).balls.length, 8);
});
test("starting balls stay within arena bounds", () => {
  const sim=createSimulation({ powersEnabled: false,seed:"bounds",count:8,width:360,height:640});
  for (const ball of sim.balls) {
    assert.ok(ball.x >= ball.r && ball.x <= sim.width-ball.r);
    assert.ok(ball.y >= ball.r && ball.y <= sim.height-ball.r);
  }
});
test("stepping advances simulation time", () => {
  const sim=createSimulation({ powersEnabled: false,seed:"step",count:2});
  stepSimulation(sim,0.05);
  assert.ok(sim.elapsed > 0);
});
test("invalid and non-positive time steps do not mutate simulation", () => {
  const sim=createSimulation({ powersEnabled: false,seed:"safe",count:3});
  const before=structuredClone(sim);
  stepSimulation(sim,0); stepSimulation(sim,-1); stepSimulation(sim,Number.NaN);
  assert.deepEqual(sim,before);
});
test("simulation resolves one winner by the 65-second deadline", () => {
  const sim=createSimulation({ powersEnabled: false,seed:"finish",count:4});
  for(let i=0;i<1400&&!sim.finished;i++) stepSimulation(sim,0.05);
  assert.equal(sim.finished,true);
  assert.ok(sim.elapsed >= 58 && sim.elapsed <= 65.1);
  assert.notEqual(sim.winner,null);
  assert.equal(sim.balls.filter(ball=>ball.alive).length,1);
});
test("seed hashing and random generation are deterministic", () => {
  assert.equal(hashSeed("same"),hashSeed("same"));
  const a=createRandom("same"),b=createRandom("same");
  assert.deepEqual([a(),a(),a()],[b(),b(),b()]);
});

test("simulation clock advances independently of movement speed", () => {
  const slow = createSimulation({ powersEnabled: false, seed: "clock", count: 2 });
  const fast = createSimulation({ powersEnabled: false, seed: "clock", count: 2 });
  for (let i = 0; i < 20; i++) {
    stepSimulation(slow, 0.05, 0.5);
    stepSimulation(fast, 0.05, 2);
  }
  assert.equal(slow.elapsed, fast.elapsed);
  assert.notDeepEqual(slow.balls.map(b => [b.x, b.y]), fast.balls.map(b => [b.x, b.y]));
});

test("head-on collisions reduce health and deal double damage after 50 seconds", () => {
  const normal = createSimulation({ powersEnabled: false, seed: "damage", count: 2, obstacleCount: 0 });
  const doubled = createSimulation({ powersEnabled: false, seed: "damage", count: 2 });
  for (const sim of [normal, doubled]) {
    sim.balls[0].x = 150; sim.balls[0].y = 300; sim.balls[0].vx = 100; sim.balls[0].vy = 0;
    sim.balls[1].x = 165; sim.balls[1].y = 300; sim.balls[1].vx = -100; sim.balls[1].vy = 0;
  }
  normal.elapsed = 1;
  doubled.elapsed = 50;
  stepSimulation(normal, 0.01);
  stepSimulation(doubled, 0.01);
  const normalDamage = 100 - normal.balls[0].health;
  const doubledDamage = 100 - doubled.balls[0].health;
  assert.ok(normalDamage > 0);
  assert.ok(Math.abs(doubledDamage - normalDamage * 2) < 0.01);
});

test("a lethal collision eliminates a ball and declares the survivor winner", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "eliminate", count: 2, obstacleCount: 0 });
  const [a, b] = sim.balls;
  a.x = 150; a.y = 300; a.vx = 100; a.vy = 0; a.health = 1;
  b.x = 165; b.y = 300; b.vx = -100; b.vy = 0;
  stepSimulation(sim, 0.01);
  assert.equal(a.alive, false);
  assert.equal(a.health, 0);
  assert.equal(sim.finished, false, "winner must not be revealed before 58 seconds");
  assert.equal(sim.winner, null);
  for (let i = 0; i < 1200 && !sim.finished; i++) stepSimulation(sim, 0.05);
  assert.equal(sim.finished, true);
  assert.ok(sim.elapsed >= 58 && sim.elapsed <= 65);
  assert.equal(sim.winner, b.id);
});

test("a lone survivor is not declared winner before 58 seconds", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "delayed-victory", count: 3 });
  sim.balls[1].alive = false;
  sim.balls[1].health = 0;
  sim.balls[2].alive = false;
  sim.balls[2].health = 0;
  for (let i = 0; i < 1400 && !sim.finished; i++) stepSimulation(sim, 0.05);
  assert.equal(sim.finished, true);
  assert.ok(sim.elapsed >= 58 && sim.elapsed <= 65);
  assert.equal(sim.winner, sim.balls[0].id);
});

test("obstacle count is clamped and obstacle placement is seed-reproducible", () => {
  const none = createSimulation({ powersEnabled: false, seed: "maps", map: "neon", obstacleCount: 0 });
  const capped = createSimulation({ powersEnabled: false, seed: "maps", map: "neon", obstacleCount: 99 });
  const repeat = createSimulation({ powersEnabled: false, seed: "maps", map: "neon", obstacleCount: 99 });
  assert.equal(none.obstacles.length, 0);
  assert.equal(capped.obstacles.length, 10);
  assert.deepEqual(capped.obstacles, repeat.obstacles);
});

test("each map can be created with zero obstacles", () => {
  for (const map of ["neon", "classic", "orbit"]) {
    const sim = createSimulation({ powersEnabled: false, seed: "empty-arena", map, obstacleCount: 0 });
    assert.equal(sim.obstacles.length, 0, map);
  }
});

test("platform collision reflects a ball away from the impacted face", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "platform-hit", count: 2, map: "classic", obstacleCount: 1 });
  const ball = sim.balls[0];
  const obstacle = sim.obstacles[0];
  ball.x = obstacle.x;
  ball.y = obstacle.y - obstacle.h / 2 - ball.r + 1;
  ball.vx = 0;
  ball.vy = 100;
  sim.balls[1].x = 35;
  sim.balls[1].y = 35;
  sim.balls[1].vx = 0;
  sim.balls[1].vy = 0;
  stepSimulation(sim, 0.01);
  assert.ok(ball.vy < 0);
  assert.ok(sim.collisions > 0);
});

test("double damage and sudden-death flags switch at their exact thresholds", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "thresholds", count: 2, obstacleCount: 0 });
  sim.elapsed = 49.97;
  stepSimulation(sim, 0.02);
  assert.equal(sim.damageMultiplier, 1);
  stepSimulation(sim, 0.02);
  assert.equal(sim.damageMultiplier, 2);
  sim.elapsed = 57.95;
  stepSimulation(sim, 0.02);
  assert.equal(sim.suddenDeath, false);
  stepSimulation(sim, 0.04);
  assert.equal(sim.suddenDeath, true);
});

test("power-up schedules are deterministic and can be disabled", () => {
  const a = createSimulation({ powersEnabled: true, seed: "power-schedule", count: 4 });
  const b = createSimulation({ powersEnabled: true, seed: "power-schedule", count: 4 });
  assert.deepEqual(a.powerups, b.powerups);
  assert.equal(a.powersEnabled, true);
  const off = createSimulation({ powersEnabled: false, seed: "power-schedule", count: 4 });
  assert.equal(off.powersEnabled, false);
});

test("surge pickup grants a temporary speed boost", () => {
  const sim = createSimulation({ powersEnabled: true, seed: "surge-pickup", count: 2, obstacleCount: 0 });
  const ball = sim.balls[0];
  sim.elapsed = 1;
  sim.powerups[0] = { id: 0, type: "surge", x: ball.x, y: ball.y, spawnAt: 0, expiresAt: 10, collected: false };
  stepSimulation(sim, 0.01);
  assert.equal(sim.powerups[0].collected, true);
  assert.ok(ball.speedBoostUntil > sim.elapsed);
});

test("shield reduces collision damage while active", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "shield-test", count: 2, obstacleCount: 0 });
  const [a, b] = sim.balls;
  a.x = 150; a.y = 300; a.vx = 100; a.vy = 0; a.shieldUntil = 10;
  b.x = 165; b.y = 300; b.vx = -100; b.vy = 0;
  stepSimulation(sim, 0.01);
  assert.ok(a.health > 100 - 18);
  assert.ok(a.health > b.health);
});

test("nova pickup damages and pushes nearby opponents", () => {
  const sim = createSimulation({ powersEnabled: true, seed: "nova-pickup", count: 2, obstacleCount: 0 });
  const [a, b] = sim.balls;
  a.x = 150; a.y = 300; a.vx = 0; a.vy = 0;
  b.x = 200; b.y = 300; b.vx = 0; b.vy = 0;
  sim.elapsed = 1;
  sim.powerups[0] = { id: 0, type: "nova", x: a.x, y: a.y, spawnAt: 0, expiresAt: 10, collected: false };
  const beforeHealth = b.health;
  stepSimulation(sim, 0.01);
  assert.equal(sim.powerups[0].collected, true);
  assert.ok(b.health < beforeHealth);
  assert.ok(b.vx > 0);
});

test("Neon Grid spikes damage balls on contact", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "spike-contact", count: 2, map: "neon", obstacleCount: 4 });
  const spikes = sim.obstacles.find(obstacle => obstacle.kind === "spikes");
  assert.ok(spikes, "fourth Neon Grid obstacle should be a spike trap");
  const ball = sim.balls[0];
  ball.x = spikes.x;
  ball.y = spikes.y - spikes.h * 1.8 - ball.r + 1;
  ball.vx = 0;
  ball.vy = 100;
  sim.balls[1].x = 35;
  sim.balls[1].y = 35;
  sim.balls[1].vx = 0;
  sim.balls[1].vy = 0;
  stepSimulation(sim, 0.01);
  assert.equal(ball.health, 92);
  assert.ok(ball.vy < 0);
});

test("Magma Pit lava damages balls on contact", () => {
  const sim = createSimulation({ powersEnabled: false, seed: "lava-contact", count: 2, map: "magma", obstacleCount: 1 });
  const lava = sim.obstacles[0];
  assert.equal(lava.kind, "lava");
  const ball = sim.balls[0];
  ball.x = lava.x;
  ball.y = lava.y - lava.h / 2 - ball.r + 1;
  ball.vx = 0;
  ball.vy = 100;
  sim.balls[1].x = 35;
  sim.balls[1].y = 35;
  sim.balls[1].vx = 0;
  sim.balls[1].vy = 0;
  stepSimulation(sim, 0.01);
  assert.equal(ball.health, 95);
  assert.ok(ball.vy < 0);
});


test("stress test keeps every map finite at obstacle extremes and high movement speed", () => {
  const maps = ["neon", "classic", "orbit", "magma"];
  const obstacleCounts = [0, 1, 4, 10];
  for (const map of maps) {
    for (const obstacleCount of obstacleCounts) {
      const sim = createSimulation({
        seed: `stress-${map}-${obstacleCount}`,
        count: 8,
        map,
        obstacleCount,
        powersEnabled: true
      });
      for (let frame = 0; frame < 1400 && !sim.finished; frame++) {
        stepSimulation(sim, 0.05, 2.4);
        assert.ok(Number.isFinite(sim.elapsed), `${map}/${obstacleCount}: elapsed must remain finite`);
        assert.ok(Number.isFinite(sim.collisions), `${map}/${obstacleCount}: collision count must remain finite`);
        for (const ball of sim.balls) {
          for (const key of ["x", "y", "vx", "vy", "health"]) {
            assert.ok(Number.isFinite(ball[key]), `${map}/${obstacleCount}: ball ${ball.id} ${key} must remain finite`);
          }
          assert.ok(ball.health >= 0 && ball.health <= 100, `${map}/${obstacleCount}: health must remain bounded`);
        }
      }
      assert.equal(sim.finished, true, `${map}/${obstacleCount}: combat must finish before the deadline`);
      assert.ok(sim.elapsed <= 65.1, `${map}/${obstacleCount}: combat exceeded its time limit`);
      assert.equal(sim.balls.filter(ball => ball.alive).length, 1, `${map}/${obstacleCount}: exactly one winner must survive`);
    }
  }
});
