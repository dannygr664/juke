class Cinematic {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.playerColor = ColorScheme.BLACK;
    this.platformColor = ColorScheme.BLACK;
    this.fluidAnimationColors = [
      ColorScheme.LOFI_HIGHEST_SPEED,
      ColorScheme.LOFI_HIGHER_SPEED,
      ColorScheme.LOFI_LOWER_SPEED,
      ColorScheme.LOFI_LOWEST_SPEED
    ];
    this.jukeboxAnimationColors = [
      ColorScheme.BLACK
    ];
    this.defaultJukeboxAnimationColor = ColorScheme.BLACK;
    this.maxEnergy = 600;
    this.genre = 'Cinematic';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.RED:
        audioManager.updateSoundSpeed(0.4, 0);
        break;
      case ColorScheme.BLUE:
        audioManager.updateSoundSpeed(2, 0);
        break;
      case ColorScheme.GREEN:
        audioManager.updateSoundSpeed(4, 0);
        break;
      case ColorScheme.YELLOW:
        audioManager.updateSoundSpeed(0.75, 0);
        break;
    }
  }

  handleFluidExit() {
    audioManager.updateSoundSpeed(INITIAL_SOUND_SPEED, 0);
  }

  handleJukeboxEnter(_, jukebox) {
    jukebox.passed = true;
    audioManager.unloopCurrentSound();
  }
}