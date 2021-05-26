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
let stepSize = 1;
let diameter = 5;
let posX;
let posY;

class Lines {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    posX = width / 2;
    posY = height / 2;
  }

  drawLines1(rms) {
    this.draw(0, rms);
  }

  drawLines2(rms) {
    this.draw(1, rms);
  }

  draw(drawMode, rms) {
    noStroke();

    for (let i = 0; i <= map(rms, 0, 0.05, 0, width); i++) {
      // random number for the direction of the next step
      if (drawMode == 0) {
        direction = int(random(3));
      } else if (drawMode === 1) {
        direction = int(random(map(rms, 0, 0.05, 3, 10)));
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

      if (posX > width) posX = 0;
      if (posX < 0) posX = width;
      if (posY < 0) posY = height;
      if (posY > height) posY = 0;

      fill(0, 40);
      ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
    }
  }
}