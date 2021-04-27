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

let leftBoundingRectangle;
let rightBoundingRectangle;

const MIN_WIDTH = 800;
const MAX_WIDTH = 900;
const MIN_HEIGHT = 500;

function preload() {
  isLoaded = false;
  isAwake = false;
  audioManager = new AudioManager();
  animationController = new AnimationController();

  audioManager.loadSounds();
  gameTitleFont = loadFont('graphics/fonts/Zapfino.ttf');
  titleFont = loadFont('graphics/fonts/HelveticaNeue-UltraLight.ttf');
  itemFont = loadFont('graphics/fonts/HelveticaNeue-Thin.ttf');
}


function setup() {
  // Disable scroll bar from appearing when pressing space
  window.onkeydown = function (e) {
    return !(e.keyCode == 32);
  };

  isLoaded = true;

  isPaused = false;

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  levelManager = new LevelManager();

  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;

  audioManager.loadFilter();
  audioManager.loadReverb();

  uiManager = new UIManager();

  createBoundingRectangles();
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

  // MIDIManager.initialize();
  // MIDIManager.connectToMIDIDevice();

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

    if (currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === 1) {
      if (!isPaused) {
        player.speed = player.baseSpeed * audioManager.soundSpeed;
        player.gravityForce = DEFAULT_GRAVITY_FORCE * map(audioManager.reverbLevel, 0, 1, 1, 0.4);

        handleBorderCollisions();

        if (player.isReviving) {
          revivingLoop();
        } else {
          handleControls();
          handleCollisionsAndJumping();

          if (currentLevel.genre !== TITLE_GENRE) {
            platformManager.managePlatforms();
            fluidManager.manageFluids();
          }

          jukeboxManager.manageJukeboxes();

          let newEnergy = player.energy + 0.05;
          player.energy = min(newEnergy, currentLevel.maxEnergy);
          player.updatePlayerColor(color(
            hue(player.color),
            saturation(player.color),
            brightness(player.color),
            map(player.energy, 0, currentLevel.maxEnergy, 0, 100)
          ));
          handleFalling();
        }
      }

      fluidManager.drawFluids();
      //animationController.drawForegroundSoundAnimations();
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
  leftBoundingRectangle = createSprite(-20, -height * 2, 40, height * 8);
  leftBoundingRectangle.setDefaultCollider();
  rightBoundingRectangle = createSprite(width + 20, -height * 2, 40, height * 8);
  rightBoundingRectangle.setDefaultCollider();
}


function handleControls() {
  if ((currentLevel.genre !== TITLE_GENRE || currentLevel.currentScreen === 1) && !isPaused) {
    if (keyIsDown(RIGHT_ARROW)) {
      player.sprite.setSpeed(player.speed, 0);
    } else if (keyIsDown(LEFT_ARROW)) {
      player.sprite.setSpeed(player.speed, 180);
    } else {
      player.sprite.setSpeed(0, 0);
    }
  }
}


function handleBorderCollisions() {
  player.sprite.collide(leftBoundingRectangle);
  player.sprite.collide(rightBoundingRectangle);
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
    if (keyDown(' ')) {
      player.isReviving = false;
      player.sprite.shapeColor = player.color;
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

  if (currentLevel.genre === TITLE_GENRE) {
    audioManager.unloopCurrentSound();
  }
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

  if (currentLevel.genre === TITLE_GENRE) {
    currentLevel.currentScreen = 0;
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


function updateBackgroundBrightness(newBrightness) {
  let currentBgColor = backgroundColor;
  let currentHue = hue(currentBgColor);
  let currentSat = saturation(currentBgColor);
  backgroundColor = color(currentHue, currentSat, newBrightness);
}


function updateBackgroundHue(hueChange, saturationChange) {
  let currentBgColor = backgroundColor;
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

  backgroundColor = color(newHue, saturation, currentBrightness);
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
  if (isLoaded && isAwake) {
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
              player.changeLevel();
              platformManager.changeLevel();
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
        if (keyCode === DELETE || keyCode === BACKSPACE) {
          audioManager.stopSounds();
          isPaused = !isPaused;
          changeLevel(0);
        }
      }
    }
  } else if (isLoaded && !isAwake) {
    wakeUp();
  }
}


function mousePressed() {
  if (!isAwake) {
    wakeUp();
  } else if (currentLevel.genre === TITLE_GENRE && currentLevel.currentScreen === 0) {
    currentSelection = currentLevel.menuItems[currentLevel.currentItemSelected];
    switch (currentSelection) {
      case 'Play':
        changeLevel(1);
        break;
      case 'How To Play':
        player.changeLevel();
        platformManager.changeLevel();
        currentLevel.currentScreen = 1;
        break;
      case 'Credits':
        currentLevel.currentScreen = 2;
        break;
    }
  }
}

function mouseMoved() {
  if (isAwake) {
    const DISTANCE_BETWEEN_ITEMS = currentLevel.item2Y - currentLevel.item1Y;
    if (currentLevel.genre === TITLE_GENRE && currentLevel.currentScreen === 0) {
      // Main Menu
      if (mouseY <= currentLevel.item1Y + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected =
          0;
      } else if (mouseY <= currentLevel.item2Y + (DISTANCE_BETWEEN_ITEMS / 2)) {
        currentLevel.currentItemSelected = 1;
      } else {
        currentLevel.currentItemSelected = 2;
      }
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
