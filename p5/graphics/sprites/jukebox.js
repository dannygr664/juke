const DEFAULT_BASE_JUKEBOX_SPEED = 0.5;

class Jukebox {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_JUKEBOX_SPEED;

    const JUKEBOX_X_INITIAL = windowWidth / 1.2;
    const JUKEBOX_Y_INITIAL = windowHeight / 2;
    const JUKEBOX_WIDTH = 40;
    const JUKEBOX_HEIGHT = windowHeight;

    this.sprite = createSprite(
      JUKEBOX_X_INITIAL, JUKEBOX_Y_INITIAL, JUKEBOX_WIDTH, JUKEBOX_HEIGHT);
    this.sprite.shapeColor = ColorScheme.CLEAR;
    this.sprite.setSpeed(this.baseSpeed, 180);
    animationController.createJukeboxAnimation(
      this.sprite.position.x,
      this.sprite.width
    )
  }

  drawJukebox() {
    drawSprite(this.sprite);
    animationController.drawJukeboxAnimation(
      this.sprite.position.x
    );
  }

  handleFalling() {
    animationController.setJukeboxAnimationColor(ColorScheme.BLACK_INACTIVE);
    this.sprite.setSpeed(0, 180);
  }

  handleRevived() {
    animationController.setJukeboxAnimationColor(ColorScheme.BLACK);
    this.sprite.setSpeed(this.baseSpeed, 180);
  }
}