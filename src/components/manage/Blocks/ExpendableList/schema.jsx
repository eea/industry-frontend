const getListSchema = (props) => {
  return {
    title: 'List item',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'description'],
      },
    ],
    properties: {
      title: {
        title: 'Title',
        widget: 'text',
      },
      description: {
        title: 'Description',
        widget: 'textarea',
      },
    },
    required: [],
  };
};

export const makeSchema = (props) => {
  return {
    title: props.schemaTitle || 'Title',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [],
      },
      {
        id: 'list-items',
        title: 'List items',
        fields: ['items'],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: [
          'ordered',
          'isExpandable',
          'listClassname',
          'listItemTitleClassname',
          'listItemDescriptionClassname',
        ],
      },
    ],
    properties: {
      items: {
        title: 'List items',
        widget: 'object_list',
        schema: getListSchema(),
      },
      ordered: {
        title: 'Ordered',
        type: 'boolean',
      },
      isExpandable: {
        title: 'Is expandable',
        type: 'boolean',
      },
      listClassname: {
        title: 'List classname',
        type: 'text',
      },
      listItemTitleClassname: {
        title: 'Title class name',
        type: 'text',
      },
      listItemDescriptionClassname: {
        title: 'Description class name',
        type: 'text',
      },
    },
    required: [],
  };
};
