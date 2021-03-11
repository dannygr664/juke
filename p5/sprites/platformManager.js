class PlatformManager {
  constructor() {
    this.platforms = new Group();
    for (let i = 0; i < NUMBER_OF_PLATFORMS; i++) {
      let platform = createSprite(
        windowWidth / 2 + i * PLATFORM_SPACING,
        random(PLATFORM_Y_MIN, PLATFORM_Y_MAX),
        (i === 0) ? STARTING_PLATFORM_WIDTH : PLATFORM_WIDTH,
        PLATFORM_HEIGHT
      );
      platform.shapeColor = platformColor;
      platform.setSpeed(platformSpeed, 180);
      this.platforms.add(platform);
    }
  }

  managePlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].position.x < -this.platforms[i].width / 2) {
        spawnPlatform(platforms[i]);
      }
      this.platforms[i].setSpeed(platformSpeed * songSpeed, 180);
    }
  }

  spawnPlatform(platform) {
    platform.width = PLATFORM_WIDTH; // to reset initial platform
    platform.position.x = windowWidth + PLATFORM_WIDTH / 2;
    platform.position.y = random(PLATFORM_Y_MIN, PLATFORM_Y_MAX);
  }

  drawPlatforms() {
    for (let i = 0; i < this.platforms.length; i++) {
      drawSprite(this.platforms[i]);
    }
  }
}