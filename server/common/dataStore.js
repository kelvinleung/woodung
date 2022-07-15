class DataStore {
  constructor() {
    this.rooms = new Map();
    this.sessions = new Map();
  }

  // rooms

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
