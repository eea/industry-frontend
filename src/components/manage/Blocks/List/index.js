import ListView from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      list: {
        view: ListView,
        getSchema: getSchema,
        title: 'List',
      },
    },
  };
  return config;
};
