const MAIN_MENU_SCREEN = 0;
const HOW_TO_PLAY_SCREEN = 1;
const CREDITS_SCREEN = 2;
const MODE_SELECTION_SCREEN = 3;
const ROLE_SELECTION_SCREEN = 4;
const CONTROLLER_SELECTION_SCREEN = 5;

class MainMenu {
  constructor() {
    this.initialBackgroundColor = ColorScheme.WHITE;
    fill(0);
    noStroke();
    this.genre = 'City';
    this.screenToMenuItems = [];
    this.screenToMenuItems[MAIN_MENU_SCREEN] = ['Play', 'How To Play', 'Credits'];
    this.screenToMenuItems[MODE_SELECTION_SCREEN] = ['Single Player', 'Multiplayer'];
    this.screenToMenuItems[ROLE_SELECTION_SCREEN] = ['Gamer', 'Musician'];
    this.currentItemSelected = 0;
    this.currentScreen = MAIN_MENU_SCREEN;

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

  getYPosOfItem(i) {
    return ((((i - 1) * 2) + 9) * height / 16);
  }

  handleFluidEnter(_, fluid) {
    switch (fluid.animation.color) {
      case ColorScheme.SPACESHIP_HIGHEST_VOLUME:
        audioManager.updateVolume(1, 20);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 2;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 2;
        break;
      case ColorScheme.SPACESHIP_LOWER_VOLUME:
        audioManager.updateVolume(0.25, 20);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.5;
        break;
      case ColorScheme.SPACESHIP_LOWEST_VOLUME:
        audioManager.updateVolume(0, 20);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 0.25;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 0.25;
        break;
      case ColorScheme.SPACESHIP_HIGHER_VOLUME:
        audioManager.updateVolume(0.75, 20);
        player.sprite.width = DEFAULT_PLAYER_WIDTH * 1.5;
        player.sprite.height = DEFAULT_PLAYER_HEIGHT * 1.5;
        break;
    }
  }

  handleFluidExit(_, fluid) {
    audioManager.updateVolume(INITIAL_VOLUME, 20);
    player.sprite.width = DEFAULT_PLAYER_WIDTH;
    player.sprite.height = DEFAULT_PLAYER_HEIGHT;
  }

  handleJukeboxEnter(_, jukebox) {
    jukebox.passed = true;
    audioManager.unloopCurrentSound();
  }
}