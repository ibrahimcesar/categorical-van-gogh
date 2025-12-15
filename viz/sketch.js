/**
 * Turbulent Brushstrokes — Categorical Van Gogh
 *
 * A generative art piece inspired by Van Gogh's brushwork patterns,
 * particularly the turbulent flow patterns in Starry Night.
 *
 * Based on research by Kolmogorov on turbulence in Van Gogh's work.
 * Designed for museum projection.
 *
 * Controls:
 *   SPACE - Pause/Resume
 *   1-5   - Switch color periods
 *   R     - Reset particles
 *   F     - Toggle fullscreen
 *   H     - Hide/show info
 */

// ============================================
// VAN GOGH COLOR PALETTES BY PERIOD
// ============================================

const PALETTES = {
  nuenen: {
    name: "The Potato Eaters",
    desc: "Nuenen, 1885 — Earth and shadows",
    colors: [
      [72, 60, 50],    // dark brown
      [101, 83, 67],   // warm brown
      [139, 119, 92],  // ochre
      [62, 54, 46],    // deep shadow
      [156, 136, 104], // light earth
      [45, 40, 35],    // near black
    ],
    background: [25, 22, 18],
    turbulence: 0.6,
    speed: 0.8
  },

  paris: {
    name: "Impressionist Light",
    desc: "Paris, 1886-87 — Discovery of color",
    colors: [
      [180, 160, 200], // soft violet
      [200, 180, 140], // warm cream
      [140, 170, 180], // pale blue
      [190, 170, 150], // soft peach
      [160, 180, 160], // sage green
      [210, 190, 170], // light rose
    ],
    background: [40, 38, 45],
    turbulence: 0.4,
    speed: 1.0
  },

  arles: {
    name: "Sunflowers",
    desc: "Arles, 1888 — Yellow and blue ecstasy",
    colors: [
      [255, 200, 50],  // sunflower yellow
      [255, 170, 30],  // deep gold
      [60, 80, 170],   // cobalt blue
      [255, 220, 100], // pale yellow
      [40, 60, 130],   // prussian blue
      [200, 140, 40],  // amber
    ],
    background: [20, 25, 50],
    turbulence: 0.5,
    speed: 1.2
  },

  starryNight: {
    name: "Starry Night",
    desc: "Saint-Rémy, 1889 — Turbulent skies",
    colors: [
      [40, 60, 130],   // deep blue
      [70, 100, 170],  // mid blue
      [255, 230, 120], // star yellow
      [100, 140, 190], // sky blue
      [30, 45, 100],   // night blue
      [255, 200, 80],  // warm yellow
      [50, 80, 150],   // swirl blue
    ],
    background: [15, 20, 40],
    turbulence: 1.0,
    speed: 1.5
  },

  almond: {
    name: "Almond Blossoms",
    desc: "Saint-Rémy, 1890 — Serenity",
    colors: [
      [130, 180, 200], // sky blue
      [255, 250, 250], // white blossom
      [180, 140, 100], // branch brown
      [160, 200, 210], // pale blue
      [255, 220, 220], // pink blush
      [100, 160, 180], // deeper blue
    ],
    background: [60, 100, 120],
    turbulence: 0.3,
    speed: 0.7
  }
};

// ============================================
// GLOBAL STATE
// ============================================

let particles = [];
let flowField;
let cols, rows;
const SCALE = 20;
const NUM_PARTICLES = 2000;

let currentPalette;
let targetPalette;
let paletteTransition = 1.0;
let paletteCycleTimer = 0;
const PALETTE_DURATION = 30000; // 30 seconds per palette

let isPaused = false;
let showInfo = true;
let zOffset = 0;

// ============================================
// P5.JS SETUP
// ============================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);

  cols = floor(width / SCALE) + 1;
  rows = floor(height / SCALE) + 1;
  flowField = new Array(cols * rows);

  // Start with Starry Night
  currentPalette = PALETTES.starryNight;
  targetPalette = currentPalette;

  // Initialize particles
  initParticles();

  // Subtle background
  background(currentPalette.background);
}

function initParticles() {
  particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }
}

// ============================================
// P5.JS DRAW LOOP
// ============================================

function draw() {
  if (isPaused) return;

  // Semi-transparent background for trail effect
  let bg = lerpColor(
    color(currentPalette.background),
    color(targetPalette.background),
    1 - paletteTransition
  );
  bg.setAlpha(0.05);

  // Apply background fade
  push();
  blendMode(BLEND);
  noStroke();
  fill(bg);
  rect(0, 0, width, height);
  pop();

  // Auto-cycle palettes
  paletteCycleTimer += deltaTime;
  if (paletteCycleTimer > PALETTE_DURATION) {
    cyclePalette();
    paletteCycleTimer = 0;
  }

  // Handle palette transition
  if (paletteTransition < 1.0) {
    paletteTransition += 0.005;
    if (paletteTransition >= 1.0) {
      paletteTransition = 1.0;
      currentPalette = targetPalette;
    }
  }

  // Calculate turbulence for current period
  let turb = lerp(currentPalette.turbulence, targetPalette.turbulence, 1 - paletteTransition);
  let spd = lerp(currentPalette.speed, targetPalette.speed, 1 - paletteTransition);

  // Update flow field
  updateFlowField(turb);

  // Update and draw particles
  for (let particle of particles) {
    particle.follow(flowField, spd);
    particle.update();
    particle.edges();
    particle.show();
  }

  // Slowly evolve the field
  zOffset += 0.002 * turb;
}

