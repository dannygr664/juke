/// <reference path="TSDef/p5.global-mode.d.ts" />

// let socket;

let TITLE_GENRE = 'City';

let audioFilePaths = [];
let sounds = [];
let audioManager;
let midiManager;

let animationController;
let uiManager;
let levelManager;

let playerRole;
let player;
let platformManager;
let fluidManager;
let jukeboxManager;

let leftBoundingRectangle;
let rightBoundingRectangle;

let beatStreakX = 0;
let beatStreakY = 0;

const MIN_WIDTH = 800;
const MAX_WIDTH = 900;
const MIN_HEIGHT = 500;

const GAMER = 0;
const MUSICIAN = 1;

const LOCAL = 0;
const ONLINE = 1;

const STREAK_THRESHOLD_1 = 16;
const STREAK_THRESHOLD_2 = 32;
const STREAK_THRESHOLD_3 = 48;

function preload() {
  isLoaded = false;
  isAwake = false;
  isMultiplayerMode = false;
  controllerSelected = false;
  returningToSongSelectionScreen = false;
  displayingScore = false;
  browserSupportsMIDI = true;
  playerRole = GAMER;
  networkMode = LOCAL;
  audioManager = new AudioManager();
  midiManager = new MIDIManager();
  animationController = new AnimationController();

  gameTitleFont = loadFont('graphics/fonts/Zapfino.ttf');
  titleFont = loadFont('graphics/fonts/HelveticaNeue-UltraLight.ttf');
  itemFont = loadFont('graphics/fonts/HelveticaNeue-Thin.ttf');
}


function setup() {
  // Disable scroll bar from appearing when pressing space
  window.onkeydown = function (e) {
    return !(e.keyCode == 32);
  };

  isLoaded = false;

  audioManager.loadSounds();

  isPaused = false;

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  levelManager = new LevelManager();

  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;
  oldBackgroundColor = backgroundColor;
  newBackgroundColor = backgroundColor;
  backgroundColorFadeTimer = 0;
  backgroundColorFadeTime = 0;
  streak = 0;
  score = 0;

  audioManager.loadFilter();
  audioManager.loadReverb();

  uiManager = new UIManager();

  createBoundingRectangles();

  // socket = io();
  // socket.on('game start', startMultiplayerMode);
}


function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}


function wakeUp() {
  audioManager.startSounds(currentLevel.genre);
  midiManager.initializeSynth('synth_drum', 0);

  animationController.loadAnimations();

  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
  jukeboxManager = new JukeboxManager();

  audioManager.assignSoundAnimations();
  audioManager.assignSoundCues();

  // audioManager.unloopCurrentSound();

  isAwake = true;
}


function draw() {
  if (backgroundColorFadeTimer > 0) {
    backgroundColor = lerpColor(newBackgroundColor, oldBackgroundColor, map(backgroundColorFadeTimer, 0, backgroundColorFadeTime, 0, 1));
    backgroundColorFadeTimer--;
  } else if (newBackgroundColor !== oldBackgroundColor) {
    oldBackgroundColor = newBackgroundColor;
    backgroundColor = newBackgroundColor;
  }

  background(backgroundColor);

  if (isAwake) {
    if (!isPaused) {
      audioManager.update();
    }

    if (currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) {
      if (!isPaused) {
        player.speed = player.baseSpeed * audioManager.soundSpeed;
        player.gravityForce = DEFAULT_GRAVITY_FORCE * map(audioManager.reverbLevel, 0, 1, 1, 0.4);

        handleBorderCollisions();

        if (player.isReviving) {
          revivingLoop();
        } else {
          movementControls();
          handleCollisionsAndJumping();

          if (currentLevel.genre !== TITLE_GENRE) {
            platformManager.managePlatforms();
            fluidManager.manageFluids();
          }

          //jukeboxManager.manageJukeboxes();

          let newEnergy = player.energy + 0.05;
          player.energy = min(newEnergy, currentLevel.maxEnergy);
          player.triggerUpdatePlayerColor(color(
            hue(player.color),
            saturation(player.color),
            brightness(player.color),
            map(player.energy, 0, currentLevel.maxEnergy, 0, 100)
          ), 0);
          handleFalling();
        }
      }

      player.updatePlayerColor();
      platformManager.updatePlatformColor();

      fluidManager.drawFluids();
      jukeboxManager.drawJukeboxes();
      platformManager.drawPlatforms();

      player.drawPlayer();
    }
  }

  uiManager.drawUI();
}


function createBoundingRectangles() {
  leftBoundingRectangle = createSprite(-140, -height * 2, 280, height * 8);
  leftBoundingRectangle.setDefaultCollider();
  rightBoundingRectangle = createSprite(width + 140, -height * 2, 280 + JUKEBOX_OFFSET * 2, height * 8);
  rightBoundingRectangle.setDefaultCollider();
}


