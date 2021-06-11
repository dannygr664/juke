const DEFAULT_BASE_PLATFORM_SPEED = 0.5;
const DEFAULT_PLATFORM_HEIGHT = 18;
const DEFAULT_PLATFORM_SPACING = 200;

const PLATFORMER_MODE = 0;
const MIDI_MODE = 1;

let startingPlatformWidth;

class PlatformManager {
  constructor() {
    this.mode = PLATFORMER_MODE;
    this.baseSpeed = DEFAULT_BASE_PLATFORM_SPEED;
    this.platforms = new Group();
    this.platformYMin = height / 4;
    this.platformYMax = height;
    this.platformWidth = 100;
    this.platformHeight = DEFAULT_PLATFORM_HEIGHT;
    this.minPlatformYPos = height * 0.17;
    this.platformSpacing = width / 7;
    this.beatTimer = 0;
    this.platformColor = levelManager.getCurrentLevel().platformColor;
    this.oldPlatformColor = this.platformColor;
    this.newPlatformColor = this.platformColor;
    this.platformColorFadeTime = 0;
    this.platformColorFadeTimer = 0;

    startingPlatformWidth = width / 1.5;
  }

  enableMIDIMode() {
    this.mode = MIDI_MODE;
    this.platformWidth = width * 2;
  }

  disableMIDIMode() {
    this.mode = PLATFORMER_MODE;
    this.platformWidth = width / 8;
  }

  createInitialPlatform() {
    let platform = createSprite(
      width / 2,
      height / 2 - this.platformHeight / 2,
      startingPlatformWidth,
      this.platformHeight
    );
    platform.shapeColor = this.platformColor;
    if (levelManager.getCurrentLevel().genre === TITLE_GENRE) {
      this.baseSpeed = 0;
    } else {
      this.baseSpeed = DEFAULT_BASE_PLATFORM_SPEED;
    }
    platform.setSpeed(this.baseSpeed, 180);
    platform.setDefaultCollider();
    this.platforms.add(platform);
    return platform;
  }

  createColoredPlatformAtHeight(platformColor, yPos) {
    let platform = createSprite(
      width + this.platformWidth / 2,
      yPos - this.platformHeight / 2,
      this.platformWidth,
      this.platformHeight
    );
    platform.shapeColor = platformColor;
    platform.setSpeed(this.baseSpeed, 180);
    platform.setDefaultCollider();
    this.platforms.add(platform);
    return platform;
  }

  terminateMIDIPlatform(platform) {
    if (platform) {
      let platformIndex = this.platforms.indexOf(platform);

      let newPlatformWidth = width - (platform.position.x - platform.width / 2);

      let newPlatform = createSprite(
        (width + (width - newPlatformWidth)) / 2,
        platform.position.y,
        newPlatformWidth,
        this.platformHeight
      );
      let platformToRemove = this.platforms.get(platformIndex);

      if (platformToRemove) {
        newPlatform.shapeColor = platformToRemove.shapeColor;
        platformToRemove.remove();
      } else {
        newPlatform.shapeColor = this.platformColor;
      }

      newPlatform.setSpeed(this.baseSpeed, 180);
      newPlatform.setDefaultCollider();
      this.platforms.add(newPlatform);
    }
  }

  managePlatforms() {
    let oldBeatTimer = this.beatTimer;
    this.beatTimer = audioManager.getCurrentSound().currentTime()
      % audioManager.getDurationOfBeat();
    if (oldBeatTimer > this.beatTimer) {
      streak++;
      if (this.mode === PLATFORMER_MODE && !midiManager.hasMIDIFile(levelManager.getCurrentLevel().genre)) {
        let newPlatform = this.spawnPlatform();
        this.updatePlatformSpeed(newPlatform);
      }
    }

    for (let i = 0; i < this.platforms.size(); i++) {
      if (this.platforms.get(i).position.x < -this.platforms.get(i).width / 2) {
        this.platforms.get(i).remove();
      } else {
        //this.updatePlatformWidth(this.platforms.get(i));
        this.updatePlatformSpeed(this.platforms.get(i));
      }
    }
  }

