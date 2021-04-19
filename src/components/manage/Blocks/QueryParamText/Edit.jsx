import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-datablocks/Utils/RenderFields';
import View from './View';
import config from '@plone/volto/registry';
import './style.css';

const getSchema = (props) => {
  return {
    queryParam: {
      title: 'Query parameter',
      type: 'text',
    },
    visible: {
      title: 'Visible when',
      type: 'array',
      choices: [
        ['hasQuery', 'Query parameter exists'],
        ['always', 'Always'],
      ],
    },
    leftText: {
      title: 'Left text',
      widget: 'textarea',
    },
    rightText: {
      title: 'Right text',
      widget: 'textarea',
    },
    color: {
      title: 'Color',
      type: 'text',
    },
    component: {
      title: 'Component type',
      type: 'array',
      choices: [
        ['h1', 'H1'],
        ['h2', 'H2'],
        ['h3', 'H3'],
        ['p', 'Paragraph'],
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
        title="Query param text block"
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
