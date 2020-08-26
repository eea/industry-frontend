/* REACT IMPORTS */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
/* ROOT IMPORTS */
import DiscodataView from './DiscodataView';
/* LOCAL IMPORTS */
import { getBasePath } from '~/helpers';
const RedirectView = (props) => {
  const history = useHistory();
  const currentPage = props.content['@id'];
  const redirectPage = props.content.relatedItems[0]?.['@id'];
  useEffect(() => {
    if (redirectPage) {
      const currentPath = getBasePath(currentPage);
      const redirectPath = getBasePath(redirectPage);
      if (currentPath !== redirectPath) {
        history.push(redirectPath);
      }
    }
    /* eslint-disable-next-line */
  }, [])
  return (
    <div id="discodata-mosaic-view">
      <DiscodataView {...props} />
    </div>
  );
};

export default connect((state, props) => ({
  content:
    state.prefetch?.[state.router.location.pathname] || state.content.data,
}))(RedirectView);
