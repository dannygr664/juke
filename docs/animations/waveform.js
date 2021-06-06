class Waveform {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
  }

  draw(rms) {
    push();
    strokeWeight(5);

    fill(this.color);

    ellipse(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    this.drawEnergyMeter();
    this.drawStroke();

    pop();
  }

  drawEnergyMeter() {
    push();
    fill(ColorScheme.getComplementaryColor(this.color));
    ellipse(this.x1, this.y1, this.x2 - this.x1, map(player.energy, 0, levelManager.getCurrentLevel().maxEnergy, this.y2 - this.y1, 0));
    pop();
  }

  drawStroke() {
    push();
    if (player.isReviving) {
      stroke(ColorScheme.WHITE);
      strokeWeight(10);
    } else {
      stroke(player.strokeColor);
      strokeWeight(map(audioManager.reverbLevel, REVERB_MIN, REVERB_MAX, 4, 10));
    }

    fill(ColorScheme.CLEAR);
    ellipse(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    pop();
  }
}