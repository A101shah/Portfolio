/**
 * Multi-Junction Spider Web Tapestry Engine — Living Cobweb Tapestry
 * Directly inspired by dense overlapping cobweb tapestries:
 * - Dark grey backdrop with crisp light grey / silver silk webs
 * - 1 major spider web junction for each repo/project & core section
 * - DENSE GAPLESS TAPESTRY: 32+ procedural filler webs, triangular corner hammocks,
 *   and catenary silk sheets filling all voids so the canvas is rich, alive, and continuous.
 * - MAJOR NAVIGATION TRANSITION GUIDES: High-prominence silk transit cables connecting
 *   major hubs with traveling energy pulses, directional guidance beacons, and
 *   click-to-glide camera travel along the silk thread to the next web!
 * - Dewdrop physics, elastic thread plucking, and infinite canvas navigation.
 */

/**
 * Living Arachnid Simulation — MiniSpider
 * Realistically crawls along web spokes, catenary capture spirals, and transit silk cables.
 * - Anatomically articulated: Cephalothorax, abdomen, eye glints, pedipalps, and 8 jointed legs.
 * - Alternating tetrapod gait (4 legs in swing, 4 legs in support).
 * - Silk network pathfinding: transitions between spokes, spirals, and highways at intersections.
 * - Reactive: senses mouse cursor proximity, scurrying rapidly away when approached,
 *   and alertly detects web plucks / vibrations.
 */
class MiniSpider {
  constructor(engine, options = {}) {
    this.engine = engine;
    this.type = options.type || "worker"; // "orbweaver", "worker", "spiderling"
    this.size = options.size || (this.type === "orbweaver" ? 12 : (this.type === "worker" ? 7.5 : 4.5));

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.angle = options.angle || Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;

    // Silk path tracking
    this.pathType = options.pathType || "spoke"; // "spoke", "spiral", "highway"
    this.junctionId = options.junctionId || "nexus";
    this.spokeIndex = options.spokeIndex || 0;
    this.ringIndex = options.ringIndex || 3;
    this.guideIndex = options.guideIndex || 0;
    this.t = options.t !== undefined ? options.t : Math.random() * 0.8 + 0.1;
    this.dir = options.dir || (Math.random() < 0.5 ? 1 : -1);

    // Locomotion
    this.baseSpeed = options.speed || (this.type === "spiderling" ? 1.5 : (this.type === "worker" ? 1.05 : 0.72));
    this.speed = this.baseSpeed;
    this.state = "crawling"; // "crawling", "paused", "scurrying"
    this.pauseTimer = 0;
    this.walkPhase = Math.random() * Math.PI * 2;
    this.breathePhase = Math.random() * Math.PI * 2;
    this.alertT = 0;
    this.turnSmooth = 0.16;

    this.markings = Math.random() < 0.65;
  }

  onVibration(vx, vy, dist) {
    if (this.state === "paused") {
      this.state = "scurrying";
      this.pauseTimer = 0;
    }
    this.alertT = 1;
    this.speed = this.baseSpeed * 2.4;
  }

