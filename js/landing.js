/**
 * Cinematic Landing Page & Quantum Warp Gate Engine
 * Aarav Shah Portfolio — Neural Gateway → Spider Web Universe
 */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________01αβΩ';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 15);
      const end = start + Math.floor(Math.random() * 15) + 6;
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:rgba(180,200,255,0.9);">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

class LandingPortal {
  constructor() {
    this.container = document.getElementById("landing-page");
    this.canvas = document.getElementById("landing-particles");
    this.enterBtn = document.getElementById("landing-enter-btn");
    this.warpFlash = document.getElementById("warp-flash");
    this.centerBlock = document.querySelector(".landing-center");
    this.titleElement = document.querySelector(".landing-title");
    this.firstNameEl = document.querySelector(".landing-title .first-name");
    this.lastNameEl = document.querySelector(".landing-title .last-name");
    this.subtitleEl = document.querySelector(".landing-subtitle");
    this.gatewayBtn = document.getElementById("gateway-portal-btn");

    // Preloader Elements
    this.preloader = document.getElementById("system-preloader");
    this.preloaderFill = document.getElementById("preloader-bar-fill");
    this.preloaderPercent = document.getElementById("preloader-percent");
    this.preloaderTerminal = document.getElementById("preloader-terminal");
    this.preloaderStatus = document.getElementById("preloader-status-text");

    if (!this.container || !this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // State
    this.isWarping = false;
    this.isSingularity = false;
    this.isActive = true;
    this.warpProgress = 0; // 0 to 1
    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      targetX: this.width / 2,
      targetY: this.height / 2,
      active: false
    };

    // Parallax Tilt
    this.tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Particles & Shockwaves & Stardust
    this.particles = [];
    this.shockwaves = [];
    this.stardust = [];
    this.particleCount = window.innerWidth < 768 ? 70 : 130;
    this.maxConnectDist = 115;

    // 3D Spider-Silk Hyper-Tunnel Rings
    this.tunnelRings = [];
    this.initTunnelRings();

    // Scramble instances
    if (this.firstNameEl) this.firstNameScramble = new TextScramble(this.firstNameEl);
    if (this.lastNameEl) this.lastNameScramble = new TextScramble(this.lastNameEl);

    this.init();
  }

  initTunnelRings() {
    this.tunnelRings = [];
    const webCount = 14;
    for (let r = 0; r < webCount; r++) {
      this.tunnelRings.push({
        z: 80 + r * 68,
        rotation: (r * Math.PI) / 8,
        wobblePhase: r * 0.45,
        sagFactor: 0.14 + (r % 3) * 0.03
      });
    }

    // High-speed radial silk pulses traveling along the 16 spokes
    this.silkPulses = [];
    for (let p = 0; p < 18; p++) {
      this.silkPulses.push({
        spokeIndex: Math.floor(Math.random() * 16),
        progress: Math.random(),
        speed: 0.7 + Math.random() * 0.8,
        size: 3 + Math.random() * 2.5
      });
    }

    // Floating dewdrifts (3D moisture particles glistening in the slipstream)
    this.dewdrifts = [];
    for (let d = 0; d < 80; d++) {
      this.dewdrifts.push({
        x: (Math.random() - 0.5) * this.width * 1.6,
        y: (Math.random() - 0.5) * this.height * 1.6,
        z: Math.random() * 1000 + 20,
        speed: Math.random() * 1.2 + 0.8,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.3
      });
    }
  }

  init() {
    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.setupMagneticButton();
    this.setupSoundHooks();

    // Run Preloader Boot Sequence
    this.runBootSequence();

    // Animation Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.render(t));
  }

