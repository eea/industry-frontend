/**
 * Content reducer.
 * @module reducers/content/content
 */
import { GET_CONTENT_TYPE } from '~/constants/ActionTypes';

const initialState = {
  data: null,
  loading: false,
  loaded: false,
  error: null,
};

/**
 * Content reducer.
 * @function content
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function contentType(state = initialState, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${GET_CONTENT_TYPE}_PENDING`:
      return {
        ...state,
        data: null,
        loading: true,
        loaded: false,
        error: null,
      };
    case `${GET_CONTENT_TYPE}_SUCCESS`:
      const data = {
        ...result,
      };
      return {
        ...state,
        data,
        loading: false,
        loaded: true,
        error: null,
      };
    case `${GET_CONTENT_TYPE}_FAIL`:
      return {
        ...state,
        data: null,
        loading: false,
        loaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}
