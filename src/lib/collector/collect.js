import ID from "./id";
import AsyncQueue from "./queue";
import ChromeStorage from "./storage";
import { isEmptyObject } from "../utils/common";

const fieldSelector =
  `input:not([type='password']),
  textarea,
  [contenteditable],
  [spellcheck],
  [spellcheck='false']
  `;

/**
 * collect finds the field elements on the page and reconciliates them with the
 * old ones retrieved from the storage layer.
 *
 * Storage layer requires a get method
 *
 * @param {HTMLElement} [parent=window.document] - Parent element from which
 * collection will take place. Default: window.document
 * @param {InstanceType} [storage=ChromeStorage] - Storage layer to reconciliate
 * with collected fields. Default: ChromeStorage
 */
async function collect(parent, storage) {
  parent = parent || window.document;
  storage = storage || new ChromeStorage();

  let oldFields;
  try {
    oldFields = await storage.get();
  } catch(err) {
    throw err;
  }

  let results = {
    fields: {
      active: {},
      missing: [],
    },
    warns: [],
  };
  // Old fields pending to reconciliate
  let toReconciliate = {
    fields: {
      active: {},
      missing: [],
    },
    ...oldFields
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
      const oldField = toReconciliate.fields.active[fieldHash] || {};
      const newField = {
        // To be overwritten by oldField:
        snapshots: [],
        selector: id.getSelector(),
        ...oldField,
        // To overwrite oldField:
        el: $el,
      };

      // Remove active old item from merging list if any, keeping the
      // remaining missing ones which couldn't be found by hash
      // pending reconciliation.
      delete toReconciliate.fields.active[fieldHash];
      results.fields.active[fieldHash] = newField;
      resolve(true);
    });
  });
  await queue.waitForGroup();

  // At this point non-reconciliated old active items are fields whose DOM
  // element is missing (doesn't exist on the page anymore or changed attrs
  if (!isEmptyObject(toReconciliate.fields.active)) {
    results.fields.missing = toReconciliate.fields.missing.concat(
      Object.values(toReconciliate.fields.active)
    );
  }

  return results;
}

export default collect;