  update(time) {
    this.breathePhase += 0.045;

    // Paused state logic
    if (this.state === "paused") {
      this.pauseTimer--;
      if (this.pauseTimer <= 0) {
        this.state = "crawling";
        this.speed = this.baseSpeed;
        if (Math.random() < 0.35) this.dir = -this.dir;
      }
    } else if (this.state === "crawling") {
      // Occasional random pause to groom or inspect thread tension
      if (Math.random() < 0.003) {
        this.state = "paused";
        this.pauseTimer = Math.floor(Math.random() * 80 + 40);
        return;
      }
    }

    let curX = this.x;
    let curY = this.y;

    // Movement along silk network
    if (this.pathType === "spoke") {
      const j = this.engine.junctions.find(item => item.id === this.junctionId) || this.engine.junctions[0];
      if (!j || !j.spokes || !j.spokes.length) return;

      const spk = j.spokes[this.spokeIndex % j.spokes.length];
      const spkLen = Math.max(spk.length || 200, 100);

      if (this.state !== "paused") {
        this.t += (this.speed / spkLen) * this.dir;
        this.walkPhase += this.speed * 0.42;
      }

      // Bezier along curved spoke
      const invT = 1 - this.t;
      curX = invT * invT * j.worldX + 2 * invT * this.t * spk.ctrlX + this.t * this.t * spk.endX;
      curY = invT * invT * j.worldY + 2 * invT * this.t * spk.ctrlY + this.t * this.t * spk.endY;

      const vx = 2 * invT * (spk.ctrlX - j.worldX) + 2 * this.t * (spk.endX - spk.ctrlX);
      const vy = 2 * invT * (spk.ctrlY - j.worldY) + 2 * this.t * (spk.endY - spk.ctrlY);
      this.targetAngle = Math.atan2(vy * this.dir, vx * this.dir);

      // Branching to spiral rings at intersections
      if (Math.random() < 0.016 && this.state !== "scurrying" && j.rings && j.rings.length) {
        this.ringIndex = Math.min(Math.max(1, Math.floor(this.t * j.rings.length)), j.rings.length - 1);
        this.pathType = "spiral";
        this.t = 0.5;
        this.dir = Math.random() < 0.5 ? 1 : -1;
      }

      // Spoke boundaries
      if (this.t >= 0.94) {
        this.t = 0.94;
        this.dir = -1;
        if (Math.random() < 0.4 && j.rings && j.rings.length) {
          this.pathType = "spiral";
          this.ringIndex = j.rings.length - 1;
          this.t = 0;
        }
      } else if (this.t <= 0.07) {
        this.t = 0.07;
        const rand = Math.random();
        if (rand < 0.5) {
          this.spokeIndex = Math.floor(Math.random() * j.spokes.length);
          this.dir = 1;
        } else if (rand < 0.8 && this.engine.navigationGuides && this.engine.navigationGuides.length) {
          // Hop onto connected highway!
          const guideIdx = this.engine.navigationGuides.findIndex(g => g.j1.id === j.id || g.j2.id === j.id);
          if (guideIdx !== -1) {
            const g = this.engine.navigationGuides[guideIdx];
            this.pathType = "highway";
            this.guideIndex = guideIdx;
            this.t = g.j1.id === j.id ? 0.05 : 0.95;
            this.dir = g.j1.id === j.id ? 1 : -1;
          } else {
            this.dir = 1;
          }
        } else {
          this.state = "paused";
          this.pauseTimer = 60;
        }
      }
    } else if (this.pathType === "spiral") {
      const j = this.engine.junctions.find(item => item.id === this.junctionId) || this.engine.junctions[0];
      if (!j || !j.rings || !j.rings.length) {
        this.pathType = "spoke";
        return;
      }

      const r = this.ringIndex % j.rings.length;
      const s1 = this.spokeIndex % j.spokes.length;
      const s2 = (s1 + this.dir + j.spokes.length) % j.spokes.length;

      const p1 = j.nodes.find(n => n.rIndex === r && n.sIndex === s1);
      const p2 = j.nodes.find(n => n.rIndex === r && n.sIndex === s2);

      if (!p1 || !p2) {
        this.pathType = "spoke";
        return;
      }

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const toCenterX = j.worldX - midX;
      const toCenterY = j.worldY - midY;
      const distToCenter = Math.hypot(toCenterX, toCenterY) || 1;
      const chordDist = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 35;
      const sag = chordDist * (0.165 + Math.sin(r * 1.7 + s1 * 2.3) * 0.035);
      const ctrlX = midX + (toCenterX / distToCenter) * sag;
      const ctrlY = midY + (toCenterY / distToCenter) * sag;

      if (this.state !== "paused") {
        this.t += this.speed / chordDist;
        this.walkPhase += this.speed * 0.42;
      }

      const invT = 1 - this.t;
      curX = invT * invT * p1.x + 2 * invT * this.t * ctrlX + this.t * this.t * p2.x;
      curY = invT * invT * p1.y + 2 * invT * this.t * ctrlY + this.t * this.t * p2.y;

      const vx = 2 * invT * (ctrlX - p1.x) + 2 * this.t * (p2.x - ctrlX);
      const vy = 2 * invT * (ctrlY - p1.y) + 2 * this.t * (p2.y - ctrlY);
      this.targetAngle = Math.atan2(vy, vx);

      if (this.t >= 1.0) {
        this.t = 0;
        this.spokeIndex = s2;
        const choice = Math.random();
        if (choice < 0.55) {
          // Continue along capture spiral
        } else if (choice < 0.85) {
          // Switch to spoke
          this.pathType = "spoke";
          this.dir = Math.random() < 0.5 ? 1 : -1;
          this.t = (r + 1) / (j.rings.length + 1);
        } else {
          this.state = "paused";
          this.pauseTimer = Math.floor(Math.random() * 80 + 40);
        }
      }
    } else if (this.pathType === "highway") {
      if (!this.engine.navigationGuides || !this.engine.navigationGuides.length) {
        this.pathType = "spoke";
        return;
      }
      const g = this.engine.navigationGuides[this.guideIndex % this.engine.navigationGuides.length];
      if (!g) {
        this.pathType = "spoke";
        return;
      }

      const cableDist = Math.max(g.dist || 600, 300);
      if (this.state !== "paused") {
        this.t += (this.speed / cableDist) * this.dir;
        this.walkPhase += this.speed * 0.42;
      }

      const invT = 1 - this.t;
      curX = invT * invT * g.j1.worldX + 2 * invT * this.t * g.midX + this.t * this.t * g.j2.worldX;
      curY = invT * invT * g.j1.worldY + 2 * invT * this.t * g.midY + this.t * this.t * g.j2.worldY;

      const vx = 2 * invT * (g.midX - g.j1.worldX) + 2 * this.t * (g.j2.worldX - g.midX);
      const vy = 2 * invT * (g.midY - g.j1.worldY) + 2 * this.t * (g.j2.worldY - g.midY);
      this.targetAngle = Math.atan2(vy * this.dir, vx * this.dir);

      if (this.t >= 0.98) {
        this.pathType = "spoke";
        this.junctionId = g.j2.id;
        this.dir = 1;
        this.t = 0.08;
      } else if (this.t <= 0.02) {
        this.pathType = "spoke";
        this.junctionId = g.j1.id;
        this.dir = 1;
        this.t = 0.08;
      }
    }

    // Interactive mouse cursor proximity reaction
    const mx = this.engine.mouse.worldX;
    const my = this.engine.mouse.worldY;
    const distToMouse = Math.hypot(curX - mx, curY - my);

    if (distToMouse < 90) {
      if (this.state !== "scurrying") {
        this.state = "scurrying";
        this.pauseTimer = 0;
        // Direction check: if moving towards cursor, reverse!
        const toMx = mx - curX;
        const toMy = my - curY;
        const moveVx = Math.cos(this.angle);
        const moveVy = Math.sin(this.angle);
        if (toMx * moveVx + toMy * moveVy > 0) {
          this.dir = -this.dir;
        }
      }
      this.speed = this.baseSpeed * 2.5;
      this.alertT = Math.min(this.alertT + 0.25, 1);
    } else {
      this.alertT = Math.max(this.alertT - 0.025, 0);
      if (this.state === "scurrying") {
        this.speed += (this.baseSpeed - this.speed) * 0.05;
        if (this.speed <= this.baseSpeed * 1.15) {
          this.state = "crawling";
        }
      }
    }

    // Smooth heading angle wrapping
    const diff = (this.targetAngle - this.angle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    this.angle += diff * this.turnSmooth;

    this.x = curX;
    this.y = curY;
  }

  draw(ctx, zoom) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const s = this.size;
    const isPaused = this.state === "paused";
    const breath = 1 + Math.sin(this.breathePhase) * 0.04;

    // 1. Eight Articulated Jointed Legs (4 left, 4 right)
    const legConfigs = [
      // Left legs (1L, 2L, 3L, 4L)
      { attachX: -s * 0.22, attachY: -s * 0.35, angle: -Math.PI * 0.42, femur: s * 0.95, tibia: s * 0.90, phase: 0 },
      { attachX: -s * 0.26, attachY: -s * 0.15, angle: -Math.PI * 0.22, femur: s * 0.85, tibia: s * 0.78, phase: Math.PI },
      { attachX: -s * 0.24, attachY:  s * 0.08, angle:  Math.PI * 0.18, femur: s * 0.75, tibia: s * 0.68, phase: 0 },
      { attachX: -s * 0.18, attachY:  s * 0.28, angle:  Math.PI * 0.42, femur: s * 0.95, tibia: s * 0.88, phase: Math.PI },

      // Right legs (1R, 2R, 3R, 4R)
      { attachX:  s * 0.22, attachY: -s * 0.35, angle: -Math.PI * 0.58, femur: s * 0.95, tibia: s * 0.90, phase: Math.PI },
      { attachX:  s * 0.26, attachY: -s * 0.15, angle: -Math.PI * 0.78, femur: s * 0.85, tibia: s * 0.78, phase: 0 },
      { attachX:  s * 0.24, attachY:  s * 0.08, angle:  Math.PI * 0.82, femur: s * 0.75, tibia: s * 0.68, phase: Math.PI },
      { attachX:  s * 0.18, attachY:  s * 0.28, angle:  Math.PI * 0.58, femur: s * 0.95, tibia: s * 0.88, phase: 0 }
    ];

    ctx.strokeStyle = "rgba(130, 133, 136, 0.8)";
    ctx.lineWidth = Math.max(0.65, s * 0.09) / zoom;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < legConfigs.length; i++) {
      const leg = legConfigs[i];
      let swing = 0;
      let lift = 0;

      if (!isPaused) {
        swing = Math.sin(this.walkPhase + leg.phase) * 0.32;
        lift = Math.max(0, Math.sin(this.walkPhase + leg.phase)) * 0.18;
      } else {
        swing = Math.sin(this.breathePhase * 1.5 + i) * 0.04;
      }

      const kneeAngle = leg.angle + swing;
      const kneeX = leg.attachX + Math.cos(kneeAngle) * leg.femur;
      const kneeY = leg.attachY + Math.sin(kneeAngle) * leg.femur - lift * s;

      const tipAngle = leg.angle + (leg.attachX < 0 ? -0.75 : 0.75) + swing * 0.5;
      const tipX = kneeX + Math.cos(tipAngle) * leg.tibia;
      const tipY = kneeY + Math.sin(tipAngle) * leg.tibia;

      ctx.beginPath();
      ctx.moveTo(leg.attachX, leg.attachY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Knee joint bead
      ctx.beginPath();
      ctx.arc(kneeX, kneeY, Math.max(0.5, s * 0.05), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 204, 208, 0.9)";
      ctx.fill();
    }

    // 2. Abdomen (Posterior)
    const abY = s * 0.42;
    const abW = s * 0.45 * breath;
    const abH = s * 0.62 * breath;

    ctx.beginPath();
    ctx.ellipse(0, abY, abW, abH, 0, 0, Math.PI * 2);
    const abGrad = ctx.createRadialGradient(-abW * 0.3, abY - abH * 0.3, 1, 0, abY, abH);
    abGrad.addColorStop(0, "#3d4044");
    abGrad.addColorStop(0.5, "#25272a");
    abGrad.addColorStop(1, "#111214");
    ctx.fillStyle = abGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(110, 113, 116, 0.4)";
    ctx.lineWidth = 0.7 / zoom;
    ctx.stroke();

    // Dorsal Chevron / Chalk Markings
    if (this.size >= 5.5) {
      ctx.beginPath();
      ctx.moveTo(-abW * 0.35, abY - abH * 0.2);
      ctx.lineTo(0, abY - abH * 0.35);
      ctx.lineTo(abW * 0.35, abY - abH * 0.2);
      ctx.strokeStyle = "rgba(195, 200, 205, 0.55)";
      ctx.lineWidth = 0.75 / zoom;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, abY + abH * 0.15, Math.max(0.6, s * 0.07), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(195, 200, 205, 0.65)";
      ctx.fill();
    }

    // 3. Cephalothorax (Anterior)
    const cephY = -s * 0.18;
    const cephW = s * 0.32;
    const cephH = s * 0.38;

    ctx.beginPath();
    ctx.ellipse(0, cephY, cephW, cephH, 0, 0, Math.PI * 2);
    const cephGrad = ctx.createRadialGradient(-cephW * 0.2, cephY - cephH * 0.2, 1, 0, cephY, cephH);
    cephGrad.addColorStop(0, "#4a4e53");
    cephGrad.addColorStop(0.6, "#2c2e32");
    cephGrad.addColorStop(1, "#18191b");
    ctx.fillStyle = cephGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(110, 113, 116, 0.45)";
    ctx.lineWidth = 0.7 / zoom;
    ctx.stroke();

    // Pedipalps
    ctx.beginPath();
    ctx.moveTo(-cephW * 0.45, cephY - cephH * 0.7);
    ctx.lineTo(-cephW * 0.65, cephY - cephH * 1.15);
    ctx.moveTo(cephW * 0.45, cephY - cephH * 0.7);
    ctx.lineTo(cephW * 0.65, cephY - cephH * 1.15);
    ctx.strokeStyle = "rgba(130, 133, 136, 0.65)";
    ctx.lineWidth = 0.7 / zoom;
    ctx.stroke();

    // Eye Glints
    ctx.fillStyle = "#ffffff";
    const eyeSize = Math.max(0.6, s * 0.06);
    ctx.fillRect(-cephW * 0.3, cephY - cephH * 0.65, eyeSize, eyeSize);
    ctx.fillRect(cephW * 0.18, cephY - cephH * 0.65, eyeSize, eyeSize);

    ctx.restore();
  }
}

