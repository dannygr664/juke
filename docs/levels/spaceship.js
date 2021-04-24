class Spaceship {
  constructor() {
    this.initialBackgroundColor = ColorScheme.SPACESHIP_BACKGROUND_COLOR;
    fill(0);
    noStroke();
    this.initialDrawMode = 0;
    this.playerColor = ColorScheme.BLACK;
    this.platformColor = ColorScheme.BLACK;
    this.fluidAnimationColors = [
      ColorScheme.SPACESHIP_HIGHEST_VOLUME,
      ColorScheme.SPACESHIP_HIGHER_VOLUME,
      ColorScheme.SPACESHIP_LOWER_VOLUME,
      ColorScheme.SPACESHIP_LOWEST_VOLUME
    ];
    this.jukeboxAnimationColors = [
      ColorScheme.BLACK
    ];
    this.defaultJukeboxAnimationColor = ColorScheme.BLACK;
    this.maxEnergy = 1200;
    this.genre = 'Spaceship';
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.SPACESHIP_HIGHEST_VOLUME:
        audioManager.updateVolume(1);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 2;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 2;
        break;
      case ColorScheme.SPACESHIP_LOWER_VOLUME:
        audioManager.updateVolume(0.25);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.5;
        break;
      case ColorScheme.SPACESHIP_LOWEST_VOLUME:
        audioManager.updateVolume(0);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.25;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.25;
        break;
      case ColorScheme.SPACESHIP_HIGHER_VOLUME:
        audioManager.updateVolume(0.75);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 1.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 1.5;
        break;
    }
  }

  handleFluidExit(_, fluid) {
    audioManager.updateVolume(INITIAL_VOLUME);
    player.sprite.width = DEFAULT_PLAYER_WIDTH;
    player.sprite.height = DEFAULT_PLAYER_HEIGHT;
  }

  handleJukeboxEnter(_, jukebox) {
    audioManager.unloopCurrentSound();
  }
}