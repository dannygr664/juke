const CURSOR_WIDTH = 20;
const CURSOR_HEIGHT = 20;

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
    const TITLE_TEXT_SIZE = windowHeight / 5;
    const ITEM_TEXT_SIZE = windowHeight / 15;
    const TEXT_X = windowWidth / 2;
    const CURSOR_X = windowWidth / 5;

    const TITLE_Y = windowHeight / 3;
    const ITEM1_Y = windowHeight / 2;
    const ITEM2_Y = 5 * windowHeight / 8;
    const ITEM3_Y = 3 * windowHeight / 4;

    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-UltraLight');
    textSize(TITLE_TEXT_SIZE);
    text('Juke', TEXT_X, TITLE_Y);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    text('Play', TEXT_X, ITEM1_Y);
    text('How To Play', TEXT_X, ITEM2_Y);
    text('Credits', TEXT_X, ITEM3_Y);

    let currentItemSelected = levelManager.getCurrentLevel().currentItemSelected;
    let cursorY = -windowHeight;
    if (currentItemSelected === 0) {
      cursorY = ITEM1_Y;
    } else if (currentItemSelected === 1) {
      cursorY = ITEM2_Y;
    } else if (currentItemSelected === 2) {
      cursorY = ITEM3_Y;
    }

    rect(
      CURSOR_X - CURSOR_WIDTH / 2,
      cursorY - CURSOR_HEIGHT / 2,
      CURSOR_WIDTH,
      CURSOR_HEIGHT
    );
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