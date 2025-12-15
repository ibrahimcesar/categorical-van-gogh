/**
 * Turbulent Brushstrokes — Categorical Van Gogh
 *
 * A generative art piece using AUTHENTIC Van Gogh brushwork patterns
 * per period, with Kolmogorov turbulence modeling for Starry Night.
 *
 * Based on:
 * - Aragon et al. "Turbulent Luminance in Impassioned van Gogh Paintings"
 * - Kolmogorov's -5/3 power law for turbulent energy cascade
 * - Batchelor scaling for small-scale mixing
 *
 * Brushstroke techniques:
 * - Nuenen (1885): Heavy impasto, short bold dabs
 * - Paris (1886-87): Pointillist dots (Seurat influence)
 * - Arles (1888): Directional parallel strokes, thick impasto
 * - Starry Night (1889): Concentric swirls, Kolmogorov turbulence
 * - Almond Blossoms (1890): Flowing Japanese-inspired curves
 *
 * Controls:
 *   SPACE - Pause/Resume
 *   1-5   - Switch color periods
 *   R     - Reset
 *   F     - Toggle fullscreen
 *   H     - Hide/show info
 */

// ============================================
// VAN GOGH PERIODS WITH AUTHENTIC TECHNIQUES
// ============================================

const PERIODS = {
  nuenen: {
    name: "The Potato Eaters",
    desc: "Nuenen, 1885 — Heavy impasto, peasant earth",
    colors: [
      [72, 60, 50],     // dark brown
      [101, 83, 67],    // warm brown
      [139, 119, 92],   // ochre
      [62, 54, 46],     // deep shadow
      [156, 136, 104],  // light earth
      [45, 40, 35],     // near black
      [120, 95, 70],    // mid brown
    ],
    background: [25, 22, 18],
    // Brushstroke parameters
    strokeType: 'impasto',      // Short, thick dabs
    strokeLength: [8, 20],      // Short strokes
    strokeWidth: [4, 10],       // Heavy thickness
    strokeCurve: 0.1,           // Minimal curve
    flowComplexity: 0.3,        // Simple, heavy movement
    speed: 0.6
  },

  paris: {
    name: "Neo-Impressionist Light",
    desc: "Paris, 1886-87 — Pointillist dots after Seurat",
    colors: [
      [200, 100, 100],  // rose
      [100, 150, 200],  // sky blue
      [200, 200, 100],  // lemon yellow
      [150, 200, 150],  // soft green
      [200, 150, 200],  // lavender
      [255, 200, 150],  // peach
      [100, 180, 180],  // turquoise
      [220, 180, 140],  // cream
    ],
    background: [45, 42, 50],
    strokeType: 'pointillist',  // Dots like Seurat
    strokeLength: [2, 6],       // Tiny dots
    strokeWidth: [3, 8],        // Dot diameter
    strokeCurve: 0,             // No curve - dots
    flowComplexity: 0.4,
    speed: 0.8
  },

  arles: {
    name: "Sunflowers",
    desc: "Arles, 1888 — Single flow of impasto, parallel strokes",
    colors: [
      [255, 200, 50],   // sunflower yellow
      [255, 170, 30],   // deep gold
      [255, 220, 100],  // pale yellow
      [200, 140, 40],   // amber
      [60, 80, 170],    // cobalt blue
      [40, 60, 130],    // prussian blue
      [255, 150, 50],   // orange
      [180, 120, 30],   // bronze
    ],
    background: [20, 25, 50],
    strokeType: 'directional',  // Parallel flowing strokes
    strokeLength: [25, 60],     // Long strokes
    strokeWidth: [3, 7],        // Medium-thick
    strokeCurve: 0.2,           // Slight curve
    flowComplexity: 0.5,
    speed: 1.0
  },

  starryNight: {
    name: "The Starry Night",
    desc: "Saint-Rémy, 1889 — Kolmogorov turbulence, -5/3 cascade",
    colors: [
      [40, 60, 130],    // deep blue
      [70, 100, 170],   // mid blue
      [100, 140, 190],  // sky blue
      [50, 80, 150],    // swirl blue
      [30, 45, 100],    // night blue
      [255, 230, 120],  // star yellow
      [255, 200, 80],   // warm yellow
      [200, 220, 255],  // moon glow
    ],
    background: [12, 18, 35],
    strokeType: 'turbulent',    // Concentric swirls
    strokeLength: [15, 45],     // Variable for turbulence
    strokeWidth: [2, 6],
    strokeCurve: 0.8,           // High curvature
    flowComplexity: 1.0,        // Maximum turbulence
    speed: 1.2,
    // Kolmogorov turbulence parameters
    kolmogorov: {
      numEddies: 14,            // 14 main whirls like in the painting
      cascadeExponent: -5/3,    // Kolmogorov's law
      batchelorExponent: -1,    // Small-scale mixing
      energyDecay: 0.7
    }
  },

  almond: {
    name: "Almond Blossoms",
    desc: "Saint-Rémy, 1890 — Japanese curves, serene flow",
    colors: [
      [130, 180, 210],  // sky blue
      [160, 200, 220],  // pale blue
      [100, 160, 190],  // deeper blue
      [80, 140, 170],   // shadow blue
      [255, 252, 250],  // white blossom
      [255, 235, 235],  // pink blush
      [140, 100, 70],   // branch brown
      [180, 150, 110],  // light branch
    ],
    background: [70, 120, 150],
    strokeType: 'flowing',      // Smooth Japanese curves
    strokeLength: [30, 80],     // Long flowing strokes
    strokeWidth: [2, 5],        // Delicate
    strokeCurve: 0.6,           // Smooth curves
    flowComplexity: 0.25,       // Calm, organized
    speed: 0.5
  }
};

