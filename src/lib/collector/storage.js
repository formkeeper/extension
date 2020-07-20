/* global chrome */

import { STORAGE_KEY } from "../../global/constants";

/**
 * CollectorStorage is a pseudo-interface because Javascript doesn't have
 * interfaces and we're not using typescript.
 *
 * Storage layers must extend this class. Thus, missing required methods
 * will throw an error
 * 
 */
export class CollectorStorage {
  /**
   * @async
   */
  async get() {
    const name = this.constructor.name;
    throw new Error(`class ${name} doesn't implement a "get()" method`);
  }
}

// TODO: contentScripts don't have access to chrome.storage. Need to
// send message to background.
class ChromeStorage extends CollectorStorage {
  get() {
    return new Promise(resolve => {
      chrome.storage.local.get([STORAGE_KEY], result => {
        const store = result[STORAGE_KEY];
        if (!store) {
          resolve(null);
        }
        resolve(store);
      });
    });
  }
}

export default ChromeStorage;