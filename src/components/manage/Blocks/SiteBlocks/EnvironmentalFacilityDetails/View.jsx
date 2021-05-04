import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import CompetentAuthority from '../CompetentAuthority';
import { getDate } from '../helpers';
import qs from 'querystring';
import '../style.css';

const getAllIndexes = (arr, val) => {
  const indexes = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
};

const View = (props) => {
  const [facilities, setFacilities] = React.useState([]);
  const { provider_data = {} } = props;
  const query = { ...props.query, ...props.discodata_query.search };
  const siteReportingYear = parseInt(query.siteReportingYear || '');

  const competentAuthority = facilities
    .filter((facility) => facility.facilityOrganizationName)
    .map((facility) => ({
      organizationName: facility.facilityOrganizationName,
      contactPerson: facility.facilityContactPerson,
      address: facility.facilityAddress,
      email: facility.facilityContactMail,
      authLastUpdated: getDate(facility.authLastUpdated),
    }));

  React.useEffect(() => {
    const keys = Object.keys(provider_data || {});
    if (keys.length) {
      const indexes = getAllIndexes(
        provider_data?.euregReportingYear || [],
        siteReportingYear,
      );
      const newFacilities = [];
      indexes.forEach((index, i) => {
        newFacilities[i] = {};
        keys.forEach((key) => {
          newFacilities[i][key] = provider_data[key][index];
        });
      });
      setFacilities(newFacilities);
    }
  }, [provider_data, provider_data?.euregReportingYear, siteReportingYear]);

  return props.mode === 'edit' ? (
    <p>{props.blockTitle}</p>
  ) : (
    <div className="site-block">
      {facilities?.[0] ? (
        <>
          <h3 className="blue marginless">{facilities[0]?.facilityName}</h3>
          <p className="activity light-blue">Industrial activity</p>
          <p className="info">
            <span>
              {facilities[0]?.facilityIndustrialActivity}{' '}
              {facilities[0]?.facilityMainActivity}
            </span>
          </p>
        </>
      ) : (
        ''
      )}
      <CompetentAuthority competentAuthority={competentAuthority} />
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: qs.parse(state.router.location.search.replace('?', '')),
      discodata_query: state.discodata_query,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
