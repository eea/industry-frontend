import * as voltoConfig from '@plone/volto/config';

import {
  applyConfig as addonsConfig,
  installFolderListing,
  // installCustomAddonGroup,
  installTableau,
} from 'volto-addons/config';
import { applyConfig as ckeditorConfig } from 'volto-ckeditor/config';
import { applyConfig as dataBlocksConfig } from 'volto-datablocks/config';
import { applyConfig as blocksConfig } from 'volto-blocks/config';
import { applyConfig as mosaicConfig } from 'volto-mosaic/config';
// import { applyConfig as plotlyConfig } from 'volto-plotlycharts/config';
// import { applyConfig as installEPRTRFrontend } from './localconfig';
import { applyConfig as installSidebar } from 'volto-sidebar/config';

const config = [
  // installCustomAddonGroup,
  addonsConfig,
  // installSidebar,
  // installFolderListing,
  // installTableau,
  // plotlyConfig,
  // ckeditorConfig,
  // mosaicConfig,
  // blocksConfig,
  // dataBlocksConfig,
  // installEPRTRFrontend,
].reduce((acc, apply) => apply(acc), voltoConfig);

// config.settings.contentExpand=[breadcrumbs,actions,workflow]

export const settings = {
  ...config.settings,
  contentExpand: [
    ...config.settings.contentExpand,
    'localnavigation',
    'siblings',
    '&expand.localnavigation.depth=2',
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
