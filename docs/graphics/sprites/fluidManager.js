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

    fluidXInitial = width;
    this.fluidWidthMin = width / 1.5;
    this.fluidWidthMax = width;
    this.fluidHeightMin = height / 1.5;
    this.fluidHeightMax = height;
    this.fluidYMin = height / 2 - height / 8;
    this.fluidYMax = height / 2;
    this.fluidSpacingMin = width / 8;
    this.fluidSpacingMax = width;

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
      fluid.setDefaultCollider();
      this.fluids.add(fluid);
    }
  }

  manageFluids() {
    for (let i = 0; i < this.fluids.length; i++) {
      let fluid = this.fluids[i];
      if (fluid.position.x < -fluid.width / 2) {
        this.spawnFluid(fluid);
      }
      fluid.setSpeed(this.baseSpeed, 180);
    }
  }

  spawnFluid(fluid) {
    //fluid.shapeColor = random(this.fluidAnimationColors);
    this.currentAnimationColor = random(this.fluidAnimationColors);
    animationController.setFluidAnimationColor(fluid.animation, this.currentAnimationColor);
    fluid.width = random(this.fluidWidthMin, this.fluidWidthMax);
    fluid.height = random(this.fluidHeightMin, this.fluidHeightMax);
    fluid.position.x = width + fluid.width / 2 + random(
      this.fluidSpacingMin,
      this.fluidSpacingMax
    );
    fluid.position.y = random(this.fluidYMin, this.fluidYMax);
  }

  drawFluids() {
    for (let i = 0; i < this.fluids.length; i++) {
      drawSprite(this.fluids[i]);
      animationController.drawFluidAnimation(
        this.fluids[i].position.x - this.fluids[i].width / 2,
        this.fluids[i].position.x + this.fluids[i].width / 2,
        this.currentAnimationColor
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

  handlePausing() {
    for (let i = 0; i < this.fluids.length; i++) {
      animationController.setFluidAnimationColor(this.fluids[i].animation, ColorScheme.BLACK_INACTIVE);
      this.fluids[i].setSpeed(0, 180);
    }
  }

  handleUnpausing() {
    for (let i = 0; i < this.fluids.length; i++) {
      this.fluids[i].setSpeed(this.baseSpeed, 180);
      animationController.setFluidAnimationColor(this.fluids[i].animation, this.currentAnimationColor);
    }
  }

  changeLevel() {
    this.fluidAnimationColors = levelManager.getCurrentLevel().fluidAnimationColors;
    this.currentAnimationColor = random(this.fluidAnimationColors);
    for (let i = 0; i < this.fluids.length; i++) {
      let fluid = this.fluids[i];
      if (fluid.position.x < width + fluid.width / 2) {
        this.spawnFluid(fluid);
      }
      fluid.setSpeed(this.baseSpeed, 180);
    }
  }
}