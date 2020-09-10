import { isArray, isObject } from 'lodash';

import { makeChoices, makeObjectsKeysList } from './utils';

export const getResourcesSchema = (props) => ({
  title: 'Resource',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['package', 'queryParameter'],
    },
  ],
  properties: {
    package: {
      title: 'Package name',
      factory: 'Choice',
      type: 'string',
      choices: props.resourcesKeys ? makeChoices(props.resourcesKeys) : [],
    },
    queryParameter: {
      title: 'Query parameter',
      factory: 'Choice',
      type: 'string',
      choices: props.queriesKeys ? makeChoices(props.queriesKeys) : [],
    },
  },
  required: [],
});

export const getSubResourcesSchema = (props) => {
  return {
    title: 'Sub-resource',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['package'],
      },
    ],
    properties: {
      package: {
        title: 'Package name',
        factory: 'Choice',
        type: 'string',
        choices: props.list ? props.list : [],
      },
    },
    required: [],
  };
};

export const getQueryParametersSchema = (props) => {
  return {
    title: 'Query parameter',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['queryParameter'],
      },
    ],
    properties: {
      queryParameter: {
        title: 'Query parameter',
        type: 'string',
      },
    },
    required: [],
  };
};

export const getQueryParametersToSetSchema = (props) => {
  return {
    title: 'Query parameter',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['selectorOptionKey', 'queryParameterToSet'],
      },
    ],
    properties: {
      selectorOptionKey: {
        title: 'Selector option key',
        type: 'array',
        choices: [
          ['key', 'Key'],
          ['value', 'Value'],
          ['text', 'Text'],
        ],
      },
      queryParameterToSet: {
        title: 'Query parameter to set',
        type: 'string',
      },
    },
    required: ['selectorOptionKey', 'queryParameterToSet'],
  };
};

export const makeSchema = (props) => {
  const resourcesKeys = Object.keys({ ...props.discodata_resources.data });
  const queriesKeys = Object.keys({ ...props.discodata_query.search });
  const resources = {};
  props.data.resources &&
    props.data.resources.forEach((resource) => {
      resources[resource.package] = resource.queryParameter
        ? props.discodata_resources.data?.[resource.package]?.[
            props.discodata_query.search?.[resource.queryParameter]
          ] || null
        : props.discodata_resources.data?.[resource.package] || null;
    });

  const objectsKeys =
    Object.keys(resources).filter((key) => {
      return !isArray(resources[key]) && isObject(resources[key]);
    }) || [];
  const objectsKeysComputedList = makeObjectsKeysList(resources, objectsKeys);

  return {
    title: props.schemaTitle || 'Title',
    fieldsets: [
      {
        id: 'default',
        title: 'Resources',
        fields: ['resources', 'subResources'],
      },
      ...(props.schemaFieldsets || []),
    ],
    properties: {
      resources: {
        title: 'Resources',
        widget: 'object_list',
        schema: getResourcesSchema({ resourcesKeys, queriesKeys }),
      },
      subResources: {
        title: 'Sub-resources',
        widget: 'object_list',
        schema: getSubResourcesSchema({ list: objectsKeysComputedList }),
      },
      ...(props.schemaProperties || {}),
    },
    required: [...(props.schemaRequired || [])],
  };
};

export const makeTextSchema = (props) => {
  const schemaTitle = 'Text';
  const schemaFieldsets = [
    {
      id: 'additional',
      title: 'Additional',
      fields: ['queryParameters'],
    },
    {
      id: 'settings',
      title: 'Settings',
      fields: [
        'visible',
        'order',
        'leftText',
        'rightText',
        'color',
        'component',
      ],
    },
    {
      id: 'link',
      title: 'Link',
      fields: props.data.isLink
        ? ['isLink', 'internalLink', 'linkTarget', 'link', 'triggerOn']
        : ['isLink'],
    },
    {
      id: 'tooltip',
      title: 'Tooltip',
      fields: props.data.tooltip ? ['tooltip', 'tooltipText'] : ['tooltip'],
    },
  ];
  const schemaProperties = {
    queryParameters: {
      title: 'Query parameters',
      widget: 'query_param_list',
      schema: getQueryParametersSchema(props),
    },
    visible: {
      title: 'Visible',
      type: 'array',
      choices: [
        ['always', 'Always'],
        ['hasQuery', 'Has query'],
        ['hasDiscodata', 'hasDiscodata'],
      ],
    },
    order: {
      title: 'Text order',
      type: 'array',
      choices: [
        ['qd', 'Query - Discodata'],
        ['dq', 'Discodata - Query'],
      ],
    },
    leftText: {
      title: 'Left text',
      widget: 'textarea',
    },
    rightText: {
      title: 'Right text',
      widget: 'textarea',
    },
    color: {
      title: 'Color',
      widget: 'color_picker',
    },
    component: {
      title: 'Component type',
      type: 'array',
      choices: [
        ['h1', 'H1'],
        ['h2', 'H2'],
        ['h3', 'H3'],
        ['p', 'Paragraph'],
      ],
    },
    isLink: {
      title: 'Is link',
      type: 'boolean',
    },
    internalLink: {
      title: 'Internal link',
      type: 'boolean',
    },
    linkTarget: {
      title: 'Target',
      type: 'array',
      choices: [
        ['_self', 'Same window'],
        ['_blank', 'New window'],
      ],
    },
    link: {
      title: props.data.internalLink ? 'Page' : 'Link',
      widget: props.data.internalLink ? 'object_by_path' : 'text',
    },
    triggerOn: {
      title: 'Trigger on',
      type: 'array',
      choices: [
        ['_all', 'Entire text'],
        ['_query', 'Query param'],
        ['_discodata', 'Discodata'],
        ['_left', 'Left text'],
        ['_right', 'Right text'],
      ],
    },
    tooltip: {
      title: 'Has tooltip',
      type: 'boolean',
    },
    tooltipText: {
      title: 'Tooltip text',
      widget: 'text',
    },
  };
  const schemaRequired = [];
  return makeSchema({
    ...props,
    schemaTitle,
    schemaFieldsets,
    schemaProperties,
    schemaRequired,
  });
};

