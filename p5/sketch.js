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
let platforms;
let fluid;
let drawMode;

// Noise animation
var agents = [];
var agentCount = 100;
var noiseScale = 0.1;
var noiseStrength = 0.1;
var overlayAlpha = 50;
var agentAlpha = 10;
var strokeWidth = 0.3;

// Lines animation
var NORTH = 0;
var NORTHEAST = 1;
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;
var direction;
var stepSize = 1;
var diameter = 1;
var posX;
var posY;

// Boxes animation
let maxDistance;

// Origami animation
var tileCount = 10;
var actRandomSeed = 0;
var rectSize = 30;
var ORIGAMI_SCALE_FACTOR = 200;
var origamiColor;

var volumeDrawMode = 0;
var counter = 0;

function preload() {
  soundFormats('wav');
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

  // Volume animations
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent();
  }

  // Lines animation
  posX = width / 2;
  posY = height / 2;

  // Boxes animation
  maxDistance = windowWidth * 2;

  // Origami animation
  origamiColor = color(200, 50, 50, 20);

  textAlign(LEFT, TOP)
  textFont('Helvetica Neue');
  textSize(20);

  createPlayer();
  createPlatforms();
  // createFluid();
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

  currentPlayerSpeed = playerSpeed * songSpeed;

  if (isReviving) {
    revivingLoop();
  } else {
    handleControls();

    if (player.collide(platforms)) {
      gravitySpeed = 0;
      if (keyDown(' ')) {
        jump();
      }
    }

    if (jumpSpeed > 0) {
      jumpSpeed -= gravityForce;
      player.addSpeed(jumpSpeed, 270);
    } else {
      handleGravity();
    }
    managePlatforms();
    handleFalling();
  }

  for (var i = 0; i < platforms.length; i++) {
    drawSprite(platforms[i]);
  }

  drawSprite(player);
}


function initializeAudio() {
  filter = new p5.LowPass();
  filter.set(22050, 0);

  song.disconnect();
  song.connect(filter);
  
  song.loop();

  volume = 0.5;
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
  
  playerColor = color(0);
  playerSpeed = 4;
  currentPlayerSpeed = playerSpeed;
  jumpForce = 10;
  jumpSpeed = 0;
  isReviving = false;

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

  gravityForce = 0.35;
  gravitySpeed = 0;
}


function createPlayer() {
  player = createSprite(
    windowWidth/2, windowHeight/2 - windowHeight/8, 40, 40);
  player.shapeColor = playerColor;
}


function createPlatforms() {
  platforms = new Group();
  for (var i = 0; i < NUMBER_OF_PLATFORMS; i++) {
    var platform = createSprite(
      windowWidth/2 + i * PLATFORM_SPACING,
      random(PLATFORM_Y_MIN, PLATFORM_Y_MAX),
      (i === 0) ? STARTING_PLATFORM_WIDTH : PLATFORM_WIDTH,
      PLATFORM_HEIGHT
    );
    platform.shapeColor = platformColor;
    platform.setSpeed(platformSpeed, 180);
    platforms.add(platform);
  }
}

// function createFluid() {
//   fluid = createSprite(
//     windowWidth * 2,
//     random(PLATFORM_Y_MIN, PLATFORM_Y_MAX),
//     random(FLUID_WIDTH_MIN, FLUID_WIDTH_MAX),
//     random(FLUID_HEIGHT_MIN, FLUID_HEIGHT_MAX)
//   );
//   fluid.shapeColor = random(FLUID_COLORS);
// }


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
    drawNoise();
  } else if (volumeDrawMode === 4) {
    drawBoxes();
  } else if (volumeDrawMode === 5) {
    drawOrigami();
  } else {
    drawLines();
  }
}


function drawFrequencyAnimations() {
  fill(255, 0, 90, 80);

  let spectrum = fft.analyze();

  spectrumStep = 10;
  for (i = 0; i < spectrum.length; i += spectrumStep) {
    rect(map(i, 0, spectrum.length - 1, 0, windowWidth), 0, windowWidth/(255/spectrumStep), map(spectrum[i], 0, 255, height, 0));
  }
}


function handleControls() {
  if (keyIsDown(RIGHT_ARROW)) {
    player.setSpeed(currentPlayerSpeed, 0);
  } else if (keyIsDown(LEFT_ARROW)) {
    player.setSpeed(currentPlayerSpeed, 180);
  } else {
    player.setSpeed(0, 0);
  }
}


function jump() {
  jumpSpeed = jumpForce;
  player.setSpeed(jumpSpeed, 270);
}


function handleGravity() {
  gravitySpeed += gravityForce;
  player.addSpeed(gravitySpeed, 90);
}


function managePlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    if (platforms[i].position.x < -platforms[i].width/2) {
      spawnPlatform(platforms[i]);
    }
    platforms[i].setSpeed(platformSpeed * songSpeed, 180);
  }
}


function spawnPlatform(platform) {
  platform.width = PLATFORM_WIDTH; // to reset initial platform
  platform.position.x = windowWidth + PLATFORM_WIDTH/2;
  platform.position.y = random(PLATFORM_Y_MIN, PLATFORM_Y_MAX);
}


