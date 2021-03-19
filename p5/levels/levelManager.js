const NUMBER_OF_LEVELS = 1;

class LevelManager {
  constructor() {
    this.levels = [];
    let level1 = new Level1();
    this.levels.push(level1);
    this.currentLevel = 0;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }
}