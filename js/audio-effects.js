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

      // 1. Sub-bass boom & sweep
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.1);

      // 2. High-speed rising particle acceleration tone
      const riseOsc = ctx.createOscillator();
      const riseFilter = ctx.createBiquadFilter();
      const riseGain = ctx.createGain();

      riseOsc.type = "sawtooth";
      riseOsc.frequency.setValueAtTime(220, now);
      riseOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.7);

      riseFilter.type = "lowpass";
      riseFilter.frequency.setValueAtTime(400, now);
      riseFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.65);
      riseFilter.Q.setValueAtTime(4, now);

      riseGain.gain.setValueAtTime(0.01, now);
      riseGain.gain.linearRampToValueAtTime(0.06, now + 0.5);
      riseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      riseOsc.connect(riseFilter);
      riseFilter.connect(riseGain);
      riseGain.connect(ctx.destination);
      riseOsc.start(now);
      riseOsc.stop(now + 0.85);

      // 3. Dimensional warp chime resolution
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(880, now + 0.6);
      chimeOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.9);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.setValueAtTime(0.04, now + 0.6);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.6);
      chimeOsc.stop(now + 1.3);
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

