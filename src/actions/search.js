import { compact, concat, isArray, join, map, pickBy, toPairs } from 'lodash';

const QUICK_RESET_SEARCH_CONTENT = 'QUICK_RESET_SEARCH_CONTENT';
const QUICK_SEARCH_CONTENT = 'QUICK_SEARCH_CONTENT';

export function quickSearchContent(url, options, subrequest = null, filters) {
  let queryArray = [];
  const arrayOptions = pickBy(options, (item) => isArray(item));

  queryArray = concat(
    queryArray,
    options
      ? join(
          map(toPairs(pickBy(options, (item) => !isArray(item))), (item) => {
            if (item[0] === 'SearchableText') {
              // Adds the wildcard to the SearchableText param
              item[1] = `${item[1]}*`;
            } else if (!item[1]) return;
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
          map(pickBy(arrayOptions), (item, key) => {
            return join(
              item.map((value) => `${key}=${value}`),
              '&',
            );
          }),
          '&',
        )
      : '',
  );

  const querystring = join(compact(queryArray), '&');

  return {
    type: QUICK_SEARCH_CONTENT,
    subrequest,
    filters,
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
