import { ActionTypes } from "../actions/types";

export const initialState = {
  fields: {
    active: {},
    missing: [],
  },
  snapshots: [],
  isCollected: false,
};

export const initialField = {
  selector: null,
  snapshots: [],
};

function activeFieldReducer(field = initialField, action) {
  switch (action.type) {
  case ActionTypes.CACHE_LINKED_FIELD_ELEMENT:
    return {
      ...field,
      el: action.element,
    };
  default:
  }
}

function fieldsReducer(fields, action) {
  switch (action.type) {
  case ActionTypes.CACHE_LINKED_FIELD_ELEMENT:
    return {
      ...fields,
      active: {
        ...fields.active,
        [action.fieldHash]: activeFieldReducer(
          fields.active[action.fieldHash], action
        ),
      }
    };
  default:
  }
}

function snapshotsReducer(snapshots, action) {
  switch (action.type) {
  case ActionTypes.ADD_SNAPSHOT:
    const lastContents =
      snapshots.length === 0
        ? {}
        : snapshots[snapshots.length-1].contents;
    return [
      ...snapshots,
      {
        time: { ts: action.ts },
        contents: {
          ...lastContents,
          ...action.entry,
        }
      }
    ];
  default:
  }
}

function rootReducer(state, action) {
  switch (action.type) {
  case ActionTypes.RETRIEVE_STATE_SUCCESS: {
    const { fields, snapshots } = action.results;
    return {
      ...state,
      fields,
      snapshots,
      isCollected: true,
    };
  }
  case ActionTypes.ADD_SNAPSHOT: {
    return {
      ...state,
      snapshots: snapshotsReducer(state.snapshots, action),
    };
  }
  case ActionTypes.ADD_SNAPSHOT_SUCCESS: {
    const { snapshots } = action.results;
    return {
      ...state,
      snapshots,
    };
  }
  case ActionTypes.CACHE_LINKED_FIELD_ELEMENT: {
    return {
      ...state,
      fields: fieldsReducer(state.fields, action)
    };
  }
  default: {}
  }
  return initialState;
}

export default rootReducer;
