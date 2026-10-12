// Web Audio API Synthesizer for authentic Windows OS micro-interactions
// Zero external dependencies, crystal clear, works completely offline

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(type: 'drop' | 'copy' | 'paste' | 'delete' | 'success' | 'click' | 'error') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Note frequency map (Hz)
      const notes: Record<string, number> = {
        G2: 98.00,
        C3: 130.81,
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        G4: 392.00,
        C5: 523.25,
        E5: 659.25,
        G5: 783.99,
        C6: 1046.50
      };

      if (type === 'click') {
        this.playBeep(notes.D4, now, 0.04, 'sine', 0.08);
      } else if (type === 'copy') {
        this.playBeep(notes.E5, now, 0.08, 'sine', 0.12);
      } else if (type === 'drop') {
        this.playBeep(notes.C4, now, 0.06, 'sine', 0.12);
        this.playBeep(notes.G4, now + 0.05, 0.08, 'sine', 0.12);
      } else if (type === 'paste') {
        this.playBeep(notes.G4, now, 0.06, 'triangle', 0.1);
        this.playBeep(notes.C5, now + 0.05, 0.06, 'triangle', 0.12);
        this.playBeep(notes.E5, now + 0.10, 0.10, 'triangle', 0.12);
      } else if (type === 'delete') {
        this.playBeep(notes.C3, now, 0.08, 'sawtooth', 0.1);
        this.playBeep(notes.G2, now + 0.07, 0.12, 'sawtooth', 0.09);
      } else if (type === 'success') {
        this.playBeep(notes.C5, now, 0.07, 'sine', 0.14);
        this.playBeep(notes.E5, now + 0.07, 0.07, 'sine', 0.14);
        this.playBeep(notes.G5, now + 0.14, 0.08, 'sine', 0.15);
        this.playBeep(notes.C6, now + 0.22, 0.18, 'sine', 0.16);
      } else if (type === 'error') {
        this.playBeep(180, now, 0.09, 'sawtooth', 0.12);
        this.playBeep(140, now + 0.08, 0.14, 'sawtooth', 0.12);
      }
    } catch {
      // Audio policies / autoplay restrictions silently handled
    }
  }

  private playBeep(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', maxGain: number = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const soundEffects = new SoundEffectsEngine();
