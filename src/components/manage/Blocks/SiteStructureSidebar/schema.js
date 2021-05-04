const getSchema = (props) => {
  return {
    title: 'Site structure sidebar',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['pathname', 'pages'],
      },
    ],

    properties: {
      pathname: {
        title: 'Parent pathname',
        widget: 'object_by_path',
      },
      pages: {
        title: 'Pages',
      },
    },

    required: [],
  };
};

export default getSchema;
