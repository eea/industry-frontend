import { tableauVersions, getLatestTableauVersion } from 'tableau-api-js';

const urlParametersSchema = {
  title: 'Parameter',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['field', 'urlParam'],
    },
  ],
  properties: {
    field: {
      title: 'Tableau fieldname',
      type: 'text',
    },
    urlParam: {
      title: 'URL param',
      type: 'text',
    },
  },
  required: [],
};

const breakpointUrlSchema = (config) => {
  const breakpoints = config.blocks.blocksConfig.tableau_block.breakpoints;

  return {
    title: 'URL',
    fieldsets: [{ id: 'default', title: 'Default', fields: ['device', 'url'] }],
    properties: {
      device: {
        title: 'Device',
        type: 'array',
        choices: Object.keys(breakpoints).map((breakpoint) => [
          breakpoint,
          breakpoint,
        ]),
      },
      url: {
        title: 'Url',
        widget: 'textarea',
      },
    },
    required: [],
  };
};

export default (config, provider_keys = []) => ({
  title: 'Tableau',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['version', 'url', 'title', 'description'],
    },
    {
      id: 'data_connector',
      title: 'Data connector options',
      fields: ['provider_url', 'allowedParams', 'disabledKey'],
    },
    {
      id: 'options',
      title: 'Options',
      fields: ['sheetname', 'hideTabs', 'hideToolbar', 'toolbarPosition'],
    },
    {
      id: 'extra_options',
      title: 'Extra options',
      fields: ['urlParameters', 'breakpointUrls'],
    },
  ],
  properties: {
    version: {
      title: 'Version',
      type: 'array',
      choices: [
        ...tableauVersions.map((version) => [version, `tableau-${version}`]),
      ],
      default: config.settings.tableauVersion || getLatestTableauVersion(),
    },
    url: {
      title: 'Url',
      widget: 'textarea',
    },
    provider_url: {
      title: 'Data provider',
      widget: 'object_by_path',
    },
    allowedParams: {
      title: 'Allowed params',
      type: 'array',
      items: {
        choices: [],
      },
    },
    disabledKey: {
      title: 'Disabled',
      type: 'array',
      choices: [...provider_keys.map((key) => [key, key])],
    },
    title: {
      title: 'Title',
      widget: 'textarea',
    },
    description: {
      title: 'Description',
      widget: 'textarea',
    },
    sheetname: {
      title: 'Sheetname',
      type: 'text',
    },
    hideTabs: {
      title: 'Hide tabs',
      type: 'boolean',
      default: false,
    },
    hideToolbar: {
      title: 'Hide toolbar',
      type: 'boolean',
      default: false,
    },
    toolbarPosition: {
      title: 'Toolbar position',
      type: 'array',
      choices: [
        ['Top', 'Top'],
        ['Bottom', 'Bottom'],
      ],
      default: 'Top',
    },
    urlParameters: {
      title: 'URL parameters',
      widget: 'object_list',
      schema: urlParametersSchema,
      description: 'Set a list of url parameters to filter the tableau',
    },
    breakpointUrls: {
      title: 'Breakpoint urls',
      widget: 'object_list',
      schema: breakpointUrlSchema(config),
      description: 'Set different vizualization for specific breakpoint',
    },
  },
  required: ['version', 'url'],
});
