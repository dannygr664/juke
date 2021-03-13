const DEFAULT_BASE_JUKEBOX_SPEED = 0.5;
const NUMBER_OF_JUKEBOXES = 1;

let jukeboxColors;

class JukeboxManager {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_JUKEBOX_SPEED;
    this.speed = 0;
    this.jukeboxColors = [
      ColorScheme.RED,
      ColorScheme.BLUE,
      ColorScheme.GREEN,
      ColorScheme.YELLOW,
    ];
    this.jukeboxes = new Group();

    const JUKEBOX_WIDTH = 40;
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
      jukebox.setSpeed(this.baseSpeed, 180);
      this.jukeboxes.add(jukebox);
    }
  }

  manageJukeboxes() {
    for (let i = 0; i < this.jukeboxes.length; i++) {
      let jukebox = this.jukeboxes[i];
      if (jukebox.position.x < -jukebox.width / 2) {
        this.spawnJukebox(jukebox);
      }
      jukebox.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
    }
  }

  spawnJukebox(jukebox) {
    jukebox.position.x = windowWidth + jukebox.width / 2;
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
    }
  }

  handleRevived() {
    animationController.setJukeboxAnimationColor(ColorScheme.BLACK);
    for (let i = 0; i < this.jukeboxes.length; i++) {
      this.jukeboxes[i].setSpeed(this.baseSpeed, 180);
    }
  }
}