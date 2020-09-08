import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-datablocks/Utils/RenderFields';
import View from './View';
import { settings } from '~/config';

const getSchema = (props) => {
  return {
    parent: {
      title: 'Parent page',
      widget: 'object_by_path',
    },
    className: {
      title: 'Classname',
      type: 'text',
    },
    preset: {
      type: 'array',
      title: 'Preset navigation',
      choices: [
        ['facilities', 'Facilities'],
        ['installations', 'Installations'],
        ['lcps', 'Lcps'],
      ],
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [state.item, props.data.components])
  return (
    <div>
      <RenderFields schema={state.schema} {...props} title="Navigation block" />
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