export const makeSelectSchema = (props) => {
  const discodataValues = props.discodataValues;
  const discodataKeys =
    discodataValues &&
    discodataValues[0] &&
    !isArray(discodataValues[0]) &&
    isObject(discodataValues[0])
      ? makeChoices(Object.keys(discodataValues[0]))
      : [];
  const schemaTitle = 'Text';
  const schemaFieldsets = [
    {
      id: 'settings',
      title: 'Settings',
      fields: [
        'key',
        'value',
        'text',
        'queryParametersToSet',
        'placeholder',
        'className',
      ],
    },
  ];
  const schemaProperties = {
    key: {
      title: 'Selector key',
      type: 'array',
      choices: discodataKeys || [],
    },
    value: {
      title: 'Selector value',
      type: 'array',
      choices: discodataKeys || [],
    },
    text: {
      title: 'Selector text',
      type: 'array',
      choices: discodataKeys || [],
    },
    queryParametersToSet: {
      title: 'Query parameters',
      widget: 'object_list',
      schema: getQueryParametersToSetSchema(props),
    },
    placeholder: {
      title: 'Placeholder',
      widget: 'text',
    },
    className: {
      title: 'Class name',
      widget: 'text',
    },
  };
  const schemaRequired = [];
  return makeSchema({
    ...props,
    schemaTitle,
    schemaFieldsets,
    schemaProperties,
    schemaRequired,
  });
};

export const makeCustomSchema = (props) => {
  const discodataValues = props.discodataValues;
  const discodataKeys =
    discodataValues &&
    discodataValues[0] &&
    !isArray(discodataValues[0]) &&
    isObject(discodataValues[0])
      ? makeChoices(Object.keys(discodataValues[0]))
      : [];
  const schemaTitle = 'Text';
  const schemaFieldsets = [
    {
      id: 'settings',
      title: 'Settings',
      fields: [
        'key',
        'value',
        'text',
        'queryParametersToSet',
        'placeholder',
        'className',
        'component',
      ],
    },
  ];
  const schemaProperties = {
    key: {
      title: 'Selector key',
      type: 'array',
      choices: discodataKeys || [],
    },
    value: {
      title: 'Selector value',
      type: 'array',
      choices: discodataKeys || [],
    },
    text: {
      title: 'Selector text',
      type: 'array',
      choices: discodataKeys || [],
    },
    queryParametersToSet: {
      title: 'Query parameters',
      widget: 'object_list',
      schema: getQueryParametersToSetSchema(props),
    },
    placeholder: {
      title: 'Placeholder',
      widget: 'text',
    },
    className: {
      title: 'Class name',
      widget: 'text',
    },
    component: {
      title: 'Component',
      type: 'array',
      choices: [
        ['eprtrReportingYears', 'EPRTR reporting years'],
        ['eprtrBatConclusions', 'EPRTR bat conclusions'],
      ],
    },
  };
  const schemaRequired = [];
  return makeSchema({
    ...props,
    schemaTitle,
    schemaFieldsets,
    schemaProperties,
    schemaRequired,
  });
};

export const makeListSchema = (props) => {
  const discodataValues = props.discodataValues;
  const discodataKeys =
    discodataValues &&
    discodataValues[0] &&
    !isArray(discodataValues[0]) &&
    isObject(discodataValues[0])
      ? makeChoices(Object.keys(discodataValues[0]))
      : [];
  const schemaTitle = 'Text';
  const schemaFieldsets = [
    {
      id: 'additional',
      title: 'Additional',
      fields: ['queryParameters'],
    },
    {
      id: 'settings',
      title: 'Settings',
      fields: [
        'key',
        'value',
        'text',
        'queryParametersToSet',
        'placeholder',
        'className',
      ],
    },
  ];
  const schemaProperties = {
    queryParameters: {
      title: 'Query parameters',
      widget: 'query_param_list',
      schema: getQueryParametersSchema(props),
    },
    key: {
      title: 'Selector key',
      type: 'array',
      choices: discodataKeys || [],
    },
    value: {
      title: 'Selector value',
      type: 'array',
      choices: discodataKeys || [],
    },
    text: {
      title: 'Selector text',
      type: 'array',
      choices: discodataKeys || [],
    },
    queryParametersToSet: {
      title: 'Query parameters',
      widget: 'object_list',
      schema: getQueryParametersToSetSchema(props),
    },
    placeholder: {
      title: 'Placeholder',
      widget: 'text',
    },
    className: {
      title: 'Class name',
      widget: 'text',
    },
  };
  const schemaRequired = [];
  return makeSchema({
    ...props,
    schemaTitle,
    schemaFieldsets,
    schemaProperties,
    schemaRequired,
  });
};
