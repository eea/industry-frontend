/**
 * Add your actions here.
 * @module actions
 * @example
 * import {
 *   searchContent,
 * } from './search/search';
 *
 * export {
 *   searchContent,
 * };
 */
import {
  SET_SECTION_TABS,
  GET_PARENT_FOLDER_DATA,
  GET_PAGE,
  GET_SPARQL_DATA,
  GET_CONTENT_TYPE,
} from '~/constants/ActionTypes';

export function setSectionTabs(payload) {
  return {
    type: SET_SECTION_TABS,
    payload: payload,
  };
}

export function getParentFolderData(url) {
  return {
    type: GET_PARENT_FOLDER_DATA,
    request: {
      op: 'get',
      path: `/${url}?fullobjects`,
    },
  };
}

export function getPage(url) {
  return {
    type: GET_PAGE,
    url,
    request: {
      op: 'get',
      path: `${url}?fullobjects`,
    },
  };
}

export function getSparqlData(path) {
  return {
    type: GET_SPARQL_DATA,
    path,
    request: {
      op: 'get',
      path: `${path}/@sparql-data`,
    },
  };
}

export function getContentType(type) {
  return {
    type: GET_CONTENT_TYPE,
    request: {
      op: 'get',
      path: `@types/${type}`,
    },
  };
}
