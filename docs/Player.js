class Player {
  constructor(id, roomId, role) {
    this.id = id;
    this.roomId = roomId;
    this.role = role;
    this.isReady = false;
  }

  update(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }
}

module.exports = Player;