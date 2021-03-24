// Blinds animation
let tileCount = 10;
let actRandomSeed = 0;
let rectSize;
let ORIGAMI_SCALE_FACTOR = 200;

class Blinds {
  constructor() {
    rectSize = windowWidth / tileCount;
  }

  drawBlinds(rms) {
    fill(ColorScheme.BLACK_INACTIVE);
    randomSeed(actRandomSeed);

    for (let gridY = 0; gridY < tileCount; gridY++) {
      for (let gridX = 0; gridX < tileCount; gridX++) {

        let posX = windowWidth / tileCount * gridX;
        let posY = windowHeight / tileCount * gridY;

        let shiftX1 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftY1 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftX2 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftY2 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftX3 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftY3 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftX4 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);
        let shiftY4 = rms * ORIGAMI_SCALE_FACTOR * random(-1, 1);

        push();
        translate(posX, posY);
        beginShape();
        vertex(shiftX1, shiftY1);
        vertex(rectSize + shiftX2, shiftY2);
        vertex(rectSize + shiftX3, rectSize + shiftY3);
        vertex(shiftX4, rectSize + shiftY4);
        endShape();
        pop();
      }
    }

    fill(0);
  }
}