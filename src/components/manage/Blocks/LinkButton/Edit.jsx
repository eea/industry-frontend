import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from '@eeacms/volto-datablocks/Utils/RenderFields';
import View from './View';
import config from '@plone/volto/registry';

const getSchema = (props) => {
  return {
    component: {
      title: 'Title component type',
      type: 'array',
      choices: [
        ['h1', 'H1'],
        ['h2', 'H2'],
        ['h3', 'H3'],
        ['p', 'Paragraph'],
      ],
    },
    title: {
      title: 'Title',
      type: 'text',
    },
    description: {
      title: 'Description',
      type: 'text',
    },
    linkText: {
      title: 'Link text',
      type: 'text',
    },
    internalLink: {
      title: 'Internal link',
      widget: 'object_by_path',
    },
    outsideLink: {
      title: 'Outside link',
      type: 'text',
    },
    linkType: {
      title: 'Use',
      type: 'array',
      choices: [
        ['internalLink', 'Internal link'],
        ['outsideLink', 'Outside link'],
      ],
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: config.settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  return (
    <div>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Link button block"
        noValueKey={true}
      />
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
