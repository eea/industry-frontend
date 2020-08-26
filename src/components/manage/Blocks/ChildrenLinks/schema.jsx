export const getSchema = (props) => {
  return {
    title: 'Detailed Link',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['page'],
      },
      {
        id: 'properties',
        title: 'Properties',
        fields: [],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: ['columns'],
      },
    ],

    properties: {
      page: {
        title: 'Page',
        widget: 'object_by_path',
      },
      columns: {
        title: 'Number of columns',
        widget: 'string',
      },
    },

    required: ['display', 'cards'],
  };
};

export default getSchema;
