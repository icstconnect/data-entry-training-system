/**
 * Web Audio API Synthesizer for Touch Typing Lab
 * Generates tactile mechanical clicks, rhythm flow chimes, error clicks,
 * and polyphonic completion fanfares with zero external audio assets.
 * 100% offline-ready.
 */

const STORAGE_KEY_MUTED = 'icst_touch_typing_muted';

export class TouchTypingSoundEngine {
  private static instance: TouchTypingSoundEngine | null = null;
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private constructor() {
    // Read persisted mute state
    try {
      this.isMuted = localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  public static getInstance(): TouchTypingSoundEngine {
    if (!TouchTypingSoundEngine.instance) {
      TouchTypingSoundEngine.instance = new TouchTypingSoundEngine();
    }
    return TouchTypingSoundEngine.instance;
  }

  /**
   * Lazily initialize AudioContext on user interaction
   */
  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Toggle audio mute state
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(this.isMuted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(this.isMuted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  /**
   * Crisp tactile mechanical key click or soft bottom-out
   */
  public playKeyClick(isCorrect: boolean = true, isSpace: boolean = false): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    if (isCorrect) {
      // High transient snap (mechanical switch bottom-out)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      const baseFreq = isSpace ? 950 : 1450;
      const jitter = (Math.random() - 0.5) * 80;

      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(baseFreq + jitter, now);
      snapOsc.frequency.exponentialRampToValueAtTime(260, now + 0.014);

      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(isSpace ? 1200 : 1900, now);
      snapFilter.Q.setValueAtTime(2.2, now);

      snapGain.gain.setValueAtTime(isSpace ? 0.08 : 0.07, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

      snapOsc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.masterGain);

      snapOsc.start(now);
      snapOsc.stop(now + 0.018);

      // Low tactile switch body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(isSpace ? 280 : 380 + jitter * 0.2, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.024);

      bodyGain.gain.setValueAtTime(0.04, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.026);
    } else {
      this.playErrorBuzz();
    }
  }

  /**
   * Damped tactile error buzz for wrong key hit
   */
  public playErrorBuzz(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();

    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(170, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(85, now + 0.06);

    buzzFilter.type = 'lowpass';
    buzzFilter.frequency.setValueAtTime(450, now);

    buzzGain.gain.setValueAtTime(0.12, now);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(this.masterGain);

    buzzOsc.start(now);
    buzzOsc.stop(now + 0.07);
  }

  /**
   * Harmonious rhythm chime triggered on flow / streak milestones
   */
  public playRhythmChime(streakCount: number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    // Pentatonic scale frequencies [C5, D5, E5, G5, A5, C6]
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const noteIndex = Math.min(scale.length - 1, Math.floor(streakCount / 5) % scale.length);
    const freq = scale[noteIndex];

    // Primary bell tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);

    osc1.start(now);
    osc1.stop(now + 0.19);

    // Subtle overtone shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain2.gain.setValueAtTime(0.02, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc2.start(now);
    osc2.stop(now + 0.13);
  }

  /**
   * Polyphonic celebratory fanfare for passing a level
   */
  public playCompletionFanfare(stars: number = 3): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5), E6 (1318.5)
    const notes = stars >= 3
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
      : stars === 2
      ? [523.25, 659.25, 783.99, 1046.5]
      : [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const duration = idx === notes.length - 1 ? 0.6 : 0.28;
      gain.gain.setValueAtTime(0.08, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
    });
  }

  /**
   * Gentle descending tone when criteria are not met
   */
  public playLevelFail(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const notes = [392.0, 329.63]; // G4 -> E4

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.07, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }
}

// Global Singleton Instance
export const touchTypingSound = TouchTypingSoundEngine.getInstance();

// Convenience helper exports
export const playKeyClickSound = (isCorrect: boolean = true, isSpace: boolean = false): void => {
  touchTypingSound.playKeyClick(isCorrect, isSpace);
};

export const playRhythmChimeSound = (streakCount: number): void => {
  touchTypingSound.playRhythmChime(streakCount);
};

export const playErrorBuzzSound = (): void => {
  touchTypingSound.playErrorBuzz();
};

export const playCompletionFanfareSound = (stars: number = 3): void => {
  touchTypingSound.playCompletionFanfare(stars);
};

export const playLevelFailSound = (): void => {
  touchTypingSound.playLevelFail();
};

export const toggleTouchTypingMute = (): boolean => {
  return touchTypingSound.toggleMute();
};

export const isTouchTypingMuted = (): boolean => {
  return touchTypingSound.getMuted();
};
