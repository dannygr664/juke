class Ethereal {
  constructor() {
    this.initialBackgroundColor = ColorScheme.ETHEREAL_BACKGROUND_COLOR;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.playerColor = ColorScheme.WHITE;
    this.platformColor = ColorScheme.WHITE;
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
    this.maxEnergy = 300;
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
  }
}