// ============================================
// GLOBAL STATE
// ============================================

let particles = [];
let flowField;
let cols, rows;
const SCALE = 15;
const NUM_PARTICLES = 1500;

let currentPeriod;
let targetPeriod;
let periodTransition = 1.0;
let periodCycleTimer = 0;
const PERIOD_DURATION = 35000; // 35 seconds per period

let isPaused = false;
let showInfo = true;
let time = 0;

// Kolmogorov eddy centers for Starry Night
let eddyCenters = [];

// ============================================
// KOLMOGOROV TURBULENCE MODEL
// ============================================

class Eddy {
  constructor(x, y, scale, rotation) {
    this.x = x;
    this.y = y;
    this.baseScale = scale;
    this.scale = scale;
    this.rotation = rotation;  // 1 or -1
    this.phase = random(TWO_PI);
    this.speed = random(0.5, 1.5);

    // Energy follows Kolmogorov cascade: E(k) ∝ k^(-5/3)
    // Larger eddies have more energy
    this.energy = pow(scale, -PERIODS.starryNight.kolmogorov.cascadeExponent);
  }

  update(dt) {
    this.phase += dt * this.speed * 0.001;
    // Eddies slowly drift and pulse
    this.scale = this.baseScale * (1 + 0.2 * sin(this.phase));
  }

  getInfluence(px, py) {
    let dx = px - this.x;
    let dy = py - this.y;
    let dist = sqrt(dx * dx + dy * dy);

    if (dist > this.scale * 3) return null;

    // Influence decreases with distance (Batchelor scaling at small scales)
    let influence = exp(-dist / this.scale);

    // Tangential velocity for swirl (perpendicular to radius)
    let angle = atan2(dy, dx) + HALF_PI * this.rotation;

    // Add radial component for spiral effect
    let spiralAngle = angle + dist * 0.02 * this.rotation;

    return {
      angle: spiralAngle,
      strength: influence * this.energy
    };
  }
}

