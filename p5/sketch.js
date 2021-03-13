/// <reference path="TSDef/p5.global-mode.d.ts" />

/**
 * CONTROLS:
 * - Left/Right arrow key to move
 * - Space to jump
 * - 1 to bring in/out synth
 * - 2 to bring in/out bass
 * - 3 to cycle through vocal parts
 * - Q/Z to increase/decrease volume
 */

let audioFilePaths = [];
let sounds = [];
let audioManager;

let animationController;
let uiManager;

let player;
let platformManager;
let fluidManager;
let jukebox;

function preload() {
  soundFormats('wav', 'mp3');
  getAudioFilePaths();
  loadSounds();
}


function getAudioFilePaths() {
  let etherealAudioFileNames = [
    'Angel1_88bpm4-4_L8M',
    'Angel2_88bpm4-4_L17M',
    'Angel3_88bpm4-4_L4M',
    'Angel4_88bpm4-4_L8M',
    'Angel5_88bpm4-4_L8M',
    'Angel6_88bpm4-4_L12M',
    'Angel7_88bpm4-4_L12M',
    'Mateo1_88bpm4-4_L17M',
    'Mateo2_88bpm4-4_L17M',
    'Mateo3_88bpm4-4_L17M',
    'LostShipSynth_88bpm4-4_L4M',
    'NeomazeBass_88bpm4-4_L4M'
  ];

  etherealAudioFileNames.forEach(etherealAudioFileName => {
    audioFilePaths.push(`audio/Ethereal/Juke_Ethereal_${etherealAudioFileName}.mp3`);
  });
}


function loadSounds() {
  for (let i = 0; i < audioFilePaths.length; i++) {
    let sound = loadSound(audioFilePaths[i]);
    sound.soundInfo = AudioFilePathParser.parseFilePath(audioFilePaths[i]);
    let animation = i % NUMBER_OF_ANIMATIONS;
    if (animation === 5) {
      sound.animationType = 1;
    } else {
      sound.animationType = 0;
    }
    sound.animation = animation;
    sounds.push(sound);
  }
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
  jukebox = new Jukebox();
}


function draw() {
  background(backgroundColor);

  // audioManager.update();

  animationController.drawSoundAnimations();

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
  jukebox.drawJukebox();
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
    audioManager.updateVolume(INITIAL_VOLUME);
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
      audioManager.updateVolume(1);
      break;
    case ColorScheme.BLUE:
      audioManager.updateVolume(0.25);
      break;
    case ColorScheme.GREEN:
      audioManager.updateVolume(0);
      break;
    case ColorScheme.YELLOW:
      audioManager.updateVolume(0.75);
      break;
  }
}


function handleFalling() {
  if (player.sprite.position.y > windowHeight) {
    player.handleFalling();
    audioManager.handleFalling();
    platformManager.handleFalling();
    fluidManager.handleFalling();
    jukebox.handleFalling();
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
      jukebox.handleRevived();
    } else {
      handleControls();
    }
  }
}

function keyReleased() {
  if (key == '1') {
    audioManager.toggleSound(10);
  }
  if (key == '2') {
    audioManager.toggleSound(11);
  }
  if (key == '3') {
    audioManager.playNextSound();
  }
}