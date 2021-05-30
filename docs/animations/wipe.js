// Wipe animation
class Wipe {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.width = this.x2 - this.x1;
    this.height = this.y2 - this.y1;
    this.color = color;
    this.gapIndex = 0;
    this.wipeX = 0;
    this.baseWipeSpeed = (this.width / audioManager.getDurationOfMeasure()) / frameRate();
  }

  draw() {
    fill(player.isReviving ? ColorScheme.BLACK_INACTIVE : this.color);

    this.baseWipeSpeed = (this.width / audioManager.getDurationOfMeasure()) / frameRate();

    this.width = this.x2 - this.x1;
    this.height = this.y2 - this.y1;
    rect(this.x1, this.y1, this.width, this.height);

    let numWipers = 1;
    switch (this.color) {
      case ColorScheme.LOFI_HIGHEST_SPEED:
        numWipers = 4;
        break;
      case ColorScheme.LOFI_HIGHER_SPEED:
        numWipers = 3;
        break;
      case ColorScheme.LOFI_LOWER_SPEED:
        numWipers = 2;
        break;
      case ColorScheme.LOFI_LOWEST_SPEED:
        numWipers = 1;
        break;
      default:
        numWipers = 1;
    }

    push();
    fill(backgroundColor);
    for (let i = 0; i < numWipers; i++) {
      rect(this.x1 + (i * this.width / numWipers + this.wipeX) % this.width, this.y1, 25, this.height);
    }

    pop();

    this.wipeX += this.baseWipeSpeed * audioManager.soundSpeed;
    this.wipeX %= (this.x2 - this.x1 + 25);

    fill(0);
  }
}