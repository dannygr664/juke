// Lines animation
let NORTH = 0;
let NORTHEAST = 1;
let EAST = 2;
let SOUTHEAST = 3;
let SOUTH = 4;
let SOUTHWEST = 5;
let WEST = 6;
let NORTHWEST = 7;
let direction;
let posX;
let posY;

class Lines {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    posX = this.x1;
    posY = this.y1;
  }

  drawLines1(rms) {
    push();
    let colorScaleFactor;
    switch (this.color) {
      case ColorScheme.SPACESHIP_HIGHEST_VOLUME:
        colorScaleFactor = 1;
        stroke(ColorScheme.SPACESHIP_LOWEST_VOLUME);
        break;
      case ColorScheme.SPACESHIP_HIGHER_VOLUME:
        colorScaleFactor = 0.6;
        stroke(ColorScheme.SPACESHIP_LOWER_VOLUME);
        break;
      case ColorScheme.SPACESHIP_LOWER_VOLUME:
        colorScaleFactor = 0.25;
        stroke(ColorScheme.SPACESHIP_HIGHER_VOLUME);
        break;
      case ColorScheme.SPACESHIP_LOWEST_VOLUME:
        colorScaleFactor = 0.1;
        stroke(ColorScheme.SPACESHIP_HIGHEST_VOLUME);
        break;
      default:
        colorScaleFactor = 1;
        stroke(ColorScheme.SPACESHIP_LOWEST_VOLUME);
    }

    this.draw(0, rms);
    pop();
  }

  drawLines2(rms) {
    push();
    this.draw(1, rms);
    pop();
  }

  draw(drawMode, rms) {
    push();
    noStroke();
    fill(hue(this.color), saturation(this.color), brightness(this.color), 40);
    rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    pop();
    if (rms > 0.005) {
      const stepSize = (drawMode === 0) ? 10 : 5;
      const diameter = (drawMode === 0) ? 10 : 5;

      for (let i = 0; i <= this.x2 - this.x1; i++) {
        // random number for the direction of the next step
        if (drawMode == 0) {
          direction = int(random([1, 3, 5]));
        } else if (drawMode === 1) {
          direction = int(random(map(rms, 0, 0.01, 1, 8)));
        }

        if (direction == NORTH) {
          posY -= stepSize;
        } else if (direction == NORTHEAST) {
          posX += stepSize;
          posY -= stepSize;
        } else if (direction == EAST) {
          posX += stepSize;
        } else if (direction == SOUTHEAST) {
          posX += stepSize;
          posY += stepSize;
        } else if (direction == SOUTH) {
          posY += stepSize;
        } else if (direction == SOUTHWEST) {
          posX -= stepSize;
          posY += stepSize;
        } else if (direction == WEST) {
          posX -= stepSize;
        } else if (direction == NORTHWEST) {
          posX -= stepSize;
          posY -= stepSize;
        }

        if (posX > this.x2 - diameter) posX = this.x1;
        if (posX < this.x1) posX = this.x2 - diameter;
        if (posY < this.y1) posY = this.y2;
        if (posY > this.y2) posY = this.y1;

        fill(hue(this.color), saturation(this.color), map(rms, 0, 0.05, 0, 100));
        ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
      }
    }
  }
}