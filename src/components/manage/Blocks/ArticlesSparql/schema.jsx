export const getSchema = (props) => {
  return {
    title: 'Detailed Link',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['page', 'preview', 'redirectPage'],
      },
    ],

    properties: {
      page: {
        title: 'Page',
        widget: 'object_by_path',
      },
      preview: {
        title: 'Preview',
        type: 'boolean',
      },
      redirectPage: {
        title: 'Redirect page',
        widget: 'object_by_path',
        description: 'Applies if preview is selected',
      },
    },

    required: ['page'],
  };
};

export default getSchema;
