import IndustryTableView from './View';
import schema from './schema';

export default (config) => {
  config.blocks.blocksConfig.simpleDataConnectedTable = {
    ...config.blocks.blocksConfig.simpleDataConnectedTable,
    templates: {
      ...config.blocks.blocksConfig.simpleDataConnectedTable.templates,
      industry_data_table: {
        title: 'Industry data table',
        view: IndustryTableView,
        schema: schema,
      },
    },
  };
  return config;
};
