class UIManager {
  constructor() {
    textAlign(LEFT, TOP)
    textFont('Helvetica Neue');
    textSize(20);
  }

  drawUI() {
    this.drawVolumeMeter();
    this.drawSoundSpeedMeter();
  }

  drawVolumeMeter() {
    push();
    noStroke();
    fill(ColorScheme.BLACK);
    text('Volume', 0, 5);
    fill(0, 100, 50);
    rect(70, 5, map(audioManager.volume, 0, 1, 0, 200), 20);
    pop();
  }

  drawSoundSpeedMeter() {
    push();
    noStroke();
    fill(ColorScheme.BLACK);
    text('Speed', 0, 35);
    fill(95, 100, 50);
    rect(70, 35, map(audioManager.soundSpeed, 0.01, 4, 0, 200), 20);
    pop();
  }
}