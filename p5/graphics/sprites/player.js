const DEFAULT_BASE_PLAYER_SPEED = 4;
const DEFAULT_PLAYER_WIDTH = 40;
const DEFAULT_PLAYER_HEIGHT = 40;
const DEFAULT_JUMP_FORCE = 10;
const DEFAULT_GRAVITY_FORCE = 0.35;
const REVIVING_SPEED = 50;

class Player {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_PLAYER_SPEED;
    this.speed = 0;
    this.jumpForce = DEFAULT_JUMP_FORCE;
    this.jumpSpeed = 0;
    this.isReviving = false;
    this.gravityForce = DEFAULT_GRAVITY_FORCE;
    this.gravitySpeed = 0;

    const PLAYER_X_INITIAL = windowWidth / 2;
    const PLAYER_Y_INITIAL = windowHeight / 2 - windowHeight / 8;

    this.sprite = createSprite(
      PLAYER_X_INITIAL, PLAYER_Y_INITIAL, DEFAULT_PLAYER_WIDTH, DEFAULT_PLAYER_HEIGHT);
    this.sprite.shapeColor = ColorScheme.BLACK;
  }

  jump() {
    this.jumpSpeed = this.jumpForce;
    this.sprite.setSpeed(this.jumpSpeed, 270);
  }

  handleGravity() {
    this.gravitySpeed += this.gravityForce;
    this.sprite.addSpeed(this.gravitySpeed, 90);
  }

  handleFalling() {
    this.isReviving = true;
    this.gravitySpeed = 0;
    this.sprite.setSpeed(REVIVING_SPEED, 270);
  }
}