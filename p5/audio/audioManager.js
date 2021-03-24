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
      '11Parts_88bpm4-4_L21M',
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
      '11Parts_88bpm4-4_L21M',
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
      'Ending_87bpm4-4_L4.5B'
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

      sound.addCue(0, this.resetDidPlayerFallFlag);

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

  resetDidPlayerFallFlag() {
    jukeboxManager.didPlayerFall = false;
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
      this.levelSounds.animationType,
      this.levelSounds.animation
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

  update() {
    if (this.waitingToChange) {
      this.tryToPlayNextSound();
    }
    // this.updateVolume();
    // this.updateSoundSpeed();
  }

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
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.amp(this.volume, this.volumeRampTime);
    });
  }

  updateSoundSpeed(newSpeed) {
    this.soundSpeed = newSpeed;
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.rate(newSpeed);
    });
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

  toggleSound(soundIndex) {
    let sound = this.levelSounds[soundIndex];
    if (sound.isPlaying()) {
      sound.amp(0, this.volumeRampTime);
      sound.pause();
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
    let sound = this.levelSounds[this.currentSound];
    const numberOfBeats = sound.soundInfo.length;
    const songDuration = sound.duration();
    const lengthOfBeat = songDuration / numberOfBeats;
    return (sound.currentTime() > songDuration - (lengthOfBeat * 4));
  }

  getDurationOfFourBeats() {
    let sound = this.levelSounds[this.currentSound];
    const numberOfBeats = sound.soundInfo.length;
    const songDuration = sound.duration();
    const lengthOfBeat = songDuration / numberOfBeats;
    return lengthOfBeat * 4;
  }

  unloopCurrentSound() {
    // Turn looping off
    let sound = this.levelSounds[this.currentSound];
    if (sound.isLooping()) {
      sound.setLoop(false);
      this.waitingToChange = true;
    }
  }

  tryToPlayNextSound() {
    if (!this.levelSounds[this.currentSound].isPlaying()) {
      this.currentSound = (this.currentSound + 1) % (this.levelSounds.length);
      this.toggleSound(this.currentSound);
      this.waitingToChange = false;
    }
  }

  stopSounds() {
    this.toggleSound(this.currentSound);
  }
}