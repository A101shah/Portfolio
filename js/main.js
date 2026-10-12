/**
 * Main Application Orchestrator
 * Connects the Multi-Junction Spider Web Tapestry to dedicated Project & Section Key Cards.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Sound Engine & Spider Web Tapestry
  const soundEngine = new SoundEngine();
  const spiderWeb = new SpiderWeb("spider-web-canvas");
  spiderWeb.setSoundEngine(soundEngine);

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

    // Open Overlay
    overlay.classList.add("active");
  }

  // 5. Close Key Card -> Return to "Spider Web Only"
  function closeKeyCard() {
    soundEngine.playNodeClick();
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
    } else if (junc.id === "nexus") {
      dynamicBody.innerHTML = renderNexusTemplate();
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
    }
  }

  // TEMPLATE: Dedicated Project Repository Key Card
  function renderProjectTemplate(proj) {
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

        <!-- Action Links -->
        <div class="nexus-cta-row">
          <a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Explore on GitHub
          </a>
          <a href="${proj.links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span>View Source / Details</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  // TEMPLATE: 00 // NEXUS
  function renderNexusTemplate() {
    const p = PortfolioData.personal;
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
        "  whoami     - Print developer profile & NMIMS status",
        "  projects   - Output all repository junctions (IPL, T-Test, JobTrack, ISP...)",
        "  skills     - Print Data Science & programming capabilities",
        "  contact    - Display GitHub & LinkedIn URLs",
        "  clear      - Clear terminal window"
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
});
