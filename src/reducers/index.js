import { ActionTypes } from "../actions";

export const initialState = {
  fields: {
    active: {},
    missing: [],
  },
  isCollected: false,
};

function rootReducer(state, action) {
  switch (action.type) {
  case ActionTypes.COLLECT_FIELDS_SUCCESS:
    const { fields } = action.results;
    return {
      fields,
      isCollected: true,
    };
  default:
  }
  return initialState;
}

export default rootReducer;