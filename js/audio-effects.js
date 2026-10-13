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

      // 1. Phase 1: Gravitational Sub-Bass Implosion & Resonance (0.0s - 0.8s)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.75);
      subOsc.frequency.linearRampToValueAtTime(50, now + 1.8);

      subGain.gain.setValueAtTime(0.18, now);
      subGain.gain.linearRampToValueAtTime(0.32, now + 0.6);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 2.0);

      // 2. Phase 2: Dual-Sawtooth Hyperspace Accelerator & Turbine Rise (0.65s - 2.0s)
      const riseOsc1 = ctx.createOscillator();
      const riseOsc2 = ctx.createOscillator();
      const riseFilter = ctx.createBiquadFilter();
      const riseGain = ctx.createGain();

      riseOsc1.type = "sawtooth";
      riseOsc2.type = "sawtooth";
      riseOsc1.frequency.setValueAtTime(140, now + 0.6);
      riseOsc1.frequency.exponentialRampToValueAtTime(2400, now + 1.95);
      riseOsc2.frequency.setValueAtTime(143, now + 0.6); // Detuned for chorus
      riseOsc2.frequency.exponentialRampToValueAtTime(2415, now + 1.95);

      riseFilter.type = "bandpass";
      riseFilter.frequency.setValueAtTime(280, now + 0.6);
      riseFilter.frequency.exponentialRampToValueAtTime(4800, now + 1.9);
      riseFilter.Q.setValueAtTime(6.0, now);

      riseGain.gain.setValueAtTime(0.0001, now);
      riseGain.gain.setValueAtTime(0.02, now + 0.6);
      riseGain.gain.linearRampToValueAtTime(0.11, now + 1.6);
      riseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      riseOsc1.connect(riseFilter);
      riseOsc2.connect(riseFilter);
      riseFilter.connect(riseGain);
      riseGain.connect(ctx.destination);
      riseOsc1.start(now + 0.6);
      riseOsc2.start(now + 0.6);
      riseOsc1.stop(now + 2.2);
      riseOsc2.stop(now + 2.2);

      // 3. Phase 3: Hyperspace Noise Blast Whoosh (1.3s - 2.4s)
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
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(280, now + 1.2);
        noiseFilter.frequency.exponentialRampToValueAtTime(5200, now + 1.85);
        noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 2.4);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now + 1.2);
        noiseGain.gain.linearRampToValueAtTime(0.08, now + 1.8);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start(now + 1.2);
        whiteNoise.stop(now + 2.4);
      } catch (ne) {}

      // 4. Phase 4: Dimensional Triad Chime Resolution (2.1s - 3.4s)
      const chordFreqs = [587.33, 739.99, 880.0, 1174.66]; // D-maj9 luminous chord
      chordFreqs.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(freq, now + 2.1 + idx * 0.06);
        chimeOsc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 2.6);

        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.setValueAtTime(0.04 / (idx + 1), now + 2.1 + idx * 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now + 2.1 + idx * 0.06);
        chimeOsc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn("Warp sound synthesis error", e);
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

