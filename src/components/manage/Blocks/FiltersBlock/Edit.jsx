import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from '@eeacms/volto-datablocks/Utils/RenderFields';
import View from './View';
import { settings } from '~/config';

const getSchema = (props) => {
  return {
    modalButtonTitle: {
      type: 'text',
      title: 'Modal button title',
    },
    searchButtonTitle: {
      type: 'text',
      title: 'Search button title',
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props }),
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
  }, [props.data]);
  return (
    <div>
      <RenderFields schema={state.schema} {...props} title="Filters block" />
      <View {...props} id={state.id} />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    discodata_query: state.discodata_query,
  })),
)(Edit);
