// src/lib/audio.ts

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmGain: GainNode | null = null;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBGM() {
    this.init();
    if (typeof window === 'undefined') return;
    if (this.bgmAudio) return; // Already playing

    this.bgmAudio = new Audio('/audio/joyful_bgm.webm');
    this.bgmAudio.loop = true;
    this.bgmAudio.crossOrigin = 'anonymous';

    try {
      const source = this.ctx!.createMediaElementSource(this.bgmAudio);
      this.bgmGain = this.ctx!.createGain();
      this.bgmGain.gain.value = 0;
      source.connect(this.bgmGain);
      this.bgmGain.connect(this.ctx!.destination);
    } catch (e) {
      console.warn('Failed to connect BGM to Web Audio API', e);
    }
    
    this.bgmAudio.play().then(() => {
      // Fade in smoothly
      if (this.bgmGain) {
        this.bgmGain.gain.linearRampToValueAtTime(0.15, this.ctx!.currentTime + 2);
      } else if (this.bgmAudio) {
        // Fallback
        this.bgmAudio.volume = 0.15;
      }
    }).catch(e => console.warn('BGM autoplay blocked by browser:', e));
  }

  stopBGM() {
    if (this.bgmAudio) {
      if (this.bgmGain) {
        this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx!.currentTime + 1);
        setTimeout(() => {
          if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
            this.bgmGain = null;
          }
        }, 1000);
      } else {
        this.bgmAudio.pause();
        this.bgmAudio = null;
      }
    }
  }

  dimBGM() {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(0.03, this.ctx.currentTime, 0.5);
    } else if (this.bgmAudio) {
      this.bgmAudio.volume = 0.03;
    }
  }

  restoreBGM() {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(0.15, this.ctx.currentTime, 1.0);
    } else if (this.bgmAudio) {
      this.bgmAudio.volume = 0.15;
    }
  }

  playPaper() {
    this.init();
    if (!this.ctx) return;
    
    // Lo-Fi warm paper slide / vinyl crackle texture
    const bufferSize = this.ctx.sampleRate * 0.3; // 300ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Create a warm, gritty noise profile
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.9 ? 0.8 : 0.2);
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Heavy lowpass for that muffled lo-fi tape warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; 
    filter.Q.value = 0.5;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  playSwoosh() {
    this.init();
    if (!this.ctx) return;
    
    // Lo-Fi chillhop transition (warm, filtered noise sweep)
    const bufferSize = this.ctx.sampleRate * 0.6; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Sweep the frequency down like a tape slow-down
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    filter.Q.value = 0.8;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.1); 
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  playMagic() {
    this.init();
    if (!this.ctx) return;
    
    // Lush Lo-Fi Chillhop Chord (Eb Major 9) instead of traditional chimes
    // Notes: Eb4, G4, Bb4, D5, F5
    const freqs = [311.13, 392.00, 466.16, 587.33, 698.46]; 
    const now = this.ctx.currentTime;
    
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      // Sine wave with slight detune for analog warmth
      osc.type = 'sine';
      osc.frequency.value = f + (Math.random() * 2 - 1); // slight tape flutter effect
      
      // Soft, Rhodes-like envelope
      gain.gain.setValueAtTime(0, now);
      // Strum the chord slightly by delaying each note
      const start = now + i * 0.04; 
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.1); // soft attack
      gain.gain.exponentialRampToValueAtTime(0.001, start + 2.5); // long lush release
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(start);
      osc.stop(start + 3.0);
    });
  }
}

export const audioEngine = new AudioEngine();