class SpiderWeb {
  constructor(canvasId = "spider-web-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Infinite World Camera
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1.0,
      targetZoom: 1.0,
      minZoom: 0.32,
      maxZoom: 2.2,
      isGliding: false
    };

    // Mouse & Pan/Drag interaction
    this.mouse = {
      screenX: -1000,
      screenY: -1000,
      worldX: -1000,
      worldY: -1000,
      prevWorldX: -1000,
      prevWorldY: -1000,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragCamStartX: 0,
      dragCamStartY: 0,
      dragDistance: 0,
      hoverJunction: null,
      hoverGuide: null
    };

    this.soundEngine = null;
    this.onJunctionClickCallback = null;
    this.onNavigateCallback = null;
    this.activeJunctionId = null;

    // Color Palette: Near-Black Backdrop + Delicate Grey Silk (Reference Image)
    this.theme = {
      primarySilk: "rgba(145, 148, 152, 0.65)",     // Delicate silver-grey spoke threads
      spiralSilk: "rgba(110, 113, 116, 0.42)",      // Translucent grey capture spirals
      bridgeSilk: "rgba(140, 143, 146, 0.6)",       // Ash-grey transit cables
      fillerSpoke: "rgba(85, 88, 91, 0.32)",        // Background filler webs — subtle
      fillerRing: "rgba(72, 75, 78, 0.22)",
      dewdrop: "rgba(190, 192, 195, 0.75)",         // Grey chalk droplets & specks
      highlightSilk: "rgba(210, 212, 215, 0.85)",   // Highlight thread on hover
      transitCable: "rgba(135, 138, 141, 0.7)",     // Silver transit highway
      transitGlow: "rgba(120, 123, 126, 0.4)"       // Faint grey glow
    };

    // Web Geometry & Collections
    this.junctions = [];
    this.navigationGuides = [];
    this.fillerWebs = [];
    this.cornerHammocks = [];
    this.longAnchors = [];
    this.chalkSplatters = [];
    this.vibrations = [];
    this.floatingDust = [];
    this.spiders = [];

