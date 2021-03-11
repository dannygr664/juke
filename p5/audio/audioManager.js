const INITIAL_VOLUME = 0;
const VOLUME_MIN = 0;
const VOLUME_MAX = 1;
const VOLUME_STEP = 0.01;

const SONG_SPEED_MIN = 0.01;
const SONG_SPEED_MAX = 4;
const SONG_SPEED_STEP = 0.01;

const REVIVING_LPF_CUTOFF = 200;
const REVIVING_LPF_PEAK_VOLUME = 0;

class AudioManager {
  constructor(song) {
    this.song = song;

    this.filter = new p5.LowPass();
    this.filter.set(22050, 0);

    this.song.disconnect();
    this.song.connect(this.filter);

    this.volume = INITIAL_VOLUME;

    this.songSpeed = 1;

    this.song.loop();

    // Volume analysis
    this.amplitudeAnalyzer = new p5.Amplitude();
    this.amplitudeAnalyzer.setInput(this.song);

    // Pitch analysis
    this.fft = new p5.FFT;
    this.fft.setInput(this.song);
  }

  update() {
    this.updateVolume();
    this.updateSongSpeed();
  }

  updateVolume() {
    if (keyDown('q' || 'Q')) {
      this.volume += VOLUME_STEP;
    } else if (keyDown('z' || 'Z')) {
      this.volume -= VOLUME_STEP;
    }
    this.volume = constrain(this.volume, VOLUME_MIN, VOLUME_MAX);
    this.song.amp(this.volume);
  }


  updateSongSpeed() {
    if (keyDown('w' || 'W')) {
      this.songSpeed += SONG_SPEED_STEP;
    } else if (keyDown('x' || 'X')) {
      this.songSpeed -= SONG_SPEED_STEP;
    }
    this.songSpeed = constrain(this.songSpeed, SONG_SPEED_MIN, SONG_SPEED_MAX);
    this.song.rate(this.songSpeed);
  }

  handleFalling() {
    this.filter.set(REVIVING_LPF_CUTOFF, REVIVING_LPF_PEAK_VOLUME);
  }
}