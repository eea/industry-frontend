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
      selectQuery.table &&
      selectQuery.columnKey &&
      selectQuery.columnValue &&
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
            //  THIS IS JUST FOR TESTING
            items: [
              {
                siteName: ' "ASM BRESCIA" - BOSCO SELLA',
                Country: 'IT',
                RegulatedActivities:
                  'Landfills, as defined in Article 2(g) of Council Directive 1999/31/EC of 26 April 1999 on the landfill of waste, receiving more than 10 tonnes of waste per day or with a total capacity exceeding 25,000 tonnes, excluding landfills of inert waste',
                EntityStatus: 'disused',
                Seveso: null,
                OperatingSince_: null,
                BATAEL: null,
                StartDate: null,
                EndDate: null,
                'Derogated from - to': ' - ',
                PermitUpdated: null,
                PermitingAuthority: 'Provincia di Brescia',
                PermitAvailable: null,
                'Conclusion name': null,
                'Conclusion status': null,
                'BATAEL name': null,
                'BATAEL status': null,
                'BATAEL accepted date': null,
                Description: null,
              },
            ],
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
