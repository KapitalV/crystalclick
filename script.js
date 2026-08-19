```javascript
"use strict";

/* ==========================================
   CANVAS SETUP
========================================== */

const canvas =
  document.getElementById("canvas");

const ctx =
  canvas.getContext("2d");

const particleCount =
  document.getElementById("particleCount");

const modeNumber =
  document.getElementById("modeNumber");

const startBtn =
  document.getElementById("startBtn");

const content =
  document.querySelector(".content");

let width = 0;
let height = 0;
let dpr = 1;

function resize() {

  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  width =
    window.innerWidth;

  height =
    window.innerHeight;

  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;

  canvas.style.width =
    width + "px";

  canvas.style.height =
    height + "px";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}

window.addEventListener(
  "resize",
  resize
);


/* ==========================================
   MOUSE
========================================== */

const mouse = {

  x: width / 2,
  y: height / 2,

  vx: 0,
  vy: 0,

  active: false
};

window.addEventListener(
  "pointermove",
  event => {

    mouse.vx =
      event.clientX - mouse.x;

    mouse.vy =
      event.clientY - mouse.y;

    mouse.x =
      event.clientX;

    mouse.y =
      event.clientY;

    mouse.active = true;
  }
);


/* ==========================================
   PARTICLES
========================================== */

const particles = [];

const pulses = [];

const colors = [

  [80, 200, 255],

  [150, 90, 255],

  [255, 80, 210],

  [70, 255, 210],

  [255, 190, 90]

];

let currentMode = 1;

let time = 0;


/* ==========================================
   CREATE PARTICLE
========================================== */

function createParticle() {

  const angle =
    Math.random() *
    Math.PI *
    2;

  const radius =
    Math.random() *
    Math.min(
      width,
      height
    ) *
    0.65;

  const centerX =
    width / 2;

  const centerY =
    height / 2;

  const color =
    colors[
      Math.floor(
        Math.random() *
        colors.length
      )
    ];

  return {

    x:
      centerX +
      Math.cos(angle) *
      radius,

    y:
      centerY +
      Math.sin(angle) *
      radius *
      0.55,

    vx:
      -Math.sin(angle) *
      (0.5 + Math.random()),

    vy:
      Math.cos(angle) *
      (0.5 + Math.random()),

    size:
      0.5 +
      Math.random() * 2.2,

    color,

    angle,

    radius,

    pulse:
      Math.random() *
      Math.PI *
      2
  };
}


/* ==========================================
   CREATE GALAXY
========================================== */

function createGalaxy() {

  particles.length = 0;

  const amount =
    Math.min(
      1800,
      Math.max(
        700,
        Math.floor(
          width * height / 850
        )
      )
    );

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    particles.push(
      createParticle()
    );
  }

  particleCount.textContent =
    particles.length;
}


/* ==========================================
   UPDATE PARTICLE
========================================== */

function updateParticle(p) {

  const centerX =
    width / 2;

  const centerY =
    height / 2;

  const dx =
    centerX - p.x;

  const dy =
    centerY - p.y;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    ) + 0.001;


  /* --------------------------------
     GALAXY MODE
  -------------------------------- */

  if (currentMode === 1) {

    p.vx +=
      -dy /
      distance *
      0.035;

    p.vy +=
      dx /
      distance *
      0.035;

    p.vx +=
      dx /
      distance *
      0.001;

    p.vy +=
      dy /
      distance *
      0.001;
  }


  /* --------------------------------
     VORTEX MODE
  -------------------------------- */

  if (currentMode === 2) {

    p.vx +=
      -dy /
      distance *
      0.08;

    p.vy +=
      dx /
      distance *
      0.08;

    p.vx +=
      dx /
      distance *
      0.015;

    p.vy +=
      dy /
      distance *
      0.015;
  }


  /* --------------------------------
     WAVE MODE
  -------------------------------- */

  if (currentMode === 3) {

    p.vy +=
      Math.sin(
        p.x * 0.012 +
        time * 0.03
      ) *
      0.08;

    p.vx +=
      Math.cos(
        p.y * 0.01 +
        time * 0.02
      ) *
      0.04;
  }


  /* --------------------------------
     CHAOS MODE
  -------------------------------- */

  if (currentMode === 4) {

    p.vx +=
      Math.sin(
        p.y * 0.015 +
        time * 0.04
      ) *
      0.07;

    p.vy +=
      Math.cos(
        p.x * 0.015 +
        time * 0.03
      ) *
      0.07;
  }


  /* =================================
     MOUSE GRAVITY
  ================================= */

  if (mouse.active) {

    const mx =
      mouse.x - p.x;

    const my =
      mouse.y - p.y;

    const md =
      Math.sqrt(
        mx * mx +
        my * my
      );

    if (md < 300) {

      const force =
        (1 - md / 300) *
        0.7;

      p.vx +=
        mx /
        (md || 1) *
        force;

      p.vy +=
        my /
        (md || 1) *
        force;

      /*
        Mouse movement
        creates a flowing force.
      */

      p.vx +=
        mouse.vx *
        0.004;

      p.vy +=
        mouse.vy *
        0.004;
    }
  }


  /* =================================
     PULSES
  ================================= */

  for (const pulse of pulses) {

    const dx =
      p.x - pulse.x;

    const dy =
      p.y - pulse.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    const difference =
      Math.abs(
        distance -
        pulse.radius
      );

    if (difference < 90) {

      const force =
        (1 -
          difference / 90) *
        pulse.strength;

      p.vx +=
        dx /
        (distance || 1) *
        force;

      p.vy +=
        dy /
        (distance || 1) *
        force;
    }
  }


  /* =================================
     LIMIT SPEED
  ================================= */

  const speed =
    Math.sqrt(
      p.vx * p.vx +
      p.vy * p.vy
    );

  const maxSpeed = 7;

  if (speed > maxSpeed) {

    p.vx =
      p.vx /
      speed *
      maxSpeed;

    p.vy =
      p.vy /
      speed *
      maxSpeed;
  }


  /* =================================
     MOVE
  ================================= */

  p.x += p.vx;
  p.y += p.vy;

  p.vx *= 0.986;
  p.vy *= 0.986;

  p.pulse += 0.04;


  /* =================================
     SCREEN WRAP
  ================================= */

  if (p.x < -50)
    p.x = width + 50;

  if (p.x > width + 50)
    p.x = -50;

  if (p.y < -50)
    p.y = height + 50;

  if (p.y > height + 50)
    p.y = -50;
}


/* ==========================================
   DRAW PARTICLE
========================================== */

function drawParticle(p) {

  const [r, g, b] =
    p.color;

  const brightness =
    0.65 +
    Math.sin(p.pulse) *
    0.25;


  /* Glow */

  const glow =
    ctx.createRadialGradient(
      p.x,
      p.y,
      0,
      p.x,
      p.y,
      p.size * 7
    );

  glow.addColorStop(
    0,
    `rgba(
      ${r},
      ${g},
      ${b},
      ${brightness}
    )`
  );

  glow.addColorStop(
    0.25,
    `rgba(
      ${r},
      ${g},
      ${b},
      ${brightness * 0.3}
    )`
  );

  glow.addColorStop(
    1,
    `rgba(
      ${r},
      ${g},
      ${b},
      0
    )`
  );

  ctx.fillStyle =
    glow;

  ctx.beginPath();

  ctx.arc(
    p.x,
    p.y,
    p.size * 7,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* Core */

  ctx.fillStyle =
    `rgba(
      255,
      255,
      255,
      ${brightness}
    )`;

  ctx.beginPath();

  ctx.arc(
    p.x,
    p.y,
    p.size,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* ==========================================
   CREATE PULSE
========================================== */

function createPulse(x, y) {

  pulses.push({

    x,

    y,

    radius: 5,

    strength: 1,

    life: 1
  });
}


/* ==========================================
   DRAW PULSE
========================================== */

function drawPulse(pulse) {

  ctx.beginPath();

  ctx.arc(
    pulse.x,
    pulse.y,
    pulse.radius,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    `rgba(
      120,
      210,
      255,
      ${pulse.life}
    )`;

  ctx.lineWidth =
    2 +
    pulse.life * 4;

  ctx.shadowBlur = 25;

  ctx.shadowColor =
    "rgba(100,210,255,.8)";

  ctx.stroke();

  ctx.shadowBlur = 0;
}


/* ==========================================
   CLICK
========================================== */

window.addEventListener(
  "pointerdown",
  event => {

    createPulse(
      event.clientX,
      event.clientY
    );

    /*
      Add explosion particles.
    */

    for (
      let i = 0;
      i < 35;
      i++
    ) {

      const angle =
        Math.random() *
        Math.PI *
        2;

      const speed =
        2 +
        Math.random() * 7;

      const p =
        createParticle();

      p.x =
        event.clientX;

      p.y =
        event.clientY;

      p.vx =
        Math.cos(angle) *
        speed;

      p.vy =
        Math.sin(angle) *
        speed;

      particles.push(p);
    }

    particleCount.textContent =
      particles.length;
  }
);


/* ==========================================
   CHANGE MODE
========================================== */

window.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      " "
    ) {

      createPulse(
        mouse.x,
        mouse.y
      );
    }

    if (
      event.key ===
      "ArrowRight"
    ) {

      changeMode(1);
    }

    if (
      event.key ===
      "ArrowLeft"
    ) {

      changeMode(-1);
    }
  }
);


function changeMode(direction) {

  currentMode +=
    direction;

  if (
    currentMode > 4
  )
    currentMode = 1;

  if (
    currentMode < 1
  )
    currentMode = 4;

  modeNumber.textContent =
    String(currentMode)
      .padStart(2, "0");
}


/* ==========================================
   START BUTTON
========================================== */

startBtn.addEventListener(
  "click",
  () => {

    content.classList.add(
      "hidden"
    );

    setTimeout(() => {

      content.style.display =
        "none";

    }, 800);
  }
);


/* ==========================================
   ANIMATION
========================================== */

function animate() {

  time++;


  /*
    Dark transparent layer
    creates motion trails.
  */

  ctx.globalCompositeOperation =
    "source-over";

  ctx.fillStyle =
    "rgba(2,3,10,0.13)";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  ctx.globalCompositeOperation =
    "lighter";


  /* Particles */

  for (const particle of particles) {

    updateParticle(
      particle
    );

    drawParticle(
      particle
    );
  }


  /* Pulses */

  for (
    let i = pulses.length - 1;
    i >= 0;
    i--
  ) {

    const pulse =
      pulses[i];

    pulse.radius += 11;

    pulse.life *= 0.965;

    pulse.strength *= 0.98;

    drawPulse(pulse);

    if (
      pulse.life < 0.02
    ) {

      pulses.splice(
        i,
        1
      );
    }
  }


  requestAnimationFrame(
    animate
  );
}


/* ==========================================
   START
========================================== */

resize();

createGalaxy();

animate();
```