function initializeEddies() {
  eddyCenters = [];
  const k = PERIODS.starryNight.kolmogorov;

  // Create 14 main eddies at various scales (like in the actual painting)
  // Larger eddies in upper portion (sky), smaller ones scattered

  // Large sky swirls (top half)
  for (let i = 0; i < 5; i++) {
    eddyCenters.push(new Eddy(
      random(width * 0.1, width * 0.9),
      random(height * 0.1, height * 0.5),
      random(150, 300),
      random() > 0.5 ? 1 : -1
    ));
  }

  // Medium eddies
  for (let i = 0; i < 5; i++) {
    eddyCenters.push(new Eddy(
      random(width),
      random(height),
      random(80, 150),
      random() > 0.5 ? 1 : -1
    ));
  }

  // Small eddies (energy cascade to smaller scales)
  for (let i = 0; i < 4; i++) {
    eddyCenters.push(new Eddy(
      random(width),
      random(height),
      random(40, 80),
      random() > 0.5 ? 1 : -1
    ));
  }
}

// ============================================
// FLOW FIELD GENERATORS PER PERIOD
// ============================================

function updateFlowField() {
  let yOff = 0;

  for (let y = 0; y < rows; y++) {
    let xOff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let px = x * SCALE;
      let py = y * SCALE;

      let angle;
      let currentType = getCurrentStrokeType();

      switch (currentType) {
        case 'impasto':
          angle = getImpastoFlow(px, py, xOff, yOff);
          break;
        case 'pointillist':
          angle = getPointillistFlow(px, py, xOff, yOff);
          break;
        case 'directional':
          angle = getDirectionalFlow(px, py, xOff, yOff);
          break;
        case 'turbulent':
          angle = getTurbulentFlow(px, py);
          break;
        case 'flowing':
          angle = getFlowingFlow(px, py, xOff, yOff);
          break;
        default:
          angle = noise(xOff, yOff, time) * TWO_PI;
      }

      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;

      xOff += 0.05;
    }
    yOff += 0.05;
  }
}

// Nuenen: Heavy, sluggish movement with occasional directional shifts
function getImpastoFlow(px, py, xOff, yOff) {
  let baseAngle = noise(xOff * 0.5, yOff * 0.5, time * 0.3) * TWO_PI;
  // Add blocky, chunky variation
  let blockX = floor(px / 50);
  let blockY = floor(py / 50);
  let blockAngle = noise(blockX * 0.3, blockY * 0.3) * PI;
  return baseAngle + blockAngle * 0.5;
}

// Paris: Semi-random but with underlying structure (optical mixing)
function getPointillistFlow(px, py, xOff, yOff) {
  // More random, stippled movement
  let baseAngle = noise(xOff, yOff, time * 0.5) * TWO_PI * 2;
  // Add jitter for pointillist effect
  let jitter = random(-PI/4, PI/4);
  return baseAngle + jitter;
}

// Arles: Strong directional flow (like wheat fields, sunflower petals)
function getDirectionalFlow(px, py, xOff, yOff) {
  // Dominant direction with subtle variation
  let dominantAngle = PI * 0.75; // Diagonal flow
  let variation = noise(xOff * 0.3, yOff * 0.3, time * 0.4) * PI * 0.5;

  // Add radiating pattern from center (like sunflower)
  let cx = width / 2;
  let cy = height / 2;
  let toCenter = atan2(cy - py, cx - px);
  let radialInfluence = sin(time * 0.5) * 0.3;

  return dominantAngle + variation + toCenter * radialInfluence;
}

// Starry Night: Kolmogorov turbulence with eddy cascade
function getTurbulentFlow(px, py) {
  let totalAngle = 0;
  let totalWeight = 0;

  // Sum influence from all eddies (multi-scale turbulence)
  for (let eddy of eddyCenters) {
    let influence = eddy.getInfluence(px, py);
    if (influence) {
      totalAngle += influence.angle * influence.strength;
      totalWeight += influence.strength;
    }
  }

  // Background flow (large-scale motion)
  let bgAngle = noise(px * 0.002, py * 0.002, time * 0.5) * TWO_PI;
  let bgWeight = 0.3;

  totalAngle += bgAngle * bgWeight;
  totalWeight += bgWeight;

  if (totalWeight > 0) {
    return totalAngle / totalWeight;
  }
  return bgAngle;
}

