const INITIAL_VOLUME = 0.5;
const INITIAL_VOLUME_RAMP_TIME = 0.2;
const VOLUME_MIN = 0;
const VOLUME_MAX = 1;
const VOLUME_STEP = 0.01;

const INITIAL_SOUND_SPEED = 1;
const SOUND_SPEED_MIN = 0.01;
const SOUND_SPEED_MAX = 4;
const SOUND_SPEED_STEP = 0.01;

const INITIAL_REVERB = 0;
const INITIAL_REVERB_TIME = 3;
const INITIAL_REVERB_DECAY_RATE = 100;
const REVERB_MIN = 0;
const REVERB_MAX = 1;
const REVERB_STEP = 0.01;

const ALIVE_LPF_CUTOFF = 22050;
const ALIVE_LPF_PEAK_VOLUME = 0;

const REVIVING_LPF_CUTOFF = 200;
const REVIVING_LPF_PEAK_VOLUME = 0;

class AudioManager {
  constructor() {
    soundFormats('wav', 'mp3');
    this.getAudioFilePaths();
    this.sounds = [];
    this.levelSounds = [];
    this.waitingToChange = false;
  }

  getAudioFilePaths() {
    this.audioFilePaths = [];

    let cityAudioFileNames = [
      'Intro_88bpm4-4_L1M',
      'Section1_88bpm4-4_L4M',
      'Section2_88bpm4-4_L8M',
      'Section3_88bpm4-4_L4M',
      'Ending_88bpm4-4_L6B'
    ];

    cityAudioFileNames.forEach(cityAudioFileName => {
      this.audioFilePaths.push(`audio/City/Juke_City_${cityAudioFileName}.wav`);
    });

    let spaceshipAudioFileNames = [
      'Intro_76,88bpm4-4_L4M',
      'Section1_76,88bpm4-4_L4M',
      'Section2_76,88bpm4-4_L8M',
      'Section3_76,88bpm4-4_L8M',
      'Ending_76,88bpm4-4_L2M'
    ];

    spaceshipAudioFileNames.forEach(spaceshipAudioFileName => {
      this.audioFilePaths.push(`audio/Spaceship/Juke_Spaceship_${spaceshipAudioFileName}.wav`);
    });

    let etherealAudioFileNames = [
      'Angel1_88bpm4-4_L8M',
      '2Parts_88bpm4-4_L17M',
      '3Parts_88bpm4-4_L17M',
      '4Parts_88bpm4-4_L17M',
      '5Parts_88bpm4-4_L17M',
      '6Parts_88bpm4-4_L17M',
      '7Parts_88bpm4-4_L17M',
      '8Parts_88bpm4-4_L17M',
      '9Parts_88bpm4-4_L17M',
      '10Parts_88bpm4-4_L17M',
      '11Parts_88bpm4-4_L21M'
    ];

    etherealAudioFileNames.forEach(etherealAudioFileName => {
      this.audioFilePaths.push(`audio/Ethereal/Juke_Ethereal_${etherealAudioFileName}.wav`);
    });

    let lofiAudioFileNames = [
      'Cymbal_87bpm4-4_L4B',
      'Intro_87bpm4-4_L4M',
      'Section1_87bpm4-4_L4M',
      'Section2_87bpm4-4_L9M',
      'Section3_87bpm4-4_L14M',
      'Section4_87bpm4-4_L4M',
      'Section5_87bpm4-4_L4M',
      'Section6_87bpm4-4_L14M',
      'Break_87bpm4-4_L4M',
      'Build_87bpm4-4_L1M',
      //'Ending_87bpm4-4_L4.5B'
    ];

    lofiAudioFileNames.forEach(lofiAudioFileName => {
      this.audioFilePaths.push(`audio/LoFi/Juke_LoFi_${lofiAudioFileName}.wav`);
    });
  }


  loadSounds() {
    let audioFilePaths = this.audioFilePaths;
    for (let i = 0; i < audioFilePaths.length; i++) {
      let sound = loadSound(audioFilePaths[i]);
      sound.soundInfo = AudioFilePathParser.parseFilePath(audioFilePaths[i]);
      this.sounds.push(sound);
    }
  }

