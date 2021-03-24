class LoFi {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    this.initialColorFilter = ColorScheme.CLEAR;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.fluidAnimationColors = [
      ColorScheme.RED,
      ColorScheme.BLUE,
      ColorScheme.GREEN,
      ColorScheme.YELLOW,
    ];
    this.genre = 'LoFi';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.RED:
        audioManager.updateVolume(1);
        break;
      case ColorScheme.BLUE:
        audioManager.updateVolume(0.25);
        break;
      case ColorScheme.GREEN:
        audioManager.updateVolume(0);
        break;
      case ColorScheme.YELLOW:
        audioManager.updateVolume(0.75);
        break;
    }
  }

  handleFluidExit() {
    audioManager.updateVolume(INITIAL_VOLUME);
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