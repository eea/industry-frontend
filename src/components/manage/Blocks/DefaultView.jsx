import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';

import { settings } from '~/config';
import DB from '~/components/manage/DataBase/DB';

const DefaultView = props => {
  const [state, setState] = useState({
    id: _uniqueId('block_'),
    loaded: false,
    loading: false,
    errors: [],
    items: [],
  });
  const { view, data } = props;
  const selectQuery = data?.sql?.selectQuery;
  const additionalQuery = data?.sql?.additionalQuery;
  const providerUrl = data?.providerUrl || settings.providerUrl || null;
  useEffect(() => {
    if (
      selectQuery?.table &&
      selectQuery?.columnKey &&
      selectQuery?.columnValue &&
      providerUrl &&
      !state.loading
    ) {
      setState({ ...state, loading: true });
      DB.table(providerUrl, selectQuery.table)
        .get()
        .where(selectQuery.columnKey, selectQuery.columnValue)
        .where(additionalQuery.columnKey, additionalQuery.columnValue)
        .makeRequest()
        .then(response => {
          setState({
            ...state,
            loaded: true,
            loading: false,
            errors: [],
            items: response.results,
          });
        })
        .catch(errors => {
          setState({
            loaded: false,
            loading: false,
            errors: errors,
            items: [],
          });
        });
    }
    /* eslint-disable-next-line */
  }, [data?.sql, data?.provider_url])

  useEffect(() => {
    props.onChange && props.onChange(state);
    /* eslint-disable-next-line */
  }, [state]);

  return view;
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(DefaultView);
