'use strict';

/* -------------------------------------------------
   LANDING PAGE / ENTER EXPERIENCE
-------------------------------------------------- */
const hero = document.getElementById('hero');
const experience = document.getElementById('experience');
const enterBtn = document.getElementById('enterBtn');
const backBtn = document.getElementById('backBtn');

let experienceActive = false;

function enterExperience() {
  experienceActive = true;
  experience.classList.add('active');
  experience.setAttribute('aria-hidden', 'false');
  hero.classList.add('leaving');

  // Resize once the canvas is visible so it always fills the screen correctly.
  requestAnimationFrame(resize);
}

function showHome() {
  experienceActive = false;
  hero.classList.remove('leaving');
  experience.classList.remove('active');
  experience.setAttribute('aria-hidden', 'true');
}

enterBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  enterExperience();
});

backBtn.addEventListener('pointerdown', e => e.stopPropagation());
backBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showHome();
});

/* -------------------------------------------------
   CRYSTAL BURST PROJECT
-------------------------------------------------- */
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const hint = document.getElementById('hint');
const counterEl = document.getElementById('n');

let W = 0, H = 0, DPR = 1;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
}

window.addEventListener('resize', resize);

/* prismatic crystal hue sets — each click steps to the next gem family */
const PALETTES = [
  [188, 205, 172, 196],   // ice / aqua
  [280, 315, 258, 296],   // amethyst / magenta
  [158, 186, 140, 170],   // emerald / mint
  [330, 18, 350, 42],     // rose quartz / gold
  [214, 248, 196, 230]    // sapphire
];

let paletteIndex = 0;
function pickHue() {
  const p = PALETTES[paletteIndex];
  return p[(Math.random() * p.length) | 0] + (Math.random() * 20 - 10);
}

/* ---------- pointer + movement direction ---------- */
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  vx: 0,
  vy: 0
};

const trail = [];

function onMove(x, y) {
  mouse.vx = mouse.vx * 0.76 + (x - mouse.x) * 0.24;
  mouse.vy = mouse.vy * 0.76 + (y - mouse.y) * 0.24;
  mouse.x = x;
  mouse.y = y;

  if (!experienceActive) return;

  if (Math.hypot(mouse.vx, mouse.vy) > 0.9) {
    trail.push({
      x,
      y,
      life: 1,
      hue: pickHue(),
      r: 1 + Math.random() * 2.2
    });

    if (trail.length > 260) trail.shift();
  }
}

window.addEventListener('pointermove', e => {
  onMove(e.clientX, e.clientY);
}, { passive: true });

/* ---------- particle stores ---------- */
const shards = [];
const sparks = [];
const rings = [];
let glow = { x: 0, y: 0, hue: 200, a: 0 };
let clicks = 0;

function burst(x, y) {
  if (!experienceActive) return;

  paletteIndex = (paletteIndex + 1) % PALETTES.length;

  // Direction = the way the mouse was travelling; random if it was still.
  let dx = mouse.vx;
  let dy = mouse.vy;
  let m = Math.hypot(dx, dy);

  if (m < 0.8) {
    const a = Math.random() * Math.PI * 2;
    dx = Math.cos(a);
    dy = Math.sin(a);
    m = 1;
  }

  const dir = Math.atan2(dy, dx);
  const power = Math.min(1 + m / 13, 2.8);

  for (let i = 0; i < 52; i++) {
    const a = dir + (Math.random() - 0.5) * 1.0 + (Math.random() - 0.5) * 0.28;
    const sp = (2.2 + Math.random() * 9.5) * power;

    shards.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      len: 12 + Math.random() * 46,
      wid: 1.6 + Math.random() * 5.4,
      rot: a,
      spin: (Math.random() - 0.5) * 0.05,
      hue: pickHue(),
      life: 1,
      decay: 0.006 + Math.random() * 0.012,
      facet: Math.random() < 0.5 ? 4 : 6
    });
  }

  for (let i = 0; i < 90; i++) {
    const a = dir + (Math.random() - 0.5) * 2.5;
    const sp = (0.5 + Math.random() * 7.5) * power;

    sparks.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: 0.6 + Math.random() * 1.9,
      hue: pickHue(),
      life: 1,
      decay: 0.009 + Math.random() * 0.022
    });
  }

  rings.push({ x, y, r: 4, hue: pickHue(), life: 1, dir, power });
  glow = { x, y, hue: pickHue(), a: 0.9 };

  counterEl.textContent = ++clicks;
  hint.classList.add('gone');
}

window.addEventListener('pointerdown', e => {
  if (!experienceActive) return;
  if (e.target.closest('button')) return;

  onMove(e.clientX, e.clientY);
  burst(e.clientX, e.clientY);
});

