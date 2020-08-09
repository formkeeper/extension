import retrieveAndCollect from "../lib/collector";
import { ActionTypes } from "./types";
import rootReducer, { initialState } from "../reducers";
import { getSnapshotsListID } from "../lib/snapshot/id";

export function retrieveStateSuccess(fields, snapshots) {
  return {
    type: ActionTypes.RETRIEVE_STATE_SUCCESS,
    results: {
      fields,
      snapshots,
    },
  };
}

export function cacheLinkedFieldElement(fieldHash, element) {
  return {
    type: ActionTypes.CACHE_LINKED_FIELD_ELEMENT,
    fieldHash,
    element,
  };
}

export function addSnapshot(fieldHash, content, ts) {
  return {
    ts,
    type: ActionTypes.ADD_SNAPSHOT,
    entry: {
      [fieldHash]: content,
    }
  };
}

export function addSnapshotSuccess(snapshots) {
  return {
    type: ActionTypes.ADD_SNAPSHOT_SUCCESS,
    results: {
      snapshots,
    },
  };
}

export function persistAndAddSnapshot(storage, fieldHash, content) {
  return dispatch => {
    storage.get().then(result => {
      const now = Date.now();
      const state = result || initialState;

      // Add the snapshot
      const newState = rootReducer(
        state, addSnapshot(fieldHash, content, now),
      );
      // Extract only the parts we want to be stored in the storage
      const { fields, snapshots } = newState;

      getSnapshotsListID(snapshots.current).then(hash => {
        snapshots.id = hash;
        storage.save({
          fields,
          snapshots,
        }).then(result => {
          if (!result) {
            throw new Error("addSnapshot: Error while trying to save snapshot");
          }
          dispatch(
            addSnapshotSuccess(snapshots)
          );
        });
      });

    });
  };
}

/**
 * retrieveAndCollectFields triggers an async action.
 *
 * Instead of an action object collectFields will return a thunk to be invoked
 * by the dispatch function, as soon as results are available collectFields
 * will dispatch a collectFieldSuccess action.
 *
 * See collect for more info of how the collection process work.
 *
 * @async
 * @param {ChromeStorage} storage
 * @param {HTMLElement} parent
 */
export function retrieveAndCollectState(storage, parent) {
  return function (dispatch) {
    retrieveAndCollect(storage, parent).then(results => {
      const { fields, snapshots } = results;
      const newState = {
        fields,
        snapshots
      };
      storage.save(newState).then(result => {
        if (!result) {
          throw new Error("addSnapshot: Error while trying to save snapshot");
        }
        dispatch(
          retrieveStateSuccess(fields, snapshots)
        );
      });
    });
  };
}