class MainMenu {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    fill(0);
    noStroke();
    this.genre = 'City';
    this.menuItems = ['Play', 'How To Play', 'Credits'];
    this.currentItemSelected = 0;
    this.screenItems = ['Main', 'How To Play', 'Credits'];
    this.currentScreen = 0;

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
  }
}