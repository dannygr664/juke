const NUMBER_OF_JUKEBOXES = 1;

class JukeboxManager {
  constructor() {
    this.baseSpeed = 0;
    this.speed = 0;
    this.jukeboxAnimationColors = [
      ColorScheme.BLACK,
      ColorScheme.RED_SAT,
      ColorScheme.BLUE_SAT,
      ColorScheme.GREEN_SAT,
      ColorScheme.YELLOW_SAT,
    ];
    this.currentAnimationColor = ColorScheme.BLACK;

    this.jukeboxes = new Group();

    const JUKEBOX_WIDTH = 60;
    const JUKEBOX_HEIGHT = windowHeight;
    const JUKEBOX_X_INITIAL = windowWidth + JUKEBOX_WIDTH / 2
    const JUKEBOX_Y_INITIAL = windowHeight / 2;

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
      this.jukeboxes.add(jukebox);
    }

    this.didPlayerFall = false;
  }

  manageJukeboxes() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      let jukebox = this.jukeboxes[i];
      if (jukebox.position.x < -jukebox.width / 2) {
        this.spawnJukebox(jukebox);
      }
      if (audioManager.isSoundAlmostOver() && !this.didPlayerFall && this.baseSpeed === 0) {
        this.baseSpeed = this.calculateJukeboxSweepSpeed();
        jukebox.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
      }
    }
  }

  calculateJukeboxSweepSpeed() {
    let durationOfFourBeats = audioManager.getDurationOfFourBeats();
    return durationOfFourBeats * 1.5;
  }

  spawnJukebox(jukebox) {
    jukebox.position.x = windowWidth + jukebox.width / 2;
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
    animationController.setJukeboxAnimationColor(ColorScheme.BLACK_INACTIVE);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(0, 180);
      this.spawnJukebox(this.jukeboxes[i]);
    }
    this.didPlayerFall = true;
  }

  handleRevived() {
    animationController.setJukeboxAnimationColor(this.currentAnimationColor);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(this.baseSpeed, 180);
    }
  }
}