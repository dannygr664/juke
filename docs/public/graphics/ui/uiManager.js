const CURSOR_WIDTH = 20;
const CURSOR_HEIGHT = 20;

class UIManager {
  constructor() {
    const TITLE_TEXT_SIZE = height / 5;
    const TITLE_X = width / 2;
    const TITLE_Y = 9 * height / 16;
    textAlign(CENTER, CENTER);
    textFont('Zapfino');
    textSize(TITLE_TEXT_SIZE);
    this.titlePoints = gameTitleFont.textToPoints('Juke', TITLE_X, TITLE_Y, TITLE_TEXT_SIZE, {
      sampleFactor: 0.1
    });
    this.titleBounds = gameTitleFont.textBounds('Juke', TITLE_X, TITLE_Y);
    for (let i = 0; i < this.titlePoints.length; i++) {
      this.titlePoints[i].platformWidth = random(5, 15);
    }
    this.numHelpPages = 1;
    this.currentHelpPage = 1;
  }

  drawUI() {
    if (levelManager.getCurrentLevel().genre === TITLE_GENRE) {
      if (!isLoaded) {
        this.drawLoadingScreen();
      } else if (!isAwake) {
        this.drawPrestartScreen();
      } else {
        this.drawMainMenu();
        //this.drawPlayerRole();
      }
    } else {
      this.drawGameUI();
    }
  }

  drawLoadingScreen() {
    push();

    stroke(ColorScheme.BLACK);
    fill(ColorScheme.CLEAR);
    rect(width / 2 - (width / 8), height / 2 - (height / 80), width / 4, height / 40);
    noStroke();
    fill(ColorScheme.BLACK);
    rect(width / 2 - (width / 8), height / 2 - (height / 80), (audioManager.numberOfSoundsLoaded / audioManager.audioFilePaths.length) * (width / 4), height / 40);

    pop();
  }

  drawPrestartScreen() {
    push();
    const TEXT_SIZE = height / 15;
    fill(ColorScheme.BLACK);
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(TEXT_SIZE);
    text('Click/Press any key to start', width / 2, height / 2);
    pop();
  }

  drawMainMenu() {
    const TITLE_POINT_SIZE = 3;

    let currentScreen = levelManager.getCurrentLevel().currentScreen;
    if (currentScreen === MAIN_MENU_SCREEN) {
      this.drawMainMenuScreen();
    } else if (currentScreen === HOW_TO_PLAY_SCREEN) {
      this.drawHowToPlayScreen();
    } else if (currentScreen === CREDITS_SCREEN) {
      this.drawESCToReturn();
      this.drawCreditsScreen();
    } else if (currentScreen === MODE_SELECTION_SCREEN) {
      this.drawESCToReturn();
      this.drawModeSelectionScreen();
    } else if (currentScreen === SONG_SELECTION_SCREEN) {
      this.drawESCToReturn();
      this.drawSongSelectionScreen();
    } else if (currentScreen === NETWORK_SELECTION_SCREEN) {
      this.drawESCToReturn();
      this.drawNetworkSelectionScreen();
    } else if (currentScreen === ROLE_SELECTION_SCREEN) {
      this.drawESCToReturn();
      this.drawRoleSelectionScreen();
    } else if (currentScreen === CONTROLLER_SELECTION_SCREEN) {
      this.drawESCToReturn();
      this.drawMIDIControllerSelectionScreen(midiManager.controllers);
    }
  }

  drawPlayerRole() {
    push();
    textFont('HelveticaNeue-Thin');
    const TEXT_SIZE = height / 20;
    textSize(TEXT_SIZE);

    const TEXT_X = width / 12;
    const TEXT_Y = height * 0.95;
    const playerRoleString = (playerRole === GAMER) ? 'GAMER' : 'MUSICIAN';
    text(playerRoleString, TEXT_X, TEXT_Y);
    pop();
  }

  drawESCToReturn() {
    push();
    const ITEM_TEXT_SIZE = height / 35;
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');

    const BACK_TEXT_X = width / 7;
    const BACK_TEXT_Y = height / 20;
    text('[ESC] to return', BACK_TEXT_X, BACK_TEXT_Y);
    pop();
  }

  drawMainMenuScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const UP_ARROW_Y = 15 * height / 32;
    const DOWN_ARROW_Y = 29 * height / 32;

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

    let currentLevel = levelManager.getCurrentLevel();

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    this.drawUpArrow(TEXT_X, UP_ARROW_Y);
    text('Play', TEXT_X, currentLevel.getYPosOfItem(1));
    text('How To Play', TEXT_X, currentLevel.getYPosOfItem(2));
    text('Credits', TEXT_X, currentLevel.getYPosOfItem(3));
    this.drawDownArrow(TEXT_X, DOWN_ARROW_Y);

