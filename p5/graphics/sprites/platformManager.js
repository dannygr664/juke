const DEFAULT_BASE_PLATFORM_SPEED = 0.5;
const NUMBER_OF_PLATFORMS = 8;
const DEFAULT_PLATFORM_HEIGHT = 5;
const DEFAULT_PLATFORM_SPACING = 200;

let startingPlatformWidth;

class PlatformManager {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_PLATFORM_SPEED;
    this.platforms = new Group();
    this.platformYMin = windowHeight / 4;
    this.platformYMax = windowHeight;
    this.platformWidth = windowWidth / 4;
    this.platformHeight = DEFAULT_PLATFORM_HEIGHT;
    this.platformSpacing = DEFAULT_PLATFORM_SPACING;

    startingPlatformWidth = windowWidth / 1.5;

    for (let i = 0; i < NUMBER_OF_PLATFORMS; i++) {
      let platform = createSprite(
        windowWidth / 2 + i * this.platformSpacing,
        random(this.platformYMin, this.platformYMax),
        (i === 0) ? startingPlatformWidth : this.platformWidth,
        this.platformHeight
      );
      platform.shapeColor = ColorScheme.BLACK;
      platform.setSpeed(this.baseSpeed, 180);
      this.platforms.add(platform);
    }
  }

  managePlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].position.x < -this.platforms[i].width / 2) {
        this.spawnPlatform(this.platforms[i]);
      }
      this.baseSpeed = this.calculatePlatformSpeed();
      this.platforms[i].setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
    }
  }

  calculatePlatformSpeed() {
    let durationOfFourBeats = audioManager.getDurationOfFourBeats();
    return durationOfFourBeats * 1.5;
  }

  spawnPlatform(platform) {
    platform.width = this.platformWidth; // to reset initial platform
    platform.position.x = windowWidth + this.platformWidth / 2;
    platform.position.y = random(this.platformYMin, this.platformYMax);
  }

  drawPlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      drawSprite(this.platforms[i]);
    }
  }

  handleFalling() {
    this.pausePlatforms();
  }

  handleRevived() {
    this.resumePlatforms();
  }

  handlePausing() {
    this.pausePlatforms();
  }

  handleUnpausing() {
    this.resumePlatforms();
  }

  pausePlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].shapeColor = ColorScheme.BLACK_INACTIVE;
      this.platforms[i].setSpeed(0, 180);
    }
  }

  resumePlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].shapeColor = ColorScheme.BLACK;
      this.platforms[i].setSpeed(this.baseSpeed, 180);
    }
  }
}