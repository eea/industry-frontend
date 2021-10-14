import React, { Component } from 'react';
import BlockView from './BlockView';

class BlockEdit extends Component {
  render() {
    return <BlockView {...this.props} />;
  }
}

export default BlockEdit;
