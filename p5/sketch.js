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
let amplitudeAnalyzer, fft;
let filter, filterFreq, filterRes;

let player;
let platformManager;
let platforms;
let fluid;

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
  initializeAudio();

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
  createFluid();
}


function draw() {
  background(backgroundColor);

  updateVolume();
  updateSongSpeed();

  if (drawMode == 0) {
    drawVolumeAnimations();
  } else {
    drawFrequencyAnimations();
  }

  drawUI();

  player.speed = player.baseSpeed * songSpeed;

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
    manageFluid();
    handleFalling();
  }

  drawSprite(fluid);
  platformManager.drawPlatforms();
  drawSprite(player.sprite);
}


function initializeAudio() {
  filter = new p5.LowPass();
  filter.set(22050, 0);

  song.disconnect();
  song.connect(filter);

  song.loop();

  INITIAL_VOLUME = 0;
  volume = INITIAL_VOLUME;
  VOLUME_STEP = 0.01;

  songSpeed = 1;
  SONG_SPEED_STEP = 0.01;

  // Volume analysis
  amplitudeAnalyzer = new p5.Amplitude();
  amplitudeAnalyzer.setInput(song);

  // Pitch analysis
  fft = new p5.FFT;
  fft.setInput(song);
}


function initializeVariables() {
  backgroundColor = color(255);

  platformColor = color(0);
  platformColorInactive = color(255, 0, 70);
  platformSpeed = 0.5;
  STARTING_PLATFORM_WIDTH = 800;
  PLATFORM_WIDTH = 250;
  PLATFORM_HEIGHT = 5;
  PLATFORM_Y_MIN = windowHeight / 4;
  PLATFORM_Y_MAX = windowHeight;
  PLATFORM_SPAWN_PROBABILITY = 0.006;
  NUMBER_OF_PLATFORMS = 8;
  PLATFORM_SPACING = 200;

  FLUID_Y_MIN = PLATFORM_Y_MIN;
  FLUID_Y_MAX = PLATFORM_Y_MAX;
  FLUID_WIDTH_MIN = PLATFORM_WIDTH / 5;
  FLUID_WIDTH_MAX = PLATFORM_WIDTH * 3;
  FLUID_HEIGHT_MIN = 40;
  FLUID_HEIGHT_MAX = 40 * 6;
  FLUID_COLORS = [color(0, 100, 100), color(100, 100, 100), color(200, 100, 100), color(255, 100, 100)];
}


function createFluid() {
  fluid = createSprite(
    windowWidth * 2,
    random(PLATFORM_Y_MIN, PLATFORM_Y_MAX),
    random(FLUID_WIDTH_MIN, FLUID_WIDTH_MAX),
    random(FLUID_HEIGHT_MIN, FLUID_HEIGHT_MAX)
  );
  fluid.shapeColor = random(FLUID_COLORS);
  fluid.setSpeed(platformSpeed, 180);
}


function updateVolume() {
  if (keyDown('q' || 'Q')) {
    volume += VOLUME_STEP;
  } else if (keyDown('z' || 'Z')) {
    volume -= VOLUME_STEP;
  }
  volume = constrain(volume, 0, 1);
  song.amp(volume);
}


function updateSongSpeed() {
  if (keyDown('w' || 'W')) {
    songSpeed += SONG_SPEED_STEP;
  } else if (keyDown('x' || 'X')) {
    songSpeed -= SONG_SPEED_STEP;
  }
  songSpeed = constrain(songSpeed, 0.01, 4);
  song.rate(songSpeed);
}


function drawUI() {
  drawVolumeMeter();
  drawSongSpeedMeter();
}


function drawVolumeMeter() {
  fill(0);
  text('Volume', 0, 5);
  fill(0, 100, 50);
  rect(70, 5, map(volume, 0, 1, 0, 200), 20);
  fill(0);
}


function drawSongSpeedMeter() {
  fill(0);
  text('Speed', 0, 35);
  fill(95, 100, 50);
  rect(70, 35, map(songSpeed, 0.01, 4, 0, 200), 20);
  fill(0);
}


function drawVolumeAnimations() {
  rms = amplitudeAnalyzer.getLevel();

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

  let spectrum = fft.analyze();

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


function manageFluid() {
  if (fluid.position.x < -fluid.width / 2) {
    spawnFluid();
  }
  fluid.setSpeed(platformSpeed * songSpeed, 180);
}


function spawnFluid() {
  fluid.shapeColor = random(FLUID_COLORS);
  fluid.width = random(FLUID_WIDTH_MIN, FLUID_WIDTH_MAX);
  fluid.height = random(FLUID_HEIGHT_MIN, FLUID_HEIGHT_MAX);
  fluid.position.x = windowWidth + fluid.width / 2;
  fluid.position.y = random(FLUID_Y_MIN, FLUID_Y_MAX);
}


function handleFalling() {
  if (player.sprite.position.y > windowHeight) {
    player.isReviving = true;
    player.gravitySpeed = 0;
    filter.set(200, 1);
    for (let i = 0; i < platformManager.platforms.length; i++) {
      platformManager.platforms[i].shapeColor = platformColorInactive;
      platformManager.platforms[i].setSpeed(0, 180);
    }
    fluid.setSpeed(0, 180);
    player.sprite.setSpeed(50, 270);
  }
}


function revivingLoop() {
  if (player.sprite.position.y < windowHeight / 6) {
    player.sprite.setSpeed(0, 270);
    if (keyDown(' ')) {
      player.isReviving = false;
      filter.set(22050, 0);
      for (let i = 0; i < platformManager.platforms.length; i++) {
        platformManager.platforms[i].shapeColor = platformColor;
        platformManager.platforms[i].setSpeed(platformSpeed, 180);
      }
      fluid.setSpeed(platformSpeed, 180);
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