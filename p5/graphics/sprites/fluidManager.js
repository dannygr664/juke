const DEFAULT_BASE_FLUID_SPEED = 0.5;
const NUMBER_OF_FLUIDS = 1;

let fluidXInitial;

class FluidManager {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_FLUID_SPEED;
    this.speed = 0;
    this.fluidAnimationColors = levelManager.getCurrentLevel().fluidAnimationColors;
    this.currentAnimationColor = random(this.fluidAnimationColors);
    this.fluids = new Group();

    fluidXInitial = windowWidth;
    this.fluidWidthMin = windowWidth / 1.5;
    this.fluidWidthMax = windowWidth;
    this.fluidHeightMin = windowHeight / 1.5;
    this.fluidHeightMax = windowHeight;
    this.fluidYMin = windowHeight / 2 - windowHeight / 8;
    this.fluidYMax = windowHeight / 2;
    this.fluidSpacingMin = windowWidth / 8;
    this.fluidSpacingMax = windowWidth;

    for (let i = 0; i < NUMBER_OF_FLUIDS; i++) {
      let fluid = createSprite(
        (i === 0)
          ? fluidXInitial
          : (fluids[i - 1].position.x + fluids[i - 1].width + random(
            this.fluidSpacingMin,
            this.fluidSpacingMax
          )
          ),
        random(this.fluidYMin, this.fluidYMax),
        random(this.fluidWidthMin, this.fluidWidthMax),
        random(this.fluidHeightMin, this.fluidHeightMax)
      );

      fluid.animation = animationController.createFluidAnimation(
        fluid.position.x - fluid.width / 2,
        fluid.position.y - fluid.height / 2,
        fluid.width,
        fluid.height,
        this.currentAnimationColor
      );

      fluid.shapeColor = ColorScheme.CLEAR;
      fluid.setSpeed(this.baseSpeed, 180);
      this.fluids.add(fluid);
    }
  }

  manageFluids() {
    for (let i = 0; i < this.fluids.length; i++) {
      let fluid = this.fluids[i];
      if (fluid.position.x < -fluid.width / 2) {
        this.spawnFluid(fluid);
      }
      fluid.setSpeed(this.baseSpeed * audioManager.soundSpeed, 180);
    }
  }

  spawnFluid(fluid) {
    //fluid.shapeColor = random(this.fluidAnimationColors);
    this.currentAnimationColor = random(this.fluidAnimationColors);
    animationController.setFluidAnimationColor(fluid.animation, this.currentAnimationColor);
    fluid.width = random(this.fluidWidthMin, this.fluidWidthMax);
    fluid.height = random(this.fluidHeightMin, this.fluidHeightMax);
    fluid.position.x = windowWidth + fluid.width / 2 + random(
      this.fluidSpacingMin,
      this.fluidSpacingMax
    );
    fluid.position.y = random(this.fluidYMin, this.fluidYMax);
  }

  drawFluids() {
    for (let i = 0; i < this.fluids.length; i++) {
      drawSprite(this.fluids[i]);
      animationController.drawFluidAnimation(
        this.fluids[i].animation,
        this.fluids[i].position.x - this.fluids[i].width / 2
      );
    }
  }

  handleFalling() {
    for (let i = 0; i < this.fluids.length; i++) {
      animationController.setFluidAnimationColor(this.fluids[i].animation, ColorScheme.BLACK_INACTIVE);
      this.fluids[i].setSpeed(0, 180);
    }
  }

  handleRevived() {
    for (let i = 0; i < this.fluids.length; i++) {
      this.fluids[i].setSpeed(this.baseSpeed, 180);
      animationController.setFluidAnimationColor(this.fluids[i].animation, this.currentAnimationColor);
    }
  }
}