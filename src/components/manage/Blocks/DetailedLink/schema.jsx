export const getSchema = (props) => {
  return {
    title: 'Detailed Link',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['outsideLink', 'page'],
      },
      {
        id: 'properties',
        title: 'Properties',
        fields: [
          'backButton',
          'hideTitle',
          'hideDescription',
          'title',
          'description',
          'buttonTitle',
        ],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: [
          'textAlign',
          'titleClassname',
          'descriptionClassname',
          'buttonClassname',
        ],
      },
    ],

    properties: {
      backButton: {
        title: 'Back button',
        type: 'boolean',
      },
      hideTitle: {
        title: 'Hide title',
        type: 'boolean',
      },
      hideDescription: {
        title: 'Hide description',
        type: 'boolean',
      },
      outsideLink: {
        title: 'Outside link',
        type: 'boolean',
      },
      page: {
        title: 'Page',
        widget: props.data.outsideLink ? 'text' : 'object_by_path',
      },
      title: {
        title: 'Title',
        widget: 'string',
      },
      description: {
        title: 'Description',
        widget: 'textarea',
      },
      buttonTitle: {
        title: 'Button title',
        widget: 'string',
      },
      textAlign: {
        title: 'Text align',
        factory: 'Choice',
        type: 'string',
        choices: [
          ['left', 'Left'],
          ['center', 'Center'],
          ['right', 'Right'],
        ],
      },
      titleClassname: {
        title: 'Title class',
        widget: 'string',
      },
      descriptionClassname: {
        title: 'Description class',
        widget: 'string',
      },
      buttonClassname: {
        title: 'Button class',
        widget: 'string',
      },
    },

    required: ['display', 'cards'],
  };
};

export default getSchema;
