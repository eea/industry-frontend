import EnvironmentalLCPDetails from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      environmental_lcp_details: {
        view: EnvironmentalLCPDetails,
        title: 'Environmental LCP details',
        getSchema: getSchema,
      },
    },
  };
  return config;
};