  calculatePlatformSpeed() {
    let durationOfFourBeats = audioManager.getDurationOfBeat() * 4;
    return durationOfFourBeats * 1.5;
  }

  spawnPlatform() {
    let sound = audioManager.getCurrentSound();
    let spectrum = sound.fft.analyze();
    // let peakAmplitudeValue = 0;
    // let peakFrequencyIndex = 0;
    let spectralCentroid = sound.fft.getCentroid();
    let nyquistFrequency = 22050;
    let meanFrequencyIndex = spectralCentroid / (nyquistFrequency / spectrum.length);
    // for (let i = 0; i < spectrum.length; i++) {
    //   if (spectrum[i] > peakAmplitudeValue) {
    //     peakFrequencyIndex = i;
    //   }
    // }

    let note = floor(map(meanFrequencyIndex % (spectrum.length / 8), 0, spectrum.length / 8, midiManager.noteMin, midiManager.noteMax));
    let yPos = map(note, midiManager.noteMin, midiManager.noteMax, height, platformManager.minPlatformYPos);
    console.log(yPos);

    let platform = this.createColoredPlatformAtHeight(midiManager.getNoteColor(note), yPos);
    midiManager.spawningPlatforms[note] = platform;
    setTimeout(() => {
      midiManager.spawningPlatforms[note] = null;
    }, 500);


    return platform;
  }

  updatePlatformWidth(platform) {
    if (platform.width !== startingPlatformWidth) {
      let rms = audioManager.getCurrentSound().amplitudeAnalyzer.getLevel();
      platform.width = map(rms, 0, 0.05 * VOLUME_MAX, 7 * this.platformWidth / 8, this.platformWidth);
    }
  }

  updatePlatformSpeed(platform) {
    this.baseSpeed = this.calculatePlatformSpeed();
    platform.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
  }

  drawPlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
      drawSprite(this.platforms[i]);
    }
  }

  handleFalling() {
    if (!isMultiplayerMode) {
      this.pausePlatforms();
    }
  }

  handleRevived() {
    if (!isMultiplayerMode) {
      this.resumePlatforms();
    }
  }

  handlePausing() {
    this.pausePlatforms();
  }

  handleUnpausing() {
    this.resumePlatforms();
  }

  pausePlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
      this.platforms[i].previousColor = this.platforms[i].shapeColor;
      this.platforms[i].shapeColor = ColorScheme.BLACK_INACTIVE;
      this.platforms[i].setSpeed(0, 180);
    }
  }

  resumePlatforms() {
    for (let i = 0; i < this.platforms.size(); i++) {
      if (this.platforms[i].previousColor) {
        this.platforms[i].shapeColor = this.platforms[i].previousColor;
      } else {
        this.platforms[i].shapeColor = this.platformColor;
      }
      if (levelManager.getCurrentLevel().genre !== TITLE_GENRE) {
        this.platforms[i].setSpeed(this.baseSpeed, 180);
      }
    }
  }

  changeLevel() {
    this.platforms.removeSprites();
    this.triggerUpdatePlatformColor(levelManager.getCurrentLevel().platformColor, 0);
    this.createInitialPlatform();
  }

  triggerUpdatePlatformColor(newColor, platformColorFadeTime) {
    if (platformColorFadeTime > 0) {
      this.newPlatformColor = newColor;
      this.platformColorFadeTimer = platformColorFadeTime;
      this.platformColorFadeTime = platformColorFadeTime;
    } else {
      this.platformColor = newColor;
      for (let i = 0; i < this.platforms.size(); i++) {
        this.platforms[i].shapeColor = newColor;
      }
    }
  }

  updatePlatformColor() {
    if (this.platformColorFadeTimer > 0) {
      this.platformColor = lerpColor(this.newPlatformColor, this.oldPlatformColor, map(this.platformColorFadeTimer, 0, this.platformColorFadeTime, 0, 1));
      for (let i = 0; i < this.platforms.size(); i++) {
        this.platforms[i].shapeColor = this.platformColor;
      }
      this.platformColorFadeTimer--;
    } else if (this.newPlatformColor !== this.oldPlatformColor) {
      this.oldPlatformColor = this.newPlatformColor;
    }
  }
}