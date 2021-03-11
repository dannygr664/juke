let noiseAnim;
let boxesAnim;
let linesAnim;
let blindsAnim;

class AnimationController {
  constructor() {
    this.drawMode = 0;
    this.volumeDrawMode = 0;
    noiseAnim = new Noise();
    boxesAnim = new Boxes();
    linesAnim = new Lines();
    blindsAnim = new Blinds();
  }

  draw() {
    if (this.drawMode === 0) {
      this.drawVolumeAnimations();
    } else {
      this.drawFrequencyAnimations();
    }
  }

  drawVolumeAnimations() {
    let rms = audioManager.amplitudeAnalyzer.getLevel();

    if (this.volumeDrawMode === 3) {
      noiseAnim.drawNoise(rms);
    } else if (this.volumeDrawMode === 4) {
      boxesAnim.drawBoxes(rms);
    } else if (this.volumeDrawMode === 5) {
      blindsAnim.drawBlinds(rms);
    } else {
      linesAnim.drawLines(this.volumeDrawMode, rms);
    }
  }

  drawFrequencyAnimations() {
    fill(255, 0, 90, 80);

    let spectrum = audioManager.fft.analyze();

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