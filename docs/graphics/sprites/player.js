const DEFAULT_BASE_PLAYER_SPEED = 4;
const DEFAULT_PLAYER_WIDTH = 40;
const DEFAULT_PLAYER_HEIGHT = 40;
const DEFAULT_JUMP_FORCE = 10;
const DEFAULT_GRAVITY_FORCE = 0.35;
const REVIVING_SPEED = 50;

class Player {
  constructor() {
    const PLAYER_X_INITIAL = width / 2;
    const PLAYER_Y_INITIAL = height / 2 - height / 8;

    this.sprite = createSprite(
      PLAYER_X_INITIAL, PLAYER_Y_INITIAL, DEFAULT_PLAYER_WIDTH, DEFAULT_PLAYER_HEIGHT);

    this.resetPlayer();
  }

  resetPlayer() {
    const PLAYER_X_INITIAL = width / 2;
    const PLAYER_Y_INITIAL = height / 2 - height / 8;

    this.baseSpeed = DEFAULT_BASE_PLAYER_SPEED;
    this.speed = 0;
    this.jumpForce = DEFAULT_JUMP_FORCE;
    this.jumpSpeed = 0;
    this.isReviving = false;
    this.gravityForce = DEFAULT_GRAVITY_FORCE;
    this.gravitySpeed = 0;
    this.color = levelManager.getCurrentLevel().playerColor;
    this.sprite.shapeColor = this.color
    this.sprite.position.x = PLAYER_X_INITIAL;
    this.sprite.position.y = PLAYER_Y_INITIAL;
    this.sprite.width = DEFAULT_PLAYER_WIDTH;
    this.sprite.height = DEFAULT_PLAYER_HEIGHT;
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

  handlePausing() {
    this.sprite.shapeColor = ColorScheme.BLACK_INACTIVE;
    this.sprite.setSpeed(0, 270);
    this.sprite.setSpeed(0, 90);
  }

  handleUnpausing() {
    this.sprite.shapeColor = this.color
    this.sprite.setSpeed(this.jumpSpeed, 270);
  }

  changeLevel() {
    this.resetPlayer();
  }

  updatePlayerColor(newColor) {
    this.color = newColor;
    this.sprite.shapeColor = this.color;
  }
}