  assignSoundAnimations() {
    for (let i = 0; i < this.sounds.length; i++) {
      this.sounds[i].animation = animationController.getSoundAnimationForSound(this.sounds[i]);
      this.sounds[i].animationType = animationController.getSoundAnimationTypeForSoundAnimation(
        this.sounds[i].animation
      );
    }
  }

  assignSoundCues() {
    for (let i = 0; i < this.sounds.length; i++) {
      this.sounds[i].addCue(0.1, this.resetDidPlayerFallFlag);
    }
  }

  resetDidPlayerFallFlag(time) {
    if (!player.isReviving) {
      jukeboxManager.didPlayerFall = false;
    }
  }

  loadFilter() {
    this.filter = new p5.LowPass();
    this.filter.set(22050, 0);
  }

  loadReverb() {
    this.reverb = new p5.Reverb();
    this.reverb.drywet(INITIAL_REVERB);
  }

  startSounds(genre) {
    this.reverb.connect(this.filter);

    this.levelSounds = this.sounds.filter(sound => sound.soundInfo.genre === genre);

    this.levelSounds.forEach(sound => {
      sound.disconnect();
      if (genre === 'Ethereal') {
        sound.connect(this.reverb);
      } else {
        sound.connect(this.filter);
      }
      sound.amp(INITIAL_VOLUME);
    });

    this.volume = INITIAL_VOLUME;
    this.volumeRampTime = INITIAL_VOLUME_RAMP_TIME;

    this.soundSpeed = INITIAL_SOUND_SPEED;

    this.reverbLevel = INITIAL_REVERB;

    this.loopSoundWithAnalysisAndAnimation(
      this.levelSounds[0],
      this.levelSounds[0].animationType,
      this.levelSounds[0].animation
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

  getCurrentSound() {
    return this.levelSounds[this.currentSound];
  }

  update() {
    if (this.waitingToChange) {
      this.tryToPlayNextSound();
    }
    if (levelManager.getCurrentLevelNumber() > 1) {
      this.handleVolumeControls();
    }
    if (levelManager.getCurrentLevelNumber() > 2) {
      this.handleSoundSpeedControls();
    }
  }

  handleVolumeControls() {
    if (keyDown('q' || 'Q')) {
      this.volume += VOLUME_STEP;
    } else if (keyDown('z' || 'Z')) {
      this.volume -= VOLUME_STEP;
    } else if (keyDown('a' || 'A')) {
      this.volume = INITIAL_VOLUME;
    }
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);

    this.updateVolume(this.volume);
  }

  handleSoundSpeedControls() {
    let step = (audioManager.soundSpeed >= 1) ? SOUND_SPEED_STEP : (SOUND_SPEED_STEP / 2);
    if (keyDown('w' || 'W')) {
      this.soundSpeed += step;
    } else if (keyDown('x' || 'X')) {
      this.soundSpeed -= step;
    } else if (keyDown('s' || 'S')) {
      this.soundSpeed = INITIAL_SOUND_SPEED;
    }
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);

    this.updateSoundSpeed(this.soundSpeed);
  }

