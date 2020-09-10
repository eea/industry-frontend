import { isArray, isObject } from 'lodash';

export const makeSchema = (props) => {
  return {
    title: props.schemaTitle || 'Title',
    fieldsets: [
      {
        id: 'default',
        title: 'Resources',
        fields: ['portalId'],
      },
      ...(props.schemaFieldsets || []),
    ],
    properties: {
      portalId: {
        title: 'Portal id',
        widget: 'text',
      },
    },
    required: [...(props.schemaRequired || [])],
  };
};
