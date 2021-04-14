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
    this.GOLD = color(36, 72, 63);
    this.ORANGE_LOW_SAT = color(17, 20, 87);
    this.ORANGE_MED_SAT = color(17, 40, 87);
    this.ORANGE_HIGH_SAT = color(17, 75, 87);
    this.ORANGE_FULL_SAT = color(17, 100, 87);
    this.ETHEREAL_INDIGO = color(229, 68, 16);
    this.ETHEREAL_SAPPHIRE = color(193, 23, 84);
    this.ETHEREAL_SILVER = color(253, 3, 68);
    this.ETHEREAL_GOLD = color(42, 66, 79);
    this.BLACK = color(0);
    this.BLACK_INACTIVE = color(0, 0, 70);
    this.BLACK_INACTIVE_FILTER = color(0, 0, 70, FILTER_ALPHA);
    this.GRAY = color(37, 7, 84);
    this.GREY = color(211, 5, 52);
    this.WHITE = color(360);
    this.WHITE_FILTER = color(360, FILTER_ALPHA);
    this.CLEAR = color(360, 0);

    // Assign color schemes for each level
    this.SPACESHIP_BACKGROUND_COLOR = this.GRAY;
    this.SPACESHIP_LOWEST_VOLUME = this.ORANGE_LOW_SAT;
    this.SPACESHIP_LOWER_VOLUME = this.ORANGE_MED_SAT;
    this.SPACESHIP_HIGHER_VOLUME = this.ORANGE_HIGH_SAT;
    this.SPACESHIP_HIGHEST_VOLUME = this.ORANGE_FULL_SAT;

    this.LOFI_LOWEST_SPEED = this.RED;
    this.LOFI_LOWER_SPEED = this.YELLOW;
    this.LOFI_HIGHER_SPEED = this.BLUE;
    this.LOFI_HIGHEST_SPEED = this.GREEN;

    this.ETHEREAL_BACKGROUND_COLOR = this.ETHEREAL_INDIGO;
    this.ETHEREAL_LOWEST_REVERB = this.ETHEREAL_SAPPHIRE;
    this.ETHEREAL_LOWER_REVERB = this.ETHEREAL_SILVER;
    this.ETHEREAL_HIGHER_REVERB = this.ETHEREAL_GOLD;
    this.ETHEREAL_HIGHEST_REVERB = this.WHITE;
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