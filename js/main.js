/**
 * Main Application Orchestrator
 * Connects the Multi-Junction Spider Web Tapestry to dedicated Project & Section Key Cards.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Sound Engine, Spider Web Tapestry & 3D Three.js Universe
  const soundEngine = new SoundEngine();
  const spiderWeb = new SpiderWeb("spider-web-canvas");
  spiderWeb.setSoundEngine(soundEngine);

  let threeUniverse = null;
  if (typeof ThreeUniverse !== "undefined") {
    threeUniverse = new ThreeUniverse("three-universe-canvas");
    window.threeUniverseInstance = threeUniverse;
  }

  window.soundEngineInstance = soundEngine;
  window.spiderWebInstance = spiderWeb;

  // List of all junctions from data
  const junctions = PortfolioData.junctions || [];
  let currentJunctionIndex = 0;

  // UI Elements
  const overlay = document.getElementById("key-card-overlay");
  const backdrop = document.getElementById("key-card-backdrop");
  const closeBtn = document.getElementById("card-close-btn");
  const returnWebBtn = document.getElementById("card-return-web-btn");
  const dynamicBody = document.getElementById("key-card-dynamic-body");
  const nodeCodeLabel = document.getElementById("card-node-code");
  const nodeBadgeLabel = document.getElementById("card-node-badge");
  const prevBtn = document.getElementById("card-prev-btn");
  const nextBtn = document.getElementById("card-next-btn");
  const brandResetBtn = document.getElementById("brand-reset-btn");
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const hintBanner = document.getElementById("web-instruction-hint");
  const navContainer = document.getElementById("quick-nodes-nav");

  // 2. Render Dynamic Nav Pills
  if (navContainer) {
    navContainer.innerHTML = junctions.map((j, idx) => `
      <button class="node-pill ${idx === 0 ? 'active' : ''}" data-junction="${j.id}">
        <span class="pill-dot"></span>${j.label}
      </button>
    `).join("");

    navContainer.querySelectorAll(".node-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const targetId = pill.getAttribute("data-junction");
        spiderWeb.selectJunction(targetId);
        openKeyCard(targetId);
      });

      pill.addEventListener("mouseenter", () => {
        soundEngine.playNodeHover();
      });
    });
  }

  // 3. Web Click & Transit Guide Handlers
  spiderWeb.onNodeClick((junctionId) => {
    openKeyCard(junctionId);
  });

  spiderWeb.onNavigate((targetId) => {
    updateNavPills(targetId);
    if (overlay.classList.contains("active")) {
      openKeyCard(targetId);
    } else {
      const targetJunc = junctions.find(j => j.id === targetId);
      if (hintBanner && targetJunc) {
        hintBanner.innerHTML = `<div class="hint-pill"><span class="hint-pulse-dot"></span><span>➔ GLIDED TO <strong>${targetJunc.label}</strong> &bull; CLICK CENTER GLOW TO OPEN KEY CARD</span></div>`;
        hintBanner.style.opacity = "1";
      }
    }
  });

  // 4. Open Key Card Function
  function openKeyCard(junctionId) {
    const jIdx = junctions.findIndex(j => j.id === junctionId);
    if (jIdx !== -1) currentJunctionIndex = jIdx;

    const junc = junctions[currentJunctionIndex] || junctions[0];

    // Update Header labels
    if (nodeCodeLabel) nodeCodeLabel.textContent = `${junc.label}`;
    if (nodeBadgeLabel) nodeBadgeLabel.textContent = junc.badge || "KEY SECTION";

    // Render Section / Project Content
    renderJunctionCard(junc);

    // Update Nav Pills active state
    updateNavPills(junc.id);

    // Hide instruction hint
    if (hintBanner) hintBanner.style.opacity = "0";

    // Open Overlay and dismiss magnetic reticle cursor lock
    document.body.classList.add("card-open");
    const reticle = document.getElementById("cyber-reticle");
    if (reticle) {
      reticle.classList.remove("is-locked");
      reticle.style.opacity = "0";
      reticle.style.visibility = "hidden";
      reticle.style.display = "none";
    }

    overlay.classList.add("active");
  }

  // 5. Close Key Card -> Return to "Spider Web Only"
  function closeKeyCard() {
    soundEngine.playNodeClick();
    document.body.classList.remove("card-open");
    const reticle = document.getElementById("cyber-reticle");
    if (reticle) {
      reticle.style.display = "";
      reticle.style.visibility = "";
    }
    overlay.classList.remove("active");
    spiderWeb.resetActiveNode();
    updateNavPills(null);

    // Re-show instruction hint
    if (hintBanner) hintBanner.style.opacity = "1";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeKeyCard);
  if (backdrop) backdrop.addEventListener("click", closeKeyCard);
  if (returnWebBtn) returnWebBtn.addEventListener("click", closeKeyCard);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeKeyCard();
    }
  });

  // Stepper Previous / Next Junction
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      currentJunctionIndex = (currentJunctionIndex - 1 + junctions.length) % junctions.length;
      const target = junctions[currentJunctionIndex];
      spiderWeb.selectJunction(target.id);
      openKeyCard(target.id);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      currentJunctionIndex = (currentJunctionIndex + 1) % junctions.length;
      const target = junctions[currentJunctionIndex];
      spiderWeb.selectJunction(target.id);
      openKeyCard(target.id);
    });
  }

  function updateNavPills(activeId) {
    if (!navContainer) return;
    navContainer.querySelectorAll(".node-pill").forEach(p => {
      if (p.getAttribute("data-junction") === activeId) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
  }

  // Brand Reset to Web Only
  if (brandResetBtn) {
    brandResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeKeyCard();
      spiderWeb.recenter();
    });
  }

  // Canvas Pan / Zoom Toolbar Controls
  const zoomInBtn = document.getElementById("canvas-zoom-in");
  const zoomOutBtn = document.getElementById("canvas-zoom-out");
  const recenterBtn = document.getElementById("canvas-recenter-btn");

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      soundEngine.playNodeHover();
      spiderWeb.zoomIn();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      soundEngine.playNodeHover();
      spiderWeb.zoomOut();
    });
  }

  if (recenterBtn) {
    recenterBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      spiderWeb.recenter();
    });
  }

  // Sound Synthesizer Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      const isUnmuted = soundEngine.toggleMute();
      soundToggleBtn.classList.toggle("active", isUnmuted);
      const lbl = soundToggleBtn.querySelector(".sound-toggle-label");
      if (lbl) lbl.textContent = isUnmuted ? "AUDIO ON" : "AUDIO MUTED";
    });
  }

  // 6. Card Body Content Renderer
  function renderJunctionCard(junc) {
    if (!dynamicBody) return;

    if (junc.type === "project") {
      dynamicBody.innerHTML = renderProjectTemplate(junc);
      bindProjectSimulationEvents(junc);
    } else if (junc.id === "nexus") {
      dynamicBody.innerHTML = renderNexusTemplate();
      bindNexusTabEvents();
    } else if (junc.id === "skills") {
      dynamicBody.innerHTML = renderSkillsTemplate();
      bindSkillsEvents();
    } else if (junc.id === "terminal") {
      dynamicBody.innerHTML = renderTerminalTemplate();
      initTerminalInCard();
    } else if (junc.id === "transmit") {
      dynamicBody.innerHTML = renderTransmitTemplate();
      bindTransmitEvents();
    } else {
      dynamicBody.innerHTML = renderNexusTemplate();
      bindNexusTabEvents();
    }
  }

  // TEMPLATE: Dedicated Project Repository Key Card
  function renderProjectTemplate(proj) {
    let simulationHtml = "";

    if (proj.id.includes("ipl")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// INTERACTIVE MODEL INFERENCE: CHASE WIN PROBABILITY</span>
          </div>
          <div class="sim-controls">
            <div class="sim-control-row">
              <label class="sim-label">Target Runs: <span id="ipl-target-val" class="mono text-cyan">180</span></label>
              <input type="range" min="120" max="230" value="180" id="ipl-target-input" class="sim-slider">
            </div>
            <div class="sim-control-row">
              <label class="sim-label">Overs Completed: <span id="ipl-overs-val" class="mono text-cyan">14.0</span></label>
              <input type="range" min="6" max="19" value="14" step="1" id="ipl-overs-input" class="sim-slider">
            </div>
            <div class="sim-control-row">
              <label class="sim-label">Wickets Lost: <span id="ipl-wickets-val" class="mono text-cyan">3</span></label>
              <input type="range" min="0" max="9" value="3" id="ipl-wickets-input" class="sim-slider">
            </div>
          </div>
          <div class="sim-output">
            <div class="sim-metric-readout">
              <span class="mono text-xs text-muted">CALCULATED WIN PROBABILITY:</span>
              <strong id="ipl-prob-display" class="text-cyan">74.2%</strong>
            </div>
            <div class="sim-meter-bar">
              <div class="sim-meter-fill" id="ipl-prob-fill" style="width: 74.2%;"></div>
            </div>
          </div>
        </div>
      `;
    } else if (proj.id.includes("ttest")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// STATISTICAL BENCHMARK: 2-SAMPLE HYPOTHESIS TEST</span>
          </div>
          <div class="sim-controls">
            <div class="sim-control-row">
              <label class="sim-label">Sample Size (N₁ = N₂): <span id="ttest-n-val" class="mono text-cyan">65</span></label>
              <input type="range" min="15" max="250" value="65" id="ttest-n-input" class="sim-slider">
            </div>
            <div class="sim-control-row">
              <label class="sim-label">Effect Size (Cohen's d): <span id="ttest-d-val" class="mono text-cyan">0.45</span></label>
              <input type="range" min="0.05" max="1.5" step="0.05" value="0.45" id="ttest-d-input" class="sim-slider">
            </div>
          </div>
          <div class="sim-output">
            <div class="sim-stats-readout">
              <div class="mono text-xs">t-STATISTIC: <span id="ttest-stat-val" class="text-cyan">2.57</span></div>
              <div class="mono text-xs">p-VALUE: <span id="ttest-pval-val" class="text-cyan">0.0112</span></div>
              <div id="ttest-decision-val" class="mono text-xs" style="color: #4ade80;">[✓ REJECT H0: STATISTICALLY SIGNIFICANT (p &lt; 0.05)]</div>
            </div>
          </div>
        </div>
      `;
    } else if (proj.id.includes("jobtrack")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// AI SIMULATOR: ATS KEYWORD VECTOR COSINE SIMILARITY</span>
          </div>
          <p class="mono text-xs text-muted" style="margin-bottom: 0.5rem;">Click tokens to toggle applicant skill vector match:</p>
          <div class="sim-tokens-row">
            <span class="sim-token active" data-weight="18">Python</span>
            <span class="sim-token active" data-weight="20">Scikit-Learn</span>
            <span class="sim-token active" data-weight="14">FastAPI</span>
            <span class="sim-token" data-weight="16">PyTorch</span>
            <span class="sim-token" data-weight="12">Docker</span>
            <span class="sim-token active" data-weight="18">SQL</span>
          </div>
          <div class="sim-output">
            <div class="sim-metric-readout">
              <span class="mono text-xs text-muted">COSINE SIMILARITY MATCH:</span>
              <strong id="jobtrack-score-display" class="text-cyan">71%</strong>
            </div>
            <div class="sim-meter-bar">
              <div class="sim-meter-fill" id="jobtrack-score-fill" style="width: 71%;"></div>
            </div>
          </div>
        </div>
      `;
    } else if (proj.id.includes("changeformer") || proj.id.includes("sih")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// AI SIMULATOR: BITEMPORAL SATELLITE CHANGE DETECTION (ChangeFormerV6)</span>
          </div>
          <p class="mono text-xs text-muted" style="margin-bottom: 0.75rem;">Interactive multi-temporal transformer difference inference:</p>
          <div class="sim-dual-view">
            <div class="sim-preview-frame">
              <span>T1: BASELINE (2022)</span>
              <span class="mono text-xs text-muted">Optical 0.5m GeoTIFF</span>
            </div>
            <div class="sim-preview-frame highlighted" id="changeformer-t2-frame">
              <div class="sim-mask-overlay" id="changeformer-mask-overlay"></div>
              <span>T2: RECON (2024)</span>
              <span class="mono text-xs text-cyan" id="changeformer-detected-lbl">SHIFT DETECTED</span>
            </div>
          </div>
          <div class="sim-controls-grid">
            <div class="sim-control-row">
              <label class="sim-label">Temporal Contrast Threshold: <span id="cf-thresh-val" class="mono text-cyan">0.75</span></label>
              <input type="range" min="0.2" max="0.95" step="0.05" value="0.75" id="cf-thresh-input" class="sim-slider">
            </div>
          </div>
          <div class="sim-output">
            <div class="sim-metric-readout">
              <span class="mono text-xs text-muted">MODEL INFERENCE CONFIDENCE:</span>
              <strong id="cf-score-display" class="text-cyan">97.8%</strong>
            </div>
            <div class="sim-meter-bar">
              <div class="sim-meter-fill" id="cf-score-fill" style="width: 97.8%;"></div>
            </div>
          </div>
        </div>
      `;
    } else if (proj.id.includes("mnist")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// AI SIMULATOR: FEDERATED LEARNING CONVERGENCE (Flower + PyTorch)</span>
          </div>
          <p class="mono text-xs text-muted" style="margin-bottom: 0.75rem;">Simulate FedAvg decentralized aggregation across non-IID clients:</p>
          <div class="sim-controls-grid">
            <div class="sim-control-row">
              <label class="sim-label">Communication Round: <span id="fed-round-val" class="mono text-cyan">25 / 25</span></label>
              <input type="range" min="1" max="25" value="25" id="fed-round-input" class="sim-slider">
            </div>
          </div>
          <div class="sim-output">
            <div class="sim-stats-readout">
              <div class="mono text-xs">GLOBAL MODEL ACCURACY: <span id="fed-acc-val" class="text-cyan">98.4%</span></div>
              <div class="mono text-xs">DIFFERENTIAL PRIVACY BUDGET (ε): <span id="fed-eps-val" class="text-cyan">1.42 (High Privacy)</span></div>
              <div class="mono text-xs" style="color: #4ade80;">[✓ CLIENT RAW GRADIENTS ENCRYPTED // NON-IID AGGREGATED]</div>
            </div>
            <div class="sim-meter-bar" style="margin-top: 0.5rem;">
              <div class="sim-meter-fill" id="fed-meter-fill" style="width: 98.4%;"></div>
            </div>
          </div>
        </div>
      `;
    } else if (proj.id.includes("startupval")) {
      simulationHtml = `
        <div class="interactive-simulation-box">
          <div class="sim-header">
            <span class="sim-dot"></span>
            <span class="mono text-cyan text-xs">// MATH SIMULATOR: GALTON-WATSON BRANCHING STOCHASTIC VALUATION</span>
          </div>
          <p class="mono text-xs text-muted" style="margin-bottom: 0.75rem;">Customer survival probability & Monte Carlo enterprise valuation:</p>
          <div class="sim-controls-grid">
            <div class="sim-control-row">
              <label class="sim-label">Net Reproduction Rate (μ): <span id="val-mu-val" class="mono text-cyan">1.35</span></label>
              <input type="range" min="0.8" max="2.2" step="0.05" value="1.35" id="val-mu-input" class="sim-slider">
            </div>
            <div class="sim-control-row">
              <label class="sim-label">Customer Churn Rate (q): <span id="val-q-val" class="mono text-cyan">0.24</span></label>
              <input type="range" min="0.05" max="0.60" step="0.01" value="0.24" id="val-q-input" class="sim-slider">
            </div>
          </div>
          <div class="sim-output">
            <div class="sim-stats-readout">
              <div class="mono text-xs">EXTINCTION PROBABILITY: <span id="val-extinct-val" class="text-cyan">17.8%</span></div>
              <div class="mono text-xs">5-YR EXPECTED VALUATION: <span id="val-expect-val" class="text-cyan">$14.2M</span></div>
              <div class="mono text-xs text-muted">95% CONFIDENCE INTERVAL: <span id="val-ci-val" class="text-cyan">[$6.4M - $28.9M]</span></div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="project-single-view">
        <div class="project-view-header">
          <div>
            <div class="repo-name-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>${proj.repoName}</span>
            </div>
            <h2 class="project-view-title">${proj.title}</h2>
            <div class="project-view-cat text-cyan">${proj.category}</div>
          </div>
          <span class="badge-tag">${proj.badge}</span>
        </div>

        <p class="project-view-summary">${proj.summary}</p>

        <div class="origin-highlight-box" style="margin-bottom: 1.5rem;">
          <h4>System Overview</h4>
          <p style="font-size: 0.95rem; line-height: 1.65; color: var(--text-secondary);">${proj.overview}</p>
        </div>

        <!-- Interactive Data Science Simulation Sandbox -->
        ${simulationHtml}

        <!-- Metrics Grid -->
        <div class="nexus-stats-grid" style="margin-bottom: 1.5rem;">
          ${Object.entries(proj.metrics).map(([k, v]) => `
            <div class="stat-cell">
              <div class="stat-val text-cyan" style="font-size: 1.35rem;">${v}</div>
              <div class="stat-lbl">${k.toUpperCase()}</div>
            </div>
          `).join("")}
        </div>

        <!-- Tech Stack -->
        <div style="margin-bottom: 1.75rem;">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 0.65rem; color: var(--text-primary);">Technology Stack</h4>
          <div class="repo-tags-row">
            ${proj.techStack.map(t => `<span class="tag-pill" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;">${t}</span>`).join("")}
          </div>
        </div>

        <!-- Action Links & One-Click Git Clone & Share -->
        <div class="nexus-cta-row" style="flex-wrap: wrap; gap: 0.75rem;">
          <a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Explore on GitHub
          </a>
          <button class="btn btn-secondary copy-clone-btn" data-repo="${proj.repoName}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span class="copy-text">git clone</span>
          </button>
          <button class="btn btn-secondary share-link-btn" data-id="${proj.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Share Link</span>
          </button>
          <a href="${proj.links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span>Live System Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  function bindProjectSimulationEvents(proj) {
    if (!dynamicBody) return;

    // 1. One-click copy clone command
    const copyBtn = dynamicBody.querySelector(".copy-clone-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        soundEngine.playNodeClick();
        const cloneCmd = `git clone https://github.com/A101shah/${proj.repoName}.git`;
        navigator.clipboard.writeText(cloneCmd).then(() => {
          const txt = copyBtn.querySelector(".copy-text");
          if (txt) {
            const old = txt.textContent;
            txt.textContent = "✓ CLONE COPIED";
            copyBtn.style.borderColor = "#00f0ff";
            copyBtn.style.color = "#00f0ff";
            setTimeout(() => {
              txt.textContent = old;
              copyBtn.style.borderColor = "";
              copyBtn.style.color = "";
            }, 2000);
          }
        }).catch(() => {});
      });
    }

    // 2. IPL Match Simulation
    if (proj.id.includes("ipl")) {
      const targetInput = dynamicBody.querySelector("#ipl-target-input");
      const oversInput = dynamicBody.querySelector("#ipl-overs-input");
      const wicketsInput = dynamicBody.querySelector("#ipl-wickets-input");

      const targetVal = dynamicBody.querySelector("#ipl-target-val");
      const oversVal = dynamicBody.querySelector("#ipl-overs-val");
      const wicketsVal = dynamicBody.querySelector("#ipl-wickets-val");
      const probDisplay = dynamicBody.querySelector("#ipl-prob-display");
      const probFill = dynamicBody.querySelector("#ipl-prob-fill");

      function updateIpl() {
        if (!targetInput || !oversInput || !wicketsInput) return;
        const target = parseFloat(targetInput.value);
        const overs = parseFloat(oversInput.value);
        const wickets = parseInt(wicketsInput.value, 10);

        if (targetVal) targetVal.textContent = target;
        if (oversVal) oversVal.textContent = overs.toFixed(1);
        if (wicketsVal) wicketsVal.textContent = wickets;

        const runsScored = target * (overs / 20) * 0.94;
        const reqRuns = Math.max(0, target - runsScored);
        const ballsRem = Math.max(1, (20 - overs) * 6);
        const rrr = reqRuns / (ballsRem / 6);
        const wPenalty = wickets * 0.42;
        const logit = 3.4 - (rrr * 0.38) - wPenalty;
        const prob = Math.min(Math.max((1 / (1 + Math.exp(-logit))) * 100, 3.5), 97.8);

        if (probDisplay) probDisplay.textContent = `${prob.toFixed(1)}%`;
        if (probFill) {
          probFill.style.width = `${prob.toFixed(1)}%`;
          probFill.style.background = prob > 50 ? "linear-gradient(90deg, #38bdf8, #00f0ff)" : "linear-gradient(90deg, #64748b, #94a3b8)";
        }
      }

      if (targetInput) targetInput.addEventListener("input", updateIpl);
      if (oversInput) oversInput.addEventListener("input", updateIpl);
      if (wicketsInput) wicketsInput.addEventListener("input", updateIpl);
    }

    // 3. T-Test Simulation
    if (proj.id.includes("ttest")) {
      const nInput = dynamicBody.querySelector("#ttest-n-input");
      const dInput = dynamicBody.querySelector("#ttest-d-input");
      const nVal = dynamicBody.querySelector("#ttest-n-val");
      const dVal = dynamicBody.querySelector("#ttest-d-val");
      const statVal = dynamicBody.querySelector("#ttest-stat-val");
      const pvalVal = dynamicBody.querySelector("#ttest-pval-val");
      const decisionVal = dynamicBody.querySelector("#ttest-decision-val");

      function updateTTest() {
        if (!nInput || !dInput) return;
        const n = parseInt(nInput.value, 10);
        const d = parseFloat(dInput.value);

        if (nVal) nVal.textContent = n;
        if (dVal) dVal.textContent = d.toFixed(2);

        const tStat = d * Math.sqrt(n / 2);
        // Gaussian error approximation for p-value
        const z = Math.abs(tStat);
        const pVal = 2 * (1 - 0.5 * (1 + Math.tanh(Math.SQRT2 / Math.PI * (z + 0.044715 * Math.pow(z, 3)))));

        if (statVal) statVal.textContent = tStat.toFixed(2);
        if (pvalVal) pvalVal.textContent = pVal < 0.0001 ? "< 0.0001" : pVal.toFixed(4);

        if (decisionVal) {
          if (pVal < 0.05) {
            decisionVal.innerHTML = `<span style="color:#4ade80;">[✓ REJECT H0: STATISTICALLY SIGNIFICANT (p &lt; 0.05)]</span>`;
          } else {
            decisionVal.innerHTML = `<span style="color:#94a3b8;">[FAIL TO REJECT H0: NO SIGNIFICANT DIFFERENCE (p &ge; 0.05)]</span>`;
          }
        }
      }

      if (nInput) nInput.addEventListener("input", updateTTest);
      if (dInput) dInput.addEventListener("input", updateTTest);
    }

    // 4. JobTrack Token Match Simulation
    if (proj.id.includes("jobtrack")) {
      const tokens = dynamicBody.querySelectorAll(".sim-token");
      const scoreDisplay = dynamicBody.querySelector("#jobtrack-score-display");
      const scoreFill = dynamicBody.querySelector("#jobtrack-score-fill");

      tokens.forEach(tok => {
        tok.addEventListener("click", () => {
          soundEngine.playNodeClick();
          tok.classList.toggle("active");
          let total = 0;
          let active = 0;
          tokens.forEach(t => {
            const w = parseFloat(t.dataset.weight || 15);
            total += w;
            if (t.classList.contains("active")) active += w;
          });
          const score = Math.round((active / total) * 100);
          if (scoreDisplay) scoreDisplay.textContent = `${score}%`;
          if (scoreFill) scoreFill.style.width = `${score}%`;
        });
      });
    }

    // 5. One-Click Deep Link Share
    const shareBtn = dynamicBody.querySelector(".share-link-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        soundEngine.playNodeClick();
        const deepUrl = `${window.location.origin}${window.location.pathname}#${proj.id}`;
        navigator.clipboard.writeText(deepUrl).then(() => {
          showCyberToast(`DEEP LINK COPIED: #${proj.id}`);
        }).catch(() => {});
      });
    }

    // 6. ChangeFormer Bitemporal Simulation
    if (proj.id.includes("changeformer") || proj.id.includes("sih")) {
      const cfInput = dynamicBody.querySelector("#cf-thresh-input");
      const cfVal = dynamicBody.querySelector("#cf-thresh-val");
      const cfScoreDisplay = dynamicBody.querySelector("#cf-score-display");
      const cfScoreFill = dynamicBody.querySelector("#cf-score-fill");
      const cfMask = dynamicBody.querySelector("#changeformer-mask-overlay");
      const cfLbl = dynamicBody.querySelector("#changeformer-detected-lbl");

      function updateChangeFormer() {
        if (!cfInput) return;
        const thresh = parseFloat(cfInput.value);
        if (cfVal) cfVal.textContent = thresh.toFixed(2);

        const conf = Math.min(Math.max(90 + (0.95 - thresh) * 11, 78), 99.4);
        if (cfScoreDisplay) cfScoreDisplay.textContent = `${conf.toFixed(1)}%`;
        if (cfScoreFill) cfScoreFill.style.width = `${conf.toFixed(1)}%`;

        if (cfMask) {
          cfMask.style.opacity = thresh < 0.85 ? "1" : "0.35";
        }
        if (cfLbl) {
          cfLbl.textContent = thresh < 0.85 ? "SHIFT DETECTED" : "LOW DELTA";
          cfLbl.style.color = thresh < 0.85 ? "var(--cyan-glow)" : "var(--text-muted)";
        }
      }

      if (cfInput) cfInput.addEventListener("input", updateChangeFormer);
    }

    // 7. MNIST Federated Learning Simulation
    if (proj.id.includes("mnist")) {
      const fedInput = dynamicBody.querySelector("#fed-round-input");
      const fedRoundVal = dynamicBody.querySelector("#fed-round-val");
      const fedAccVal = dynamicBody.querySelector("#fed-acc-val");
      const fedEpsVal = dynamicBody.querySelector("#fed-eps-val");
      const fedMeterFill = dynamicBody.querySelector("#fed-meter-fill");

      function updateFed() {
        if (!fedInput) return;
        const r = parseInt(fedInput.value, 10);
        if (fedRoundVal) fedRoundVal.textContent = `${r} / 25`;

        const acc = Math.min(98.4, 12 + Math.log(r + 1) * 26.8);
        const eps = (0.35 + (r / 25) * 1.07).toFixed(2);

        if (fedAccVal) fedAccVal.textContent = `${acc.toFixed(1)}%`;
        if (fedEpsVal) fedEpsVal.textContent = `${eps} (High Privacy)`;
        if (fedMeterFill) fedMeterFill.style.width = `${acc.toFixed(1)}%`;
      }

      if (fedInput) fedInput.addEventListener("input", updateFed);
    }

    // 8. Stochastic Startup Valuation Simulation
    if (proj.id.includes("startupval")) {
      const muInput = dynamicBody.querySelector("#val-mu-input");
      const qInput = dynamicBody.querySelector("#val-q-input");
      const muVal = dynamicBody.querySelector("#val-mu-val");
      const qVal = dynamicBody.querySelector("#val-q-val");
      const extinctVal = dynamicBody.querySelector("#val-extinct-val");
      const expectVal = dynamicBody.querySelector("#val-expect-val");
      const ciVal = dynamicBody.querySelector("#val-ci-val");

      function updateValuation() {
        if (!muInput || !qInput) return;
        const mu = parseFloat(muInput.value);
        const q = parseFloat(qInput.value);

        if (muVal) muVal.textContent = mu.toFixed(2);
        if (qVal) qVal.textContent = q.toFixed(2);

        const ratio = q / mu;
        const extProb = Math.min(Math.max(Math.pow(ratio, 1.8) * 100, 2.5), 98.5);
        const baseVal = 2.5;
        const growth = Math.pow(Math.max(mu - q, 0.1), 4);
        const expVal = Math.min(Math.max(baseVal * growth * 1.8, 0.8), 65.0);
        const lowCI = (expVal * 0.45).toFixed(1);
        const highCI = (expVal * 2.05).toFixed(1);

        if (extinctVal) extinctVal.textContent = `${extProb.toFixed(1)}%`;
        if (expectVal) expectVal.textContent = `$${expVal.toFixed(1)}M`;
        if (ciVal) ciVal.textContent = `[$${lowCI}M - $${highCI}M]`;
      }

      if (muInput) muInput.addEventListener("input", updateValuation);
      if (qInput) qInput.addEventListener("input", updateValuation);
    }
  }

  // TEMPLATE: 00 // NEXUS (Multi-Tab Architecture: Overview, Personality, Hobbies, LinkedIn)
  function renderNexusTemplate(activeTab = "overview") {
    const p = PortfolioData.personal;
    const hobbiesCount = (PortfolioData.hobbies || []).length;
    const postsCount = (PortfolioData.linkedInPosts || []).length;

    return `
      <div class="nexus-profile-hero">
        <div class="nexus-avatar-wrap">
          <img src="${p.avatar}" alt="${p.name} Avatar" class="nexus-avatar-img">
        </div>
        <div class="nexus-info">
          <h2>${p.name}</h2>
          <div class="nexus-tagline">${p.title}</div>
          <div class="nexus-edu-pill">
            <span>🎓</span> ${p.education} &bull; ${p.location}
          </div>
        </div>
      </div>

      <!-- Multi-Tab Navigation Bar -->
      <nav class="nexus-tab-bar" aria-label="Nexus Navigation Tabs">
        <button class="nexus-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <span>01 // OVERVIEW &amp; BIO</span>
        </button>
        <button class="nexus-tab-btn ${activeTab === 'personality' ? 'active' : ''}" data-tab="personality">
          <span>02 // PERSONALITY &amp; ETHOS</span>
        </button>
        <button class="nexus-tab-btn ${activeTab === 'hobbies' ? 'active' : ''}" data-tab="hobbies">
          <span>03 // HOBBIES &amp; INTERESTS</span>
          <span class="nexus-tab-count">${hobbiesCount}</span>
        </button>
        <button class="nexus-tab-btn ${activeTab === 'linkedin' ? 'active' : ''}" data-tab="linkedin">
          <span>04 // LINKEDIN &amp; WRITING</span>
          <span class="nexus-tab-count">${postsCount}</span>
        </button>
      </nav>

      <!-- Dynamic Tab Content Area -->
      <div class="nexus-tab-content-area" id="nexus-tab-content">
        ${renderNexusTabContent(activeTab)}
      </div>
    `;
  }

  function renderNexusTabContent(tabName) {
    if (tabName === "personality") {
      return renderNexusPersonality();
    } else if (tabName === "hobbies") {
      return renderNexusHobbies();
    } else if (tabName === "linkedin") {
      return renderNexusLinkedIn();
    }
    return renderNexusOverview();
  }

  function renderNexusOverview() {
    const p = PortfolioData.personal;
    return `
      <p class="nexus-bio-lead">${p.subtitle}</p>

      <div class="origin-content-wrap" style="margin-bottom: 1.75rem;">
        ${p.bio.map(b => `<p class="origin-paragraph">${b}</p>`).join("")}
      </div>

      <div class="nexus-stats-grid">
        ${p.stats.map(s => `
          <div class="stat-cell">
            <div class="stat-val">${s.value}</div>
            <div class="stat-lbl">${s.label}</div>
          </div>
        `).join("")}
      </div>

      <div class="nexus-cta-row">
        <a href="${p.social.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub: @${p.handle}
        </a>
        <a href="${p.social.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          Connect on LinkedIn
        </a>
      </div>
    `;
  }

  function renderNexusPersonality() {
    const pers = PortfolioData.personality || {};
    const traits = pers.traits || [];
    const styles = pers.workingStyle || [];

    return `
      <!-- Core Philosophy Quote Box -->
      <div class="personality-quote-box">
        <span class="personality-quote-badge">// FIRST-PRINCIPLES ENGINEERING PHILOSOPHY</span>
        <blockquote class="personality-quote-text">
          &ldquo;${pers.philosophy || "Pragmatic Builder & First-Principles Grounder — Mathematical rigor makes software resilient, while high-standard intuitive design makes intelligent models genuinely useful to humans."}&rdquo;
        </blockquote>
      </div>

      <div class="section-subheading-bar">
        <span class="section-subheading-label">// CORE PERSONALITY TRAITS &amp; MINDSET</span>
        <span class="mono text-xs text-muted">4 ATTRIBUTES</span>
      </div>

      <!-- Traits Grid -->
      <div class="personality-traits-grid">
        ${traits.map(t => `
          <div class="personality-trait-card">
            <div class="trait-header">
              <span class="trait-icon">${t.icon}</span>
              <h4 class="trait-title">${t.title}</h4>
            </div>
            <p class="trait-desc">${t.desc}</p>
          </div>
        `).join("")}
      </div>

      <div class="section-subheading-bar">
        <span class="section-subheading-label">// WORKING STYLE &amp; OPERATIONAL PRINCIPLES</span>
        <span class="mono text-xs text-muted">REPRODUCIBILITY &amp; VELOCITY</span>
      </div>

      <!-- Working Style List -->
      <div class="working-style-list">
        ${styles.map(s => `
          <div class="working-style-card">
            <span class="working-style-icon">${s.icon}</span>
            <div class="working-style-content">
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderNexusHobbies() {
    const hobbies = PortfolioData.hobbies || [];

    return `
      <div class="section-subheading-bar" style="margin-top: 0;">
        <span class="section-subheading-label">// AUTHENTIC PURSUITS &amp; BEYOND THE TERMINAL</span>
        <span class="mono text-xs text-muted">${hobbies.length} DISCIPLINE AREAS</span>
      </div>

      <div class="hobbies-grid">
        ${hobbies.map(h => `
          <div class="hobby-card">
            <div class="hobby-header-row">
              <div class="hobby-icon-title">
                <span class="hobby-icon">${h.icon}</span>
                <h4 class="hobby-title">${h.title}</h4>
              </div>
              <span class="hobby-category-badge">${h.category}</span>
            </div>
            <p class="hobby-desc">${h.desc}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderNexusLinkedIn() {
    const posts = PortfolioData.linkedInPosts || [];
    const p = PortfolioData.personal;

    return `
      <!-- LinkedIn Header Profile Banner -->
      <div class="linkedin-feed-header">
        <div class="lf-profile-info">
          <div class="lf-li-logo" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </div>
          <div class="lf-profile-meta">
            <strong>${p.name} on LinkedIn</strong>
            <span>Active Technical Thought Leadership &amp; Engineering Essays</span>
          </div>
        </div>
        <a href="${p.social.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <span>View Verified Profile ↗</span>
        </a>
      </div>

      <div class="section-subheading-bar" style="margin-top: 0;">
        <span class="section-subheading-label">// CURATED ARTICLES &amp; TECHNICAL DISSECTIONS</span>
        <span class="mono text-xs text-muted">${posts.length} FEATURED ESSAYS</span>
      </div>

      <!-- LinkedIn Posts Feed -->
      <div class="linkedin-posts-list">
        ${posts.map(post => `
          <article class="linkedin-post-card">
            <div class="lp-meta-row">
              <span class="lp-topic-badge">${post.topic}</span>
              <span class="lp-date-badge">${post.date}</span>
            </div>

            <h3 class="lp-title">${post.title}</h3>

            <p class="lp-excerpt">${post.excerpt}</p>

            <div class="lp-tags-row">
              ${(post.tags || []).map(t => `<span class="lp-tag">${t}</span>`).join("")}
            </div>

            <footer class="lp-footer-row">
              <div class="lp-stats-group">
                <span class="lp-stat-item" title="Post Reactions">
                  👍 <strong>${post.stats.likes}</strong>
                </span>
                <span class="lp-stat-item" title="Comments">
                  💬 <strong>${post.stats.comments}</strong>
                </span>
                <span class="lp-stat-item" title="Reposts">
                  🔄 <strong>${post.stats.reposts}</strong>
                </span>
                <span class="lp-stat-item" title="Impressions">
                  👁️ <strong>${post.stats.views}</strong>
                </span>
              </div>

              <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="lp-action-btn">
                <span>Discuss on LinkedIn</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </footer>
          </article>
        `).join("")}
      </div>
    `;
  }

  function bindNexusTabEvents() {
    if (!dynamicBody) return;
    const tabBar = dynamicBody.querySelector(".nexus-tab-bar");
    const contentArea = dynamicBody.querySelector("#nexus-tab-content");
    if (!tabBar || !contentArea) return;

    tabBar.querySelectorAll(".nexus-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.playNodeClick();
        tabBar.querySelectorAll(".nexus-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        contentArea.innerHTML = renderNexusTabContent(tab);
      });
    });
  }

  // TEMPLATE: S1 // SKILLS
  function renderSkillsTemplate() {
    const cats = PortfolioData.skills.categories;
    return `
      <div class="skills-filter-nav" id="card-skills-filter">
        ${cats.map((c, i) => `<button class="skill-tab-btn ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join("")}
      </div>
      <div class="skills-list-grid" id="card-skills-grid">
        ${renderSkillsCards("All")}
      </div>
    `;
  }

  function renderSkillsCards(category) {
    const items = category === "All"
      ? PortfolioData.skills.items
      : PortfolioData.skills.items.filter(s => s.category === category);

    return items.map(s => `
      <div class="skill-item-card">
        <div class="skill-top">
          <span class="skill-label">${s.icon} ${s.name}</span>
          <span class="mono text-xs text-muted">${s.exp}</span>
        </div>
        <div class="skill-meter-bg">
          <div class="skill-meter-fill" style="width: ${s.level}%"></div>
        </div>
        <div class="skill-bottom-meta">
          <span>${s.category}</span>
          <span class="text-cyan">${s.level}%</span>
        </div>
      </div>
    `).join("");
  }

  function bindSkillsEvents() {
    const filterNav = document.getElementById("card-skills-filter");
    const grid = document.getElementById("card-skills-grid");
    if (!filterNav || !grid) return;

    filterNav.querySelectorAll(".skill-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.playNodeClick();
        filterNav.querySelectorAll(".skill-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        grid.innerHTML = renderSkillsCards(btn.getAttribute("data-cat"));
      });
    });
  }

  // TEMPLATE: S3 // TRANSMIT
  function renderTransmitTemplate() {
    const p = PortfolioData.personal;
    return `
      <div class="transmit-card-grid">
        <form id="key-contact-form">
          <div class="form-group">
            <label class="form-label" for="tx-name">YOUR IDENTITY / NAME</label>
            <input type="text" id="tx-name" class="form-input" placeholder="e.g. Elena Rostova" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="tx-email">COMMUNICATION FREQUENCY (EMAIL)</label>
            <input type="email" id="tx-email" class="form-input" placeholder="elena@domain.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="tx-msg">TRANSMISSION PACKET (MESSAGE)</label>
            <textarea id="tx-msg" class="form-textarea" placeholder="Discussing a Machine Learning project, data role, or collaboration..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            <span>Dispatch Message Packet</span>
          </button>
          <div id="tx-feedback-msg" style="margin-top: 0.75rem; font-family: var(--font-mono); font-size: 0.78rem;"></div>
        </form>

        <div class="direct-channels-box">
          <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary);">Direct Channels</h4>
          
          <a href="${p.social.github}" target="_blank" rel="noopener noreferrer" class="direct-channel-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <div>
              <div class="channel-label">GITHUB</div>
              <div class="channel-val">${p.social.github}</div>
            </div>
          </a>

          <a href="${p.social.linkedin}" target="_blank" rel="noopener noreferrer" class="direct-channel-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <div>
              <div class="channel-label">LINKEDIN</div>
              <div class="channel-val">Aarav Shah Profile</div>
            </div>
          </a>

          <a href="mailto:${p.social.email}" class="direct-channel-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <div>
              <div class="channel-label">EMAIL</div>
              <div class="channel-val">${p.social.email}</div>
            </div>
          </a>
        </div>
      </div>
    `;
  }

  function bindTransmitEvents() {
    const form = document.getElementById("key-contact-form");
    const feedback = document.getElementById("tx-feedback-msg");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      soundEngine.playNodeClick();
      if (feedback) {
        feedback.textContent = "SIGNAL TRANSMITTED: Message packet securely dispatched to Aarav!";
        feedback.style.color = "var(--emerald-accent)";
      }
      form.reset();
    });
  }

  // TEMPLATE: S2 // TERMINAL
  function renderTerminalTemplate() {
    return `
      <div class="terminal-card-wrap">
        <div class="term-titlebar">
          <div class="term-dots"><span></span><span></span><span></span></div>
          <span class="mono text-xs text-muted">aarav@orb-web: ~ (bash)</span>
          <span class="mono text-xs text-cyan">STATUS: ONLINE</span>
        </div>
        <div class="term-output-body" id="card-term-body"></div>
        <div class="term-input-row">
          <span class="term-prompt">&gt;</span>
          <input type="text" id="card-term-input" class="term-input-field" placeholder="Type 'help', 'whoami', 'projects', 'skills'..." autocomplete="off" spellcheck="false">
        </div>
      </div>
    `;
  }

  function initTerminalInCard() {
    const termBody = document.getElementById("card-term-body");
    const termInput = document.getElementById("card-term-input");
    if (!termBody || !termInput) return;

    const p = PortfolioData.personal;
    termBody.innerHTML = `
      <div style="color: var(--text-muted); margin-bottom: 0.5rem;">AaravOS Spider Shell v3.1 [Type 'help' for available commands]</div>
    `;

    const commands = {
      help: () => [
        "AVAILABLE SYSTEM COMMANDS:",
        "  whoami       - Print developer profile & NMIMS status",
        "  projects     - Output all repository junctions (IPL, T-Test, JobTrack, ISP...)",
        "  skills       - Print Data Science & programming capabilities",
        "  contact      - Display GitHub & LinkedIn URLs",
        "  clear        - Clear terminal window"
      ],
      whoami: () => [
        `OPERATOR: ${p.name} (${p.handle})`,
        `TITLE: ${p.title}`,
        `INSTITUTION: ${p.education}`,
        `LOCATION: ${p.location}`,
        `STATUS: ${p.status}`
      ],
      projects: () => {
        const out = ["REPOSITORY JUNCTIONS:"];
        junctions.filter(j => j.type === "project").forEach((proj, idx) => {
          out.push(`  [R${idx+1}] ${proj.title} -> ${proj.repoName}`);
        });
        return out;
      },
      skills: () => [
        "DATA SCIENCE & CORE CAPABILITIES:",
        "  Python, Scikit-Learn, Pandas, NumPy, Jupyter",
        "  Statistical Analysis (2-Sample T-Tests, Hypothesis Testing)",
        "  Image & Signal Processing (ISP, OpenCV)",
        "  TypeScript, Full-Stack Web Development, Model Deployments"
      ],
      contact: () => [
        `GitHub:   ${p.social.github}`,
        `LinkedIn: ${p.social.linkedin}`,
        `Email:    ${p.social.email}`
      ],
      clear: () => {
        termBody.innerHTML = "";
        return null;
      }
    };

    termInput.addEventListener("keydown", (e) => {
      soundEngine.playTerminalKey();
      if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = "";
        if (!cmd) return;

        const cmdLine = document.createElement("div");
        cmdLine.style.color = "var(--cyan-glow)";
        cmdLine.textContent = `operator@orb-web:~$ ${cmd}`;
        termBody.appendChild(cmdLine);

        if (commands[cmd]) {
          const res = commands[cmd]();
          if (Array.isArray(res)) {
            res.forEach(line => {
              const div = document.createElement("div");
              div.style.color = "#f1f5f9";
              div.textContent = line;
              termBody.appendChild(div);
            });
          }
        } else {
          const errDiv = document.createElement("div");
          errDiv.style.color = "#f87171";
          errDiv.textContent = `bash: command not found: "${cmd}". Type 'help'.`;
          termBody.appendChild(errDiv);
        }

        termBody.scrollTop = termBody.scrollHeight;
      }
    });

    termInput.focus();
  }

  // ==========================================================================
  // FLOATING CYBER TOAST UTILITY
  // ==========================================================================
  const cyberToast = document.getElementById("cyber-toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimer = null;

  function showCyberToast(msg) {
    if (!cyberToast || !toastMessage) return;
    toastMessage.textContent = msg;
    cyberToast.classList.add("active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cyberToast.classList.remove("active");
    }, 2400);
  }
  window.showCyberToast = showCyberToast;

  // ==========================================================================
  // 1. EXECUTIVE COMMAND DOCK: DOMAIN FILTERS
  // ==========================================================================
  const filterPills = document.querySelectorAll(".dock-filter-pill");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      soundEngine.playNodeHover();
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const category = pill.getAttribute("data-filter") || "all";
      spiderWeb.setCategoryFilter(category);
    });
  });

  // ==========================================================================
  // 2. AMBIENT CELESTIAL SOUNDSCAPE TOGGLE
  // ==========================================================================
  const dockAudioBtn = document.getElementById("dock-audio-btn");
  const dockAudioLbl = document.getElementById("dock-audio-label");

  function handleAudioToggle() {
    const isPlaying = soundEngine.toggleAmbient();
    if (dockAudioBtn) {
      dockAudioBtn.classList.toggle("active", isPlaying);
    }
    if (dockAudioLbl) {
      dockAudioLbl.textContent = isPlaying ? "AUDIO: 432Hz ON" : "AUDIO: OFF";
    }
    showCyberToast(isPlaying ? "CELESTIAL SOUNDSCAPE: ACTIVE" : "AUDIO: MUTED");
  }

  if (dockAudioBtn) {
    dockAudioBtn.addEventListener("click", handleAudioToggle);
  }
  window.addEventListener("toggle-audio", handleAudioToggle);

  // ==========================================================================
  // 3. EXECUTIVE DOSSIER / CANDIDATE BRIEF
  // ==========================================================================
  const dossierOverlay = document.getElementById("dossier-overlay");
  const dossierCloseBtn = document.getElementById("dossier-close-btn");
  const dossierBackdrop = document.getElementById("dossier-backdrop");
  const btnExecutiveDossier = document.getElementById("btn-executive-dossier");
  const dossierCopyEmailBtn = document.getElementById("dossier-copy-email-btn");

  function openDossier() {
    if (!dossierOverlay) return;
    soundEngine.playNodeClick();
    document.body.classList.add("card-open");
    const reticle = document.getElementById("cyber-reticle");
    if (reticle) {
      reticle.classList.remove("is-locked");
      reticle.style.opacity = "0";
      reticle.style.visibility = "hidden";
      reticle.style.display = "none";
    }
    dossierOverlay.classList.add("active");
  }

  function closeDossier() {
    if (!dossierOverlay) return;
    soundEngine.playNodeClick();
    document.body.classList.remove("card-open");
    const reticle = document.getElementById("cyber-reticle");
    if (reticle) {
      reticle.style.display = "";
      reticle.style.visibility = "";
    }
    dossierOverlay.classList.remove("active");
  }

  function toggleDossier() {
    if (!dossierOverlay) return;
    if (dossierOverlay.classList.contains("active")) {
      closeDossier();
    } else {
      openDossier();
    }
  }

  if (btnExecutiveDossier) btnExecutiveDossier.addEventListener("click", toggleDossier);
  if (dossierCloseBtn) dossierCloseBtn.addEventListener("click", closeDossier);
  if (dossierBackdrop) dossierBackdrop.addEventListener("click", closeDossier);
  window.addEventListener("toggle-executive-dossier", toggleDossier);

  if (dossierCopyEmailBtn) {
    dossierCopyEmailBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      navigator.clipboard.writeText("shahaarav602@gmail.com").then(() => {
        showCyberToast("EMAIL COPIED: shahaarav602@gmail.com");
      }).catch(() => {});
    });
  }

  // Jump buttons inside dossier table
  document.querySelectorAll(".dp-jump-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (targetId) {
        closeDossier();
        spiderWeb.selectJunction(targetId);
        openKeyCard(targetId);
      }
    });
  });

  // LINKEDIN & ABOUT DIRECT ACCESS
  const btnLinkedInPosts = document.getElementById("btn-linkedin-posts");

  function openLinkedInAndAbout() {
    closeDossier();
    spiderWeb.selectJunction("nexus");
    openKeyCard("nexus");
    setTimeout(() => {
      const liTab = dynamicBody ? dynamicBody.querySelector('.nexus-tab-btn[data-tab="linkedin"]') : null;
      if (liTab) {
        liTab.click();
      }
    }, 60);
  }

  if (btnLinkedInPosts) btnLinkedInPosts.addEventListener("click", openLinkedInAndAbout);
  window.addEventListener("toggle-linkedin-hub", openLinkedInAndAbout);

  // ==========================================================================
  // 4. CINEMATIC EXECUTIVE REEL CONTROLLER
  // ==========================================================================
  const reelHud = document.getElementById("executive-reel-hud");
  const btnExecutiveReel = document.getElementById("btn-executive-reel");
  const reelStepText = document.getElementById("reel-step-text");
  const reelHubTitle = document.getElementById("reel-hub-title");
  const reelHubDesc = document.getElementById("reel-hub-desc");
  const reelTimerFill = document.getElementById("reel-timer-fill");
  const reelPauseBtn = document.getElementById("reel-pause-btn");
  const reelPauseIcon = document.getElementById("reel-pause-icon");
  const reelNextBtn = document.getElementById("reel-next-btn");
  const reelExitBtn = document.getElementById("reel-exit-btn");
  const reelInspectBtn = document.getElementById("reel-inspect-btn");

  const reelStops = [
    {
      id: "nexus",
      title: "01 // AARAV SHAH &bull; NEXUS CORE",
      desc: "Data Science & Full-Stack Architect from NMIMS MPSTME engineering reproducible machine learning, privacy architectures, and high-performance production systems."
    },
    {
      id: "repo-changeformer",
      title: "02 // CHANGEFORMER SATELLITE EO AI",
      desc: "Smart India Hackathon: Hierarchical vision transformer with Siamese difference modules for bitemporal satellite imagery, achieving 97.8% peak change detection accuracy."
    },
    {
      id: "repo-mnist",
      title: "03 // MNIST FEDERATED PRIVACY CIPHER",
      desc: "Decentralized privacy-preserving neural training leveraging Flower (flwr) & PyTorch across 25 FedAvg communication rounds with non-IID partitions and encrypted aggregation."
    },
    {
      id: "repo-startupval",
      title: "04 // STOCHASTIC STARTUP VALUATION",
      desc: "Galton-Watson branching process simulation running 10,000 Monte Carlo paths for early-stage startup valuation, customer retention, and churn uncertainty."
    },
    {
      id: "repo-promptgen",
      title: "05 // KARPATHY 3-LAYER PROMPT ARCHITECT",
      desc: "Systematic prompt engineering framework (Spec, Verifier, Environment) with automated prompt.md synthesis and multi-LLM benchmark evaluation matrix."
    }
  ];

  let reelActive = false;
  let reelCurrentIdx = 0;
  let reelPaused = false;
  let reelTimerStart = 0;
  const REEL_DURATION = 8000;
  let reelRaf = null;

  function startExecutiveReel() {
    if (reelActive) return;

    // If still on landing page, trigger entrance warp seamlessly
    const landing = document.getElementById("landing-page");
    if (landing && !landing.classList.contains("hidden")) {
      const enterBtn = document.getElementById("landing-enter-btn");
      if (enterBtn) enterBtn.click();
    }

    reelActive = true;
    reelPaused = false;
    reelCurrentIdx = 0;
    if (reelHud) reelHud.classList.add("active");
    if (btnExecutiveReel) btnExecutiveReel.classList.add("active");
    closeKeyCard();
    closeDossier();
    presentReelStop(0);
  }

  function stopExecutiveReel() {
    if (!reelActive) return;
    reelActive = false;
    cancelAnimationFrame(reelRaf);
    if (reelHud) reelHud.classList.remove("active");
    if (btnExecutiveReel) btnExecutiveReel.classList.remove("active");
    if (reelTimerFill) reelTimerFill.style.width = "0%";
  }

  function toggleExecutiveReel() {
    if (reelActive) {
      stopExecutiveReel();
    } else {
      startExecutiveReel();
    }
  }

  function presentReelStop(idx) {
    reelCurrentIdx = idx % reelStops.length;
    const stop = reelStops[reelCurrentIdx];

    if (reelStepText) reelStepText.textContent = `FLAGSHIP 0${reelCurrentIdx + 1} / 0${reelStops.length}`;
    if (reelHubTitle) reelHubTitle.innerHTML = stop.title;
    if (reelHubDesc) reelHubDesc.textContent = stop.desc;

    spiderWeb.selectJunction(stop.id);
    if (soundEngine && typeof soundEngine.playExecutiveChime === "function") {
      soundEngine.playExecutiveChime();
    }

    reelTimerStart = performance.now();
    cancelAnimationFrame(reelRaf);
    reelTick();
  }

  function reelTick() {
    if (!reelActive) return;

    if (!reelPaused) {
      const elapsed = performance.now() - reelTimerStart;
      const progress = Math.min(elapsed / REEL_DURATION, 1.0);
      if (reelTimerFill) reelTimerFill.style.width = `${progress * 100}%`;

      if (progress >= 1.0) {
        presentReelStop((reelCurrentIdx + 1) % reelStops.length);
        return;
      }
    }

    reelRaf = requestAnimationFrame(reelTick);
  }

  if (btnExecutiveReel) btnExecutiveReel.addEventListener("click", toggleExecutiveReel);
  if (reelExitBtn) reelExitBtn.addEventListener("click", stopExecutiveReel);
  window.addEventListener("toggle-executive-reel", toggleExecutiveReel);

  if (reelPauseBtn) {
    reelPauseBtn.addEventListener("click", () => {
      reelPaused = !reelPaused;
      if (reelPauseIcon) {
        reelPauseIcon.innerHTML = reelPaused
          ? '<polygon points="5 3 19 12 5 21 5 3"/>'
          : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      }
    });
  }

  if (reelNextBtn) {
    reelNextBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      presentReelStop((reelCurrentIdx + 1) % reelStops.length);
    });
  }

  if (reelInspectBtn) {
    reelInspectBtn.addEventListener("click", () => {
      soundEngine.playNodeClick();
      const stop = reelStops[reelCurrentIdx];
      stopExecutiveReel();
      openKeyCard(stop.id);
    });
  }

  // Deep Link Hash Routing
  if (window.location.hash) {
    const hashId = window.location.hash.replace("#", "");
    const matchingJunc = junctions.find(j => j.id === hashId);
    if (matchingJunc) {
      setTimeout(() => {
        spiderWeb.selectJunction(matchingJunc.id);
      }, 1200);
    }
  }
});