    this.init();
  }

  init() {
    this.resize();
    this.buildJunctionWebs();
    this.buildNavigationHighways();
    this.buildDenseTapestryFillerWebs();
    this.buildCornerLaceHammocks();
    this.buildLongAnchorFilaments();
    this.buildChalkSplatters();
    this.createFloatingDust();
    this.buildMiniSpiders();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setSoundEngine(soundEngine) {
    this.soundEngine = soundEngine;
  }

  onNodeClick(callback) {
    this.onJunctionClickCallback = callback;
  }

  onNavigate(callback) {
    this.onNavigateCallback = callback;
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.width / 2) / this.camera.zoom + this.camera.x,
      y: (sy - this.height / 2) / this.camera.zoom + this.camera.y
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.camera.x) * this.camera.zoom + this.width / 2,
      y: (wy - this.camera.y) * this.camera.zoom + this.height / 2
    };
  }

  /**
   * 1. Build distinct, intricate spider web for each Repo / Project & Section
   * Organic orb-weaver structure inspired directly by reference picture:
   * - Wavy catenary radial spokes with natural tension deflections
   * - Outer Y-shaped branching anchor forks
   * - Archimedean capture spirals with natural catenary sag
   * - Dense central hub webbing loops around each pearl
   */
  buildJunctionWebs() {
    this.junctions = [];
    const rawList = PortfolioData.junctions || [];

    rawList.forEach((jData, jIdx) => {
      const spokes = [];
      const rings = [];
      const nodes = [];
      const dewdrops = [];
      const hubLoops = [];

      // Natural spider web spoke counts: 14-16 spokes (matching reference specimen)
      const spokeCount = jData.id === "nexus" ? 16 : 14;
      const ringCount = jData.id === "nexus" ? 12 : 10;
      const radius = jData.radius || 270;

      // Natural non-uniform angular distribution
      const rawWeights = [];
      let sumWeight = 0;
      for (let s = 0; s < spokeCount; s++) {
        const w = 1.0 + Math.sin(s * 2.8 + jIdx * 1.7) * 0.18 + Math.cos(s * 4.3) * 0.08;
        rawWeights.push(w);
        sumWeight += w;
      }

      let currentAngle = (jIdx * 0.45) % (Math.PI * 2);
      for (let s = 0; s < spokeCount; s++) {
        const spokeAngle = currentAngle;
        currentAngle += (rawWeights[s] / sumWeight) * Math.PI * 2;

        // 3-4 natural anchor spokes extend 1.35x longer to ground the web organically
        const isAnchorSpoke = s % 4 === 0;
        const spokeLen = radius * (isAnchorSpoke ? 1.38 : (0.92 + Math.cos(s * 1.8 + jIdx * 0.9) * 0.12));

        // Gentle natural tension deflection
        const midDist = spokeLen * 0.52;
        const perpAngle = spokeAngle + Math.PI / 2;
        const wave = Math.sin(s * 2.3 + jIdx * 1.3) * (radius * 0.035);
        const ctrlX = jData.worldX + Math.cos(spokeAngle) * midDist + Math.cos(perpAngle) * wave;
        const ctrlY = jData.worldY + Math.sin(spokeAngle) * midDist + Math.sin(perpAngle) * wave;
        const endX = jData.worldX + Math.cos(spokeAngle) * spokeLen;
        const endY = jData.worldY + Math.sin(spokeAngle) * spokeLen;

        spokes.push({
          angle: spokeAngle,
          length: spokeLen,
          isAnchorSpoke,
          ctrlX,
          ctrlY,
          endX,
          endY
        });
      }

      // Delicate central hub webbing loops around core (intricate orb-weaver hub)
      const hubLoopRadii = [7, 13, 20, 28];
      hubLoopRadii.forEach((hr, hIdx) => {
        hubLoops.push({
          radius: hr,
          sag: 0.12 + hIdx * 0.02
        });
      });

      // Capture Spiral Rings (progressive spacing expanding naturally after free zone)
      const freeRadius = 38;
      for (let r = 0; r < ringCount; r++) {
        const progress = (r + 1) / (ringCount + 1);
        const ringRadius = freeRadius + Math.pow(progress, 1.36) * (radius - freeRadius);
        rings.push({
          radius: ringRadius,
          sag: 0.14 + Math.sin(r * 1.6 + jIdx) * 0.02
        });
      }

      // Intersection nodes & beaded dewdrops
      for (let r = 0; r < rings.length; r++) {
        for (let s = 0; s < spokes.length; s++) {
          const spoke = spokes[s];
          const ring = rings[r];

          const eccentric = 1 + Math.sin(spoke.angle * 2 + jIdx * 0.7) * 0.06;
          const dist = Math.min(ring.radius * eccentric, spoke.length * 0.94);

          // Evaluate along curved spoke
          const t = dist / spoke.length;
          const invT = 1 - t;
          const wx = invT * invT * jData.worldX + 2 * invT * t * spoke.ctrlX + t * t * spoke.endX;
          const wy = invT * invT * jData.worldY + 2 * invT * t * spoke.ctrlY + t * t * spoke.endY;

          nodes.push({
            rIndex: r,
            sIndex: s,
            baseX: wx,
            baseY: wy,
            x: wx,
            y: wy,
            vx: 0,
            vy: 0
          });

          // Dewdrops along capture spiral (refined, subtle viscid pearls)
          if (Math.random() < 0.22) {
            dewdrops.push({
              rIndex: r,
              sIndex: s,
              t: 0.25 + Math.random() * 0.5,
              size: Math.random() < 0.25 ? Math.random() * 1.6 + 1.2 : Math.random() * 0.9 + 0.6,
              alpha: Math.random() * 0.35 + 0.35,
              glintPhase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      this.junctions.push({
        ...jData,
        spokes,
        rings,
        hubLoops,
        nodes,
        dewdrops,
        pulsePhase: Math.random() * Math.PI * 2,
        hoverT: 0,
        coreRadius: jData.id === "nexus" ? 13 : 9.5
      });
    });
  }

  /**
   * 2. NATURAL SILK BRIDGE HIGHWAYS
   * Slender, organic bridge lines connecting major hubs without visual clutter.
   */
  buildNavigationHighways() {
    this.navigationGuides = [];

    const highwayPairs = [
      // Central Radial Bridges from Nexus (0, 0)
      ["nexus", "repo-ipl"],
      ["nexus", "repo-ttest"],
      ["nexus", "repo-jobtrack"],
      ["nexus", "repo-isp"],
      ["nexus", "repo-iris"],
      ["nexus", "repo-dashboard"],
      ["nexus", "skills"],
      ["nexus", "terminal"],
      ["nexus", "transmit"],

      // Grand Orbital Circuit Bridge linking outer neighboring webs in a loop
      ["repo-dashboard", "repo-ipl"],
      ["repo-ipl", "skills"],
      ["skills", "transmit"],
      ["transmit", "repo-ttest"],
      ["repo-ttest", "repo-jobtrack"],
      ["repo-jobtrack", "repo-isp"],
      ["repo-isp", "repo-iris"],
      ["repo-iris", "terminal"],
      ["terminal", "repo-dashboard"]
    ];

    const processedPairs = new Set();

    highwayPairs.forEach(([idA, idB]) => {
      const key = [idA, idB].sort().join("__");
      if (processedPairs.has(key)) return;
      processedPairs.add(key);

      const j1 = this.junctions.find(j => j.id === idA);
      const j2 = this.junctions.find(j => j.id === idB);
      if (!j1 || !j2) return;

      const dx = j2.worldX - j1.worldX;
      const dy = j2.worldY - j1.worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Natural gentle catenary droop perpendicular to cable
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const sagMagnitude = Math.min(dist * 0.038, 28);

      const midX = (j1.worldX + j2.worldX) / 2 + perpX * sagMagnitude;
      const midY = (j1.worldY + j2.worldY) / 2 + perpY * sagMagnitude;

      // Discrete sample points for silky smooth collision detection
      const samplePoints = [];
      const samples = 14;
      for (let s = 0; s <= samples; s++) {
        const t = s / samples;
        const x = (1 - t) * (1 - t) * j1.worldX + 2 * (1 - t) * t * midX + t * t * j2.worldX;
        const y = (1 - t) * (1 - t) * j1.worldY + 2 * (1 - t) * t * midY + t * t * j2.worldY;
        samplePoints.push({ x, y, t });
      }

      // Traveling animated silk shimmer glint
      const pulses = [
        { progress: Math.random(), speed: 0.0016, dir: 1, size: 2.0 }
      ];

      this.navigationGuides.push({
        id: `${j1.id}__${j2.id}`,
        j1,
        j2,
        dist,
        midX,
        midY,
        samplePoints,
        pulses,
        hoverT: 0,
        isHovered: false
      });
    });
  }

  buildDenseTapestryFillerWebs() {
    // Decluttered: No filler web clutter in background
    this.fillerWebs = [];
  }

  buildCornerLaceHammocks() {
    // Decluttered: No corner webbing hammocks
    this.cornerHammocks = [];
  }

  buildLongAnchorFilaments() {
    this.longAnchors = [];
    this.junctions.forEach((j, jIdx) => {
      // 2 delicate outer anchor lines per web reaching gently outward
      const anchorAngles = [jIdx * 0.65 + 0.4, jIdx * 0.65 + Math.PI + 0.7];
      anchorAngles.forEach(angle => {
        const length = 1100 + Math.sin(jIdx) * 250;
        this.longAnchors.push({
          startX: j.worldX + Math.cos(angle) * (j.radius || 250) * 0.85,
          startY: j.worldY + Math.sin(angle) * (j.radius || 250) * 0.85,
          endX: j.worldX + Math.cos(angle) * length,
          endY: j.worldY + Math.sin(angle) * length,
          alpha: 0.12
        });
      });
    });
  }

  buildChalkSplatters() {
    // Decluttered: No floating random splatter noise in the void
    this.chalkSplatters = [];
  }

  createFloatingDust() {
    this.floatingDust = [];
    // Sparse, serene celestial dust motes
    for (let i = 0; i < 18; i++) {
      this.floatingDust.push({
        x: (Math.random() - 0.5) * 3200,
        y: (Math.random() - 0.5) * 3200,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.22 + 0.1,
        color: "#808388"
      });
    }
  }

  /**
   * 7. Mini Spiders Population Generator — Drastically Reduced
   * Only 2 subtle, natural spiders roaming peacefully on outer webs.
   */
  buildMiniSpiders() {
    this.spiders = [];

    // 1. One calm resident orb-weaver spider resting quietly on an outer project web
    this.spiders.push(new MiniSpider(this, {
      type: "orbweaver",
      size: 8.5,
      junctionId: "skills",
      spokeIndex: 4,
      ringIndex: 4,
      speed: 0.52,
      t: 0.35
    }));

    // 2. One tiny, delicate spiderling quietly exploring an outer project web
    this.spiders.push(new MiniSpider(this, {
      type: "spiderling",
      size: 4.0,
      junctionId: "repo-ipl",
      spokeIndex: 7,
      ringIndex: 6,
      speed: 0.82,
      t: 0.25
    }));
  }

  updateMiniSpiders() {
    const time = Date.now() * 0.003;
    for (let i = 0; i < this.spiders.length; i++) {
      this.spiders[i].update(time);
    }
  }

  drawMiniSpiders() {
    for (let i = 0; i < this.spiders.length; i++) {
      this.spiders[i].draw(this.ctx, this.camera.zoom);
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    // Mouse Move: Pan dragging, hover detection on hubs AND navigation transition cables
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.screenX = e.clientX - rect.left;
      this.mouse.screenY = e.clientY - rect.top;

      const world = this.screenToWorld(this.mouse.screenX, this.mouse.screenY);
      this.mouse.prevWorldX = this.mouse.worldX;
      this.mouse.prevWorldY = this.mouse.worldY;
      this.mouse.worldX = world.x;
      this.mouse.worldY = world.y;

      if (this.mouse.isDragging) {
        const dx = (this.mouse.screenX - this.mouse.dragStartX) / this.camera.zoom;
        const dy = (this.mouse.screenY - this.mouse.dragStartY) / this.camera.zoom;
        this.camera.targetX = this.mouse.dragCamStartX - dx;
        this.camera.targetY = this.mouse.dragCamStartY - dy;
        this.mouse.dragDistance += Math.abs(dx) + Math.abs(dy);
        this.canvas.style.cursor = "grabbing";
      } else {
        this.checkHover();
        this.interactPluck();
      }

      this.updateHudCoords();
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.screenX = e.clientX - rect.left;
      this.mouse.screenY = e.clientY - rect.top;
      const world = this.screenToWorld(this.mouse.screenX, this.mouse.screenY);
      this.mouse.worldX = world.x;
      this.mouse.worldY = world.y;

      this.mouse.isDragging = true;
      this.mouse.dragStartX = this.mouse.screenX;
      this.mouse.dragStartY = this.mouse.screenY;
      this.mouse.dragCamStartX = this.camera.targetX;
      this.mouse.dragCamStartY = this.camera.targetY;
      this.mouse.dragDistance = 0;
    });

    window.addEventListener("mouseup", (e) => {
      if (this.mouse.isDragging) {
        this.mouse.isDragging = false;

        if (e && e.clientX !== undefined) {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.screenX = e.clientX - rect.left;
          this.mouse.screenY = e.clientY - rect.top;
          const world = this.screenToWorld(this.mouse.screenX, this.mouse.screenY);
          this.mouse.worldX = world.x;
          this.mouse.worldY = world.y;
        }

        // Click detection without excessive drag
        if (this.mouse.dragDistance < 7) {
          // 1. Priority A: Center Hub Pearl Clicked -> Open Key Card
          const clickedJunction = this.getJunctionAt(this.mouse.worldX, this.mouse.worldY);
          if (clickedJunction) {
            this.selectJunction(clickedJunction.id);
            return;
          }

          // 2. Priority B: Major Navigation Transition Cable / Guide Clicked -> Glide to Next Web!
          const guideHover = this.getNavigationGuideAt(this.mouse.worldX, this.mouse.worldY) || this.mouse.hoverGuide;
          if (guideHover) {
            this.glideAlongGuide(guideHover.guide, guideHover.targetJunction);
            return;
          }

          // 3. Ambient Pluck Vibration
          this.triggerVibration(this.mouse.worldX, this.mouse.worldY);
          if (this.soundEngine) this.soundEngine.playNodeHover();
        }

        this.canvas.style.cursor = (this.mouse.hoverJunction || this.mouse.hoverGuide) ? "pointer" : "default";
      }
    });

    // Native Click Fallback
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = this.screenToWorld(sx, sy);

      const clicked = this.getJunctionAt(world.x, world.y);
      if (clicked) {
        this.selectJunction(clicked.id);
        return;
      }

      const guide = this.getNavigationGuideAt(world.x, world.y);
      if (guide) {
        this.glideAlongGuide(guide.guide, guide.targetJunction);
      }
    });

    // Smooth Zoom with mouse centering
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.13 : 0.88;
      this.zoomAtScreen(this.mouse.screenX, this.mouse.screenY, zoomFactor);
    }, { passive: false });

    // Touch Support
    let touchStartDist = 0;
    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.screenX = e.touches[0].clientX - rect.left;
        this.mouse.screenY = e.touches[0].clientY - rect.top;
        const world = this.screenToWorld(this.mouse.screenX, this.mouse.screenY);
        this.mouse.worldX = world.x;
        this.mouse.worldY = world.y;

        this.mouse.isDragging = true;
        this.mouse.dragStartX = this.mouse.screenX;
        this.mouse.dragStartY = this.mouse.screenY;
        this.mouse.dragCamStartX = this.camera.targetX;
        this.mouse.dragCamStartY = this.camera.targetY;
        this.mouse.dragDistance = 0;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.mouse.isDragging) {
        const rect = this.canvas.getBoundingClientRect();
        const curX = e.touches[0].clientX - rect.left;
        const curY = e.touches[0].clientY - rect.top;

        const dx = (curX - this.mouse.dragStartX) / this.camera.zoom;
        const dy = (curY - this.mouse.dragStartY) / this.camera.zoom;
        this.camera.targetX = this.mouse.dragCamStartX - dx;
        this.camera.targetY = this.mouse.dragCamStartY - dy;
        this.mouse.dragDistance += Math.abs(dx) + Math.abs(dy);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const curDist = Math.sqrt(dx * dx + dy * dy);
        if (touchStartDist > 0) {
          const ratio = curDist / touchStartDist;
          this.camera.targetZoom = Math.min(Math.max(this.camera.zoom * (ratio > 1 ? 1.04 : 0.96), this.camera.minZoom), this.camera.maxZoom);
        }
      }
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      if (this.mouse.isDragging) {
        this.mouse.isDragging = false;
        if (this.mouse.dragDistance < 10) {
          const clicked = this.getJunctionAt(this.mouse.worldX, this.mouse.worldY);
          if (clicked) {
            this.selectJunction(clicked.id);
            return;
          }
          const guideHover = this.getNavigationGuideAt(this.mouse.worldX, this.mouse.worldY);
          if (guideHover) {
            this.glideAlongGuide(guideHover.guide, guideHover.targetJunction);
          }
        }
      }
      touchStartDist = 0;
    });
  }

  zoomAtScreen(sx, sy, factor) {
    const worldBefore = this.screenToWorld(sx, sy);
    const newTargetZoom = Math.min(Math.max(this.camera.targetZoom * factor, this.camera.minZoom), this.camera.maxZoom);
    this.camera.targetZoom = newTargetZoom;

    this.camera.targetX = worldBefore.x - (sx - this.width / 2) / newTargetZoom;
    this.camera.targetY = worldBefore.y - (sy - this.height / 2) / newTargetZoom;
  }

  zoomIn() {
    this.zoomAtScreen(this.width / 2, this.height / 2, 1.25);
  }

  zoomOut() {
    this.zoomAtScreen(this.width / 2, this.height / 2, 0.8);
  }

  recenter() {
    this.warpToWorld(0, 0, 1.0);
  }

  warpToWorld(wx, wy, zoom = 1.18) {
    this.camera.targetX = wx;
    this.camera.targetY = wy;
    this.camera.targetZoom = zoom;
    this.triggerVibration(wx, wy);
    if (this.soundEngine) this.soundEngine.playNodeClick();
  }

  /**
   * GLIDE ALONG SILK THREAD TO NEXT WEB:
   * Smoothly navigates the camera along the silk thread to the target hub!
   */
  glideAlongGuide(guide, targetJunction) {
    if (!targetJunction) return;

    // Trigger rapid vibration shockwave along the cable
    this.triggerVibration(this.camera.x, this.camera.y);
    setTimeout(() => {
      this.triggerVibration(targetJunction.worldX, targetJunction.worldY);
    }, 180);

    // Audio transition cue
    if (this.soundEngine) {
      this.soundEngine.playNodeClick();
    }

    // Set destination
    this.camera.targetX = targetJunction.worldX;
    this.camera.targetY = targetJunction.worldY;
    this.camera.targetZoom = 1.18;
    this.activeJunctionId = targetJunction.id;

    // Dispatch navigation event to update UI & Nav Pills
    if (this.onNavigateCallback) {
      this.onNavigateCallback(targetJunction.id);
    }
  }

  getJunctionAt(wx, wy) {
    for (let i = 0; i < this.junctions.length; i++) {
      const j = this.junctions[i];
      const dx = wx - j.worldX;
      const dy = wy - j.worldY;
      const hitRadius = (j.coreRadius + 32) / this.camera.zoom;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return j;
      }
      if (j.badgeBounds) {
        const b = j.badgeBounds;
        if (wx >= b.x && wx <= b.x + b.w && wy >= b.y && wy <= b.y + b.h) {
          return j;
        }
      }
    }
    return null;
  }

  /**
   * Detect hover along the Major Navigation Transition Silk Bridges
   */
  getNavigationGuideAt(wx, wy) {
    const hitThreshold = 36 / this.camera.zoom;
    const hitThresholdSq = hitThreshold * hitThreshold;

    for (let i = 0; i < this.navigationGuides.length; i++) {
      const g = this.navigationGuides[i];

      // Check distance to the sampled curve of the silk bridge thread
      let closestDistSq = Infinity;
      let closestT = 0.5;

      for (let s = 0; s < g.samplePoints.length; s++) {
        const pt = g.samplePoints[s];
        const dx = wx - pt.x;
        const dy = wy - pt.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < closestDistSq) {
          closestDistSq = dSq;
          closestT = pt.t;
        }
      }

      if (closestDistSq <= hitThresholdSq) {
        // If current camera is closer to j1, destination is j2!
        const camDistToJ1 = (this.camera.x - g.j1.worldX) ** 2 + (this.camera.y - g.j1.worldY) ** 2;
        const camDistToJ2 = (this.camera.x - g.j2.worldX) ** 2 + (this.camera.y - g.j2.worldY) ** 2;
        
        let targetJunction = closestT < 0.5 ? g.j2 : g.j1;
        let fromJunction = closestT < 0.5 ? g.j1 : g.j2;
        
        if (camDistToJ1 < camDistToJ2 * 0.45) {
          targetJunction = g.j2;
          fromJunction = g.j1;
        } else if (camDistToJ2 < camDistToJ1 * 0.45) {
          targetJunction = g.j1;
          fromJunction = g.j2;
        }

        return {
          guide: g,
          targetJunction,
          fromJunction,
          closestT
        };
      }
    }
    return null;
  }

  checkHover() {
    const prevJuncHover = this.mouse.hoverJunction;
    const prevGuideHover = this.mouse.hoverGuide;

    this.mouse.hoverJunction = this.getJunctionAt(this.mouse.worldX, this.mouse.worldY);
    this.mouse.hoverGuide = !this.mouse.hoverJunction ? this.getNavigationGuideAt(this.mouse.worldX, this.mouse.worldY) : null;

    // Reset guides hover state
    this.navigationGuides.forEach(g => {
      g.isHovered = (this.mouse.hoverGuide && this.mouse.hoverGuide.guide.id === g.id);
    });

    if (this.mouse.hoverJunction !== prevJuncHover || this.mouse.hoverGuide !== prevGuideHover) {
      if (this.mouse.hoverJunction || this.mouse.hoverGuide) {
        this.canvas.style.cursor = "pointer";
        if (this.soundEngine && (this.mouse.hoverJunction || (this.mouse.hoverGuide && !prevGuideHover))) {
          this.soundEngine.playNodeHover();
        }
      } else {
        this.canvas.style.cursor = "default";
      }
    }
  }

  interactPluck() {
    const mdx = this.mouse.worldX - this.mouse.prevWorldX;
    const mdy = this.mouse.worldY - this.mouse.prevWorldY;
    const mSpeed = Math.sqrt(mdx * mdx + mdy * mdy);

    if (mSpeed < 2) return;

    this.junctions.forEach(j => {
      j.nodes.forEach(node => {
        const dx = this.mouse.worldX - node.x;
        const dy = this.mouse.worldY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 42 && dist > 1) {
          const force = (1 - dist / 42) * Math.min(mSpeed * 0.16, 4.5);
          node.vx += (mdx / mSpeed) * force;
          node.vy += (mdy / mSpeed) * force;
        }
      });
    });
  }

  triggerVibration(wx, wy) {
    this.vibrations.push({
      x: wx,
      y: wy,
      radius: 0,
      maxRadius: 1300,
      speed: 10,
      alpha: 0.95
    });

    if (this.spiders) {
      this.spiders.forEach(sp => {
        const d = Math.hypot(sp.x - wx, sp.y - wy);
        if (d < 650) {
          sp.onVibration(wx, wy, d);
        }
      });
    }
  }

  triggerCelestialEntrance() {
    // Start camera far out in the wide cosmic void
    this.camera.zoom = 0.22;
    this.camera.y = -420;
    this.camera.x = 0;
    this.camera.targetZoom = 1.05;
    this.camera.targetY = 0;
    this.camera.targetX = 0;
    this.camera.isGliding = true;

    // Resonant shockwaves rippling through living silk threads
    this.triggerVibration(0, 0);
    setTimeout(() => {
      this.triggerVibration(0, 0);
    }, 320);
    setTimeout(() => {
      this.triggerVibration(0, 0);
    }, 700);

    // Ignite the primary Nexus core
    if (this.junctions && this.junctions[0]) {
      this.activeJunctionId = this.junctions[0].id;
    }
  }

  selectJunction(junctionId) {
    this.activeJunctionId = junctionId;
    const target = this.junctions.find(j => j.id === junctionId);
    if (!target) return;

    this.warpToWorld(target.worldX, target.worldY, 1.25);

    if (this.onJunctionClickCallback) {
      this.onJunctionClickCallback(junctionId);
    }
  }

  selectNode(nodeId) {
    this.selectJunction(nodeId);
  }

  resetActiveNode() {
    this.activeJunctionId = null;
    this.recenter();
  }

  updateHudCoords() {
    const coordsEl = document.getElementById("hud-coords-display");
    if (coordsEl) {
      const x = Math.round(this.camera.targetX);
      const y = Math.round(this.camera.targetY);
      const z = this.camera.zoom.toFixed(2);
      coordsEl.textContent = `X: ${x >= 0 ? '+' : ''}${x} | Y: ${y >= 0 ? '+' : ''}${y} | ZOOM: ${z}x`;
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth camera inertia
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.085;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.085;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.09;

    // Elastic silk spring physics
    const spring = 0.07;
    const damping = 0.88;

    this.junctions.forEach(j => {
      j.nodes.forEach(node => {
        const ax = (node.baseX - node.x) * spring;
        const ay = (node.baseY - node.y) * spring;
        node.vx = (node.vx + ax) * damping;
        node.vy = (node.vy + ay) * damping;
        node.x += node.vx;
        node.y += node.vy;
      });

      j.pulsePhase += 0.035;
      const isHovered = this.mouse.hoverJunction && this.mouse.hoverJunction.id === j.id;
      j.hoverT += ((isHovered ? 1 : 0) - j.hoverT) * 0.14;
    });

    // Animate guide hover transitions
    this.navigationGuides.forEach(g => {
      g.hoverT += ((g.isHovered ? 1 : 0) - g.hoverT) * 0.16;
    });

    this.ctx.save();
    // Infinite camera world transform
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw Long Infinite Anchor Filaments
    this.drawLongAnchorFilaments();

    // 2. Draw Organic Chalk & Moisture Splatters (matching reference image)
    this.drawChalkSplatters();

    // 3. Draw 32+ Filler Cobwebs (Void Filling Tapestry)
    this.drawDenseFillerWebs();

    // 4. Draw Triangular Corner Lace Web Hammocks
    this.drawCornerHammocks();

    // 5. Draw Floating Night Dust Motes
    this.drawFloatingDust();

    // 6. Draw Traveling Shockwave Vibrations
    this.drawVibrations();

    // 7. Draw MAJOR NAVIGATION TRANSITION GUIDES (Lines, Beacons, Pulses, Tooltips)
    this.drawNavigationHighways();

    // 8. Draw the Major Project/Repo Spider Webs (Light Grey Silk)
    this.drawJunctionWebs();

    // 9. Draw Luminous Junction Center Pearls & Badges
    this.drawJunctionPearls();

    // 10. Update & Draw Mini Spiders Crawling on the Webs
    this.updateMiniSpiders();
    this.drawMiniSpiders();

    this.ctx.restore();

    // 11. Draw Screen-Space Directional Compass Pointers
    this.drawOffscreenIndicators();

    requestAnimationFrame(this.animate);
  }

  /**
   * 1. Draw Subtle Organic Outer Anchor Filaments
   */
  drawLongAnchorFilaments() {
    this.ctx.lineWidth = 0.75;
    this.longAnchors.forEach(a => {
      this.ctx.beginPath();
      this.ctx.moveTo(a.startX, a.startY);
      this.ctx.lineTo(a.endX, a.endY);
      this.ctx.strokeStyle = `rgba(135, 138, 142, ${a.alpha})`;
      this.ctx.stroke();
    });
  }

  /**
   * 2. Chalk splatters (cleaned up)
   */
  drawChalkSplatters() {
    // Decluttered: No floating random splatter noise in the void
  }

  /**
   * 3. Filler cobwebs (cleaned up)
   */
  drawDenseFillerWebs() {
    // Decluttered: No background filler cobwebs
  }

  /**
   * 4. Corner lace hammocks (cleaned up)
   */
  drawCornerHammocks() {
    // Decluttered: No triangular hammock web clutter
  }

  /**
   * 5. Draw Natural Silk Bridge Cables
   * Slender, organic bridge lines connecting major webs.
   * Illuminates with soft silver glow on hover.
   */
  drawNavigationHighways() {
    this.navigationGuides.forEach(g => {
      const isHovered = g.isHovered;
      const hoverT = g.hoverT;

      // Outer Glow on hover
      if (isHovered || hoverT > 0.05) {
        this.ctx.beginPath();
        this.ctx.moveTo(g.j1.worldX, g.j1.worldY);
        this.ctx.quadraticCurveTo(g.midX, g.midY, g.j2.worldX, g.j2.worldY);
        this.ctx.strokeStyle = `rgba(235, 238, 242, ${0.45 + hoverT * 0.45})`;
        this.ctx.lineWidth = 1.6 + hoverT * 1.2;
        this.ctx.shadowBlur = 10 * hoverT;
        this.ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }

      // Core delicate silk bridge strand
      this.ctx.beginPath();
      this.ctx.moveTo(g.j1.worldX, g.j1.worldY);
      this.ctx.quadraticCurveTo(g.midX, g.midY, g.j2.worldX, g.j2.worldY);
      this.ctx.strokeStyle = isHovered ? "#ffffff" : "rgba(145, 148, 153, 0.35)";
      this.ctx.lineWidth = isHovered ? 1.2 : 0.95;
      this.ctx.stroke();

      // Subtle occasional traveling glint
      g.pulses.forEach(p => {
        p.progress = (p.progress + p.speed) % 1.0;
        const t = p.dir > 0 ? p.progress : (1.0 - p.progress);

        const px = (1 - t) * (1 - t) * g.j1.worldX + 2 * (1 - t) * t * g.midX + t * t * g.j2.worldX;
        const py = (1 - t) * (1 - t) * g.j1.worldY + 2 * (1 - t) * t * g.midY + t * t * g.j2.worldY;

        this.ctx.beginPath();
        this.ctx.arc(px, py, p.size * (1 + hoverT * 0.5), 0, Math.PI * 2);
        this.ctx.fillStyle = isHovered ? "#ffffff" : "rgba(180, 183, 188, 0.55)";
        this.ctx.fill();
      });
    });

    // Floating guide tooltip when hovering anywhere along the bridge line
    if (this.mouse.hoverGuide) {
      this.drawGuideHoverTooltip(this.mouse.hoverGuide);
    }
  }

  /**
   * Floating Guide Tooltip when hovering anywhere on the transition silk cable
   */
  drawGuideHoverTooltip(hoverInfo) {
    const { targetJunction } = hoverInfo;
    const wx = this.mouse.worldX;
    const wy = this.mouse.worldY - 26 / this.camera.zoom;

    const text = `⚡ CLICK SILK LINE TO GLIDE TO [${targetJunction.title}] ➔`;

    this.ctx.save();
    this.ctx.font = "600 11px 'JetBrains Mono', monospace";
    const textWidth = this.ctx.measureText(text).width;
    const pillW = textWidth + 24;
    const pillH = 28;

    this.ctx.beginPath();
    this.ctx.roundRect(wx - pillW / 2, wy - pillH, pillW, pillH, 6);
    this.ctx.fillStyle = "rgba(10, 10, 12, 0.96)";
    this.ctx.fill();

    this.ctx.strokeStyle = "rgba(160, 163, 166, 0.7)";
    this.ctx.lineWidth = 1.3;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = "rgba(100, 103, 106, 0.35)";
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = "#dcdee0";
    this.ctx.fillText(text, wx - pillW / 2 + 12, wy - 10);

    this.ctx.restore();
  }

  drawFloatingDust() {
    for (let i = 0; i < this.floatingDust.length; i++) {
      const p = this.floatingDust[i];
      p.x += p.vx;
      p.y += p.vy;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  }

  drawVibrations() {
    for (let i = this.vibrations.length - 1; i >= 0; i--) {
      const v = this.vibrations[i];
      v.radius += v.speed;
      v.alpha *= 0.965;

      if (v.alpha <= 0.02 || v.radius >= v.maxRadius) {
        this.vibrations.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(v.x, v.y, v.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(130, 133, 136, ${v.alpha * 0.35})`;
      this.ctx.lineWidth = 1.4 / this.camera.zoom;
      this.ctx.stroke();
    }
  }

  /**
   * Draw the distinct Project & Section Spider Webs (Organic Light Grey Silk)
   * Natural orb-weaver structure inspired directly by specimen reference print:
   * - Slender, graceful organic radials (anchor spokes extend into darkness)
   * - Natural catenary capture spirals (smooth inward droop)
   * - Delicate beaded moisture dewdrops on viscid threads
   * - Concentric hub disc around the central glowing white dot
   */
  drawJunctionWebs() {
    const time = Date.now() * 0.003;

    this.junctions.forEach(j => {
      const isHovered = this.mouse.hoverJunction && this.mouse.hoverJunction.id === j.id;

      // 1. Delicate Central Hub Webbing Loops
      if (j.hubLoops) {
        this.ctx.strokeStyle = "rgba(150, 153, 158, 0.42)";
        this.ctx.lineWidth = 0.72;
        j.hubLoops.forEach(hl => {
          for (let s = 0; s < j.spokes.length; s++) {
            const nextS = (s + 1) % j.spokes.length;
            const a1 = j.spokes[s].angle;
            const a2 = j.spokes[nextS].angle;
            const p1x = j.worldX + Math.cos(a1) * hl.radius;
            const p1y = j.worldY + Math.sin(a1) * hl.radius;
            const p2x = j.worldX + Math.cos(a2) * hl.radius;
            const p2y = j.worldY + Math.sin(a2) * hl.radius;

            const midX = (p1x + p2x) / 2;
            const midY = (p1y + p2y) / 2;
            const toCenterX = j.worldX - midX;
            const toCenterY = j.worldY - midY;
            const dist = Math.hypot(toCenterX, toCenterY) || 1;
            const chord = Math.hypot(p2x - p1x, p2y - p1y) || 10;
            const sag = chord * 0.12;

            this.ctx.beginPath();
            this.ctx.moveTo(p1x, p1y);
            this.ctx.quadraticCurveTo(midX + (toCenterX / dist) * sag, midY + (toCenterY / dist) * sag, p2x, p2y);
            this.ctx.stroke();
          }
        });
      }

      // 2. Structural Radial Spokes (Clean, delicate organic silk threads)
      j.spokes.forEach((spoke) => {
        this.ctx.beginPath();
        this.ctx.moveTo(j.worldX, j.worldY);
        this.ctx.quadraticCurveTo(spoke.ctrlX, spoke.ctrlY, spoke.endX, spoke.endY);
        this.ctx.strokeStyle = isHovered ? "rgba(240, 243, 248, 0.95)" : "rgba(165, 168, 172, 0.52)";
        this.ctx.lineWidth = isHovered ? 1.25 : 0.85;
        if (isHovered) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = "rgba(220, 225, 230, 0.4)";
        }
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      });

      // 3. Capture Spiral Catenary Curves (Realistic droop + natural imperfections)
      for (let r = 0; r < j.rings.length; r++) {
        for (let s = 0; s < j.spokes.length; s++) {
          const nextS = (s + 1) % j.spokes.length;

          const p1 = j.nodes.find(n => n.rIndex === r && n.sIndex === s);
          const p2 = j.nodes.find(n => n.rIndex === r && n.sIndex === nextS);

          if (!p1 || !p2) continue;

          // Occasional organic skip / loose end on outer periphery (natural web imperfection)
          if (r >= j.rings.length - 2 && (s + r * 5) % 11 === 0) {
            continue;
          }

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const toCenterX = j.worldX - midX;
          const toCenterY = j.worldY - midY;
          const distToCenter = Math.hypot(toCenterX, toCenterY) || 1;

          const chordDist = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 30;
          // Natural catenary sag proportional to chord distance between spokes!
          const sag = chordDist * (0.14 + Math.sin(r * 1.7 + s * 2.3) * 0.02);
          const ctrlX = midX + (toCenterX / distToCenter) * sag;
          const ctrlY = midY + (toCenterY / distToCenter) * sag;

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);

          const ringAlpha = 0.32 + (r % 3) * 0.05;
          this.ctx.strokeStyle = isHovered
            ? "rgba(215, 218, 222, 0.82)"
            : `rgba(135, 138, 142, ${ringAlpha})`;
          this.ctx.lineWidth = isHovered ? 0.95 : 0.72;
          this.ctx.stroke();
        }
      }

      // 4. Shimmering Dewdrops along capture threads (positioned precisely on catenary curve)
      j.dewdrops.forEach(drop => {
        const p1 = j.nodes.find(n => n.rIndex === drop.rIndex && n.sIndex === drop.sIndex);
        const nextS = (drop.sIndex + 1) % j.spokes.length;
        const p2 = j.nodes.find(n => n.rIndex === drop.rIndex && n.sIndex === nextS);

        if (!p1 || !p2) return;

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const toCenterX = j.worldX - midX;
        const toCenterY = j.worldY - midY;
        const distToCenter = Math.hypot(toCenterX, toCenterY) || 1;

        const chordDist = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 30;
        const sag = chordDist * (0.14 + Math.sin(drop.rIndex * 1.7 + drop.sIndex * 2.3) * 0.02);
        const ctrlX = midX + (toCenterX / distToCenter) * sag;
        const ctrlY = midY + (toCenterY / distToCenter) * sag;

        // Exact position ON the quadratic catenary curve!
        const t = drop.t;
        const invT = 1 - t;
        const x = invT * invT * p1.x + 2 * invT * t * ctrlX + t * t * p2.x;
        const y = invT * invT * p1.y + 2 * invT * t * ctrlY + t * t * p2.y;

        const glint = (Math.sin(time * 1.2 + drop.glintPhase) + 1) * 0.5;

        this.ctx.beginPath();
        this.ctx.arc(x, y, drop.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(205, 208, 214, ${drop.alpha + glint * 0.3})`;
        this.ctx.fill();
      });
    });
  }

  /**
   * Draw the Central Junction Hubs as a tiny, extremely bright white glowing star dot
   * - Tiny brilliant white pinpoint core (radius 2.5px - 3.5px)
   * - Multi-tier radiant white corona & bloom (intense white heat)
   * - Razor-sharp anamorphic cross-flare / starburst diffraction needle spikes
   * - Delicate optical airy ring
   * - Elegantly suspended glassmorphism info badge
   */
  drawJunctionPearls() {
    this.junctions.forEach(j => {
      const isActive = this.activeJunctionId === j.id;
      const isHovered = this.mouse.hoverJunction && this.mouse.hoverJunction.id === j.id;
      const isNexus = j.id === "nexus";

      // Tiny, sharp pinpoint radius:
      const coreR = (isNexus ? 3.2 : 2.2) + j.hoverT * 0.8;
      const pulse = Math.sin(j.pulsePhase * 2.2);

      this.ctx.save();
      this.ctx.translate(j.worldX, j.worldY);

      // 1. Broad Ethereal White Atmospheric Bloom
      const bloomRadius = (isNexus ? 58 : 38) * (1 + j.hoverT * 0.3 + pulse * 0.05);
      const bloomGrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, bloomRadius);
      bloomGrad.addColorStop(0, isActive || isHovered ? "rgba(255, 255, 255, 0.48)" : "rgba(255, 255, 255, 0.30)");
      bloomGrad.addColorStop(0.22, isActive || isHovered ? "rgba(255, 255, 255, 0.20)" : "rgba(235, 238, 242, 0.11)");
      bloomGrad.addColorStop(0.58, "rgba(200, 205, 215, 0.03)");
      bloomGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      this.ctx.beginPath();
      this.ctx.arc(0, 0, bloomRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = bloomGrad;
      this.ctx.fill();

      // 2. Searing Intense Inner White Corona (White Heat Photosphere)
      const coronaRadius = (isNexus ? 16 : 11) * (1 + j.hoverT * 0.3 + pulse * 0.08);
      const coronaGrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, coronaRadius);
      coronaGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      coronaGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.88)");
      coronaGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.32)");
      coronaGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      this.ctx.beginPath();
      this.ctx.arc(0, 0, coronaRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = coronaGrad;
      this.ctx.fill();

      // 3. Razor-Sharp Celestial Cross Diffraction Spikes (Anamorphic Starburst Needle Rays)
      const flareLen = (isNexus ? 36 : 24) * (1 + j.hoverT * 0.35 + pulse * 0.1);
      const flareThick = isNexus ? 1.4 : 1.1;

      this.ctx.save();
      // Subtle organic breathing angle
      this.ctx.rotate(j.pulsePhase * 0.06);

      // Cardinal Needle Rays (Horizontal & Vertical)
      // Horizontal ray
      const hGrad = this.ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      hGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
      hGrad.addColorStop(0.5, "#ffffff");
      hGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.65)");
      hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.beginPath();
      this.ctx.moveTo(-flareLen, 0);
      this.ctx.lineTo(0, -flareThick);
      this.ctx.lineTo(flareLen, 0);
      this.ctx.lineTo(0, flareThick);
      this.ctx.closePath();
      this.ctx.fillStyle = hGrad;
      this.ctx.fill();

      // Vertical ray
      const vGrad = this.ctx.createLinearGradient(0, -flareLen, 0, flareLen);
      vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      vGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
      vGrad.addColorStop(0.5, "#ffffff");
      vGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.65)");
      vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.beginPath();
      this.ctx.moveTo(0, -flareLen);
      this.ctx.lineTo(-flareThick, 0);
      this.ctx.lineTo(0, flareLen);
      this.ctx.lineTo(flareThick, 0);
      this.ctx.closePath();
      this.ctx.fillStyle = vGrad;
      this.ctx.fill();

      // Diagonal Micro-Rays (45 degree, 50% length for celestial diamond glint)
      const diagLen = flareLen * 0.52;
      const diagThick = flareThick * 0.7;
      this.ctx.rotate(Math.PI / 4);

      const dGrad = this.ctx.createLinearGradient(-diagLen, 0, diagLen, 0);
      dGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      dGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
      dGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.beginPath();
      this.ctx.moveTo(-diagLen, 0);
      this.ctx.lineTo(0, -diagThick);
      this.ctx.lineTo(diagLen, 0);
      this.ctx.lineTo(0, diagThick);
      this.ctx.closePath();
      this.ctx.fillStyle = dGrad;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(0, -diagLen);
      this.ctx.lineTo(-diagThick, 0);
      this.ctx.lineTo(0, diagLen);
      this.ctx.lineTo(diagThick, 0);
      this.ctx.closePath();
      this.ctx.fillStyle = dGrad;
      this.ctx.fill();

      this.ctx.restore();

      // 4. Subtle Optical Airy Halo Ring
      const ringRadius = (isNexus ? 11 : 8) + Math.sin(j.pulsePhase) * 0.6;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = isActive || isHovered ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.32)";
      this.ctx.lineWidth = 0.65;
      this.ctx.stroke();

      // 5. The Tiny Brilliant White Glowing Core Dot
      this.ctx.beginPath();
      this.ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.shadowBlur = isNexus ? (isHovered ? 28 : 20) : (isHovered ? 20 : 14);
      this.ctx.shadowColor = "#ffffff";
      this.ctx.fill();

      // Extra pinpoint hot-center
      this.ctx.beginPath();
      this.ctx.arc(0, 0, coreR * 0.55, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
      this.ctx.restore();

      // 6. Symmetrically Suspended Glass Badge Capsule
      this.drawJunctionBadge(j, isHovered, isActive, coreR);
    });
  }

  drawJunctionBadge(j, isHovered, isActive, coreR) {
    const isNexus = j.id === "nexus";
    const labelText = j.label;
    const titleText = j.title;

    this.ctx.save();
    this.ctx.font = "600 10.5px 'JetBrains Mono', monospace";
    const labelWidth = this.ctx.measureText(labelText).width;
    this.ctx.font = isNexus ? "700 13px 'Space Grotesk', sans-serif" : "600 12px 'Space Grotesk', sans-serif";
    const titleWidth = this.ctx.measureText(titleText).width;

    const boxWidth = Math.max(labelWidth, titleWidth) + 38;
    const boxHeight = isNexus ? 42 : 38;

    // Symmetrically Horizontally Centered right below the glowing dot
    const boxX = j.worldX - boxWidth / 2;
    const stemLength = isNexus ? 26 : 20;
    const boxY = j.worldY + coreR + stemLength;

    // Store bounding box for click/hover hit-testing!
    j.badgeBounds = { x: boxX, y: boxY, w: boxWidth, h: boxHeight };

    // 1. Delicate vertical silk anchor filament connecting glowing dot to badge
    this.ctx.beginPath();
    this.ctx.moveTo(j.worldX, j.worldY + coreR + 1);
    this.ctx.lineTo(j.worldX, boxY);
    this.ctx.strokeStyle = "rgba(180, 183, 188, 0.55)";
    this.ctx.lineWidth = 0.85;
    this.ctx.stroke();

    // Dewdrop pearl at center of stem
    this.ctx.beginPath();
    this.ctx.arc(j.worldX, j.worldY + coreR + stemLength * 0.5, 1.6, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(235, 238, 242, 0.85)";
    this.ctx.fill();

    // 2. Glassmorphism Badge Capsule Container
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
    this.ctx.fillStyle = isActive
      ? "rgba(14, 15, 18, 0.96)"
      : (isHovered ? "rgba(16, 17, 20, 0.94)" : "rgba(11, 12, 14, 0.90)");
    this.ctx.fill();

    this.ctx.strokeStyle = isActive
      ? "rgba(240, 243, 247, 0.92)"
      : (isHovered ? "rgba(200, 203, 208, 0.75)" : "rgba(115, 118, 122, 0.35)");
    this.ctx.lineWidth = 1.1;
    if (isHovered || isActive) {
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // 3. Status Glow Jewel Pip on the left (tiny glowing white dot)
    const pipX = boxX + 13;
    const pipY = boxY + boxHeight / 2;
    this.ctx.beginPath();
    this.ctx.arc(pipX, pipY, 2.8, 0, Math.PI * 2);
    this.ctx.fillStyle = isActive || isHovered ? "#ffffff" : "#c5c8cc";
    this.ctx.shadowBlur = isActive || isHovered ? 8 : 3;
    this.ctx.shadowColor = "#ffffff";
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // 4. Header Monospace Tag
    this.ctx.font = "600 9.5px 'JetBrains Mono', monospace";
    this.ctx.fillStyle = isActive ? "#c8cccf" : (isHovered ? "#b4b8bc" : "#7e8286");
    this.ctx.fillText(labelText, boxX + 24, boxY + (isNexus ? 15 : 14));

    // 5. Main Title Heading
    this.ctx.font = isNexus ? "700 13px 'Space Grotesk', sans-serif" : "600 12px 'Space Grotesk', sans-serif";
    this.ctx.fillStyle = isActive || isHovered ? "#ffffff" : "#e2e4e6";
    this.ctx.fillText(titleText, boxX + 24, boxY + (isNexus ? 31 : 28));

    this.ctx.restore();
  }

  drawOffscreenIndicators() {
    const margin = 32;

    this.junctions.forEach(j => {
      const screenPos = this.worldToScreen(j.worldX, j.worldY);
      const isOffscreen = screenPos.x < 0 || screenPos.x > this.width || screenPos.y < 0 || screenPos.y > this.height;

      if (isOffscreen) {
        const dx = screenPos.x - this.width / 2;
        const dy = screenPos.y - this.height / 2;
        const angle = Math.atan2(dy, dx);

        const edgeX = Math.min(Math.max(this.width / 2 + Math.cos(angle) * (this.width / 2 - margin), margin), this.width - margin);
        const edgeY = Math.min(Math.max(this.height / 2 + Math.sin(angle) * (this.height / 2 - margin), margin), this.height - margin);

        this.ctx.save();
        this.ctx.translate(edgeX, edgeY);
        this.ctx.rotate(angle);

        this.ctx.beginPath();
        this.ctx.moveTo(8, 0);
        this.ctx.lineTo(-6, -5);
        this.ctx.lineTo(-3, 0);
        this.ctx.lineTo(-6, 5);
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(150, 153, 156, 0.7)";
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "rgba(100, 103, 106, 0.4)";
        this.ctx.fill();

        this.ctx.restore();
      }
    });
  }
}

if (typeof window !== "undefined") {
  window.SpiderWeb = SpiderWeb;
}
