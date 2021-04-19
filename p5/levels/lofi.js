class LoFi {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    this.initialColorFilter = ColorScheme.CLEAR;
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
    this.genre = 'LoFi';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.RED:
        audioManager.updateSoundSpeed(0.4);
        break;
      case ColorScheme.BLUE:
        audioManager.updateSoundSpeed(2);
        break;
      case ColorScheme.GREEN:
        audioManager.updateSoundSpeed(4);
        break;
      case ColorScheme.YELLOW:
        audioManager.updateSoundSpeed(0.75);
        break;
    }
  }

  handleFluidExit() {
    audioManager.updateSoundSpeed(INITIAL_SOUND_SPEED);
  }

  handleJukeboxEnter(_, jukebox) {
    audioManager.unloopCurrentSound();
    // colorFilter = ColorScheme.getFilterColor(jukeboxManager.currentAnimationColor);
    // switch (fluid.shapeColor) {
    //   case ColorScheme.RED:
    //     audioManager.updateVolume(1);
    //     break;
    //   case ColorScheme.BLUE:
    //     audioManager.updateVolume(0.25);
    //     break;
    //   case ColorScheme.GREEN:
    //     audioManager.updateVolume(0);
    //     break;
    //   case ColorScheme.YELLOW:
    //     audioManager.updateVolume(0.75);
    //     break;
    // }
  }
}