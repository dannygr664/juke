/// <reference path="TSDef/p5.global-mode.d.ts" />

let socket;

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

const MIN_WIDTH = 800;
const MAX_WIDTH = 900;
const MIN_HEIGHT = 500;

const GAMER = 0;
const MUSICIAN = 1;

function preload() {
  isLoaded = false;
  isAwake = false;
  isMultiplayerMode = false;
  controllerSelected = false;
  playerRole = GAMER;
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

  audioManager.loadFilter();
  audioManager.loadReverb();

  uiManager = new UIManager();

  createBoundingRectangles();

  socket = io();
  socket.on('game start', startMultiplayerMode);
}


function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}


function wakeUp() {
  audioManager.startSounds(currentLevel.genre);

  animationController.loadAnimations();

  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
  jukeboxManager = new JukeboxManager();

  audioManager.assignSoundAnimations();
  audioManager.assignSoundCues();

  audioManager.unloopCurrentSound();

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

          jukeboxManager.manageJukeboxes();

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

      player.drawEnergyMeter();

      player.drawStroke();

      drawSprite(player.sprite);
    }
  }

  uiManager.drawUI();
}


function createBoundingRectangles() {
  leftBoundingRectangle = createSprite(-140, -height * 2, 280, height * 8);
  leftBoundingRectangle.setDefaultCollider();
  rightBoundingRectangle = createSprite(width + 140, -height * 2, 280, height * 8);
  rightBoundingRectangle.setDefaultCollider();
}


function movementControls() {
  if ((currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) && !isPaused && playerRole === GAMER) {
    handleMovementControls(keyIsDown(RIGHT_ARROW), keyIsDown(LEFT_ARROW));
  }
}


function handleMovementControls(isRightArrowDown, isLeftArrowDown) {
  if (isRightArrowDown) {
    player.sprite.setSpeed(player.speed, 0);
  } else if (isLeftArrowDown) {
    player.sprite.setSpeed(player.speed, 180);
  } else {
    player.sprite.setSpeed(0, 0);
  }
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
    if (playerRole === GAMER && keyDown(' ')) {
      player.jump();
    }
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
    player.handleFalling();
    audioManager.handleFalling();
    platformManager.handleFalling();
    fluidManager.handleFalling();
    jukeboxManager.handleFalling();
  }
}


function revivingLoop() {
  if (player.sprite.position.y < height / 6) {
    player.sprite.setSpeed(0, 270);
    if (playerRole === GAMER && keyDown(' ')) {
      handleRevived();
    } else {
      movementControls();
    }
  }
}


function handleRevived() {
  player.isReviving = false;
  player.sprite.shapeColor = player.color;
  audioManager.handleRevived();
  platformManager.handleRevived();
  fluidManager.handleRevived();
  jukeboxManager.handleRevived();
}


function incrementLevel() {
  levelManager.incrementLevel();
  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;
  player.changeLevel();
  platformManager.changeLevel();
  fluidManager.changeLevel();
  jukeboxManager.changeLevel();
  drawMode = currentLevel.initialDrawMode;

  audioManager.startSounds(currentLevel.genre);

  if (currentLevel.genre === TITLE_GENRE) {
    isMultiplayerMode = false;
    audioManager.unloopCurrentSound();
  }
}


function changeLevel(level) {
  levelManager.changeLevel(level);
  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;
  player.changeLevel();
  if (level === 0 && platformManager.mode === MIDI_MODE) {
    platformManager.disableMIDIMode();
  }
  platformManager.changeLevel();
  fluidManager.changeLevel();
  jukeboxManager.changeLevel();
  drawMode = currentLevel.initialDrawMode;

  audioManager.startSounds(currentLevel.genre);
  if (currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) {
    audioManager.updateVolume(INITIAL_VOLUME, 0);
  }

  if (currentLevel.genre === TITLE_GENRE) {
    playerRole = GAMER;
    isMultiplayerMode = false;
    currentLevel.currentScreen = MAIN_MENU_SCREEN;
    audioManager.unloopCurrentSound();
  }
}


function handlePausing() {
  player.handlePausing();
  audioManager.handlePausing();
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
  if (!player.isReviving) {
    platformManager.handleUnpausing();
    fluidManager.handleUnpausing();
    jukeboxManager.handleUnpausing();
  }
}


