/// <reference path="TSDef/p5.global-mode.d.ts" />

/**
 * CONTROLS:
 * - Left/Right arrow key to move
 * - Space to jump
 * - 1 to cycle through parts
 */

let audioFilePaths = [];
let sounds = [];
let audioManager;

let animationController;
let uiManager;
let levelManager;

let player;
let platformManager;
let fluidManager;
let jukeboxManager;

function preload() {
  audioManager = new AudioManager();
  animationController = new AnimationController();
  audioManager.loadSounds();
}


function setup() {
  // Disable scroll bar from appearing when pressing space
  window.onkeydown = function (e) {
    return !(e.keyCode == 32);
  };

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  createCanvas(windowWidth, windowHeight);

  levelManager = new LevelManager();

  currentLevel = levelManager.getCurrentLevel();
  backgroundColor = currentLevel.initialBackgroundColor;
  colorFilter = currentLevel.initialColorFilter;
  drawMode = currentLevel.initialDrawMode;

  audioManager.startSounds();


  uiManager = new UIManager();



  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
  jukeboxManager = new JukeboxManager();
}


function draw() {
  background(backgroundColor);

  // audioManager.update();

  animationController.drawBackgroundSoundAnimations();

  player.speed = player.baseSpeed * audioManager.soundSpeed;

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

  fluidManager.drawFluids();
  animationController.drawForegroundSoundAnimations();
  jukeboxManager.drawJukeboxes();
  platformManager.drawPlatforms();
  drawSprite(player.sprite);
  uiManager.drawUI();
  push();
  fill(colorFilter);
  rect(0, 0, window.width, window.height);
  pop();
}


function handleControls() {
  if (keyIsDown(RIGHT_ARROW)) {
    player.sprite.setSpeed(player.speed, 0);
  } else if (keyIsDown(LEFT_ARROW)) {
    player.sprite.setSpeed(player.speed, 180);
  } else {
    player.sprite.setSpeed(0, 0);
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

function keyReleased() {
  if (key == '1') {
    audioManager.playNextSound();
  }
}