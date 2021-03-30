// Boxes animation
let maxDistance;

class Boxes {
  constructor(x1, x2, y1, y2, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    maxDistance = this.x2 - this.x1;
  }

  draw(rms) {
    fill(player.isReviving ? ColorScheme.BLACK_INACTIVE : this.color, agentAlpha);

    for (let gridY = 0; gridY < (this.y2 - this.y1); gridY += 25) {
      for (let gridX = 0; gridX < (this.x2 - this.x1); gridX += 25) {
        let diameter = dist(
          map(rms, 0, 0.05, 0, (this.x2 - this.x1)),
          map(rms, 0, 0.05, 0, (this.y2 - this.y1)),
          gridX,
          gridY
        );
        diameter = diameter / maxDistance * 50;
        push();
        translate(this.x1 + gridX, gridY, diameter);
        rect(0, 0, diameter, diameter); // also nice: ellipse(...)
        pop();
      }
    }

    fill(0);
  }
}