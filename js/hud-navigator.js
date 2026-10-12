/**
 * HUD Navigator - Interactive Node Constellation Minimap & Navigation System
 * Manages active node states, scroll spy synchronization, dynamic progress beams,
 * and smooth transitions between network anchors.
 */

class HudNavigator {
  constructor(soundEngine, networkCanvas) {
    this.soundEngine = soundEngine;
    this.networkCanvas = networkCanvas;

    this.nodes = [
      { id: "nexus", label: "01 // NEXUS", title: "Core Identity" },
      { id: "origin", label: "02 // ORIGIN", title: "Bio & Ethos" },
      { id: "synapse", label: "03 // SYNAPSE", title: "Tech Stack" },
      { id: "cluster", label: "04 // CLUSTER", title: "Projects" },
      { id: "timeline", label: "05 // TIMELINE", title: "Milestones" },
      { id: "transmit", label: "06 // TRANSMIT", title: "Connect" }
    ];

    this.activeNodeIndex = 0;
    this.hudContainer = document.getElementById("constellation-hud");
    this.navLinks = document.querySelectorAll(".nav-node-link");
    this.sections = this.nodes.map(n => document.getElementById(n.id)).filter(Boolean);

    this.init();
  }

  init() {
    this.renderHudWidget();
    this.bindEvents();
    this.setupScrollSpy();
  }

  renderHudWidget() {
    if (!this.hudContainer) return;

    let html = `
      <div class="hud-panel glass-panel">
        <div class="hud-header">
          <div class="hud-status-dot"></div>
          <span class="hud-title">NETWORK MINIMAP</span>
          <button class="hud-collapse-btn" id="hud-collapse-toggle" aria-label="Toggle Minimap">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
        </div>
        <div class="hud-graph" id="hud-graph-body">
          <div class="hud-spine-line">
            <div class="hud-progress-beam" id="hud-progress-beam"></div>
          </div>
          <div class="hud-nodes-list">
    `;

    this.nodes.forEach((node, index) => {
      html += `
        <div class="hud-node-item ${index === 0 ? 'active' : ''}" data-target="${node.id}" data-index="${index}">
          <div class="hud-node-beacon">
            <span class="beacon-ring"></span>
            <span class="beacon-core"></span>
          </div>
          <div class="hud-node-meta">
            <span class="hud-node-code">${node.label}</span>
            <span class="hud-node-name">${node.title}</span>
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    this.hudContainer.innerHTML = html;
  }

  bindEvents() {
    // HUD Node item clicks
    const hudItems = document.querySelectorAll(".hud-node-item");
    hudItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetId = item.getAttribute("data-target");
        this.navigateTo(targetId);
      });

      item.addEventListener("mouseenter", () => {
        if (this.soundEngine) this.soundEngine.playNodeHover();
      });
    });

    // Top navigation link clicks
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").replace("#", "");
        this.navigateTo(targetId);
      });

      link.addEventListener("mouseenter", () => {
        if (this.soundEngine) this.soundEngine.playNodeHover();
      });
    });

    // Minimap collapse toggle
    const toggleBtn = document.getElementById("hud-collapse-toggle");
    const graphBody = document.getElementById("hud-graph-body");
    if (toggleBtn && graphBody) {
      toggleBtn.addEventListener("click", () => {
        graphBody.classList.toggle("collapsed");
        toggleBtn.classList.toggle("rotated");
      });
    }

    // Window scroll event for smooth beam progress
    window.addEventListener("scroll", () => {
      this.updateBeamProgress();
    }, { passive: true });
  }

  navigateTo(targetId) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    if (this.soundEngine) this.soundEngine.playNodeClick();
    if (this.networkCanvas) this.networkCanvas.triggerEnergySurge();

    // Smooth scroll with header offset
    const navHeight = 72;
    const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });

    // Update active node immediately
    const nodeIdx = this.nodes.findIndex(n => n.id === targetId);
    if (nodeIdx !== -1) {
      this.setActiveNode(nodeIdx);
    }
  }

  setupScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = this.nodes.findIndex(n => n.id === id);
          if (idx !== -1) {
            this.setActiveNode(idx);
          }
        }
      });
    }, observerOptions);

    this.sections.forEach(sec => observer.observe(sec));
  }

  setActiveNode(index) {
    this.activeNodeIndex = index;

    // Update HUD minimap
    const hudItems = document.querySelectorAll(".hud-node-item");
    hudItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update Top Nav
    this.navLinks.forEach((link, idx) => {
      if (idx === index) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Notify Canvas
    if (this.networkCanvas) {
      this.networkCanvas.setActiveSection(index);
    }

    // Telemetry display update if present
    const currentCode = document.getElementById("telemetry-active-node");
    if (currentCode) {
      currentCode.textContent = this.nodes[index].label;
    }
  }

  updateBeamProgress() {
    const beam = document.getElementById("hud-progress-beam");
    if (!beam) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    beam.style.height = `${progress * 100}%`;
  }
}

if (typeof window !== "undefined") {
  window.HudNavigator = HudNavigator;
}
