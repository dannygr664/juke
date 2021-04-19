// Moire animation
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
    //let lineAngle = atan2(this.y2 - this.y1, this.x2 - this.x1);
    push();
    rect(this.x1, 0, this.width * 0.8, lineHeight);
    stroke(this.color);
    strokeWeight(5);


    //translate(this.x1, this.y1);
    //rotate(lineAngle);
    //translate(0, -this.width / 2);

    for (var i = 0; i < this.width; i += this.width / 5) {
      line(this.x1 + i, 0, this.x1 + i, lineHeight);
    }
    pop();
  };
}