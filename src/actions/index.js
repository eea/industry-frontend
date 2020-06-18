import {
  SET_SECTION_TABS,
  GET_PARENT_FOLDER_DATA,
  GET_PAGE,
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
