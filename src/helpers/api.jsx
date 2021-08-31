import config from '@plone/volto/registry';
import axios from 'axios';

export const parseResponse = (response) => {
  try {
    return JSON.parse(response.request.response);
  } catch {
    return {};
  }
};
