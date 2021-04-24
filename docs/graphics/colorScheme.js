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
    this.GRAY = color(37, 7, 84);
    this.GREY = color(211, 5, 52);
    this.WHITE = color(360);
    this.CLEAR = color(360, 0);

    // Assign color schemes for each level
    this.SPACESHIP_BACKGROUND_COLOR = this.WHITE;
    this.SPACESHIP_LOWEST_VOLUME = this.BLACK;
    this.SPACESHIP_LOWER_VOLUME = color(hue(this.BLACK), 0, 25);
    this.SPACESHIP_HIGHER_VOLUME = color(hue(this.BLACK), 0, 75);
    this.SPACESHIP_HIGHEST_VOLUME = this.WHITE;

    this.LOFI_LOWEST_SPEED = this.RED;
    this.LOFI_LOWER_SPEED = this.YELLOW;
    this.LOFI_HIGHER_SPEED = this.BLUE;
    this.LOFI_HIGHEST_SPEED = this.GREEN;

    this.ETHEREAL_BACKGROUND_COLOR = this.WHITE;
    this.ETHEREAL_LOWEST_REVERB = this.ETHEREAL_SAPPHIRE;
    this.ETHEREAL_LOWER_REVERB = this.ETHEREAL_SILVER;
    this.ETHEREAL_HIGHER_REVERB = this.ETHEREAL_GOLD;
    this.ETHEREAL_HIGHEST_REVERB = this.WHITE;
  }

  static getComplementaryColor(c) {
    return color(
      (hue(c) + 180) % 360,
      saturation(c),
      brightness(c),
      alpha(c)
    );
  }
}