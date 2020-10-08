import { SET_FLAGS } from '~/constants/ActionTypes';

const initialState = {
  items: {},
};

export default function pages(state = initialState, action = {}) {
  const items = { ...state.items };
  const packageKey = action.packageKey;
  const id = action.id;
  const flags = action.flags || {};
  switch (action.type) {
    case SET_FLAGS:
      if (!items[packageKey]) {
        items[packageKey] = {};
      }
      if (id) {
        if (!items[packageKey][id]) {
          items[packageKey][id] = {};
        }
        Object.keys(flags).forEach((flag) => {
          items[packageKey][id][flag] = flags[flag];
        });
      } else {
        items[packageKey] = {
          ...flags,
        };
      }
      return {
        ...state,
        items,
      };
    default:
      return state;
  }
}
