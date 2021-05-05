import qs from 'querystring';

export const getEncodedQueryString = (str) => {
  if (str) {
    return qs.stringify(
      { query: str },
      {
        arrayFormat: 'comma',
        encode: true,
      },
    );
  }
  return '';
};

export const getEncodedString = (str) => {
  if (str) {
    return qs
      .stringify(
        { str },
        {
          arrayFormat: 'comma',
          encode: true,
        },
      )
      .replace('str=', '');
  }
  return '';
};
