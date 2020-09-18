import { GET_SPARQL_DATA } from '~/constants/ActionTypes';

const initialState = {
  error: null,
  items: {},
  loaded: false,
  loading: false,
};

export default function pages(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_SPARQL_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_SPARQL_DATA}_SUCCESS`:
      const items = {
        ...state.items,
      };
      items[action.path] = action.result;
      return {
        ...state,
        error: null,
        items,
        loaded: true,
        loading: false,
      };
    case `${GET_SPARQL_DATA}_FAIL`:
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