  updateVolume(newVolume) {
    this.volume = newVolume;
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.amp(this.volume, this.volumeRampTime);
    });

    updateBackgroundBrightness(map(this.volume, VOLUME_MIN, VOLUME_MAX, 0, 100));

    let volumeScaleFactor = this.volume / INITIAL_VOLUME;
    let sizeScaleFactor;
    if (volumeScaleFactor >= 1) {
      sizeScaleFactor = volumeScaleFactor;
    } else {
      sizeScaleFactor = map(volumeScaleFactor, 0, 1, 0.25, 1);
    }

    player.sprite.width = DEFAULT_PLAYER_WIDTH * sizeScaleFactor;
    player.sprite.height = DEFAULT_PLAYER_HEIGHT * sizeScaleFactor;
  }

  updateSoundSpeed(newSpeed) {
    this.soundSpeed = newSpeed;
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.rate(newSpeed);
    });

    const RED_ANCHOR = hue(ColorScheme.RED);
    const YELLOW_ANCHOR = hue(ColorScheme.YELLOW);
    const BLUE_ANCHOR = hue(ColorScheme.BLUE);
    const GREEN_ANCHOR = hue(ColorScheme.GREEN);

    let saturationChange = 0;
    let hueChange = 0;

    if (this.soundSpeed <= 0.4) {
      hueChange = map(this.soundSpeed, SOUND_SPEED_MIN, 0.4, 300, RED_ANCHOR);
    } else if (this.soundSpeed <= 0.75) {
      hueChange = map(this.soundSpeed, 0.4, 0.75, 0, YELLOW_ANCHOR);
    } else if (this.soundSpeed < 1) {
      hueChange = YELLOW_ANCHOR;
      saturationChange = map(this.soundSpeed, 0.75, 1, 0, -100);
    } else if (this.soundSpeed <= 2) {
      hueChange = BLUE_ANCHOR;
      saturationChange = map(this.soundSpeed, 1, 2, -100, 0);
    } else if (this.soundSpeed <= SOUND_SPEED_MAX) {
      hueChange = map(this.soundSpeed, 2, 4, BLUE_ANCHOR, GREEN_ANCHOR);
    }

    updateBackgroundHue(hueChange, saturationChange);
  }

  updateReverb(newReverb) {
    this.reverbLevel = newReverb;
    this.reverbLevel = constrain(this.reverbLevel, REVERB_MIN, REVERB_MAX);
    this.reverb.drywet(newReverb);
  }

  handleFalling() {
    this.filter.set(REVIVING_LPF_CUTOFF, REVIVING_LPF_PEAK_VOLUME);
  }

  handleRevived() {
    this.filter.set(ALIVE_LPF_CUTOFF, ALIVE_LPF_PEAK_VOLUME);
  }

  handlePausing() {
    this.getCurrentSound().pause();
  }

  handleUnpausing() {
    this.getCurrentSound().play();;
  }

  toggleSound(soundIndex) {
    let sound = this.levelSounds[soundIndex];
    if (sound.isPlaying()) {
      sound.amp(0, this.volumeRampTime);
      sound.stop();
    } else {
      if (sound.soundInfo.genre === 'Ethereal') {
        this.reverb.process(sound, INITIAL_REVERB_TIME, INITIAL_REVERB_DECAY_RATE, false);
      }
      this.loopSoundWithAnalysisAndAnimation(
        sound,
        sound.animationType,
        sound.animation
      );
      sound.amp(this.volume, this.volumeRampTime);
    }
  }

  isSoundAlmostOver() {
    let sound = this.getCurrentSound();
    const numberOfBeats = sound.soundInfo.length;
    const songDuration = sound.duration();
    const lengthOfBeat = songDuration / numberOfBeats;
    return (sound.currentTime() > songDuration - (lengthOfBeat * 4));
  }

  isFinalSound() {
    return (this.currentSound === this.levelSounds.length - 1);
  }

  getDurationOfBeat() {
    let sound = this.getCurrentSound();
    const numberOfBeats = sound.soundInfo.length;
    const songDuration = sound.duration();
    const lengthOfBeat = songDuration / numberOfBeats;
    return lengthOfBeat;
  }

  unloopCurrentSound() {
    // Turn looping off
    let sound = this.getCurrentSound();
    if (sound.isLooping()) {
      sound.setLoop(false);
    }
    this.waitingToChange = true;
  }

  tryToPlayNextSound() {
    if (!this.getCurrentSound().isPlaying() && !isPaused) {
      if (this.isFinalSound()) {
        this.waitingToChange = false;
        incrementLevel();
      } else {
        this.currentSound = (this.currentSound + 1) % (this.levelSounds.length);
        this.toggleSound(this.currentSound);
        player.updatePlayerColor(backgroundColor);
        platformManager.updatePlatformColor(backgroundColor);
        this.waitingToChange = false;
      }
    }
  }

  stopSounds() {
    let sound = this.getCurrentSound();
    sound.amp(0, this.volumeRampTime);
    sound.stop();
  }
}