import { isArray, isObject } from 'lodash';

export const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

export const makeObjectsKeysList = (data, keys) => {
  let keysList = [];
  Object.entries(data).forEach(([dataKey, dataValue]) => {
    if (keys.includes(dataKey) && !isArray(dataValue) && isObject(dataValue)) {
      keysList = [
        ...keysList,
        ...makeChoices(
          Object.keys(dataValue).map((key) => `${dataKey}@${key}`),
        ),
      ];
    }
  });
  return keysList;
};
