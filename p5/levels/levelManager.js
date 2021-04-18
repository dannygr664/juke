class LevelManager {
  constructor() {
    this.levels = [];
    let mainMenu = new MainMenu();
    let level1 = new Spaceship();
    let level2 = new LoFi();
    let level3 = new Ethereal();
    this.levels.push(mainMenu);
    this.levels.push(level1);
    this.levels.push(level2);
    this.levels.push(level3);
    this.currentLevel = 0;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  getCurrentLevelNumber() {
    return this.currentLevel;
  }

  changeLevel() {
    if (this.getCurrentLevel().genre === 'City') {
      audioManager.stopSounds();
    }
    this.currentLevel = (this.currentLevel + 1) % this.levels.length;
  }
}