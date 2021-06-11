const FOREGROUND_ANIMATIONS = [0, 3, 4];

const JUKEBOX_OFFSET = 100;

let noiseAnim;
let boxesAnim;
let wipeAnim;
let linesAnim;
let blindsAnim;
let moireAnim;
let jukeboxAnim;
let waveformAnim;

class AnimationController {
  constructor() {

  }

  loadAnimations() {
    noiseAnim = new Noise(
      0,
      width,
      0,
      height,
      ColorScheme.BLACK_INACTIVE
    );
    boxesAnim = new Boxes(
      0,
      width,
      0,
      height,
      ColorScheme.BLACK_INACTIVE
    );
    wipeAnim = new Wipe(
      0,
      width,
      0,
      height,
      ColorScheme.BLACK_INACTIVE
    );
    linesAnim = new Lines(
      0,
      width,
      0,
      height,
      ColorScheme.BLACK_INACTIVE
    );
    blindsAnim = new Blinds(
      0,
      width,
      0,
      height,
      ColorScheme.BLACK_INACTIVE
    );
    waveformAnim = new Waveform(
      0,
      width,
      0,
      height,
      ColorScheme.CLEAR
    );
    jukeboxAnim = new Moire(
      width - JUKEBOX_OFFSET,
      150,
      width - 105,
      height,
      50,
      ColorScheme.BLACK
    );
  }

  createJukeboxAnimation(xPosition, width) {
    moireAnim = new Moire(
      xPosition,
      0,
      xPosition,
      height,
      width,
      ColorScheme.BLACK
    )
  }

  drawJukeboxAnimation(xPosition) {
    moireAnim.x1 = xPosition;
    moireAnim.x2 = xPosition;
    moireAnim.drawMoire(0);
  }

  setJukeboxAnimationColor(color) {
    moireAnim.color = color;
  }

  handleJukeboxFadeout(jukebox) {
    if (jukebox.passed && moireAnim.fadeTimer > 0) {
      moireAnim.fadeTimer -= audioManager.soundSpeed;
    }
  }

  resetJukeboxFadeTimer() {
    moireAnim.resetFadeTimer();
  }

  drawJukebox() {
    const playingSounds = audioManager.sounds
      .filter(sound => sound.isPlaying());
    let rms = 0;
    if (playingSounds.length > 0) {
      rms = playingSounds[0].amplitudeAnalyzer.getLevel();
    }
    jukeboxAnim.drawMoire(rms);
  }

  createFluidAnimation(xPosition, yPosition, width, height, color) {
    let fluidAnim = new Blinds(
      xPosition,
      xPosition + width,
      yPosition,
      yPosition + height,
      color
    );

    return fluidAnim;
  }

  setFluidAnimationColor(anim, color) {
    anim.color = color;
  }

  createPlayerAnimation(xPosition, yPosition, width, height, color) {
    let playerAnim = new Waveform(
      xPosition,
      xPosition + width,
      yPosition,
      yPosition + height,
      color
    );

    return playerAnim;
  }

  setPlayerAnimationColor(anim, color) {
    anim.color = color;
  }

  getSoundAnimationForSound(sound) {
    switch (sound.soundInfo.genre) {
      case 'Ethereal':
        return 0;
      case 'LoFi':
        return 1;
      case 'Spaceship':
        return 2;
      case 'Chill':
        return 3;
      case 'Cinematic':
        return 4;
      default:
        return 2;
    }
  }

  getSoundAnimationTypeForSoundAnimation(soundAnimation) {
    if (soundAnimation === 5) {
      return 1;
    } else {
      return 0;
    }
  }

  drawFluidAnimation(x1, x2, color) {
    audioManager.sounds
      .filter(sound => sound.isPlaying())
      .forEach(sound => { this.drawSoundAnimation(sound, x1, x2, color); });
  }

  drawPlayerAnimation(x1, x2, y1, y2, color) {
    const playingSounds = audioManager.sounds
      .filter(sound => sound.isPlaying());
    let rms = 0;
    if (playingSounds.length > 0) {
      rms = playingSounds[0].amplitudeAnalyzer.getLevel();
    }
    waveformAnim.x1 = x1;
    waveformAnim.x2 = x2;
    waveformAnim.y1 = y1;
    waveformAnim.y2 = y2;
    waveformAnim.color = color;
    waveformAnim.draw(rms);
  }

  drawSoundAnimation(sound, x1, x2, color) {
    this.drawVolumeAnimations(sound, x1, x2, color);
  }

  drawVolumeAnimations(sound, x1, x2, color) {
    let rms = sound.amplitudeAnalyzer.getLevel();

    if (sound.animation === 0) {
      noiseAnim.x1 = x1;
      noiseAnim.x2 = x2;
      noiseAnim.color = color;
      noiseAnim.updateAgentPositions();
      noiseAnim.draw();
    } else if (sound.animation === 1) {
      wipeAnim.x1 = x1;
      wipeAnim.x2 = x2;
      wipeAnim.color = color;
      wipeAnim.draw();
    } else if (sound.animation === 2) {
      blindsAnim.x1 = x1;
      blindsAnim.x2 = x2;
      blindsAnim.color = color;
      blindsAnim.draw(rms);
    } else if (sound.animation === 3) {
      linesAnim.x1 = x1;
      linesAnim.x2 = x2;
      linesAnim.color = color;
      linesAnim.drawLines1(rms);
    } else if (sound.animation === 4) {
      linesAnim.x1 = x1;
      linesAnim.x2 = x2;
      linesAnim.color = color;
      linesAnim.drawLines2(rms);
    }
  }

  drawFrequencyAnimations(sound) {
    fill(255, 0, 90, 80);

    let spectrum = sound.fft.analyze();

    let spectrumStep = 10;
    for (let i = 0; i < spectrum.length; i += spectrumStep) {
      rect(
        map(i, 0, spectrum.length - 1, 0, width),
        0,
        width / (255 / spectrumStep),
        map(spectrum[i], 0, 255, height, 0)
      );
    }

    fill(0);
  }
}