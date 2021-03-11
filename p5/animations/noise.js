// Noise animation
let agents = [];
let agentCount = 100;
let noiseScale = 0.1;
let noiseStrength = 0.1;
let overlayAlpha = 50;
let agentAlpha = 10;
let strokeWidth = 0.3;

class Noise {
  constructor() {
    for (let i = 0; i < agentCount; i++) {
      agents[i] = new Agent();
    }
  }

  drawNoise(rms) {
    fill(255, overlayAlpha);
    rect(0, 0, windowWidth, windowHeight);

    noiseStrength = map(rms, 0, 0.1, 0, 20);
    strokeWidth = map(rms, 0, 0.1, 0.1, map(audioManager.volume, 0, 1, 1, 4));

    // Draw agents
    stroke(player.isReviving ? platformManager.platformColorInactive : platformManager.platformColorActive, agentAlpha);
    for (let i = 0; i < agentCount; i++) {
      agents[i].update1(noiseScale, noiseStrength, strokeWidth);
    }

    noStroke();
  }
}

class Agent {
  constructor() {
    this.vector = createVector(random(windowWidth), random(windowHeight));
    this.vectorOld = this.vector.copy();
    this.stepSize = random(1, 5);
    this.isOutside = false;
    this.angle;
  }

  update(strokeWidth) {
    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;
    this.isOutside = this.vector.x < 0 || this.vector.x > width || this.vector.y < 0 || this.vector.y > height;
    if (this.isOutside) {
      this.vector.set(random(width), random(height));
      this.vectorOld = this.vector.copy();
    }
    strokeWeight(strokeWidth * this.stepSize);
    line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);
    this.vectorOld = this.vector.copy();
    this.isOutside = false;
  }

  update1(noiseScale, noiseStrength, strokeWidth) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale) * noiseStrength;
    this.update(strokeWidth);
  }
};