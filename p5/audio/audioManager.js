const INITIAL_VOLUME = 0.5;
const INITIAL_VOLUME_RAMP_TIME = 0.2;
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

    this.sounds = sounds;
    this.sounds.forEach(sound => {
      sound.disconnect();
      sound.connect(this.filter);
      sound.amp(INITIAL_VOLUME);
    });

    this.volume = INITIAL_VOLUME;
    this.volumeRampTime = INITIAL_VOLUME_RAMP_TIME;

    this.soundSpeed = INITIAL_SOUND_SPEED;

    this.loopSoundWithAnalysisAndAnimation(
      this.sounds[0],
      this.sounds[0].animationType,
      this.sounds[0].animation
    );

    this.currentSound = 0;
  }

  loopSoundWithAnalysisAndAnimation(sound, animationType, animation) {
    sound.loop();

    // Volume analysis
    sound.amplitudeAnalyzer = new p5.Amplitude();
    sound.amplitudeAnalyzer.setInput(sound);

    // Pitch analysis
    sound.fft = new p5.FFT;
    sound.fft.setInput(sound);

    sound.animationType = animationType;
    sound.animation = animation;
  }

  // update() {
  //   this.updateVolume();
  //   this.updateSoundSpeed();
  // }

  // updateVolume() {
  //   if (keyDown('q' || 'Q')) {
  //     this.volume += VOLUME_STEP;
  //   } else if (keyDown('z' || 'Z')) {
  //     this.volume -= VOLUME_STEP;
  //   }
  //   this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
  //   updateVolume(this.volume);
  // }

  // updateSoundSpeed() {
  //   if (keyDown('w' || 'W')) {
  //     this.soundSpeed += SOUND_SPEED_STEP;
  //   } else if (keyDown('x' || 'X')) {
  //     this.soundSpeed -= SOUND_SPEED_STEP;
  //   }
  //   this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
  //   updateSoundSpeed(this.soundSpeed);
  // }

  updateVolume(newVolume) {
    this.volume = newVolume;
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
    this.sounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.amp(this.volume, this.volumeRampTime);
    });
  }

  updateSoundSpeed(newSpeed) {
    this.soundSpeed = newSpeed;
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
    this.sounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.rate(newSpeed);
    });
  }

  handleFalling() {
    this.filter.set(REVIVING_LPF_CUTOFF, REVIVING_LPF_PEAK_VOLUME);
  }

  handleRevived() {
    this.filter.set(ALIVE_LPF_CUTOFF, ALIVE_LPF_PEAK_VOLUME);
  }

  toggleSound(soundIndex) {
    if (this.sounds[soundIndex].isPlaying()) {
      this.sounds[soundIndex].amp(0, this.volumeRampTime);
      this.sounds[soundIndex].pause();
    } else {
      this.loopSoundWithAnalysisAndAnimation(
        this.sounds[soundIndex],
        this.sounds[soundIndex].animationType,
        this.sounds[soundIndex].animation
      );
      this.sounds[soundIndex].amp(this.volume, this.volumeRampTime);
    }
  }

  playNextSound() {
    audioManager.toggleSound(this.currentSound);
    this.currentSound = (this.currentSound + 1) % (this.sounds.length);
    audioManager.toggleSound(this.currentSound);
  }
}