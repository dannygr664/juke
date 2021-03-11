const DEFAULT_BASE_SPEED = 0.5;
const NUMBER_OF_FLUIDS = 1;
const FLUID_WIDTH_MIN = 50;
const FLUID_WIDTH_MAX = 750;
const FLUID_HEIGHT_MIN = 40;
const FLUID_HEIGHT_MAX = 200;

let fluidColors;

let fluidXInitial;
let fluidYMin;
let fluidYMax;
let fluidSpacingMin;
let fluidSpacingMax;

class FluidManager {
  constructor() {
    this.baseSpeed = DEFAULT_BASE_SPEED;
    this.speed = 0;
    this.fluidColors = [
      color(0, 100, 100),
      color(100, 100, 100),
      color(200, 100, 100),
      color(255, 100, 100)
    ];
    this.fluids = new Group();
    this.fluidXInitial = windowWidth * 2;
    this.fluidYMin = windowHeight / 2 - windowHeight / 8;
    this.fluidYMax = windowHeight;
    this.fluidSpacingMin = windowWidth / 8;
    this.fluidSpacingMax = windowWidth;

    for (let i = 0; i < NUMBER_OF_FLUIDS; i++) {
      let fluid = createSprite(
        (i === 0)
          ? this.fluidXInitial
          : (fluids[i - 1].position.x + fluids[i - 1].width + random(
            this.fluidSpacingMin,
            this.fluidSpacingMax
          )
          ),
        random(this.fluidYMin, this.fluidYMax),
        random(FLUID_WIDTH_MIN, FLUID_WIDTH_MAX),
        random(FLUID_HEIGHT_MIN, FLUID_HEIGHT_MAX)
      );
      fluid.shapeColor = random(this.fluidColors);
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
      fluid.setSpeed(this.baseSpeed * songSpeed, 180);
    }
  }

  spawnFluid(fluid) {
    fluid.shapeColor = random(this.fluidColors);
    fluid.width = random(FLUID_WIDTH_MIN, FLUID_WIDTH_MAX);
    fluid.height = random(FLUID_HEIGHT_MIN, FLUID_HEIGHT_MAX);
    fluid.position.x = windowWidth + fluid.width / 2 + random(
      this.fluidSpacingMin,
      this.fluidSpacingMax
    );
    fluid.position.y = random(this.fluidYMin, this.fluidYMax);
  }

  drawFluids() {
    for (let i = 0; i < this.fluids.length; i++) {
      drawSprite(this.fluids[i]);
    }
  }
}