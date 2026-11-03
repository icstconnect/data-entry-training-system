/**
 * ICST Procedural Web Audio Synthesizer for Terminal Stream Lab
 * Generates tactile mechanical clicks, damped error buzzes, and polyphonic chords
 * Zero external audio file dependencies. 100% offline-ready.
 */
export class TerminalSoundEngine {
  private static instance: TerminalSoundEngine | null = null;
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private constructor() {
    // Lazily initialized on first user interaction to comply with browser audio policies
  }

  public static getInstance(): TerminalSoundEngine {
    if (!TerminalSoundEngine.instance) {
      TerminalSoundEngine.instance = new TerminalSoundEngine();
    }
    return TerminalSoundEngine.instance;
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Crisp tactile mechanical key switch click vs muted error buzz
   */
  public playKeyClick(isCorrect: boolean = true): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    if (isCorrect) {
      // High transient snap (mechanical switch bottom-out)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      const jitter = (Math.random() - 0.5) * 60;
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1400 + jitter, now);
      snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1800, now);
      snapFilter.Q.setValueAtTime(2.5, now);

      snapGain.gain.setValueAtTime(0.09, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      snapOsc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.masterGain);

      snapOsc.start(now);
      snapOsc.stop(now + 0.02);

      // Low tactile switch body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(420 + jitter * 0.2, now);
      bodyGain.gain.setValueAtTime(0.04, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.028);
    } else {
      // Soft muted low buzz (non-jarring tactile discrepancy feedback)
      const buzzOsc = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      const buzzFilter = ctx.createBiquadFilter();

      buzzOsc.type = 'sawtooth';
      buzzOsc.frequency.setValueAtTime(130, now);
      buzzOsc.frequency.exponentialRampToValueAtTime(95, now + 0.065);

      buzzFilter.type = 'lowpass';
      buzzFilter.frequency.setValueAtTime(320, now);

      buzzGain.gain.setValueAtTime(0.12, now);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      buzzOsc.connect(buzzFilter);
      buzzFilter.connect(buzzGain);
      buzzGain.connect(this.masterGain);

      buzzOsc.start(now);
      buzzOsc.stop(now + 0.075);
    }
  }

  /**
   * Harmonically escalating synth chords for combo milestones
   */
  public playStreakChime(comboTier: number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    
    // Chord frequencies per tier
    const chords: Record<number, number[]> = {
      1: [523.25, 659.25],               // C5 + E5 (Tier 1: 10 streak)
      2: [659.25, 783.99, 987.77],       // E5 + G5 + B5 (Tier 2: 25 streak)
      3: [783.99, 1046.50, 1318.51],     // G5 + C6 + E6 (Tier 3: 50 streak)
      4: [1046.50, 1318.51, 1567.98, 2093.00] // C6 + E6 + G6 + C7 (Tier 4: 100 streak shimmer)
    };

    const notes = chords[comboTier] || chords[1];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = comboTier >= 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      const noteDuration = 0.28 + idx * 0.06;
      gain.gain.setValueAtTime(0.08 / notes.length, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + noteDuration);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + noteDuration);
    });
  }

  /**
   * Positive double chime when voucher dispatch is verified
   */
  public playVoucherAccepted(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const notes = [587.33, 880.00]; // D5 -> A5 ascending verification chime

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.24);
    });
  }

  /**
   * Discrepancy flag alert tone
   */
  public playTrapAlert(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Grandmaster batch completion fanfare
   */
  public playBatchComplete(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major arpeggio

    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const dur = idx === fanfareNotes.length - 1 ? 0.6 : 0.25;
      gain.gain.setValueAtTime(0.1, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + dur);
    });
  }
}

export const terminalSound = TerminalSoundEngine.getInstance();

