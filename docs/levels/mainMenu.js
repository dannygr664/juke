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
  }
}