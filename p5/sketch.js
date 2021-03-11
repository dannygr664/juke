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

let animationController;

let player;
let platformManager;
let fluidManager;

function preload() {
  soundFormats('wav', 'mp3');
  song = loadSound('audio/Calvin.wav');
}


function setup() {
  audioManager = new AudioManager(song);

  colorMode(HSB, 360, 100, 100, 100);

  createCanvas(windowWidth, windowHeight);

  backgroundColor = color(255);
  fill(0);
  noStroke();
  drawMode = 0;

  animationController = new AnimationController();

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

  animationController.draw();

  drawUI();

  player.speed = player.baseSpeed * audioManager.songSpeed;

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