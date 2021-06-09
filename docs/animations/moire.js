// Moire animation
const JUKEBOX_FADE_TIME = 60;

class Moire {
  constructor(x1, y1, x2, y2, width, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.width = width;
    this.color = color;
    this.fadeTimer = 60;
  }

  drawMoire(rms) {
    push();
    fill(ColorScheme.CLEAR);
    const strokeColor = getStrokeColorFromStreak(streak);
    let strokeBrightness = map(rms, 0, 0.05, 50, 100);
    if (strokeColor === ColorScheme.BLACK) {
      strokeBrightness = 0;
    } else if (strokeColor === ColorScheme.WHITE) {
      strokeBrightness = 100;
    }
    stroke(color(hue(strokeColor), saturation(strokeColor), strokeBrightness));
    strokeWeight(map(rms, 0, 0.05, 5, getStrokeWeightFromStreak(streak) + 10));

    for (var i = 0; i < this.width; i += this.width / 5) {
      if (i === 4 * this.width / 5) {
        fill(color(
          hue(ColorScheme.ETHEREAL_SAPPHIRE),
          saturation(ColorScheme.ETHEREAL_SAPPHIRE),
          brightness(ColorScheme.ETHEREAL_SAPPHIRE),
          60
        ));
        push();
        noStroke();
        rect(this.x1 + i, this.y1, width - this.x1, this.y2 - this.y1);
        pop();
      }
      line(this.x1 + i, this.y1, this.x1 + i, this.y2);
      //line(this.x1 + i, this.y1, this.x1 + i + 100, this.y1 - 100);
      const RADIUS = 200;
      arc(this.x1 + i + RADIUS / 2, this.y1, RADIUS, 0.75 * RADIUS - i, PI, 3 * HALF_PI);
    }
    pop();
  };

  resetFadeTimer() {
    this.fadeTimer = JUKEBOX_FADE_TIME;
  }

  getJukeboxStrokeColor() {
    if (audioManager.volume < VOLUME_MAX * 0.5) {
      return ColorScheme.WHITE;
    } else {
      return ColorScheme.BLACK;
    }
  }
}