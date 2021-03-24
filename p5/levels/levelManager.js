const NUMBER_OF_LEVELS = 3;

class LevelManager {
  constructor() {
    this.levels = [];
    let level1 = new Spaceship();
    let level2 = new LoFi();
    let level3 = new Ethereal();
    this.levels.push(level1);
    this.levels.push(level2);
    this.levels.push(level3);
    this.currentLevel = 0;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  changeLevel() {
    audioManager.stopSounds();
    this.currentLevel = (this.currentLevel + 1) % NUMBER_OF_LEVELS;
  }
}