class UIManager {
  constructor() {
    textAlign(LEFT, TOP)
    textFont('Helvetica Neue');
    textSize(20);
  }

  drawUI() {
    if (levelManager.getCurrentLevel().genre === 'City') {
      this.drawMainMenu();
    } else {
      this.drawGameUI();
    }
  }

  drawMainMenu() {
    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-UltraLight');
    textSize(200);
    text('Juke', windowWidth / 2, windowHeight / 3);
    textSize(70);
    textFont('HelveticaNeue-Thin');
    text('Play', windowWidth / 2, windowHeight / 2);
    text('How To Play', windowWidth / 2, 5 * windowHeight / 8);
    text('Credits', windowWidth / 2, 3 * windowHeight / 4);
    pop();
  }

  drawGameUI() {
    this.drawVolumeMeter();
    this.drawSoundSpeedMeter();
    this.drawReverbMeter();
  }

  drawVolumeMeter() {
    push();
    noStroke();
    fill(ColorScheme.BLACK);
    text('Volume', 0, 5);
    fill(ColorScheme.RED);
    rect(70, 5, map(audioManager.volume, 0, 1, 0, 200), 20);
    pop();
  }

  drawSoundSpeedMeter() {
    push();
    noStroke();
    fill(ColorScheme.BLACK);
    text('Speed', 0, 35);
    fill(ColorScheme.GREEN);
    rect(70, 35, map(audioManager.soundSpeed, 0.01, 4, 0, 200), 20);
    pop();
  }

  drawReverbMeter() {
    push();
    noStroke();
    fill(ColorScheme.BLACK);
    text('Reverb', 0, 65);
    fill(ColorScheme.BLUE);
    rect(70, 65, map(audioManager.reverbLevel, 0, 1, 0, 200), 20);
    pop();
  }
}