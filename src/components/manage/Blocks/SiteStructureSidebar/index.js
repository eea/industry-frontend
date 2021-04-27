import SiteStructureSidebar from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      site_structure_sidebar: {
        view: SiteStructureSidebar,
        title: 'Site structure sidebar',
        getSchema: getSchema,
      },
    },
  };
  return config;
};
