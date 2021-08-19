import SelectView from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      select: {
        view: SelectView,
        getSchema: getSchema,
        title: 'Select',
      },
    },
  };
  return config;
};