window.addEventListener('keydown', e => {
  if (!experienceActive) return;

  if (e.code === 'Space') {
    e.preventDefault();
    burst(mouse.x, mouse.y);
  }
});

window.addEventListener('contextmenu', e => {
  if (experienceActive) e.preventDefault();
});

/* ---------- drawing ---------- */
function drawShard(s) {
  const a = Math.min(1, s.life * 1.5);
  const L = s.len * (0.4 + s.life * 0.6);
  const Wd = Math.max(0.4, s.wid * s.life);

  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot);

  const g = ctx.createLinearGradient(-L / 2, 0, L / 2, 0);
  g.addColorStop(0, `hsla(${s.hue},100%,58%,0)`);
  g.addColorStop(0.45, `hsla(${s.hue},100%,68%,${0.5 * a})`);
  g.addColorStop(0.78, `hsla(${s.hue + 28},100%,88%,${0.95 * a})`);
  g.addColorStop(1, `hsla(${s.hue + 40},100%,100%,0)`);

  ctx.fillStyle = g;
  ctx.beginPath();

  if (s.facet === 4) {
    ctx.moveTo(-L / 2, 0);
    ctx.lineTo(0, -Wd);
    ctx.lineTo(L / 2, 0);
    ctx.lineTo(0, Wd);
  } else {
    ctx.moveTo(-L / 2, 0);
    ctx.lineTo(-L / 6, -Wd);
    ctx.lineTo(L / 4, -Wd * 0.65);
    ctx.lineTo(L / 2, 0);
    ctx.lineTo(L / 4, Wd * 0.65);
    ctx.lineTo(-L / 6, Wd);
  }

  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `hsla(${s.hue + 45},100%,93%,${0.45 * a})`;
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
}

function drawRing(r) {
  const a = r.life * 0.55;

  ctx.save();
  ctx.translate(r.x, r.y);
  ctx.rotate(r.dir);
  ctx.scale(1 + (1 - r.life) * 0.9, 0.62);
  ctx.beginPath();
  ctx.arc(0, 0, r.r, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${r.hue},100%,80%,${a})`;
  ctx.lineWidth = 2.4 * r.life + 0.4;
  ctx.stroke();
  ctx.restore();
}

function drawCursor() {
  if (!experienceActive) return;

  const ang = Math.atan2(mouse.vy, mouse.vx);
  const sp = Math.min(Math.hypot(mouse.vx, mouse.vy), 26);
  const hue = pickHue();

  ctx.save();
  ctx.translate(mouse.x, mouse.y);
  ctx.rotate(ang);

  const L = 12 + sp * 1.5;
  const Wd = 4 + sp * 0.12;
  const g = ctx.createLinearGradient(-L, 0, L * 0.4, 0);

  g.addColorStop(0, `hsla(${hue},100%,60%,0)`);
  g.addColorStop(1, `hsla(${hue},100%,90%,.55)`);

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-L, 0);
  ctx.lineTo(0, -Wd);
  ctx.lineTo(L * 0.4, 0);
  ctx.lineTo(0, Wd);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ---------- animation loop ---------- */
function frame() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,0.17)';
  ctx.fillRect(0, 0, W, H);

  if (experienceActive) {
    ctx.globalCompositeOperation = 'lighter';

    // Click-coloured glow that blooms then decays back to pure black.
    if (glow.a > 0.003) {
      const rad = ctx.createRadialGradient(
        glow.x,
        glow.y,
        0,
        glow.x,
        glow.y,
        Math.max(W, H) * 0.6
      );

      rad.addColorStop(0, `hsla(${glow.hue},100%,62%,${glow.a * 0.20})`);
      rad.addColorStop(0.35, `hsla(${glow.hue + 30},100%,52%,${glow.a * 0.07})`);
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);
      glow.a *= 0.952;
    }

    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.r += 9 * r.power * r.life;
      r.life -= 0.026;

      if (r.life <= 0) {
        rings.splice(i, 1);
        continue;
      }

      drawRing(r);
    }

    for (let i = shards.length - 1; i >= 0; i--) {
      const s = shards[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.vy += 0.028;
      s.rot += s.spin;
      s.life -= s.decay;

      if (s.life <= 0 || s.x < -120 || s.x > W + 120 || s.y > H + 160) {
        shards.splice(i, 1);
        continue;
      }

      drawShard(s);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.973;
      p.vy *= 0.973;
      p.vy += 0.04;
      p.life -= p.decay;

      if (p.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `hsla(${p.hue},100%,${72 + 25 * p.life}%,${p.life * 0.9})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life + 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i];
      t.life -= 0.035;

      if (t.life <= 0) {
        trail.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `hsla(${t.hue},100%,85%,${t.life * 0.35})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2);
      ctx.fill();
    }

    drawCursor();
  }

  requestAnimationFrame(frame);
}

resize();
requestAnimationFrame(frame);
