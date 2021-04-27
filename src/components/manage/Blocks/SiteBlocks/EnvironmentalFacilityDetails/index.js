import EnvironmentalFacilityDetails from './View';
import getSchema from './schema';

export default (config) => {
  config.blocks.blocksConfig.custom_connected_block = {
    ...config.blocks.blocksConfig.custom_connected_block,
    blocks: {
      ...config.blocks.blocksConfig.custom_connected_block.blocks,
      environmental_facility_details: {
        view: EnvironmentalFacilityDetails,
        title: 'Enivornmental facility details',
        getSchema: getSchema,
      },
    },
  };
  return config;
};
