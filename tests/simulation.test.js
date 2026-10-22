import test from "node:test";
import assert from "node:assert/strict";
import { createSimulation, createRandom, hashSeed, stepSimulation } from "../src/simulation.js";

test("same seed and options produce identical starting states", () => {
  const a = createSimulation({ seed: "repeatable", count: 5, map: "neon" });
  const b = createSimulation({ seed: "repeatable", count: 5, map: "neon" });
  assert.deepEqual(a.balls, b.balls);
  assert.equal(a.seed, b.seed);
});
test("different seeds produce different starting states", () => {
  assert.notDeepEqual(createSimulation({seed:"alpha"}).balls, createSimulation({seed:"beta"}).balls);
});
test("participant count is clamped to supported range", () => {
  assert.equal(createSimulation({count:1}).balls.length, 2);
  assert.equal(createSimulation({count:100}).balls.length, 8);
});
test("starting balls stay within arena bounds", () => {
  const sim=createSimulation({seed:"bounds",count:8,width:360,height:640});
  for (const ball of sim.balls) {
    assert.ok(ball.x >= ball.r && ball.x <= sim.width-ball.r);
    assert.ok(ball.y >= ball.r && ball.y <= sim.height-ball.r);
  }
});
test("stepping advances simulation time", () => {
  const sim=createSimulation({seed:"step",count:2});
  stepSimulation(sim,0.05);
  assert.ok(sim.elapsed > 0);
});
test("invalid and non-positive time steps do not mutate simulation", () => {
  const sim=createSimulation({seed:"safe",count:3});
  const before=structuredClone(sim);
  stepSimulation(sim,0); stepSimulation(sim,-1); stepSimulation(sim,Number.NaN);
  assert.deepEqual(sim,before);
});
test("simulation terminates at 60 seconds", () => {
  const sim=createSimulation({seed:"finish",count:4});
  for(let i=0;i<1300&&!sim.finished;i++) stepSimulation(sim,0.05);
  assert.equal(sim.finished,true);
  assert.ok(sim.elapsed>=60);
});
test("seed hashing and random generation are deterministic", () => {
  assert.equal(hashSeed("same"),hashSeed("same"));
  const a=createRandom("same"),b=createRandom("same");
  assert.deepEqual([a(),a(),a()],[b(),b(),b()]);
});

test("simulation clock advances independently of movement speed", () => {
  const slow = createSimulation({ seed: "clock", count: 2 });
  const fast = createSimulation({ seed: "clock", count: 2 });
  for (let i = 0; i < 20; i++) {
    stepSimulation(slow, 0.05, 0.5);
    stepSimulation(fast, 0.05, 2);
  }
  assert.equal(slow.elapsed, fast.elapsed);
  assert.notDeepEqual(slow.balls.map(b => [b.x, b.y]), fast.balls.map(b => [b.x, b.y]));
});
