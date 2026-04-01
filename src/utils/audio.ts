export class DroneAudio {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  public init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();

    // Create a smooth, relaxing sci-fi reactor hum (audible on laptops)
    this.oscillator.type = 'triangle';
    this.oscillator.frequency.value = 150; // Smooth midrange frequency

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    
    this.gainNode.gain.value = 0; // Start muted
    this.oscillator.start();
  }

  public play() {
    if (!this.ctx || this.isPlaying) return;
    this.ctx.resume();
    // Fade in softly over 3 seconds
    this.gainNode?.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3);
    this.isPlaying = true;
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.gainNode?.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
    this.isPlaying = false;
  }
  
  public setIntensity(normalizedValue: number) {
    if (!this.ctx || !this.isPlaying || !this.gainNode || !this.oscillator) return;
    // Base frequency 150, up to 300 based on intensity
    this.oscillator.frequency.setTargetAtTime(150 + normalizedValue * 150, this.ctx.currentTime, 0.1);
    this.gainNode.gain.setTargetAtTime(0.1 + normalizedValue * 0.4, this.ctx.currentTime, 0.1);
  }

  public setMuted(muted: boolean) {
    if (!this.ctx || !this.gainNode) return;
    if (muted) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    } else if (this.isPlaying) {
      this.gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.5);
    }
  }

  public dispose() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.isPlaying = false;
  }
}

export const droneAudio = new DroneAudio();
