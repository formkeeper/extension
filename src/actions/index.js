import collect from "../lib/collector";

export const ActionTypes = {
  COLLECT_FIELDS_SUCCESS: "COLLECT_FIELDS_SUCCESS",
};

export function collectFieldSuccess(results) {
  return {
    type: ActionTypes.COLLECT_FIELDS_SUCCESS,
    results,
  };
}

/**
 * collectFields triggers an async action.
 *
 * Instead of an action object collectFields will return a thunk to be invoked
 * by the dispatch function, as soon as results are available collectFields
 * will dispatch a collectFieldSuccess action.
 *
 * See collect for more info of how the collection process work.
 *
 * @async
 * @param {HTMLElement} parent
 */
export function collectFields(parent) {
  return function (dispatch) {
    collect(parent).then(results => {
      dispatch(collectFieldSuccess(results));
    });
  };
}