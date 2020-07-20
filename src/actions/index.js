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

export function collectFields(fields, parent) {
  return function (dispatch) {
    collect(fields, parent).then(results => {
      dispatch(collectFieldSuccess(results));
    });
  };
}