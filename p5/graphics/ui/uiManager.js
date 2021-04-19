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
    if (levelManager.getCurrentLevel().genre === TITLE_GENRE) {
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
    const ITEM_TEXT_SIZE = windowHeight / 15;
    const TEXT_X = windowWidth / 2;
    const CURSOR_X = windowWidth / 5;

    const ITEM1_Y = windowHeight / 2;
    const ITEM2_Y = 5 * windowHeight / 8;
    const ITEM3_Y = 3 * windowHeight / 4;

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

  drawHowToPlayScreen() {
    const SUBTITLE_TEXT_SIZE = windowHeight / 15;
    const ITEM_TEXT_SIZE = windowHeight / 25;
    const TEXT_X = windowWidth / 2;

    const ITEM1_Y = windowHeight / 4;
    const ITEM2_Y = 3 * windowHeight / 8;
    const ITEM3_Y = windowHeight / 2;
    const ITEM4_Y = 5 * windowHeight / 8;
    const ITEM5_Y = 3 * windowHeight / 4;
    push();
    textSize(SUBTITLE_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    text('HOW TO PLAY', TEXT_X, ITEM1_Y);
    textSize(ITEM_TEXT_SIZE);
    text('ARROW KEYS to move, SPACE BAR to jump, ESC to pause .', TEXT_X, ITEM2_Y);
    text('Pay attention to the music, and try not to fall.', TEXT_X, ITEM3_Y);
    text('Reach the end of a musical section without falling to progress.', TEXT_X, ITEM4_Y);
    text('Pass through the final barline to finish the song and move to the next level.', TEXT_X, ITEM5_Y);
    pop();
  }

  drawCreditsScreen() {
    const SUBTITLE_TEXT_SIZE = windowHeight / 15;
    const ITEM_TEXT_SIZE = windowHeight / 25;
    const TEXT_X = windowWidth / 2;

    const ITEM1_Y = windowHeight / 4;
    const ITEM2_Y = 3 * windowHeight / 8;
    const ITEM3_Y = windowHeight / 2;
    const ITEM4_Y = 5 * windowHeight / 8;
    const ITEM5_Y = 3 * windowHeight / 4;
    const ITEM6_Y = 7 * windowHeight / 8;
    push();
    textSize(SUBTITLE_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
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
    const TEXT_X = windowWidth / 2;
    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(50);
    fill(levelManager.getCurrentLevel().playerColor);
    text('PAUSED', TEXT_X, windowWidth / 2);
    textSize(30);
    text('[Press Q to return to Main Menu]', TEXT_X, 5 * windowWidth / 8);
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
    rect(windowWidth / 2 - 100, 5, 200, 20);
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    //text('Song Progress', windowWidth / 2, 5);
    rect(windowWidth / 2 - 100, 5, map(audioManager.currentSound, 0, audioManager.levelSounds.length, 0, 200), 20);
    pop();
  }

  drawVolumeMeter() {
    push();
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    text('Volume', 0, 5);
    fill(ColorScheme.RED);
    rect(70, 5, map(audioManager.volume, 0, 1, 0, 200), 20);
    pop();
  }

  drawSoundSpeedMeter() {
    push();
    noStroke();
    fill(levelManager.getCurrentLevel().playerColor);
    text('Speed', 0, 35);
    fill(ColorScheme.GREEN);
    rect(70, 35, map(audioManager.soundSpeed, 0.01, 4, 0, 200), 20);
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