/**
 * Add your helpers here.
 * @module helpers
 * @example
 * export { Api } from './Api/Api';
 */
import { settings } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
}

export function deepSearch({ inputArray = [], pattern, depth }) {
  const objFitCriteria = {
    first: index => index === 0,
    last: index => index === inputArray.length - 1,
  };
  const validate = {
    hasItems: arr => arr && arr.length > 0,
  };
  for (let index = 0; index < inputArray.length; index++) {
    if (depth <= 1 || !inputArray[index][pattern.propertyToValidate])
      return inputArray[index][pattern.propertyToReturn] || null;
    if (!objFitCriteria[pattern.criteria]?.(index)) continue;
    if (
      validate[pattern.validationType]?.(
        inputArray[index][pattern.propertyToValidate],
      )
    )
      return deepSearch({
        inputArray: inputArray[index][pattern.propertyToValidate],
        pattern,
        depth: depth - 1,
      });
  }

  return null;
}
