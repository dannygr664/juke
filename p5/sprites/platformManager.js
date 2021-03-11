const DEFAULT_BASE_PLATFORM_SPEED = 0.5;
const NUMBER_OF_PLATFORMS = 8;
const STARTING_PLATFORM_WIDTH = 800;
const PLATFORM_WIDTH = 250;
const PLATFORM_HEIGHT = 5;
const PLATFORM_SPACING = 200;
let platformYMin;
let platformYMax;
let platformColorActive;
let platformColorInactive;

class PlatformManager {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_PLATFORM_SPEED;
    this.platforms = new Group();
    this.platformYMin = windowHeight / 4;
    this.platformYMax = windowHeight;
    this.platformColorActive = color(0);
    this.platformColorInactive = color(255, 0, 70);

    for (let i = 0; i < NUMBER_OF_PLATFORMS; i++) {
      let platform = createSprite(
        windowWidth / 2 + i * PLATFORM_SPACING,
        random(this.platformYMin, this.platformYMax),
        (i === 0) ? STARTING_PLATFORM_WIDTH : PLATFORM_WIDTH,
        PLATFORM_HEIGHT
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
      this.platforms[i].setSpeed(this.baseSpeed * songSpeed, 180);
    }
  }

  spawnPlatform(platform) {
    platform.width = PLATFORM_WIDTH; // to reset initial platform
    platform.position.x = windowWidth + PLATFORM_WIDTH / 2;
    platform.position.y = random(this.platformYMin, this.platformYMax);
  }

  drawPlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      drawSprite(this.platforms[i]);
    }
  }
}