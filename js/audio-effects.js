/**
 * Audio Effects Engine
 * Procedural Web Audio API sound generator for futuristic UI feedback.
 * No external sound files required! Fully synthesized micro-sounds.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = true; // Muted by default to respect browser autoplay policies and user preference
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  toggleMute() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playNodeClick(); // confirmation chime
    }
    return !this.isMuted;
  }

  playNodeHover() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(580, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  playNodeClick() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12);

      osc2.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.14);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.audioCtx.currentTime + 0.14);
      osc2.stop(this.audioCtx.currentTime + 0.14);
    } catch (e) {}
  }

  playTerminalKey() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "square";
      const freq = 600 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.03);
    } catch (e) {}
  }

  playGlitchChirp() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playWarpJump() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    if (this.isMuted || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 1. Initial Silk Thread Elastic Pluck (0.0s - 0.25s)
      const pluckOsc = ctx.createOscillator();
      const pluckGain = ctx.createGain();
      pluckOsc.type = "triangle";
      pluckOsc.frequency.setValueAtTime(360, now);
      pluckOsc.frequency.exponentialRampToValueAtTime(70, now + 0.22);
      pluckGain.gain.setValueAtTime(0.08, now);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      pluckOsc.connect(pluckGain);
      pluckGain.connect(ctx.destination);
      pluckOsc.start(now);
      pluckOsc.stop(now + 0.22);

      // 2. Warm Sub-Bass Anchor Pulse (0.0s - 0.8s)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.7);
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.75);

      // 3. Crystalline Silk Weave Arpeggio (0.2s - 1.4s) — Spinning the Capture Spirals
      const arpeggioFreqs = [392.0, 493.88, 587.33, 739.99, 880.0, 1174.66]; // G-maj9 ascending weave
      arpeggioFreqs.forEach((freq, idx) => {
        const arpOsc = ctx.createOscillator();
        const arpGain = ctx.createGain();
        const startTime = now + 0.2 + idx * 0.16;

        arpOsc.type = "sine";
        arpOsc.frequency.setValueAtTime(freq, startTime);
        arpOsc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.35);

        arpGain.gain.setValueAtTime(0.0001, now);
        arpGain.gain.setValueAtTime(0.035 / (1 + idx * 0.15), startTime);
        arpGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        arpOsc.connect(arpGain);
        arpGain.connect(ctx.destination);
        arpOsc.start(startTime);
        arpOsc.stop(startTime + 0.45);
      });

      // 4. Soft Silk Flutter Whisper (Filtered gentle breath, 0.4s - 1.6s)
      try {
        const bufferSize = ctx.sampleRate * 1.2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(450, now + 0.3);
        noiseFilter.frequency.linearRampToValueAtTime(1200, now + 1.1);
        noiseFilter.frequency.linearRampToValueAtTime(300, now + 1.5);
        noiseFilter.Q.setValueAtTime(3.0, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.setValueAtTime(0.02, now + 0.3);
        noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.9);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start(now + 0.3);
        whiteNoise.stop(now + 1.6);
      } catch (ne) {}

      // 5. Harmonic Nexus Emergence Chime (1.4s - 2.5s) — Harmonious synchronization
      const chordFreqs = [587.33, 739.99, 880.0, 1174.66]; // D-maj9 luminous arrival chord
      chordFreqs.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        const startTime = now + 1.4 + idx * 0.05;

        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(freq, startTime);
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.setValueAtTime(0.04 / (idx + 1), startTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.1);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(startTime);
        chimeOsc.stop(startTime + 1.1);
      });
    } catch (e) {
      console.warn("Silk weave sound error", e);
    }
  }

  playBootChirp() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  playShockwaveSound() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }
}

if (typeof window !== "undefined") {
  window.SoundEngine = SoundEngine;
}

