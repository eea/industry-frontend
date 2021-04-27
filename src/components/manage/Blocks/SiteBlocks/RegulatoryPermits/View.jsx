import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PermitingAuthority from '../PermitingAuthority';
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
  const [permits, setPermits] = React.useState([]);
  const { provider_data = {} } = props;
  const query = { ...props.query, ...props.discodata_query.search };
  const siteReportingYear = parseInt(query.siteReportingYear || '');

  React.useEffect(() => {
    const keys = Object.keys(provider_data || {});
    if (keys.length) {
      const indexes = getAllIndexes(
        provider_data?.EUregReportingYear || [],
        siteReportingYear,
      );
      const facilities = [
        ...new Set(provider_data?.facilityInspireId || []),
      ].sort();
      let newPermits = [];
      const counter = {};
      indexes.forEach((index, i) => {
        newPermits[i] = {};
        keys.forEach((key) => {
          newPermits[i][key] = provider_data[key][index];
        });
      });

      setPermits(
        newPermits
          .sort((a, b) =>
            a.installationInspireId > b.installationInspireId
              ? 1
              : b.installationInspireId > a.installationInspireId
              ? -1
              : 0,
          )
          .map((permit, index) => {
            const facility = permit.facilityInspireId;
            const installation = permit.installationInspireId;
            counter[installation] = (counter[installation] || 0) + 1;
            counter[facility] =
              counter[installation] < 2
                ? (counter[facility] || 0) + 1
                : counter[facility];

            return {
              ...permit,
              nth: `${facilities.indexOf(facility) + 1}.${counter[facility]}`,
            };
          }),
      );
    }
    /* eslint-disable-next-line */
  }, [provider_data, provider_data?.EUregReportingYear, siteReportingYear]);

  const permitingAuthority = permits.map((permit) => ({
    installationInspireId: permit.installationInspireId,
    operatingSince: getDate(permit.operatingSince_),
    permitUpdated: getDate(permit.permitUpdated),
    permitingAuthority: permit.permitingAuthority,
    permitAvailable: permit.permitAvailable,
    seveso: permit.seveso,
    entityStatus: permit.entityStatus,
    nth: permit.nth,
  }));

  return props.mode === 'edit' ? (
    <p>{props.blockTitle}</p>
  ) : (
    <div className="site-block">
      <PermitingAuthority
        permitingAuthority={permitingAuthority}
        entity={props.data.entity}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    query: qs.parse(state.router.location.search.replace('?', '')),
    discodata_query: state.discodata_query,
  })),
)(View);
