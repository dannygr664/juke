const INITIAL_VOLUME = 0.5;
const INITIAL_VOLUME_RAMP_TIME = 0.05;
const VOLUME_MIN = 0;
const VOLUME_MAX = 1;
const VOLUME_STEP = 0.01;

const INITIAL_SOUND_SPEED = 1;
const SOUND_SPEED_MIN = 0.01;
const SOUND_SPEED_MAX = 4;
const SOUND_SPEED_STEP = 0.01;

const ALIVE_LPF_CUTOFF = 22050;
const ALIVE_LPF_PEAK_VOLUME = 0;

const REVIVING_LPF_CUTOFF = 200;
const REVIVING_LPF_PEAK_VOLUME = 0;

class AudioManager {
  constructor(sounds) {
    this.filter = new p5.LowPass();
    this.filter.set(22050, 0);

    sounds.forEach(sound => {
      sound.disconnect();
      sound.connect(this.filter);
    });

    this.volume = INITIAL_VOLUME;
    this.volumeRampTime = INITIAL_VOLUME_RAMP_TIME;

    this.soundSpeed = INITIAL_SOUND_SPEED;

    masterVolume(this.volume, this.volumeRampTime);

    this.sound = sounds[0];
    this.sound.loop();

    // Volume analysis
    this.amplitudeAnalyzer = new p5.Amplitude();
    this.amplitudeAnalyzer.setInput(this.sound);

    // Pitch analysis
    this.fft = new p5.FFT;
    this.fft.setInput(this.sound);
  }

  update() {
    this.updateVolume();
    //this.updateSoundSpeed();
  }

  updateVolume() {
    if (keyDown('q' || 'Q')) {
      this.volume += VOLUME_STEP;
    } else if (keyDown('z' || 'Z')) {
      this.volume -= VOLUME_STEP;
    }
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
    masterVolume(this.volume, this.volumeRampTime);
  }


  // updateSoundSpeed() {
  //   if (keyDown('w' || 'W')) {
  //     this.soundSpeed += SOUND_SPEED_STEP;
  //   } else if (keyDown('x' || 'X')) {
  //     this.soundSpeed -= SOUND_SPEED_STEP;
  //   }
  //   this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
  //   this.sound.rate(this.soundSpeed);
  // }


  updateSoundSpeed(newSpeed) {
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
    this.soundSpeed = newSpeed;
    this.sound.rate(newSpeed);
  }

  handleFalling() {
    this.filter.set(REVIVING_LPF_CUTOFF, REVIVING_LPF_PEAK_VOLUME);
  }

  handleRevived() {
    this.filter.set(ALIVE_LPF_CUTOFF, ALIVE_LPF_PEAK_VOLUME);
  }
}