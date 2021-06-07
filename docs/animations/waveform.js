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
    strokeWeight(map(rms, 0, 0.05, 1, this.getStrokeWeightFromStreak()));

    stroke(this.getStrokeColorFromStreak());

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
    const OFFSET = (this.x2 - this.x1) * 0.1;
    push();
    if (player.isReviving) {
      stroke(ColorScheme.WHITE);
      strokeWeight(10);
    } else {
      stroke(player.strokeColor);
      strokeWeight(map(audioManager.reverbLevel, REVERB_MIN, REVERB_MAX, 4, 10));
    }

    fill(ColorScheme.CLEAR);
    ellipse(this.x1 - OFFSET, this.y1 - OFFSET, (this.x2 - this.x1) * 2, (this.y2 - this.y1) * 2);
    pop();
  }

  drawDynamics() {
    push();
    noStroke();
    const TEXT_SIZE = width / 35;
    textSize(TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    const volume = audioManager.volume;
    const TEXT_X = this.x1;
    const TEXT_Y = this.y1;
    let dynamics;
    if (volume === 0) {
      dynamics = 'pp';
    } else if (volume < VOLUME_MAX * 0.25) {
      dynamics = 'p'
    } else if (volume < VOLUME_MAX * 0.5) {
      dynamics = 'mp';
    } else if (volume < VOLUME_MAX * 0.75) {
      dynamics = 'mf';
    } else if (volume < VOLUME_MAX) {
      dynamics = 'f';
    } else if (volume === VOLUME_MAX) {
      dynamics = 'ff';
    }
    text(dynamics, TEXT_X, TEXT_Y);
    pop();
  }

  getStrokeWeightFromStreak() {
    if (streak < STREAK_THRESHOLD_1) {
      return 0;
    } else if (streak < STREAK_THRESHOLD_2) {
      return 10;
    } else if (streak < STREAK_THRESHOLD_3) {
      return 20;
    } else {
      return 30;
    }
  }

  getStrokeColorFromStreak() {
    if (streak < STREAK_THRESHOLD_1) {
      return ColorScheme.CLEAR;
    } else if (streak < STREAK_THRESHOLD_2) {
      return ColorScheme.ETHEREAL_SAPPHIRE;
    } else if (streak < STREAK_THRESHOLD_3) {
      return ColorScheme.ETHEREAL_GOLD;
    } else {
      return ColorScheme.WHITE;
    }
  }
}