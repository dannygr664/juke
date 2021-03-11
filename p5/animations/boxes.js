// Boxes animation
let maxDistance;

class Boxes {
  constructor() {
    maxDistance = windowWidth;
  }

  drawBoxes(rms) {
    fill(player.isReviving ? ColorScheme.BLACK_INACTIVE : ColorScheme.BLACK, agentAlpha);

    for (let gridY = 0; gridY < windowHeight; gridY += 25) {
      for (let gridX = 0; gridX < windowWidth; gridX += 25) {
        let diameter = dist(
          map(rms, 0, 0.1, 0, windowWidth),
          map(rms, 0, 0.1, 0, windowHeight),
          gridX,
          gridY
        );
        diameter = diameter / maxDistance * 5;
        push();
        translate(gridX, gridY, diameter);
        rect(0, 0, diameter, diameter); // also nice: ellipse(...)
        pop();
      }
    }

    fill(0);
  }
}