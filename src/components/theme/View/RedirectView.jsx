/* REACT IMPORTS */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
/* ROOT IMPORTS */
import DiscodataView from './DiscodataView';
/* LOCAL IMPORTS */
import { getBasePath } from '~/helpers';
const RedirectView = (props) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentPage = props.content['@id'];
  const redirectPage = props.content.relatedItems?.[0]?.['@id'];
  useEffect(() => {
    setMounted(true);
    /* eslint-disable-next-line */
  }, [])
  if (mounted && !redirect && !props.navigation.loading) {
    if (redirectPage) {
      const currentPath = getBasePath(currentPage);
      const redirectPath = getBasePath(redirectPage);
      if (currentPath !== redirectPath) {
        history.push(redirectPath);
        setRedirect(true);
      }
    }
  }
  return (
    <div id="discodata-mosaic-view">
      <h1>Redirecting...</h1>
    </div>
  );
};

export default connect((state, props) => ({
  content:
    state.prefetch?.[state.router.location.pathname] || state.content.data,
  navigation: state.navigation,
}))(RedirectView);
