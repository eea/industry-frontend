import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from '@eeacms/volto-datablocks/Utils/RenderFields';
import View from './View';
import config from '@plone/volto/registry';

const getSchema = (props) => {
  return {
    queryParam: {
      title: 'Query parameter',
      type: 'text',
    },
    page: {
      title: 'Internal page',
      widget: 'object_by_path',
    },
    link: {
      title: 'Outside link',
      type: 'text',
    },
    linkTarget: {
      title: 'Link target',
      type: 'array',
      choices: [
        ['_blank', 'New window'],
        ['_self', 'Current window'],
      ],
    },
    use: {
      title: 'Use',
      type: 'array',
      choices: [
        ['page', 'Internal page'],
        ['link', 'Outside link'],
      ],
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
    className: {
      title: 'Class name',
      type: 'text',
    },
    inlineStyle: {
      title: 'Inline style',
      widget: 'textarea',
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
        title="Query param button block"
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
