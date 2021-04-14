class Ethereal {
  constructor() {
    this.initialBackgroundColor = ColorScheme.ETHEREAL_BACKGROUND_COLOR;
    this.initialColorFilter = ColorScheme.CLEAR;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.fluidAnimationColors = [
      ColorScheme.ETHEREAL_HIGHEST_REVERB,
      ColorScheme.ETHEREAL_HIGHER_REVERB,
      ColorScheme.ETHEREAL_LOWER_REVERB,
      ColorScheme.ETHEREAL_LOWEST_REVERB
    ];
    this.jukeboxAnimationColors = [
      ColorScheme.WHITE
    ];
    this.defaultJukeboxAnimationColor = ColorScheme.WHITE;
    this.genre = 'Ethereal';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.ETHEREAL_LOWEST_REVERB:
        audioManager.updateReverb(0);
        break;
      case ColorScheme.ETHEREAL_HIGHER_REVERB:
        audioManager.updateReverb(0.75);
        break;
      case ColorScheme.ETHEREAL_HIGHEST_REVERB:
        audioManager.updateReverb(1);
        break;
      case ColorScheme.ETHEREAL_LOWER_REVERB:
        audioManager.updateReverb(0.25);
        break;
    }
  }

  handleFluidExit() {
    audioManager.updateReverb(INITIAL_REVERB);
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