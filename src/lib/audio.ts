// src/lib/audio.ts

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;

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

    this.bgmAudio = new Audio('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a4/79/2a/a4792a98-00e4-92bb-07e2-238cdfc76ab5/mzaf_14015335601883409579.plus.aac.p.m4a');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0;
    
    this.bgmAudio.play().then(() => {
      // Fade in smoothly
      let vol = 0;
      const fade = setInterval(() => {
        vol += 0.02;
        if (vol >= 0.4) {
          clearInterval(fade);
        } else if (this.bgmAudio) {
          this.bgmAudio.volume = vol;
        }
      }, 100);
    }).catch(e => console.warn('BGM autoplay blocked by browser:', e));
  }

  stopBGM() {
    if (this.bgmAudio) {
      let vol = this.bgmAudio.volume;
      const fade = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0 || !this.bgmAudio) {
          clearInterval(fade);
          if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
          }
        } else {
          this.bgmAudio.volume = vol;
        }
      }, 100);
    }
  }

  dimBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = 0.05; // Fade down for voice notes
    }
  }

  restoreBGM() {
    if (this.bgmAudio && this.bgmAudio.volume < 0.4) {
      this.bgmAudio.volume = 0.4;
    }
  }

  playPaper() {
    this.init();
    if (!this.ctx) return;
    
    // Soft, premium paper rustle
    const bufferSize = this.ctx.sampleRate * 0.15; // 150ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5; // Softer noise
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800; // Even more muffled
    filter.Q.value = 0.3;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Very subtle
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  playSwoosh() {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle'; // Softer than sine for swooshes
    
    const gain = this.ctx.createGain();
    
    // Very light, airy sweep
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.05); // Barely audible
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playMagic() {
    this.init();
    if (!this.ctx) return;
    
    // Playful, festive pentatonic chimes (Sa, Re, Ga, Pa, Dha style)
    const freqs = [783.99, 880.00, 1046.50, 1174.66, 1318.51]; // G5, A5, C6, D6, E6
    const now = this.ctx.currentTime;
    
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = f;
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.03, now + i * 0.08 + 0.02); // Extremely subtle volume
      gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  }
}

export const audioEngine = new AudioEngine();
