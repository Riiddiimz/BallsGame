import { createSimulation, stepSimulation } from "./simulation.js";

const $ = (id) => document.getElementById(id);
const canvas = $("arena");
const ctx = canvas.getContext("2d");
const ui = {
  map: $("map-select"), count: $("ball-count"), countValue: $("ball-count-value"),
  obstacleCount: $("obstacle-count"), obstacleCountValue: $("obstacle-count-value"),
  powersEnabled: $("powers-enabled"),
  speed: $("speed"), speedValue: $("speed-value"), seed: $("seed"),
  randomSeed: $("random-seed"), start: $("start"), reset: $("reset"), record: $("record"),
  timer: $("timer"), status: $("status"), overlay: $("overlay"), seedDisplay: $("seed-display"),
  fights: $("stat-fights"), alive: $("stat-alive"), hits: $("stat-hits"), state: $("stat-state")
};
let sim = null, running = false, raf = 0, lastFrame = 0, fights = 0, recorder = null;
const W = 360, H = 640;

function fitCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, sim?.map === "magma" ? "#32101a" : "#0c1630");
  gradient.addColorStop(1, sim?.map === "magma" ? "#100711" : "#080b18");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
  if (sim?.map === "neon") {
    ctx.strokeStyle = "rgba(89,225,244,.12)"; ctx.lineWidth = 1;
    for (let x=0;x<=W;x+=24) {ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for (let y=0;y<=H;y+=24) {ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  } else if (sim?.map === "classic") {
    ctx.strokeStyle = "rgba(255,255,255,.055)";
    for (let y=40;y<H;y+=40) {ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-20,y);ctx.stroke();}
  }
  ctx.strokeStyle = sim?.map === "classic" ? "#45506b" : sim?.map === "magma" ? "#a7433a" : "#31566b";
  ctx.lineWidth = 2; ctx.strokeRect(8, 8, W-16, H-16);
  if (sim?.map === "orbit") {
    ctx.beginPath();ctx.arc(W/2,H/2,W*.105,0,Math.PI*2);ctx.strokeStyle="#a88bff";ctx.lineWidth=3;ctx.shadowColor="#a88bff";ctx.shadowBlur=16;ctx.stroke();ctx.shadowBlur=0;
  }
  if (sim) for (const o of sim.obstacles) {
    if (o.kind === "ring") continue;
    if (o.kind === "lava") {
      const lava = ctx.createLinearGradient(o.x, o.y-o.h/2, o.x, o.y+o.h/2);
      lava.addColorStop(0, "#ff9c48"); lava.addColorStop(0.45, "#ff4b32"); lava.addColorStop(1, "#711b2a");
      ctx.fillStyle = lava; ctx.strokeStyle = "#ffb05c"; ctx.lineWidth = 2;
      ctx.shadowColor = "#ff4b32"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.ellipse(o.x, o.y, o.w/2, o.h/2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      for (let i = 0; i < 5; i++) {
        const bx = o.x - o.w*0.38 + i*o.w*0.19;
        ctx.beginPath(); ctx.ellipse(bx, o.y + Math.sin(sim.elapsed*2+i)*o.h*0.12, o.w*0.035, o.h*0.17, 0, 0, Math.PI*2);
        ctx.fillStyle = "#ffc56a"; ctx.fill();
      }
      continue;
    }
    if (o.kind === "spikes") {
      const left = o.x - o.w / 2, right = o.x + o.w / 2, base = o.y + o.h / 2;
      const count = Math.max(3, Math.floor(o.w / 12));
      ctx.beginPath(); ctx.moveTo(left, base);
      for (let i = 0; i < count; i++) {
        const x0 = left + o.w * i / count, x1 = left + o.w * (i + 0.5) / count, x2 = left + o.w * (i + 1) / count;
        ctx.lineTo(x1, o.y - o.h * 1.8); ctx.lineTo(x2, base);
      }
      ctx.closePath(); ctx.fillStyle = "#7e203f"; ctx.strokeStyle = "#ff5e78"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#ff5e78"; ctx.shadowBlur = 11; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      continue;
    }
    if (sim.map === "classic") {
      ctx.fillStyle = "#1a2638"; ctx.strokeStyle = "#8193ad"; ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
    } else if (sim.map === "orbit") {
      ctx.fillStyle = "#251c42"; ctx.strokeStyle = "#b48aff"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#b48aff"; ctx.shadowBlur = 10;
    } else {
      ctx.fillStyle = "#172e42"; ctx.strokeStyle = "#59e1f4"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#59e1f4"; ctx.shadowBlur = 9;
    }
    ctx.fillRect(o.x-o.w/2,o.y-o.h/2,o.w,o.h);
    ctx.strokeRect(o.x-o.w/2,o.y-o.h/2,o.w,o.h);
    if (sim.map === "classic") {
      ctx.beginPath(); ctx.moveTo(o.x-o.w/2+4,o.y); ctx.lineTo(o.x+o.w/2-4,o.y);
      ctx.strokeStyle = "#a8b6ca"; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.shadowBlur=0;
  }
  if (sim?.powersEnabled) {
    const powerStyle = {
      surge: { color: "#ffdc66", glyph: "⚡" },
      shield: { color: "#59e1f4", glyph: "◇" },
      nova: { color: "#ff78b7", glyph: "✦" }
    };
    for (const pickup of sim.powerups) {
      if (pickup.collected || sim.elapsed < pickup.spawnAt || sim.elapsed > pickup.expiresAt) continue;
      const style = powerStyle[pickup.type];
      const pulse = 1 + Math.sin(sim.elapsed * 7 + pickup.id) * 0.12;
      ctx.beginPath(); ctx.arc(pickup.x, pickup.y, 10 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = style.color + "24"; ctx.fill();
      ctx.beginPath(); ctx.arc(pickup.x, pickup.y, 8 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = style.color; ctx.lineWidth = 1.8; ctx.shadowColor = style.color; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = style.color; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(style.glyph, pickup.x, pickup.y + 0.5);
    }
    ctx.textBaseline = "alphabetic";
  }
  if (sim?.elapsed >= 50 && !sim.finished) {
    ctx.fillStyle = "rgba(255,72,100,.14)"; ctx.fillRect(8, 8, W-16, 27);
    ctx.fillStyle = "#ff8294"; ctx.font = "700 11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(sim.suddenDeath ? "MORT SUBITE — DÉGÂTS ×2" : "DÉGÂTS ×2", W/2, 25);
  }
  if (sim) for (const ball of sim.balls) {
    if (!ball.alive) continue;
    const g=ctx.createRadialGradient(ball.x-ball.r*.35,ball.y-ball.r*.4,1,ball.x,ball.y,ball.r*1.4);
    g.addColorStop(0,"#ffffff");g.addColorStop(.18,ball.color);g.addColorStop(1,ball.color+"55");
    ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle=g;ctx.shadowColor=ball.color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;
    ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r+3,0,Math.PI*2);ctx.strokeStyle=ball.damageFlash>0?"#ffffff":ball.color+"55";ctx.lineWidth=ball.damageFlash>0?2:1;ctx.stroke();
    ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r+6,-Math.PI/2,-Math.PI/2+(Math.PI*2*Math.max(0,ball.health)/100));
    ctx.strokeStyle=ball.health>50?"#7cf7c2":ball.health>25?"#ffce70":"#ff647c";ctx.lineWidth=2.5;ctx.stroke();
    if (ball.shieldUntil > sim.elapsed) {
      ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r+10,0,Math.PI*2);
      ctx.strokeStyle="#59e1f4"; ctx.lineWidth=2; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    }
    if (ball.speedBoostUntil > sim.elapsed) {
      ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r+9,0,Math.PI*2);
      ctx.strokeStyle="#ffdc66"; ctx.lineWidth=2; ctx.stroke();
    }
    if (ball.powerFlash > 0) {
      ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r+13*(1-ball.powerFlash/0.55),0,Math.PI*2);
      ctx.strokeStyle="#ff78b7"; ctx.lineWidth=2; ctx.stroke();
    }
  }
  if (sim?.finished && sim.winner !== null) {
    const winner=sim.balls.find(b=>b.id===sim.winner);
    ctx.fillStyle="#070b17cc";ctx.fillRect(15,H/2-42,W-30,84);
    ctx.strokeStyle=winner?.color||"#59e1f4";ctx.strokeRect(15,H/2-42,W-30,84);
    ctx.fillStyle="#f4f7ff";ctx.font="600 15px sans-serif";ctx.textAlign="center";ctx.fillText("VICTOIRE",W/2,H/2-7);
    ctx.fillStyle=winner?.color||"#59e1f4";ctx.font="bold 22px sans-serif";ctx.fillText("BOULE "+(sim.winner+1),W/2,H/2+22);
  }
}
function refreshStats() {
  const alive=sim?.balls.filter(b=>b.alive).length ?? Number(ui.count.value);
  ui.alive.textContent=String(alive).padStart(2,"0");
  ui.hits.textContent=String(sim?.collisions ?? 0).padStart(3,"0");
  ui.fights.textContent=String(fights).padStart(2,"0");
  ui.timer.textContent=formatTime(sim?.elapsed ?? 0);
  ui.seedDisplay.textContent="SEED: "+(sim?.seed ?? ui.seed.value);
  ui.state.textContent=sim?.finished?"FINISHED":running?"RUNNING":"STANDBY";
}
function formatTime(seconds) { const total=Math.floor(seconds);return String(Math.floor(total/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0"); }
function newSimulation() {
  running=false; cancelAnimationFrame(raf);
  sim=createSimulation({seed:ui.seed.value.trim()||"BALLS-2026",count:Number(ui.count.value),map:ui.map.value,obstacleCount:Number(ui.obstacleCount.value),powersEnabled:ui.powersEnabled.checked,width:W,height:H});
  ui.overlay.hidden=true;ui.status.textContent="PRÊT À LANCER";ui.start.innerHTML="<span>▶</span> Lancer le combat";
  draw();refreshStats();
}
function tick(now) {
  if (!running || !sim) return;
  if (!lastFrame) lastFrame=now;
  const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;
  stepSimulation(sim,dt,Number(ui.speed.value));
  if (sim.finished) {
    running=false;ui.status.textContent="COMBAT TERMINÉ";ui.start.innerHTML="<span>↻</span> Nouveau combat";
    if (recorder?.state==="recording") recorder.stop();
  } else ui.status.textContent=recorder?.state==="recording"?"ENREGISTREMENT — COMBAT EN COURS":"COMBAT EN COURS";
  draw();refreshStats();
  if (running) raf=requestAnimationFrame(tick);
}
ui.start.addEventListener("click",()=>{
  if (!sim || sim.finished) {newSimulation();fights++;}
  running=!running;lastFrame=0;
  ui.start.innerHTML=running?"Ⅱ Mettre en pause":"▶ Reprendre";
  ui.status.textContent=running?"COMBAT EN COURS":"PAUSE";
  if (running) raf=requestAnimationFrame(tick); else cancelAnimationFrame(raf);
  refreshStats();
});
ui.reset.addEventListener("click",()=>{newSimulation();ui.overlay.hidden=false;ui.status.textContent="PRÊT À LANCER";});
ui.count.addEventListener("input",()=>{ui.countValue.textContent=ui.count.value;newSimulation();});
ui.obstacleCount.addEventListener("input",()=>{ui.obstacleCountValue.textContent=ui.obstacleCount.value;newSimulation();});
ui.powersEnabled.addEventListener("change",newSimulation);
ui.speed.addEventListener("input",()=>{ui.speedValue.textContent=Number(ui.speed.value).toFixed(2).replace(/0$/,"")+"×";});
ui.map.addEventListener("change",newSimulation);
ui.seed.addEventListener("change",()=>{ui.seed.value=ui.seed.value.trim().slice(0,40)||"BALLS-2026";newSimulation();});
ui.randomSeed.addEventListener("click",()=>{ui.seed.value="BG-"+Math.random().toString(36).slice(2,10).toUpperCase();newSimulation();});
ui.record.addEventListener("click", () => {
  if (recorder?.state === "recording") {
    ui.record.disabled = true;
    ui.record.textContent = "Finalisation vidéo…";
    recorder.stop();
    return;
  }
  if (!canvas.captureStream || !window.MediaRecorder) {
    ui.status.textContent = "ENREGISTREMENT NON DISPONIBLE";
    return;
  }

  let stream = null;
  let activeRecorder = null;
  try {
    stream = canvas.captureStream(30);
    const mime = [
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ].find((type) => MediaRecorder.isTypeSupported(type));

    activeRecorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorder = activeRecorder;
    const chunks = [];
    activeRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    activeRecorder.onstop = () => {
      const mimeType = activeRecorder.mimeType || "video/webm";
      const extension = mimeType.toLowerCase().includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunks, { type: mimeType });
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ballsgame-" + recordedSeed + "." + extension;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      stream.getTracks().forEach((track) => track.stop());
      if (recorder === activeRecorder) recorder = null;
      ui.record.disabled = false;
      ui.record.textContent = "● Enregistrer vidéo";
      ui.status.textContent = running ? "COMBAT EN COURS" : "VIDÉO " + extension.toUpperCase() + " EXPORTÉE";
    };
    activeRecorder.onerror = () => {
      stream?.getTracks().forEach((track) => track.stop());
      if (recorder === activeRecorder) recorder = null;
      ui.record.disabled = false;
      ui.record.textContent = "● Enregistrer vidéo";
      ui.status.textContent = "ÉCHEC DE L’ENREGISTREMENT";
    };

    newSimulation();
    const recordedSeed = sim?.seed || "combat";
    activeRecorder.start();
    running = true;
    fights++;
    lastFrame = 0;
    raf = requestAnimationFrame(tick);
    ui.start.innerHTML = "Ⅱ Mettre en pause";
    ui.record.disabled = false;
    ui.record.textContent = "■ Arrêter l’enregistrement";
    ui.status.textContent = "ENREGISTREMENT — COMBAT EN COURS";
    refreshStats();
  } catch {
    stream?.getTracks().forEach((track) => track.stop());
    if (recorder === activeRecorder) recorder = null;
    ui.record.disabled = false;
    ui.record.textContent = "● Enregistrer vidéo";
    ui.status.textContent = "ÉCHEC DE L’ENREGISTREMENT";
  }
});
window.addEventListener("resize",fitCanvas);
newSimulation();ui.overlay.hidden=false;fitCanvas();