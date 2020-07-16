import React, { useState, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';
import DefaultEdit from '../DefaultEdit';
import View from './View';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { settings } from '~/config';

const schema = {
  provider_url: {
    title: 'Provider url',
    type: 'text',
    default: '',
  },
  sql_select: {
    type: 'sql',
  },
  data_query: {
    iTitle: 'Where column',
    vTitle: 'Is equal to',
    type: 'data-query',
  },
};

const Edit = props => {
  const [state] = useState({
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    schema.provider_url.default = settings.providerUrl;
  }, []);
  return (
    <div>
      <DefaultEdit schema={schema} {...props} title="Facility block" />
      <View {...props} id={state.id} />
    </div>
  );
};
export default compose(
  connect((state, props) => ({
    connected_data_parameters: state.connected_data_parameters,
    pathname: state.router.location.pathname,
  })),
)(Edit);
