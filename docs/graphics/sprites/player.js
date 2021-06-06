const DEFAULT_BASE_PLAYER_SPEED = 8;
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
    this.sprite.setDefaultCollider();
    this.sprite.shapeColor = ColorScheme.CLEAR;

    this.resetPlayer();

    this.animation = animationController.createPlayerAnimation(
      this.sprite.position.x,
      this.sprite.position.y,
      this.sprite.width,
      this.sprite.height,
      this.color
    );
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
    this.oldColor = this.color;
    this.newColor = this.color;
    this.playerColorFadeTimer = 0;
    this.playerColorFadeTime = 0;
    this.inFluid = false;
    this.strokeColor = ColorScheme.CLEAR;
    this.energy = levelManager.getCurrentLevel().maxEnergy;
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
    this.energy = levelManager.getCurrentLevel().maxEnergy;
    this.sprite.setSpeed(REVIVING_SPEED, 270);
    animationController.setPlayerAnimationColor(this.animation, ColorScheme.BLACK_INACTIVE);
  }

  handleRevived() {
    this.isReviving = false;
    animationController.setPlayerAnimationColor(this.animation, this.color);
  }

  handlePausing() {
    animationController.setPlayerAnimationColor(this.animation, ColorScheme.BLACK_INACTIVE);
    this.sprite.setSpeed(0, 270);
    this.sprite.setSpeed(0, 90);
  }

  handleUnpausing() {
    animationController.setPlayerAnimationColor(this.animation, this.color);
    this.sprite.setSpeed(this.jumpSpeed, 270);
  }

  changeLevel() {
    this.resetPlayer();
  }

  drawPlayer() {
    drawSprite(this.sprite);
    animationController.drawPlayerAnimation(
      this.sprite.position.x,
      this.sprite.position.x + this.sprite.width,
      this.sprite.position.y,
      this.sprite.position.y + this.sprite.height,
      this.color
    );
  }

  triggerUpdatePlayerColor(newColor, playerColorFadeTime) {
    if (playerColorFadeTime > 0) {
      this.newColor = newColor;
      this.playerColorFadeTime = playerColorFadeTime;
      this.playerColorFadeTimer = playerColorFadeTime;
    } else {
      this.color = newColor;
    }
  }

  updatePlayerColor() {
    if (this.playerColorFadeTimer > 0) {
      this.color = lerpColor(this.newColor, this.oldColor, map(this.playerColorFadeTimer, 0, this.playerColorFadeTime, 0, 1));
      this.playerColorFadeTimer--;
    } else if (this.newColor !== this.oldColor) {
      this.oldColor = this.newColor;
    }
  }

  updatePlayerStrokeColor(newColor) {
    this.strokeColor = newColor;
  }
}