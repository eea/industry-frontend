/**
 * Add your config changes here.
 * @module config
 * @example
 * export const settings = {
 *   ...defaultSettings,
 *   port: 4300,
 *   listBlockTypes: {
 *     ...defaultSettings.listBlockTypes,
 *     'my-list-item',
 *   }
 * }
 */

import * as config from '@plone/volto/config';

import {
  installTableau,
  installExpendableList,
  installFolderListing,
} from 'volto-addons';
import { installDiscodataBlocks } from 'volto-datablocks';
import { applyConfig as eprtrConfig } from './localconfig';

const consoleError = console.error.bind(console);
// eslint-disable-next-line
  console.error = (message, ...args) => {
  if (typeof message === 'string' && message.startsWith('[React Intl]')) {
    return;
  }
  consoleError(message, ...args);
};

const addonConfig = [
  installTableau,
  installExpendableList,
  installFolderListing,
  installDiscodataBlocks,
  eprtrConfig,
].reduce((acc, apply) => apply(acc), config);

export const settings = {
  ...config.settings,
  navDepth: 5,
  providerUrl: 'https://discodata.eea.europa.eu/sql',
  excludeFromNavigation: ['/industrial-site'],
};

export const views = {
  ...addonConfig.views,
};

export const widgets = {
  ...addonConfig.widgets,
};

export const blocks = {
  ...addonConfig.blocks,
};

export const addonReducers = { ...config.addonReducers };
export const addonRoutes = [...(config.addonRoutes || [])];

export const portlets = {
  ...addonConfig.portlets,
};

export const editForms = {
  ...addonConfig.portlets,
};