function handleFalling() {
  if (player.position.y > windowHeight) {
    isReviving = true;
    gravitySpeed = 0;
    filter.set(200, 1);
    for (var i = 0; i < platforms.length; i++) {
      platforms[i].shapeColor = platformColorInactive;
      platforms[i].setSpeed(0, 180);
    }
    player.setSpeed(50, 270);
  }
}


function revivingLoop() {
  if (player.position.y < windowHeight / 6) {
    player.setSpeed(0, 270);
    if (keyDown(' ')) {
      isReviving = false;
      filter.set(22050, 0);
      for (var i = 0; i < platforms.length; i++) {
        platforms[i].shapeColor = platformColor;
        platforms[i].setSpeed(platformSpeed, 180);
      }
    } else if (keyIsDown(RIGHT_ARROW)) {
      player.setSpeed(1.5, 0);
    } else if (keyIsDown(LEFT_ARROW)) {
      player.setSpeed(1.5, 180);
    } else {
      player.setSpeed(0, 0);
    }
  }
}


// Noise animation
function drawNoise() {
  fill(255, overlayAlpha);
  rect(0, 0, windowWidth, windowHeight);

  noiseStrength = map(rms, 0, 0.1, 0, 20);
  strokeWidth = map(rms, 0, 0.1, 0.1, map(volume, 0, 1, 1, 4));

  // Draw agents
  stroke(isReviving ? platformColorInactive : platformColor, agentAlpha);
  for (var i = 0; i < agentCount; i++) {
    agents[i].update1(noiseScale, noiseStrength, strokeWidth);
  }

  noStroke();
}

var Agent = function() {
  this.vector = createVector(random(windowWidth), random(windowHeight));
  this.vectorOld = this.vector.copy();
  this.stepSize = random(1, 5);
  this.isOutside = false;
  this.angle;
};

Agent.prototype.update = function(strokeWidth) {
  this.vector.x += cos(this.angle) * this.stepSize;
  this.vector.y += sin(this.angle) * this.stepSize;
  this.isOutside = this.vector.x < 0 || this.vector.x > width || this.vector.y < 0 || this.vector.y > height;
  if (this.isOutside) {
    this.vector.set(random(width), random(height));
    this.vectorOld = this.vector.copy();
  }
  strokeWeight(strokeWidth * this.stepSize);
  line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);
  this.vectorOld = this.vector.copy();
  this.isOutside = false;
};

Agent.prototype.update1 = function(noiseScale, noiseStrength, strokeWidth) {
  this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale) * noiseStrength;
  this.update(strokeWidth);
};


// Lines animation
function drawLines() {
  noStroke();

  for (var i = 0; i <= map(rms, 0, 0.05, 0, window.width); i++) {
    counter++;

    // random number for the direction of the next step
    if (volumeDrawMode == 2) {
      direction = int(random(3));
    } else {
      direction = int(random(7));
    }

    if (direction == NORTH) {
      posY -= stepSize;
    } else if (direction == NORTHEAST) {
      posX += stepSize;
      posY -= stepSize;
    } else if (direction == EAST) {
      posX += stepSize;
    } else if (direction == SOUTHEAST) {
      posX += stepSize;
      posY += stepSize;
    } else if (direction == SOUTH) {
      posY += stepSize;
    } else if (direction == SOUTHWEST) {
      posX -= stepSize;
      posY += stepSize;
    } else if (direction == WEST) {
      posX -= stepSize;
    } else if (direction == NORTHWEST) {
      posX -= stepSize;
      posY -= stepSize;
    }

    if (posX > width) posX = 0;
    if (posX < 0) posX = width;
    if (posY < 0) posY = height;
    if (posY > height) posY = 0;

    fill(0, 40);
    ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
  }
}


// Boxes animation
function drawBoxes() {
  fill(isReviving ? platformColorInactive : platformColor, agentAlpha);

  for (var gridY = 0; gridY < windowHeight; gridY += 25) {
    for (var gridX = 0; gridX < windowWidth; gridX += 25) {
      var diameter = dist(
        map(rms, 0, 0.1, 0, windowWidth),
        map(rms, 0, 0.1, 0, windowHeight),
        gridX,
        gridY
      );
      diameter = diameter / maxDistance * 5;
      push();
      translate(gridX, gridY, diameter);
      rect(0, 0, diameter, diameter); // also nice: ellipse(...)
      pop();
    }
  }

  fill(0);
}


// Origami animation
function drawOrigami() {
  fill(origamiColor);
  randomSeed(actRandomSeed);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;

      var shiftX1 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftY1 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftX2 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftY2 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftX3 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftY3 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftX4 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
      var shiftY4 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);

      push();
      translate(posX, posY);
      beginShape();
      vertex(shiftX1, shiftY1);
      vertex(rectSize + shiftX2, shiftY2);
      vertex(rectSize + shiftX3, rectSize + shiftY3);
      vertex(shiftX4, rectSize + shiftY4);
      endShape();
      pop();
    }
  }

  fill(0);
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