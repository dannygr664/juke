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
let diameter = 1;
let posX;
let posY;
let counter = 0;

class Lines {
  constructor() {
    posX = windowWidth / 2;
    posY = windowHeight / 2;
  }

  drawLines(volumeDrawMode, rms) {
    noStroke();

    for (let i = 0; i <= map(rms, 0, 0.05, 0, windowWidth); i++) {
      counter++;

      // random number for the direction of the next step
      if (volumeDrawMode == 2) {
        direction = int(random(3));
      } else {
        direction = int(random(7));
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

      if (posX > windowWidth) posX = 0;
      if (posX < 0) posX = width;
      if (posY < 0) posY = height;
      if (posY > windowHeight) posY = 0;

      fill(0, 40);
      ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
    }
  }
}