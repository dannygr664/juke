const DEFAULT_BASE_PLATFORM_SPEED = 0.5;
const DEFAULT_NUMBER_OF_PLATFORMS = 8;
const DEFAULT_PLATFORM_HEIGHT = 5;
const DEFAULT_PLATFORM_SPACING = 200;

const PLATFORMER_MODE = 0;
const MIDI_MODE = 1;

let startingPlatformWidth;

class PlatformManager {
  constructor() {
    this.mode = PLATFORMER_MODE;
    this.baseSpeed = DEFAULT_BASE_PLATFORM_SPEED;
    this.platforms = new Group();
    this.platformYMin = windowHeight / 4;
    this.platformYMax = windowHeight;
    this.platformWidth = windowWidth / 4;
    this.platformHeight = DEFAULT_PLATFORM_HEIGHT;
    this.platformSpacing = DEFAULT_PLATFORM_SPACING;

    startingPlatformWidth = windowWidth / 1.5;

    this.initializePlatforms();
  }

  enableMIDIMode() {
    this.mode = MIDI_MODE;
    for (let i = 0; i < this.platforms.size(); i++) {
      let toRemove = this.platforms.get(i);
      this.platforms.remove(toRemove);
      toRemove.remove();
    }
    this.platforms.clear();
    this.initializeMIDIPlatforms(25);
  }

  initializePlatforms() {
    for (let i = 0; i < DEFAULT_NUMBER_OF_PLATFORMS; i++) {
      let platform = createSprite(
        windowWidth / 2 + i * this.platformSpacing,
        random(this.platformYMin, this.platformYMax),
        this.plaformWidth,
        this.platformHeight
      );
      platform.shapeColor = ColorScheme.BLACK;
      platform.setSpeed(this.baseSpeed, 180);
      this.platforms.add(platform);
    }
  }

  initializeMIDIPlatforms(numberOfPlatforms) {
    for (let i = 0; i < numberOfPlatforms; i++) {
      let platform = createSprite(
        -this.platformWidth / 2,
        (i + 0.5) * windowHeight / numberOfPlatforms,
        this.plaformWidth,
        this.platformHeight
      );
      platform.shapeColor = ColorScheme.BLACK;
      platform.setSpeed(this.baseSpeed, 0);
      this.platforms.add(platform);
    }
  }

  managePlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
      if (this.platforms.get(i).position.x < -this.platforms.get(i).width / 2) {
        if (this.mode === PLATFORMER_MODE) {
          this.spawnPlatform(this.platforms.get(i));
          this.triggerPlatform(this.platforms.get(i));
        } else if (this.mode === MIDI_MODE) {
          this.platforms.get(i).setSpeed(0, 180);
        }
      }
      this.baseSpeed = this.calculatePlatformSpeed();
      this.platforms.get(i).setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
    }
  }

  calculatePlatformSpeed() {
    let durationOfFourBeats = audioManager.getDurationOfFourBeats();
    return durationOfFourBeats * 1.5;
  }

  spawnPlatform(platform) {
    platform.position.x = windowWidth + this.platformWidth / 2;
    platform.shapeColor = ColorScheme.BLACK;
  }

  triggerPlatform(platform) {
    platform.setSpeed(this.baseSpeed, 180);
  }

  drawPlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
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
    for (let i = 0; i < this.platforms.size(); i++) {
      this.platforms[i].shapeColor = ColorScheme.BLACK_INACTIVE;
      this.platforms[i].setSpeed(0, 180);
    }
  }

  resumePlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
      this.platforms[i].shapeColor = ColorScheme.BLACK;
      this.platforms[i].setSpeed(this.baseSpeed, 180);
    }
  }
}