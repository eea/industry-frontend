import { GET_PAGE } from '~/constants/ActionTypes';

const initialState = {
  error: null,
  items: {},
  loaded: false,
  loading: false,
};

export default function pages(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_PAGE}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_PAGE}_SUCCESS`:
      const items = {
        ...state.items,
      };
      items[action.url] = action.result;
      return {
        ...state,
        error: null,
        items,
        loaded: true,
        loading: false,
      };
    case `${GET_PAGE}_FAIL`:
      return {
        ...state,
        error: action.error,
        items: {},
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