    let currentItemSelected = currentLevel.currentItemSelected;
    let cursorY = -height;
    if (currentItemSelected === 0) {
      cursorY = currentLevel.getYPosOfItem(1);
    } else if (currentItemSelected === 1) {
      cursorY = currentLevel.getYPosOfItem(2);
    } else if (currentItemSelected === 2) {
      cursorY = currentLevel.getYPosOfItem(3);
    }

    rect(
      CURSOR_X - CURSOR_WIDTH / 2,
      cursorY - CURSOR_HEIGHT / 2,
      CURSOR_WIDTH,
      CURSOR_HEIGHT
    );
    pop();
  }

  drawUpArrow(x, y) {
    push();
    stroke(ColorScheme.BLACK);
    line(x - width / 50, y + height / 50, x, y);
    line(x + width / 50, y + height / 50, x, y);
    pop();
  }

  drawDownArrow(x, y) {
    push();
    stroke(ColorScheme.BLACK);
    line(x - width / 50, y - height / 50, x, y);
    line(x + width / 50, y - height / 50, x, y);
    pop();
  }

  drawHowToPlayScreen() {
    const SUBTITLE_TEXT_SIZE = height / 15;
    const HEADING_TEXT_SIZE = height / 20;
    const ITEM_TEXT_SIZE = height / 30;
    const CONTROLS_X = 20 * width / 64;
    const GOAL_X = width / 2;

    const AUDIO_PARAM_LABEL_X = 20
    const AUDIO_PARAM_LABEL_Y = 95;

    const SONG_PROGRESS_LABEL_X = width / 2;
    const SONG_PROGRESS_LABEL_Y = 40;

    const SUBTITLE_Y = height / 4;
    const SUBITEM1_Y = 5 * height / 16
    const CONTROLS_Y = 20 * height / 32;
    const CONTROL1_Y = 22 * height / 32;
    const CONTROL2_Y = 24 * height / 32;
    const CONTROL3_Y = 26 * height / 32;
    const PAGE_INDEX_Y = 28 * height / 32;
    if (!isPaused) {
      push();
      textFont('HelveticaNeue-Thin');
      textSize(SUBTITLE_TEXT_SIZE);
      text('GOAL', GOAL_X, SUBTITLE_Y);
      textSize(ITEM_TEXT_SIZE);
      text('Reach end of section without falling to progress.', GOAL_X, SUBITEM1_Y);
      textAlign(LEFT, TOP);
      textSize(ITEM_TEXT_SIZE);
      text('AUDIO PARAMS', AUDIO_PARAM_LABEL_X, AUDIO_PARAM_LABEL_Y);

      textAlign(CENTER, TOP);
      text('SONG PROGRESS', SONG_PROGRESS_LABEL_X, SONG_PROGRESS_LABEL_Y);

      textAlign(CENTER, CENTER);
      textSize(HEADING_TEXT_SIZE);
      text('CONTROLS', CONTROLS_X, CONTROLS_Y);
      textSize(ITEM_TEXT_SIZE);
      text('ARROW KEYS — Move left/right', CONTROLS_X, CONTROL1_Y);
      text('SPACE BAR — Jump/Revive', CONTROLS_X, CONTROL2_Y);
      text('ESC — Pause', CONTROLS_X, CONTROL3_Y);
      // text('Pay attention to the music, and try not to fall.', TEXT_X, ITEM3_Y);
      // text('Reach the end of a musical section without falling to progress.', TEXT_X, ITEM4_Y);
      // text('Pass through the final barline to finish the song and move to the next level.', TEXT_X, ITEM5_Y);
      //text(`${this.currentHelpPage} / ${this.numHelpPages}`, CONTROLS_X, PAGE_INDEX_Y);
      pop();
    }

    // platformManager.drawPlatforms();
    // drawSprite(player.sprite);
    this.drawGameUI();
  }

  drawCreditsScreen() {
    const SUBTITLE_TEXT_SIZE = height / 15;
    const ITEM_TEXT_SIZE = height / 35;
    const TEXT_X = width / 2;

    const ITEM1_Y = height / 4;
    const ITEM2_Y = 3 * height / 8;
    const ITEM3_Y = height / 2;
    const ITEM4_Y = 5 * height / 8;
    const ITEM5_Y = 3 * height / 4;
    const ITEM6_Y = 7 * height / 8;
    push();
    textFont('HelveticaNeue-Thin');
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

  drawModeSelectionScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const UP_ARROW_Y = 15 * height / 32;
    const DOWN_ARROW_Y = 29 * height / 32;

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

    let currentLevel = levelManager.getCurrentLevel();

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    this.drawUpArrow(TEXT_X, UP_ARROW_Y);
    text('Single Player', TEXT_X, currentLevel.getYPosOfItem(1));
    text('Multiplayer', TEXT_X, currentLevel.getYPosOfItem(2));
    this.drawDownArrow(TEXT_X, currentLevel.getYPosOfItem(3));

    let currentItemSelected = currentLevel.currentItemSelected;
    let cursorY = -height;
    if (currentItemSelected === 0) {
      cursorY = currentLevel.getYPosOfItem(1);
    } else if (currentItemSelected === 1) {
      cursorY = currentLevel.getYPosOfItem(2);
    }

    rect(
      CURSOR_X - CURSOR_WIDTH / 2,
      cursorY - CURSOR_HEIGHT / 2,
      CURSOR_WIDTH,
      CURSOR_HEIGHT
    );
    pop();
  }

  drawSongSelectionScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;

    const UP_ARROW_Y = height * 0.01;
    const DOWN_ARROW_Y = height * 0.99;

    // let sound = audioManager.sounds.filter(sound => sound.isPlaying())[0];

    let currentLevel = levelManager.getCurrentLevel();

    let genre = audioManager.songs[currentLevel.currentItemSelected].soundInfo.genre;

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    this.drawUpArrow(TEXT_X, UP_ARROW_Y);
    text(genre, TEXT_X, height / 2);
    this.drawDownArrow(TEXT_X, DOWN_ARROW_Y);

    let currentItemSelected = currentLevel.currentItemSelected;

    pop();
  }

  drawNetworkSelectionScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const UP_ARROW_Y = 15 * height / 32;
    const DOWN_ARROW_Y = 29 * height / 32;

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

    let currentLevel = levelManager.getCurrentLevel();

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    this.drawUpArrow(TEXT_X, UP_ARROW_Y);
    text('Local', TEXT_X, currentLevel.getYPosOfItem(1));
    textSize(height / 30);
    text('Online [UNDER CONSTRUCTION]', TEXT_X, currentLevel.getYPosOfItem(2));
    textSize(ITEM_TEXT_SIZE);
    this.drawDownArrow(TEXT_X, currentLevel.getYPosOfItem(3));

    let currentItemSelected = currentLevel.currentItemSelected;
    let cursorY = -height;
    if (currentItemSelected === 0) {
      cursorY = currentLevel.getYPosOfItem(1);
    } else if (currentItemSelected === 1) {
      cursorY = currentLevel.getYPosOfItem(2);
    }

    rect(
      CURSOR_X - CURSOR_WIDTH / 2,
      cursorY - CURSOR_HEIGHT / 2,
      CURSOR_WIDTH,
      CURSOR_HEIGHT
    );
    pop();
  }

  drawRoleSelectionScreen() {
    const ITEM_TEXT_SIZE = height / 15;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const UP_ARROW_Y = 15 * height / 32;
    const DOWN_ARROW_Y = 29 * height / 32;

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

    let currentLevel = levelManager.getCurrentLevel();

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');
    this.drawUpArrow(TEXT_X, UP_ARROW_Y);
    text('Gamer', TEXT_X, currentLevel.getYPosOfItem(1));
    text('Musician', TEXT_X, currentLevel.getYPosOfItem(2));
    this.drawDownArrow(TEXT_X, currentLevel.getYPosOfItem(3));

    let currentItemSelected = currentLevel.currentItemSelected;
    let cursorY = -height;
    if (currentItemSelected === 0) {
      cursorY = currentLevel.getYPosOfItem(1);
    } else if (currentItemSelected === 1) {
      cursorY = currentLevel.getYPosOfItem(2);
    }

    rect(
      CURSOR_X - CURSOR_WIDTH / 2,
      cursorY - CURSOR_HEIGHT / 2,
      CURSOR_WIDTH,
      CURSOR_HEIGHT
    );
    pop();
  }

  drawMIDIControllerSelectionScreen(controllers) {
    const ITEM_TEXT_SIZE = height / 15;
    const CONTROLLER_TEXT_SIZE = height / 30;
    const TEXT_X = width / 2;
    const CURSOR_X = width / 5;

    const DOWN_ARROW_Y = 29 * height / 32;

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

    let currentLevel = levelManager.getCurrentLevel();

    push();
    textAlign(CENTER, CENTER);
    textSize(ITEM_TEXT_SIZE);
    textFont('HelveticaNeue-Thin');

    if (playerRole === MUSICIAN || networkMode === LOCAL) {
      if (controllerSelected) {
        text('Waiting for GAMER to join...', TEXT_X, currentLevel.getYPosOfItem(1));
      } else {
        if (controllers.length === 0) {
          textSize(CONTROLLER_TEXT_SIZE);
          text('Please connect the MIDI device you wish to use.', TEXT_X, currentLevel.getYPosOfItem(0.5));
        } else {
          text('Please select a controller.', TEXT_X, currentLevel.getYPosOfItem(0.5));
          this.drawUpArrow(TEXT_X, currentLevel.getYPosOfItem(1));
          textSize(CONTROLLER_TEXT_SIZE);
          for (let i = 0; i < controllers.length; i++) {
            text(controllers[i], TEXT_X, currentLevel.getYPosOfItem((i * 0.5) + 1.5));
          }
          this.drawDownArrow(TEXT_X, currentLevel.getYPosOfItem((controllers.length * 0.5) + 1.5));

          let currentItemSelected = currentLevel.currentItemSelected;
          let cursorY = currentLevel.getYPosOfItem((currentItemSelected * 0.5) + 1.5);

          rect(
            CURSOR_X - CURSOR_WIDTH / 2,
            cursorY - CURSOR_HEIGHT / 2,
            CURSOR_WIDTH,
            CURSOR_HEIGHT
          );
        }
      }
    } else {
      text('Waiting for MUSICIAN to join...', TEXT_X, currentLevel.getYPosOfItem(1));
    }

    pop();
  }

  drawPauseMenu() {
    const TEXT_X = width / 2;
    push();
    textAlign(CENTER, CENTER);
    textFont('HelveticaNeue-Thin');
    textSize(50);
    fill(levelManager.getCurrentLevel().playerColor);
    text('PAUSED', TEXT_X, height / 2);
    textSize(30);
    text('[ESC — Resume]', TEXT_X, 9 * height / 16);
    text('[DEL — Return to Main Menu]', TEXT_X, 5 * height / 8);
  }

  drawGameUI() {
    if (isPaused) {
      this.drawPauseMenu();
    }
    push();
    textAlign(LEFT, TOP)
    textFont('HelveticaNeue-Thin');
    textSize(20);

    this.drawSongProgressMeter();
    this.drawVolumeMeter();
    this.drawSoundSpeedMeter();
    this.drawReverbMeter();

    pop();
  }

  drawSongProgressMeter() {
    push();
    let fillColor = audioManager.volume < 0.5 ? ColorScheme.WHITE : ColorScheme.BLACK;
    stroke(fillColor);
    fill(ColorScheme.CLEAR);
    rect(width / 2 - 100, 5, 200, 20);
    noStroke();
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
    let fillColor = audioManager.volume < 0.5 ? ColorScheme.WHITE : ColorScheme.BLACK;
    noStroke();
    fill(fillColor);
    text('Volume', 0, 5);
    //fill(0, 0, map(audioManager.volume, 0, 1, 100, 0));
    let rectWidth = map(audioManager.volume, 0, 1, 0, 160);
    rect(70, 5, rectWidth, 20);
    stroke(fillColor);
    fill(ColorScheme.CLEAR);
    rect(70, 5, 160, 20);
    noStroke();
    fill(fillColor);
    text('Q/A/Z', 75 + 160, 5);
    pop();
  }

  drawSoundSpeedMeter() {
    push();
    let fillColor = audioManager.volume < 0.5 ? ColorScheme.WHITE : ColorScheme.BLACK;
    noStroke();
    fill(fillColor);
    text('Speed', 0, 35);

    let soundSpeedFillSaturation = 100;
    if (audioManager.soundSpeed > 0.75 && audioManager.soundSpeed < 2) {
      soundSpeedFillSaturation = saturation(backgroundColor);
    }

    let soundSpeedFillBrightness = 100;
    if (audioManager.volume >= 0.5) {
      soundSpeedFillBrightness = 45;
    } else if (audioManager.volume === 0) {
      soundSpeedFillBrightness = 0;
    }

    let soundSpeedFillColor = color(hue(backgroundColor), soundSpeedFillSaturation, soundSpeedFillBrightness, 100);
    fill(soundSpeedFillColor);
    let rectWidth = map(audioManager.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX, 0, 160);
    rect(70, 35, rectWidth, 20);
    stroke(fillColor);
    fill(ColorScheme.CLEAR);
    rect(70, 35, 160, 20);
    noStroke();
    fill(fillColor);
    text('W/S/X', 75 + 160, 35);
    pop();
  }

  drawReverbMeter() {
    push();
    let fillColor = audioManager.volume < 0.5 ? ColorScheme.WHITE : ColorScheme.BLACK;
    noStroke();
    fill(fillColor);
    text('Reverb', 0, 65);
    let reverbFillColor = player.strokeColor;
    fill(reverbFillColor);
    rect(70, 65, map(audioManager.reverbLevel, 0, 1, 0, 160), 20);
    stroke(fillColor);
    fill(ColorScheme.CLEAR);
    rect(70, 65, 160, 20);
    noStroke();
    fill(fillColor);
    pop();
  }
}