// Almond Blossoms: Smooth, calligraphic Japanese-inspired flow
function getFlowingFlow(px, py, xOff, yOff) {
  // Smooth, continuous curves
  let baseAngle = noise(xOff * 0.2, yOff * 0.2, time * 0.2) * TWO_PI;

  // Add gentle wave pattern (like branches)
  let wave = sin(px * 0.01 + time * 0.3) * PI * 0.3;
  let verticalBias = PI * 0.5; // Upward tendency (branches reaching up)

  return baseAngle * 0.5 + wave + verticalBias * 0.3;
}

// ============================================
// PARTICLE CLASS WITH PERIOD-SPECIFIC RENDERING
// ============================================

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.prevPos = this.pos.copy();
    this.history = []; // For curved strokes

    this.pickColor();
    this.life = random(60, 200);
    this.maxLife = this.life;
    this.strokeW = this.pickStrokeWidth();
    this.strokeLen = this.pickStrokeLength();
  }

  pickColor() {
    let colors1 = currentPeriod.colors;
    let colors2 = targetPeriod.colors;
    let c1 = random(colors1);
    let c2 = random(colors2);
    let t = 1 - periodTransition;
    this.color = [
      lerp(c1[0], c2[0], t),
      lerp(c1[1], c2[1], t),
      lerp(c1[2], c2[2], t)
    ];
  }

  pickStrokeWidth() {
    let sw1 = currentPeriod.strokeWidth;
    let sw2 = targetPeriod.strokeWidth;
    let t = 1 - periodTransition;
    let minW = lerp(sw1[0], sw2[0], t);
    let maxW = lerp(sw1[1], sw2[1], t);
    return random(minW, maxW);
  }

  pickStrokeLength() {
    let sl1 = currentPeriod.strokeLength;
    let sl2 = targetPeriod.strokeLength;
    let t = 1 - periodTransition;
    let minL = lerp(sl1[0], sl2[0], t);
    let maxL = lerp(sl1[1], sl2[1], t);
    return floor(random(minL, maxL));
  }

  follow(vectors, speedMult) {
    let x = floor(this.pos.x / SCALE);
    let y = floor(this.pos.y / SCALE);
    x = constrain(x, 0, cols - 1);
    y = constrain(y, 0, rows - 1);
    let index = x + y * cols;
    let force = vectors[index];
    if (force) {
      force = force.copy();
      force.mult(speedMult * 0.5);
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

    // Store history for curved strokes
    this.history.push(this.pos.copy());
    if (this.history.length > this.strokeLen) {
      this.history.shift();
    }

    this.life--;
    if (this.life <= 0) {
      this.respawn();
    }
  }

  respawn() {
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.vel.mult(0);
    this.history = [];
    this.life = random(60, 200);
    this.maxLife = this.life;
    this.pickColor();
    this.strokeW = this.pickStrokeWidth();
    this.strokeLen = this.pickStrokeLength();
  }

  edges() {
    let margin = 10;
    if (this.pos.x > width + margin || this.pos.x < -margin ||
        this.pos.y > height + margin || this.pos.y < -margin) {
      this.respawn();
    }
  }

  show() {
    let alpha = map(this.life, 0, this.maxLife, 0.1, 0.9);
    let strokeType = getCurrentStrokeType();

    switch (strokeType) {
      case 'impasto':
        this.drawImpasto(alpha);
        break;
      case 'pointillist':
        this.drawPointillist(alpha);
        break;
      case 'directional':
        this.drawDirectional(alpha);
        break;
      case 'turbulent':
        this.drawTurbulent(alpha);
        break;
      case 'flowing':
        this.drawFlowing(alpha);
        break;
      default:
        this.drawDefault(alpha);
    }

    this.prevPos = this.pos.copy();
  }

  // Nuenen: Heavy, thick dabs with visible texture
  drawImpasto(alpha) {
    push();
    noStroke();

    // Main thick dab
    fill(this.color[0], this.color[1], this.color[2], alpha);

    let angle = atan2(this.vel.y, this.vel.x);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    // Thick, short rectangular stroke
    let w = this.strokeW * 2;
    let h = this.strokeW * 0.8;
    rectMode(CENTER);
    rect(0, 0, w, h, 2);

    // Add impasto highlight (thick paint catches light)
    fill(this.color[0] + 30, this.color[1] + 25, this.color[2] + 20, alpha * 0.5);
    rect(-w * 0.2, -h * 0.3, w * 0.4, h * 0.3, 1);

    pop();
    pop();
  }

  // Paris: Pointillist dots
  drawPointillist(alpha) {
    push();
    noStroke();

    // Draw as circular dot
    fill(this.color[0], this.color[1], this.color[2], alpha);
    let dotSize = this.strokeW;
    ellipse(this.pos.x, this.pos.y, dotSize, dotSize);

    // Sometimes add complementary color dot nearby (optical mixing)
    if (random() > 0.7) {
      let compColor = [
        255 - this.color[0] * 0.3 + this.color[0] * 0.7,
        255 - this.color[1] * 0.3 + this.color[1] * 0.7,
        255 - this.color[2] * 0.3 + this.color[2] * 0.7
      ];
      fill(compColor[0], compColor[1], compColor[2], alpha * 0.5);
      let offset = dotSize * 0.8;
      ellipse(this.pos.x + random(-offset, offset),
              this.pos.y + random(-offset, offset),
              dotSize * 0.6, dotSize * 0.6);
    }
    pop();
  }

  // Arles: Long, directional parallel strokes
  drawDirectional(alpha) {
    if (this.history.length < 2) return;

    push();
    stroke(this.color[0], this.color[1], this.color[2], alpha);
    strokeWeight(this.strokeW);
    strokeCap(SQUARE); // Square caps for bold look
    noFill();

    // Draw as connected line segments
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      // Slight thickness variation along stroke
      let sw = this.strokeW * (1 + 0.2 * sin(i * 0.5));
      strokeWeight(sw);
      vertex(p.x, p.y);
    }
    endShape();

    pop();
  }

  // Starry Night: Curved turbulent swirls
  drawTurbulent(alpha) {
    if (this.history.length < 3) return;

    push();
    noFill();

    // Draw curved stroke following the swirl
    stroke(this.color[0], this.color[1], this.color[2], alpha);
    strokeWeight(this.strokeW);
    strokeCap(ROUND);

    beginShape();
    curveVertex(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      curveVertex(p.x, p.y);
    }
    let last = this.history[this.history.length - 1];
    curveVertex(last.x, last.y);
    endShape();

    // Add luminance variation (key to Kolmogorov signature)
    if (this.history.length > 5 && random() > 0.9) {
      let midIdx = floor(this.history.length / 2);
      let mp = this.history[midIdx];
      // Brighter spot (like stars)
      fill(this.color[0] + 50, this.color[1] + 50, this.color[2] + 30, alpha * 0.6);
      noStroke();
      ellipse(mp.x, mp.y, this.strokeW * 1.5);
    }

    pop();
  }

  // Almond Blossoms: Smooth, flowing curves
  drawFlowing(alpha) {
    if (this.history.length < 4) return;

    push();
    noFill();
    stroke(this.color[0], this.color[1], this.color[2], alpha);
    strokeWeight(this.strokeW);
    strokeCap(ROUND);
    strokeJoin(ROUND);

    // Smooth bezier-like curve
    beginShape();
    curveVertex(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      curveVertex(p.x, p.y);
    }
    let last = this.history[this.history.length - 1];
    curveVertex(last.x, last.y);
    endShape();

    pop();
  }

  drawDefault(alpha) {
    stroke(this.color[0], this.color[1], this.color[2], alpha);
    strokeWeight(this.strokeW);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentStrokeType() {
  if (periodTransition >= 1.0) {
    return currentPeriod.strokeType;
  }
  // During transition, blend behavior
  return periodTransition > 0.5 ? currentPeriod.strokeType : targetPeriod.strokeType;
}

function getCurrentSpeed() {
  return lerp(currentPeriod.speed, targetPeriod.speed, 1 - periodTransition);
}

// ============================================
// P5.JS SETUP
// ============================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);

  cols = floor(width / SCALE) + 1;
  rows = floor(height / SCALE) + 1;
  flowField = new Array(cols * rows);

  // Start with Starry Night (the most famous turbulent work)
  currentPeriod = PERIODS.starryNight;
  targetPeriod = currentPeriod;

  initializeEddies();
  initParticles();

  background(currentPeriod.background);
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

  time += deltaTime * 0.001;

  // Semi-transparent background for trail effect
  let bg = lerpColor(
    color(currentPeriod.background),
    color(targetPeriod.background),
    1 - periodTransition
  );

  // Different fade rates per period
  let fadeRate = currentPeriod.strokeType === 'pointillist' ? 0.08 : 0.03;
  bg.setAlpha(fadeRate);

  push();
  blendMode(BLEND);
  noStroke();
  fill(bg);
  rect(0, 0, width, height);
  pop();

  // Auto-cycle periods
  periodCycleTimer += deltaTime;
  if (periodCycleTimer > PERIOD_DURATION) {
    cyclePeriod();
    periodCycleTimer = 0;
  }

  // Handle period transition
  if (periodTransition < 1.0) {
    periodTransition += 0.003;
    if (periodTransition >= 1.0) {
      periodTransition = 1.0;
      currentPeriod = targetPeriod;
    }
  }

  // Update eddies for Starry Night turbulence
  for (let eddy of eddyCenters) {
    eddy.update(deltaTime);
  }

  // Update flow field
  updateFlowField();

  // Update and draw particles
  let spd = getCurrentSpeed();
  for (let particle of particles) {
    particle.follow(flowField, spd);
    particle.update();
    particle.edges();
    particle.show();
  }
}

