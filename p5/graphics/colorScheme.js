const FILTER_ALPHA = 30;

class ColorScheme {
  static initializeColorScheme() {
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
    this.BLACK_FILTER = color(0, FILTER_ALPHA);
    this.BLACK_INACTIVE = color(0, 0, 70);
    this.BLACK_INACTIVE_FILTER = color(0, 0, 70, FILTER_ALPHA);
    this.WHITE = color(360);
    this.WHITE_FILTER = color(360, FILTER_ALPHA);
    this.CLEAR = color(360, 0);
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
        return this.BLACK_FILTER;
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