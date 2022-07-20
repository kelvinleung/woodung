class DataStore {
  constructor() {
    this.rooms = new Map();
    this.sessions = new Map();
  }

  // rooms

  findRoom(rid) {
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

  isRoomValid(rid) {
    return this.rooms.has(rid);
  }

  saveRoom(rid, room) {
    this.rooms.set(rid, room);
  }

  // sessions

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  removeSession(id) {
    this.sessions.delete(id);
  }
}

const store = new DataStore();

module.exports = store;
