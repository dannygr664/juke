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
    this.platformColorActive = color(0);
    this.platformColorInactive = color(255, 0, 70);

    startingPlatformWidth = windowWidth / 1.5;

    for (let i = 0; i < NUMBER_OF_PLATFORMS; i++) {
      let platform = createSprite(
        windowWidth / 2 + i * this.platformSpacing,
        random(this.platformYMin, this.platformYMax),
        (i === 0) ? startingPlatformWidth : this.platformWidth,
        this.platformHeight
      );
      platform.shapeColor = this.platformColorActive;
      platform.setSpeed(this.baseSpeed, 180);
      this.platforms.add(platform);
    }
  }

  managePlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].position.x < -this.platforms[i].width / 2) {
        this.spawnPlatform(this.platforms[i]);
      }
      this.platforms[i].setSpeed(this.baseSpeed * audioManager.songSpeed, 180);
    }
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
}