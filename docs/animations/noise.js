// Noise animation
let agents = [];
let agentCount = 100;
let noiseScale = 0.1;
let noiseStrength = 0.1;
let overlayAlpha = 0;
let agentAlpha = 10;
let strokeWidth = 0.3;

class Noise {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    for (let i = 0; i < agentCount; i++) {
      agents[i] = new Agent(this.x1, this.x2, this.y1, this.y2);
    }
  }

  updateAgentPositions() {
    for (let i = 0; i < agentCount; i++) {
      agents[i].x1 = this.x1;
      agents[i].x2 = this.x2;
    }
  }

  draw(rms) {
    push();
    fill(255, overlayAlpha);
    rect(0, 0, this.x2 - this.x1, this.y2 - this.y1);

    noiseStrength = map(rms, 0, 0.1, 0, 20);
    strokeWidth = map(rms, 0, 0.1, 0.5, map(audioManager.volume, 0, 1, 4, 10));

    // Draw agents
    stroke(player.isReviving ? ColorScheme.BLACK_INACTIVE : this.color, agentAlpha);

    let colorScaleFactor;
    switch (this.color) {
      case ColorScheme.ETHEREAL_HIGHEST_REVERB:
        colorScaleFactor = 1000;
        break;
      case ColorScheme.ETHEREAL_HIGHER_REVERB:
        colorScaleFactor = 100;
        break;
      case ColorScheme.ETHEREAL_LOWER_REVERB:
        colorScaleFactor = 0.5;
        break;
      case ColorScheme.ETHEREAL_LOWEST_REVERB:
        colorScaleFactor = 0.25;
        break;
      default:
        colorScaleFactor = 1;
    }

    for (let i = 0; i < agentCount; i++) {
      agents[i].update1(noiseScale, noiseStrength * colorScaleFactor, strokeWidth);
    }

    pop();
  }
}

class Agent {
  constructor(x1, x2, y1, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.vector = createVector(random(this.x1, this.x2), random(this.y1, this.y2));
    this.vectorOld = this.vector.copy();
    this.stepSize = random(1, 5);
    this.isOutside = false;
    this.angle;
  }

  update(strokeWidth) {
    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;
    this.isOutside = this.vector.x < this.x1 || this.vector.x > this.x2 || this.vector.y < this.y1 || this.vector.y > this.y2;
    if (this.isOutside) {
      this.vector.set(random(this.x1, this.x2), random(this.y1, this.y2));
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