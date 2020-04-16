import {
    SET_SECTION_TABS,
    GET_PARENT_FOLDER_DATA,
    GET_NAV_ITEMS
} from '~/constants/ActionTypes';


export function setSectionTabs(payload) {
  return {
    type: SET_SECTION_TABS,
    payload: payload,
  };
}


export function getParentFolderData(url) {
  console.log('in action', url)
  return {
    type: GET_PARENT_FOLDER_DATA,
    request: {
      op: 'get',
      path: `/${url}?fullobjects`,
    },
  };
}
