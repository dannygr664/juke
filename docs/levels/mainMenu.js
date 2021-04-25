class MainMenu {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    fill(0);
    noStroke();
    this.genre = 'City';
    this.menuItems = ['Play', 'How To Play', 'Credits'];
    this.currentItemSelected = 0;
    this.screenItems = ['Main', 'How To Play', 'Credits'];
    this.item1Y = 9 * height / 16;
    this.item2Y = 11 * height / 16;
    this.item3Y = 13 * height / 16;
    this.currentScreen = 0;

    this.initialDrawMode = 0;
    this.playerColor = ColorScheme.BLACK;
    this.platformColor = ColorScheme.BLACK;
    this.fluidAnimationColors = [
      ColorScheme.SPACESHIP_HIGHER_VOLUME,
    ];
    this.jukeboxAnimationColors = [
      ColorScheme.BLACK
    ];
    this.defaultJukeboxAnimationColor = ColorScheme.BLACK;
    this.maxEnergy = 1200;
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
    jukebox.passed = true;
    audioManager.unloopCurrentSound();
  }
}