function changeToControllerSelectionScreen() {
  socket.emit('add player to room', playerRole);
  currentLevel.currentScreen = CONTROLLER_SELECTION_SCREEN;
  currentLevel.currentItemSelected = 0;
  if (playerRole === MUSICIAN) {
    midiManager.getAvailableMIDIDevices();
  } else if (playerRole === GAMER) {
    socket.emit('ready');
  }
}


function connectMIDIController(controller) {
  midiManager.setInputController(controller);
  midiManager.initializeSynth();
}


function startMultiplayerMode(gameSeed) {
  randomSeed(0);
  isMultiplayerMode = true;
  if (platformManager.mode !== MIDI_MODE) {
    platformManager.enableMIDIMode();
  }

  changeLevel(1);
}


function keyPressed() {
  if (isLoaded && isAwake) {
    if (currentLevel.genre === TITLE_GENRE) {
      if (currentLevel.currentScreen === MAIN_MENU_SCREEN || currentLevel.currentScreen === MODE_SELECTION_SCREEN || currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
        menuSelectionKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN) {
        controllerSelectionScreenKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === HOW_TO_PLAY_SCREEN) {
        howToPlayScreenKeyPressed(key, keyCode);
      } else if (currentLevel.currentScreen === CREDITS_SCREEN) {
        creditsScreenKeyPressed(key, keyCode);
      }
    } else {
      pauseOrQuitKeyPressed(key, keyCode);
    }
  } else if (isLoaded && !isAwake) {
    wakeUp();
  }
}


function menuSelectionKeyPressed(key, keyCode) {
  let menuItems = currentLevel.screenToMenuItems[currentLevel.currentScreen];
  if (keyCode === DOWN_ARROW) {
    currentLevel.currentItemSelected =
      (currentLevel.currentItemSelected + 1) % menuItems.length;
  } else if (keyCode === UP_ARROW) {
    if (currentLevel.currentItemSelected === 0) {
      currentLevel.currentItemSelected = menuItems.length - 1;
    } else {
      currentLevel.currentItemSelected =
        (currentLevel.currentItemSelected - 1) % menuItems.length;
    }
  } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
    currentSelection = menuItems[currentLevel.currentItemSelected];

    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      switch (currentSelection) {
        case 'Play':
          currentLevel.currentScreen = MODE_SELECTION_SCREEN;
          break;
        case 'How To Play':
          player.changeLevel();
          platformManager.changeLevel();
          currentLevel.currentScreen = HOW_TO_PLAY_SCREEN;
          break;
        case 'Credits':
          currentLevel.currentScreen = CREDITS_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Single Player':
          changeLevel(1);
          break;
        case 'Multiplayer':
          currentLevel.currentScreen = ROLE_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Gamer':
          playerRole = GAMER;
          changeToControllerSelectionScreen();
          break;
        case 'Musician':
          playerRole = MUSICIAN;
          changeToControllerSelectionScreen();
      }
    }
  } else if (keyCode === ESCAPE) {
    if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      currentLevel.currentScreen = MAIN_MENU_SCREEN;
      currentLevel.currentItemSelected = 0;
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      currentLevel.currentScreen = MODE_SELECTION_SCREEN;
      currentLevel.currentItemSelected = 0;
    }
  }
}


function controllerSelectionScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (controllerSelected) {
      socket.emit('not ready');
      controllerSelected = false;
    } else {
      socket.emit('remove player from room');
      currentLevel.currentScreen = ROLE_SELECTION_SCREEN;
      currentLevel.currentItemSelected = 0;
      playerRole = GAMER;
    }
  } else {
    if (playerRole === MUSICIAN)
      handleControllerSelectionScreenKeyPressed(key, keyCode);
  }
}


function handleControllerSelectionScreenKeyPressed(key, keyCode) {
  if (playerRole === MUSICIAN) {
    let menuItems = midiManager.controllers;
    if (menuItems.length > 0 && keyCode !== ESCAPE) {
      if (keyCode === DOWN_ARROW) {
        currentLevel.currentItemSelected =
          (currentLevel.currentItemSelected + 1) % menuItems.length;
      } else if (keyCode === UP_ARROW) {
        if (currentLevel.currentItemSelected === 0) {
          currentLevel.currentItemSelected = menuItems.length - 1;
        } else {
          currentLevel.currentItemSelected =
            (currentLevel.currentItemSelected - 1) % menuItems.length;
        }
      } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
        controllerSelected = true;
        connectMIDIController(midiManager.controllers[currentLevel.currentItemSelected]);
        socket.emit('ready');
      }
    }
  }
}


function howToPlayScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (isPaused) {
      handleUnpausing();
    } else {
      handlePausing();
    }
    isPaused = !isPaused;
  } else if (isPaused) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      audioManager.stopSounds();
      isPaused = !isPaused;
      changeLevel(0);
    }
  }
}


function creditsScreenKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    currentLevel.currentScreen = MAIN_MENU_SCREEN;
    currentLevel.currentItemSelected = 0;
  }
}


function pauseOrQuitKeyPressed(key, keyCode) {
  if (isMultiplayerMode) {
    socket.emit('pause or quit', {
      key: key,
      keyCode: keyCode
    });
  }
  handlePauseOrQuitKeyPressed(key, keyCode);
}


function handlePauseOrQuitKeyPressedMessage(data) {
  if (isMultiplayerMode) {
    handlePauseOrQuitKeyPressed(data.key, data.keyCode);
  }
}


function handlePauseOrQuitKeyPressed(key, keyCode) {
  if (keyCode === ESCAPE) {
    if (isPaused) {
      handleUnpausing();
    } else {
      handlePausing();
    }
    isPaused = !isPaused;
  } else if (isPaused) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      audioManager.stopSounds();
      isPaused = !isPaused;
      changeLevel(0);
    }
  }
}


function mousePressed() {
  if (isLoaded) {
    handleMousePressed();
  }
}


function handleMousePressed() {
  if (!isAwake) {
    wakeUp();
  } else if (currentLevel.genre === TITLE_GENRE && (
    currentLevel.currentScreen === MAIN_MENU_SCREEN
    || currentLevel.currentScreen === MODE_SELECTION_SCREEN
    || currentLevel.currentScreen === ROLE_SELECTION_SCREEN
  )) {
    currentSelection = (currentLevel.screenToMenuItems[currentLevel.currentScreen])[currentLevel.currentItemSelected];
    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      switch (currentSelection) {
        case 'Play':
          currentLevel.currentScreen = MODE_SELECTION_SCREEN;
          break;
        case 'How To Play':
          player.changeLevel();
          platformManager.changeLevel();
          currentLevel.currentScreen = HOW_TO_PLAY_SCREEN;
          break;
        case 'Credits':
          currentLevel.currentScreen = CREDITS_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Single Player':
          changeLevel(1);
          break;
        case 'Multiplayer':
          currentLevel.currentScreen = ROLE_SELECTION_SCREEN;
          break;
      }
    } else if (currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      switch (currentSelection) {
        case 'Gamer':
          playerRole = GAMER;
          changeToControllerSelectionScreen();
          break;
        case 'Musician':
          playerRole = MUSICIAN;
          changeToControllerSelectionScreen();
      }
    }
  } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN && midiManager.controllers.length > 0) {
    controllerSelected = true;
    connectMIDIController(midiManager.controllers[currentLevel.currentItemSelected]);
    socket.emit('ready');
  }
}


function mouseMoved() {
  if (isAwake) {
    handleMouseMoved(mouseY);
  }
}


function handleMouseMoved(yPos) {
  if (currentLevel.genre === TITLE_GENRE) {
    if (currentLevel.currentScreen === MAIN_MENU_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1);
      if (yPos <= currentLevel.getYPosOfItem(1) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 0;
      } else if (yPos <= currentLevel.getYPosOfItem(2) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 1;
      } else {
        currentLevel.currentItemSelected = 2;
      }
    } else if (currentLevel.currentScreen === MODE_SELECTION_SCREEN || currentLevel.currentScreen === ROLE_SELECTION_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1);
      if (yPos <= currentLevel.getYPosOfItem(1) + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 0;
      } else {
        currentLevel.currentItemSelected = 1;
      }
    } else if (currentLevel.currentScreen === CONTROLLER_SELECTION_SCREEN) {
      const DISTANCE_BETWEEN_ITEMS = currentLevel.getYPosOfItem(2) - currentLevel.getYPosOfItem(1.5);
      let isLastItemSelected = true;
      for (let i = 0; i < midiManager.controllers.length; i++) {
        if (yPos <= currentLevel.getYPosOfItem((i * 0.5) + 1.5) + (DISTANCE_BETWEEN_ITEMS / 2)) {
          currentLevel.currentItemSelected = i;
          isLastItemSelected = false;
          break;
        }
      }
      if (isLastItemSelected) {
        currentLevel.currentItemSelected = midiManager.controllers.length - 1;
      }
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
