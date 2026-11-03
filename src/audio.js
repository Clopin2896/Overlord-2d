export class Audio {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  start() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.13;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }
  tone(freq, duration, type = "triangle", volume = 0.3, end = freq) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime,
      o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + duration);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(t + duration);
  }
  play(name) {
    switch (name) {
      case "sword":
        this.tone(360, 0.12, "sawtooth", 0.25, 70);
        break;
      case "hit":
        this.tone(140, 0.16, "square", 0.4, 35);
        break;
      case "block":
        this.tone(840, 0.2, "triangle", 0.7, 280);
        break;
      case "jump":
        this.tone(130, 0.15, "triangle", 0.3, 290);
        break;
      case "send":
        this.tone(420, 0.12, "square", 0.18, 620);
        break;
      case "recall":
        this.tone(660, 0.2, "sine", 0.8, 350);
        break;
      case "warn":
        this.tone(100, 0.8, "sawtooth", 0.4, 60);
        break;
      case "smash":
        this.tone(75, 0.45, "sawtooth", 0.9, 23);
        break;
      case "death":
        this.tone(260, 0.5, "triangle", 0.5, 40);
        break;
      case "win":
        this.tone(262, 1.5, "triangle", 0.3);
        this.tone(330, 1.7, "triangle", 0.3);
        this.tone(392, 2, "triangle", 0.3);
        break;
    }
  }
}
