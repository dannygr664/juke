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

let song;
let audioManager;

let player;
let platformManager;
let fluidManager;

let drawMode;

let volumeDrawMode = 0;
let noiseAnim;
let boxesAnim;
let linesAnim;

function preload() {
  soundFormats('wav', 'mp3');
  song = loadSound('audio/Calvin.wav');
}


function setup() {
  audioManager = new AudioManager(song);

  colorMode(HSB, 360, 100, 100, 100);

  initializeVariables();

  createCanvas(windowWidth, windowHeight);

  fill(0);
  noStroke();
  drawMode = 0;

  noiseAnim = new Noise();
  boxesAnim = new Boxes();
  linesAnim = new Lines();
  blindsAnim = new Blinds();

  textAlign(LEFT, TOP)
  textFont('Helvetica Neue');
  textSize(20);

  player = new Player();
  platformManager = new PlatformManager();
  fluidManager = new FluidManager();
}


function draw() {
  background(backgroundColor);

  audioManager.update();

  if (drawMode == 0) {
    drawVolumeAnimations();
  } else {
    drawFrequencyAnimations();
  }

  drawUI();

  player.speed = player.baseSpeed * audioManager.songSpeed;

  if (player.isReviving) {
    revivingLoop();
  } else {
    handleControls();

    if (player.sprite.collide(platformManager.platforms)) {
      player.gravitySpeed = 0;
      if (keyDown(' ')) {
        player.jump();
      }
    }

    if (player.jumpSpeed > 0) {
      player.jumpSpeed -= player.gravityForce;
      player.sprite.addSpeed(player.jumpSpeed, 270);
    } else {
      player.handleGravity();
    }
    platformManager.managePlatforms();
    fluidManager.manageFluids();
    handleFalling();
  }

  fluidManager.drawFluids();
  platformManager.drawPlatforms();
  drawSprite(player.sprite);
}


function initializeVariables() {
  backgroundColor = color(255);
}


function drawUI() {
  drawVolumeMeter();
  drawSongSpeedMeter();
}


function drawVolumeMeter() {
  fill(0);
  text('Volume', 0, 5);
  fill(0, 100, 50);
  rect(70, 5, map(audioManager.volume, 0, 1, 0, 200), 20);
  fill(0);
}


function drawSongSpeedMeter() {
  fill(0);
  text('Speed', 0, 35);
  fill(95, 100, 50);
  rect(70, 35, map(audioManager.songSpeed, 0.01, 4, 0, 200), 20);
  fill(0);
}


function drawVolumeAnimations() {
  rms = audioManager.amplitudeAnalyzer.getLevel();

  if (volumeDrawMode === 3) {
    noiseAnim.drawNoise(player.isReviving);
  } else if (volumeDrawMode === 4) {
    boxesAnim.drawBoxes(player.isReviving);
  } else if (volumeDrawMode === 5) {
    blindsAnim.drawBlinds();
  } else {
    linesAnim.drawLines();
  }
}


function drawFrequencyAnimations() {
  fill(255, 0, 90, 80);

  let spectrum = audioManager.fft.analyze();

  spectrumStep = 10;
  for (i = 0; i < spectrum.length; i += spectrumStep) {
    rect(map(i, 0, spectrum.length - 1, 0, windowWidth), 0, windowWidth / (255 / spectrumStep), map(spectrum[i], 0, 255, height, 0));
  }
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
      audioManager.filter.set(22050, 0);
      for (let i = 0; i < platformManager.platforms.length; i++) {
        platformManager.platforms[i].shapeColor = platformManager.platformColorActive;
        platformManager.platforms[i].setSpeed(platformManager.baseSpeed, 180);
      }
      for (let i = 0; i < fluidManager.fluids.length; i++) {
        fluidManager.fluids[i].setSpeed(platformManager.baseSpeed, 180);
      }
    } else if (keyIsDown(RIGHT_ARROW)) {
      player.sprite.setSpeed(1.5, 0);
    } else if (keyIsDown(LEFT_ARROW)) {
      player.sprite.setSpeed(1.5, 180);
    } else {
      player.sprite.setSpeed(0, 0);
    }
  }
}


function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();

  if (keyCode === SHIFT) {
    (drawMode === 0) ? (drawMode = 1) : (drawMode = 0);
  }

  if (key == '1') {
    volumeDrawMode = 1;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '2') {
    volumeDrawMode = 2;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '3') {
    volumeDrawMode = 3;
  }
  if (key == '4') {
    volumeDrawMode = 4;
  }
  if (key == '5') {
    volumeDrawMode = 5;
  }
}