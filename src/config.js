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
import { applyEditForms as mosaicEditForms } from 'volto-mosaic/config';
import {
  applyConfig as eprtrConfig,
  applyEditForms as eprtrEditForms,
} from './localconfig';

const addonConfig = [
  mosaicEditForms,
  eprtrEditForms,
  installTableau,
  installExpendableList,
  installFolderListing,
  eprtrConfig,
].reduce((acc, apply) => apply(acc), config);

export const settings = {
  ...addonConfig.settings,
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

export const addonReducers = { ...addonConfig.addonReducers };
export const addonRoutes = [...(addonConfig.addonRoutes || [])];

export const portlets = {
  ...addonConfig.portlets,
};

export const editForms = {
  ...addonConfig.editForms,
};