  runBootSequence() {
    if (!this.preloader) {
      this.onBootComplete();
      return;
    }

    const messages = [
      "> INITIALIZING QUANTUM NEURAL HYPERCORE...",
      "> COMPILING MULTI-DIMENSIONAL SPIDER TOPOLOGY... [OK]",
      "> SYNCHRONIZING 32+ PROCEDURAL SILK TAPESTRIES... [OK]",
      "> CALIBRATING ARACHNID KINEMATICS & DEW SENSORS... [OK]",
      "> ALL SYSTEMS OPTIMAL // LAUNCHING GATEWAY."
    ];

    let currentMsgIdx = 0;
    let progress = 0;
    const duration = 1250; // ms
    const startTime = performance.now();

    const updateBoot = (now) => {
      const elapsed = now - startTime;
      progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      if (this.preloaderFill) this.preloaderFill.style.width = `${progress}%`;
      if (this.preloaderPercent) this.preloaderPercent.textContent = `${progress < 10 ? '0' : ''}${progress}%`;

      // Update terminal line
      const stepIdx = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
      if (stepIdx !== currentMsgIdx && this.preloaderTerminal) {
        currentMsgIdx = stepIdx;
        this.preloaderTerminal.innerHTML = `<div class="terminal-line active">${messages[currentMsgIdx]}</div>`;
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playTerminalKey === "function") {
          window.soundEngineInstance.playTerminalKey();
        }
      }

      if (progress < 100) {
        requestAnimationFrame(updateBoot);
      } else {
        // Boot complete!
        if (this.preloaderStatus) this.preloaderStatus.textContent = "ONLINE // READY";
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playBootChirp === "function") {
          window.soundEngineInstance.playBootChirp();
        }

        setTimeout(() => {
          this.preloader.classList.add("unlocked");
          setTimeout(() => {
            this.preloader.classList.add("hidden");
          }, 700);

          this.onBootComplete();
        }, 250);
      }
    };

    requestAnimationFrame(updateBoot);
  }

  onBootComplete() {
    if (this.centerBlock) {
      this.centerBlock.classList.add("animate");
    }

    // Trigger Cyber Decryption Text Scramble
    if (this.firstNameScramble) this.firstNameScramble.setText("AARAV");
    if (this.lastNameScramble) {
      setTimeout(() => {
        this.lastNameScramble.setText("SHAH");
      }, 150);
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (this.particles.length === 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    const count = window.innerWidth < 768 ? 65 : 130;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        baseRadius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.25,
        color: Math.random() < 0.25 ? "#b0baff" : (Math.random() < 0.5 ? "#9098b8" : "#727788"),
        wx: (Math.random() - 0.5) * this.width * 1.2,
        wy: (Math.random() - 0.5) * this.height * 1.2,
        wz: Math.random() * 1000 + 10,
        wSpeed: Math.random() * 1.2 + 0.8
      });
    }
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resize(), { passive: true });

    // Mouse tracking for parallax tilt, cursor stardust, and particle reaction
    window.addEventListener("mousemove", (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;

      // Parallax Tilt (-15 to 15 deg max)
      const normX = (e.clientX / this.width - 0.5) * 2;
      const normY = (e.clientY / this.height - 0.5) * 2;
      this.tilt.targetY = normX * 8; // rotateY
      this.tilt.targetX = -normY * 8; // rotateX

      // Spawn stardust motes on movement
      if (this.isActive && !this.isWarping && Math.random() < 0.4) {
        this.stardust.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 1.0,
          decay: 0.035 + Math.random() * 0.02,
          size: Math.random() * 2 + 1,
          color: Math.random() < 0.5 ? "rgba(180, 205, 255, " : "rgba(140, 160, 240, "
        });
      }
    }, { passive: true });

    // Touch support for mobile tilt
    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
        this.mouse.active = true;
      }
    }, { passive: true });

    // Interactive Shockwave on Canvas Click
    if (this.container) {
      this.container.addEventListener("click", (e) => {
        // Ignore if clicking the enter button or links
        if (e.target.closest("#landing-enter-btn") || e.target.closest("a")) return;

        this.triggerShockwave(e.clientX, e.clientY);
      });
    }

    // Enter Universe Warp Click
    if (this.enterBtn) {
      this.enterBtn.addEventListener("click", () => {
        this.triggerWarpEntrance();
      });
    }

    // Keyboard support: Enter key initiates warp if landing page is active
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.isActive && !this.isWarping) {
        this.triggerWarpEntrance();
      }
    });

    // Gateway return button from web world
    if (this.gatewayBtn) {
      this.gatewayBtn.addEventListener("click", () => {
        this.reenterGateway();
      });
    }
  }

  triggerShockwave(x, y) {
    if (!this.isActive || this.isWarping) return;

    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.min(this.width, this.height) * 0.45,
      speed: 480,
      alpha: 0.85
    });

    if (window.soundEngineInstance && typeof window.soundEngineInstance.playShockwaveSound === "function") {
      window.soundEngineInstance.playShockwaveSound();
    }
  }

  setupMagneticButton() {
    if (!this.enterBtn) return;

    this.enterBtn.addEventListener("mousemove", (e) => {
      const rect = this.enterBtn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      this.enterBtn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px) scale(1.05)`;
    });

    this.enterBtn.addEventListener("mouseleave", () => {
      this.enterBtn.style.transform = `translate(0px, 0px) scale(1)`;
    });
  }

  setupSoundHooks() {
    if (this.enterBtn) {
      this.enterBtn.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance) {
          window.soundEngineInstance.playNodeHover();
        }
      });
    }

    // Title Glitch & Re-scramble on hover
    if (this.titleElement) {
      this.titleElement.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playGlitchChirp === "function") {
          window.soundEngineInstance.playGlitchChirp();
        }
        if (this.firstNameScramble) this.firstNameScramble.setText("AARAV");
        if (this.lastNameScramble) {
          setTimeout(() => this.lastNameScramble.setText("SHAH"), 120);
        }
      });
    }

    // Skill Tag floats
    const tags = document.querySelectorAll(".skill-tag-float");
    tags.forEach(tag => {
      tag.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance) {
          window.soundEngineInstance.playTerminalKey();
        }
      });
    });

    // Social links hover
    const socialLinks = document.querySelectorAll(".landing-social-link");
    socialLinks.forEach(link => {
      link.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance) {
          window.soundEngineInstance.playNodeHover();
        }
      });
    });
  }

  triggerWarpEntrance() {
    if (this.isWarping) return;
    this.isWarping = true;
    this.warpProgress = 0;

    // Change button status
    if (this.enterBtn) {
      this.enterBtn.classList.add("charging");
      const btnText = this.enterBtn.querySelector("span:first-child");
      if (btnText) btnText.textContent = "CALIBRATING QUANTUM LINK...";
    }

    // Phase 1: Singularity Accretion & Card Dissolve (0ms -> 700ms)
    if (this.container) {
      this.container.classList.add("warp-charging");
    }
    this.isSingularity = true;

    // Trigger synthetic procedural audio
    if (window.soundEngineInstance && typeof window.soundEngineInstance.playWarpJump === "function") {
      window.soundEngineInstance.playWarpJump();
    } else if (window.soundEngineInstance) {
      window.soundEngineInstance.playNodeClick();
    }

    // Reveal top flight telemetry HUD
    const hud = document.getElementById("warp-telemetry-hud");
    const statusText = document.getElementById("warp-status-text");
    const velText = document.getElementById("warp-velocity-text");
    const velFill = document.getElementById("warp-velocity-fill");
    if (hud) hud.classList.add("active");
    if (statusText) statusText.textContent = "QUANTUM SILK WEAVE: ENGAGED";
    if (velText) velText.textContent = "0.2c";
    if (velFill) velFill.style.width = "10%";

    // Phase 2: Relativistic Hyperspace Wormhole Tunnel (700ms -> 3000ms)
    setTimeout(() => {
      this.isSingularity = false;

      if (this.container) {
        this.container.classList.remove("warp-charging");
        this.container.classList.add("warp-active");
      }

      if (statusText) statusText.textContent = "RELATIVISTIC SILK VORTEX // ACCELERATING";

      // Animate velocity bar smoothly through hyperspace
      if (this.velInterval) clearInterval(this.velInterval);
      let vProgress = 0.15;
      this.velInterval = setInterval(() => {
        vProgress += 0.038;
        if (vProgress >= 0.55 && vProgress < 0.85) {
          if (statusText) statusText.textContent = "HARMONIC SILK RESONANCE // APPROACHING CORE NEXUS";
        } else if (vProgress >= 0.85 && vProgress < 0.99) {
          if (statusText) statusText.textContent = "CRITICAL TENSION: 9.9c // SYNCHRONIZING NEURAL WEAVE";
        } else if (vProgress >= 0.99) {
          vProgress = 1.0;
          clearInterval(this.velInterval);
          this.velInterval = null;
          if (statusText) statusText.textContent = "MAX WARP: 9.9c // NEXUS ARRIVAL CONFIRMED";
        }
        if (velText) {
          const c = (vProgress * 9.9).toFixed(1);
          velText.textContent = `${c}c`;
        }
        if (velFill) {
          velFill.style.width = `${Math.round(vProgress * 100)}%`;
        }
      }, 85);

      // Phase 3: Relativistic Emergence & Seamless Blend into Web Universe (3000ms -> 3900ms)
      setTimeout(() => {
        // Dissolve landing container smoothly (pure fade into spider web)
        if (this.container) {
          this.container.classList.remove("warp-active");
          this.container.classList.add("warp-dissolving");
        }

        // Initialize celestial dive in Spider Web Universe (aligned right on center Nexus (0, 0)!)
        if (window.spiderWebInstance && typeof window.spiderWebInstance.triggerCelestialEntrance === "function") {
          window.spiderWebInstance.triggerCelestialEntrance();
        } else if (window.spiderWebInstance) {
          const web = window.spiderWebInstance;
          web.camera.zoom = 0.40;
          web.camera.y = 0;
          web.camera.x = 0;
          web.camera.targetZoom = 1.0;
          web.camera.targetY = 0;
          web.camera.targetX = 0;
          web.camera.isGliding = true;
          if (typeof web.triggerVibration === "function") {
            web.triggerVibration(0, 0);
            setTimeout(() => web.triggerVibration(0, 0), 250);
          }
        }

        // Phase 4: Settle & Finalize (3900ms)
        setTimeout(() => {
          if (hud) hud.classList.remove("active");

          if (this.container) {
            this.container.classList.add("hidden");
            this.container.classList.remove("warp-dissolving");
            this.isActive = false;
          }

          // Cybernetic hint banner update
          const hint = document.getElementById("web-instruction-hint");
          if (hint) {
            hint.innerHTML = `<div class="hint-pill"><span class="hint-pulse-dot"></span><span>➔ <strong>NEURAL NEXUS SYNCHRONIZED</strong> &bull; DRAG TO PAN &bull; SCROLL TO ZOOM &bull; CLICK NODES TO INSPECT</span></div>`;
            hint.style.opacity = "1";
          }
        }, 900);

      }, 2300); // 700 + 2300 = 3000ms

    }, 700); // 700ms singularity accretion
  }

  reenterGateway() {
    this.isActive = true;
    this.isWarping = false;
    this.isSingularity = false;
    this.warpProgress = 0;
    if (this.velInterval) {
      clearInterval(this.velInterval);
      this.velInterval = null;
    }

    // Reset button
    if (this.enterBtn) {
      this.enterBtn.classList.remove("charging");
      const btnText = this.enterBtn.querySelector("span:first-child");
      if (btnText) btnText.textContent = "INITIALIZE NEURAL UNIVERSE";
    }

    const hud = document.getElementById("warp-telemetry-hud");
    if (hud) hud.classList.remove("active");

    // Close any active card modal
    const cardOverlay = document.getElementById("key-card-overlay");
    if (cardOverlay && cardOverlay.classList.contains("active")) {
      cardOverlay.classList.remove("active");
    }

    if (window.spiderWebInstance) {
      window.spiderWebInstance.resetActiveNode();
    }

    if (window.soundEngineInstance) {
      window.soundEngineInstance.playNodeClick();
    }

    if (this.container) {
      this.container.classList.remove("hidden");
      this.container.classList.remove("warp-charging");
      this.container.classList.remove("warp-active");
      this.container.classList.remove("warp-dissolving");
      this.container.classList.remove("warp-breakthrough");
      this.container.classList.remove("warping");
      this.container.classList.remove("singularity-charging");
      this.container.classList.add("gateway-reentry");
      setTimeout(() => {
        if (this.container) this.container.classList.remove("gateway-reentry");
      }, 800);
    }

    // Re-create particles and reset wormhole rings for fresh field
    this.createParticles();
    this.initTunnelRings();
    this.shockwaves = [];
    this.stardust = [];

    // Re-trigger text scramble
    if (this.firstNameScramble) this.firstNameScramble.setText("AARAV");
    if (this.lastNameScramble) {
      setTimeout(() => this.lastNameScramble.setText("SHAH"), 120);
    }
  }

  render(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (this.isActive) {
      // Smooth mouse follow
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

      // Parallax Tilt on Center Content Block
      if (this.centerBlock && !this.isWarping) {
        this.tilt.x += (this.tilt.targetX - this.tilt.x) * 0.08;
        this.tilt.y += (this.tilt.targetY - this.tilt.y) * 0.08;
        this.centerBlock.style.transform = `perspective(1000px) rotateX(${this.tilt.x.toFixed(2)}deg) rotateY(${this.tilt.y.toFixed(2)}deg)`;
      }

      // Clear Canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      if (!this.isWarping) {
        this.renderNormalConstellation(dt);
        this.renderShockwaves(dt);
        this.renderStardust(dt);
      } else if (this.isSingularity) {
        this.renderSingularityImplosion(dt);
      } else {
        this.warpProgress = Math.min(this.warpProgress + dt * 0.44, 1.0);
        this.renderWarpSpeed(dt);
      }
    }

    requestAnimationFrame((t) => this.render(t));
  }

  renderNormalConstellation(dt) {
    const ctx = this.ctx;
    const pts = this.particles;
    const len = pts.length;
    const mx = this.mouse.x;
    const my = this.mouse.y;

    // 1. Update Positions & Draw Particles
    for (let i = 0; i < len; i++) {
      const p = pts[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = this.width + 20;
      else if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      else if (p.y > this.height + 20) p.y = -20;

      // Mouse repulsion
      if (this.mouse.active) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 1) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 1.8;
          p.y += (dy / dist) * force * 1.8;
        }
      }

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    // 2. Draw Interconnecting Filaments
    ctx.lineWidth = 0.65;
    for (let i = 0; i < len; i++) {
      const p1 = pts[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = pts[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.maxConnectDist) {
          const alpha = (1 - dist / this.maxConnectDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "rgba(160, 175, 240, " + alpha + ")";
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      }
    }
  }

  renderShockwaves(dt) {
    const ctx = this.ctx;
    const pts = this.particles;

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      // Shockwave push on particles
      for (let j = 0; j < pts.length; j++) {
        const p = pts[j];
        const dist = Math.hypot(p.x - sw.x, p.y - sw.y);
        const diff = Math.abs(dist - sw.radius);
        if (diff < 32 && dist > 1) {
          const push = ((32 - diff) / 32) * 5 * sw.alpha;
          p.x += ((p.x - sw.x) / dist) * push;
          p.y += ((p.y - sw.y) / dist) * push;
        }
      }

      // Draw shockwave ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 205, 255, ${sw.alpha * 0.75})`;
      ctx.lineWidth = 2.5 * sw.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(160, 190, 255, 0.8)";
      ctx.stroke();

      // Secondary inner ring
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 8), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140, 170, 255, ${sw.alpha * 0.35})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  renderStardust(dt) {
    const ctx = this.ctx;

    for (let i = this.stardust.length - 1; i >= 0; i--) {
      const s = this.stardust[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.stardust.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}${s.life * 0.75})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(180, 200, 255, 0.7)";
      ctx.fill();
      ctx.restore();
    }
  }

  renderSingularityImplosion(dt) {
    const ctx = this.ctx;
    const pts = this.particles;
    const cx = this.width / 2;
    const cy = this.height / 2;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // 1. Draw 16 converging silken anchor threads shooting inward from screen perimeter
    const spokeCount = 16;
    const maxR = Math.max(this.width, this.height) * 0.85;
    for (let s = 0; s < spokeCount; s++) {
      const angle = (s / spokeCount) * Math.PI * 2;
      const ex = cx + Math.cos(angle) * maxR;
      const ey = cy + Math.sin(angle) * maxR;

      // Elastic tension wave along the thread
      const wave = Math.sin(Date.now() * 0.02 + s * 2.2) * 5;
      const perpAngle = angle + Math.PI / 2;
      const midX = (cx + ex) / 2 + Math.cos(perpAngle) * wave;
      const midY = (cy + ey) / 2 + Math.sin(perpAngle) * wave;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(midX, midY, ex, ey);
      ctx.strokeStyle = "rgba(180, 205, 245, 0.45)";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Glistening dewdrops along converging spoke
      for (let d = 1; d <= 4; d++) {
        const t = d / 5;
        const dx = cx + (ex - cx) * t;
        const dy = cy + (ey - cy) * t;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225, 240, 255, 0.9)";
        ctx.fill();
      }
    }

    // 2. Cosmic inward spiral of particles into the core
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const dx = p.x - cx;
      const dy = p.y - cy;
      let r = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx);

      angle += (160 / (r + 30)) * dt * 3.2;
      r = Math.max(4, r - (r * 2.8 + 80) * dt);

      p.x = cx + Math.cos(angle) * r;
      p.y = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseRadius * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 225, 255, 0.9)";
      ctx.fill();
    }

    // 3. Central Nexus Pearl Swelling (matching the main web's central pearl)
    const pearlR = 12 + Math.sin(Date.now() * 0.015) * 3;
    const pearlGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pearlR * 3);
    pearlGrad.addColorStop(0, "#ffffff");
    pearlGrad.addColorStop(0.25, "rgba(215, 235, 255, 0.9)");
    pearlGrad.addColorStop(0.6, "rgba(140, 185, 255, 0.3)");
    pearlGrad.addColorStop(1, "transparent");

    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pearlR * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, pearlR, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 24;
    ctx.shadowColor = "#38bdf8";
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderWarpSpeed(dt) {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Silky, non-strobe relativistic acceleration (velvety smooth forward velocity)
    const speedMultiplier = 1 + Math.pow(this.warpProgress, 1.6) * 7.5;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const baseRadius = Math.max(this.width, this.height) * 0.52;
    const sides = 16; // 16 radial spokes aligning perfectly with the Spider Web Nexus Hub!

    // 1. Draw 16 Longitudinal Silk Highway Spokes radiating from vanishing point
    for (let s = 0; s < sides; s++) {
      const spokeAngle = (s / sides) * Math.PI * 2 + (this.tunnelRings[0] ? this.tunnelRings[0].rotation * 0.2 : 0);
      const ex = cx + Math.cos(spokeAngle) * Math.max(this.width, this.height) * 1.3;
      const ey = cy + Math.sin(spokeAngle) * Math.max(this.width, this.height) * 1.3;

      // Delicate elastic sine wave in silk thread
      const wave = Math.sin(Date.now() * 0.006 + s * 1.6) * 2.8;
      const perp = spokeAngle + Math.PI / 2;
      const midX = (cx + ex) * 0.5 + Math.cos(perp) * wave;
      const midY = (cy + ey) * 0.5 + Math.sin(perp) * wave;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(midX, midY, ex, ey);
      ctx.strokeStyle = `rgba(200, 218, 240, ${0.16 + this.warpProgress * 0.35})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }

    // 2. High-Speed Traveling Silk Energy Pulses racing down the 16 spokes
    if (this.silkPulses) {
      for (let p = 0; p < this.silkPulses.length; p++) {
        const pulse = this.silkPulses[p];
        pulse.progress += pulse.speed * speedMultiplier * dt * 0.42;
        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.spokeIndex = Math.floor(Math.random() * sides);
        }

        const angle = (pulse.spokeIndex / sides) * Math.PI * 2 + (this.tunnelRings[0] ? this.tunnelRings[0].rotation * 0.2 : 0);
        const dist = Math.pow(pulse.progress, 1.35) * Math.max(this.width, this.height) * 1.05;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, pulse.size * (0.6 + pulse.progress * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(235, 248, 255, 0.95)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#93c5fd";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // 3. Draw 3D Nested Spider Webs in Relativistic Perspective
    for (let i = 0; i < this.tunnelRings.length; i++) {
      const ring = this.tunnelRings[i];
      ring.z -= 280 * speedMultiplier * dt;
      ring.rotation += (0.28 + (1000 - ring.z) * 0.00035) * dt;

      if (ring.z <= 20) {
        ring.z = 1000;
      }

      const k = 270 / ring.z;
      const webR = baseRadius * k;
      const distFade = Math.min(Math.max((1 - ring.z / 1000) * 0.88, 0), 0.88);
      const nearFade = ring.z < 120 ? Math.max(0, (ring.z - 20) / 100) : 1;
      const alpha = distFade * nearFade;

      if (webR > 8 && webR < Math.max(this.width, this.height) * 2.8 && alpha > 0.01) {
        const angles = [];
        for (let s = 0; s < sides; s++) {
          angles[s] = (s / sides) * Math.PI * 2 + ring.rotation;
        }

        const ringLevels = 4;
        for (let lvl = 1; lvl <= ringLevels; lvl++) {
          const spiralR = webR * (lvl / (ringLevels + 0.3));

          ctx.beginPath();
          for (let s = 0; s < sides; s++) {
            const a1 = angles[s];
            const a2 = angles[(s + 1) % sides];

            const p1x = cx + Math.cos(a1) * spiralR;
            const p1y = cy + Math.sin(a1) * spiralR;
            const p2x = cx + Math.cos(a2) * spiralR;
            const p2y = cy + Math.sin(a2) * spiralR;

            const midAngle = (a1 + a2) * 0.5;
            const sagR = spiralR * (1 - ring.sagFactor);
            const ctrlX = cx + Math.cos(midAngle) * sagR;
            const ctrlY = cy + Math.sin(midAngle) * sagR;

            if (s === 0) ctx.moveTo(p1x, p1y);
            ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y);
          }
          ctx.closePath();

          ctx.strokeStyle = `rgba(195, 215, 242, ${alpha * (lvl === ringLevels ? 0.65 : 0.36)})`;
          ctx.lineWidth = Math.min(k * 1.5, 2.2);
          ctx.stroke();

          if (lvl >= 2) {
            for (let s = 0; s < sides; s++) {
              const a = angles[s];
              const dx = cx + Math.cos(a) * spiralR;
              const dy = cy + Math.sin(a) * spiralR;

              ctx.beginPath();
              ctx.arc(dx, dy, Math.min(k * 1.9, 3.4), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(240, 248, 255, ${alpha * 0.95})`;
              ctx.fill();
            }
          }
        }
      }
    }

    // 4. Floating 3D Dewdrifts (Glistening moisture motes in relativistic slipstream)
    if (this.dewdrifts) {
      for (let d = 0; d < this.dewdrifts.length; d++) {
        const drop = this.dewdrifts[d];
        const prevZ = drop.z;
        drop.z -= 320 * drop.speed * speedMultiplier * dt;

        if (drop.z <= 10) {
          drop.z = 1000;
          drop.x = (Math.random() - 0.5) * this.width * 1.5;
          drop.y = (Math.random() - 0.5) * this.height * 1.5;
          continue;
        }

        const k = 270 / drop.z;
        const px = cx + drop.x * k;
        const py = cy + drop.y * k;

        const prevK = 270 / Math.min(prevZ, 1000);
        const prevPx = cx + drop.x * prevK;
        const prevPy = cy + drop.y * prevK;

        const dropFade = drop.z < 100 ? (drop.z - 10) / 90 : 1;
        const dropAlpha = Math.min((1 - drop.z / 1000) * 1.1, 1) * drop.alpha * dropFade;

        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(210, 228, 255, ${dropAlpha * 0.65})`;
        ctx.lineWidth = Math.min(k * 2.0, 2.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, (1 - drop.z / 1000) * drop.size * 1.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dropAlpha})`;
        ctx.fill();
      }
    }

    // 5. Center Nexus Pearl (The focal destination of the Spider Web universe)
    const pearlR = 14 + this.warpProgress * 26;
    const pearlGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pearlR * 2.8);
    pearlGrad.addColorStop(0, "#ffffff");
    pearlGrad.addColorStop(0.28, "rgba(220, 238, 255, 0.9)");
    pearlGrad.addColorStop(0.65, "rgba(147, 197, 253, 0.38)");
    pearlGrad.addColorStop(1, "transparent");

    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pearlR * 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, pearlR * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#93c5fd";
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Climax Expanding Silk Shockwaves & Emergence Bloom (Emergence wavefront)
    if (this.warpProgress > 0.82) {
      const waveProgress = (this.warpProgress - 0.82) / 0.18;
      const waveR = waveProgress * Math.max(this.width, this.height) * 1.4;
      const waveAlpha = (1 - waveProgress) * 0.85;

      ctx.beginPath();
      ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(225, 240, 255, ${waveAlpha})`;
      ctx.lineWidth = 3.2 * (1 - waveProgress);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, waveR - 40), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(147, 197, 253, ${waveAlpha * 0.5})`;
      ctx.lineWidth = 2.0 * (1 - waveProgress);
      ctx.stroke();

      const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, waveR * 0.7);
      bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${waveAlpha * 0.3})`);
      bloomGrad.addColorStop(0.5, `rgba(180, 215, 255, ${waveAlpha * 0.12})`);
      bloomGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, waveR * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Auto-instantiate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.landingPortalInstance = new LandingPortal();
});