// ============================================
// FLOW FIELD (TURBULENCE)
// ============================================

function updateFlowField(turbulence) {
  let yOff = 0;
  for (let y = 0; y < rows; y++) {
    let xOff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      // Multi-octave noise for more organic turbulence
      let angle = noise(xOff, yOff, zOffset) * TWO_PI * 2;

      // Add secondary swirl patterns (inspired by Starry Night spirals)
      let cx = width / 2;
      let cy = height / 2;
      let dx = x * SCALE - cx;
      let dy = y * SCALE - cy;
      let distFromCenter = sqrt(dx * dx + dy * dy);
      let spiralInfluence = sin(distFromCenter * 0.01 + zOffset * 2) * turbulence;

      angle += spiralInfluence;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;

      xOff += 0.1 * turbulence;
    }
    yOff += 0.1 * turbulence;
  }
}

// ============================================
// PARTICLE CLASS (BRUSHSTROKES)
// ============================================

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.prevPos = this.pos.copy();

    this.pickColor();
    this.strokeWeight = random(1, 4);
    this.life = random(100, 400);
    this.maxLife = this.life;
  }

  pickColor() {
    // Blend between current and target palette colors
    let colors1 = currentPalette.colors;
    let colors2 = targetPalette.colors;

    let c1 = random(colors1);
    let c2 = random(colors2);

    let t = 1 - paletteTransition;
    this.color = [
      lerp(c1[0], c2[0], t),
      lerp(c1[1], c2[1], t),
      lerp(c1[2], c2[2], t)
    ];
  }

  follow(vectors, speedMult) {
    let x = floor(this.pos.x / SCALE);
    let y = floor(this.pos.y / SCALE);
    let index = x + y * cols;
    let force = vectors[index];
    if (force) {
      force = force.copy();
      force.mult(speedMult);
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.life--;
    if (this.life <= 0) {
      this.respawn();
    }
  }

  respawn() {
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.vel.mult(0);
    this.life = random(100, 400);
    this.maxLife = this.life;
    this.pickColor();
    this.strokeWeight = random(1, 4);
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = this.pos.y;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = this.pos.y;
    }
  }

  show() {
    let alpha = map(this.life, 0, this.maxLife, 0, 0.8);

    stroke(this.color[0], this.color[1], this.color[2], alpha);
    strokeWeight(this.strokeWeight);

    // Draw brushstroke as line from previous to current position
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);

    this.prevPos = this.pos.copy();
  }
}

// ============================================
// PALETTE TRANSITIONS
// ============================================

function cyclePalette() {
  const paletteNames = Object.keys(PALETTES);
  let currentIndex = paletteNames.findIndex(name => PALETTES[name] === currentPalette);
  let nextIndex = (currentIndex + 1) % paletteNames.length;

  switchToPalette(paletteNames[nextIndex]);
}

function switchToPalette(name) {
  if (PALETTES[name] && PALETTES[name] !== targetPalette) {
    targetPalette = PALETTES[name];
    paletteTransition = 0;
    updateInfoDisplay();
  }
}

function updateInfoDisplay() {
  let nameEl = document.getElementById('period-name');
  let descEl = document.getElementById('period-desc');
  if (nameEl && descEl) {
    nameEl.textContent = targetPalette.name;
    descEl.textContent = targetPalette.desc;
  }
}

// ============================================
// USER INTERACTION
// ============================================

function keyPressed() {
  // Number keys 1-5 switch palettes
  if (key === '1') switchToPalette('nuenen');
  if (key === '2') switchToPalette('paris');
  if (key === '3') switchToPalette('arles');
  if (key === '4') switchToPalette('starryNight');
  if (key === '5') switchToPalette('almond');

  // Space to pause
  if (key === ' ') {
    isPaused = !isPaused;
  }

  // R to reset
  if (key === 'r' || key === 'R') {
    background(currentPalette.background);
    initParticles();
    zOffset = 0;
  }

  // F for fullscreen
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  // H to hide info
  if (key === 'h' || key === 'H') {
    showInfo = !showInfo;
    let info = document.getElementById('info');
    if (info) {
      info.style.opacity = showInfo ? '1' : '0';
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / SCALE) + 1;
  rows = floor(height / SCALE) + 1;
  flowField = new Array(cols * rows);
  background(currentPalette.background);
}

// Optional: Mouse interaction adds turbulence
function mouseMoved() {
  // Add slight attraction to mouse position
  for (let i = 0; i < 5; i++) {
    let idx = floor(random(particles.length));
    let p = particles[idx];
    let d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
    if (d < 200) {
      let force = createVector(mouseX - p.pos.x, mouseY - p.pos.y);
      force.setMag(0.5);
      p.applyForce(force);
    }
  }
}
