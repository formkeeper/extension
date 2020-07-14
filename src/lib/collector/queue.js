/*
  Simple async queue.
*/
class AsyncQueue {
  constructor() {
    this._group = [];
  }

  add(workFunc) {
    this._group.push(
      new Promise(workFunc)
    );
    return this;
  }

  async waitForGroup() {
    return await Promise.all(this._group);
  }
}

export default AsyncQueue;