const CURSOR_WIDTH = 20;
const CURSOR_HEIGHT = 20;

class UIManager {
  constructor() {
    const TITLE_TEXT_SIZE = windowHeight / 4;
    const TITLE_X = windowWidth / 2;
    const TITLE_Y = 3 * windowHeight / 8;
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-UltraLight');
    textSize(TITLE_TEXT_SIZE);
    this.titlePoints = titleFont.textToPoints('Juke', TITLE_X, TITLE_Y, TITLE_TEXT_SIZE, {
      sampleFactor: 0.1
    });
    this.titleBounds = titleFont.textBounds('Juke', TITLE_X, TITLE_Y);
    for (let i = 0; i < this.titlePoints.length; i++) {
      this.titlePoints[i].platformWidth = random(5, 15);
    }
  }

  drawUI() {
    if (levelManager.getCurrentLevel().genre === 'City') {
      this.drawMainMenu();
    } else {
      if (isPaused) {
        this.drawPauseMenu();
      }
      this.drawGameUI();
    }
  }

  drawMainMenu() {
    const TITLE_POINT_SIZE = 3;

    const ITEM_TEXT_SIZE = windowHeight / 15;
    const TEXT_X = windowWidth / 2;
    const CURSOR_X = windowWidth / 5;

    const ITEM1_Y = windowHeight / 2;
    const ITEM2_Y = 5 * windowHeight / 8;
    const ITEM3_Y = 3 * windowHeight / 4;

    let jitter = 0;//map(mouseX, 0, windowWidth, 0, 20);

    let sound = audioManager.sounds.filter(sound => sound.isPlaying())[0];
    let rms = sound.amplitudeAnalyzer.getLevel();

    for (let i = 0; i < this.titlePoints.length; i++) {
      push();
      stroke(0);
      strokeWeight(1);
      let point = this.titlePoints[i];
      if (random(100) < map(rms, 0.01, 0.05, 0, 50)) {
        point.platformWidth = random(5, 15);
      }
      line(point.x - this.titleBounds.w / 2, point.y - this.titleBounds.h / 2, point.x - this.titleBounds.w / 2 + point.platformWidth, point.y - this.titleBounds.h / 2);
      pop();
      // ellipse(
      //   point.x - this.titleBounds.w / 2 + jitter * -Math.sin(point.alpha + PI / 2),
      //   point.y - this.titleBounds.h / 2 + jitter * Math.sin(point.alpha + PI / 2),
      //   TITLE_POINT_SIZE
      // );
    }

    push();
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

  drawPauseMenu() {
    const TEXT_X = windowWidth / 2;
    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(50);
    text('PAUSED', TEXT_X, windowWidth / 2);
  }

  drawGameUI() {
    push();
    textAlign(LEFT, TOP)
    textFont('HelveticaNeue-Thin');
    textSize(20);

    this.drawSongProgressMeter();
    this.drawVolumeMeter();

    let currentLevelNumber = levelManager.getCurrentLevelNumber();
    if (currentLevelNumber > 1) {
      this.drawSoundSpeedMeter();
    }

    if (currentLevelNumber > 2) {
      this.drawReverbMeter();
    }
    pop();
  }

  drawSongProgressMeter() {
    push();
    stroke(ColorScheme.BLACK);
    fill(ColorScheme.CLEAR);
    rect(windowWidth / 2 - 100, 5, 200, 20);
    noStroke();
    fill(ColorScheme.BLACK);
    //text('Song Progress', windowWidth / 2, 5);
    rect(windowWidth / 2 - 100, 5, map(audioManager.currentSound, 0, audioManager.levelSounds.length, 0, 200), 20);
    pop();
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