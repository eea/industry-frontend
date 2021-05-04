const getSchema = (props) => {
  return {
    title: 'Site regulatory permits',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['entity'],
      },
    ],

    properties: {
      entity: {
        title: 'Entity',
        type: 'array',
        choices: [
          ['site', 'Site'],
          ['installation', 'Installation'],
        ],
      },
    },

    required: [],
  };
};

export default getSchema;
