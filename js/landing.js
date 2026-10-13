/**
 * Cinematic Landing Page & Warp Gate Engine
 * Aarav Shah Portfolio — Neural Gateway → Spider Web Universe
 */

class LandingPortal {
  constructor() {
    this.container = document.getElementById("landing-page");
    this.canvas = document.getElementById("landing-particles");
    this.enterBtn = document.getElementById("landing-enter-btn");
    this.warpFlash = document.getElementById("warp-flash");
    this.centerBlock = document.querySelector(".landing-center");
    this.titleElement = document.querySelector(".landing-title");
    this.gatewayBtn = document.getElementById("gateway-portal-btn");

    if (!this.container || !this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // State
    this.isWarping = false;
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

    // Particles
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 70 : 130;
    this.maxConnectDist = 115;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.setupMagneticButton();
    this.setupSoundHooks();

    // Trigger entrance CSS animations
    if (this.centerBlock) {
      setTimeout(() => {
        this.centerBlock.classList.add("animate");
      }, 100);
    }

    // Animation Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.render(t));
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
        // Warp coordinates (relative to center)
        wx: (Math.random() - 0.5) * this.width * 1.2,
        wy: (Math.random() - 0.5) * this.height * 1.2,
        wz: Math.random() * 1000 + 10,
        wSpeed: Math.random() * 1.2 + 0.8
      });
    }
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resize(), { passive: true });

    // Mouse tracking for parallax tilt and particle reaction
    window.addEventListener("mousemove", (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;

      // Parallax Tilt (-15 to 15 deg max)
      const normX = (e.clientX / this.width - 0.5) * 2;
      const normY = (e.clientY / this.height - 0.5) * 2;
      this.tilt.targetY = normX * 8; // rotateY
      this.tilt.targetX = -normY * 8; // rotateX
    }, { passive: true });

    // Touch support for mobile tilt
    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
        this.mouse.active = true;
      }
    }, { passive: true });

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
    // Hover sounds for buttons and tags
    if (this.enterBtn) {
      this.enterBtn.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance) {
          window.soundEngineInstance.playNodeHover();
        }
      });
    }

    // Title Glitch trigger on hover
    if (this.titleElement) {
      this.titleElement.addEventListener("mouseenter", () => {
        if (window.soundEngineInstance && typeof window.soundEngineInstance.playGlitchChirp === "function") {
          window.soundEngineInstance.playGlitchChirp();
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

    // 1. Play synthesize warp audio
    if (window.soundEngineInstance && typeof window.soundEngineInstance.playWarpJump === "function") {
      window.soundEngineInstance.playWarpJump();
    } else if (window.soundEngineInstance) {
      window.soundEngineInstance.playNodeClick();
    }

    // 2. Quantum Screen Flash
    if (this.warpFlash) {
      this.warpFlash.classList.add("active");
      setTimeout(() => {
        this.warpFlash.classList.remove("active");
      }, 180);
    }

    // 3. Scale and fade out the landing overlay
    if (this.container) {
      this.container.classList.add("warping");
    }

    // 4. Animate warp particles intensely for 750ms, then transition to Spider Web
    setTimeout(() => {
      if (this.container) {
        this.container.classList.add("hidden");
        this.isActive = false;
      }

      // 5. Connect into Spider Web Universe Camera
      if (window.spiderWebInstance) {
        const web = window.spiderWebInstance;
        // Start from high-altitude cosmic view and glide down to center Nexus
        web.camera.zoom = 0.58;
        web.camera.targetZoom = 1.0;
        web.camera.x = 0;
        web.camera.y = -60;
        web.camera.targetX = 0;
        web.camera.targetY = 0;
        web.camera.isGliding = true;

        // Visual ripple in spider web
        if (web.junctions && web.junctions[0]) {
          web.junctions[0].glowT = 1.0;
        }
      }

      // 6. Highlight hint banner
      const hint = document.getElementById("web-instruction-hint");
      if (hint) {
        hint.style.opacity = "1";
      }
    }, 850);
  }

  reenterGateway() {
    this.isActive = true;
    this.isWarping = false;
    this.warpProgress = 0;

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
      // Short delay for opacity transition to trigger
      requestAnimationFrame(() => {
        this.container.classList.remove("warping");
      });
    }

    // Re-create particles for fresh field
    this.createParticles();
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
        this.renderNormalConstellation();
      } else {
        this.warpProgress = Math.min(this.warpProgress + dt * 1.5, 1.0);
        this.renderWarpSpeed(dt);
      }
    }

    requestAnimationFrame((t) => this.render(t));
  }

  renderNormalConstellation() {
    const ctx = this.ctx;
    const pts = this.particles;
    const len = pts.length;
    const mx = this.mouse.x;
    const my = this.mouse.y;

    // 1. Update Positions & Draw Particles
    for (let i = 0; i < len; i++) {
      const p = pts[i];

      // Natural Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap-around boundaries
      if (p.x < -20) p.x = this.width + 20;
      else if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      else if (p.y > this.height + 20) p.y = -20;

      // Mouse repulsion / gentle swirl
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

  renderWarpSpeed(dt) {
    const ctx = this.ctx;
    const pts = this.particles;
    const len = pts.length;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Acceleration curve
    const speedMultiplier = 1 + Math.pow(this.warpProgress, 2.5) * 45;

    ctx.save();
    ctx.lineWidth = 1.4;

    for (let i = 0; i < len; i++) {
      const p = pts[i];

      // Move particle along its 3D ray towards viewer (decreasing wz)
      const prevZ = p.wz;
      p.wz -= 280 * p.wSpeed * speedMultiplier * dt;

      // If particle passed the camera, recycle deep back
      if (p.wz <= 1) {
        p.wz = 1000;
        p.wx = (Math.random() - 0.5) * this.width * 1.5;
        p.wy = (Math.random() - 0.5) * this.height * 1.5;
        continue;
      }

      // Project 3D to 2D
      const k = 280 / p.wz;
      const px = cx + p.wx * k;
      const py = cy + p.wy * k;

      const prevK = 280 / Math.min(prevZ, 1000);
      const prevPx = cx + p.wx * prevK;
      const prevPy = cy + p.wy * prevK;

      // Stretch into luminous hyperspace streak
      const alpha = Math.min((1 - p.wz / 1000) * 1.2, 1);

      ctx.beginPath();
      ctx.moveTo(prevPx, prevPy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = `rgba(180, 200, 255, ${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(160, 185, 255, 0.8)";
      ctx.stroke();

      // Head bright spot
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, (1 - p.wz / 1000) * 3), 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    ctx.restore();
  }
}

// Auto-instantiate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.landingPortalInstance = new LandingPortal();
});