function handleBorderCollisions() {
  player.sprite.collide(leftBoundingRectangle);
  player.sprite.collide(rightBoundingRectangle);
}


function handleCollisionsAndJumping() {
  if (player.sprite.collide(platformManager.platforms)) {
    if (player.sprite.getSpeed() === 0) {
      player.sprite.setSpeed(platformManager.baseSpeed * audioManager.soundSpeed, 180);
    }
    player.gravitySpeed = 0;
    handleJumpingControls();
  }

  let currentLevel = levelManager.getCurrentLevel();

  if (!player.inFluid) {
    if (player.sprite.overlap(fluidManager.fluids, currentLevel.handleFluidEnter)) {
      player.inFluid = true;
    }
  } else if (!player.sprite.overlap(fluidManager.fluids)) {
    if (player.inFluid) {
      currentLevel.handleFluidExit();
      player.inFluid = false;
    }
  }

  player.sprite.overlap(jukeboxManager.jukeboxes, currentLevel.handleJukeboxEnter);

  if (player.jumpSpeed > 0) {
    player.jumpSpeed -= player.gravityForce;
    player.sprite.addSpeed(player.jumpSpeed, 270);
  } else {
    player.handleGravity();
  }
}


function handleFalling() {
  if (player.sprite.position.y > height || player.energy < 0) {
    streak = 0;
    player.handleFalling();
    audioManager.handleFalling();
    midiManager.handleFalling();
    platformManager.handleFalling();
    fluidManager.handleFalling();
    jukeboxManager.handleFalling();
  } else {
    if (streak < STREAK_THRESHOLD_1) {
      if (streak % 2 === 0) {
        score++;
      }
    } else if (streak < STREAK_THRESHOLD_2) {
      score++;
    } else if (streak < STREAK_THRESHOLD_3) {
      score += 2;
    } else {
      score += 10;
    }
  }
}


function revivingLoop() {
  if (player.sprite.position.y < height / 6) {
    player.sprite.setSpeed(0, 270);
    handleRevivingControls();
  }
}


function handleRevived() {
  player.handleRevived();
  audioManager.handleRevived();
  midiManager.handleRevived();
  platformManager.handleRevived();
  fluidManager.handleRevived();
  jukeboxManager.handleRevived();
}


// function incrementLevel() {
//   levelManager.incrementLevel();
//   currentLevel = levelManager.getCurrentLevel();
//   backgroundColor = currentLevel.initialBackgroundColor;
//   player.changeLevel();
//   platformManager.changeLevel();
//   fluidManager.changeLevel();
//   jukeboxManager.changeLevel();
//   drawMode = currentLevel.initialDrawMode;

//   audioManager.startSounds(currentLevel.genre);

//   if (currentLevel.genre === TITLE_GENRE) {
//     isMultiplayerMode = false;
//     // audioManager.unloopCurrentSound();
//   }
// }


function returnToSongSelectionScreen(genre) {
  returningToSongSelectionScreen = true;
  audioManager.resetSoundProperties(genre);
  //audioManager.stopSounds();
  let wasMultiplayerMode = isMultiplayerMode;
  changeLevel(TITLE_GENRE);
  isMultiplayerMode = wasMultiplayerMode;
  currentLevel.currentScreen = SONG_SELECTION_SCREEN;
  let songToSample =
    audioManager.songs.filter(song => song.soundInfo.genre === genre)[0];
  //audioManager.resetSongProperties(songToSample);
  currentLevel.currentItemSelected =
    audioManager.songs.indexOf(songToSample);

  audioManager.playSongSample(genre);
  returningToSongSelectionScreen = false;
}


function changeLevel(genre) {
  score = 0;
  streak = 0;
  levelManager.changeLevel(genre);
  currentLevel = levelManager.getCurrentLevel();
  newBackgroundColor = currentLevel.initialBackgroundColor;
  player.changeLevel();
  platformManager.changeLevel();
  fluidManager.changeLevel();
  jukeboxManager.changeLevel();
  drawMode = currentLevel.initialDrawMode;

  if (genre !== TITLE_GENRE) {
    if (platformManager.mode === PLATFORMER_MODE && midiManager.hasMIDIFile(genre)) {
      platformManager.platformWidth = width * 2;
      midiManager.playMIDIFileForGenre(genre);
    } else {
      if (platformManager.mode === PLATFORMER_MODE) {
        platformManager.platformWidth = platformManager.defaultPlatformWidth;
      } else {
        midiManager.setRootNoteForGenre(genre);
        midiManager.setNoteRangeForGenre(genre);
      }
      MIDI.Player.removeListener();
      audioManager.startSounds(genre);
    }
  } else {
    audioManager.startSounds(genre);
  }

  if (genre !== TITLE_GENRE) {
    audioManager.updateSoundSpeed(INITIAL_SOUND_SPEED, 0);
    audioManager.updateVolume(INITIAL_VOLUME, 0);
    audioManager.updateReverb(INITIAL_REVERB);

    //audioManager.unloopCurrentSound();
  } else {
    audioManager.resetSoundProperties(genre);
    if (platformManager.mode === MIDI_MODE) {
      platformManager.disableMIDIMode();
    }
    midiManager.stopMIDI();
    playerRole = GAMER;
    isMultiplayerMode = false;
    currentLevel.currentItemSelected = 0;
    currentLevel.currentScreen = MAIN_MENU_SCREEN;
    newBackgroundColor = ColorScheme.WHITE;

  }
}


