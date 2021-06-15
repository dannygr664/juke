const INITIAL_VOLUME_RAMP_TIME = 0.2;
const VOLUME_MIN = 0;
const VOLUME_MAX = 0.1;
const INITIAL_VOLUME = (VOLUME_MAX + VOLUME_MIN) / 2;
const VOLUME_STEP = 0.01 * VOLUME_MAX;
const VOLUME_ENERGY_COST = 1;

const INITIAL_SOUND_SPEED = 1;
const SOUND_SPEED_MIN = 0.25;
const SOUND_SPEED_MAX = 4;
const SOUND_SPEED_STEP = 0.01;
const SOUND_SPEED_ENERGY_COST = 2;

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
    this.sounds = {};
    this.songs = {};
    this.numberOfSoundsLoaded = 0;
    this.levelSounds = [];
    this.waitingToChange = false;
  }

  getAudioFilePaths() {
    this.audioFilePaths = [];

    let cityAudioFileNames = [
      'City_88bpm4-4_L74B'
    ];

    cityAudioFileNames.forEach(cityAudioFileName => {
      this.audioFilePaths.push(`audio/City/Juke_City_${cityAudioFileName}`);
    });

    let spaceshipAudioFileNames = [
      'Spaceship_76,88bpm4-4_L26M'
    ];

    spaceshipAudioFileNames.forEach(spaceshipAudioFileName => {
      this.audioFilePaths.push(`audio/Spaceship/Juke_Spaceship_${spaceshipAudioFileName}`);
    });

    let etherealAudioFileNames = [
      '11Parts_88bpm4-4_L21M'
    ];

    etherealAudioFileNames.forEach(etherealAudioFileName => {
      this.audioFilePaths.push(`audio/Ethereal/Juke_Ethereal_${etherealAudioFileName}`);
    });

    let lofiAudioFileNames = [
      'LoFi_87bpm4-4_L241B'
    ];

    lofiAudioFileNames.forEach(lofiAudioFileName => {
      this.audioFilePaths.push(`audio/LoFi/Juke_LoFi_${lofiAudioFileName}`);
    });

    let chillAudioFileNames = [
      'Chill_95,94bpm4-4_L82M'
    ];

    chillAudioFileNames.forEach(chillAudioFileName => {
      this.audioFilePaths.push(`audio/Chill/Juke_Chill_${chillAudioFileName}`);
    });

    let cinematicAudioFileNames = [
      'Cinematic_96bpm4-4_L24M'
    ];

    cinematicAudioFileNames.forEach(cinematicAudioFileName => {
      this.audioFilePaths.push(`audio/Cinematic/Juke_Cinematic_${cinematicAudioFileName}`);
    });
  }


  loadSounds() {
    let audioFilePaths = this.audioFilePaths;
    for (let i = 0; i < audioFilePaths.length; i++) {
      this.loadSoundFromPathIndex(i);
    }
  }

  loadSoundFromPathIndex(i) {
    let audioFilePath = this.audioFilePaths[i];
    loadSound(audioFilePath, (sound) => {
      sound.soundInfo = AudioFilePathParser.parseFilePath(audioFilePath);
      this.sounds[i] = sound;
      this.numberOfSoundsLoaded++;
      if (Object.keys(this.sounds).length === this.audioFilePaths.length) {
        this.sounds = Object.values(this.sounds);
        isLoaded = true;
        this.songs = this.sounds.filter(
          sound => sound.soundInfo.genre !== TITLE_GENRE
        );
      }
    });
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

  setupAudio() {
    this.loadFilter();
    this.loadReverb();
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

    this.playSoundWithAnalysisAndAnimation(
      this.levelSounds[0],
      this.levelSounds[0].animationType,
      this.levelSounds[0].animation
    );

    this.currentSound = 0;
  }

  playSoundWithAnalysisAndAnimation(sound, animationType, animation) {
    if (sound.soundInfo.genre === TITLE_GENRE) {
      sound.loop();
    } else {
      sound.play();
    }

    // Volume analysis
    sound.amplitudeAnalyzer = new p5.Amplitude();
    sound.amplitudeAnalyzer.setInput(sound);

    // Pitch analysis
    sound.fft = new p5.FFT;
    sound.fft.setInput(sound);

    sound.animationType = animationType;
    sound.animation = animation;
  }

  loopSoundWithAnalysisAndAnimation(sound, animationType, animation) {
    sound.loop();

    // Volume analysis
    if (!sound.amplitudeAnalyzer) {
      sound.amplitudeAnalyzer = new p5.Amplitude();
      sound.amplitudeAnalyzer.setInput(sound);
    }

    // Pitch analysis
    if (!sound.fft) {
      sound.fft = new p5.FFT;
      sound.fft.setInput(sound);
    }

    sound.animationType = animationType;
    sound.animation = animation;
  }

  getCurrentSound() {
    return this.levelSounds[this.currentSound];
  }

  update() {
    //if (this.waitingToChange) {
    this.tryToPlayNextSound();
    //}

    if (playerRole === GAMER && (
      currentLevel.genre !== TITLE_GENRE
      || currentLevel.currentScreen === HOW_TO_PLAY_SCREEN
    )) {
      handleVolumeControls();
      handleSoundSpeedControls();
    }
  }

  updateVolume(newVolume, colorFadeTime) {
    this.volume = newVolume;
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.amp(this.volume, this.volumeRampTime);
    });

    updateBackgroundBrightness(map(this.volume, VOLUME_MIN, VOLUME_MAX, 20, 100), colorFadeTime);

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

  updateSoundSpeed(newSpeed, colorFadeTime) {
    this.soundSpeed = newSpeed;
    this.soundSpeed = constrain(this.soundSpeed, SOUND_SPEED_MIN, SOUND_SPEED_MAX);
    this.levelSounds.filter(sound => sound.isPlaying()).forEach(sound => {
      sound.rate(newSpeed);
    });
    midiManager.updateSoundSpeed(newSpeed);

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

    updateBackgroundHue(hueChange, saturationChange, colorFadeTime);
  }

  updateReverb(newReverb) {
    this.reverbLevel = newReverb;
    this.reverbLevel = constrain(this.reverbLevel, REVERB_MIN, REVERB_MAX);
    this.reverb.drywet(newReverb);

    let reverbStrokeColor = this.getReverbStrokeColor();
    player.updatePlayerStrokeColor(reverbStrokeColor);
  }

  resetSoundProperties(genre) {
    let sound = this.sounds.filter(sound => sound.soundInfo.genre === genre)[0];
    this.soundSpeed = INITIAL_SOUND_SPEED;
    sound.rate(INITIAL_SOUND_SPEED);
    this.volume = INITIAL_VOLUME;
    sound.amp(INITIAL_VOLUME);
    this.reverbLevel = INITIAL_REVERB;
    this.reverb.drywet(INITIAL_REVERB);
  }

  getReverbStrokeColor() {
    if (this.reverbLevel === REVERB_MIN) {
      return ColorScheme.CLEAR;
    } else if (this.reverbLevel <= 0.25) {
      return color(
        hue(ColorScheme.ETHEREAL_LOWEST_REVERB),
        saturation(ColorScheme.ETHEREAL_LOWEST_REVERB),
        brightness(ColorScheme.ETHEREAL_LOWEST_REVERB),
        map(this.reverbLevel, REVERB_MIN, 0.25, 50, 100),
      );
    } else if (this.reverbLevel <= 0.5) {
      return color(
        hue(ColorScheme.ETHEREAL_LOWER_REVERB),
        saturation(ColorScheme.ETHEREAL_LOWER_REVERB),
        brightness(ColorScheme.ETHEREAL_LOWER_REVERB),
        map(this.reverbLevel, 0.25, 0.5, 50, 100),
      );
    } else if (this.reverbLevel <= 0.75) {
      return color(
        hue(ColorScheme.ETHEREAL_HIGHER_REVERB),
        saturation(ColorScheme.ETHEREAL_HIGHER_REVERB),
        brightness(ColorScheme.ETHEREAL_HIGHER_REVERB),
        map(this.reverbLevel, 0.5, 0.75, 50, 100),
      );
    } else if (this.reverbLevel <= REVERB_MAX) {
      return color(
        hue(ColorScheme.ETHEREAL_HIGHEST_REVERB),
        saturation(ColorScheme.ETHEREAL_HIGHEST_REVERB),
        brightness(ColorScheme.ETHEREAL_HIGHEST_REVERB),
        map(this.reverbLevel, 0.75, REVERB_MAX, 50, 100),
      );
    } else {
      return ColorScheme.CLEAR;
    }
  }

  handleFalling() {
    this.pauseSounds();
    //this.filter.set(REVIVING_LPF_CUTOFF, REVIVING_LPF_PEAK_VOLUME);
  }

  handleRevived() {
    this.resumeSounds();
    //this.filter.set(ALIVE_LPF_CUTOFF, ALIVE_LPF_PEAK_VOLUME);
  }

  handlePausing() {
    this.getCurrentSound().pause();
  }

  handleUnpausing() {
    if (!player.isReviving) {
      this.getCurrentSound().play();
    }
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
      this.playSoundWithAnalysisAndAnimation(
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

  isSoundOneMeasureOrLess() {
    return this.getCurrentSound().soundInfo.length <=
      this.getCurrentSound().soundInfo.timeSignatureLower;
  }

  isFirstSound() {
    return (this.currentSound === 0);
  }

  isPenultimateSound() {
    if (this.levelSounds.length < 2) {
      return false;
    } else {
      return (this.currentSound === this.levelSounds.length - 2);
    }
  }

  isFinalSound() {
    return (this.currentSound === this.levelSounds.length - 1);
  }

  isSongFinished() {
    return (
      this.getCurrentSound().currentTime()
      >= this.getCurrentSound().duration() - 3
    );
  }

  getDurationOfBeat() {
    let sound = this.getCurrentSound();
    const numberOfBeats = sound.soundInfo.length;
    const songDuration = sound.duration();
    const lengthOfBeat = songDuration / numberOfBeats;
    return lengthOfBeat;
  }

  getDurationOfMeasure() {
    let durationOfBeat = this.getDurationOfBeat();
    let numberOfBeatsPerMeasure = this.getCurrentSound().soundInfo.timeSignatureUpper;
    return durationOfBeat * numberOfBeatsPerMeasure;
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
    if (!isPaused && currentLevel.genre !== TITLE_GENRE) {
      if (this.isFinalSound() && this.isSongFinished()) {
        this.waitingToChange = false;
        //incrementLevel();
        displayScore();
      }
      // else {
      //   if (this.isPenultimateSound() && levelManager.getCurrentLevel().genre === TITLE_GENRE) {
      //     this.currentSound = 1;
      //   } else {
      //     this.currentSound = (this.currentSound + 1) % (this.levelSounds.length);
      //   }
      //   this.toggleSound(this.currentSound);
      //   // player.triggerUpdatePlayerColor(backgroundColor, 60);
      //   // platformManager.triggerUpdatePlatformColor(backgroundColor, 60);
      //   this.waitingToChange = false;
      // }
    }
  }

  stopSounds() {
    // let sound = this.getCurrentSound();
    // //if (sound.isPlaying()) {
    // sound.amp(0, this.volumeRampTime);
    // if (sound.isPlaying()) {
    //   sound.stop();
    // }
    // //}
    let playingSounds = this.sounds.filter(
      sound => sound.isPlaying()
    );

    for (const playingSound of playingSounds) {
      playingSound.amp(0, this.volumeRampTime);
      playingSound.stop();
    }
  }

  pauseSounds() {
    let sound = this.getCurrentSound();
    if (sound.isPlaying()) {
      sound.amp(0, this.volumeRampTime);
      sound.pause();
    }
  }

  resumeSounds() {
    let sound = this.getCurrentSound();
    if (!sound.isPlaying()) {
      sound.amp(this.volume, this.volumeRampTime);
      sound.loop();
    }
  }

  playSongSample(genre) {
    this.pauseSounds();
    this.resetSoundProperties(genre);
    let songsWithGenre = this.songs.filter(
      song => song.soundInfo.genre === genre
    );

    if (songsWithGenre.length > 0) {
      this.loopSoundWithAnalysisAndAnimation(
        songsWithGenre[0],
        songsWithGenre[0].animationType,
        songsWithGenre[0].animation
      );
    }
  }

  stopSongSample() {
    let playingSongs = this.songs.filter(song =>
      song.isPlaying()
    );

    if (playingSongs.length > 0) {
      playingSongs[0].amp(0, this.volumeRampTime);
      playingSongs[0].stop();
    }

    this.resumeSounds();
  }
}