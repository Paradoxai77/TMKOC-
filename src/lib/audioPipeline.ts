// Audio Pipeline for TMKOC micro-interactions with Web Audio API synthesizer fallback
const AUDIO_MANIFEST = {
  CORRECT_GARBA: 'https://cdn.gokuldhamquiz.com/audio/sfx_correct_garba.mp3',
  WRONG_TRING: 'https://cdn.gokuldhamquiz.com/audio/sfx_wrong_tring.mp3',
  BALLE_BALLE: 'https://cdn.gokuldhamquiz.com/audio/sfx_streak_balle.mp3',
  TICK_TOCK: 'https://cdn.gokuldhamquiz.com/audio/sfx_timer_tick.mp3',
  ALARM_JETHER: 'https://cdn.gokuldhamquiz.com/audio/sfx_easter_alarm.mp3',
};

class AudioAssetPipeline {
  private cache: Record<string, HTMLAudioElement> = {};
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private volume = 0.6;

  constructor() {
    if (typeof window !== "undefined") {
      this.preloadAll();
    }
  }

  public preloadAll(): void {
    Object.entries(AUDIO_MANIFEST).forEach(([key, url]) => {
      try {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        audio.volume = this.volume;
        this.cache[key] = audio;
      } catch (e) {
        console.warn(`Failed to initialize audio object for ${key}:`, e);
      }
    });
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    Object.values(this.cache).forEach(audio => {
      audio.muted = muted;
    });
  }

  public setVolume(vol: number): void {
    this.volume = vol;
    Object.values(this.cache).forEach(audio => {
      audio.volume = vol;
    });
  }

  // Initialize Web Audio API context lazily on user interaction
  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  public play(effect: keyof typeof AUDIO_MANIFEST): void {
    if (this.isMuted) return;

    const sound = this.cache[effect];
    if (sound) {
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play().catch((err) => {
        // Autoplay blocked or CDN failed, use Synth fallback
        this.playSynthFallback(effect);
      });
    } else {
      this.playSynthFallback(effect);
    }
  }

  // Web Audio API Synthesizer Fallback
  private playSynthFallback(effect: keyof typeof AUDIO_MANIFEST): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Resume context if suspended
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.05);

      if (effect === "CORRECT_GARBA") {
        // Triumphant arpeggio: C4 (261.63Hz) -> E4 (329.63Hz) -> G4 (392.00Hz) -> C5 (523.25Hz)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.setValueAtTime(329.63, now + 0.1);
        osc.frequency.setValueAtTime(392.00, now + 0.2);
        osc.frequency.setValueAtTime(523.25, now + 0.3);
        
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } 
      else if (effect === "WRONG_TRING") {
        // Buzzing descending pitch
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } 
      else if (effect === "BALLE_BALLE") {
        // Happy, fast fanfare
        osc.type = "square";
        const notes = [392.00, 392.00, 523.25, 659.25, 783.99]; // G4, G4, C5, E5, G5
        const step = 0.08;
        notes.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * step);
        });
        gainNode.gain.linearRampToValueAtTime(0, now + notes.length * step + 0.1);
        osc.start(now);
        osc.stop(now + notes.length * step + 0.1);
      } 
      else if (effect === "TICK_TOCK") {
        // Wooden tick sound
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } 
      else if (effect === "ALARM_JETHER") {
        // Siren sound: fluctuating pitch
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        osc.frequency.linearRampToValueAtTime(300, now + 0.3);
        osc.frequency.linearRampToValueAtTime(600, now + 0.45);
        osc.frequency.linearRampToValueAtTime(300, now + 0.6);
        
        gainNode.gain.linearRampToValueAtTime(0, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      console.warn("Synth fallback audio failed:", e);
    }
  }
}

export const audioPipeline = new AudioAssetPipeline();