function handlePausing() {
  player.handlePausing();
  audioManager.handlePausing();
  midiManager.handlePausing();
  if (!player.isReviving) {
    platformManager.handlePausing();
    fluidManager.handlePausing();
    jukeboxManager.handlePausing();
  }
}


function updateBackgroundBrightness(newBrightness, fadeTime) {
  let currentBgColor = oldBackgroundColor;
  let currentHue = hue(currentBgColor);
  let currentSat = saturation(currentBgColor);
  newBackgroundColor = color(currentHue, currentSat, newBrightness);

  if (fadeTime > 0) {
    backgroundColorFadeTime = fadeTime;
    backgroundColorFadeTimer = fadeTime;
  }
}


function updateBackgroundHue(hueChange, saturationChange, fadeTime) {
  //console.log(hue(oldBackgroundColor), saturation(oldBackgroundColor), brightness(oldBackgroundColor));
  let currentBgColor = oldBackgroundColor;
  let currentHue = hue(currentLevel.initialBackgroundColor);
  let currentBrightness = brightness(currentBgColor);
  let newHue = currentHue + hueChange;
  if (newHue < 0) {
    newHue = 360 - newHue;
  } else {
    newHue = newHue % 360;
  }
  let saturation = (audioManager.soundSpeed === INITIAL_SOUND_SPEED ? 0 : 100);

  if (audioManager.soundSpeed !== INITIAL_SOUND_SPEED) {
    saturation += saturationChange;
  }

  newBackgroundColor = color(newHue, saturation, currentBrightness);

  if (fadeTime > 0) {
    backgroundColorFadeTime = fadeTime;
    backgroundColorFadeTimer = fadeTime;
  }
}


function handleUnpausing() {
  player.handleUnpausing();
  audioManager.handleUnpausing();
  midiManager.handleUnpausing();
  if (!player.isReviving) {
    platformManager.handleUnpausing();
    fluidManager.handleUnpausing();
    jukeboxManager.handleUnpausing();
  }
}


function changeToSongSelectionScreen() {
  currentLevel.currentItemSelected = 0;
  let menuItems = audioManager.songs;
  let genre = menuItems[currentLevel.currentItemSelected].soundInfo.genre;
  audioManager.playSongSample(genre);
  currentLevel.currentScreen = SONG_SELECTION_SCREEN;
}


function changeToControllerSelectionScreen() {
  // if (networkMode === ONLINE) {
  //   socket.emit('add player to room', playerRole);
  // }
  controllerSelected = false;
  currentLevel.currentScreen = CONTROLLER_SELECTION_SCREEN;
  currentLevel.currentItemSelected = 0;
  if (playerRole === MUSICIAN || networkMode === LOCAL) {
    midiManager.getAvailableMIDIDevices();
  }
  // else if (playerRole === GAMER && networkMode === ONLINE) {
  //   socket.emit('ready');
  // }
}


function connectMIDIController(controller, instrument, scale) {
  midiManager.setInputController(controller, instrument, scale);
}


function disconnectMIDIControllers() {
  midiManager.disconnectInputControllers();
  controllerSelected = false;
}


function startSinglePlayerMode(genre, gameSeed) {
  if (!gameSeed) {
    gameSeed = random(10000);
  }
  randomSeed(gameSeed);
  changeLevel(genre);
}


function startMultiplayerMode(genre, gameSeed) {
  if (!gameSeed) {
    gameSeed = random(10000);
  }
  randomSeed(gameSeed);
  if (platformManager.mode !== MIDI_MODE) {
    platformManager.enableMIDIMode();
  }

  changeLevel(genre);
}


function displayScore() {
  displayingScore = true;
  handlePausing();
  isPaused = !isPaused;
}


function getStrokeColorFromStreak(streak) {
  if (streak < STREAK_THRESHOLD_1) {
    return ColorScheme.BLACK;
  } else if (streak < STREAK_THRESHOLD_2) {
    return ColorScheme.ETHEREAL_SAPPHIRE;
  } else if (streak < STREAK_THRESHOLD_3) {
    return ColorScheme.ETHEREAL_GOLD;
  } else {
    return ColorScheme.WHITE;
  }
}


function getStrokeWeightFromStreak(streak) {
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
