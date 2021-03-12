/// <reference path="TSDef/p5.global-mode.d.ts" />

/**
 * CONTROLS:
 * - Left/Right arrow key to move
 * - Space to jump
 * - 1-5 to change volume animations
 * - Shift to switch between volume and frequency animations
 * - Q/Z to increase/decrease volume
 * - W/X to increase/decrease song speed
 */

let audioFilePaths = [];
let sounds = [];
let audioManager;

let animationController;
let uiManager;

let player;
let platformManager;
let fluidManager;

function preload() {
  soundFormats('wav', 'mp3');
  getAudioFilePaths();
  loadSounds();
}


function getAudioFilePaths() {
  let etherealAudioFileNames = [
    'Angel1_88bpm4-4_L8M',
    'Angel2_88bpm4-4_L17M',
    'Angel3_88bpm4-4_L4M'
  ];

  etherealAudioFileNames.forEach(etherealAudioFileName => {
    audioFilePaths.push(`audio/Ethereal/Juke_Ethereal_${etherealAudioFileName}`);
  });
}


function loadSounds() {
  audioFilePaths.forEach(audioFilePath => {
    let sound = loadSound(audioFilePath);
    sounds.push(sound);
  });
}


function setup() {
  audioManager = new AudioManager(sounds);

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  createCanvas(windowWidth, windowHeight);

  backgroundColor = ColorScheme.WHITE;
  fill(0);
  noStroke();
  drawMode = 0;

  animationController = new AnimationController();

  uiManager = new UIManager();

  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
}


function draw() {
  background(backgroundColor);

  audioManager.update();

  animationController.draw();

  player.speed = player.baseSpeed * audioManager.soundSpeed;

  if (player.isReviving) {
    revivingLoop();
  } else {
    handleControls();

    handleCollisionsAndJumping();

    platformManager.managePlatforms();
    fluidManager.manageFluids();
    handleFalling();
  }

  fluidManager.drawFluids();
  platformManager.drawPlatforms();
  drawSprite(player.sprite);
  uiManager.drawUI();
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

  if (!player.sprite.overlap(fluidManager.fluids, handleFluidEnter)) {
    audioManager.updateSoundSpeed(INITIAL_SOUND_SPEED);
  }

  if (player.jumpSpeed > 0) {
    player.jumpSpeed -= player.gravityForce;
    player.sprite.addSpeed(player.jumpSpeed, 270);
  } else {
    player.handleGravity();
  }
}


function handleFluidEnter(_, fluid) {
  switch (fluid.shapeColor) {
    case ColorScheme.RED:
      audioManager.updateSoundSpeed(0.5);
      break;
    case ColorScheme.BLUE:
      audioManager.updateSoundSpeed(1.5);
      break;
    case ColorScheme.GREEN:
      audioManager.updateSoundSpeed(4);
      break;
    case ColorScheme.YELLOW:
      audioManager.updateSoundSpeed(2);
      break;
  }
}


function handleFalling() {
  if (player.sprite.position.y > windowHeight) {
    player.handleFalling();
    audioManager.handleFalling();
    platformManager.handleFalling();
    fluidManager.handleFalling();
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
    } else {
      handleControls();
    }
  }
}

function keyReleased() {
  if (keyCode === SHIFT) {
    (animationController.drawMode === 0) ? (animationController.drawMode = 1) : (animationController.drawMode = 0);
  }

  if (key == '1') {
    animationController.volumeDrawMode = 1;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '2') {
    animationController.volumeDrawMode = 2;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '3') {
    animationController.volumeDrawMode = 3;
  }
  if (key == '4') {
    animationController.volumeDrawMode = 4;
  }
  if (key == '5') {
    animationController.volumeDrawMode = 5;
  }
}