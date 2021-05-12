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
    this.oldColor = this.color;
    this.newColor = this.color;
    this.playerColorFadeTimer = 0;
    this.playerColorFadeTime = 0;
    this.inFluid = false;
    this.strokeColor = ColorScheme.CLEAR;
    this.energy = levelManager.getCurrentLevel().maxEnergy;
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
    this.energy = levelManager.getCurrentLevel().maxEnergy;
    this.sprite.setSpeed(REVIVING_SPEED, 270);
    this.sprite.shapeColor = ColorScheme.BLACK_INACTIVE;
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

  drawStroke() {
    push();
    if (this.isReviving) {
      stroke(ColorScheme.WHITE);
      strokeWeight(10);
    } else {
      stroke(this.strokeColor);
      strokeWeight(map(audioManager.reverbLevel, REVERB_MIN, REVERB_MAX, 4, 10));
    }

    fill(ColorScheme.CLEAR);
    rect(this.sprite.position.x - this.sprite.width / 2, this.sprite.position.y - this.sprite.height / 2, this.sprite.width, this.sprite.height);
    pop();
  }

  changeLevel() {
    this.resetPlayer();
  }

  drawEnergyMeter() {
    push();
    fill(ColorScheme.getComplementaryColor(this.color));
    rect(this.sprite.position.x - this.sprite.width / 2, this.sprite.position.y - this.sprite.height / 2, this.sprite.width, map(this.energy, 0, levelManager.getCurrentLevel().maxEnergy, this.sprite.height, 0));
    pop();
  }

  triggerUpdatePlayerColor(newColor, playerColorFadeTime) {
    if (playerColorFadeTime > 0) {
      this.newColor = newColor;
      this.playerColorFadeTime = playerColorFadeTime;
      this.playerColorFadeTimer = playerColorFadeTime;
    } else {
      this.sprite.shapeColor = newColor;
    }
  }

  updatePlayerColor() {
    if (this.playerColorFadeTimer > 0) {
      this.color = lerpColor(this.newColor, this.oldColor, map(this.playerColorFadeTimer, 0, this.playerColorFadeTime, 0, 1));
      this.sprite.shapeColor = this.color;
      this.playerColorFadeTimer--;
    } else if (this.newColor !== this.oldColor) {
      this.oldColor = this.newColor;
    }
  }

  updatePlayerStrokeColor(newColor) {
    this.strokeColor = newColor;
  }
}