const FILTER_ALPHA = 30;

class ColorScheme {
  static initializeColorScheme() {
    // Define colors
    this.RED = color(356, 78, 67);
    this.BLUE = color(213, 77, 49);
    this.GREEN = color(142, 55, 40);
    this.YELLOW = color(40, 67, 95);
    this.RED_SAT = color(356, 100, 67);
    this.BLUE_SAT = color(213, 100, 49);
    this.GREEN_SAT = color(142, 100, 40);
    this.YELLOW_SAT = color(40, 100, 95);
    this.RED_FILTER = color(356, 100, 67, FILTER_ALPHA);
    this.BLUE_FILTER = color(213, 100, 49, FILTER_ALPHA);
    this.GREEN_FILTER = color(142, 100, 40, FILTER_ALPHA);
    this.YELLOW_FILTER = color(40, 100, 95, FILTER_ALPHA);
    this.BLACK = color(0);
    this.BLACK_INACTIVE = color(0, 0, 70);
    this.BLACK_INACTIVE_FILTER = color(0, 0, 70, FILTER_ALPHA);
    this.WHITE = color(360);
    this.WHITE_FILTER = color(360, FILTER_ALPHA);
    this.CLEAR = color(360, 0);

    // Assign color schemes for each level
    this.SPACESHIP_LOWEST_VOLUME = this.GREEN;
    this.SPACESHIP_LOWER_VOLUME = this.BLUE;
    this.SPACESHIP_HIGHER_VOLUME = this.YELLOW;
    this.SPACESHIP_HIGHEST_VOLUME = this.RED;

    this.LOFI_LOWEST_SPEED = this.RED;
    this.LOFI_LOWER_SPEED = this.YELLOW;
    this.LOFI_HIGHER_SPEED = this.BLUE;
    this.LOFI_HIGHEST_SPEED = this.GREEN;

    this.ETHEREAL_LOWEST_REVERB = this.RED;
    this.ETHEREAL_LOWER_REVERB = this.YELLOW;
    this.ETHEREAL_HIGHER_REVERB = this.BLUE;
    this.ETHEREAL_HIGHEST_REVERB = this.GREEN;
  }

  static getFilterColor(color) {
    switch (color) {
      case this.RED:
      case this.RED_SAT:
        return this.RED_FILTER;
      case this.BLUE:
      case this.BLUE_SAT:
        return this.BLUE_FILTER;
      case this.GREEN:
      case this.GREEN_SAT:
        return this.GREEN_FILTER
      case this.YELLOW:
      case this.YELLOW_SAT:
        return this.YELLOW_FILTER;
      case this.BLACK:
        return this.CLEAR;
      case this.BLACK_INACTIVE:
        return this.BLACK_INACTIVE_FILTER;
      case this.WHITE:
        return this.WHITE_FILTER;
      case this.CLEAR:
        return this.CLEAR;
      default:
        return this.CLEAR;
    }
  }
}