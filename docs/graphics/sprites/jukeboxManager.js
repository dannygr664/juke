const NUMBER_OF_JUKEBOXES = 1;

class JukeboxManager {
  constructor() {
    this.baseSpeed = 0;
    this.speed = 0;
    this.jukeboxAnimationColors = levelManager.getCurrentLevel().jukeboxAnimationColors;
    this.currentAnimationColor = levelManager.getCurrentLevel().defaultJukeboxAnimationColor;

    this.jukeboxes = new Group();

    const JUKEBOX_WIDTH = 60;
    const JUKEBOX_HEIGHT = height;
    const JUKEBOX_X_INITIAL = width + JUKEBOX_WIDTH / 2
    const JUKEBOX_Y_INITIAL = height / 2;

    animationController.createJukeboxAnimation(
      JUKEBOX_X_INITIAL,
      JUKEBOX_WIDTH
    )

    for (let i = 0; i < NUMBER_OF_JUKEBOXES; i++) {
      let jukebox = createSprite(
        JUKEBOX_X_INITIAL,
        JUKEBOX_Y_INITIAL,
        JUKEBOX_WIDTH,
        JUKEBOX_HEIGHT
      );
      jukebox.shapeColor = ColorScheme.CLEAR;
      jukebox.setSpeed(0, 180);
      jukebox.setDefaultCollider();
      jukebox.passed = false;
      this.jukeboxes.add(jukebox);
    }

    this.didPlayerFall = false;
  }

  manageJukeboxes() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      let jukebox = this.jukeboxes[i];
      animationController.handleJukeboxFadeout(jukebox);

      if (jukebox.position.x < -jukebox.width / 2 && !audioManager.isSoundAlmostOver()) {

        this.spawnJukebox(jukebox);
      }
      if (audioManager.isSoundAlmostOver() && !this.didPlayerFall && this.baseSpeed === 0) {
        if (audioManager.isFinalSound()) {
          animationController.setJukeboxAnimationColor(ColorScheme.ETHEREAL_GOLD);
        }
        this.baseSpeed = this.calculateJukeboxSweepSpeed();
        jukebox.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
      }
    }
  }

  calculateJukeboxSweepSpeed() {
    let durationOfOneMeasure = audioManager.getDurationOfMeasure();
    return width / durationOfOneMeasure / frameRate();
  }

  spawnJukebox(jukebox) {
    jukebox.position.x = width + jukebox.width / 2;
    jukebox.passed = false;
    animationController.resetJukeboxFadeTimer();
    this.currentAnimationColor = random(this.jukeboxAnimationColors);
    animationController.setJukeboxAnimationColor(this.currentAnimationColor);
    this.baseSpeed = 0;
    jukebox.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
  }

  drawJukeboxes() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      drawSprite(this.jukeboxes[i]);
      animationController.drawJukeboxAnimation(
        this.jukeboxes[i].position.x
      );
    }
  }

  handleFalling() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(0, 180);
      this.spawnJukebox(this.jukeboxes[i]);
    }
    this.didPlayerFall = true;
  }

  handleRevived() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(this.baseSpeed, 180);
    }
  }

  handlePausing() {
    animationController.setJukeboxAnimationColor(ColorScheme.BLACK_INACTIVE);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(0, 180);
    }
  }

  handleUnpausing() {
    animationController.setJukeboxAnimationColor(this.currentAnimationColor);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(this.baseSpeed, 180);
    }
  }

  changeLevel() {
    this.jukeboxAnimationColors = levelManager.getCurrentLevel().jukeboxAnimationColors;
    this.currentAnimationColor = levelManager.getCurrentLevel().defaultJukeboxAnimationColor;
    animationController.setJukeboxAnimationColor(this.currentAnimationColor);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      let jukebox = this.jukeboxes[i];
      this.spawnJukebox(jukebox);
    }
    this.didPlayerFall = false;
  }
}