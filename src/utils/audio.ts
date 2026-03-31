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

    // Create a low hum (drone sound)
    this.oscillator.type = 'sawtooth';
    this.oscillator.frequency.value = 50; // Low frequency

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    
    this.gainNode.gain.value = 0; // Start muted
    this.oscillator.start();
  }

  public play() {
    if (!this.ctx || this.isPlaying) return;
    this.ctx.resume();
    // Fade in over 3 seconds
    this.gainNode?.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3);
    this.isPlaying = true;
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.gainNode?.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
    this.isPlaying = false;
  }
  
  public setIntensity(normalizedValue: number) {
    if (!this.ctx || !this.isPlaying || !this.gainNode || !this.oscillator) return;
    // Base frequency 50, up to 150 based on intensity
    this.oscillator.frequency.setTargetAtTime(50 + normalizedValue * 100, this.ctx.currentTime, 0.1);
    this.gainNode.gain.setTargetAtTime(0.1 + normalizedValue * 0.4, this.ctx.currentTime, 0.1);
  }
}

export const droneAudio = new DroneAudio();
