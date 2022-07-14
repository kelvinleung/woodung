class RoomStore {
  constructor() {
    this.rooms = new Map();
  }

  findTeacherId(rid) {
    return this.rooms.get(rid);
  }

  findRoomId(tid) {
    for (const [key, val] of this.rooms) {
      if (val === tid) {
        return key;
      }
    }
    return null;
  }

  saveRoom(rid, tid) {
    this.rooms.set(rid, tid);
  }
}

module.exports = RoomStore;
