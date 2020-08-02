import ID from "./id";
import AsyncQueue from "./queue";
import ChromeStorage from "../storage/chrome";
import { isEmptyObject } from "../utils/common";

const fieldSelector =
  `input:not([type='password']),
  textarea,
  [contenteditable],
  [spellcheck],
  [spellcheck='false']
  `;

/**
 * retrieveAndCollect retrieves the old state from the storage layer, collect
 * all the field elements on the page and reconciliates them with the old state
 *
 * retrieveAndCollect is meant to be decoupled from react logic, so it doesn't
 * use action creators to mutate the data, instead it recreates the state to be
 * consumed by the action creators and reducers.
 *
 * @param {InstanceType} [storage=ChromeStorage] - Storage layer to be
 * reconciliated with new state. Default: ChromeStorage
 * @param {HTMLElement} [parent=window.document] - Parent element from which
 * collection will take place. Default: window.document
 */
async function retrieveAndCollect(storage, parent) {
  storage = storage || new ChromeStorage();
  parent = parent || window.document;

  let prevState;
  try {
    prevState = await storage.get();
  } catch(err) {
    throw err;
  }

  let results = {
    fields: {
      active: {},
      missing: [],
    },
    snapshots: [],
    warns: [],
  };
  // Old fields pending to reconciliate
  let toReconciliate = {
    fields: {
      active: {},
      missing: [],
    },
    snapshots: [],
    ...prevState,
  };

  const $elems = parent.querySelectorAll(fieldSelector);

  const queue = new AsyncQueue();
  $elems.forEach(async ($el) => {
    /*
      Each element results in a different async work, keep in mind this
      when resolving/rejecting because it's in the context of a single
      element and not the whole group.

      resolve(true): op. succeed for the current element
      resolve(false): op. failed for the current element but continues
      reject(): will throw an error and bubble up so it's expected to block
      following results.
    */
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
      const prevFieldState = toReconciliate.fields.active[fieldHash] || {};
      const newFieldState = {
        ...prevFieldState,
        selector: id.getSelector(),
        el: $el,
      };

      // Remove active old item from merging list if any, keeping the
      // remaining missing ones which couldn't be found by hash
      // pending reconciliation.
      delete toReconciliate.fields.active[fieldHash];
      results.fields.active[fieldHash] = newFieldState;
      resolve(true);
    });
  });
  await queue.waitForGroup();

  if (!isEmptyObject(toReconciliate.fields.active)) {
    results.fields.missing = [
      ...toReconciliate.fields.missing,
      // At this point non-reconciliated old active items are fields whose DOM
      // element is missing (doesn't exist on the page anymore or changed attrs)
      ...Object.entries(toReconciliate.fields.active).map(keyValuePair =>
        ({
          "hash": keyValuePair[0],
          ...keyValuePair[1]
        })
      )
    ];
  }

  // No op. is needed to reconciliate snapshots, we just retrieve them
  results.snapshots = toReconciliate.snapshots;
  return results;
}

export default retrieveAndCollect;