import ID from "./id";
import AsyncQueue from "./queue";
import { isEmptyObject } from "../utils/common";

const fieldSelector = "input:not([type='password']),textarea,[contenteditable],[spellcheck],[spellcheck='false']";

class Collector {
  constructor(document) {
    this._document = document || window.document;
    this._elems = {};
    this._missing = [];
    this._toMerge = {
      elems: {},
      missing: []
    };
  }

  mergeWith(merging) {
    this._toMerge = {
      ...this._toMerge,
      ...merging,
    };
  }

  async collect() {
    this._find();

    const queue = new AsyncQueue();
    this._DOMElements.forEach(async (el) => {
      queue.add(async (resolve, reject) => {
        const id = new ID(this._document);

        try {
          await id.generate(el);
        } catch (err) {
          if (err.name === "IDInvalidSelector") {
            console.warn(err);
            return resolve(false);
          }
          return reject(err);
        }

        if (!id.isUnique()) {
          // Ignore field if we couldn't create an unique selector.
          return resolve(false);
        }

        const hash = id.get();
        const old = this._toMerge.elems[hash] || {};
        const merged = {
          // To be overwritten by old:
          snapshots: [],
          selector: id.getSelector(),

          ...old,

          // To overwrite old:
          el,
        }

        // Remove old item from merging list, if any
        delete this._toMerge.elems[hash];
        // this ops should dispatch actions to reducers
        this._elems[hash] = merged;
        resolve(true);
      });
    });

    await queue.waitForGroup();
    if (this.hasPendingElemMerges()) {
      // At this point unmerged elems are fields whose DOM element is missing
      this._missing = this._toMerge.missing.concat(
        Object.values(this._toMerge.elems)
      );
    }
    return this.getResults();
  }

  hasPendingElemMerges() {
    return !isEmptyObject(this._toMerge.elems);
  }

  getResults() {
    return {
      elems: this._elems,
      missing: this._missing
    }
  }

  _find() {
    this._DOMElements = this._document.querySelectorAll(fieldSelector);
  }
}

export default Collector;