// ============================================
// PERIOD TRANSITIONS
// ============================================

function cyclePeriod() {
  const periodNames = Object.keys(PERIODS);
  let currentIndex = periodNames.findIndex(name => PERIODS[name] === currentPeriod);
  let nextIndex = (currentIndex + 1) % periodNames.length;
  switchToPeriod(periodNames[nextIndex]);
}

function switchToPeriod(name) {
  if (PERIODS[name] && PERIODS[name] !== targetPeriod) {
    targetPeriod = PERIODS[name];
    periodTransition = 0;

    // Reinitialize eddies when switching to Starry Night
    if (name === 'starryNight') {
      initializeEddies();
    }

    updateInfoDisplay();
  }
}

function updateInfoDisplay() {
  let nameEl = document.getElementById('period-name');
  let descEl = document.getElementById('period-desc');
  if (nameEl && descEl) {
    nameEl.textContent = targetPeriod.name;
    descEl.textContent = targetPeriod.desc;
  }
}

// ============================================
// USER INTERACTION
// ============================================

function keyPressed() {
  if (key === '1') switchToPeriod('nuenen');
  if (key === '2') switchToPeriod('paris');
  if (key === '3') switchToPeriod('arles');
  if (key === '4') switchToPeriod('starryNight');
  if (key === '5') switchToPeriod('almond');

  if (key === ' ') {
    isPaused = !isPaused;
  }

  if (key === 'r' || key === 'R') {
    background(currentPeriod.background);
    initializeEddies();
    initParticles();
    time = 0;
  }

  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }

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
  initializeEddies();
  background(currentPeriod.background);
}

function mouseMoved() {
  // Mouse creates temporary eddy (interactive element)
  if (getCurrentStrokeType() === 'turbulent') {
    for (let i = 0; i < 3; i++) {
      let idx = floor(random(particles.length));
      let p = particles[idx];
      let d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
      if (d < 150) {
        // Tangential force (swirl around mouse)
        let angle = atan2(p.pos.y - mouseY, p.pos.x - mouseX) + HALF_PI;
        let force = p5.Vector.fromAngle(angle);
        force.mult(0.8 * (1 - d / 150));
        p.applyForce(force);
      }
    }
  }
}
