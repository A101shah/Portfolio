/**
 * Interactive Terminal CLI
 * Provides an authentic developer command line interface for exploring the portfolio.
 */

class InteractiveTerminal {
  constructor(soundEngine) {
    this.soundEngine = soundEngine;
    this.container = document.getElementById("interactive-terminal-body");
    this.input = document.getElementById("terminal-input-cmd");
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => [
        "AVAILABLE SYSTEM COMMANDS:",
        "  whoami       - Display identity & system core bio",
        "  projects     - List major neural project nodes",
        "  skills       - Output technical skill cluster",
        "  experience   - Print career roadmap and achievements",
        "  contact      - Display communication protocols",
        "  matrix       - Trigger quantum visual cascade",
        "  sound        - Toggle audio synthesizer state",
        "  clear        - Clear terminal screen",
        "  sudo         - Run as superuser"
      ],
      whoami: () => [
        `OPERATOR: ${PortfolioData.personal.name} (${PortfolioData.personal.handle})`,
        `DESIGNATION: ${PortfolioData.personal.title}`,
        `LOCATION: ${PortfolioData.personal.location}`,
        `STATUS: ${PortfolioData.personal.status}`,
        "",
        `PHILOSOPHY: "${PortfolioData.personal.bio[0]}"`
      ],
      projects: () => {
        const lines = ["NEURAL PROJECT NODES:"];
        PortfolioData.projects.forEach((p, idx) => {
          lines.push(`  [0${idx+1}] ${p.title} (${p.category}) - ${p.badge}`);
          lines.push(`       ${p.summary.slice(0, 85)}...`);
        });
        lines.push("", "Tip: Click 'Inspect Node' on any card for full blueprints.");
        return lines;
      },
      skills: () => [
        "SYNAPSE CAPABILITY MATRIX:",
        "  Languages:   TypeScript, JavaScript, Python, Rust, SQL, HTML5/CSS3",
        "  Frontend:    React, Next.js, Canvas 2D/WebGL, Three.js, Responsive Design",
        "  Systems:     Node.js, Express, FastAPI, PostgreSQL, Redis, REST/GraphQL",
        "  DevOps/AI:   Docker, CI/CD, AWS, Vercel, LLMs, Vector Embeddings"
      ],
      experience: () => {
        const lines = ["ENGINEERING TIMELINE:"];
        PortfolioData.experience.forEach(e => {
          lines.push(`  * ${e.role} @ ${e.company} [${e.period}]`);
          lines.push(`    -> ${e.description}`);
        });
        return lines;
      },
      contact: () => [
        "TRANSMISSION CHANNELS:",
        `  Email:    ${PortfolioData.personal.social.email}`,
        `  GitHub:   ${PortfolioData.personal.social.github}`,
        `  LinkedIn: ${PortfolioData.personal.social.linkedin}`,
        `  Twitter:  ${PortfolioData.personal.social.twitter}`,
        "",
        "You can also use the transmission form directly on the right!"
      ],
      sound: () => {
        if (this.soundEngine) {
          const state = this.soundEngine.toggleMute();
          const soundToggleBtn = document.getElementById("sound-toggle-btn");
          if (soundToggleBtn) {
            soundToggleBtn.classList.toggle("active", state);
          }
          return [`Audio feedback synthesizer: ${state ? "ENABLED [Online]" : "MUTED [Offline]"}`];
        }
        return ["Audio engine not initialized."];
      },
      sudo: () => [
        "ACCESS GRANTED: User is already authorized at root privilege.",
        "System operating at optimal efficiency."
      ],
      matrix: () => {
        if (window.networkCanvasInstance) {
          window.networkCanvasInstance.triggerEnergySurge();
          window.networkCanvasInstance.triggerEnergySurge();
        }
        return [
          ">> QUANTUM SURGE TRIGGERED <<",
          "Synchronizing synaptic nodes across the cluster..."
        ];
      },
      clear: () => {
        if (this.container) this.container.innerHTML = "";
        return null;
      }
    };

    this.init();
  }

  init() {
    if (!this.input || !this.container) return;

    // Display welcome banner
    this.printLine("AaravOS Neural Shell v3.8.2 [Type 'help' for available commands]", "system-info");

    this.input.addEventListener("keydown", (e) => {
      if (this.soundEngine) this.soundEngine.playTerminalKey();

      if (e.key === "Enter") {
        const rawCmd = this.input.value.trim();
        this.input.value = "";
        if (!rawCmd) return;

        this.history.push(rawCmd);
        this.historyIndex = this.history.length;

        this.executeCommand(rawCmd);
      } else if (e.key === "ArrowUp") {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || "";
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      }
    });

    // Keep focus when clicking inside terminal frame
    const terminalFrame = document.querySelector(".terminal-window");
    if (terminalFrame) {
      terminalFrame.addEventListener("click", () => {
        this.input.focus();
      });
    }
  }

  executeCommand(rawCmd) {
    this.printLine(`operator@neural:~$ ${rawCmd}`, "user-cmd");
    const cmd = rawCmd.toLowerCase();

    if (this.commands[cmd]) {
      const output = this.commands[cmd]();
      if (Array.isArray(output)) {
        output.forEach(line => this.printLine(line, "output-line"));
      } else if (typeof output === "string") {
        this.printLine(output, "output-line");
      }
    } else {
      this.printLine(`bash: command not found: "${rawCmd}". Type 'help' for commands.`, "error-line");
    }

    // Scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;
  }

  printLine(text, className = "") {
    const div = document.createElement("div");
    div.className = `terminal-line ${className}`;
    div.textContent = text;
    this.container.appendChild(div);
  }
}

if (typeof window !== "undefined") {
  window.InteractiveTerminal = InteractiveTerminal;
}
