import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import View from './View';

import RenderFields from '~/components/manage/Widgets/RenderFields';

const schema = {
  title: {
    title: 'Title',
    type: 'text',
  },
  description: {
    title: 'Description',
    type: 'text',
  },
  placeholder: {
    title: 'Placeholder',
    type: 'text',
  },
  searchButton: {
    title: 'Search button',
    type: 'boolean',
  },
  buttonText: {
    title: 'Button text',
    type: 'text',
    requires: 'searchButton',
  },
  className: {
    title: 'Class name',
    type: 'text',
  },
  buttonClassName: {
    title: 'Button class name',
    type: 'text',
    requires: 'searchButton',
  },
  query: {
    title: 'Query parameters',
    type: 'schema',
    fieldSetTitle: 'Query metadata',
    fieldSetId: 'query-metadata',
    fieldSetSchema: {
      fieldsets: [
        {
          id: 'default',
          title: 'title',
          fields: ['title', 'id', 'value'],
        },
      ],
      properties: {
        title: {
          type: 'string',
          title: 'Query title',
        },
        id: {
          type: 'string',
          title: 'Query id',
          description: 'This will be used as query parameter key',
        },
        value: {
          type: 'array',
          title: 'Values',
        },
      },
      required: ['id', 'title', 'value'],
    },
    editFieldset: false,
    deleteFieldset: false,
  },
};

const Edit = (props) => {
  if (__SERVER__) {
    return <div />;
  }
  return (
    <div>
      <RenderFields schema={schema} {...props} title="Search block" />
      <View {...props} />
    </div>
  );
};

export default compose(
  injectIntl,
  connect((state) => ({
    content: state.content.data,
  })),
)(Edit);
