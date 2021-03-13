// Moire animation
let density = 8;

class Moire {
  constructor(x1, y1, x2, y2, width, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.width = width;
    this.color = color;
  }

  drawMoire() {
    let lineHeight = dist(this.x1, this.y1, this.x2, this.y2);
    let lineAngle = atan2(this.y2 - this.y1, this.x2 - this.x1);
    stroke(this.color);
    push();
    strokeWeight(1.5);
    translate(this.x1, this.y1);
    rotate(lineAngle);
    translate(0, -this.width / 2);
    for (var i = 0; i < this.width; i += density) {
      line(0, i, lineHeight, i);
    }
    pop();
  };
}