export const Tab = (props) => {
  return {
    title: 'Tab',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'parentTitle'],
      },
    ],

    properties: {
      title: {
        type: 'string',
        title: 'Title',
      },
      parentTitle: {
        factory: 'Choice',
        type: 'string',
        choices: [
          ['', 'No value'],
          ...(props.data.tabs?.map((tab) => [tab.title, tab.title]) || []),
        ],
        title: 'Parent',
      },
    },

    required: ['title'],
  };
};

export const Tabs = (props) => {
  return {
    title: 'Tabs',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['tabs', 'parent'],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: ['useNavigation', 'position', 'css_class'],
      },
    ],

    properties: {
      css_class: {
        title: 'CSS Class',
        default: 'default-tabsblock',
        widget: 'string',
      },
      tabs: {
        widget: 'object_list',
        title: 'Tabs',
        // this is an invention, should confront with dexterity serializer
        schema: Tab(props),
      },
      parent: {
        widget: 'object_by_path',
        title: 'Parent page',
      },
      useNavigation: {
        type: 'boolean',
        title: 'Use navigation',
      },
      position: {
        title: 'Position',
        description: 'Position of the tabs, content related',
        factory: 'Choice',
        type: 'string',
        choices: [
          ['top', 'Top'],
          ['bottom', 'Bottom'],
          ['left', 'Left'],
          ['right', 'Right'],
        ],
      },
    },

    required: ['display', 'cards'],
  };
};

export default Tabs;
