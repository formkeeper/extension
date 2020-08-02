/* global chrome */

import Storage from "./index";

class ChromeStorage extends Storage {
  get() {
    const key = this.getKey();
    return new Promise(resolve => {
      chrome.storage.local.get([key], result => {
        const store = result[key];
        if (!store) {
          resolve(null);
        }
        resolve(store);
      });
    });
  }

  save(newState) {
    const key = this.getKey();
    return new Promise(resolve => {
      chrome.storage.local.set({
        [key]: newState,
      }, () => {
        resolve(true);
      });
    });
  }
}

export default ChromeStorage;