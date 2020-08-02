import { STORAGE_KEY } from "../../global/constants";

/**
 * Storage is a pseudo-interface because Javascript doesn't have
 * interfaces and we're not using typescript.
 *
 * Storage layers must extend this class. Thus, missing required methods
 * will throw an error
 *
 */
class Storage {
  constructor(location) {
    this._location = location;
    this.__name = this.constructor.name;
  }


  getKey() {
    return `${STORAGE_KEY}:${this._location}`;
  }

  /**
   * @async
   */
  async get() {
    throw new Error(
      `class ${this.__name} doesn't implement a "get()" method`
    );
  }

  /**
   * @async
   */
  async save() {
    throw new Error(
      `class ${this.__name} doesn't implement a "save()" method`
    );
  }
}

export default Storage;