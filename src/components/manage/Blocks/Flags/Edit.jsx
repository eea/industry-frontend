import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import View from './View';
import './style.css';

const Edit = (props) => {
  const [state, setState] = useState({
    id: _uniqueId('block_'),
  });
  return (
    <div>
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
