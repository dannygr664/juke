class LevelManager {
  constructor() {
    this.levels = {};
    let mainMenu = new MainMenu();
    let spaceship = new Spaceship();
    let lofi = new LoFi();
    let ethereal = new Ethereal();
    this.levels[TITLE_GENRE] = mainMenu;
    this.levels['Spaceship'] = spaceship;
    this.levels['LoFi'] = lofi;
    this.levels['Ethereal'] = ethereal;
    this.currentLevel = TITLE_GENRE;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  // incrementLevel() {
  //   let nextLevel = (this.currentLevel + 1) % this.levels.length;
  //   this.changeLevel(nextLevel);
  // }

  changeLevel(genre) {
    //if (this.getCurrentLevel().genre === TITLE_GENRE) {
    audioManager.stopSounds();
    //}
    this.currentLevel = genre;
  }
}