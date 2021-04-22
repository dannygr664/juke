const CURSOR_WIDTH = 20;
const CURSOR_HEIGHT = 20;

class UIManager {
  constructor() {
    const TITLE_TEXT_SIZE = height / 4;
    const TITLE_X = width / 2;
    const TITLE_Y = 3 * height / 8;
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
    if (levelManager.getCurrentLevel().genre === TITLE_GENRE) {
      if (!isAwake) {
        this.drawClickToStart();
      } else {
        this.drawMainMenu();
      }
    } else {
      if (isPaused) {
        this.drawPauseMenu();
      }
      this.drawGameUI();
    }
  }

  drawClickToStart() {
    push();
    const TEXT_SIZE = height / 15;
    fill(ColorScheme.BLACK);
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(TEXT_SIZE);
    text('Click to start', width / 2, height / 2);
    pop();
  }

  drawMainMenu() {
    const TITLE_POINT_SIZE = 3;

    let currentScreen = levelManager.getCurrentLevel().currentScreen;
    if (currentScreen === 0) {
      this.drawMainMenuScreen();
    } else if (currentScreen === 1) {
      this.drawHowToPlayScreen();
    } else if (currentScreen === 2) {
      this.drawCreditsScreen();
    }
  }

  drawMainMenuScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const ITEM1_Y = height / 2;
    const ITEM2_Y = 5 * height / 8;
    const ITEM3_Y = 3 * height / 4;

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
    }

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    text('Play', TEXT_X, ITEM1_Y);
    text('How To Play', TEXT_X, ITEM2_Y);
    text('Credits', TEXT_X, ITEM3_Y);

    let currentItemSelected = levelManager.getCurrentLevel().currentItemSelected;
    let cursorY = -height;
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

  drawHowToPlayScreen() {
    const SUBTITLE_TEXT_SIZE = height / 15;
    const ITEM_TEXT_SIZE = height / 35;
    const TEXT_X = width / 2;
    const BACK_TEXT_X = width / 7;
    const BACK_TEXT_Y = height / 20;

    const ITEM1_Y = height / 4;
    const ITEM2_Y = 3 * height / 8;
    const ITEM3_Y = height / 2;
    const ITEM4_Y = 5 * height / 8;
    const ITEM5_Y = 3 * height / 4;
    push();
    textFont('HelveticaNeue-Thin');
    textSize(ITEM_TEXT_SIZE);
    text('[ESC] to return', BACK_TEXT_X, BACK_TEXT_Y);
    textSize(SUBTITLE_TEXT_SIZE);
    text('HOW TO PLAY', TEXT_X, ITEM1_Y);
    textSize(ITEM_TEXT_SIZE);
    text('ARROW KEYS to move, SPACE BAR to jump/revive, ESC to pause.', TEXT_X, ITEM2_Y);
    text('Pay attention to the music, and try not to fall.', TEXT_X, ITEM3_Y);
    text('Reach the end of a musical section without falling to progress.', TEXT_X, ITEM4_Y);
    text('Pass through the final barline to finish the song and move to the next level.', TEXT_X, ITEM5_Y);
    pop();
  }

  drawCreditsScreen() {
    const SUBTITLE_TEXT_SIZE = height / 15;
    const ITEM_TEXT_SIZE = height / 35;
    const TEXT_X = width / 2;
    const BACK_TEXT_X = width / 7;
    const BACK_TEXT_Y = height / 20;

    const ITEM1_Y = height / 4;
    const ITEM2_Y = 3 * height / 8;
    const ITEM3_Y = height / 2;
    const ITEM4_Y = 5 * height / 8;
    const ITEM5_Y = 3 * height / 4;
    const ITEM6_Y = 7 * height / 8;
    push();
    textFont('HelveticaNeue-Thin');
    textSize(ITEM_TEXT_SIZE);
    text('[ESC] to return', BACK_TEXT_X, BACK_TEXT_Y);
    textSize(SUBTITLE_TEXT_SIZE);
    text('CREDITS', TEXT_X, ITEM1_Y);
    textSize(ITEM_TEXT_SIZE);
    text('Game Concept, Visuals, and Programming by Daniel Greenberg', TEXT_X, ITEM2_Y);
    text('"Beat Cypher #3" by Jesús Pineda', TEXT_X, ITEM3_Y);
    text('"Cypher 5" by Calvin McCormack', TEXT_X, ITEM4_Y);
    text('"It\'s Too Late" by Guillermo Montalvan and Daniel Greenberg', TEXT_X, ITEM5_Y);
    text('"Ethereal" by Angel Rose (ft. Mateo Falgas)', TEXT_X, ITEM6_Y);
    pop();
  }

  drawPauseMenu() {
    const TEXT_X = width / 2;
    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(50);
    fill(levelManager.getCurrentLevel().playerColor);
    text('PAUSED', TEXT_X, width / 2);
    textSize(30);
    text('[Press Q to return to Main Menu]', TEXT_X, 5 * width / 8);
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
    stroke(levelManager.getCurrentLevel().playerColor);
    fill(ColorScheme.CLEAR);
    rect(width / 2 - 100, 5, 200, 20);
    noStroke();
    let fillColor = levelManager.getCurrentLevel().playerColor;
    fillColor.setAlpha(50);
    fill(fillColor);
    //text('Song Progress', width / 2, 5);
    rect(width / 2 - 100, 5, map(audioManager.currentSound, 0, audioManager.levelSounds.length, 0, 200), 20);

    if (jukeboxManager.didPlayerFall) {
      fillColor.setAlpha(10);
    }
    fill(fillColor);
    rect(width / 2 - 100, 5, map(audioManager.getCurrentSound().currentTime(), 0, audioManager.getCurrentSound().duration(), 0, 200), 20);
    fillColor.setAlpha(100);
    pop();
  }

  drawVolumeMeter() {
    push();
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    text('Volume', 0, 5);
    fill(ColorScheme.RED);
    let rectWidth = map(audioManager.volume, 0, 1, 0, 200);
    rect(70, 5, rectWidth, 20);
    let currentLevelNumber = levelManager.getCurrentLevelNumber();
    fill(levelManager.getCurrentLevel().playerColor);
    if (currentLevelNumber > 1) {
      text('Q/Z', 75 + rectWidth, 5);
    }
    pop();
  }

  drawSoundSpeedMeter() {
    push();
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    text('Speed', 0, 35);
    fill(ColorScheme.GREEN);
    let rectWidth = map(audioManager.soundSpeed, 0.01, 4, 0, 200);
    rect(70, 35, rectWidth, 20);
    let currentLevelNumber = levelManager.getCurrentLevelNumber();
    fill(levelManager.getCurrentLevel().playerColor);
    if (currentLevelNumber > 2) {
      text('W/X', 75 + rectWidth, 35);
    }
    pop();
  }

  drawReverbMeter() {
    push();
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    text('Reverb', 0, 65);
    fill(ColorScheme.BLUE);
    rect(70, 65, map(audioManager.reverbLevel, 0, 1, 0, 200), 20);
    pop();
  }
}