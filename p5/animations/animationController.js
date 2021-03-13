const DEFAULT_ANIMATION_TYPE = 0;
const DEFAULT_ANIMATION = 0;
const NUMBER_OF_ANIMATIONS = 6;

let noiseAnim;
let boxesAnim;
let linesAnim;
let blindsAnim;

let moireAnim;

class AnimationController {
  constructor() {
    noiseAnim = new Noise();
    boxesAnim = new Boxes();
    linesAnim = new Lines();
    blindsAnim = new Blinds();
  }

  createJukeboxAnimation(xPosition, width) {
    moireAnim = new Moire(
      xPosition,
      0,
      xPosition,
      windowHeight,
      width,
      ColorScheme.BLACK
    )
  }

  drawJukeboxAnimation(xPosition) {
    moireAnim.x1 = xPosition;
    moireAnim.x2 = xPosition;
    moireAnim.drawMoire();
  }

  setJukeboxAnimationColor(color) {
    moireAnim.color = color;
  }

  getSoundAnimationForSound(sound) {
    switch (sound.soundInfo.genre) {
      case 'Ethereal':
        return 0;
      default:
        return 0;
    }
  }

  getSoundAnimationTypeForSoundAnimation(soundAnimation) {
    if (soundAnimation === 5) {
      return 1;
    } else {
      return 0;
    }
  }

  drawSoundAnimations() {
    audioManager.sounds.filter(sound => sound.isPlaying()).forEach(sound => {
      this.drawSoundAnimation(sound);
    });
  }

  drawSoundAnimation(sound) {
    if (sound.animationType === 0) {
      this.drawVolumeAnimations(sound);
    } else {
      this.drawFrequencyAnimations(sound);
    }
  }

  drawVolumeAnimations(sound) {
    let rms = sound.amplitudeAnalyzer.getLevel();

    if (sound.animation === 0) {
      noiseAnim.drawNoise(rms);
    } else if (sound.animation === 1) {
      boxesAnim.drawBoxes(rms);
    } else if (sound.animation === 2) {
      blindsAnim.drawBlinds(rms);
    } else if (sound.animation === 3) {
      linesAnim.drawLines1(rms);
    } else if (sound.animation === 4) {
      linesAnim.drawLines2(rms);
    }
  }

  drawFrequencyAnimations(sound) {
    fill(255, 0, 90, 80);

    let spectrum = sound.fft.analyze();

    let spectrumStep = 10;
    for (let i = 0; i < spectrum.length; i += spectrumStep) {
      rect(
        map(i, 0, spectrum.length - 1, 0, windowWidth),
        0,
        windowWidth / (255 / spectrumStep),
        map(spectrum[i], 0, 255, height, 0)
      );
    }

    fill(0);
  }
}