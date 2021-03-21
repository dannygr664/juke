const NUMBER_OF_LEVELS = 2;

class LevelManager {
  constructor() {
    this.levels = [];
    let level1 = new Level1();
    let level2 = new Level2();
    this.levels.push(level1);
    this.levels.push(level2);
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