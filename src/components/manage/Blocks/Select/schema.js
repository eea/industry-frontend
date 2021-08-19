const getQuerySchema = (data) => {
  const choices = Object.keys(data).map((key) => [key, key]);

  return {
    title: 'Query',
    fieldsets: [
      { id: 'default', title: 'Default', fields: ['param', 'paramToSet'] },
    ],
    properties: {
      param: {
        title: 'Param',
        type: 'array',
        choices,
      },
      paramToSet: {
        title: 'Param to set',
        widget: 'textarea',
      },
    },
    required: [],
  };
};

const getSchema = (props) => {
  const data = props.provider_data || {};
  const choices = Object.keys(data).map((key) => [key, key]);

  return {
    title: 'Select',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['url', 'value', 'text', 'placeholder', 'className'],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        fields: ['queries'],
      },
    ],

    properties: {
      url: {
        title: 'Url',
        widget: 'object_by_path',
      },
      value: {
        title: 'Value',
        type: 'array',
        choices,
      },
      text: {
        title: 'Text',
        type: 'array',
        choices,
      },
      placeholder: {
        title: 'Placeholder',
        widget: 'textarea',
      },
      className: {
        title: 'Class',
        widget: 'textarea',
      },
      queries: {
        title: 'Queries',
        widget: 'object_list',
        schema: getQuerySchema(data),
      },
    },

    required: [],
  };
};

export default getSchema;
