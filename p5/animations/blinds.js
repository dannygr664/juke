// Blinds animation
let tileCount = 10;
let actRandomSeed = 0;
let rectSize;
let ORIGAMI_SCALE_FACTOR = 200;

class Blinds {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
  }

  draw(rms) {
    push();
    fill(this.color);
    let rectSizeX = (this.x2 - this.x1) / tileCount;
    let rectSizeY = (this.y2 - this.y1) / tileCount;

    randomSeed(actRandomSeed);

    for (let gridY = 0; gridY < tileCount; gridY++) {
      for (let gridX = 0; gridX < tileCount; gridX++) {

        let posX = this.x1 + ((this.x2 - this.x1) / tileCount * gridX);
        let posY = (this.y2 - this.y1) / tileCount * gridY;

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
        vertex(rectSizeX + shiftX2, shiftY2);
        vertex(rectSizeX + shiftX3, rectSizeY + shiftY3);
        vertex(shiftX4, rectSizeY + shiftY4);
        endShape();
        pop();
      }
    }

    pop();
  }
}