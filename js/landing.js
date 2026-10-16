/**
 * Cinematic Landing Page & Quantum Warp Gate Engine
 * Aarav Shah Portfolio — Neural Gateway → Spider Web Universe
 */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.update = this.update.bind(this);
    this.targetText = el ? (el.textContent || '').trim() : '';
  }

  setText(newText) {
    if (!this.el) return Promise.resolve();
    this.targetText = newText;
    const oldText = (this.el.textContent || '').trim();
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 5);
      const end = start + Math.floor(Math.random() * 7) + 4;
      this.queue.push({ from, to, start, end, char: '' });
    }

    cancelAnimationFrame(this.frameRequest);
    clearTimeout(this.safetyTimeout);
    this.frame = 0;
    this.update();

    // Absolute fallback: ensure target text is 100% restored after max 300ms
    this.safetyTimeout = setTimeout(() => {
      cancelAnimationFrame(this.frameRequest);
      if (this.el) this.el.textContent = this.targetText;
      if (this.resolve) this.resolve();
    }, 300);

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
        if (!char || Math.random() < 0.3) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:#00f0ff;">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.el) this.el.textContent = this.targetText;
      clearTimeout(this.safetyTimeout);
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
    this.isDissolving = false;
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

    // Living Spider Web Weave Geometry
    this.weaveSpokes = [];
    this.weaveRings = [];
    this.ringSegments = [];
    this.weaveNodes = [];
    this.silkPulses = [];
    this.initWebWeaveData();

    // Scramble instances
    if (this.firstNameEl) this.firstNameScramble = new TextScramble(this.firstNameEl);
    if (this.lastNameEl) this.lastNameScramble = new TextScramble(this.lastNameEl);

    this.init();
  }

  initWebWeaveData() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = Math.max(this.width, this.height) * 0.72;
    const spokeCount = 16;
    const ringCount = 8;

    this.weaveSpokes = [];
    for (let s = 0; s < spokeCount; s++) {
      const angle = (s / spokeCount) * Math.PI * 2;
      this.weaveSpokes.push({
        angle,
        cos: Math.cos(angle),
        sin: Math.sin(angle),
        length: maxRadius * (0.88 + (s % 4) * 0.04),
        sagFactor: 0.13 + (s % 2) * 0.02
      });
    }

    this.weaveRings = [];
    this.ringSegments = [];
    this.weaveNodes = [];

    for (let r = 0; r < ringCount; r++) {
      const radius = Math.pow((r + 1) / ringCount, 1.25) * (maxRadius * 0.75);
      const sagFactor = 0.14;
      this.weaveRings.push({ radius, sagFactor });

      const segs = [];
      for (let s = 0; s < spokeCount; s++) {
        const nextS = (s + 1) % spokeCount;
        const spk1 = this.weaveSpokes[s];
        const spk2 = this.weaveSpokes[nextS];

        const p1x = cx + spk1.cos * radius;
        const p1y = cy + spk1.sin * radius;
        const p2x = cx + spk2.cos * radius;
        const p2y = cy + spk2.sin * radius;

        const midAngle = (spk1.angle + spk2.angle) * 0.5;
        const sagR = radius * (1 - sagFactor);
        const ctrlX = cx + Math.cos(midAngle) * sagR;
        const ctrlY = cy + Math.sin(midAngle) * sagR;

        segs.push({ p1x, p1y, p2x, p2y, ctrlX, ctrlY });

        this.weaveNodes.push({
          x: p1x,
          y: p1y,
          radius,
          spokeIndex: s,
          ringIndex: r
        });
      }
      this.ringSegments.push(segs);
    }

    // Luminous traveling silk energy pulses (10 pulses for optimal performance)
    this.silkPulses = [];
    for (let p = 0; p < 10; p++) {
      this.silkPulses.push({
        spokeIndex: Math.floor(Math.random() * spokeCount),
        progress: Math.random(),
        speed: 0.9 + Math.random() * 0.7,
        size: 2.2 + Math.random() * 1.2
      });
    }
  }

  init() {
    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.setupMagneticButton();
    this.setupSoundHooks();
    this.startTelemetryClock();
    this.init2DPortfolio();

    // Run Preloader Boot Sequence
    this.runBootSequence();

    // Animation Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.render(t));
  }

  startTelemetryClock() {
    const clockEl = document.getElementById("landing-telemetry-clock");
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      // Indian Standard Time (UTC + 5:30)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const ist = new Date(utc + (3600000 * 5.5));
      const hh = String(ist.getHours()).padStart(2, '0');
      const mm = String(ist.getMinutes()).padStart(2, '0');
      const ss = String(ist.getSeconds()).padStart(2, '0');
      clockEl.textContent = `MUMBAI [19.0760° N, 72.8777° E] // ${hh}:${mm}:${ss} IST`;
    };
    update();
    setInterval(update, 1000);
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
    this.initWebWeaveData();
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

    // Interactive Shockwave on Canvas Click (Isolate to Hero Backdrop only)
    if (this.container) {
      this.container.addEventListener("click", (e) => {
        if (
          e.target.closest("#linear-portfolio-2d") ||
          e.target.closest(".dock-2d-nav") ||
          e.target.closest("button") ||
          e.target.closest("a") ||
          e.target.closest("input") ||
          e.target.closest("textarea") ||
          e.target.closest(".landing-center") ||
          e.target.closest(".warp-telemetry-hud")
        ) return;

        this.triggerShockwave(e.clientX, e.clientY);
      });
    }

    // Enter Universe Warp Click
    if (this.enterBtn) {
      this.enterBtn.addEventListener("click", () => {
        this.triggerWarpEntrance();
      });
    }

    // Direct 60-Sec Executive Dossier button from landing
    const directDossierBtn = document.getElementById("landing-dossier-direct-btn");
    if (directDossierBtn) {
      directDossierBtn.addEventListener("click", () => {
        if (window.soundEngineInstance) window.soundEngineInstance.playNodeClick();
        window.dispatchEvent(new CustomEvent("toggle-executive-dossier"));
      });
      directDossierBtn.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance) window.soundEngineInstance.playNodeHover();
      });
    }

    // Gateway return button from web world
    if (this.gatewayBtn) {
      this.gatewayBtn.addEventListener("click", () => {
        this.reenterGateway();
      });
    }

    // Switch to 2D Button in 3D Web Dock
    const switch2dBtn = document.getElementById("btn-switch-2d");
    if (switch2dBtn) {
      switch2dBtn.addEventListener("click", () => {
        this.reenterGateway(true);
      });
    }

    // Global keyboard hotkeys:
    // [W] or [Enter] -> Trigger Warp to 3D Universe
    // [V] -> Switch back to 2D normal portfolio view
    window.addEventListener("keydown", (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (activeTag === "input" || activeTag === "textarea") return;

      if ((e.key === "Enter" || e.key === "w" || e.key === "W") && this.isActive && !this.isWarping) {
        this.triggerWarpEntrance();
      }

      if ((e.key === "v" || e.key === "V") && !this.isActive) {
        this.reenterGateway(true);
      }
    });
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
    this.isDissolving = false;
    this.warpProgress = 0;
    this.warpStartTime = performance.now();
    this.warpDuration = 2200; // 2.2s total smooth organic weave

    // Ensure executive dock is visible in 3D universe
    document.body.classList.remove("page-scrolled");
    const dock = document.getElementById("executive-dock");
    if (dock) dock.classList.remove("dock--hidden");

    // Change button status
    if (this.enterBtn) {
      this.enterBtn.classList.add("charging");
      const btnText = this.enterBtn.querySelector("span:first-child");
      if (btnText) btnText.textContent = "WEAVING QUANTUM WEB...";
    }

    // Reset centerBlock transform immediately so inline perspective/rotate doesn't glitch or clash
    if (this.centerBlock) {
      this.centerBlock.style.transform = "";
    }

    // Record original particle coordinates so particles smoothly morph without any jump
    if (this.particles) {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].origX = this.particles[i].x;
        this.particles[i].origY = this.particles[i].y;
      }
    }

    // Phase 1: Card Smoothly Dissolves to Reveal the Silk Weave
    if (this.container) {
      this.container.classList.add("warp-charging");
    }

    // Trigger 3D Relativistic Hyperspace Wormhole in Three.js
    if (window.threeUniverseInstance && typeof window.threeUniverseInstance.triggerHyperspaceWarp === "function") {
      window.threeUniverseInstance.triggerHyperspaceWarp();
    }

    // Trigger synthetic organic silk audio soundscape
    if (window.soundEngineInstance && typeof window.soundEngineInstance.playWarpJump === "function") {
      window.soundEngineInstance.playWarpJump();
    } else if (window.soundEngineInstance) {
      window.soundEngineInstance.playNodeClick();
    }

    // Reveal top flight telemetry HUD
    const hud = document.getElementById("warp-telemetry-hud");
    if (hud) hud.classList.add("active");

    // Phase 2: Card into active weave
    setTimeout(() => {
      if (this.container) {
        this.container.classList.remove("warp-charging");
        this.container.classList.add("warp-active");
      }
    }, 450);

    // Phase 3: Initiate Seamless Cross-fade into Spider Web Universe (at 1600ms)
    // The silk web is ~73% woven; now dissolve landing page while camera glides into full resolution
    setTimeout(() => {
      this.isDissolving = true;
      if (this.container) {
        this.container.classList.remove("warp-active");
        this.container.classList.add("warp-dissolving");
      }

      if (window.spiderWebInstance && typeof window.spiderWebInstance.triggerCelestialEntrance === "function") {
        window.spiderWebInstance.triggerCelestialEntrance();
      } else if (window.spiderWebInstance) {
        const web = window.spiderWebInstance;
        web.camera.zoom = 0.55;
        web.camera.y = 0;
        web.camera.x = 0;
        web.camera.targetZoom = 1.0;
        web.camera.targetY = 0;
        web.camera.targetX = 0;
        web.camera.isGliding = true;
        if (typeof web.triggerVibration === "function") {
          web.triggerVibration(0, 0);
          setTimeout(() => web.triggerVibration(0, 0), 240);
        }
      }
    }, 1600);

    // Phase 4: Final Settlement after the 0.65s CSS fade is 100% complete (at 2300ms)
    setTimeout(() => {
      if (hud) hud.classList.remove("active");

      // 1. Wipe the landing particles canvas so no residual graphics remain in GPU memory
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      // 2. Lock container into strictly invisible hidden state (DO NOT remove warp-dissolving)
      if (this.container) {
        this.container.classList.add("hidden");
        this.container.style.opacity = "0";
        this.container.style.visibility = "hidden";
        this.container.style.pointerEvents = "none";
      }

      this.isActive = false;
      this.isWarping = false;
      document.body.classList.add("web-mode-active");

      // Cybernetic hint banner update
      const hint = document.getElementById("web-instruction-hint");
      if (hint) {
        hint.innerHTML = `<div class="hint-pill"><span class="hint-pulse-dot"></span><span>➔ <strong>NEURAL NEXUS SYNCHRONIZED</strong> &bull; DRAG TO PAN &bull; SCROLL TO ZOOM &bull; CLICK NODES TO INSPECT</span></div>`;
        hint.style.opacity = "1";
      }
    }, 2300);
  }

  reenterGateway(scrollTo2D = false) {
    this.isActive = true;
    this.isWarping = false;
    this.isDissolving = false;
    this.warpProgress = 0;
    document.body.classList.remove("web-mode-active");

    const dock = document.getElementById("executive-dock");
    if (scrollTo2D) {
      document.body.classList.add("page-scrolled");
      if (dock) dock.classList.add("dock--hidden");
    } else {
      if (!this.container || this.container.scrollTop <= 50) {
        document.body.classList.remove("page-scrolled");
        if (dock) dock.classList.remove("dock--hidden");
      }
    }

    // Reset Three.js Universe to Landing Quantum Core
    if (window.threeUniverseInstance && typeof window.threeUniverseInstance.setMode === "function") {
      window.threeUniverseInstance.setMode("landing");
    }

    // Reset button
    if (this.enterBtn) {
      this.enterBtn.classList.remove("charging");
      const btnText = this.enterBtn.querySelector("span:first-child");
      if (btnText) btnText.textContent = "INITIALIZE 3D UNIVERSE";
    }

    if (this.centerBlock) {
      this.centerBlock.style.transform = "";
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
      // Clear inline safety styles
      this.container.style.opacity = "";
      this.container.style.visibility = "";
      this.container.style.pointerEvents = "";

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

      if (scrollTo2D) {
        setTimeout(() => {
          const sec2d = document.getElementById("sec-2d-about");
          if (sec2d) {
            sec2d.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
      }
    }

    // Re-create particles and reset web weave data
    this.createParticles();
    this.initWebWeaveData();
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
      } else {
        const elapsed = (timestamp - this.warpStartTime) / 1000;
        this.warpProgress = Math.min(Math.max(elapsed / (this.warpDuration / 1000), 0), 1.0);
        this.renderWebWeave(dt);
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

  renderWebWeave(dt) {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = Math.max(this.width, this.height) * 0.72;
    const progress = this.warpProgress;
    const now = performance.now();

    ctx.save();

    // 0. Smooth Fade-Out of Original Constellation Filaments (no sudden pop on frame 1)
    if (progress < 0.35 && this.particles) {
      const filamentFade = 1 - progress / 0.35;
      const pts = this.particles;
      const pLen = pts.length;
      ctx.lineWidth = 0.65;
      for (let i = 0; i < pLen; i++) {
        const p1 = pts[i];
        for (let j = i + 1; j < pLen; j++) {
          const p2 = pts[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < this.maxConnectDist) {
            const alpha = (1 - dist / this.maxConnectDist) * 0.22 * filamentFade;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(160, 175, 240, " + alpha + ")";
            ctx.stroke();
          }
        }
      }
    }

    // 1. Central Luminous Nexus Pearl (Heart of the Spider Web)
    const pearlGrowth = Math.min(progress / 0.45, 1);
    const pearlR = 9 + pearlGrowth * 18 + Math.sin(now * 0.008) * 2;
    const pearlGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pearlR * 3.2);
    pearlGrad.addColorStop(0, "#ffffff");
    pearlGrad.addColorStop(0.28, "rgba(225, 240, 255, 0.92)");
    pearlGrad.addColorStop(0.65, "rgba(147, 197, 253, 0.35)");
    pearlGrad.addColorStop(1, "transparent");

    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pearlR * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, pearlR * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // 2. The 16 Silk Radial Spokes (Single Batched Stroke + Single Batched Beads Fill)
    const spokeCount = this.weaveSpokes ? this.weaveSpokes.length : 16;
    const spokePhase = Math.min(Math.max(progress / 0.65, 0), 1);

    if (this.weaveSpokes && spokePhase > 0) {
      ctx.beginPath();
      for (let s = 0; s < spokeCount; s++) {
        const spoke = this.weaveSpokes[s];
        const stagger = (s / spokeCount) * 0.12;
        const sProg = Math.min(Math.max((spokePhase - stagger) / (1 - stagger), 0), 1);
        if (sProg <= 0) continue;

        const eased = 1 - Math.pow(1 - sProg, 3);
        const curLen = spoke.length * eased;

        const ex = cx + spoke.cos * curLen;
        const ey = cy + spoke.sin * curLen;

        const wave = Math.sin(now * 0.006 + s * 1.8) * 2.8 * (1 - progress * 0.5);
        const midX = (cx + ex) * 0.5 - spoke.sin * wave;
        const midY = (cy + ey) * 0.5 + spoke.cos * wave;

        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(midX, midY, ex, ey);
      }
      ctx.strokeStyle = `rgba(205, 222, 245, ${Math.min(spokePhase * 1.2, 0.82)})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Advancing spoke tip beads (single batched fill)
      ctx.beginPath();
      for (let s = 0; s < spokeCount; s++) {
        const spoke = this.weaveSpokes[s];
        const stagger = (s / spokeCount) * 0.12;
        const sProg = Math.min(Math.max((spokePhase - stagger) / (1 - stagger), 0), 1);
        if (sProg <= 0) continue;
        const eased = 1 - Math.pow(1 - sProg, 3);
        const curLen = spoke.length * eased;
        const ex = cx + spoke.cos * curLen;
        const ey = cy + spoke.sin * curLen;
        ctx.moveTo(ex + 2.4, ey);
        ctx.arc(ex, ey, 2.4, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(240, 248, 255, 0.95)";
      ctx.fill();
    }

    // 3. The 8 Concentric Capture Spirals (Precalculated Segments + Batched Dewdrops)
    if (this.ringSegments && progress > 0.18) {
      const ringPhase = Math.min(Math.max((progress - 0.18) / 0.64, 0), 1);

      for (let r = 0; r < this.ringSegments.length; r++) {
        const ringStagger = (r / this.ringSegments.length) * 0.42;
        const rProg = Math.min(Math.max((ringPhase - ringStagger) / (1 - ringStagger), 0), 1);
        if (rProg <= 0) continue;

        const segs = this.ringSegments[r];
        ctx.beginPath();
        for (let s = 0; s < segs.length; s++) {
          const seg = segs[s];
          if (s === 0) ctx.moveTo(seg.p1x, seg.p1y);
          ctx.quadraticCurveTo(seg.ctrlX, seg.ctrlY, seg.p2x, seg.p2y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(188, 210, 240, ${Math.min(rProg * 1.4, 1) * 0.62})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Glistening beaded dewdrops on each spoke intersection (Single Batched Fill per Ring)
        if (rProg > 0.35) {
          const dewAlpha = Math.min((rProg - 0.35) / 0.65, 1);
          const dewR = 2.2 * dewAlpha;
          ctx.beginPath();
          for (let s = 0; s < segs.length; s++) {
            const seg = segs[s];
            ctx.moveTo(seg.p1x + dewR, seg.p1y);
            ctx.arc(seg.p1x, seg.p1y, dewR, 0, Math.PI * 2);
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${dewAlpha * 0.92})`;
          ctx.fill();
        }
      }
    }

    // 4. Smooth Continuous Morphing of Constellation Stars into Web Dewdrops (Zero Pop / Zero Disappearance)
    if (this.particles && this.weaveNodes) {
      const flockPhase = Math.min(Math.max(progress / 0.82, 0), 1);
      // Smooth cubic ease for organic flocking
      const flockEase = flockPhase < 0.5
        ? 4 * flockPhase * flockPhase * flockPhase
        : 1 - Math.pow(-2 * flockPhase + 2, 3) / 2;

      ctx.beginPath();
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const targetNode = this.weaveNodes[i % this.weaveNodes.length];
        const startX = p.origX !== undefined ? p.origX : p.x;
        const startY = p.origY !== undefined ? p.origY : p.y;

        if (targetNode) {
          p.x = startX + (targetNode.x - startX) * flockEase;
          p.y = startY + (targetNode.y - startY) * flockEase;
        }

        const pr = p.baseRadius * (1 + flockEase * 0.5);
        ctx.moveTo(p.x + pr, p.y);
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(225, 240, 255, ${0.75 + flockPhase * 0.2})`;
      ctx.fill();
    }

    // 5. Bio-Electric Traveling Silk Energy Pulses (Batched Halo + Core, Zero shadowBlur)
    if (this.silkPulses && progress > 0.2) {
      ctx.beginPath();
      for (let p = 0; p < this.silkPulses.length; p++) {
        const pulse = this.silkPulses[p];
        pulse.progress += pulse.speed * dt * 0.85;
        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.spokeIndex = Math.floor(Math.random() * spokeCount);
        }

        const spoke = this.weaveSpokes[pulse.spokeIndex];
        if (!spoke) continue;
        const dist = Math.pow(pulse.progress, 1.25) * (maxRadius * 0.72);
        const px = cx + spoke.cos * dist;
        const py = cy + spoke.sin * dist;
        pulse.px = px;
        pulse.py = py;

        const haloR = pulse.size * 2.2;
        ctx.moveTo(px + haloR, py);
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(147, 197, 253, 0.35)";
      ctx.fill();

      ctx.beginPath();
      for (let p = 0; p < this.silkPulses.length; p++) {
        const pulse = this.silkPulses[p];
        if (pulse.px === undefined) continue;
        ctx.moveTo(pulse.px + pulse.size, pulse.py);
        ctx.arc(pulse.px, pulse.py, pulse.size, 0, Math.PI * 2);
      }
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // 6. Resonant Harmonic Silver Shockwaves (Single Batched Stroke)
    if (progress > 0.76) {
      const wavePhase = (progress - 0.76) / 0.24;
      ctx.beginPath();
      for (let w = 0; w < 3; w++) {
        const wOffset = w * 0.25;
        const wProg = Math.max(0, Math.min(1, (wavePhase - wOffset) / (1 - wOffset)));
        if (wProg <= 0) continue;
        const waveR = wProg * maxRadius * 1.35;
        ctx.moveTo(cx + waveR, cy);
        ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
      }
      ctx.strokeStyle = `rgba(220, 238, 255, ${(1 - wavePhase) * 0.75})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }

    ctx.restore();

    // 7. Update HUD Telemetry smoothly in sync with requestAnimationFrame
    this.updateWarpHUD(progress);
  }

  updateWarpHUD(p) {
    if (!this.hudStatusText || !this.hudVelText || !this.hudVelFill) {
      this.hudStatusText = document.getElementById("warp-status-text");
      this.hudVelText = document.getElementById("warp-velocity-text");
      this.hudVelFill = document.getElementById("warp-velocity-fill");
    }

    if (this.hudVelFill) {
      this.hudVelFill.style.width = `${Math.round(p * 100)}%`;
    }

    if (this.hudVelText) {
      const tension = (1.0 + p * 8.9).toFixed(1);
      if (this.lastTension !== tension) {
        this.lastTension = tension;
        this.hudVelText.textContent = `${tension}x`;
      }
    }

    if (this.hudStatusText) {
      let statusStr = "";
      if (p < 0.28) {
        statusStr = "WEAVING RADIAL ANCHORS // 16 SPOKES";
      } else if (p < 0.65) {
        statusStr = "SPINNING CAPTURE SPIRALS // ELASTIC TENSION";
      } else if (p < 0.88) {
        statusStr = "CRYSTALLIZING NEURAL DEWDROPS // LOCKING COORD";
      } else {
        statusStr = "NEXUS SYNCHRONIZED // ENTERING WEB UNIVERSE";
      }

      if (this.lastStatusStr !== statusStr) {
        this.lastStatusStr = statusStr;
        this.hudStatusText.textContent = statusStr;
      }
    }
  }

  init2DPortfolio() {
    // 1. Explore 2D Button & Scroll Down Prompt in Hero
    const exploreBtn = document.getElementById("landing-explore-2d-btn");
    const scrollPrompt = document.getElementById("landing-scroll-prompt");
    const secAbout = document.getElementById("sec-2d-about");
    const executiveDock = document.getElementById("executive-dock");

    const updateDockVisibility = () => {
      if (!document.body.classList.contains("web-mode-active")) {
        if (executiveDock) executiveDock.classList.add("dock--hidden");
        const scrollY = Math.max(this.container ? this.container.scrollTop : 0, window.scrollY || 0);
        if (scrollY > 50) {
          document.body.classList.add("page-scrolled");
        } else {
          document.body.classList.remove("page-scrolled");
        }
        return;
      }
      document.body.classList.remove("page-scrolled");
      if (executiveDock) executiveDock.classList.remove("dock--hidden");
    };

    const scrollTo2D = () => {
      document.body.classList.add("page-scrolled");
      if (executiveDock) executiveDock.classList.add("dock--hidden");
      if (secAbout) {
        secAbout.scrollIntoView({ behavior: "smooth" });
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playNodeHover === "function") {
          window.soundEngineInstance.playNodeHover();
        }
      }
    };

    if (exploreBtn) exploreBtn.addEventListener("click", scrollTo2D);
    if (scrollPrompt) scrollPrompt.addEventListener("click", scrollTo2D);

    // 2. 2D Sticky Top Navigation Bar
    const brandBtn = document.getElementById("dock-2d-brand-btn");
    if (brandBtn) {
      brandBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const hero = document.getElementById("landing-hero");
        if (hero) hero.scrollIntoView({ behavior: "smooth" });
      });
    }

    const navLinks = document.querySelectorAll(".dock-2d-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.replace("#", "");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          if (window.soundEngineInstance && typeof window.soundEngineInstance.playNodeHover === "function") {
            window.soundEngineInstance.playNodeHover();
          }
        }
      });
    });

    // ScrollSpy & Executive Dock Toggle on scroll
    if (this.container) {
      this.container.addEventListener("scroll", () => {
        updateDockVisibility();

        const sections = document.querySelectorAll(".sec-2d");
        const scrollPos = this.container.scrollTop + 220;
        sections.forEach(sec => {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          const id = sec.getAttribute("id");
          if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      }, { passive: true });

      window.addEventListener("scroll", updateDockVisibility, { passive: true });

      // Initial check on load
      updateDockVisibility();
    }

    // Dossier button in 2D Dock
    const dockDossierBtn = document.getElementById("dock-2d-dossier-btn");
    if (dockDossierBtn) {
      dockDossierBtn.addEventListener("click", () => {
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playNodeClick === "function") {
          window.soundEngineInstance.playNodeClick();
        }
        window.dispatchEvent(new CustomEvent("toggle-executive-dossier"));
      });
    }

    // Launch 3D Universe buttons in 2D Dock, 2D Footer, and 2D Archive Banner
    const dockWarpBtn = document.getElementById("dock-2d-warp-btn");
    const footerWarpBtn = document.getElementById("footer-2d-warp-btn");
    const bannerWarpBtn = document.getElementById("banner-warp-btn");
    if (dockWarpBtn) dockWarpBtn.addEventListener("click", () => this.triggerWarpEntrance());
    if (footerWarpBtn) footerWarpBtn.addEventListener("click", () => this.triggerWarpEntrance());
    if (bannerWarpBtn) bannerWarpBtn.addEventListener("click", () => this.triggerWarpEntrance());

    // 3. Skills Matrix Category Filter
    const skillTabBtns = document.querySelectorAll(".skills-2d-tab-btn");
    const skillCards = document.querySelectorAll(".skill-2d-card");
    skillTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        skillTabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-skill-cat");
        skillCards.forEach(card => {
          if (cat === "all" || card.getAttribute("data-cat") === cat) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playNodeHover === "function") {
          window.soundEngineInstance.playNodeHover();
        }
      });
    });

    // 4. Projects Filter Pills
    const projPills = document.querySelectorAll(".projects-2d-pill");
    const projCards = document.querySelectorAll(".project-2d-card");
    projPills.forEach(pill => {
      pill.addEventListener("click", () => {
        projPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const domain = pill.getAttribute("data-pfilter");
        projCards.forEach(card => {
          if (domain === "all" || card.getAttribute("data-domain") === domain) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playNodeHover === "function") {
          window.soundEngineInstance.playNodeHover();
        }
      });
    });

    // 5. Inspect in 3D Button Handlers
    const jump3dBtns = document.querySelectorAll(".p2d-jump-3d");
    jump3dBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetNode = btn.getAttribute("data-target");
        this.triggerWarpEntrance();
        setTimeout(() => {
          if (window.spiderWebInstance && targetNode) {
            window.spiderWebInstance.selectJunction(targetNode);
          }
          const openCardEvt = new CustomEvent("open-node-card", { detail: { targetId: targetNode } });
          window.dispatchEvent(openCardEvt);
        }, 1800);
      });
    });

    // 6. Interactive Model Inference Sandboxes
    // R5: SIH ChangeFormer Slider
    const cfSlider = document.getElementById("p2d-cf-slider");
    const cfVal = document.getElementById("p2d-cf-val");
    const cfF1 = document.getElementById("p2d-cf-f1");
    const cfBadge = document.getElementById("p2d-cf-badge");
    if (cfSlider && cfVal && cfF1 && cfBadge) {
      cfSlider.addEventListener("input", () => {
        const val = parseFloat(cfSlider.value);
        cfVal.textContent = val.toFixed(2);
        const diff = Math.abs(val - 0.55);
        const f1 = Math.max(0.72, 0.978 - diff * 0.45).toFixed(3);
        cfF1.textContent = `${f1} ${val === 0.55 ? '(Peak SIH)' : ''}`;
        cfBadge.textContent = val === 0.55 ? 'OPTIMAL: 0.55' : (val < 0.55 ? 'HIGH RECALL' : 'HIGH PRECISION');
        cfBadge.style.color = val === 0.55 ? '#10b981' : '#38bdf8';
      });
    }

    // R6: Federated Learning Slider
    const flSlider = document.getElementById("p2d-fl-slider");
    const flVal = document.getElementById("p2d-fl-val");
    const flAcc = document.getElementById("p2d-fl-acc");
    const flStatus = document.getElementById("p2d-fl-status");
    if (flSlider && flVal && flAcc && flStatus) {
      flSlider.addEventListener("input", () => {
        const rounds = parseInt(flSlider.value, 10);
        flVal.textContent = rounds;
        flStatus.textContent = `ROUNDS: ${rounds}`;
        const acc = Math.min(99.1, (68.0 + 30.4 * (1 - Math.exp(-rounds / 7)))).toFixed(1);
        flAcc.textContent = `${acc}% ${rounds >= 25 ? '(Converged)' : '(Training)'}`;
      });
    }

    // R12: Stochastic Valuation Slider
    const mcSlider = document.getElementById("p2d-mc-slider");
    const mcVal = document.getElementById("p2d-mc-val");
    const mcProb = document.getElementById("p2d-mc-prob");
    const mcBadge = document.getElementById("p2d-mc-badge");
    if (mcSlider && mcVal && mcProb && mcBadge) {
      mcSlider.addEventListener("input", () => {
        const paths = parseInt(mcSlider.value, 10);
        mcVal.textContent = paths >= 1000 ? `${(paths / 1000).toFixed(0)}k` : paths;
        mcBadge.textContent = `PATHS: ${(paths / 1000).toFixed(0)}k`;
        const p = (18.4 + Math.sin(paths * 0.001) * 0.3).toFixed(1);
        const valM = (14.2 + Math.cos(paths * 0.001) * 0.2).toFixed(1);
        mcProb.textContent = `${p}% • Valuation: $${valM}M`;
      });
    }

    // R1: IPL Auction Slider
    const iplSlider = document.getElementById("p2d-ipl-slider");
    const iplVal = document.getElementById("p2d-ipl-val");
    const iplBid = document.getElementById("p2d-ipl-bid");
    const iplBadge = document.getElementById("p2d-ipl-badge");
    if (iplSlider && iplVal && iplBid && iplBadge) {
      iplSlider.addEventListener("input", () => {
        const sr = parseInt(iplSlider.value, 10);
        iplVal.textContent = sr;
        iplBadge.textContent = `STRIKE RATE: ${sr}`;
        const price = Math.max(0.5, 0.5 + Math.pow((sr - 100) / 25, 2.3) * 0.85).toFixed(2);
        const tier = sr >= 160 ? 'Tier 1 Finisher' : (sr >= 140 ? 'Tier 1 Match-Winner' : (sr >= 125 ? 'Anchor Bat' : 'Base Squad'));
        iplBid.textContent = `₹ ${price} Cr (${tier})`;
      });
    }

    // 7. Interactive Developer Console (2D Terminal)
    const termForm = document.getElementById("term-2d-form");
    const termInput = document.getElementById("term-2d-input");
    const termOutput = document.getElementById("term-2d-output");

    if (termForm && termInput && termOutput) {
      termForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rawCmd = termInput.value.trim();
        if (!rawCmd) return;
        termInput.value = "";

        // Print entered command line
        const cmdRow = document.createElement("div");
        cmdRow.style.color = "#00f0ff";
        cmdRow.style.fontWeight = "700";
        cmdRow.style.marginTop = "6px";
        cmdRow.textContent = `aarav@nexus:~$ ${rawCmd}`;
        termOutput.appendChild(cmdRow);

        const cmd = rawCmd.toLowerCase();
        let resHtml = "";

        if (cmd === "help") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px;line-height:1.6">
              <div>AVAILABLE NEXUS COMMANDS:</div>
              <div><span style="color:#00f0ff">whoami</span>      - Executive profile bio & credentials</div>
              <div><span style="color:#00f0ff">projects</span>    - List all 13 deployed production & research repos</div>
              <div><span style="color:#00f0ff">skills</span>      - Technical competency cluster</div>
              <div><span style="color:#00f0ff">hobbies</span>     - Strategy, acoustics, chess, reading & astrophysics</div>
              <div><span style="color:#00f0ff">thought</span>     - Technical LinkedIn essays on Federated AI & CV</div>
              <div><span style="color:#00f0ff">stats</span>       - Key performance & verification impact metrics</div>
              <div><span style="color:#00f0ff">contact</span>     - Direct transmission channels & coordinates</div>
              <div><span style="color:#00f0ff">3d</span>          - Launch organic 3D Spider Web universe</div>
              <div><span style="color:#00f0ff">clear</span>       - Clear terminal window</div>
            </div>`;
        } else if (cmd === "whoami" || cmd === "about" || cmd === "bio") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px;line-height:1.5">
              <div>OPERATOR: Aarav Shah (A101shah)</div>
              <div>TITLE: Data Scientist & Full-Stack Architect | NMIMS MPSTME, Mumbai</div>
              <div>SPECIALIZATION: Computer Vision Transformers, Federated Learning, Stochastic Modeling, WebGL DSP</div>
              <div>NARRATIVE: Pursuing Data Science & Software Engineering with a focus on first-principles mathematics, reproducible neural network training, and high-performance interactive interfaces.</div>
              <div>STATUS: Open for Production Machine Learning & Full-Stack Roles</div>
            </div>`;
        } else if (cmd === "projects") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>[R1] IPL Auction Predictive Analytics (Python, ML, R² = 0.84)</div>
              <div>[R2] 2-Sample T-Test Inferential Suite (SciPy, Statsmodels, &lt;35ms)</div>
              <div>[R3] Job Track AI Platform (React, TypeScript, Node.js, AI APIs)</div>
              <div>[R4] ISP Bandwidth & Latency Monitor (Socket Telemetry, Dash)</div>
              <div>[R5] SIH ChangeFormer Earth Observation (PyTorch, ViT, 97.8% Accuracy)</div>
              <div>[R6] Federated Learning Flower Suite (FedAvg, 25 Edge Rounds)</div>
              <div>[R7] NMIMS Academics Intelligence Suite (Knowledge Vault)</div>
              <div>[R8] Karpathy 3-Layer Prompt Architect (Spec, Verifier, 94% First-Shot)</div>
              <div>[R9] College ERP Management Portal (React, PostgreSQL)</div>
              <div>[R10] Blitzit Focus & Deep Work Suite (Next.js 16, Electron, SQLite)</div>
              <div>[R11] Spider Universe Portfolio (Three.js, WebGL, Web Audio DSP)</div>
              <div>[R12] Galton-Watson Stochastic Startup Valuation (10k Monte Carlo Paths)</div>
              <div>[R13] Personal Academic Research Vault (Proofs, Preprints & Notes)</div>
            </div>`;
        } else if (cmd === "skills") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>AI & ML:     PyTorch, Vision Transformers (ChangeFormer), Flower (flwr), Scikit-Learn</div>
              <div>LANGUAGES:   Python 3.11+, TypeScript, JavaScript ES2024, SQL, C/C++</div>
              <div>FULL-STACK:  React 19, Next.js 16, Electron, Node.js, Prisma ORM, PostgreSQL, SQLite</div>
              <div>QUANT MATH:  Galton-Watson Branching, Merton Diffusion, Monte Carlo, Hypothesis Testing</div>
              <div>CLOUD/TOOLS: AWS Cloud, Docker Containers, Three.js / WebGL, Web Audio DSP, Git</div>
            </div>`;
        } else if (cmd === "hobbies") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>♟️ Chess: 1500+ Elo on chess platforms (Minimax analysis, positional tension)</div>
              <div>🎧 Modular Synths: Procedural sound synthesis & Web Audio DSP filters</div>
              <div>📚 arXiv: Dissecting transformer backbones and privacy federated learning papers</div>
              <div>🏋️‍♂️ Calisthenics: Progressive overload as an iterative model training metaphor</div>
              <div>☕ Coffee: Aeropress ritual & uninterrupted 5:30 AM deep work blocks</div>
              <div>🌌 Astrophysics: N-body gravitational mechanics and orbital simulations</div>
            </div>`;
        } else if (cmd === "thought") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>[01] Demystifying Federated Learning: Training Neural Nets Without Exposing Private Data</div>
              <div>[02] From Karpathy's 3-Layer Philosophy to Production Prompt Engineering</div>
              <div>[03] Smart India Hackathon: Deploying ChangeFormer for Satellite Earth Observation</div>
              <div>[04] Why Pure Machine Learning Fails Without Sound Inferential Statistics</div>
            </div>`;
        } else if (cmd === "stats") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>13+ Production Repositories &bull; 97.8% SIH Transformer Accuracy</div>
              <div>25 FedAvg Privacy Edge Rounds &bull; 10,000+ Monte Carlo Paths</div>
              <div>Sub-35ms Hypothesis Testing &bull; 60 FPS WebGL Engine</div>
            </div>`;
        } else if (cmd === "contact") {
          resHtml = `
            <div style="color:#cbd5e1;padding-left:8px">
              <div>EMAIL:    shahaarav602@gmail.com</div>
              <div>LINKEDIN: linkedin.com/in/aarav-shah-681641275/</div>
              <div>GITHUB:   github.com/A101shah</div>
              <div>STATION:  Mumbai [19.0760° N, 72.8777° E] &bull; IST</div>
            </div>`;
        } else if (cmd === "3d" || cmd === "warp") {
          resHtml = `<div style="color:#38bdf8;padding-left:8px">INITIALIZING 3D SPIDER WEB UNIVERSE...</div>`;
          setTimeout(() => this.triggerWarpEntrance(), 500);
        } else if (cmd === "clear") {
          termOutput.innerHTML = `
            <p style="color:#94a3b8">// QUANTUM NEXUS CLI &bull; SCREEN CLEARED</p>
            <p style="color:#38bdf8">Type <span style="color:#00f0ff;font-weight:700">help</span> for commands.</p>`;
          return;
        } else {
          resHtml = `<div style="color:#ef4444;padding-left:8px">Command not recognized: '${rawCmd}'. Type <span style="color:#00f0ff">help</span> for available commands.</div>`;
        }

        const resEl = document.createElement("div");
        resEl.innerHTML = resHtml;
        termOutput.appendChild(resEl);
        termOutput.scrollTop = termOutput.scrollHeight;

        if (window.soundEngineInstance && typeof window.soundEngineInstance.playTerminalKey === "function") {
          window.soundEngineInstance.playTerminalKey();
        }
      });
    }

    // 8. Contact Form Submission
    const contactForm = document.getElementById("contact-2d-form");
    const contactFeedback = document.getElementById("c2d-feedback");
    if (contactForm && contactFeedback) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("c2d-name")?.value || "Colleague";
        contactFeedback.style.color = "#38bdf8";
        contactFeedback.textContent = "TRANSMITTING ENCRYPTED QUANTUM SIGNAL...";
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playWarpJump === "function") {
          window.soundEngineInstance.playWarpJump();
        }

        setTimeout(() => {
          contactFeedback.style.color = "#10b981";
          contactFeedback.textContent = `✓ Signal successfully transmitted. Thank you, ${name}. Aarav will establish contact shortly.`;
          contactForm.reset();
        }, 800);
      });
    }
  }
}

// Auto-instantiate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.landingPortalInstance = new LandingPortal();
});
