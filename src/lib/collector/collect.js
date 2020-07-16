import ID from "./id";
import AsyncQueue from "./queue";
import { isEmptyObject } from "../utils/common";

const fieldSelector = "input:not([type='password']),textarea,[contenteditable],[spellcheck],[spellcheck='false']";

async function collect(fields, parentElement) {
  const parent = parentElement || window.document;
  let results = {
    fields: {
      active: {},
      missing: [],
    },
    warns: [],
  }
  let toMerge = {
    fields: {
      active: {},
      missing: [],
    },
    fields: {
      ...fields,
    }
  }

  const $elems = parent.querySelectorAll(fieldSelector);

  const queue = new AsyncQueue();
  $elems.forEach(async ($el) => {
    // Each element results in a different async work, keep in mind this
    // when resolving/rejecting because it's in the context of a single
    // element and not the whole group.
    //
    // resolve(true): op. succeed for the current element
    // resolve(false): op. failed for the current element but continues
    // reject(): will throw an error and bubble up so it's expected to block
    // following results.
    queue.add(async (resolve, reject) => {
      const id = new ID(parent);
      try {
        await id.generate($el);
      } catch(err) {
        if (err.name === "IDInvalidSelector") {
          results.warns.push(err);
          console.warn(err);
          return resolve(false);
        }
        return reject(err);
      }

      if (!id.isUnique()) {
        // Ignore field if we couldn't create an unique selector.
        return resolve(false);
      }

      const fieldHash = id.get();
      const oldField = toMerge.fields.active[fieldHash] || {};
      const newField = {
        // To be overwritten by oldField:
        snapshots: [],
        selector: id.getSelector(),
        ...oldField,
         // To overwrite oldField:
        el: $el,
      }

      // Remove active old item from merging list if any, keeping the
      // remaining missing ones which couldn't be found by hash
      // pending toMerge.
      delete toMerge.fields.active[fieldHash];
      results.fields.active[fieldHash] = newField;
      resolve(true);
    });
  });
  await queue.waitForGroup();

  // At this point unmerged active items are fields whose DOM element
  // is missing (doesn't exist on the page anymore or changed attrs.)
  if (!isEmptyObject(toMerge.fields.active)) {
    results.fields.missing = toMerge.fields.missing.concat(
      Object.values(toMerge.fields.active)
    );
  }

  return results;
}

/**
 * @obsolete
 */
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

export default collect;