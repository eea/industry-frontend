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

export const createEvent = (type, detail) => {
  let newEvent;
  if (window.document.documentMode) {
    // IE support event
    newEvent = document.createEvent('CustomEvent');
    newEvent.initCustomEvent(type, false, false, { detail });
  } else {
    newEvent = new CustomEvent(type, { detail });
  }
  document.dispatchEvent(newEvent);
};
