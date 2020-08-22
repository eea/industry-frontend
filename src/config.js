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
import * as voltoConfig from '@plone/volto/config';

import { settings as defaultSettings } from '@plone/volto/config';

// import {
//   installFolderListing,
//   installTableau,
//   installExpendableList,
// } from 'volto-addons/config';
// import { applyConfig as datablocksConfig } from 'volto-datablocks/config';
// import { applyConfig as gridlayoutConfig } from 'volto-gridlayout/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
// import { applyConfig as tabsviewConfig } from 'volto-tabsview/config';
import { applyConfig as eprtrConfig } from './localconfig';

const newConfig = [
  // datablocksConfig,
  // gridlayoutConfig,
  mosaicConfig,
  // tabsviewConfig,
  // installFolderListing,
  // installTableau,
  // installExpendableList,
  eprtrConfig,
].reduce((acc, apply) => apply(acc), voltoConfig);
const config = { ...voltoConfig };

export const settings = {
  ...defaultSettings,
  navDepth: 5,
  providerUrl: 'https://discodata.eea.europa.eu/sql',
};

export const views = {
  ...config.views,
  // layoutViews: {
  //   ...config.views.layoutViews,
  //   default_view: null,
  // },
};

export const widgets = {
  ...config.widgets,
};

export const blocks = {
  ...config.blocks,
};

export const addonRoutes = [...config.addonRoutes];
export const addonReducers = { ...config.addonReducers };
export const viewlets = [...(config.viewlets || [])];

export const portlets = {
  ...config.portlets,
};

export const editForms = {
  ...config.editForms,
  ...newConfig.editForms,
};

console.log(config, newConfig);
