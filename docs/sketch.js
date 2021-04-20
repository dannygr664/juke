/// <reference path="TSDef/p5.global-mode.d.ts" />

/**
 * CONTROLS:
 * - Left/Right arrow key to move
 * - Space to jump
 * - 1 to cycle through parts
 */

let TITLE_GENRE = 'City';

let audioFilePaths = [];
let sounds = [];
let audioManager;
let midiManager;

let animationController;
let uiManager;
let levelManager;

let player;
let platformManager;
let fluidManager;
let jukeboxManager;

function preload() {
  isLoaded = false;
  audioManager = new AudioManager();
  animationController = new AnimationController();

  audioManager.loadSounds();
  titleFont = loadFont('graphics/fonts/HelveticaNeue-UltraLight.ttf');
  itemFont = loadFont('graphics/fonts/HelveticaNeue-Thin.ttf');
}


function setup() {
  // Disable scroll bar from appearing when pressing space
  window.onkeydown = function (e) {
    return !(e.keyCode == 32);
  };

  isLoaded = true;

  isAwake = false;

  isPaused = false;

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  createCanvas(windowWidth, windowHeight);

  levelManager = new LevelManager();

  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;

  audioManager.loadFilter();
  audioManager.loadReverb();

  uiManager = new UIManager();
}


function wakeUp() {
  audioManager.startSounds(currentLevel.genre);

  animationController.loadAnimations();

  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
  jukeboxManager = new JukeboxManager();

  MIDIManager.initialize();
  MIDIManager.connectToMIDIDevice();

  audioManager.assignSoundAnimations();
  audioManager.assignSoundCues();

  audioManager.unloopCurrentSound();

  isAwake = true;
}


function draw() {
  background(backgroundColor);

  //animationController.drawBackgroundSoundAnimations();

  if (isAwake) {
    if (!isPaused) {
      audioManager.update();
    }

    if (currentLevel.genre !== TITLE_GENRE) {
      if (!isPaused) {
        player.speed = player.baseSpeed * audioManager.soundSpeed;
        player.gravityForce = DEFAULT_GRAVITY_FORCE * map(audioManager.reverbLevel, 0, 1, 1, 0.4);

        if (player.isReviving) {
          revivingLoop();
        } else {
          handleControls();

          handleCollisionsAndJumping();

          platformManager.managePlatforms();
          fluidManager.manageFluids();
          jukeboxManager.manageJukeboxes();
          handleFalling();
        }
      }

      fluidManager.drawFluids();
      //animationController.drawForegroundSoundAnimations();
      jukeboxManager.drawJukeboxes();
      platformManager.drawPlatforms();
      drawSprite(player.sprite);
    }
  }

  uiManager.drawUI();
}


function handleControls() {
  if (currentLevel.genre !== TITLE_GENRE && !isPaused) {
    if (keyIsDown(RIGHT_ARROW)) {
      player.sprite.setSpeed(player.speed, 0);
    } else if (keyIsDown(LEFT_ARROW)) {
      player.sprite.setSpeed(player.speed, 180);
    } else {
      player.sprite.setSpeed(0, 0);
    }
  }
}


function handleCollisionsAndJumping() {
  if (player.sprite.collide(platformManager.platforms)) {
    player.gravitySpeed = 0;
    if (keyDown(' ')) {
      player.jump();
    }
  }

  let currentLevel = levelManager.getCurrentLevel();

  if (!player.sprite.overlap(fluidManager.fluids, currentLevel.handleFluidEnter)) {
    currentLevel.handleFluidExit();
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
  if (player.sprite.position.y > windowHeight) {
    player.handleFalling();
    audioManager.handleFalling();
    platformManager.handleFalling();
    fluidManager.handleFalling();
    jukeboxManager.handleFalling();
  }
}


function revivingLoop() {
  if (player.sprite.position.y < windowHeight / 6) {
    player.sprite.setSpeed(0, 270);
    if (keyDown(' ')) {
      player.isReviving = false;
      audioManager.handleRevived();
      platformManager.handleRevived();
      fluidManager.handleRevived();
      jukeboxManager.handleRevived();
    } else {
      handleControls();
    }
  }
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
}


function changeLevel(level) {
  levelManager.changeLevel(level);
  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;
  player.changeLevel();
  platformManager.changeLevel();
  fluidManager.changeLevel();
  jukeboxManager.changeLevel();
  drawMode = currentLevel.initialDrawMode;

  audioManager.startSounds(currentLevel.genre);
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


function handleUnpausing() {
  player.handleUnpausing();
  audioManager.handleUnpausing();
  if (!player.isReviving) {
    platformManager.handleUnpausing();
    fluidManager.handleUnpausing();
    jukeboxManager.handleUnpausing();
  }
}


function keyPressed() {
  if (isLoaded) {
    if (currentLevel.genre === TITLE_GENRE) {
      // Main Menu
      if (currentLevel.currentScreen === 0) {
        if (keyCode === DOWN_ARROW) {
          currentLevel.currentItemSelected =
            (currentLevel.currentItemSelected + 1) % currentLevel.menuItems.length;
        } else if (keyCode === UP_ARROW) {
          if (currentLevel.currentItemSelected === 0) {
            currentLevel.currentItemSelected = currentLevel.menuItems.length - 1;
          } else {
            currentLevel.currentItemSelected =
              (currentLevel.currentItemSelected - 1) % currentLevel.menuItems.length;
          }
        } else if (key === ' ' || keyCode === RETURN || keyCode === ENTER) {
          currentSelection = currentLevel.menuItems[currentLevel.currentItemSelected];
          switch (currentSelection) {
            case 'Play':
              changeLevel(1);
              break;
            case 'How To Play':
              currentLevel.currentScreen = 1;
              break;
            case 'Credits':
              currentLevel.currentScreen = 2;
              break;
          }
        }
        // How To Play
      } else if (currentLevel.currentScreen === 1) {
        if (keyCode === ESCAPE) {
          currentLevel.currentScreen = 0;
        }
        // Credits
      } else if (currentLevel.currentScreen === 2) {
        if (keyCode === ESCAPE) {
          currentLevel.currentScreen = 0;
        }
      }
    } else {
      if (keyCode === ESCAPE) {
        if (isPaused) {
          handleUnpausing();
        } else {
          handlePausing();
        }
        isPaused = !isPaused;
      } else if (isPaused) {
        if (key === 'q' || key === 'Q') {
          audioManager.stopSounds();
          isPaused = !isPaused;
          changeLevel(0);
          audioManager.unloopCurrentSound();
        }
      }
    }
  }
}


function mousePressed() {
  if (!isAwake) {
    wakeUp();
  }
}
