/**
 * Network Canvas - Interactive Neural Web & Constellation Simulator
 * Creates a living, dynamic background web with interactive physics,
 * traveling synapse data pulses, mouse reactivity, and section-linked node clustering.
 */

class NetworkCanvas {
  constructor(canvasId = "network-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.particles = [];
    this.pulses = [];
    this.sectionClusters = [];
    this.activeSectionIndex = 0;
    this.mouse = { x: -1000, y: -1000, radius: 180, isHovering: false };
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.config = {
      particleCount: 75,
      maxDistance: 160,
      baseColor: "rgba(160, 175, 200, ",
      accentColor: "rgba(0, 240, 255, ",
      violetColor: "rgba(168, 85, 247, ",
      speed: 0.65,
      pulseFrequency: 0.04
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
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

    // Adjust particle count dynamically based on screen width
    if (this.width < 768) {
      this.config.particleCount = 38;
      this.config.maxDistance = 110;
    } else if (this.width < 1200) {
      this.config.particleCount = 55;
      this.config.maxDistance = 135;
    } else {
      this.config.particleCount = 75;
      this.config.maxDistance = 165;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        radius: Math.random() * 2.2 + 1.2,
        baseRadius: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.5 + 0.25,
        isMajorNode: Math.random() < 0.15,
        pulsePhase: Math.random() * Math.PI * 2,
        colorType: Math.random() < 0.25 ? "accent" : (Math.random() < 0.15 ? "violet" : "base")
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      if (this.particles.length === 0) this.createParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovering = true;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovering = false;
    });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.isHovering = true;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovering = false;
    });
  }

  setActiveSection(index) {
    this.activeSectionIndex = index;
    // Add visual impulse packet burst
    this.triggerEnergySurge();
  }

  triggerEnergySurge() {
    for (let i = 0; i < 5; i++) {
      const p1 = this.particles[Math.floor(Math.random() * this.particles.length)];
      const p2 = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (p1 && p2 && p1 !== p2) {
        this.pulses.push({
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          progress: 0,
          speed: 0.035 + Math.random() * 0.025,
          color: Math.random() < 0.5 ? "cyan" : "violet"
        });
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw particles
    const time = Date.now() * 0.002;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Physics movement
      p.x += p.vx;
      p.y += p.vy;

      // Screen wrap / bounce with smooth margin
      if (p.x < 0) p.x = this.width;
      else if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      else if (p.y > this.height) p.y = 0;

      // Mouse attraction / gentle repulsion
      if (this.mouse.isHovering) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw particle
      p.pulsePhase += 0.03;
      const pulsingRadius = p.isMajorNode
        ? p.baseRadius + Math.sin(p.pulsePhase) * 1.5
        : p.baseRadius;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, pulsingRadius, 0, Math.PI * 2);

      let pColor = this.config.baseColor;
      if (p.colorType === "accent") pColor = this.config.accentColor;
      else if (p.colorType === "violet") pColor = this.config.violetColor;

      this.ctx.fillStyle = `${pColor}${p.alpha})`;
      this.ctx.shadowBlur = p.isMajorNode ? 12 : 0;
      this.ctx.shadowColor = p.colorType === "violet" ? "#a855f7" : "#00f0ff";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw secondary outer ring for major hub nodes
      if (p.isMajorNode) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, pulsingRadius * 2.8, 0, Math.PI * 2);
        this.ctx.strokeStyle = `${pColor}0.18)`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

      // Connections to other particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.maxDistance) {
          const lineAlpha = (1 - dist / this.config.maxDistance) * 0.28;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);

          // Use subtle gradient
          const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          grad.addColorStop(0, `${pColor}${lineAlpha})`);
          grad.addColorStop(1, `${this.config.baseColor}${lineAlpha * 0.6})`);

          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();

          // Spontaneously spawn traveling pulse packets along lines
          if (Math.random() < 0.0003 && this.pulses.length < 25) {
            this.pulses.push({
              x1: p.x,
              y1: p.y,
              x2: p2.x,
              y2: p2.y,
              progress: 0,
              speed: 0.015 + Math.random() * 0.02,
              color: Math.random() < 0.6 ? "cyan" : "violet"
            });
          }
        }
      }

      // Mouse interactive connection
      if (this.mouse.isHovering) {
        const mdx = this.mouse.x - p.x;
        const mdy = this.mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < 140) {
          const mAlpha = (1 - mDist / 140) * 0.45;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${mAlpha})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
        }
      }
    }

    // Update and draw traveling data packets (synapse impulses)
    for (let k = this.pulses.length - 1; k >= 0; k--) {
      const pulse = this.pulses[k];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        this.pulses.splice(k, 1);
        continue;
      }

      const curX = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
      const curY = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = pulse.color === "cyan" ? "#00f0ff" : "#c084fc";
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = pulse.color === "cyan" ? "#00f0ff" : "#c084fc";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    requestAnimationFrame(this.animate);
  }
}

// Export to global scope
if (typeof window !== "undefined") {
  window.NetworkCanvas = NetworkCanvas;
}
