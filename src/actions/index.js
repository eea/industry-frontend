import {
  SET_SECTION_TABS,
  GET_PARENT_FOLDER_DATA,
  GET_NAV_ITEMS,
  QUICK_RESET_SEARCH_CONTENT,
  QUICK_SEARCH_CONTENT,
} from '~/constants/ActionTypes';

import { compact, concat, isArray, join, map, pickBy, toPairs } from 'lodash';

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

export function quickSearchContent(url, options, subrequest = null) {
  let queryArray = [];
  const arrayOptions = pickBy(options, item => isArray(item));
  console.log(options, arrayOptions);

  queryArray = concat(
    queryArray,
    options
      ? join(
          map(toPairs(pickBy(options, item => !isArray(item))), item => {
            if (item[0] === 'SearchableText') {
              // Adds the wildcard to the SearchableText param
              item[1] = `${item[1]}*`;
            }
            return join(item, '=');
          }),
          '&',
        )
      : '',
  );

  queryArray = concat(
    queryArray,
    arrayOptions
      ? join(
          map(pickBy(arrayOptions), (item, key) =>
            join(item.map(value => `${key}:list=${value}`), '&'),
          ),
          '&',
        )
      : '',
  );

  const querystring = join(compact(queryArray), '&');

  return {
    type: QUICK_SEARCH_CONTENT,
    subrequest,
    request: {
      op: 'get',
      path: `${url}/@search${querystring ? `?${querystring}` : ''}`,
    },
  };
}

export function quickResetSearchContent(subrequest = null) {
  return {
    type: QUICK_RESET_SEARCH_CONTENT,
    subrequest,
  };
}
