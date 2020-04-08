import {
    SET_SECTION_TABS,
} from '~/constants/ActionTypes';


export function setSectionTabs(payload) {
    return {
      type: SET_SECTION_TABS,
      payload: payload,
    };
}