import * as voltoConfig from '@plone/volto/config';

import {
  applyConfig as addonsConfig,
  installFolderListing,
  installTableau,
} from 'volto-addons/config';
import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';
import { applyConfig as blocksConfig } from 'volto-blocks/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';
// import { applyConfig as installEPRTRFrontend } from './localconfig';

// import { applyConfig as installEPRTRFrontend } from './localconfig';
import installEPRTR from './localconfig';

const config = [
  addonsConfig,
  installFolderListing,
  installTableau,
  plotlyConfig,
  // ckeditorConfig,
  mosaicConfig,
  blocksConfig,
  dataBlocksConfig,
  installEPRTR,
].reduce((acc, apply) => apply(acc), voltoConfig);

// config.settings.contentExpand=[breadcrumbs,actions,workflow]

export const settings = {
  ...config.settings,
  contentExpand: [
    ...config.settings.contentExpand,
    'navigation',
    '&expand.navigation.depth=5',
  ],
};

export const views = {
  ...config.views,
};

export const widgets = {
  ...config.widgets,
};

export const blocks = {
  ...config.blocks,
};

export const addonReducers = { ...config.addonReducers };
export const addonRoutes = [...(config.addonRoutes || [])];
export const viewlets = [...(config.viewlets || [])];

export const portlets = {
  ...config.portlets,
};

export const editForms = {
  ...config.editForms,
};

// console.log('config', config);
