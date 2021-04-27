import RegulatoryBATConclusions from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      regulatory_bat_conclusions: {
        view: RegulatoryBATConclusions,
        title: 'Regulatory BAT conclusions',
        getSchema: getSchema,
      },
    },
  };
  return config;
};
