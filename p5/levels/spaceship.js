class Spaceship {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    this.initialColorFilter = ColorScheme.CLEAR;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.fluidAnimationColors = [
      ColorScheme.SPACESHIP_HIGHEST_VOLUME,
      ColorScheme.SPACESHIP_HIGHER_VOLUME,
      ColorScheme.SPACESHIP_LOWER_VOLUME,
      ColorScheme.SPACESHIP_LOWEST_VOLUME
    ];
    this.genre = 'Spaceship';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.RED:
        audioManager.updateVolume(1);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 2;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 2;
        break;
      case ColorScheme.BLUE:
        audioManager.updateVolume(0.25);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.5;
        break;
      case ColorScheme.GREEN:
        audioManager.updateVolume(0);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.25;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.25;
        break;
      case ColorScheme.YELLOW:
        audioManager.updateVolume(0.75);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 1.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 1.5;
        break;
    }
  }

  handleFluidExit() {
    audioManager.updateVolume(INITIAL_VOLUME);
    player.sprite.width = DEFAULT_PLAYER_WIDTH;
    player.sprite.height = DEFAULT_PLAYER_HEIGHT;
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