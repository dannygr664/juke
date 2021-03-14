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

let player;
let platformManager;
let fluidManager;
let jukeboxManager;

function preload() {
  soundFormats('wav', 'mp3');
  getAudioFilePaths();
  animationController = new AnimationController();
  loadSounds();
}


function getAudioFilePaths() {
  // let etherealAudioFileNames = [
  //   'Angel1_88bpm4-4_L8M',
  //   'Angel2_88bpm4-4_L17M',
  //   'Angel3_88bpm4-4_L4M',
  //   'Angel4_88bpm4-4_L8M',
  //   'Angel5_88bpm4-4_L8M',
  //   'Angel6_88bpm4-4_L12M',
  //   'Angel7_88bpm4-4_L12M',
  //   'Mateo1_88bpm4-4_L17M',
  //   'Mateo2_88bpm4-4_L17M',
  //   'Mateo3_88bpm4-4_L17M',
  //   'LostShipSynth_88bpm4-4_L4M',
  //   'NeomazeBass_88bpm4-4_L4M'
  // ];

  let etherealAudioFileNames = [
    'Angel1_88bpm4-4_L8M',
    '2Parts_88bpm4-4_L17M',
    '3Parts_88bpm4-4_L17M',
    '4Parts_88bpm4-4_L17M',
    '5Parts_88bpm4-4_L17M',
    '6Parts_88bpm4-4_L17M',
    '7Parts_88bpm4-4_L17M',
    '8Parts_88bpm4-4_L17M',
    '9Parts_88bpm4-4_L17M',
    '10Parts_88bpm4-4_L17M',
    '11Parts_88bpm4-4_L21M',
  ];

  etherealAudioFileNames.forEach(etherealAudioFileName => {
    audioFilePaths.push(`audio/Ethereal/Juke_Ethereal_${etherealAudioFileName}.mp3`);
  });

  let lofiAudioFileNames = [
    'Break_87bpm4-4_L4M',
    'Build_87bpm4-4_L1M',
    'Cymbal_87bpm4-4_L2.5B',
    'Ending_87bpm4-4_L4.5B',
    'Intro_87bpm4-4_L4M',
    'Section1_87bpm4-4_L4M',
    'Section2_87bpm4-4_L9M',
    'Section3_87bpm4-4_L14M',
    'Section4_87bpm4-4_L4M',
    'Section5_87bpm4-4_L4M',
    'Section6_87bpm4-4_L14M',
  ];

  lofiAudioFileNames.forEach(lofiAudioFileName => {
    audioFilePaths.push(`audio/LoFi/Juke_LoFi_${lofiAudioFileName}.mp3`);
  });
}


function loadSounds() {
  for (let i = 0; i < audioFilePaths.length; i++) {
    let sound = loadSound(audioFilePaths[i]);
    sound.soundInfo = AudioFilePathParser.parseFilePath(audioFilePaths[i]);

    sound.animation = animationController.getSoundAnimationForSound(sound);
    sound.animationType = animationController.getSoundAnimationTypeForSoundAnimation(
      sound.animation
    );

    sounds.push(sound);
  }
}


function setup() {
  // Disable scroll bar from appearing when pressing space
  window.onkeydown = function (e) {
    return !(e.keyCode == 32);
  };

  audioManager = new AudioManager(sounds);

  colorMode(HSB, 360, 100, 100, 100);

  ColorScheme.initializeColorScheme();

  createCanvas(windowWidth, windowHeight);

  backgroundColor = ColorScheme.WHITE;
  colorFilter = ColorScheme.CLEAR;
  fill(0);
  noStroke();
  drawMode = 0;

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

  if (!player.sprite.overlap(fluidManager.fluids, handleFluidEnter)) {
    audioManager.updateVolume(INITIAL_VOLUME);
  }

  player.sprite.overlap(jukeboxManager.jukeboxes, handleJukeboxEnter);

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

function handleJukeboxEnter(_, _) {
  // colorFilterter = ColorScheme.getFilterColor(jukeboxManager.currentAnimationColor);
  // switch (fluid.shapeColor) {
  //   case ColorScheme.RED:
  //     audioManager.updateVolume(1);
  //     break;
  //   case ColorScheme.BLUE:
  //     audioManager.updateVolume(0.25);
  //     break;
  //   case ColorScheme.GREEN:
  //     audioManager.updateVolume(0);
  //     break;
  //   case ColorScheme.YELLOW:
  //     audioManager.updateVolume(0.75);
  //     break;
  // }
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