import React from 'react';
import RenderFields from 'volto-addons/Widgets/RenderFields';
import { connect } from 'react-redux';
import { compose } from 'redux';

const DefaultEdit = props => {
  return (
    <div>
      <RenderFields schema={props.schema} {...props} title={props.title} />
    </div>
  );
};
export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(DefaultEdit);
